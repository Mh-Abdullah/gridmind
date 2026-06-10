import { NextRequest } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

import { chargeCreditsForAction, refundCredits } from "@/lib/billing-server"

interface RunColumnRequest {
  colIdx: number
  colType: string
  prompt?: string
  sourceCol?: number
  regex?: string
  cells: { [key: string]: string }
  numRows: number
  numCols: number
  /** If provided, only process these specific row indices (1-based, excluding header row 0) */
  selectedRows?: number[]
}

// ── Helpers ────────────────────────────────────────────────────────────────

function getColLabel(index: number): string {
  let label = ""
  let num = index
  while (num >= 0) {
    label = String.fromCharCode(65 + (num % 26)) + label
    num = Math.floor(num / 26) - 1
  }
  return label
}

function extractTextFromHTML(html: string): string {
  return html
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
}

// Direct search — no AI involved, guaranteed to actually hit the web
async function doSearch(query: string): Promise<{ title: string; snippet: string; url: string }[]> {
  try {
    const results: { title: string; snippet: string; url: string }[] = []
    const response = await fetch(
      `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,*/*;q=0.8",
          "Referer": "https://duckduckgo.com/",
        },
        signal: AbortSignal.timeout(10000),
      }
    )
    if (!response.ok) return results
    const html = await response.text()

    const titleRegex = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi
    const snippetRegex = /<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi
    const titleMatches: { url: string; title: string }[] = []
    const snippets: string[] = []
    let m: RegExpExecArray | null

    while ((m = titleRegex.exec(html)) !== null && titleMatches.length < 5) {
      let actualUrl = m[1]
      const title = m[2].replace(/<[^>]+>/g, "").trim()
      if (actualUrl.includes("uddg=")) {
        try {
          const uddg = new URLSearchParams(actualUrl.includes("?") ? actualUrl.split("?")[1] : actualUrl).get("uddg")
          if (uddg) actualUrl = decodeURIComponent(uddg)
        } catch { /* keep original */ }
      }
      if (actualUrl.startsWith("http") && !actualUrl.includes("duckduckgo.com")) {
        titleMatches.push({ url: actualUrl, title })
      }
    }
    while ((m = snippetRegex.exec(html)) !== null) {
      snippets.push(m[1].replace(/<[^>]+>/g, "").trim())
    }
    for (let i = 0; i < titleMatches.length; i++) {
      results.push({ url: titleMatches[i].url, title: titleMatches[i].title, snippet: snippets[i] || "" })
    }

    // Fallback: DuckDuckGo Instant Answer
    if (results.length === 0) {
      const jr = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
        { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(8000) }
      )
      if (jr.ok) {
        const d = await jr.json() as { AbstractText?: string; AbstractURL?: string; Heading?: string }
        if (d.AbstractText) results.push({ url: d.AbstractURL || "", title: d.Heading || query, snippet: d.AbstractText })
      }
    }
    return results
  } catch {
    return []
  }
}

// Direct scrape — no AI involved
async function doScrape(url: string): Promise<string> {
  try {
    new URL(url)
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) return ""
    return extractTextFromHTML(await response.text()).slice(0, 5000)
  } catch {
    return ""
  }
}

// Ask AI whether this task is a PURE text transformation with no external lookup needed.
// Defaults aggressively to web — only returns false for obvious transformations.
async function taskNeedsWebSearch(prompt: string, headers: string[]): Promise<boolean> {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Is this spreadsheet column task a PURE TEXT TRANSFORMATION that can be done using ONLY the data already visible in the row — with no need to look up anything from the internet?

Pure transformations (reply "transform"): uppercase/lowercase, reformat dates, split/join text, translate language, math calculation, classify text that is fully visible in the row.

Web lookups (reply "web"): finding emails, phone numbers, website URLs, company info, people's names/titles, addresses, descriptions, prices, social media profiles — anything that needs NEW information not already in the row.

Column headers: ${headers.join(", ")}
Task: "${prompt}"

If there is ANY doubt, reply "web".
Reply with exactly one word: "web" or "transform".`,
  })
  return !text.trim().toLowerCase().startsWith("transform")
}

/**
 * Validate that an extracted value is genuinely of the expected type.
 * Returns true if the value looks real, false if it looks fabricated or wrong format.
 */
