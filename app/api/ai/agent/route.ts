import { NextRequest } from "next/server"
import { NoOutputGeneratedError, Output, ToolLoopAgent, generateText, tool, stepCountIs } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

import { chargeCreditsForAction, refundCredits } from "@/lib/billing-server"

interface SelectedCell {
  row: number
  col: number
  colLabel: string
  value: string
  formatting?: {
    bold?: boolean
    italic?: boolean
    underline?: boolean
    alignment?: "left" | "center" | "right"
    textColor?: string
    backgroundColor?: string
    fontSize?: number
  }
}

interface AgentRequest {
  prompt: string
  cells: { [key: string]: string }
  numRows: number
  numCols: number
  chatHistory?: { role: "user" | "assistant" | "system"; content: string }[]
  selectedCells?: SelectedCell[]
  businessContext?: string
}

interface CellChange {
  row: number
  col: number
  value: string
}

interface CellFormatting {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  alignment?: "left" | "center" | "right"
  textColor?: string | null
  backgroundColor?: string | null
  fontSize?: number | null
}

interface FormattingChange {
  row: number
  col: number
  format: CellFormatting
}

interface AgentResult {
  changes: CellChange[]
  formatting: FormattingChange[]
  summary: string
  newNumRows?: number
  newNumCols?: number
}

type SpreadsheetContext = {
  prompt: string
  cells: { [key: string]: string }
  numRows: number
  numCols: number
  selectedCells: SelectedCell[]
  businessContext?: string
  recentHistory: string
  tableRows: string[][]
  columnLabels: string[]
  nextFreeCol: number
}

const AGENT_OUTPUT_SCHEMA = z.object({
  changes: z.array(z.object({
    row: z.number(),
    col: z.number(),
    value: z.string(),
  })),
  formatting: z.array(z.object({
    row: z.number(),
    col: z.number(),
    format: z.object({
      bold: z.boolean().nullable(),
      italic: z.boolean().nullable(),
      underline: z.boolean().nullable(),
      alignment: z.enum(["left", "center", "right"]).nullable(),
      textColor: z.string().nullable(),
      backgroundColor: z.string().nullable(),
      fontSize: z.number().nullable(),
    }),
  })),
  summary: z.string(),
  newNumRows: z.number().nullable(),
  newNumCols: z.number().nullable(),
})

const AGENT_SYSTEM_PROMPT = `You are GridMind Spreadsheet Agent â€” a tool-using spreadsheet operator.

You manage the spreadsheet from the user's prompt.

You can:
- inspect the whole spreadsheet
- inspect individual cells, rows, columns, and selected cells
- find matching text anywhere in the sheet
- decide where new data should be written
- apply value changes
- apply formatting changes that match spreadsheet toolbars and formatting bars
- enrich missing details by searching the web and scraping pages

RULES:
- Use tools to inspect the sheet before finalizing changes.
- If cells are selected, focus on them unless the user clearly asks for a broader action.
- If no cells are selected, work on the full spreadsheet.
- If the user asks for missing facts, search/scrape first and then write the results into the correct cells.
- If the user asks to add/enrich/expand information, prefer new columns to the right instead of overwriting the original reference cell.
- Only return cells that truly change.
- Row and column indices are 0-based.
- Final answer must be the structured spreadsheet-change object only.
`

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
]

const AGENT_MODEL = openai(process.env.OPENAI_MODEL || "gpt-5.5")
const AGENT_PROVIDER_OPTIONS = {
  openai: {
    reasoningEffort: "high" as const,
  },
}

