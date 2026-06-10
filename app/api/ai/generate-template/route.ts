import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

import { chargeCreditsForAction, refundCredits } from "@/lib/billing-server"

export async function POST(req: NextRequest) {
  let billingTransactionId: string | null = null
  let billingUserId: string | null = null

  try {
    const { description } = await req.json()

    if (!description || typeof description !== "string" || description.trim().length === 0) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 503 })
    }

    const billing = await chargeCreditsForAction(req, "generate_template", "Template generation")
    if (!billing.charge.skipped) {
      billingTransactionId = String(billing.charge.transactionId)
      billingUserId = billing.user.id
    }

    const prompt = `You are a data analyst helping users create spreadsheet templates for business workflows.

The user wants to create a spreadsheet template described as:
"${description.trim()}"

Generate a practical spreadsheet template with:
1. A clear, concise title (3-6 words)
2. A one-sentence description of the template's purpose
3. One category from: Sales, Marketing, Operations, Strategy, GTM, Research, Starters
4. 4-8 meaningful column names that cover the key data for this use case
5. 4-6 realistic sample data rows that demonstrate the template in action

Return ONLY valid JSON matching this exact structure (no markdown, no explanation):
{
  "title": "string",
  "description": "string",
  "category": "string",
  "columns": ["ColName1", "ColName2", "..."],
  "sampleRows": [
    { "ColName1": "value", "ColName2": "value", "...": "..." },
    { "ColName1": "value", "ColName2": "value", "...": "..." }
  ]
}

Make column names concise. Sample data must be realistic, professional, and specific to the use case.`

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      temperature: 0.7,
    })

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to generate template structure" }, { status: 500 })
    }

    const data = JSON.parse(jsonMatch[0])

    // Validate required fields
    if (!data.title || !data.columns || !Array.isArray(data.columns) || data.columns.length === 0) {
      return NextResponse.json({ error: "Invalid template structure generated" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    if (billingTransactionId && billingUserId) {
      await refundCredits(billingUserId, billingTransactionId, "Template generation failed")
    }

    console.error("[generate-template] error:", err)
    const message = err instanceof Error ? err.message : "Internal server error"
    const status = message.includes("Authentication required")
      ? 401
      : message.includes("Not enough credits")
        ? 402
        : 500
    return NextResponse.json({ error: message }, { status })
  }
}
