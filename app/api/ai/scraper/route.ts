import { NextRequest, NextResponse } from "next/server"
import { generateText, tool, stepCountIs } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// Types for the request
interface ScraperRequest {
  prompt: string
  mode: "enrich" | "generate" // enrich = add columns to selected rows, generate = create new table data
  chatHistory?: {
    role: "user" | "assistant" | "system"
    content: string
  }[]
  selectedRows?: {
    rowIndex: number
    cells: { [colIndex: string]: string }
  }[]
  existingColumns?: string[] // Column headers/labels
  tableInfo: {
    tableId: string
    projectName: string
    numRows: number
    numCols: number
  }
}

interface ScrapedColumn {
  header: string
  values: { rowIndex: number; value: string }[]
}

// Response for generation mode - creates entire table structure
interface GeneratedTable {
  headers: string[]
  rows: string[][] // Each row is an array of cell values
}

// Web scraping tool - fetches and extracts data from URLs
const scrapeWebPage = tool({
  description: "Fetch and extract text content from a web page. Use this to scrape data from URLs found in the spreadsheet rows or to search for information about items in the rows.",
  inputSchema: z.object({
    url: z.string().describe("The URL to fetch and scrape"),
    extractionHint: z.string().optional().describe("What specific information to look for on the page"),
  }),
  execute: async ({ url, extractionHint }) => {
    try {
      // Validate URL
      new URL(url)
      
      // Fetch the page
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      if (!response.ok) {
        return { error: `Failed to fetch: HTTP ${response.status}`, content: null }
      }

      const html = await response.text()
      
      // Basic HTML to text extraction
      const textContent = extractTextFromHTML(html)
      
      // Limit content size
      const truncatedContent = textContent.slice(0, 8000)
      
      return {
        url,
        content: truncatedContent,
        extractionHint,
        success: true,
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to scrape page",
        content: null,
      }
    }
  },
})

// Search web tool - performs a web search and returns results
const searchWeb = tool({
  description: "Search the web for information. Use this when you need to find information about items in the spreadsheet that don't have URLs.",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
    context: z.string().optional().describe("Additional context about what kind of results are needed"),
  }),
  execute: async ({ query, context }) => {
    try {
      // Use DuckDuckGo HTML search (no API key required)
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
      
      const response = await fetch(searchUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        return { results: [], error: "Search failed" }
      }

      const html = await response.text()
      
      // Extract search results using regex (simple parsing)
      const results: { title: string; snippet: string; url: string }[] = []
      
      // Match result links and snippets
      const resultRegex = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([^<]*)/gi
      let match
      
      while ((match = resultRegex.exec(html)) !== null && results.length < 5) {
        results.push({
          url: match[1],
          title: match[2].trim(),
          snippet: match[3].trim(),
        })
      }

      // Fallback: try simpler extraction
      if (results.length === 0) {
        const linkRegex = /<a[^>]*href="(https?:\/\/[^"]+)"[^>]*>([^<]+)<\/a>/gi
        while ((match = linkRegex.exec(html)) !== null && results.length < 5) {
          if (!match[1].includes("duckduckgo.com")) {
            results.push({
              url: match[1],
              title: match[2].trim(),
              snippet: "",
            })
          }
        }
      }

      return { 
        query, 
        context,
        results,
        success: true,
      }
    } catch (error) {
      return {
        results: [],
        error: error instanceof Error ? error.message : "Search failed",
      }
    }
  },
})

// Extract info from row data tool
const extractFromRowData = tool({
  description: "Analyze the existing row data to understand what information is available and what patterns exist. Use this first to understand the spreadsheet context.",
  inputSchema: z.object({
    analysis: z.string().describe("What aspect of the row data to analyze"),
  }),
  execute: async ({ analysis }) => {
    // This is a placeholder - actual data is injected in the prompt
    return { analysis, note: "Row data is available in the system prompt context." }
  },
})