export async function POST(request: NextRequest) {
  const body: AgentRequest = await request.json()
  const { prompt, cells, numRows, numCols, chatHistory, selectedCells = [], businessContext } = body

  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      `data: ${JSON.stringify({ type: "error", content: "OpenAI API key not configured." })}\n\ndata: [DONE]\n\n`,
      { status: 200, headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" } }
    )
  }

  let billingUserId: string | null = null
  let billingTransactionId: string | null = null

  try {
    const billing = await chargeCreditsForAction(request, "agent", "AI agent spreadsheet action")
    if (!billing.charge.skipped) {
      billingUserId = billing.user.id
      billingTransactionId = String(billing.charge.transactionId)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Billing failed"
    const publicMessage = message.includes("Authentication required")
      ? "Your session has expired. Sign in again and retry."
      : message.includes("Not enough credits")
        ? message
        : "Unable to verify AI credits right now. Please retry."

    if (!message.includes("Authentication required") && !message.includes("Not enough credits")) {
      console.error("[Agent API] Credit validation failed:", error)
    }

    return new Response(
      `data: ${JSON.stringify({ type: "error", content: publicMessage })}\n\ndata: [DONE]\n\n`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      }
    )
  }

  const context = buildSpreadsheetContext({
    prompt,
    cells,
    numRows,
    numCols,
    selectedCells,
    businessContext,
    recentHistory: formatRecentHistory(chatHistory),
  })

  const agent = createSpreadsheetAgent(context)
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: object) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`))

      try {
        send({
          type: "thinking",
          content: selectedCells.length > 0
            ? `Reading selection (${selectedCells.length} cell${selectedCells.length === 1 ? "" : "s"}) and spreadsheet context`
            : `Reading full spreadsheet (${numRows} rows x ${numCols} cols)`,
        })

        const result = await agent.generate({
          prompt: buildAgentPrompt(context),
          abortSignal: request.signal,
          onStepFinish: ({ toolCalls, toolResults }) => {
            sendStepUpdates(send, toolCalls, toolResults)
          },
        })

        let outputValue: unknown = null
        try {
          outputValue = result.output
        } catch (error) {
          if (!NoOutputGeneratedError.isInstance(error)) throw error
          console.warn("[Agent API] Tool loop ended without structured output; running finalization recovery")
        }

        let agentData = parseAgentResult(outputValue)
        if (!agentData) {
          send({ type: "thinking", content: "Finalizing spreadsheet changes..." })
          const toolEvidence = previewValue(
            result.steps.map((step) => step.toolResults),
            12000
          )
          agentData = await recoverAgentResult(context, result.text, toolEvidence)
        }

        if (!agentData) {
          console.error("[Agent API] Failed to parse structured output", {
            outputPreview: previewValue(outputValue),
            textPreview: previewValue(result.text),
          })
          send({ type: "error", content: "Failed to parse agent response. Please try again." })
          return
        }

        const changeCount = agentData.changes.length
        const formattingCount = agentData.formatting.length
        const parts: string[] = []
        if (changeCount > 0) parts.push(`${changeCount} cell edit${changeCount !== 1 ? "s" : ""}`)
        if (formattingCount > 0) parts.push(`${formattingCount} formatting change${formattingCount !== 1 ? "s" : ""}`)
        if (parts.length > 0) {
          send({ type: "thinking", content: `Prepared: ${parts.join(" | ")}` })
        }
        if (changeCount > 0 || formattingCount > 0) {
          send({
            type: "thinking",
            content: `📝 Writing ${changeCount} cell edit${changeCount === 1 ? "" : "s"}${formattingCount > 0 ? ` and ${formattingCount} formatting change${formattingCount === 1 ? "" : "s"}` : ""} to the sheet...`,
          })
        }

        send({
          type: "result",
          data: {
            success: true,
            changes: agentData.changes,
            formatting: agentData.formatting,
            summary: agentData.summary,
            newNumRows: agentData.newNumRows,
            newNumCols: agentData.newNumCols,
          },
        })
      } catch (error) {
        if (billingTransactionId && billingUserId) {
          await refundCredits(billingUserId, billingTransactionId, "AI agent request failed")
        }
        console.error("[Agent API] error:", error)
        send({ type: "error", content: error instanceof Error ? error.message : "Failed to process agent request" })
      } finally {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  })
}

function createSpreadsheetAgent(context: SpreadsheetContext) {
  const overviewTool = tool({
    description: "Read high-level spreadsheet context including dimensions, columns, selection, and next free column.",
    inputSchema: z.object({}),
    execute: async () => ({
      numRows: context.numRows,
      numCols: context.numCols,
      columnLabels: context.columnLabels,
      selectedCellCount: context.selectedCells.length,
      selectedRows: [...new Set(context.selectedCells.map(cell => cell.row))],
      nextFreeCol: context.nextFreeCol,
      nextFreeColLabel: getColLabel(context.nextFreeCol),
      businessContext: context.businessContext || "",
    }),
  })

  const selectionTool = tool({
    description: "Read the selected cells. Use this first when the user refers to selected cells or asks to update the current selection.",
    inputSchema: z.object({}),
    execute: async () => ({
      selectedCells: context.selectedCells,
      selectedRows: [...new Set(context.selectedCells.map(cell => cell.row))],
      hasSelection: context.selectedCells.length > 0,
    }),
  })

  const cellTool = tool({
    description: "Read an individual spreadsheet cell by row and column index.",
    inputSchema: z.object({
      row: z.number(),
      col: z.number(),
    }),
    execute: async ({ row, col }) => ({
      row,
      col,
      colLabel: getColLabel(col),
      value: context.cells[`${row}-${col}`] ?? "",
      inSelection: context.selectedCells.some(cell => cell.row === row && cell.col === col),
    }),
  })

  const rowTool = tool({
    description: "Read an entire row with column labels and values.",
    inputSchema: z.object({
      row: z.number(),
    }),
    execute: async ({ row }) => ({
      row,
      values: context.columnLabels.map((label, col) => ({
        col,
        colLabel: label,
        value: context.cells[`${row}-${col}`] ?? "",
      })),
      nextFreeCol: getRowNextFreeCol(context, row),
      nextFreeColLabel: getColLabel(getRowNextFreeCol(context, row)),
    }),
  })

  const columnTool = tool({
    description: "Read an entire column with row numbers and values.",
    inputSchema: z.object({
      col: z.number(),
    }),
    execute: async ({ col }) => ({
      col,
      colLabel: getColLabel(col),
      values: Array.from({ length: context.numRows }, (_, row) => ({
        row,
        value: context.cells[`${row}-${col}`] ?? "",
      })),
    }),
  })

  const findCellsTool = tool({
    description: "Find matching text in the spreadsheet. Use this when the user refers to an entity but no cell is selected.",
    inputSchema: z.object({
      query: z.string(),
      limit: z.number().optional(),
    }),
    execute: async ({ query, limit = 20 }) => {
      const q = query.toLowerCase()
      const matches: Array<{ row: number; col: number; colLabel: string; value: string }> = []
      for (let row = 0; row < context.numRows; row++) {
        for (let col = 0; col < context.numCols; col++) {
          const value = context.cells[`${row}-${col}`] ?? ""
          if (value.toLowerCase().includes(q)) {
            matches.push({ row, col, colLabel: getColLabel(col), value })
            if (matches.length >= limit) return { matches, total: matches.length, query }
          }
        }
      }
      return { matches, total: matches.length, query }
    },
  })

  const fullSheetTool = tool({
    description: "Read a compact spreadsheet snapshot for full-sheet operations such as cleanup, normalization, and broad transforms.",
    inputSchema: z.object({
      maxRows: z.number().optional(),
    }),
    execute: async ({ maxRows = 50 }) => ({
      numRows: context.numRows,
      numCols: context.numCols,
      snapshot: buildSpreadsheetPreview(context, maxRows),
    }),
  })

  const formattingTool = tool({
    description: "List available spreadsheet formatting operations that can be used in the final formatting array.",
    inputSchema: z.object({}),
    execute: async () => ({
      formattingFields: ["bold", "italic", "underline", "alignment", "textColor", "backgroundColor", "fontSize"],
      alignmentOptions: ["left", "center", "right"],
      guidance: "Return only properties that change. Use null to clear colors or fontSize.",
    }),
  })

  const searchWebTool = tool({
    description: "Search the web for missing facts when the spreadsheet does not already contain them.",
    inputSchema: z.object({
      query: z.string(),
      contextHint: z.string().optional(),
    }),
    execute: async ({ query, contextHint }) => searchWeb(query, contextHint),
  })

  const scrapeWebTool = tool({
    description: "Scrape a webpage and extract useful text, including phone, address, email, and hours when available.",
    inputSchema: z.object({
      url: z.string(),
      extractionHint: z.string().optional(),
    }),
    execute: async ({ url, extractionHint }) => scrapeWebPage(url, extractionHint),
  })

  return new ToolLoopAgent<never, {
    getSpreadsheetOverview: typeof overviewTool
    getSelectedCells: typeof selectionTool
    getCell: typeof cellTool
    getRow: typeof rowTool
    getColumn: typeof columnTool
    findCells: typeof findCellsTool
    getFullSpreadsheet: typeof fullSheetTool
    getFormattingCapabilities: typeof formattingTool
    searchWeb: typeof searchWebTool
    scrapeWebPage: typeof scrapeWebTool
  }, ReturnType<typeof Output.object>>({
    id: "gridmind-spreadsheet-agent",
    model: AGENT_MODEL,
    providerOptions: AGENT_PROVIDER_OPTIONS,
    instructions: AGENT_SYSTEM_PROMPT,
    tools: {
      getSpreadsheetOverview: overviewTool,
      getSelectedCells: selectionTool,
      getCell: cellTool,
      getRow: rowTool,
      getColumn: columnTool,
      findCells: findCellsTool,
      getFullSpreadsheet: fullSheetTool,
      getFormattingCapabilities: formattingTool,
      searchWeb: searchWebTool,
      scrapeWebPage: scrapeWebTool,
    },
    output: Output.object({
      schema: AGENT_OUTPUT_SCHEMA,
      name: "spreadsheet_changes",
      description: "Exact spreadsheet edits and formatting changes to apply.",
    }),
    stopWhen: stepCountIs(20),
    prepareStep: async ({ stepNumber }) => {
      if (stepNumber === 0) return { toolChoice: "required" }
      // Reserve the final model call for producing the structured spreadsheet edits.
      if (stepNumber >= 18) return { toolChoice: "none" }
      return { toolChoice: "auto" }
    },
  })
}

async function recoverAgentResult(
  context: SpreadsheetContext,
  previousText: string,
  toolEvidence: string
): Promise<AgentResult | null> {
  try {
    const result = await generateText({
      model: AGENT_MODEL,
      providerOptions: AGENT_PROVIDER_OPTIONS,
      output: Output.object({
        schema: AGENT_OUTPUT_SCHEMA,
        name: "spreadsheet_changes_recovery",
        description: "Final spreadsheet edits and formatting changes to apply.",
      }),
      system: `${AGENT_SYSTEM_PROMPT}\nDo not call tools. Finalize the structured output using only the supplied context and tool evidence.`,
      prompt: `${buildAgentPrompt(context)}

