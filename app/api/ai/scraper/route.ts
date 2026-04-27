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

// Handle GENERATE mode - create new table data from scratch
async function handleGenerateMode(
  prompt: string,
  tableInfo: ScraperRequest["tableInfo"],
  chatHistory: ScraperRequest["chatHistory"],
  apiKey: string
) {
  console.log("[Scraper] Starting GENERATE mode with prompt:", prompt)
  
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
    stopWhen: stepCountIs(10), // Allow up to 10 steps for multi-tool execution
  })

  console.log("[Scraper] Generate result - steps:", result.steps.length)
  console.log("[Scraper] Tool calls made:", result.steps.flatMap(s => s.toolCalls?.map(tc => tc.toolName) || []))
  
  const responseText = result.text
  console.log("[Scraper] Response text length:", responseText?.length)
  console.log("[Scraper] Response text preview:", responseText?.slice(0, 500))

  // Try to extract JSON from the response - multiple strategies
  let generatedData: { table: GeneratedTable; summary: string } | null = null
  
  try {
    // Strategy 1: Look for JSON code block
    const codeBlockMatch = responseText.match(/```json\s*([\s\S]*?)```/)
    if (codeBlockMatch) {
      generatedData = JSON.parse(codeBlockMatch[1].trim())
      console.log("[Scraper] Extracted JSON from code block")
    }
    
    // Strategy 2: Look for JSON with table/headers/rows structure
    if (!generatedData) {
      const jsonMatch = responseText.match(/\{[\s\S]*"table"\s*:\s*\{[\s\S]*"headers"[\s\S]*"rows"[\s\S]*\}\s*\}/)
      if (jsonMatch) {
        generatedData = JSON.parse(jsonMatch[0])
        console.log("[Scraper] Extracted JSON from pattern match")
      }
    }
    
    // Strategy 3: Try parsing the entire response as JSON
    if (!generatedData) {
      try {
        const parsed = JSON.parse(responseText)
        if (parsed.table && parsed.table.headers && parsed.table.rows) {
          generatedData = parsed
          console.log("[Scraper] Parsed entire response as JSON")
        }
      } catch {
        // Not valid JSON, continue
      }
    }
  } catch (e) {
    console.error("[Scraper] Failed to parse JSON from generation response:", e)
  }

  if (!generatedData || !generatedData.table) {
    console.log("[Scraper] No valid JSON found in response")
    return NextResponse.json({
      success: false,
      mode: "generate",
      error: "Failed to parse structured data from agent response. The AI may not have returned proper JSON format.",
      rawResponse: responseText?.slice(0, 1000),
      steps: result.steps.length,
    })
  }

  console.log("[Scraper] Successfully parsed table with", generatedData.table.headers.length, "columns and", generatedData.table.rows.length, "rows")
  
  return NextResponse.json({
    success: true,
    mode: "generate",
    table: generatedData.table,
    summary: generatedData.summary || "Data generated successfully",
    steps: result.steps.length,
  })
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
  
  // Build context about the selected rows
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
    stopWhen: stepCountIs(10), // Allow up to 10 steps for multi-tool execution
  })

  console.log("[Scraper] Enrich result - steps:", result.steps.length)
  console.log("[Scraper] Tool calls made:", result.steps.flatMap(s => s.toolCalls?.map(tc => tc.toolName) || []))
  
  const responseText = result.text
  console.log("[Scraper] Response text length:", responseText?.length)
  console.log("[Scraper] Response text preview:", responseText?.slice(0, 500))

  // Try to extract JSON from the response - multiple strategies
  let scrapedData: { columns: ScrapedColumn[]; summary: string } | null = null
  
  try {
    // Strategy 1: Look for JSON code block
    const codeBlockMatch = responseText.match(/```json\s*([\s\S]*?)```/)
    if (codeBlockMatch) {
      scrapedData = JSON.parse(codeBlockMatch[1].trim())
      console.log("[Scraper] Extracted JSON from code block")
    }
    
    // Strategy 2: Look for JSON with columns structure
    if (!scrapedData) {
      const jsonMatch = responseText.match(/\{[\s\S]*"columns"\s*:\s*\[[\s\S]*\][\s\S]*\}/)
      if (jsonMatch) {
        scrapedData = JSON.parse(jsonMatch[0])
        console.log("[Scraper] Extracted JSON from pattern match")
      }
    }
    
    // Strategy 3: Try parsing the entire response as JSON
    if (!scrapedData) {
      try {
        const parsed = JSON.parse(responseText)
        if (parsed.columns && Array.isArray(parsed.columns)) {
          scrapedData = parsed
          console.log("[Scraper] Parsed entire response as JSON")
        }
      } catch {
        // Not valid JSON, continue
      }
    }
  } catch (e) {
    console.error("[Scraper] Failed to parse JSON from enrich response:", e)
  }

  if (!scrapedData || !scrapedData.columns || scrapedData.columns.length === 0) {
    console.log("[Scraper] No valid JSON found in enrich response")
    return NextResponse.json({
      success: false,
      mode: "enrich",
      error: "Failed to parse structured data from agent response. The AI may not have returned proper JSON format.",
      rawResponse: responseText?.slice(0, 1000),
      steps: result.steps.length,
    })
  }

  console.log("[Scraper] Successfully parsed", scrapedData.columns.length, "columns for enrichment")
  
  return NextResponse.json({
    success: true,
    mode: "enrich",
    columns: scrapedData.columns,
    summary: scrapedData.summary || "Data enrichment complete",
    steps: result.steps.length,
  })
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
