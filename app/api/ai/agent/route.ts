import { NextRequest } from "next/server"
import { generateText, tool } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { stepCountIs } from "ai"

// ── Types ─────────────────────────────────────────────────────────────────────

interface AgentRequest {
  prompt: string
  chatHistory?: { role: "user" | "assistant" | "system"; content: string }[]
  spreadsheetData: {
    columns: string[] // column labels
    rows: { rowIndex: number; cells: string[] }[]
  }
  selectedCells?: {
    row: number
    col: number
    colLabel: string
    rowLabel: number // 1-based
    value: string
  }[]
  tableInfo: {
    tableId: string
    projectName: string
    numRows: number
    numCols: number
  }
}

type Operation =
  | { type: "edit"; row: number; col: number; value: string }
  | { type: "clear"; row: number; col: number }
  | { type: "delete_row"; row: number }
  | { type: "insert_row"; row: number; values: string[] }

interface AgentPlan {
  operations: Operation[]
  summary: string
  analysis?: string
}

// ── SSE helpers ───────────────────────────────────────────────────────────────

function createSSE() {
  let controller!: ReadableStreamDefaultController<Uint8Array>
  const stream = new ReadableStream<Uint8Array>({ start(c) { controller = c } })
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

// ── Helper: HTML → plain text ─────────────────────────────────────────────────

function extractTextFromHTML(html: string): string {
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
  text = text.replace(/<[^>]+>/g, " ")
  text = text.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
  text = text.replace(/\s{2,}/g, " ").trim()
  return text
}

// ── Tools ─────────────────────────────────────────────────────────────────────

const searchWeb = tool({
  description: "Search the web for information. Returns titles, snippets, and URLs. Use this FIRST when you need external data, then call scrapeWebPage on the best URL to get actual content.",
  inputSchema: z.object({
    query: z.string().describe("Specific search query"),
  }),
  execute: async ({ query }) => {
    try {
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
      const response = await fetch(searchUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
        signal: AbortSignal.timeout(10000),
      })
      if (!response.ok) return { results: [], error: "Search failed" }
      const html = await response.text()
      const results: { title: string; snippet: string; url: string }[] = []

      // Try DuckDuckGo result__a / result__snippet selectors first
      const resultRegex = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([^<]*)/gi
      let match
      while ((match = resultRegex.exec(html)) !== null && results.length < 6) {
        results.push({ url: match[1], title: match[2].trim(), snippet: match[3].trim() })
      }
      // Fallback to generic links
      if (results.length === 0) {
        const linkRegex = /<a[^>]*href="(https?:\/\/[^"]+)"[^>]*>([^<]+)<\/a>/gi
        while ((match = linkRegex.exec(html)) !== null && results.length < 6) {
          if (!match[1].includes("duckduckgo.com")) {
            results.push({ url: match[1], title: match[2].trim(), snippet: "" })
          }
        }
      }
      return { query, results, success: true }
    } catch (error) {
      return { results: [], error: error instanceof Error ? error.message : "Search failed" }
    }
  },
})

const scrapeWebPage = tool({
  description: "Fetch and extract the full text content from a web page URL. Use this after searchWeb to read actual page content and extract the specific data you need.",
  inputSchema: z.object({
    url: z.string().describe("The URL to fetch"),
    extractionHint: z.string().optional().describe("What specific data to extract from the page"),
  }),
  execute: async ({ url, extractionHint }) => {
    try {
      new URL(url) // validate
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
        signal: AbortSignal.timeout(12000),
      })
      if (!response.ok) return { error: `HTTP ${response.status}`, content: null }
      const html = await response.text()
      const text = extractTextFromHTML(html).slice(0, 10000)
      return { url, content: text, extractionHint, success: true }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to scrape", content: null }
    }
  },
})

// ── System prompt ─────────────────────────────────────────────────────────────

const AGENT_SYSTEM_PROMPT = `You are a smart spreadsheet agent for GridMind. You can edit existing data AND find new data from the web to fill into the spreadsheet.

AVAILABLE OPERATIONS (what you write in the final JSON):
- edit: change a cell — { "type": "edit", "row": N, "col": N, "value": "..." }
- clear: empty a cell — { "type": "clear", "row": N, "col": N }
- delete_row: remove a row — { "type": "delete_row", "row": N }
- insert_row: add a new row — { "type": "insert_row", "row": N, "values": ["v1","v2",...] }

COLUMN MAPPING — CRITICAL:
- The spreadsheet columns are listed with their 0-based index in the prompt under "COLUMN INDEX MAP".
- For insert_row, the "values" array must have EXACTLY one string per column, in column-index order.
  Example: if columns are [col0=Name, col1=Price, col2=Category], then values must be ["Nike", "120", "Shoes"].
- NEVER put multiple pieces of data into a single string. Each column gets its own separate value.
- NEVER combine values like "Nike | 120 | Shoes" into one string — that is wrong.
- For edit, use separate edit operations for each cell that needs a different value.

AVAILABLE TOOLS (only call these when the task requires finding external data):
- searchWeb(query): search for URLs and snippets
- scrapeWebPage(url): fetch the full text content of a page

TOOL USAGE RULES:
- If the task can be done using only the existing spreadsheet data (e.g. edit a cell, delete rows, reformat values, sort, clear), do NOT call any tools. Go straight to the final JSON.
- Only call searchWeb + scrapeWebPage when the user is explicitly asking to find new data that is not already in the spreadsheet (e.g. "find prices for these products", "add 5 new rows with current data", "look up missing values").
- When tools ARE needed: call searchWeb first, then scrapeWebPage on the best URL, then build operations from the result.

CRITICAL: Your FINAL response must be ONLY this JSON (no other text, no markdown code fences):
{
  "operations": [...],
  "summary": "what was done in one sentence",
  "analysis": "plain text explanation for the user, no markdown headers"
}

Rules:
- Row/col indices are 0-based
- delete_row ops in DESCENDING order; insert_row ops in ASCENDING order
- edit/clear ops come BEFORE insert/delete ops
- analysis field: plain text only, no # ## ### headers`