function validateExtracted(value: string, prompt: string, context: string): boolean {
  if (!value || value === "N/A" || value.trim().length < 2) return false

  const lp = prompt.toLowerCase()
  const val = value.trim()

  // Format-specific validation
  if (lp.includes("email")) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) return false
    // Email domain must appear in context
    const domain = val.split("@")[1]?.split(".")[0]
    return !domain || context.toLowerCase().includes(domain.toLowerCase())
  }
  if (lp.includes("phone") || lp.includes("telephone") || lp.includes("mobile")) {
    if (!/[\d]{7,}/.test(val.replace(/[\s\-\(\)\+\.]/g, ""))) return false
  }
  if (lp.includes("url") || lp.includes("website") || lp.includes("homepage")) {
    if (!/^https?:\/\//i.test(val) && !val.includes(".")) return false
  }
  if (lp.includes("linkedin")) {
    if (!val.includes("linkedin.com")) return false
  }

  // Ground truth: core of the value must appear somewhere in the scraped context
  const core = val
    .replace(/^https?:\/\/(www\.)?/, "")
    .split(/[@/\s]/)[0]
    .toLowerCase()
  if (core.length > 3 && !context.toLowerCase().includes(core)) return false

  return true
}

async function runAIColumn(
  colIdx: number,
  colType: string,
  prompt: string,
  cells: { [key: string]: string },
  numRows: number,
  numCols: number,
  selectedRows: number[] | undefined,
  send: (obj: object) => void
) {
  if (!process.env.OPENAI_API_KEY) {
    send({ type: "error", content: "OpenAI API key not configured." })
    return
  }

  const colLabels = Array.from({ length: numCols }, (_, i) => getColLabel(i))
  const headerValues = Array.from({ length: numCols }, (_, c) => cells[`0-${c}`] || colLabels[c])

  // Determine row scope: selected rows OR all data rows
  const rowsToProcess =
    selectedRows && selectedRows.length > 0
      ? selectedRows.filter(r => r > 0 && r < numRows)
      : Array.from({ length: numRows - 1 }, (_, i) => i + 1)

  if (rowsToProcess.length === 0) {
    send({ type: "error", content: "No rows to process." })
    return
  }

  const scopeLabel = selectedRows && selectedRows.length > 0
    ? `${selectedRows.length} selected row${selectedRows.length > 1 ? "s" : ""}`
    : `all ${numRows - 1} rows`

  // Decide pipeline: web search or pure derivation
  const isWebType = colType === "AI Web"
  const requiresWeb = isWebType || await taskNeedsWebSearch(prompt, headerValues)

  if (!requiresWeb) {
    // ── Pure derivation (format, translate, categorize, calculate) ────────
    send({ type: "thinking", content: `🧠 Deriving values for ${scopeLabel}...` })

    let rowContext = ""
    for (const r of rowsToProcess) {
      const parts: string[] = []
      for (let c = 0; c < numCols; c++) {
        const v = cells[`${r}-${c}`]
        if (v) parts.push(`${colLabels[c]}: "${v}"`)
      }
      if (parts.length) rowContext += `Row ${r}: ${parts.join(" | ")}\n`
    }

    const { text: fullText } = await generateText({
      model: openai(process.env.OPENAI_MODEL || "gpt-4o"),
      system:
        "You are a spreadsheet formula engine. You ONLY transform or derive values from the data explicitly provided in the row. " +
        "You NEVER look up, invent, or guess external facts (emails, phone numbers, URLs, descriptions, addresses, etc.) that are not already present in the row data.",
      prompt: `Fill column ${getColLabel(colIdx)} for rows: ${rowsToProcess.join(", ")}.
Instruction: "${prompt}"
Headers: ${headerValues.join(", ")}

Row data:
${rowContext || "(none)"}

Return ONLY this JSON (no other text):
\`\`\`json
{"updates":[{"row":1,"value":"..."}],"summary":"..."}
\`\`\``,
    })

    let parsed: { updates: { row: number; value: string }[]; summary: string } | null = null
    try {
      const cb = fullText.match(/```json\s*([\s\S]*?)```/)
      if (cb) parsed = JSON.parse(cb[1].trim())
      if (!parsed) { const jm = fullText.match(/\{[\s\S]*\}/); if (jm) parsed = JSON.parse(jm[0]) }
    } catch { /* fall through */ }

    if (!parsed?.updates?.length) {
      send({ type: "error", content: "Could not derive values. Try rephrasing your instruction." })
      return
    }
    const updates: { [key: string]: string } = {}
    for (const { row, value } of parsed.updates) updates[`${row}-${colIdx}`] = value
    send({ type: "result", data: { success: true, updates, summary: parsed.summary || `Filled ${parsed.updates.length} cells` } })
    return
  }

  // ── Deterministic per-row web search + validation + retry pipeline ─────
  send({ type: "thinking", content: `🌐 Searching the web for ${scopeLabel}...` })

  const updates: { [key: string]: string } = {}
  let found = 0

  for (const r of rowsToProcess) {
    // Build entity string from existing row values
    const rowValues: string[] = []
    for (let c = 0; c < numCols; c++) {
      const v = cells[`${r}-${c}`]
      if (v && c !== colIdx) rowValues.push(v)
    }
    if (!rowValues.length) continue

    const entityStr = rowValues.slice(0, 3).join(" ")
    send({ type: "thinking", content: `🔍 Row ${r}: ${entityStr.slice(0, 50)}` })

    let finalValue = "N/A"

    // Convert the task description into focused search terms
    // e.g. "find emails of each school" → "email contact"
    const searchTerms = prompt
      .replace(/\b(find|get|look up|search for|fetch|retrieve|what is|what are|of each row|of each|for each|for the|of the|please|show me|tell me|give me)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim() || prompt

    // Up to 2 search attempts with different queries
    const queries = [
      `${entityStr} ${searchTerms}`,
      `${rowValues[0]} ${searchTerms} official contact`,
    ]

    console.log(`[RunColumn] Row ${r}: entity="${entityStr}" task="${prompt}" query="${queries[0]}"`)

    for (let attempt = 0; attempt < queries.length; attempt++) {
      const query = queries[attempt]
      if (attempt > 0) {
        send({ type: "thinking", content: `🔄 Row ${r}: retrying with refined query...` })
      }

      // Step 1 — always search (no AI choice)
      const results = await doSearch(query)
      let context = results.map(sr => `[${sr.title}] ${sr.snippet} (${sr.url})`).join("\n")
      console.log(`[RunColumn] Row ${r} attempt ${attempt}: got ${results.length} results, context length=${context.length}`)

      // Step 2 — always scrape the top result to get full page content
      // (snippets rarely contain structured data like emails/phones)
      if (results[0]?.url) {
        send({ type: "thinking", content: `📄 Reading: ${results[0].url.replace(/^https?:\/\//, "").slice(0, 55)}` })
        const page = await doScrape(results[0].url)
        if (page) {
          context += "\n\n" + page
          console.log(`[RunColumn] Row ${r}: scraped ${page.length} chars from ${results[0].url}`)
        }
      }

      if (!context.trim()) continue

      // Step 3 — strict AI extraction from real context only
      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        system:
          "You are a data extraction tool. You output ONLY values that are explicitly and literally present in the provided web data. " +
          "You never infer, complete, guess, or generate any value that does not appear verbatim in the text. " +
          "If the requested value is absent, output exactly: N/A",
        prompt: `Web data (real, scraped):
---
${context.slice(0, 3500)}
---

Find the exact "${prompt}" for: ${rowValues.join(", ")}

Output rules:
- Output the raw value only (e.g. email address only, not "Email: user@example.com")
- The value MUST appear in the web data
- If not found: N/A`,
      })

      const candidate = text.trim() || "N/A"

      // Step 4 — validate the extracted value is real and format-correct
      if (candidate !== "N/A" && validateExtracted(candidate, prompt, context)) {
        finalValue = candidate
        break // valid — stop retrying
      }
      // else: retry with next query
    }

    updates[`${r}-${colIdx}`] = finalValue
    if (finalValue !== "N/A") found++
  }

  send({
    type: "result",
    data: {
      success: true,
      updates,
      summary: `Found verified data for ${found} of ${rowsToProcess.length} rows`,
    },
  })
}

