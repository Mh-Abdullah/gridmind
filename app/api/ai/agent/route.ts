import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

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
  cells: { [key: string]: string } // "row-col" -> value
  numRows: number
  numCols: number
  chatHistory?: { role: "user" | "assistant" | "system"; content: string }[]
  selectedCells?: SelectedCell[]
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
  textColor?: string
  backgroundColor?: string
  fontSize?: number
}

interface FormattingChange {
  row: number
  col: number
  format: CellFormatting
}

interface AgentResult {
  changes: CellChange[]
  formatting?: FormattingChange[]
  summary: string
  newNumRows?: number
  newNumCols?: number
}

const AGENT_SYSTEM_PROMPT = `You are GridMind Agent, an AI that directly edits spreadsheet data and formatting.

You receive the full spreadsheet content and a user instruction. Your job is to determine the exact cell value changes AND/OR formatting changes needed, then return them as a JSON object.

CAPABILITIES:
- Edit any cell value (change text, numbers, fix typos, reformat, etc.)
- Delete/clear cell content by setting value to ""
- Add new data rows or columns
- Reformat data (capitalize, lowercase, date formats, etc.)
- Sort/reorganize data by returning re-ordered values
- Calculate and fill in values (totals, derived fields)
- Apply formatting: bold, italic, underline, alignment, text color, background color, font size
- Remove formatting by setting properties to false/null
- Any combination of the above

FORMATTING FIELDS (all optional):
- bold: true | false
- italic: true | false
- underline: true | false
- alignment: "left" | "center" | "right"
- textColor: CSS color string e.g. "#ff0000" or "red"
- backgroundColor: CSS color string e.g. "#ffff00"
- fontSize: number (e.g. 14, 16, 18)

RULES:
- Row and column indices are 0-based; Row 0 is typically the header row
- Only include cells that actually CHANGE — do NOT include unchanged cells
- For value deletions, set value to ""
- If adding rows, set newNumRows to the new total; same for newNumCols
- For formatting: only include changed properties; omit unchanged ones
- If user asks to remove/clear formatting, set the property to its default (false for booleans, null for colors/size)

IMPORTANT — ADDING INFO vs EDITING:
When the user asks to "add more info", "add details", "tell me more about X", "add additional columns", or anything that implies enriching/expanding existing data:
- NEVER overwrite the existing cell that is being referenced
- Instead, write the new information into NEW columns to the RIGHT of the last used column in that row
- Also add an appropriate header in Row 0 for each new column you create
- Update newNumCols to reflect the new total column count
- If the user references a specific cell or selected text, find that row and add the new info in the next available column(s) in the same row
- If no cell is selected, scan the spreadsheet to find the row containing the referenced text, then add the new info in next available column(s)

When the user explicitly asks to EDIT, CHANGE, REPLACE, FIX, or UPDATE a value → overwrite the cell.
When the user asks to ADD, ENRICH, EXPAND, or wants MORE INFO → always use new adjacent columns.

CRITICAL: Your FINAL response MUST be ONLY a JSON object with NO other text:
\`\`\`json
{
  "changes": [
    { "row": 0, "col": 0, "value": "New Value" }
  ],
  "formatting": [
    { "row": 1, "col": 0, "format": { "bold": true, "textColor": "#ff0000" } }
  ],
  "summary": "Brief description of what was changed",
  "newNumRows": 15,
  "newNumCols": 5
}
\`\`\`
Omit "changes" if no values change. Omit "formatting" if no formatting changes. Omit "newNumRows"/"newNumCols" if dimensions did not change.
`