// Helper function to extract text from HTML
function extractTextFromHTML(html: string): string {
  // Remove script and style tags
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
  
  // Remove HTML tags but keep content
  text = text.replace(/<[^>]+>/g, " ")
  
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, " ")
  text = text.replace(/&amp;/g, "&")
  text = text.replace(/&lt;/g, "<")
  text = text.replace(/&gt;/g, ">")
  text = text.replace(/&quot;/g, '"')
  text = text.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num)))
  
  // Clean up whitespace
  text = text.replace(/\s+/g, " ").trim()
  
  return text
}

// System prompt for ENRICH mode - adding columns to existing rows
const SCRAPER_ENRICH_PROMPT = `You are a web scraping agent for GridMind, a spreadsheet application.

WORKFLOW:
1. FIRST: Analyze the selected rows data provided to understand the context
2. THEN: Use searchWeb to find information about the items in the rows
3. OPTIONALLY: Use scrapeWebPage if you need detailed data from specific URLs
4. FINALLY: Return a JSON response with the extracted data as new columns

Guidelines:
- When rows contain URLs, scrape those URLs directly
- When rows contain names/entities, search for information about them
- Extract specific data points as requested by the user
- Return data in a consistent format for each row
- If you can't find information for a row, return "N/A" or empty string
- Be efficient - batch similar operations when possible

CRITICAL: After using tools to gather data, your FINAL response MUST be ONLY a JSON object (no other text) with this exact structure:
\`\`\`json
{
  "columns": [
    {
      "header": "Column Name",
      "values": [
        { "rowIndex": 0, "value": "extracted value" },
        { "rowIndex": 1, "value": "extracted value" }
      ]
    }
  ],
  "summary": "Brief description of what was scraped"
}
\`\`\`

The rowIndex must match the original row indices from the selected rows.
You MUST use the tools first, then return the JSON with the data you found.`

// System prompt for GENERATE mode - creating new table data from scratch
const SCRAPER_GENERATE_PROMPT = `You are a web scraping agent for GridMind, a spreadsheet application.

WORKFLOW:
1. FIRST: Use the searchWeb tool to find relevant web sources for the user's request
2. THEN: If needed, use scrapeWebPage to get detailed data from found URLs
3. FINALLY: Return a JSON response with the collected data

Guidelines:
- Determine the appropriate number of rows based on the user's request (e.g., "top 10 companies" = 10 rows)
- Create logical column headers based on what data was requested
- Use the tools to find REAL data from the web - do not make up information
- If the user asks for specific fields/columns, include those
- If a piece of data cannot be found, use "N/A"
- Ensure data is properly formatted and consistent

CRITICAL: After using tools to gather data, your FINAL response MUST be ONLY a JSON object (no other text) with this exact structure:
\`\`\`json
{
  "table": {
    "headers": ["Column1", "Column2", "Column3"],
    "rows": [
      ["value1", "value2", "value3"],
      ["value1", "value2", "value3"]
    ]
  },
  "summary": "Brief description of what was found and generated"
}
\`\`\`

The headers array defines column names, and each row array should have values in the same order as headers.
You MUST use the tools first, then return the JSON with the data you found.`

export async function POST(request: NextRequest) {
  try {
    const body: ScraperRequest = await request.json()
    const { prompt, mode = "generate", chatHistory, selectedRows, existingColumns, tableInfo } = body

    // Check for OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Please set OPENAI_API_KEY in your environment." },
        { status: 500 }
      )
    }

    // GENERATE MODE: Create new table data from scratch
    if (mode === "generate" || !selectedRows || selectedRows.length === 0) {
      return await handleGenerateMode(prompt, tableInfo, chatHistory, apiKey)
    }

    // ENRICH MODE: Add columns to existing selected rows
    return await handleEnrichMode(prompt, selectedRows, existingColumns || [], tableInfo, chatHistory, apiKey)

  } catch (error) {
    console.error("Scraper API error:", error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to process scraper request",
        success: false,
      },
      { status: 500 }
    )
  }
}

