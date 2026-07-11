import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { requireAuthenticatedUser } from "@/lib/server-auth"

const EmailMessageSchema = z.object({
  rowIndex: z.number().int().min(0),
  to: z.string().trim().email().max(320),
  subject: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(20000),
})

const SendBatchRequestSchema = z.object({
  runId: z.string().uuid(),
  messages: z.array(EmailMessageSchema).min(1).max(100),
})

const getSenderDomain = (configuredFrom: string): string | null => {
  const match = configuredFrom.match(/@([^<>\s]+)>?$/)
  return match?.[1]?.toLowerCase() ?? null
}

const getSenderLocalPart = (name?: string): string => {
  const normalized = (name || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ".")
    .replace(/[^a-z0-9._-]+/g, ".")
    .replace(/[._-]{2,}/g, ".")
    .replace(/^[._-]+|[._-]+$/g, "")
    .slice(0, 64)

  return normalized || "emails"
}

const getSenderDisplayName = (name?: string): string => {
  const sanitized = (name || "")
    .replace(/[\r\n"<>]/g, "")
    .trim()
    .slice(0, 100)
  return sanitized || "GridMind"
}

export async function POST(request: NextRequest) {
  const user = await requireAuthenticatedUser(request)
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 })

  const apiKey = process.env.RESEND_API_KEY
  const configuredFrom = process.env.EMAIL_FROM
  const senderDomain = configuredFrom ? getSenderDomain(configuredFrom) : null
  if (!apiKey || !configuredFrom || !senderDomain) {
    return NextResponse.json(
      { error: "Email delivery is not configured. Set RESEND_API_KEY and EMAIL_FROM to an address on your verified domain." },
      { status: 503 }
    )
  }

  const from = `${getSenderDisplayName(user.name)} <${getSenderLocalPart(user.name)}@${senderDomain}>`

  const parsed = SendBatchRequestSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email batch request" }, { status: 400 })
  }

  const { messages, runId } = parsed.data
  const payload = messages.map((message) => ({
    from,
    to: [message.to],
    reply_to: user.email,
    subject: message.subject,
    text: message.body,
  }))

  try {
    const response = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `gridmind-${runId}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000),
    })

    const data = await response.json().catch(() => null) as {
      data?: Array<{ id: string }>
      message?: string
      error?: string
    } | null

    if (!response.ok) {
      console.error("[email-send] Resend rejected batch:", response.status, data)
      return NextResponse.json(
        { error: data?.message || data?.error || `Email provider returned HTTP ${response.status}` },
        { status: response.status >= 400 && response.status < 500 ? 400 : 502 }
      )
    }

    const sent = (data?.data || []).map((item, index) => ({
      id: item.id,
      rowIndex: messages[index]?.rowIndex,
      to: messages[index]?.to,
    }))

    return NextResponse.json({ success: true, sent, sentCount: sent.length })
  } catch (error) {
    console.error("[email-send] batch failed:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send email batch" },
      { status: 502 }
    )
  }
}
