import { NextRequest, NextResponse } from "next/server"

// Types for the request
interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
  context?: string
  businessContext?: string
  tableInfo?: {
    tableId: string
    projectName: string
    numRows: number
    numCols: number
  } | null
  spreadsheetData?: {
    columns: string[]
    rows: { [col: string]: string }[]
    numRows: number
    numCols: number
    selectedCells: string[]
  } | null
}

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are GridMind AI, an intelligent assistant for a spreadsheet application. You help users:

1. **Analyze Data**: Understand patterns, trends, and anomalies in their spreadsheet data
2. **Generate Formulas**: Create formulas for calculations, aggregations, and data transformations
3. **Data Cleaning**: Suggest ways to clean, normalize, and improve data quality
4. **Insights**: Provide actionable insights based on the data they're working with
5. **General Help**: Answer questions about spreadsheet best practices

Guidelines:
- Be concise and helpful
- When suggesting formulas, explain what they do
- If you need more information about the data, ask clarifying questions
- Format responses with markdown for better readability
- If analyzing selected data, reference specific values when relevant

You have access to the user's spreadsheet context including:
- The project name and table dimensions
- Any currently selected cells and their values`

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { messages, context, businessContext, tableInfo, spreadsheetData } = body

    console.log("[Chat API] Request received:", { messageCount: messages?.length, hasContext: !!context, hasBusinessContext: !!businessContext, hasTableInfo: !!tableInfo })

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      )
    }

    // Build the full message history with system prompt
    const fullMessages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ]

    // Inject saved business contexts so the AI knows the user's company/ICP
    if (businessContext) {
      fullMessages.push({ role: "system", content: businessContext })
    }

    // Add spreadsheet context
    if (tableInfo || spreadsheetData) {
      let contextMessage = "Current spreadsheet context:"
      if (tableInfo) {
        contextMessage += `\n- Project: ${tableInfo.projectName}`
        contextMessage += `\n- Dimensions: ${tableInfo.numRows} rows × ${tableInfo.numCols} columns`
      }
      if (context) {
        contextMessage += context
      }
      if (spreadsheetData && spreadsheetData.rows.length > 0) {
        const { columns, rows, selectedCells } = spreadsheetData
        // Build a compact text table the LLM can read
        const header = `| ${columns.join(' | ')} |`
        const separator = `| ${columns.map(() => '---').join(' | ')} |`
        const dataRows = rows.map(row =>
          `| ${columns.map(c => row[c] ?? '').join(' | ')} |`
        )
        contextMessage += `\n\nFull spreadsheet contents:\n${header}\n${separator}\n${dataRows.join('\n')}`
        if (selectedCells.length > 0) {
          contextMessage += `\n\nCurrently selected cells: ${selectedCells.join(', ')}`
        }
      } else if (spreadsheetData) {
        contextMessage += `\n- The spreadsheet is currently empty.`
      }
      fullMessages.push({ role: "system", content: contextMessage })
    }

    // Add conversation history
    fullMessages.push(...messages)

    // Check if OpenAI API key is configured
    const openaiKey = process.env.OPENAI_API_KEY
    const anthropicKey = process.env.ANTHROPIC_API_KEY
    
    console.log("[Chat API] API keys status:", { hasOpenAI: !!openaiKey, hasAnthropic: !!anthropicKey })
    
    if (openaiKey) {
      // Use OpenAI API
      console.log("[Chat API] Using OpenAI")
      return await streamOpenAI(fullMessages, openaiKey)
    } else if (anthropicKey) {
      // Use Anthropic API
      console.log("[Chat API] Using Anthropic")
      return await streamAnthropic(fullMessages, anthropicKey)
    } else {
      // Use mock response for demo
      console.log("[Chat API] Using mock response (no API keys)")
      return await mockStreamResponse(messages[messages.length - 1]?.content || "", tableInfo)
    }
  } catch (error) {
    console.error("Chat API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to process chat request", details: errorMessage },
      { status: 500 }
    )
  }
}

// OpenAI streaming implementation
async function streamOpenAI(messages: ChatMessage[], apiKey: string) {
  console.log("[Chat API] Using OpenAI with model:", process.env.OPENAI_MODEL || "gpt-4o")
  
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("OpenAI API error:", response.status, error)
    
    // Return user-friendly error messages for common issues
    if (response.status === 429) {
      return NextResponse.json({ 
        error: "OpenAI quota exceeded. Please check your billing or remove OPENAI_API_KEY to use demo mode.",
        code: "quota_exceeded"
      }, { status: 429 })
    }
    if (response.status === 401) {
      return NextResponse.json({ 
        error: "Invalid OpenAI API key. Please check your OPENAI_API_KEY.",
        code: "invalid_key"
      }, { status: 401 })
    }
    
    return NextResponse.json({ 
      error: "AI service error", 
      details: `OpenAI API returned ${response.status}`,
      apiError: error 
    }, { status: 500 })
  }

  // Create a readable stream from the response
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader()
      if (!reader) {
        controller.close()
        return
      }

      const decoder = new TextDecoder()
      
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              if (data === "[DONE]") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"))
                continue
              }

              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
                }
              } catch (e) {
                // Skip non-JSON lines
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
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

// Anthropic streaming implementation
async function streamAnthropic(messages: ChatMessage[], apiKey: string) {
  // Convert messages format for Anthropic
  const systemMessage = messages
    .filter(m => m.role === "system")
    .map(m => m.content)
    .join("\n\n")
  const chatMessages = messages
    .filter(m => m.role !== "system")
    .map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    }))

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-3-sonnet-20240229",
      max_tokens: 2000,
      system: systemMessage || SYSTEM_PROMPT,
      messages: chatMessages,
      stream: true,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("Anthropic API error:", response.status, error)
    return NextResponse.json({ 
      error: "AI service error", 
      details: `Anthropic API returned ${response.status}`,
      apiError: error 
    }, { status: 500 })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader()
      if (!reader) {
        controller.close()
        return
      }

      const decoder = new TextDecoder()
      
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              try {
                const parsed = JSON.parse(data)
                if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: parsed.delta.text })}\n\n`))
                }
              } catch (e) {
                // Skip non-JSON lines
              }
            }
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"))
      } finally {
        reader.releaseLock()
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

// Mock streaming response for demo/development
async function mockStreamResponse(
  userMessage: string, 
  tableInfo: ChatRequest["tableInfo"]
) {
  const encoder = new TextEncoder()
  
  // Generate a contextual response based on the user's message
  let response = ""
  const lowerMessage = userMessage.toLowerCase()

  if (lowerMessage.includes("summarize") || lowerMessage.includes("summary")) {
    response = `Based on your spreadsheet **"${tableInfo?.projectName || "Untitled"}"** with ${tableInfo?.numRows || 0} rows and ${tableInfo?.numCols || 0} columns:\n\n`
    response += `• The data appears to be structured in a tabular format\n`
    response += `• You have ${tableInfo?.numRows || 0} records to work with\n`
    response += `• Consider adding headers to your columns for better organization\n\n`
    response += `Would you like me to analyze specific columns or help with any calculations?`
  } else if (lowerMessage.includes("pattern") || lowerMessage.includes("anomal")) {
    response = `I'd be happy to help find patterns in your data!\n\n`
    response += `To provide accurate pattern analysis, I would need to:\n\n`
    response += `1. **Select the data range** you want to analyze\n`
    response += `2. **Identify the column types** (numeric, text, dates)\n`
    response += `3. **Look for**: duplicates, outliers, trends, or correlations\n\n`
    response += `Please select the cells you'd like me to analyze, and I'll provide insights.`
  } else if (lowerMessage.includes("formula") || lowerMessage.includes("calculate")) {
    response = `Here are some useful formulas for spreadsheet calculations:\n\n`
    response += `**Basic Aggregations:**\n`
    response += `• \`=SUM(A1:A${tableInfo?.numRows || 10})\` - Sum all values\n`
    response += `• \`=AVERAGE(A1:A${tableInfo?.numRows || 10})\` - Calculate average\n`
    response += `• \`=COUNT(A1:A${tableInfo?.numRows || 10})\` - Count numeric cells\n\n`
    response += `**Conditional Formulas:**\n`
    response += `• \`=SUMIF(A:A, ">100")\` - Sum values greater than 100\n`
    response += `• \`=COUNTIF(A:A, "text")\` - Count cells containing "text"\n\n`
    response += `What specific calculation do you need help with?`
  } else if (lowerMessage.includes("clean") || lowerMessage.includes("duplicate")) {
    response = `Here are tips for cleaning your data:\n\n`
    response += `**Remove Duplicates:**\n`
    response += `Use the "Dedupe" button in the toolbar to automatically remove duplicate rows.\n\n`
    response += `**Data Validation Tips:**\n`
    response += `• Check for empty cells that should have values\n`
    response += `• Look for inconsistent formatting (dates, numbers)\n`
    response += `• Trim extra whitespace from text cells\n`
    response += `• Standardize category names\n\n`
    response += `Would you like me to help identify specific data quality issues?`
  } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
    response = `Hello! 👋 I'm here to help you with your spreadsheet.\n\n`
    response += `I can assist you with:\n\n`
    response += `• **Analyzing** your data for patterns and insights\n`
    response += `• **Creating formulas** for calculations\n`
    response += `• **Cleaning** and organizing your data\n`
    response += `• **Answering questions** about your content\n\n`
    response += `What would you like to work on today?`
  } else {
    response = `I understand you're asking about: "${userMessage}"\n\n`
    response += `Here's how I can help with your spreadsheet:\n\n`
    response += `• If you're looking to **analyze data**, select the cells and ask me to find patterns\n`
    response += `• For **calculations**, tell me what you want to compute and I'll suggest formulas\n`
    response += `• To **clean data**, I can help identify duplicates, inconsistencies, or missing values\n\n`
    response += `Could you provide more details about what you'd like to accomplish?`
  }

  // Create a streaming response that simulates typing
  const stream = new ReadableStream({
    async start(controller) {
      const words = response.split(" ")
      
      for (let i = 0; i < words.length; i++) {
        const word = words[i] + (i < words.length - 1 ? " " : "")
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: word })}\n\n`))
        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 20))
      }
      
      controller.enqueue(encoder.encode("data: [DONE]\n\n"))
      controller.close()
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