// ── SSE helpers ───────────────────────────────────────────────────────────────
function createSSE() {
  let controller!: ReadableStreamDefaultController<Uint8Array>
  const stream = new ReadableStream<Uint8Array>({
    start(c) { controller = c },
  })
  const enc = new TextEncoder()
  const send = (data: object) =>
    controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}\n\n`))
  const close = () => controller.close()
  return { stream, send, close }
}

function sseResponse(stream: ReadableStream) {
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  })
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

// Handle GENERATE mode - create new table data from scratch
async function handleGenerateMode(
  prompt: string,
  tableInfo: ScraperRequest["tableInfo"],
  chatHistory: ScraperRequest["chatHistory"],
  apiKey: string
) {
  console.log("[Scraper] Starting GENERATE mode with prompt:", prompt)

  const { stream, send, close } = createSSE()

  // Run async work and stream results
  ;(async () => {
    try {
      send({ type: "start", mode: "generate" })

      const result = await generateText({
        model: openai("gpt-4o-mini"),
        system: SCRAPER_GENERATE_PROMPT,
        prompt: `User request: ${prompt}

Context:
- Project name: ${tableInfo.projectName}
- This is a NEW data generation request - the user wants you to search the web and create table data

Recent chat context:
${formatChatHistory(chatHistory)}

Instructions:
1. Analyze what specific data the user is asking for
2. Search the web to find this information
3. Structure the data as a table with appropriate columns
4. Return real, scraped data - do not make up information

Please search, scrape, and return the data in the required JSON format.`,
        tools: {
          scrapeWebPage,
          searchWeb,
        },
        stopWhen: stepCountIs(10),
      })

      console.log("[Scraper] Generate result - steps:", result.steps.length)

      const responseText = result.text
      let generatedData: { table: GeneratedTable; summary: string } | null = null

      try {
        const codeBlockMatch = responseText.match(/```json\s*([\s\S]*?)```/)
        if (codeBlockMatch) {
          generatedData = JSON.parse(codeBlockMatch[1].trim())
        }
        if (!generatedData) {
          const jsonMatch = responseText.match(/\{[\s\S]*"table"\s*:\s*\{[\s\S]*"headers"[\s\S]*"rows"[\s\S]*\}\s*\}/)
          if (jsonMatch) generatedData = JSON.parse(jsonMatch[0])
        }
        if (!generatedData) {
          try {
            const parsed = JSON.parse(responseText)
            if (parsed.table?.headers && parsed.table?.rows) generatedData = parsed
          } catch { /* not JSON */ }
        }
      } catch (e) {
        console.error("[Scraper] Failed to parse JSON from generation response:", e)
      }

      if (!generatedData?.table) {
        send({
          type: "error",
          error: "Failed to parse structured data from agent response.",
          rawResponse: responseText?.slice(0, 1000),
          steps: result.steps.length,
        })
        return
      }

      const { headers, rows } = generatedData.table
      console.log("[Scraper] Streaming", rows.length, "rows ×", headers.length, "cols")

      // Emit dimension info so the client can prepare the table
      send({ type: "headers", headers, numRows: rows.length, steps: result.steps.length })

      // Stream each row with a small delay for visual effect
      for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        send({ type: "row", rowIndex, values: rows[rowIndex] })
        await sleep(25)
      }

      send({
        type: "done",
        summary: generatedData.summary || "Data generated successfully",
        steps: result.steps.length,
        numRows: rows.length,
        numCols: headers.length,
        headers,
      })
    } catch (err) {
      console.error("[Scraper] Generate stream error:", err)
      send({ type: "error", error: err instanceof Error ? err.message : "Generation failed" })
    } finally {
      close()
    }
  })()

  return sseResponse(stream)
}

// Handle ENRICH mode - add columns to existing rows
async function handleEnrichMode(
  prompt: string,
  selectedRows: ScraperRequest["selectedRows"],
  existingColumns: string[],
  tableInfo: ScraperRequest["tableInfo"],
  chatHistory: ScraperRequest["chatHistory"],
  apiKey: string
) {
  console.log("[Scraper] Starting ENRICH mode with prompt:", prompt)

  const { stream, send, close } = createSSE()

  ;(async () => {
    try {
      send({ type: "start", mode: "enrich" })

      let rowContext = "Selected rows data:\n"
      for (const row of selectedRows!) {
        rowContext += `\nRow ${row.rowIndex + 1}:\n`
        for (const [colIndex, value] of Object.entries(row.cells)) {
          const colLabel = existingColumns[parseInt(colIndex)] || `Column ${parseInt(colIndex) + 1}`
          rowContext += `  ${colLabel}: "${value}"\n`
        }
      }

      const result = await generateText({
        model: openai("gpt-4o-mini"),
        system: SCRAPER_ENRICH_PROMPT,
        prompt: `User request: ${prompt}

