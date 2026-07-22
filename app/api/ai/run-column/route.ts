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
  headers?: string[]
  numRows: number
  numCols: number
  /** If provided, only process these zero-based spreadsheet row indices. */
  selectedRows?: number[]
}

function getBillableRowCount(numRows: number, selectedRows?: number[]) {
  if (selectedRows && selectedRows.length > 0) {
    return new Set(selectedRows.filter((row) => row >= 0 && row < numRows)).size
  }

  return Math.max(0, numRows)
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Helpers Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

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
  const sections: string[] = []

  const jsonLdRe = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let match: RegExpExecArray | null
  while ((match = jsonLdRe.exec(html)) !== null) {
    try {
      const raw = JSON.parse(match[1].trim())
      const items: Record<string, unknown>[] = Array.isArray(raw) ? raw : [raw]
      for (const item of items) {
        const lines: string[] = []
        const val = (input: unknown) => input ? String(input) : ""
        if (item.name) lines.push(`Name: ${val(item.name)}`)
        if (item.description) lines.push(`Description: ${val(item.description).slice(0, 240)}`)
        if (item.telephone) lines.push(`Phone: ${val(item.telephone)}`)
        if (item.email) lines.push(`Email: ${val(item.email)}`)
        if (item.url) lines.push(`Website: ${val(item.url)}`)
        if (item.address) {
          const address = item.address as Record<string, string>
          if (typeof address === "string") lines.push(`Address: ${address}`)
          else lines.push(`Address: ${[address.streetAddress, address.addressLocality, address.addressRegion, address.postalCode, address.addressCountry].filter(Boolean).join(", ")}`)
        }
        if (item.openingHours) lines.push(`Opening Hours: ${Array.isArray(item.openingHours) ? (item.openingHours as string[]).join(", ") : item.openingHours}`)
        if (lines.length > 0) sections.push(lines.join("\n"))
      }
    } catch {
      // Ignore invalid JSON-LD.
    }
  }

  const metaDescription = html.match(/<meta[^>]+(?:name|property)=["'](?:description|og:description)["'][^>]+content=["']([^"']+)["']/i)
  if (metaDescription?.[1]) sections.push(`Meta Description: ${metaDescription[1].slice(0, 240)}`)

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
  return sections.join("\n\n").trim()
}

function applyColumnReferences(prompt: string, row: number, cells: Record<string, string>): string {
  return prompt.replace(/\{\{\s*([A-Z]+)\s*\}\}/gi, (_match, label: string) => {
    let index = 0
    for (const char of label.toUpperCase()) index = index * 26 + char.charCodeAt(0) - 64
    return cells[`${row}-${index - 1}`] || ""
  })
}

function cleanExtractedValue(value: string): string {
  return value
    .trim()
    .replace(/^```(?:text)?\s*/i, "")
    .replace(/```$/, "")
    .replace(/^(?:answer|value|email|phone|telephone|website|url|opening hours?)\s*:\s*/i, "")
    .replace(/^['"`]|['"`]$/g, "")
    .trim()
}

function getLookupTerms(prompt: string): string {
  const lower = prompt.toLowerCase()
  if (/email|e-mail/.test(lower)) return "email contact"
  if (/phone|telephone|mobile/.test(lower)) return "phone contact"
  if (/opening hours|business hours|hours/.test(lower)) return "opening hours"
  if (/website|homepage|\burl\b/.test(lower)) return "official website"
  if (/linkedin/.test(lower)) return "official LinkedIn"
  if (/address|location/.test(lower)) return "address"
  return prompt
    .replace(/\b(find|get|look up|search for|fetch|retrieve|what is|what are|of each row|of each|for each|for the|of the|please|show me|tell me|give me|i want|all rows)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim() || prompt
}

function isLikelyOfficialResult(result: SearchResult, entity: string): boolean {
  if (!result.url) return false
  let host = ""
  try { host = new URL(result.url).hostname.toLowerCase().replace(/^www\./, "") } catch { return false }
  if (/^(?:facebook|instagram|linkedin|tripadvisor|yelp|wikipedia|tiktok|youtube)\./.test(host) || host === "x.com") return false
  const tokens = entity.toLowerCase().split(/[^a-z0-9]+/).filter(token => token.length > 2)
  const haystack = `${host} ${result.title}`.toLowerCase()
  return tokens.some(token => haystack.includes(token))
}

function normalizeUrl(raw: string): string | null {
  const value = raw.trim()
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(value)) return `https://${value}`
  return null
}
// Direct search Ã¢â‚¬â€ no AI involved, guaranteed to actually hit the web
type SearchResult = { title: string; snippet: string; url: string }

async function doSearch(query: string): Promise<SearchResult[]> {
  try {
    const results: SearchResult[] = []

    // Prefer Google's index when configured. DuckDuckGo's HTML endpoint is often
    // blocked in production and was the main reason enrichment returned N/A.
    if (process.env.SERPER_API_KEY) {
      try {
        const serperResponse = await fetch("https://google.serper.dev/search", {
          method: "POST",
          headers: {
            "X-API-KEY": process.env.SERPER_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ q: query, num: 10 }),
          signal: AbortSignal.timeout(10000),
        })
        if (serperResponse.ok) {
          const data = await serperResponse.json() as {
            organic?: { title?: string; snippet?: string; link?: string }[]
            knowledgeGraph?: Record<string, unknown> & { title?: string; description?: string; website?: string }
            answerBox?: Record<string, unknown>
          }
          const knowledge = data.knowledgeGraph
          if (knowledge) {
            const details = Object.entries(knowledge)
              .filter(([key, value]) => !["imageUrl", "attributes"].includes(key) && typeof value !== "object")
              .map(([key, value]) => `${key}: ${String(value)}`)
            if (knowledge.attributes && typeof knowledge.attributes === "object") {
              details.push(...Object.entries(knowledge.attributes as Record<string, unknown>).map(([key, value]) => `${key}: ${String(value)}`))
            }
            results.push({
              title: knowledge.title || query,
              snippet: [knowledge.description, ...details].filter(Boolean).join(" | "),
              url: knowledge.website || "",
            })
          }
          if (data.answerBox) {
            results.push({
              title: "Google answer",
              snippet: Object.entries(data.answerBox).map(([key, value]) => `${key}: ${typeof value === "string" ? value : JSON.stringify(value)}`).join(" | "),
              url: "",
            })
          }
          for (const item of data.organic || []) {
            if (item.link) results.push({ title: item.title || "", snippet: item.snippet || "", url: item.link })
          }
          if (results.length > 0) return results.slice(0, 10)
        }
      } catch {
        // Fall through to the free search fallback.
      }
    }
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

// Direct scrape Ã¢â‚¬â€ no AI involved
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
// Defaults aggressively to web Ã¢â‚¬â€ only returns false for obvious transformations.
async function taskNeedsWebSearch(prompt: string, headers: string[]): Promise<boolean> {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Is this spreadsheet column task a PURE TEXT TRANSFORMATION that can be done using ONLY the data already visible in the row, with no need to look up anything from the internet?

Pure transformations (reply "transform"): uppercase/lowercase, reformat dates, split/join text, translate language, math calculation, classify text that is fully visible in the row.

Web lookups (reply "web"): finding emails, phone numbers, website URLs, company info, people's names/titles, addresses, descriptions, prices, or social media profiles; anything that needs NEW information not already in the row.

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
  headers: string[] | undefined,
  sourceCol: number,
  selectedRows: number[] | undefined,
  send: (obj: object) => void
) {
  if (!process.env.OPENAI_API_KEY) {
    send({ type: "error", content: "OpenAI API key not configured." })
    return
  }

  const colLabels = Array.from({ length: numCols }, (_, i) => getColLabel(i))
  const headerValues = Array.from({ length: numCols }, (_, c) => headers?.[c] || colLabels[c])

  // Determine row scope: selected rows OR all data rows
  const rowsToProcess =
    selectedRows && selectedRows.length > 0
      ? [...new Set(selectedRows.filter(r => r >= 0 && r < numRows))]
      : Array.from({ length: numRows }, (_, i) => i)

  if (rowsToProcess.length === 0) {
    send({ type: "error", content: "No rows to process." })
    return
  }

  const scopeLabel = selectedRows && selectedRows.length > 0
    ? `${selectedRows.length} selected row${selectedRows.length > 1 ? "s" : ""}`
    : `all ${numRows} rows`

  // Decide pipeline: web search or pure derivation
  const isWebType = colType === "AI Web"
  const requiresWeb = isWebType || await taskNeedsWebSearch(prompt, headerValues)

  if (!requiresWeb) {
    // Ã¢â€â‚¬Ã¢â€â‚¬ Pure derivation (format, translate, categorize, calculate) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    send({ type: "thinking", content: `Deriving values for ${scopeLabel}...` })

    let rowContext = ""
    for (const r of rowsToProcess) {
      const parts: string[] = []
      for (let c = 0; c < numCols; c++) {
        const v = cells[`${r}-${c}`]
        if (v) parts.push(`${colLabels[c]}: "${v}"`)
      }
      if (parts.length) {
        const rowInstruction = applyColumnReferences(prompt, r, cells)
        rowContext += `Row ${r}: ${parts.join(" | ")} | Instruction: "${rowInstruction}"\n`
      }
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
{"updates":[{"row":${rowsToProcess[0]},"value":"..."}],"summary":"..."}
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
    const allowedRows = new Set(rowsToProcess)
    for (const { row, value } of parsed.updates) {
      if (allowedRows.has(row)) updates[`${row}-${colIdx}`] = String(value ?? "")
    }
    send({ type: "result", data: { success: true, updates, summary: parsed.summary || `Filled ${parsed.updates.length} cells` } })
    return
  }

  // Ã¢â€â‚¬Ã¢â€â‚¬ Deterministic per-row web search + validation + retry pipeline Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  send({ type: "thinking", content: `Searching the web for ${scopeLabel}...` })

  const updates: { [key: string]: string } = {}
  let found = 0

  for (const r of rowsToProcess) {
    // Build entity string from existing row values
    const rowValues: string[] = []
    const labeledValues: string[] = []
    for (let c = 0; c < numCols; c++) {
      const v = cells[`${r}-${c}`]
      if (v && c !== colIdx) {
        rowValues.push(v)
        labeledValues.push(`${headerValues[c]}: ${v}`)
      }
    }
    if (!rowValues.length) continue

    const sourceValue = cells[`${r}-${sourceCol}`]?.trim()
    const entityStr = sourceValue || rowValues[0]
    const resolvedPrompt = applyColumnReferences(prompt, r, cells)
    send({ type: "thinking", content: `Row ${r + 1}: ${entityStr.slice(0, 50)}` })

    let finalValue = "N/A"

    // Convert the task description into focused search terms
    // e.g. "find emails of each school" Ã¢â€ â€™ "email contact"
    const searchTerms = getLookupTerms(resolvedPrompt)

    // Up to 2 search attempts with different queries
    const queries = [
      `"${entityStr}" ${searchTerms}`,
      `"${entityStr}" ${searchTerms} official`,
    ]

    console.log(`[RunColumn] Row ${r}: entity="${entityStr}" task="${prompt}" query="${queries[0]}"`)

    for (let attempt = 0; attempt < queries.length; attempt++) {
      const query = queries[attempt]
      if (attempt > 0) {
        send({ type: "thinking", content: `Row ${r + 1}: retrying with a refined search...` })
      }

      // Step 1 Ã¢â‚¬â€ always search (no AI choice)
      const results = await doSearch(query)
      results.sort((a, b) => Number(isLikelyOfficialResult(b, entityStr)) - Number(isLikelyOfficialResult(a, entityStr)))
      let context = results.map(sr => `[${sr.title}] ${sr.snippet} (${sr.url})`).join("\n")
      console.log(`[RunColumn] Row ${r} attempt ${attempt}: got ${results.length} results, context length=${context.length}`)

      // A Website/Domain source is stronger evidence than a search result. Read it
      // directly before trying ranked result pages.
      const directUrl = sourceValue ? normalizeUrl(sourceValue) : null
      if (directUrl) {
        const directPage = await doScrape(directUrl)
        if (directPage) context = `OFFICIAL SOURCE: ${directUrl}\n${directPage}\n\n${context}`
      }

      // Step 2 Ã¢â‚¬â€ always scrape the top result to get full page content
      // (snippets rarely contain structured data like emails/phones)
      if (results[0]?.url) {
        send({ type: "thinking", content: `Reading: ${results[0].url.replace(/^https?:\/\//, "").slice(0, 55)}` })
        const page = await doScrape(results[0].url)
        if (page) {
          context += "\n\n" + page
          console.log(`[RunColumn] Row ${r}: scraped ${page.length} chars from ${results[0].url}`)
        }
      }

      if (!context.trim()) continue

      // Step 3 Ã¢â‚¬â€ strict AI extraction from real context only
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

Find the exact "${resolvedPrompt}" for this row:
${labeledValues.join(" | ")}

Output rules:
- Output the raw value only (e.g. email address only, not "Email: user@example.com")
- The value MUST appear in the web data
- If not found: N/A`,
      })

      const candidate = cleanExtractedValue(text) || "N/A"

      // Step 4 Ã¢â‚¬â€ validate the extracted value is real and format-correct
      if (candidate !== "N/A" && validateExtracted(candidate, resolvedPrompt, context)) {
        finalValue = candidate
        break // valid Ã¢â‚¬â€ stop retrying
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
  selectedRows: number[] | undefined,
  send: (obj: object) => void
) {
  const updates: { [key: string]: string } = {}
  let scraped = 0

  const rowsToProcess =
    selectedRows && selectedRows.length > 0
      ? [...new Set(selectedRows.filter((row) => row >= 0 && row < numRows))]
      : Array.from({ length: Math.max(0, numRows) }, (_, i) => i)

  if (rowsToProcess.length === 0) {
    send({ type: "error", content: "No rows to process." })
    return
  }

  send({ type: "thinking", content: `Scraping URLs from column ${getColLabel(sourceCol)} for ${rowsToProcess.length} row${rowsToProcess.length === 1 ? "" : "s"}...` })

  for (const r of rowsToProcess) {
    const rawValue = cells[`${r}-${sourceCol}`] ?? ""
    const url = normalizeUrl(rawValue)
    if (!url) continue

    send({ type: "thinking", content: `Reading row ${r + 1}: ${url.replace(/^https?:\/\//, "").slice(0, 50)}` })

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
  selectedRows: number[] | undefined,
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
  const rowsToProcess = selectedRows?.length
    ? [...new Set(selectedRows.filter(row => row >= 0 && row < numRows))]
    : Array.from({ length: numRows }, (_, row) => row)
  for (const r of rowsToProcess) {
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
  selectedRows: number[] | undefined,
  send: (obj: object) => void
) {
  const updates: { [key: string]: string } = {}
  const rowsToProcess = selectedRows?.length
    ? [...new Set(selectedRows.filter(row => row >= 0 && row < numRows))]
    : Array.from({ length: numRows }, (_, row) => row)
  for (const r of rowsToProcess) {
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
  selectedRows: number[] | undefined,
  send: (obj: object) => void
) {
  if (!process.env.OPENAI_API_KEY) {
    send({ type: "error", content: "OpenAI API key not configured." })
    return
  }

  const updates: { [key: string]: string } = {}
  let processed = 0

  send({ type: "thinking", content: `Reading files from column ${getColLabel(sourceCol)}...` })

  const rowsToProcess = selectedRows?.length
    ? [...new Set(selectedRows.filter(row => row >= 0 && row < numRows))]
    : Array.from({ length: numRows }, (_, row) => row)
  for (const r of rowsToProcess) {
    const fileRef = (cells[`${r}-${sourceCol}`] ?? "").trim()
    if (!fileRef) continue

    send({ type: "thinking", content: `Row ${r + 1}: ${fileRef.slice(0, 60)}` })

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
          // Pass as data URL string Ã¢â‚¬â€ Buffer objects get stripped by AI SDK v6 Zod validation
          content.push({ type: "image", image: fileRef })
        } else if (mimeType === "application/pdf") {
          // AI SDK v6 uses "mediaType" (not "mimeType") for file parts
          content.push({ type: "file", data: fileRef, mediaType: "application/pdf" })
        } else {
          // Plain text / CSV Ã¢â‚¬â€ decode directly, no AI needed
          updates[`${r}-${colIdx}`] = Buffer.from(base64Data, "base64").toString("utf-8").slice(0, 4000)
          processed++
          skipAI = true
        }
      } else {
        // Remote URL
        const url = fileRef.startsWith("http") ? fileRef : `https://${fileRef}`
        const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? ""

        if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
          // Pass URL as string Ã¢â‚¬â€ new URL() instances get stripped by AI SDK v6 Zod validation
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
  const { colIdx, colType, prompt = "", sourceCol = 0, regex = "", cells, headers, numRows, numCols, selectedRows } = body

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
  const billingQuantity = getBillableRowCount(numRows, selectedRows)

  if (actionKey) {
    try {
      const billing = await chargeCreditsForAction(
        request,
        actionKey,
        `Run column: ${colType} (${billingQuantity} row${billingQuantity === 1 ? "" : "s"})`,
        Math.max(1, billingQuantity)
      )
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
          await runAIColumn(colIdx, colType, prompt, cells, numRows, numCols, headers, sourceCol, selectedRows, send)
        } else if (colType === "Scrape Website") {
          await runScrapeColumn(colIdx, sourceCol, cells, numRows, selectedRows, send)
        } else if (colType === "Regex") {
          runRegexColumn(colIdx, sourceCol, regex, cells, numRows, selectedRows, send)
        } else if (colType === "Normalize Company" || colType === "Normalize Domain") {
          runNormalizeColumn(colIdx, colType, sourceCol, cells, numRows, selectedRows, send)
        } else if (colType === "Read File") {
          await runReadFileColumn(colIdx, sourceCol, cells, numRows, selectedRows, send)
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

