"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  X,
  Send,
  Sparkles,
  User,
  Bot,
  Copy,
  Check,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Loader2,
  Maximize2,
  Minimize2,
  Trash2,
  Settings,
  MessageSquare,
  Plus,
  AtSign,
  SlidersHorizontal,
  ArrowUp,
  SquarePen,
  History,
  Clock,
  ChevronLeft,
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  isStreaming?: boolean
}

interface APIMessage {
  role: "user" | "assistant" | "system"
  content: string
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  tableId: string
}

// Helper to get storage key for a table
const getChatStorageKey = (tableId: string) => `gridmind-chat-history-${tableId}`

// Helper to serialize/deserialize dates in messages
const serializeSession = (session: ChatSession): string => {
  return JSON.stringify({
    ...session,
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
    messages: session.messages.map(m => ({
      ...m,
      timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp,
    })),
  })
}

const deserializeSession = (data: string): ChatSession => {
  const parsed = JSON.parse(data)
  return {
    ...parsed,
    createdAt: new Date(parsed.createdAt),
    updatedAt: new Date(parsed.updatedAt),
    messages: parsed.messages.map((m: any) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    })),
  }
}

// Load all sessions for a table
const loadChatSessions = (tableId: string): ChatSession[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(getChatStorageKey(tableId))
    if (!stored) return []
    const sessions = JSON.parse(stored) as string[]
    return sessions.map(s => deserializeSession(s)).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  } catch (e) {
    console.error('Failed to load chat sessions:', e)
    return []
  }
}

// Save all sessions for a table
const saveChatSessions = (tableId: string, sessions: ChatSession[]) => {
  if (typeof window === 'undefined') return
  try {
    const serialized = sessions.map(s => serializeSession(s))
    localStorage.setItem(getChatStorageKey(tableId), JSON.stringify(serialized))
  } catch (e) {
    console.error('Failed to save chat sessions:', e)
  }
}

// Generate title from first user message
const generateTitle = (messages: Message[]): string => {
  const firstUserMessage = messages.find(m => m.role === 'user')
  if (!firstUserMessage) return 'New Chat'
  const content = firstUserMessage.content.trim()
  return content.length > 40 ? content.slice(0, 40) + '...' : content
}

interface ScrapedColumn {
  header: string
  values: { rowIndex: number; value: string }[]
}

interface GeneratedTable {
  headers: string[]
  rows: string[][]
}

