import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { chargeCreditsForAction, refundCredits } from "@/lib/billing-server"

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
]
const randomUA = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]

async function scrapeUrl(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": randomUA(),
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "no-cache",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(12000),
  })

  if (!response.ok) throw new Error(`HTTP ${response.status}`)

  const html = await response.text()

  // Strip HTML tags, scripts, styles — extract visible text
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, 8000) // limit tokens

  return text
}

export async function POST(req: NextRequest) {
  try {
    const { type, websiteUrl, icpDescription } = await req.json()

    if (!type || !["website", "icp"].includes(type)) {
      return NextResponse.json({ error: "Invalid type. Use 'website' or 'icp'." }, { status: 400 })
    }

    // Validate inputs before charging so we don't deduct for bad requests
    let parsedUrl: URL | null = null
    if (type === "website") {
      if (!websiteUrl) {
        return NextResponse.json({ error: "websiteUrl is required for website type." }, { status: 400 })
      }
      try {
        parsedUrl = new URL(websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`)
      } catch {
        return NextResponse.json({ error: "Invalid URL." }, { status: 400 })
      }
    }

    if (type === "icp" && !icpDescription) {
      return NextResponse.json({ error: "icpDescription is required for icp type." }, { status: 400 })
    }

    // Charge credits
    let billing: Awaited<ReturnType<typeof chargeCreditsForAction>>
    try {
      billing = await chargeCreditsForAction(req, "generate_context", "Context Generator")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Billing error"
      return NextResponse.json(
        { error: message },
        {
          status: message.includes("Authentication required")
            ? 401
            : message.includes("Not enough credits")
              ? 402
              : 500,
        }
      )
    }

    const transactionId = !billing.charge.skipped ? String(billing.charge.transactionId) : null

    if (type === "website" && parsedUrl) {
      let pageText = ""
      try {
        pageText = await scrapeUrl(parsedUrl.href)
      } catch {
        if (transactionId) {
          await refundCredits(billing.user.id, transactionId, "Context Generator scrape failed")
        }
        return NextResponse.json({ error: "Failed to scrape website. Please check the URL and try again." }, { status: 422 })
      }

      let text: string
      try {
        ;({ text } = await generateText({
          model: openai("gpt-4o-mini"),
          system: `You are a business analyst who creates reusable context documents from website content. 
Write a structured markdown document that captures:
- What the company does
- Their product/service offering  
- Their target customers / ICP
- Key value propositions and differentiators
- Pain points they solve
- Industry and company positioning

Be concise, factual, and base everything only on the scraped content. Use markdown headings and bullet points.`,
          prompt: `Website URL: ${parsedUrl.href}\n\nScraped content:\n${pageText}\n\nGenerate a reusable business context document from this website.`,
          maxOutputTokens: 1200,
        }))
      } catch {
        if (transactionId) {
          await refundCredits(billing.user.id, transactionId, "Context Generator AI call failed")
        }
        return NextResponse.json({ error: "AI generation failed. Please try again." }, { status: 500 })
      }

      const title = parsedUrl.hostname.replace("www.", "")
      return NextResponse.json({ content: text, title: `${title} Context`, icon: "🌐" })
    }

    if (type === "icp") {
      let text: string
      try {
        ;({ text } = await generateText({
          model: openai("gpt-4o-mini"),
          system: `You are an ICP (Ideal Customer Profile) strategist. 
Based on a user's description of their target customers, generate a detailed, segmented ICP profile document in markdown.
Include:
- ICP Overview
- Company Firmographics (industry, size, revenue, geography)
- Buyer Personas (job titles, responsibilities)
- Pain Points & Challenges
- Goals & Success Metrics
- Buying Triggers
- Fit Signals (positive and negative)

Be specific, actionable, and structure with clear markdown headings.`,
          prompt: `User description: "${icpDescription}"\n\nGenerate a detailed ICP context document.`,
          maxOutputTokens: 1200,
        }))
      } catch {
        if (transactionId) {
          await refundCredits(billing.user.id, transactionId, "Context Generator AI call failed")
        }
        return NextResponse.json({ error: "AI generation failed. Please try again." }, { status: 500 })
      }

      return NextResponse.json({ content: text, title: "ICP Profile", icon: "🎯" })
    }
  } catch (err) {
    console.error("[context-generator]", err)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