Spreadsheet snapshot:
${buildSpreadsheetPreview(context, 50)}

Evidence gathered by the tool loop:
${toolEvidence || "No tool evidence was returned."}

Previous agent text:
${previousText || "No final text was returned."}`,
    })

    return parseAgentResult(result.output)
  } catch (error) {
    console.error("[Agent API] Structured-output recovery failed:", error)
    return null
  }
}

function buildSpreadsheetContext(input: Omit<SpreadsheetContext, "tableRows" | "columnLabels" | "nextFreeCol">): SpreadsheetContext {
  const columnLabels = Array.from({ length: input.numCols }, (_, i) => getColLabel(i))
  const tableRows = Array.from({ length: input.numRows }, (_, row) =>
    Array.from({ length: input.numCols }, (_, col) => input.cells[`${row}-${col}`] ?? "")
  )

  let lastUsedCol = -1
  for (let row = 0; row < input.numRows; row++) {
    for (let col = input.numCols - 1; col >= 0; col--) {
      if ((input.cells[`${row}-${col}`] ?? "").trim()) {
        lastUsedCol = Math.max(lastUsedCol, col)
        break
      }
    }
  }

  return {
    ...input,
    tableRows,
    columnLabels,
    nextFreeCol: Math.max(lastUsedCol + 1, input.numCols),
  }
}

function buildAgentPrompt(context: SpreadsheetContext): string {
  const selectionSummary = context.selectedCells.length > 0
    ? `Selected cells:\n${context.selectedCells.map(cell => `- ${cell.colLabel}${cell.row + 1}: "${cell.value}"`).join("\n")}`
    : "No cells are selected. Work on the full spreadsheet."

  return `User instruction: ${context.prompt}\n\n${selectionSummary}\n\nRecent conversation:\n${context.recentHistory || "No recent conversation."}\n\nBusiness context:\n${context.businessContext || "No business context provided."}\n\nUse spreadsheet inspection tools first. If the user asks for information not in the sheet, use web search and page scraping tools, then return exact spreadsheet changes.`
}

function buildSpreadsheetPreview(context: SpreadsheetContext, maxRows = 50): string {
  const headerLine = `     | ${context.columnLabels.map(label => label.padEnd(18)).join(" | ")}`
  const separator = "-".repeat(headerLine.length)
  const dataLines = context.tableRows
    .slice(0, maxRows)
    .map((row, index) => `Row${String(index + 1).padStart(2)} | ${row.map(value => value.slice(0, 18).padEnd(18)).join(" | ")}`)
  return [headerLine, separator, ...dataLines].join("\n")
}

function parseAgentResult(outputValue: unknown): AgentResult | null {
  const parsed = AGENT_OUTPUT_SCHEMA.safeParse(outputValue)
  if (!parsed.success) return null

  return {
    changes: parsed.data.changes,
    formatting: parsed.data.formatting.map((item) => ({
      row: item.row,
      col: item.col,
      format: Object.fromEntries(
        Object.entries(item.format).filter(([, value]) => value !== null)
      ) as CellFormatting,
    })),
    summary: parsed.data.summary,
    newNumRows: parsed.data.newNumRows ?? undefined,
    newNumCols: parsed.data.newNumCols ?? undefined,
  }
}

function formatRecentHistory(chatHistory?: AgentRequest["chatHistory"]): string {
  return (chatHistory || [])
    .filter(message => message.role === "user" || message.role === "assistant")
    .slice(-6)
    .map(message => `${message.role === "user" ? "User" : "Assistant"}: ${message.content.slice(0, 300)}`)
    .join("\n")
}

function getRowNextFreeCol(context: SpreadsheetContext, row: number): number {
  for (let col = context.numCols - 1; col >= 0; col--) {
    if ((context.cells[`${row}-${col}`] ?? "").trim()) return col + 1
  }
  return 0
}

function sendStepUpdates(
  send: (obj: object) => void,
  toolCalls?: Array<{ toolName: string; input?: unknown; args?: unknown }>,
  toolResults?: Array<{ toolName: string; result?: unknown; output?: unknown }>
) {
  for (const call of toolCalls || []) {
    const args = (call.args ?? call.input ?? {}) as Record<string, string>
    if (call.toolName === "getSpreadsheetOverview") {
      send({ type: "thinking", content: "Inspecting spreadsheet overview..." })
    } else if (call.toolName === "getSelectedCells") {
      send({ type: "thinking", content: "Reading selected cells..." })
    } else if (call.toolName === "getCell") {
      send({ type: "thinking", content: `Inspecting cell ${getColLabel(Number(args.col || 0))}${Number(args.row || 0) + 1}...` })
    } else if (call.toolName === "getRow") {
      send({ type: "thinking", content: `Reading row ${Number(args.row || 0) + 1}...` })
    } else if (call.toolName === "findCells") {
      send({ type: "thinking", content: `Finding "${args.query || "..."}" in the sheet...` })
    } else if (call.toolName === "searchWeb") {
      send({ type: "thinking", content: `Searching the web for "${args.query || "..."}"...` })
    } else if (call.toolName === "scrapeWebPage") {
      send({ type: "thinking", content: `Scraping ${(args.url || "").replace(/^https?:\/\//, "").slice(0, 70)}...` })
    }
  }

  for (const result of toolResults || []) {
    const output = (result.result ?? result.output ?? {}) as Record<string, unknown>
    if (result.toolName === "findCells" && Array.isArray(output.matches)) {
      send({ type: "thinking", content: `Found ${output.matches.length} matching cell${output.matches.length === 1 ? "" : "s"}.` })
    } else if (result.toolName === "searchWeb" && Array.isArray(output.results)) {
      const hits = output.results as Array<{ title?: string; url?: string }>
      if (hits.length === 0) {
        send({ type: "thinking", content: "Search returned 0 results. Trying another search..." })
      } else {
        const preview = hits
          .slice(0, 3)
          .map((hit, index) => `  ${index + 1}. ${(hit.title || hit.url || "").slice(0, 55)}\n     ${hit.url || ""}`)
          .join("\n")
        send({ type: "thinking", content: `Search returned ${hits.length} result${hits.length === 1 ? "" : "s"}.\n${preview}` })
      }
    } else if (result.toolName === "scrapeWebPage") {
      const short = String(output.url || "").replace(/^https?:\/\//, "").slice(0, 70)
      send({
        type: "thinking",
        content: output.success
          ? `Scraped ${short || "page"} successfully${output.content ? ` and extracted ${Math.min(String(output.content).length, 8000)} chars` : ""}.`
          : `Page scrape failed or returned limited data${short ? ` for ${short}` : ""}.`,
      })
    }
  }
}