async function runScrapeColumn(
  colIdx: number,
  sourceCol: number,
  cells: { [key: string]: string },
  numRows: number,
  send: (obj: object) => void
) {
  const updates: { [key: string]: string } = {}
  let scraped = 0

  send({ type: "thinking", content: `🌐 Scraping URLs from column ${getColLabel(sourceCol)}...` })

  for (let r = 0; r < numRows; r++) {
    const url = (cells[`${r}-${sourceCol}`] ?? "").trim()
    if (!url || !/^https?:\/\//i.test(url)) continue

    send({ type: "thinking", content: `📄 Scraping row ${r + 1}: ${url.replace(/^https?:\/\//, "").slice(0, 50)}` })

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,*/*;q=0.8",
        },
        signal: AbortSignal.timeout(10000),
      })
      if (!response.ok) continue
      const html = await response.text()
      const content = extractTextFromHTML(html).slice(0, 4000)
      if (content) {
        updates[`${r}-${colIdx}`] = content
        scraped++
      }
    } catch {
      // skip failed URLs
    }
  }

  send({
    type: "result",
    data: { success: true, updates, summary: `Scraped ${scraped} URL${scraped !== 1 ? "s" : ""}` },
  })
}

function runRegexColumn(
  colIdx: number,
  sourceCol: number,
  pattern: string,
  cells: { [key: string]: string },
  numRows: number,
  send: (obj: object) => void
) {
  const updates: { [key: string]: string } = {}
  let re: RegExp
  try {
    re = new RegExp(pattern)
  } catch {
    send({ type: "error", content: `Invalid regex pattern: ${pattern}` })
    return
  }
  for (let r = 0; r < numRows; r++) {
    const val = cells[`${r}-${sourceCol}`] ?? ""
    const m = val.match(re)
    updates[`${r}-${colIdx}`] = m ? (m[1] ?? m[0]) : ""
  }
  send({ type: "result", data: { success: true, updates, summary: `Applied regex to ${numRows} rows` } })
}

function runNormalizeColumn(
  colIdx: number,
  colType: string,
  sourceCol: number,
  cells: { [key: string]: string },
  numRows: number,
  send: (obj: object) => void
) {
  const updates: { [key: string]: string } = {}
  for (let r = 0; r < numRows; r++) {
    const val = (cells[`${r}-${sourceCol}`] ?? "").trim()
    if (!val) continue
    if (colType === "Normalize Domain") {
      try {
        updates[`${r}-${colIdx}`] = new URL(val.startsWith("http") ? val : `https://${val}`).hostname.replace(/^www\./, "")
      } catch {
        updates[`${r}-${colIdx}`] = val
      }
    } else {
      updates[`${r}-${colIdx}`] = val
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase())
        .replace(/\bInc\b|\bLlc\b|\bLtd\b|\bCorp\b/g, s => s.toUpperCase())
    }
  }
  send({ type: "result", data: { success: true, updates, summary: `Normalized ${Object.keys(updates).length} values` } })
}

async function runReadFileColumn(
  colIdx: number,
  sourceCol: number,
  cells: { [key: string]: string },
  numRows: number,
  send: (obj: object) => void
) {
  if (!process.env.OPENAI_API_KEY) {
    send({ type: "error", content: "OpenAI API key not configured." })
    return
  }

  const updates: { [key: string]: string } = {}
  let processed = 0

  send({ type: "thinking", content: `📂 Reading files from column ${getColLabel(sourceCol)}...` })

  for (let r = 0; r < numRows; r++) {
    const fileRef = (cells[`${r}-${sourceCol}`] ?? "").trim()
    if (!fileRef) continue

    send({ type: "thinking", content: `📄 Row ${r + 1}: ${fileRef.slice(0, 60)}` })

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const content: any[] = [
        { type: "text", text: "Extract all text and meaningful content from this file. Return only the extracted content." },
      ]
      let skipAI = false

      if (fileRef.startsWith("data:")) {
        // Local upload stored as data URL
        const match = fileRef.match(/^data:([^;]+);base64,(.+)$/)
        if (!match) continue
        const mimeType = match[1]
        const base64Data = match[2]

        if (mimeType.startsWith("image/")) {
          // Pass as data URL string — Buffer objects get stripped by AI SDK v6 Zod validation
          content.push({ type: "image", image: fileRef })
        } else if (mimeType === "application/pdf") {
          // AI SDK v6 uses "mediaType" (not "mimeType") for file parts
          content.push({ type: "file", data: fileRef, mediaType: "application/pdf" })
        } else {
          // Plain text / CSV — decode directly, no AI needed
          updates[`${r}-${colIdx}`] = Buffer.from(base64Data, "base64").toString("utf-8").slice(0, 4000)
          processed++
          skipAI = true
        }
      } else {
        // Remote URL
        const url = fileRef.startsWith("http") ? fileRef : `https://${fileRef}`
        const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? ""

        if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
          // Pass URL as string — new URL() instances get stripped by AI SDK v6 Zod validation
          content.push({ type: "image", image: url })
        } else if (ext === "pdf") {
          const res = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0" },
            signal: AbortSignal.timeout(15000),
          })
          if (!res.ok) continue
          const b64 = Buffer.from(await res.arrayBuffer()).toString("base64")
          // AI SDK v6 uses "mediaType" (not "mimeType") for file parts; data must be a data URL string
          content.push({ type: "file", data: `data:application/pdf;base64,${b64}`, mediaType: "application/pdf" })
        } else {
          // Plain fetch for text-based files
          const res = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0" },
            signal: AbortSignal.timeout(10000),
          })
          if (!res.ok) continue
          updates[`${r}-${colIdx}`] = extractTextFromHTML(await res.text()).slice(0, 4000)
          processed++
          skipAI = true
        }
      }

      if (!skipAI) {
        const { text } = await generateText({
          model: openai(process.env.OPENAI_MODEL || "gpt-4o"),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          messages: [{ role: "user", content }] as any,
        })
        updates[`${r}-${colIdx}`] = text.trim()
        processed++
      }
    } catch (err) {
      console.error(`[ReadFile] Row ${r} failed:`, err)
    }
  }

  send({
    type: "result",
    data: { success: true, updates, summary: `Processed ${processed} file${processed !== 1 ? "s" : ""}` },
  })
}

export async function POST(request: NextRequest) {
  const body: RunColumnRequest = await request.json()
  const { colIdx, colType, prompt = "", sourceCol = 0, regex = "", cells, numRows, numCols, selectedRows } = body

  const requiresOpenAI = colType === "AI Agent" || colType === "AI Web" || colType === "Read File"
  if (requiresOpenAI && !process.env.OPENAI_API_KEY) {
    return new Response(`data: ${JSON.stringify({ type: "error", content: "OpenAI API key not configured." })}\n\ndata: [DONE]\n\n`, {
      status: 503,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    })
  }

  const billableActionByColumnType: Record<string, string> = {
    "AI Agent": "run_column_ai",
    "AI Web": "run_column_ai",
    "Scrape Website": "run_column_scrape",
    "Read File": "run_column_read_file",
  }

  const actionKey = billableActionByColumnType[colType]
  let billingUserId: string | null = null
  let billingTransactionId: string | null = null

  if (actionKey) {
    try {
      const billing = await chargeCreditsForAction(request, actionKey, `Run column: ${colType}`)
      if (!billing.charge.skipped) {
        billingUserId = billing.user.id
        billingTransactionId = String(billing.charge.transactionId)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Billing failed"
      return new Response(`data: ${JSON.stringify({ type: "error", content: message })}\n\ndata: [DONE]\n\n`, {
        status: message.includes("Authentication required") ? 401 : message.includes("Not enough credits") ? 402 : 500,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      })
    }
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`))

      try {
        if (colType === "AI Agent" || colType === "AI Web") {
          await runAIColumn(colIdx, colType, prompt, cells, numRows, numCols, selectedRows, send)
        } else if (colType === "Scrape Website") {
          await runScrapeColumn(colIdx, sourceCol, cells, numRows, send)
        } else if (colType === "Regex") {
          runRegexColumn(colIdx, sourceCol, regex, cells, numRows, send)
        } else if (colType === "Normalize Company" || colType === "Normalize Domain") {
          runNormalizeColumn(colIdx, colType, sourceCol, cells, numRows, send)
        } else if (colType === "Read File") {
          await runReadFileColumn(colIdx, sourceCol, cells, numRows, send)
        } else {
          send({ type: "error", content: `Unknown column type: ${colType}` })
        }
      } catch (error) {
        if (billingTransactionId && billingUserId) {
          await refundCredits(billingUserId, billingTransactionId, `Run column failed: ${colType}`)
        }
        console.error("[RunColumn] error:", error)
        send({ type: "error", content: error instanceof Error ? error.message : "Failed to run column" })
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