// ── Main handler ──────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body: AgentRequest = await request.json()
    const { prompt, chatHistory, spreadsheetData, selectedCells, tableInfo } = body

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return Response.json({ error: "OpenAI API key not configured." }, { status: 500 })
    }

    const { stream, send, close } = createSSE()

    ;(async () => {
      try {
        send({ type: "start" })

        // Format spreadsheet as a readable table for the AI
        const { columns, rows } = spreadsheetData

        // Build explicit column index map — the key fix for per-cell placement
        const columnIndexMap = columns
          .map((col, i) => `  col${i} (index ${i}) = "${col}"`)
          .join("\n")

        let tableText = `COLUMN INDEX MAP (use these indices for row/col operations):\n${columnIndexMap}\n\n`
        tableText += `Total rows: ${tableInfo.numRows}, Total columns: ${tableInfo.numCols}\n\n`
        tableText += `Existing data (first ${rows.length} rows):\n`
        tableText += `| ${columns.map((c, i) => `[${i}] ${c}`).join(" | ")} |\n`
        tableText += `| ${columns.map(() => "---").join(" | ")} |\n`
        for (const row of rows) {
          tableText += `| Row ${row.rowIndex}: ${row.cells.join(" | ")} |\n`
        }

        // Format selected cells if present
        let selectionText = ""
        if (selectedCells && selectedCells.length > 0) {
          const selectedRowIndices = [...new Set(selectedCells.map(c => c.row))].sort((a, b) => a - b)
          selectionText = `\n\nSELECTED CELLS (${selectedCells.length} cell${selectedCells.length > 1 ? "s" : ""}):\n`
          for (const c of selectedCells) {
            selectionText += `  ${c.colLabel}${c.rowLabel} (row=${c.row}, col=${c.col}): "${c.value}"\n`
          }
          selectionText += `Selected row indices (0-based): ${selectedRowIndices.join(", ")}\n`
          selectionText += `NOTE: When the user refers to "selected", "highlighted", "these", or "this" cells/rows, they mean the SELECTED CELLS above.\n`
        }

        // Build chat history context
        const recentHistory = (chatHistory ?? [])
          .filter(m => (m.role === "user" || m.role === "assistant") && m.content.trim())
          .slice(-8)
          .map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
          .join("\n")

        const result = await generateText({
          model: openai("gpt-4o-mini"),
          system: AGENT_SYSTEM_PROMPT,
          prompt: `Project: ${tableInfo.projectName}

Recent conversation:
${recentHistory || "None"}

Spreadsheet data:
${tableText}${selectionText}
User request: ${prompt}

If this request requires data from the web, use searchWeb then scrapeWebPage to get real content before building the operations. Return ONLY the JSON.`,
          tools: { searchWeb, scrapeWebPage },
          stopWhen: stepCountIs(10),
        })

        const responseText = result.text
        let plan: AgentPlan | null = null

        // Parse JSON from response (handle optional code fences the model might still add)
        try {
          const codeBlockMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/)
          if (codeBlockMatch) plan = JSON.parse(codeBlockMatch[1].trim())
        } catch (_e) { /* try next */ }

        if (!plan) {
          try {
            const jsonMatch = responseText.match(/\{[\s\S]*"operations"\s*:\s*\[[\s\S]*\][\s\S]*\}/)
            if (jsonMatch) plan = JSON.parse(jsonMatch[0])
          } catch (_e) { /* try next */ }
        }

        if (!plan) {
          try {
            plan = JSON.parse(responseText)
          } catch (_e) { /* not JSON */ }
        }

        if (!plan) {
          send({
            type: "error",
            error: "Failed to parse agent plan. The AI did not return a valid JSON response.",
            rawResponse: responseText?.slice(0, 500),
          })
          return
        }

        const operations = plan.operations ?? []
        const analysis = plan.analysis ?? ""

        // Send analysis text first if present
        if (analysis) {
          send({ type: "analysis", text: analysis })
        }

        // Separate and order operations: edits first, then inserts (asc), then deletes (desc)
        const editOps = operations.filter(op => op.type === "edit" || op.type === "clear")
        const insertOps = operations
          .filter((op): op is Extract<Operation, { type: "insert_row" }> => op.type === "insert_row")
          .sort((a, b) => a.row - b.row)
        const deleteOps = operations
          .filter((op): op is Extract<Operation, { type: "delete_row" }> => op.type === "delete_row")
          .sort((a, b) => b.row - a.row) // descending so indices stay valid

        const orderedOps: Operation[] = [...editOps, ...insertOps, ...deleteOps]

        console.log(`[Agent] Executing ${orderedOps.length} operations`)

        // Stream each operation
        for (const op of orderedOps) {
          send({ type: "operation", operation: op })
          await sleep(op.type === "edit" || op.type === "clear" ? 30 : 80)
        }

        send({
          type: "done",
          summary: plan.summary || "Done",
          operationCount: orderedOps.length,
          steps: result.steps.length,
        })
      } catch (err) {
        console.error("[Agent] Stream error:", err)
        send({ type: "error", error: err instanceof Error ? err.message : "Agent failed" })
      } finally {
        close()
      }
    })()

    return sseResponse(stream)
  } catch (error) {
    console.error("[Agent] Request error:", error)
    return Response.json({ error: "Failed to process agent request" }, { status: 500 })
  }
}