async function searchWeb(query: string, contextHint?: string) {
  const results: Array<{ title: string; snippet: string; url: string }> = []
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENTS[0],
        "Accept": "text/html,application/xhtml+xml,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(10000),
    })

    if (response.ok) {
      const html = await response.text()
      const titleRegex = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi
      const snippetRegex = /<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi
      const titleMatches: Array<{ url: string; title: string }> = []
      const snippets: string[] = []
      let match: RegExpExecArray | null

      while ((match = titleRegex.exec(html)) !== null && titleMatches.length < 5) {
        let actualUrl = match[1]
        const title = match[2].replace(/<[^>]+>/g, "").trim()
        if (actualUrl.includes("uddg=")) {
          try {
            const qs = actualUrl.includes("?") ? actualUrl.split("?")[1] : actualUrl
            const uddg = new URLSearchParams(qs).get("uddg")
            if (uddg) actualUrl = decodeURIComponent(uddg)
          } catch {
            // Ignore decode errors.
          }
        }
        if (actualUrl.startsWith("http") && !actualUrl.includes("duckduckgo.com")) {
          titleMatches.push({ url: actualUrl, title })
        }
      }

      while ((match = snippetRegex.exec(html)) !== null) {
        snippets.push(match[1].replace(/<[^>]+>/g, "").trim())
      }

      for (let i = 0; i < titleMatches.length; i++) {
        results.push({
          url: titleMatches[i].url,
          title: titleMatches[i].title,
          snippet: snippets[i] || "",
        })
      }
    }
  } catch (error) {
    return {
      query,
      contextHint,
      results: [],
      error: error instanceof Error ? error.message : "Search failed",
    }
  }

  return { query, contextHint, results }
}