export async function POST(request: NextRequest) {
  try {
    const body: AgentRequest = await request.json()
    const { prompt, cells, numRows, numCols, chatHistory, selectedCells } = body

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured.", success: false },
        { status: 500 }
      )
    }

    // Build a readable spreadsheet snapshot
    const colLabels = Array.from({ length: numCols }, (_, i) => getColLabel(i))

    const tableRows: string[][] = []
    for (let r = 0; r < numRows; r++) {
      const row: string[] = []
      for (let c = 0; c < numCols; c++) {
        row.push(cells[`${r}-${c}`] ?? "")
      }
      tableRows.push(row)
    }

    const headerLine = `     | ${colLabels.map(l => l.padEnd(20)).join(" | ")}`
    const separator = `-`.repeat(headerLine.length)
    const dataLines = tableRows.map((row, r) =>
      `Row${String(r + 1).padStart(2)} | ${row.map(v => (v || "").toString().slice(0, 20).padEnd(20)).join(" | ")}`
    )
    const spreadsheetText = [headerLine, separator, ...dataLines].join("\n")

    // Format recent chat history for context
    const recentHistory = (chatHistory || [])
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-6)
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content.slice(0, 300)}`)
      .join("\n")

    // Find the last used column index across all rows (for "add next to" guidance)
    let lastUsedCol = numCols - 1
    for (let r = 0; r < numRows; r++) {
      for (let c = numCols - 1; c >= 0; c--) {
        if (cells[`${r}-${c}`]) {
          if (c > lastUsedCol) lastUsedCol = c
          break
        }
      }
    }
    const nextFreeCol = lastUsedCol + 1

    // Build selection context block
    let selectionBlock = ""
    if (selectedCells && selectedCells.length > 0) {
      const selLines = selectedCells.map(s => {
        const fmtParts: string[] = []
        if (s.formatting) {
          const f = s.formatting
          if (f.bold) fmtParts.push("bold")
          if (f.italic) fmtParts.push("italic")
          if (f.underline) fmtParts.push("underline")
          if (f.alignment) fmtParts.push(`align:${f.alignment}`)
          if (f.textColor) fmtParts.push(`textColor:${f.textColor}`)
          if (f.backgroundColor) fmtParts.push(`bgColor:${f.backgroundColor}`)
          if (f.fontSize) fmtParts.push(`fontSize:${f.fontSize}`)
        }
        const fmtStr = fmtParts.length > 0 ? ` [${fmtParts.join(", ")}]` : ""
        return `  ${s.colLabel}${s.row + 1} (row=${s.row}, col=${s.col}): "${s.value}"${fmtStr}`
      }).join("\n")

      // Determine last used col in selected rows for precise placement
      const selectedRows = [...new Set(selectedCells.map(s => s.row))]
      const rowLastCols = selectedRows.map(r => {
        let last = numCols - 1
        for (let c = numCols - 1; c >= 0; c--) {
          if (cells[`${r}-${c}`]) { last = c; break }
        }
        return `row ${r}: next free col = ${last + 1} (${getColLabel(last + 1)})`
      }).join(", ")

      selectionBlock = `
SELECTED CELLS (${selectedCells.length} cell${selectedCells.length === 1 ? "" : "s"} — FOCUS YOUR CHANGES ON THESE):
${selLines}

Next free column for adding new data: col ${nextFreeCol} (${getColLabel(nextFreeCol)})
Per-row next free columns: ${rowLastCols}

IMPORTANT: The user has selected specific cells. Apply the instruction ONLY to these selected cells unless the instruction clearly requires changes elsewhere.
If the instruction is about adding/expanding info, place new data in the next free column(s) of the selected rows — do NOT overwrite the selected cells.
`
    } else {
      selectionBlock = `
No cells are selected — apply the instruction to the full spreadsheet as appropriate.
Last used column: col ${lastUsedCol} (${getColLabel(lastUsedCol)}). Next free column for new data: col ${nextFreeCol} (${getColLabel(nextFreeCol)}).
If the instruction asks to add/expand info about specific text, find that text in the spreadsheet and add new data in the next free column(s) of that row.
`
    }

    const userPrompt = `User instruction: ${prompt}
${selectionBlock}
${recentHistory ? `Recent conversation:\n${recentHistory}\n` : ""}
FULL SPREADSHEET CONTENT (${numRows} rows × ${numCols} cols):
${spreadsheetText}

Return the JSON with the required changes.`

    const result = await generateText({
      model: openai(process.env.OPENAI_MODEL || "gpt-4o"),
      system: AGENT_SYSTEM_PROMPT,
      prompt: userPrompt,
    })

    const responseText = result.text
    console.log("[Agent API] Response preview:", responseText?.slice(0, 300))

    // Parse JSON from the response
    let agentData: AgentResult | null = null

    try {
      // Strategy 1: JSON code block
      const codeBlockMatch = responseText.match(/```json\s*([\s\S]*?)```/)
      if (codeBlockMatch) {
        agentData = JSON.parse(codeBlockMatch[1].trim())
      }

      // Strategy 2: Raw JSON object
      if (!agentData) {
        const jsonMatch = responseText.match(/\{[\s\S]*"changes"\s*:[\s\S]*\}/)
        if (jsonMatch) {
          agentData = JSON.parse(jsonMatch[0])
        }
      }

      // Strategy 3: Entire response as JSON
      if (!agentData) {
        agentData = JSON.parse(responseText.trim())
      }
    } catch (e) {
      console.error("[Agent API] Failed to parse JSON:", e)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to parse agent response. Please try again.",
          rawResponse: responseText?.slice(0, 500),
        },
        { status: 500 }
      )
    }

    if (!agentData || (!Array.isArray(agentData.changes) && !Array.isArray(agentData.formatting))) {
      return NextResponse.json(
        { success: false, error: "Invalid agent response format." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      changes: agentData.changes || [],
      formatting: agentData.formatting || [],
      summary: agentData.summary || "Changes applied",
      newNumRows: agentData.newNumRows,
      newNumCols: agentData.newNumCols,
    })
  } catch (error) {
    console.error("[Agent API] error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process agent request",
      },
      { status: 500 }
    )
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