interface PendingAIChanges {
  type: 'generate' | 'enrich'
  previousState: {
    cells: { [key: string]: string }
    numRows: number
    numCols: number
  } | null
  newChanges: { row: number; col: number; value: string }[]
  summary: string
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

interface AIChatPanelProps {
  isOpen: boolean
  onClose: () => void
  tableContext?: {
    tableId: string
    projectName: string
    numRows: number
    numCols: number
    selectedCells?: Set<string>
    getCellValue: (row: number, col: number) => string
    getColumnLabel: (index: number) => string
    getCellFormatting?: (row: number, col: number) => CellFormatting
  }
  onApplyChanges?: (changes: { row: number; col: number; value: string }[], newNumRows?: number, newNumCols?: number) => void
  onApplyFormatting?: (formatting: { row: number; col: number; format: CellFormatting }[]) => void
  onAddColumns?: (columns: ScrapedColumn[]) => void
  onGenerateTable?: (table: GeneratedTable) => void
  pendingChanges?: PendingAIChanges | null
  onKeepChanges?: () => void
  onUndoChanges?: () => void
}

export function AIChatPanel({ isOpen, onClose, tableContext, onApplyChanges, onApplyFormatting, onAddColumns, onGenerateTable, pendingChanges, onKeepChanges, onUndoChanges }: AIChatPanelProps) {
  const welcomeMessage: Message = {
    id: "welcome",
    role: "assistant",
    content: "Hi! I'm your AI assistant for GridMind. I can help you with:\n\n• **Analyzing data** in your spreadsheet\n• **Generating formulas** and calculations\n• **Suggesting improvements** to your data\n• **Answering questions** about your content\n\nHow can I help you today?",
    timestamp: new Date(),
  }

  const [messages, setMessages] = useState<Message[]>([welcomeMessage])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState("Scraper")
  const [showAgentMenu, setShowAgentMenu] = useState(false)
  
  // Chat history state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const tableId = tableContext?.tableId || 'default'

  // Load chat sessions on mount
  useEffect(() => {
    const sessions = loadChatSessions(tableId)
    setChatSessions(sessions)
    
    // If there are existing sessions, load the most recent one
    if (sessions.length > 0) {
      const mostRecent = sessions[0]
      setCurrentSessionId(mostRecent.id)
      setMessages(mostRecent.messages)
    } else {
      // Create a new session
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [welcomeMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
        tableId,
      }
      setCurrentSessionId(newSession.id)
      setChatSessions([newSession])
      saveChatSessions(tableId, [newSession])
    }
  }, [tableId])

  // Save current session when messages change
  useEffect(() => {
    if (!currentSessionId || messages.length === 0) return
    
    // Don't save if only welcome message and no user messages
    const hasUserMessage = messages.some(m => m.role === 'user')
    if (!hasUserMessage && messages.length === 1 && messages[0].id.startsWith('welcome')) return

    const updatedSessions = chatSessions.map(session => {
      if (session.id === currentSessionId) {
        return {
          ...session,
          messages,
          title: generateTitle(messages),
          updatedAt: new Date(),
        }
      }
      return session
    })
    
    setChatSessions(updatedSessions)
    saveChatSessions(tableId, updatedSessions)
  }, [messages, currentSessionId, tableId])

  // Create a new chat session
  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{ ...welcomeMessage, id: 'welcome-' + Date.now() }],
      createdAt: new Date(),
      updatedAt: new Date(),
      tableId,
    }
    
    const updatedSessions = [newSession, ...chatSessions]
    setChatSessions(updatedSessions)
    saveChatSessions(tableId, updatedSessions)
    setCurrentSessionId(newSession.id)
    setMessages(newSession.messages)
    setInputValue("")
    setShowHistory(false)
  }

  // Switch to a different chat session
  const switchToSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId)
    if (session) {
      setCurrentSessionId(session.id)
      setMessages(session.messages)
      setShowHistory(false)
    }
  }

  // Delete a chat session
  const deleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedSessions = chatSessions.filter(s => s.id !== sessionId)
    setChatSessions(updatedSessions)
    saveChatSessions(tableId, updatedSessions)
    
    // If we deleted the current session, switch to another or create new
    if (sessionId === currentSessionId) {
      if (updatedSessions.length > 0) {
        setCurrentSessionId(updatedSessions[0].id)
        setMessages(updatedSessions[0].messages)
      } else {
        createNewChat()
      }
    }
  }

  // Format relative time
  const formatRelativeTime = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowAgentMenu(false)
    }
    if (showAgentMenu) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [showAgentMenu])

  // Check if should show scroll button
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }
  }

  // Get context from the spreadsheet
  const getSpreadsheetContext = () => {
    if (!tableContext) return ""
    
    const { numRows, numCols, selectedCells, getCellValue, getColumnLabel } = tableContext
    let context = `\n\nSpreadsheet Context:\n- Total rows: ${numRows}\n- Total columns: ${numCols}`
    
    if (selectedCells && selectedCells.size > 0) {
      context += `\n- Selected cells: ${selectedCells.size}`
      const selectedData: string[] = []
      selectedCells.forEach(cellKey => {
        const [row, col] = cellKey.split('-').map(Number)
        const value = getCellValue(row, col)
        if (value) {
          selectedData.push(`${getColumnLabel(col)}${row + 1}: "${value}"`)
        }
      })
      if (selectedData.length > 0) {
        context += `\n- Selected data: ${selectedData.slice(0, 10).join(", ")}${selectedData.length > 10 ? "..." : ""}`
      }
    }
    
    return context
  }

  // Handle Web Scraper agent
  const handleScraperAgent = async (prompt: string, assistantMessageId: string, chatHistory: APIMessage[]) => {
    const hasSelection = tableContext?.selectedCells && tableContext.selectedCells.size > 0

    // Determine mode: generate (no selection) or enrich (with selection)
    const mode = hasSelection ? "enrich" : "generate"

    if (mode === "generate") {
      // GENERATE MODE: Create new table data from scratch
      setMessages(prev => prev.map(m => 
        m.id === assistantMessageId 
          ? { ...m, content: `🔍 **Generating table data...**\n\nSearching the web and scraping information based on your request. This may take a moment.` }
          : m
      ))

      try {
        const response = await fetch("/api/ai/scraper", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            mode: "generate",
            chatHistory,
            tableInfo: {
              tableId: tableContext?.tableId || "new",
              projectName: tableContext?.projectName || "Untitled",
              numRows: tableContext?.numRows || 0,
              numCols: tableContext?.numCols || 0,
            },
          }),
        })

        const result = await response.json()

        if (!result.success) {
          setMessages(prev => prev.map(m => 
            m.id === assistantMessageId 
              ? { 
                  ...m, 
                  content: `❌ **Generation failed**\n\n${result.error || "Unknown error occurred"}\n\n${result.rawResponse ? `Raw response:\n\`\`\`\n${result.rawResponse.slice(0, 500)}...\n\`\`\`` : ""}`,
                  isStreaming: false,
                }
              : m
          ))
          return
        }

        // Apply the generated table
        if (result.table && onGenerateTable) {
          onGenerateTable(result.table)
          
          const { headers, rows } = result.table
          setMessages(prev => prev.map(m => 
            m.id === assistantMessageId 
              ? { 
                  ...m, 
                  content: `✅ **Table generated!**\n\n${result.summary || ""}\n\n**Created:** ${rows.length} rows × ${headers.length} columns\n\n**Columns:** ${headers.join(", ")}\n\n*${result.steps} AI steps executed*`,
                  isStreaming: false,
                }
              : m
          ))
        } else {
          setMessages(prev => prev.map(m => 
            m.id === assistantMessageId 
              ? { 
                  ...m, 
                  content: `⚠️ **No data generated**\n\nI couldn't find the requested information. Try being more specific in your request.\n\n${result.summary || ""}`,
                  isStreaming: false,
                }
              : m
          ))
        }
      } catch (error) {
        console.error("Scraper error:", error)
        setMessages(prev => prev.map(m => 
          m.id === assistantMessageId 
            ? { 
                ...m, 
                content: `❌ **Error**\n\nFailed to run the scraper agent. ${error instanceof Error ? error.message : "Please try again."}`,
                isStreaming: false,
              }
            : m
        ))
      }
      return
    }

    // ENRICH MODE: Add columns to existing selected rows
    const { selectedCells, getCellValue, numCols, getColumnLabel } = tableContext!

    // Group selected cells by row
    const rowsMap = new Map<number, { [colIndex: string]: string }>()
    selectedCells!.forEach(cellKey => {
      const [row, col] = cellKey.split('-').map(Number)
      if (!rowsMap.has(row)) {
        rowsMap.set(row, {})
      }
      const rowData = rowsMap.get(row)!
      // Get all cells in this row for context
      for (let c = 0; c < numCols; c++) {
        const value = getCellValue(row, c)
        if (value) {
          rowData[c.toString()] = value
        }
      }
    })

    const selectedRows = Array.from(rowsMap.entries()).map(([rowIndex, cells]) => ({
      rowIndex,
      cells,
    }))

    // Get existing column headers
    const existingColumns: string[] = []
    for (let c = 0; c < numCols; c++) {
      existingColumns.push(getColumnLabel(c))
    }

    setMessages(prev => prev.map(m => 
      m.id === assistantMessageId 
        ? { ...m, content: `🔍 **Enriching ${selectedRows.length} row(s)...**\n\nSearching the web and extracting additional data for your selected rows.` }
        : m
    ))

    try {
      const response = await fetch("/api/ai/scraper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          mode: "enrich",
          chatHistory,
          selectedRows,
          existingColumns,
          tableInfo: {
            tableId: tableContext!.tableId,
            projectName: tableContext!.projectName,
            numRows: tableContext!.numRows,
            numCols: tableContext!.numCols,
          },
        }),
      })

      const result = await response.json()

      if (!result.success) {
        setMessages(prev => prev.map(m => 
          m.id === assistantMessageId 
            ? { 
                ...m, 
                content: `❌ **Scraping failed**\n\n${result.error || "Unknown error occurred"}\n\n${result.rawResponse ? `Raw response:\n\`\`\`\n${result.rawResponse.slice(0, 500)}...\n\`\`\`` : ""}`,
                isStreaming: false,
              }
            : m
        ))
        return
      }

      // Apply the scraped columns to the spreadsheet
      if (result.columns && result.columns.length > 0 && onAddColumns) {
        onAddColumns(result.columns)
        
        const columnNames = result.columns.map((c: ScrapedColumn) => c.header).join(", ")
        setMessages(prev => prev.map(m => 
          m.id === assistantMessageId 
            ? { 
                ...m, 
                content: `✅ **Scraping complete!**\n\n${result.summary || ""}\n\n**Added columns:** ${columnNames}\n\n*${result.steps} AI steps executed*`,
                isStreaming: false,
              }
            : m
        ))
      } else {
        setMessages(prev => prev.map(m => 
          m.id === assistantMessageId 
            ? { 
                ...m, 
                content: `⚠️ **No data found**\n\nI couldn't find the requested information. Try being more specific in your request or check that the selected rows have enough context.\n\n${result.summary || ""}`,
                isStreaming: false,
              }
            : m
        ))
      }
    } catch (error) {
      console.error("Scraper error:", error)
      setMessages(prev => prev.map(m => 
        m.id === assistantMessageId 
          ? { 
              ...m, 
              content: `❌ **Error**\n\nFailed to run the scraper agent. ${error instanceof Error ? error.message : "Please try again."}`,
              isStreaming: false,
            }
          : m
      ))
    }
  }

  // Handle general-purpose spreadsheet Agent
  const handleAgentTask = async (prompt: string, assistantMessageId: string, chatHistory: APIMessage[]) => {
    if (!tableContext) {
      setMessages(prev => prev.map(m =>
        m.id === assistantMessageId
          ? { ...m, content: "⚠️ **No spreadsheet open**\n\nPlease open a spreadsheet table first.", isStreaming: false }
          : m
      ))
      return
    }

    const { numRows, numCols, getCellValue, getColumnLabel, selectedCells, getCellFormatting } = tableContext

    // Snapshot all cell data
    const cells: { [key: string]: string } = {}
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const val = getCellValue(r, c)
        if (val) cells[`${r}-${c}`] = val
      }
    }

    // Build selected cells list with coordinates + values + current formatting
    const hasSelection = selectedCells && selectedCells.size > 0
    const selectedCellsList: { row: number; col: number; colLabel: string; value: string; formatting?: CellFormatting }[] = []
    if (hasSelection) {
      selectedCells!.forEach(cellKey => {
        const [row, col] = cellKey.split('-').map(Number)
        selectedCellsList.push({
          row,
          col,
          colLabel: getColumnLabel(col),
          value: getCellValue(row, col),
          formatting: getCellFormatting ? getCellFormatting(row, col) : undefined,
        })
      })
      selectedCellsList.sort((a, b) => a.row !== b.row ? a.row - b.row : a.col - b.col)
    }

    setMessages(prev => prev.map(m =>
      m.id === assistantMessageId
        ? { ...m, content: hasSelection
            ? `🤖 **Agent working on ${selectedCells!.size} selected cell${selectedCells!.size === 1 ? '' : 's'}...**`
            : `🤖 **Agent working...**\n\nAnalyzing your spreadsheet and applying changes.`
          }
        : m
    ))

    try {
      const response = await fetch("/api/ai/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          cells,
          numRows,
          numCols,
          chatHistory,
          selectedCells: hasSelection ? selectedCellsList : undefined,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        setMessages(prev => prev.map(m =>
          m.id === assistantMessageId
            ? { ...m, content: `❌ **Agent failed**\n\n${result.error || "Unknown error occurred"}`, isStreaming: false }
            : m
        ))
        return
      }

      const { changes, formatting: formattingChanges, summary, newNumRows, newNumCols } = result as {
        changes: { row: number; col: number; value: string }[]
        formatting?: { row: number; col: number; format: CellFormatting }[]
        summary: string
        newNumRows?: number
        newNumCols?: number
      }

      const hasValueChanges = changes && changes.length > 0
      const hasFormatChanges = formattingChanges && formattingChanges.length > 0

      if (hasValueChanges && onApplyChanges) {
        onApplyChanges(changes, newNumRows, newNumCols)
      }

      if (hasFormatChanges && onApplyFormatting) {
        onApplyFormatting(formattingChanges!)
      }

      if (hasValueChanges || hasFormatChanges) {
        const parts: string[] = [`✅ **Done!**\n\n${summary}`]
        if (hasValueChanges) parts.push(`**Cell edits:** ${changes.length}`)
        if (hasFormatChanges) parts.push(`**Formatting changes:** ${formattingChanges!.length}`)
        setMessages(prev => prev.map(m =>
          m.id === assistantMessageId
            ? { ...m, content: parts.join('\n'), isStreaming: false }
            : m
        ))
      } else {
        setMessages(prev => prev.map(m =>
          m.id === assistantMessageId
            ? { ...m, content: `ℹ️ **No changes needed**\n\n${summary}`, isStreaming: false }
            : m
        ))
      }
    } catch (error) {
      console.error("Agent error:", error)
      setMessages(prev => prev.map(m =>
        m.id === assistantMessageId
          ? {
              ...m,
              content: `❌ **Error**\n\nFailed to run the agent. ${error instanceof Error ? error.message : "Please try again."}`,
              isStreaming: false,
            }
          : m
      ))
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const prompt = inputValue.trim()
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: prompt,
      timestamp: new Date(),
    }

    // Build a consistent conversation snapshot so each prompt includes the ongoing chat context.
    const conversationHistory: APIMessage[] = [...messages, userMessage]
      .filter((m) => (m.role === "user" || m.role === "assistant") && m.content.trim().length > 0)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }))

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Create a placeholder for the assistant message
    const assistantMessageId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    }])

    // Route to the correct agent
    if (selectedAgent === "Scraper") {
      await handleScraperAgent(userMessage.content, assistantMessageId, conversationHistory)
      setIsLoading(false)
      return
    }

    if (selectedAgent === "Agent") {
      await handleAgentTask(userMessage.content, assistantMessageId, conversationHistory)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationHistory,
          context: getSpreadsheetContext(),
          tableInfo: tableContext ? {
            tableId: tableContext.tableId,
            projectName: tableContext.projectName,
            numRows: tableContext.numRows,
            numCols: tableContext.numCols,
          } : null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.code === "quota_exceeded" 
          ? "⚠️ OpenAI quota exceeded. The AI service needs billing setup. Contact your admin or try again later."
          : errorData.code === "invalid_key"
          ? "⚠️ Invalid API key configuration. Please contact your admin."
          : "Sorry, the AI service is temporarily unavailable. Please try again."
        throw new Error(errorMessage)
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      if (reader) {
        let fullContent = ""
        
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              if (data === "[DONE]") continue
              
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  fullContent += parsed.content
                  setMessages(prev => prev.map(m => 
                    m.id === assistantMessageId 
                      ? { ...m, content: fullContent }
                      : m
                  ))
                }
              } catch (e) {
                // Non-JSON data, append as is
                fullContent += data
                setMessages(prev => prev.map(m => 
                  m.id === assistantMessageId 
                    ? { ...m, content: fullContent }
                    : m
                ))
              }
            }
          }
        }
        
        // Mark streaming as complete
        setMessages(prev => prev.map(m => 
          m.id === assistantMessageId 
            ? { ...m, isStreaming: false }
            : m
        ))
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage = error instanceof Error ? error.message : "Sorry, I encountered an error. Please try again."
      setMessages(prev => prev.map(m => 
        m.id === assistantMessageId 
          ? { 
              ...m, 
              content: errorMessage,
              isStreaming: false,
            }
          : m
      ))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const clearChat = () => {
    createNewChat()
  }

  const regenerateLastResponse = async () => {
    // Find the last user message
    const lastUserMessageIndex = messages.findLastIndex(m => m.role === "user")
    if (lastUserMessageIndex === -1) return

    // Remove the last assistant message
    const newMessages = messages.slice(0, lastUserMessageIndex + 1)
    setMessages(newMessages)

    // Resend the last user message
    const lastUserMessage = messages[lastUserMessageIndex]
    setInputValue(lastUserMessage.content)
    
    // Small delay then send
    setTimeout(() => {
      setInputValue("")
      handleSendMessage()
    }, 100)
  }

  // Parse markdown-like content for rendering
  const renderMessageContent = (content: string) => {
    // Simple markdown parsing
    const lines = content.split('\n')
    return lines.map((line, index) => {
      // Bold text
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Inline code
      line = line.replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs">$1</code>')
      // Bullet points
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <li key={index} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: line.slice(2) }} />
        )
      }
      // Regular line
      return (
        <p key={index} className={line ? "" : "h-2"} dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }} />
      )
    })
  }

  if (!isOpen) return null

  return (
    <div 
      data-ai-chat-panel-root="true"
      className={`h-full bg-background border-l border-border flex flex-col transition-all duration-300 shrink-0 ${
        isExpanded ? "w-150" : "w-100"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/30">
        <div className="flex items-center gap-2">
          {showHistory ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowHistory(false)}
              title="Back to chat"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-linear-to-br from-primary to-accent">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          )}
          <div>
            <h2 className="text-sm font-semibold">{showHistory ? 'Chat History' : 'GridMind AI'}</h2>
            <p className="text-xs text-muted-foreground">
              {showHistory ? `${chatSessions.length} conversations` : 'Your data assistant'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {!showHistory && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowHistory(true)}
                title="Chat history"
              >
                <History className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={clearChat}
                title="New chat"
              >
                <SquarePen className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
            title="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* History Panel */}
      {showHistory ? (
        <div className="flex-1 overflow-y-auto">
          {/* New Chat Button */}
          <div className="p-3 border-b border-border">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={createNewChat}
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>
          
          {/* Chat List */}
          <div className="divide-y divide-border">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => switchToSession(session.id)}
                className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors group ${
                  session.id === currentSessionId ? 'bg-primary/10' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {session.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(session.updatedAt)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • {session.messages.filter(m => m.role !== 'system').length} messages
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => deleteSession(session.id, e)}
                    title="Delete chat"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            
            {chatSessions.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No chat history yet</p>
                <p className="text-xs mt-1">Start a conversation to see it here</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
      {/* Context indicator */}
      {tableContext && (
        <div className="px-4 py-2 bg-primary/5 border-b border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MessageSquare className="h-3 w-3" />
            <span>
              Context: <span className="font-medium text-foreground">{tableContext.projectName}</span>
              {" • "}
              {tableContext.numRows} rows × {tableContext.numCols} cols
              {tableContext.selectedCells && tableContext.selectedCells.size > 0 && (
                <span className="text-primary"> • {tableContext.selectedCells.size} selected</span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onScroll={handleScroll}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 animate-message-appear ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
              message.role === "user" 
                ? "bg-primary text-primary-foreground" 
                : "bg-linear-to-br from-primary/20 to-accent/20"
            }`}>
              {message.role === "user" ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4 text-primary" />
              )}
            </div>

            {/* Message content */}
            <div className={`flex-1 max-w-[85%] ${message.role === "user" ? "text-right" : ""}`}>
              <div
                className={`inline-block rounded-lg px-4 py-2 text-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className={`prose prose-sm max-w-none ${message.role === "user" ? "text-primary-foreground" : ""}`}>
                  {renderMessageContent(message.content)}
                  {message.isStreaming && (
                    <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
                  )}
                </div>
              </div>

              {/* Message actions */}
              {message.role === "assistant" && !message.isStreaming && message.content && (
                <div className="flex items-center gap-1 mt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => copyToClipboard(message.content, message.id)}
                  >
                    {copiedMessageId === message.id ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                  {message === messages[messages.length - 1] && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={regenerateLastResponse}
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Regenerate
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && messages[messages.length - 1]?.content === "" && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full shadow-lg"
            onClick={scrollToBottom}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Quick actions */}
      <div className="px-4 py-2 border-t border-border">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setInputValue("Summarize the data in this table")}
          >
            Summarize data
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setInputValue("Find patterns or anomalies in the selected cells")}
          >
            Find patterns
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setInputValue("Suggest formulas for calculations")}
          >
            Suggest formulas
          </Button>
        </div>
      </div>

      {/* Pending Changes Bar - Above input like GitHub Copilot */}
      {pendingChanges && (
        <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/30 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">1 file changed</span>
            <span className="text-sm font-medium text-green-500">+{pendingChanges.newChanges.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="h-7 px-3 bg-teal-500 hover:bg-teal-600 text-white text-xs font-medium"
              onClick={onKeepChanges}
            >
              Keep
            </Button>
            <Button
              size="sm"
              className="h-7 px-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium"
              onClick={onUndoChanges}
            >
              Undo
            </Button>
          </div>
        </div>
      )}

      {/* Input area - VS Code Copilot style */}
      <div className="border-t border-border p-3">
        <div className="rounded-lg border border-border bg-muted/30 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
          {/* Text input */}
          <div className="p-3 pb-2">
            <textarea
              ref={inputRef as any}
              placeholder="Describe what to build"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              disabled={isLoading}
              rows={1}
              className="w-full bg-transparent text-sm resize-none outline-none placeholder:text-muted-foreground min-h-6 max-h-50"
              style={{ height: 'auto' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = Math.min(target.scrollHeight, 200) + 'px'
              }}
            />
          </div>
          
          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex items-center gap-1">
              {/* Add attachment button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                title="Add context"
              >
                <Plus className="h-4 w-4" />
              </Button>
              
              {/* Agent selector */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 gap-1 text-muted-foreground hover:text-foreground text-xs"
                  onClick={() => {
                    setShowAgentMenu(!showAgentMenu)
                  }}
                >
                  <AtSign className="h-3.5 w-3.5" />
                  <span>{selectedAgent}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
                
                {showAgentMenu && (
                  <div className="absolute bottom-full left-0 mb-1 w-48 rounded-md border border-border bg-popover p-1 shadow-lg z-50">
                    {["Chat", "Agent", "Scraper"].map((agent) => (
                      <button
                        key={agent}
                        className={`w-full text-left px-3 py-1.5 text-sm rounded hover:bg-muted ${
                          selectedAgent === agent ? "bg-muted text-foreground" : "text-muted-foreground"
                        }`}
                        onClick={() => {
                          setSelectedAgent(agent)
                          setShowAgentMenu(false)
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span>{agent}</span>
                          {agent === "Scraper" && (
                            <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">New</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Model indicator */}
              <span className="text-xs text-muted-foreground">GPT-4o</span>
            </div>
            
            <div className="flex items-center gap-1">
              {/* Settings button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                title="Settings"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
              
              {/* Send button */}
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="h-7 w-7 rounded-md"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  )
}