async function scrapeWebPage(url: string, extractionHint?: string) {
  try {
    new URL(url)
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
        "Accept": "text/html,application/xhtml+xml,*/*;q=0.8",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
    })

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}`, content: null }
    }

    const html = await response.text()
    return {
      success: true,
      url,
      extractionHint,
      content: extractTextFromHTML(html).slice(0, 8000),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to scrape page",
      content: null,
    }
  }
}

function extractTextFromHTML(html: string): string {
  const sections: string[] = []
  const jsonLdRe = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let match: RegExpExecArray | null
  while ((match = jsonLdRe.exec(html)) !== null) {
    try {
      const raw = JSON.parse(match[1].trim())
      const items = Array.isArray(raw) ? raw : [raw]
      for (const item of items) {
        const lines: string[] = []
        const value = (input: unknown) => input ? String(input) : ""
        if ((item as Record<string, unknown>).name) lines.push(`Name: ${value((item as Record<string, unknown>).name)}`)
        if ((item as Record<string, unknown>).telephone) lines.push(`Phone: ${value((item as Record<string, unknown>).telephone)}`)
        if ((item as Record<string, unknown>).email) lines.push(`Email: ${value((item as Record<string, unknown>).email)}`)
        if ((item as Record<string, unknown>).url) lines.push(`Website: ${value((item as Record<string, unknown>).url)}`)
        if ((item as Record<string, unknown>).address) {
          const address = (item as Record<string, unknown>).address as Record<string, string>
          if (typeof address === "string") lines.push(`Address: ${address}`)
          else lines.push(`Address: ${[address.streetAddress, address.addressLocality, address.addressRegion, address.postalCode, address.addressCountry].filter(Boolean).join(", ")}`)
        }
        if ((item as Record<string, unknown>).openingHours) lines.push(`Opening Hours: ${Array.isArray((item as Record<string, unknown>).openingHours) ? ((item as Record<string, unknown>).openingHours as string[]).join(", ") : (item as Record<string, unknown>).openingHours}`)
        if (lines.length > 0) sections.push(lines.join("\n"))
      }
    } catch {
      // Ignore invalid JSON-LD.
    }
  }

  const bodyText = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim()

  sections.push(bodyText)
  return sections.join("\n\n")
}

function previewValue(value: unknown, maxLength = 1000): string {
  try {
    const text = typeof value === "string" ? value : JSON.stringify(value, null, 2)
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
  } catch {
    return String(value)
  }
}

function getColLabel(index: number): string {
  let label = ""
  let num = index
  while (num >= 0) {
    label = String.fromCharCode(65 + (num % 26)) + label
    num = Math.floor(num / 26) - 1
  }
  return label
}