Spreadsheet context:
- Project: ${tableInfo.projectName}
- Dimensions: ${tableInfo.numRows} rows × ${tableInfo.numCols} columns
- Existing columns: ${existingColumns.join(", ")}

Recent chat context:
${formatChatHistory(chatHistory)}

${rowContext}

Please scrape the requested data and return it in the required JSON format.`,
        tools: {
          scrapeWebPage,
          searchWeb,
          extractFromRowData,
        },
        stopWhen: stepCountIs(10),
      })

      console.log("[Scraper] Enrich result - steps:", result.steps.length)

      const responseText = result.text
      let scrapedData: { columns: ScrapedColumn[]; summary: string } | null = null

      try {
        const codeBlockMatch = responseText.match(/```json\s*([\s\S]*?)```/)
        if (codeBlockMatch) scrapedData = JSON.parse(codeBlockMatch[1].trim())
        if (!scrapedData) {
          const jsonMatch = responseText.match(/\{[\s\S]*"columns"\s*:\s*\[[\s\S]*\][\s\S]*\}/)
          if (jsonMatch) scrapedData = JSON.parse(jsonMatch[0])
        }
        if (!scrapedData) {
          try {
            const parsed = JSON.parse(responseText)
            if (parsed.columns && Array.isArray(parsed.columns)) scrapedData = parsed
          } catch { /* not JSON */ }
        }
      } catch (e) {
        console.error("[Scraper] Failed to parse JSON from enrich response:", e)
      }

      if (!scrapedData?.columns?.length) {
        send({
          type: "error",
          error: "Failed to parse structured data from agent response.",
          rawResponse: responseText?.slice(0, 1000),
          steps: result.steps.length,
        })
        return
      }

      const startCol = tableInfo.numCols
      console.log("[Scraper] Streaming", scrapedData.columns.length, "new columns starting at col", startCol)

      // Announce new column headers first
      const newHeaders = scrapedData.columns.map((c, i) => ({
        colIndex: startCol + i,
        header: c.header,
      }))
      send({ type: "col-headers", columns: newHeaders, steps: result.steps.length })

      // Stream each cell value
      for (let ci = 0; ci < scrapedData.columns.length; ci++) {
        const col = scrapedData.columns[ci]
        const colIndex = startCol + ci
        for (const { rowIndex, value } of col.values) {
          send({ type: "cell", rowIndex, colIndex, value })
          await sleep(30)
        }
      }

      send({
        type: "done",
        summary: scrapedData.summary || "Data enrichment complete",
        steps: result.steps.length,
        columns: newHeaders,
      })
    } catch (err) {
      console.error("[Scraper] Enrich stream error:", err)
      send({ type: "error", error: err instanceof Error ? err.message : "Enrichment failed" })
    } finally {
      close()
    }
  })()

  return sseResponse(stream)
}

function formatChatHistory(chatHistory?: ScraperRequest["chatHistory"]): string {
  if (!chatHistory || chatHistory.length === 0) {
    return "No prior conversation context."
  }

  const recent = chatHistory
    .filter((msg) => (msg.role === "user" || msg.role === "assistant") && msg.content.trim().length > 0)
    .slice(-12)

  if (recent.length === 0) {
    return "No prior conversation context."
  }

  return recent
    .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
    .join("\n")
}
