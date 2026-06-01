import { NextRequest, NextResponse } from "next/server"

// Uses Serper.dev — free tier: 2,500 queries/month
// Set SERPER_API_KEY in .env.local
// Sign up free at https://serper.dev

const LANGUAGE_CODES: Record<string, string> = {
  English: "en",
  German: "de",
  French: "fr",
  Spanish: "es",
  Italian: "it",
  Portuguese: "pt",
  Dutch: "nl",
  Russian: "ru",
  Japanese: "ja",
  Chinese: "zh",
  Arabic: "ar",
  Hindi: "hi",
  Urdu: "ur",
}

const COUNTRY_CODES: Record<string, string> = {
  "United States": "us",
  "United Kingdom": "gb",
  Germany: "de",
  France: "fr",
  Spain: "es",
  Italy: "it",
  Canada: "ca",
  Australia: "au",
  India: "in",
  Pakistan: "pk",
  Japan: "jp",
  Brazil: "br",
  Netherlands: "nl",
  Russia: "ru",
  "Saudi Arabia": "sa",
  "United Arab Emirates": "ae",
}

export async function POST(req: NextRequest) {
  const { query, num = 10, language = "English", country = "United States" } = await req.json()

  if (!query?.trim()) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 })
  }

  const apiKey = process.env.SERPER_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "SERPER_API_KEY not configured" }, { status: 500 })
  }

  const hl = LANGUAGE_CODES[language] ?? "en"
  const gl = COUNTRY_CODES[country] ?? "us"

  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query.trim(), num: Math.min(num, 100), hl, gl }),
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: `Serper API error: ${res.status} ${text}` }, { status: res.status })
    }

    const data = await res.json()

    const results = (data.organic ?? []).map((item: {
      title?: string
      link?: string
      snippet?: string
      displayedLink?: string
      position?: number
    }) => ({
      title: item.title ?? "",
      url: item.link ?? "",
      snippet: item.snippet ?? "",
      displayedLink: item.displayedLink ?? "",
      position: item.position ?? 0,
    }))

    return NextResponse.json({ results, total: results.length })
  } catch (err) {
    console.error("Google search error:", err)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
