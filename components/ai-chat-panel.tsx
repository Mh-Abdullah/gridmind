"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BrandIcon, BrandLogo } from "@/components/brand-assets"
import {
  X,
  Send,
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
  thinkingSteps?: string[]
  activeStep?: string
  isThinkingDone?: boolean
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
    colNames?: { [key: number]: string }
    colFieldType?: { [key: number]: string }
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
    getColumnName?: (index: number) => string
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

// Collapsible step-by-step thinking box similar to GitHub Copilot's "Thinking..." panel
function ThinkingBox({
  steps,
  activeStep,
  isDone,
}: {
  steps: string[]
  activeStep?: string
  isDone: boolean
}) {
  const [expanded, setExpanded] = useState(true)
  const didAutoCollapse = useRef(false)
  const liveStep = isDone ? undefined : activeStep

  useEffect(() => {
    if (isDone && !didAutoCollapse.current && steps.length > 0) {
      didAutoCollapse.current = true
      const t = setTimeout(() => setExpanded(false), 1800)
      return () => clearTimeout(t)
    }
  }, [isDone, steps.length])

  const headerText = isDone
    ? `Completed ${steps.length} step${steps.length !== 1 ? 's' : ''}`
    : liveStep || 'Working...'

  return (
    <div className="mb-2 w-full overflow-hidden rounded-xl border border-border/60 bg-background/70 text-xs shadow-sm backdrop-blur">
      <button
        onClick={() => setExpanded(v => !v)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-muted/40"
      >
        {isDone ? (
          <Check className="h-3 w-3 text-foreground shrink-0" />
        ) : (
          <Loader2 className="h-3 w-3 animate-spin text-primary shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`truncate font-medium ${isDone ? 'text-muted-foreground' : 'text-foreground'}`}>
              {headerText}
            </span>
            {!isDone && (
              <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                Live
              </span>
            )}
          </div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">
            {isDone ? "Agent activity" : `Completed ${steps.length} step${steps.length !== 1 ? "s" : ""}`}
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-3 w-3 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
        )}
      </button>
      {expanded && (steps.length > 0 || liveStep) && (
        <div className="max-h-72 space-y-2 overflow-y-auto border-t border-border/50 px-3 pb-3 pt-2">
          {steps.map((step, i) => (
            <div key={i} className="flex min-w-0 items-start gap-2 text-muted-foreground">
              <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                {i + 1}
              </div>
              <span className="min-w-0 flex-1 whitespace-pre-line break-words">{step}</span>
            </div>
          ))}
          {liveStep && (
            <div className="flex min-w-0 items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 px-2 py-2 text-foreground">
              <Loader2 className="mt-0.5 h-3 w-3 shrink-0 animate-spin text-primary" />
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  Working now
                </div>
                <span className="min-w-0 whitespace-pre-line break-words">{liveStep}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function AIChatPanel({ isOpen, onClose, tableContext, onApplyChanges, onApplyFormatting, onAddColumns, onGenerateTable, pendingChanges, onKeepChanges, onUndoChanges }: AIChatPanelProps) {
  const { user } = useAuth()

  // Load user's saved contexts so the AI knows about the business/ICP
  const userContexts = useQuery(
    api.contexts.getContextsByUser,
    user?.id ? { userId: user.id } : "skip"
  )

  // Which context IDs the user has pinned for this conversation
  const [selectedContextIds, setSelectedContextIds] = useState<Set<string>>(new Set())
  const [showContextPicker, setShowContextPicker] = useState(false)

  // Build a single string to inject as system context into every AI call
  // If the user has pinned specific contexts, only use those; otherwise use none (opt-in)
  const buildBusinessContext = (): string | undefined => {
    if (!userContexts || userContexts.length === 0) return undefined
    const active = selectedContextIds.size > 0
      ? userContexts.filter(c => selectedContextIds.has(c._id))
      : []
    if (active.length === 0) return undefined
    const parts = active.map(c => `### ${c.title}\n${c.content}`)
    return `The user has attached the following business contexts to this conversation:\n\n${parts.join("\n\n---\n\n")}`
  }
  const welcomeMessage: Message = {
    id: "welcome",
    role: "assistant",
    content: "Hi! I'm your AI assistant for this workspace. I can help you with:\n\n- **Analyzing data** in your spreadsheet\n- **Generating formulas** and calculations\n- **Suggesting improvements** to your data\n- **Answering questions** about your content\n\nHow can I help you today?",
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
  const contextPickerRef = useRef<HTMLDivElement>(null)
  
  // Chat history state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const tableId = tableContext?.tableId || 'default'

  // Close context picker on outside click
  useEffect(() => {
    if (!showContextPicker) return
    const handler = (e: MouseEvent) => {
      if (contextPickerRef.current && !contextPickerRef.current.contains(e.target as Node)) {
        setShowContextPicker(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [showContextPicker])

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
  const buildSpreadsheetSnapshot = () => {
    if (!tableContext) return null
    const { numRows, numCols, getCellValue, getColumnLabel, selectedCells } = tableContext

    // Build column headers row
    const colLabels = Array.from({ length: numCols }, (_, i) => getColumnLabel(i))

    // Build rows as objects { col: value }
    const rows: { [col: string]: string }[] = []
    for (let r = 0; r < numRows; r++) {
      const row: { [col: string]: string } = {}
      let hasData = false
      for (let c = 0; c < numCols; c++) {
        const val = getCellValue(r, c)
        if (val) { row[colLabels[c]] = val; hasData = true }
      }
      if (hasData) rows.push(row)
    }

    const selectedInfo: string[] = []
    if (selectedCells && selectedCells.size > 0) {
      selectedCells.forEach(cellKey => {
        const [r, c] = cellKey.split('-').map(Number)
        const val = getCellValue(r, c)
        if (val) selectedInfo.push(`${getColumnLabel(c)}${r + 1}: "${val}"`)
      })
    }

    return {
      columns: colLabels,
      rows,
      numRows,
      numCols,
      selectedCells: selectedInfo,
    }
  }

  // Handle Web Scraper agent
  const showAssistantProgressStep = async (assistantMessageId: string, content: string, delayMs = 120) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== assistantMessageId) return m
      const steps = [...(m.thinkingSteps || [])]
      const active = m.activeStep?.trim()
      if (active && active !== content) steps.push(active)
      return {
        ...m,
        thinkingSteps: steps,
        activeStep: content,
        isThinkingDone: false,
        isStreaming: true,
      }
    }))

    await new Promise(resolve => setTimeout(resolve, delayMs))
  }

  const finalizeAssistantProgress = (assistantMessageId: string, content: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== assistantMessageId) return m
      const steps = [...(m.thinkingSteps || [])]
      const active = m.activeStep?.trim()
      if (active && steps[steps.length - 1] !== active) {
        steps.push(active)
      }

      return {
        ...m,
        content,
        thinkingSteps: steps,
        activeStep: undefined,
        isThinkingDone: true,
        isStreaming: false,
      }
    }))
    setIsLoading(false)
  }

  // Handle Web Scraper agent
  const handleScraperAgent = async (prompt: string, assistantMessageId: string, chatHistory: APIMessage[]) => {
    const hasSelection = Boolean(tableContext?.selectedCells?.size)
    let hasExistingData = false
    if (tableContext) {
      for (let row = 0; row < tableContext.numRows && !hasExistingData; row += 1) {
        for (let col = 0; col < tableContext.numCols; col += 1) {
          if (tableContext.getCellValue(row, col).trim()) {
            hasExistingData = true
            break
          }
        }
      }
    }

    const asksForRowEnrichment = /\b(email(?:s| addresses?)?|phone(?:s| numbers?)?|website(?:s)?|domain(?:s)?|address(?:es)?|contact(?:s| details?)?|opening hours|social (?:media|profiles?)|linkedin|enrich|add (?:a |the )?(?:new )?column)\b/i.test(prompt)
    const enrichAllRows = !hasSelection && hasExistingData && asksForRowEnrichment
    const mode = hasSelection || enrichAllRows ? "enrich" : "generate"

    // Build request body
    let requestBody: Record<string, unknown>
    if (mode === "generate") {
      requestBody = {
        prompt,
        mode: "generate",
        chatHistory,
        businessContext: buildBusinessContext(),
        tableInfo: {
          tableId: tableContext?.tableId || "new",
          projectName: tableContext?.projectName || "Untitled",
          numRows: tableContext?.numRows || 0,
          numCols: tableContext?.numCols || 0,
        },
      }
    } else {
      const { selectedCells, getCellValue, numRows, numCols, getColumnLabel, getColumnName } = tableContext!
      const rowsMap = new Map<number, { [colIndex: string]: string }>()
      if (hasSelection) {
        selectedCells!.forEach(cellKey => {
          const [row] = cellKey.split('-').map(Number)
          if (!rowsMap.has(row)) rowsMap.set(row, {})
          const rowData = rowsMap.get(row)!
          for (let c = 0; c < numCols; c++) {
            const value = getCellValue(row, c)
            if (value) rowData[c.toString()] = value
          }
        })
      } else {
        for (let row = 0; row < numRows; row += 1) {
          const rowData: { [colIndex: string]: string } = {}
          for (let col = 0; col < numCols; col += 1) {
            const value = getCellValue(row, col)
            if (value) rowData[col.toString()] = value
          }
          if (Object.keys(rowData).length > 0) {
            rowsMap.set(row, rowData)
          }
        }
      }
      const selectedRows = Array.from(rowsMap.entries()).map(([rowIndex, cells]) => ({ rowIndex, cells }))
      const existingColumns: string[] = []
      for (let c = 0; c < numCols; c++) existingColumns.push(getColumnName?.(c) || getColumnLabel(c))

      requestBody = {
        prompt,
        mode: "enrich",
        chatHistory,
        businessContext: buildBusinessContext(),
        selectedRows,
        existingColumns,
        tableInfo: {
          tableId: tableContext!.tableId,
          projectName: tableContext!.projectName,
          numRows: tableContext!.numRows,
          numCols: tableContext!.numCols,
        },
      }
    }

    try {
      const response = await fetch("/api/ai/scraper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      await readThinkingStream(response, assistantMessageId, async (resultData) => {
        const result = resultData as { success: boolean; mode: string; table?: GeneratedTable; columns?: ScrapedColumn[]; summary?: string; steps?: number; error?: string }
        if (!result.success) {
          setIsLoading(false)
          setMessages(prev => prev.map(m =>
            m.id === assistantMessageId
              ? { ...m, content: `[Error] **${mode === "generate" ? "Generation" : "Scraping"} failed**\n\n${result.error || "Unknown error"}`, isStreaming: false }
              : m
          ))
          return
        }

        if (result.mode === "generate" && result.table && onGenerateTable) {
          await showAssistantProgressStep(
            assistantMessageId,
            `Writing ${result.table.rows.length} row${result.table.rows.length === 1 ? "" : "s"} into the sheet...`
          )
          onGenerateTable(result.table)
          const { headers, rows } = result.table
          finalizeAssistantProgress(
            assistantMessageId,
            `[Done] **Table generated!**\n\n${result.summary || ""}\n\n**Created:** ${rows.length} rows x ${headers.length} columns\n\n**Columns:** ${headers.join(", ")}\n\n*${result.steps} AI steps*`
          )
        } else if (result.mode === "enrich" && result.columns && result.columns.length > 0 && onAddColumns) {
          await showAssistantProgressStep(
            assistantMessageId,
            `Writing ${result.columns.length} scraped column${result.columns.length === 1 ? "" : "s"} into the sheet...`
          )
          onAddColumns(result.columns)
          const columnNames = result.columns.map((c: ScrapedColumn) => c.header).join(", ")
          finalizeAssistantProgress(
            assistantMessageId,
            `[Done] **Scraping complete!**\n\n${result.summary || ""}\n\n**Added columns:** ${columnNames}\n\n*${result.steps} AI steps*`
          )
        } else {
          finalizeAssistantProgress(
            assistantMessageId,
            `[Info] **No data found**\n\nI couldn't find the requested information. Try being more specific.\n\n${result.summary || ""}`
          )
        }
      })
    } catch (error) {
      console.error("Scraper error:", error)
      setIsLoading(false)
      setMessages(prev => prev.map(m =>
        m.id === assistantMessageId
          ? { ...m, content: `[Error] **Error**\n\nFailed to run the scraper agent. ${error instanceof Error ? error.message : "Please try again."}`, isStreaming: false }
          : m
      ))
    }
  }

  // Handle general-purpose spreadsheet Agent
  const handleAgentTask = async (prompt: string, assistantMessageId: string, chatHistory: APIMessage[]) => {
    if (!tableContext) {
      setIsLoading(false)
      setMessages(prev => prev.map(m =>
        m.id === assistantMessageId
          ? { ...m, content: "[Info] **No spreadsheet open**\n\nPlease open a spreadsheet table first.", isStreaming: false }
          : m
      ))
      return
    }

    const { numRows, numCols, getCellValue, getColumnLabel, selectedCells, getCellFormatting } = tableContext

    const cells: { [key: string]: string } = {}
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const val = getCellValue(r, c)
        if (val) cells[`${r}-${c}`] = val
      }
    }

    const hasSelection = selectedCells && selectedCells.size > 0
    const selectedCellsList: { row: number; col: number; colLabel: string; value: string; formatting?: CellFormatting }[] = []
    if (hasSelection) {
      selectedCells!.forEach(cellKey => {
        const [row, col] = cellKey.split('-').map(Number)
        selectedCellsList.push({
          row, col,
          colLabel: getColumnLabel(col),
          value: getCellValue(row, col),
          formatting: getCellFormatting ? getCellFormatting(row, col) : undefined,
        })
      })
      selectedCellsList.sort((a, b) => a.row !== b.row ? a.row - b.row : a.col - b.col)
    }

    try {
      const response = await fetch("/api/ai/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt, cells, numRows, numCols, chatHistory,
          businessContext: buildBusinessContext(),
          selectedCells: hasSelection ? selectedCellsList : undefined,
        }),
      })

      await readThinkingStream(response, assistantMessageId, async (resultData) => {
        const result = resultData as {
          success: boolean; error?: string
          changes: { row: number; col: number; value: string }[]
          formatting?: { row: number; col: number; format: CellFormatting }[]
          summary: string
          newNumRows?: number
          newNumCols?: number
        }

        if (!result.success) {
          setIsLoading(false)
          setMessages(prev => prev.map(m =>
            m.id === assistantMessageId
              ? { ...m, content: `[Error] **Agent failed**\n\n${result.error || "Unknown error"}`, isStreaming: false }
              : m
          ))
          return
        }

        const hasValueChanges = result.changes && result.changes.length > 0
        const hasFormatChanges = result.formatting && result.formatting.length > 0

        if (hasValueChanges || hasFormatChanges) {
          await showAssistantProgressStep(
            assistantMessageId,
            `Writing ${result.changes.length} cell edit${result.changes.length === 1 ? "" : "s"}${hasFormatChanges ? ` and ${result.formatting!.length} formatting change${result.formatting!.length === 1 ? "" : "s"}` : ""} to the sheet...`
          )
        }

        if (hasValueChanges && onApplyChanges) onApplyChanges(result.changes, result.newNumRows, result.newNumCols)
        if (hasFormatChanges && onApplyFormatting) onApplyFormatting(result.formatting!)

        if (hasValueChanges || hasFormatChanges) {
          const parts: string[] = [`[Done] **Done!**\n\n${result.summary}`]
          if (hasValueChanges) parts.push(`**Cell edits:** ${result.changes.length}`)
          if (hasFormatChanges) parts.push(`**Formatting changes:** ${result.formatting!.length}`)
          finalizeAssistantProgress(assistantMessageId, parts.join('\n'))
        } else {
          finalizeAssistantProgress(
            assistantMessageId,
            `[Info] **No changes needed**\n\n${result.summary}`
          )
        }
      })
    } catch (error) {
      console.error("Agent error:", error)
      setIsLoading(false)
      setMessages(prev => prev.map(m =>
        m.id === assistantMessageId
          ? { ...m, content: `[Error] **Error**\n\nFailed to run the agent. ${error instanceof Error ? error.message : "Please try again."}`, isStreaming: false }
          : m
      ))
    }
  }

  // Shared SSE stream reader for agent/scraper that drives ThinkingBox state.
  // then calls onResult with the final data payload.
  const readThinkingStream = async (
    response: Response,
    assistantMessageId: string,
    onResult: (data: unknown) => void | Promise<void>
  ) => {
    const reader = response.body?.getReader()
    if (!reader) return

    const decoder = new TextDecoder()
    const completedSteps: string[] = []
    let currentActive: string | undefined
    let buffer = ""
    let shouldStop = false

    const pushStep = (content: string) => {
      const nextStep = content.trim()
      if (!nextStep) return
      if (nextStep === currentActive) return
      if (completedSteps[completedSteps.length - 1] === nextStep) return
      if (currentActive) completedSteps.push(currentActive)
      currentActive = nextStep
      setMessages(prev => prev.map(m =>
        m.id === assistantMessageId
          ? { ...m, thinkingSteps: [...completedSteps], activeStep: currentActive, isThinkingDone: false, isStreaming: true }
          : m
      ))
    }

    try {
      while (!shouldStop) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const events = buffer.split("\n\n")
        buffer = events.pop() || ""

        for (const rawEvent of events) {
          const dataLines = rawEvent
            .split("\n")
            .filter(line => line.startsWith("data: "))
            .map(line => line.slice(6))

          if (dataLines.length === 0) continue
          const data = dataLines.join("\n").trim()
          if (data === "[DONE]") {
            shouldStop = true
            break
          }

          try {
            const event = JSON.parse(data)
            if (event.type === 'thinking') {
              pushStep(event.content)
            } else if (event.type === 'result') {
              if (currentActive) completedSteps.push(currentActive)
              currentActive = undefined
              setMessages(prev => prev.map(m =>
                m.id === assistantMessageId
                  ? { ...m, thinkingSteps: [...completedSteps], activeStep: undefined, isThinkingDone: true }
                  : m
              ))
              await onResult(event.data)
            } else if (event.type === 'error') {
              if (currentActive) completedSteps.push(currentActive)
              setMessages(prev => prev.map(m =>
                m.id === assistantMessageId
                  ? { ...m, content: `[Error] **Error**\n\n${event.content}`, isStreaming: false, thinkingSteps: [...completedSteps], activeStep: undefined, isThinkingDone: true }
                  : m
              ))
              shouldStop = true
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    } finally {
      reader.releaseLock()
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
      const snapshot = buildSpreadsheetSnapshot()
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationHistory,
          businessContext: buildBusinessContext(),
          tableInfo: tableContext ? {
            tableId: tableContext.tableId,
            projectName: tableContext.projectName,
            numRows: tableContext.numRows,
            numCols: tableContext.numCols,
          } : null,
          spreadsheetData: snapshot,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.code === "quota_exceeded" 
          ? "[Error] OpenAI quota exceeded. The AI service needs billing setup. Contact your admin or try again later."
          : errorData.code === "invalid_key"
          ? "[Error] Invalid API key configuration. Please contact your admin."
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
      if (line.startsWith('- ') || line.startsWith('* ')) {
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
            <BrandIcon className="h-8 w-8 rounded-lg" priority />
          )}
          <div>
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
              {tableContext.numRows} rows x {tableContext.numCols} cols
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
            {(() => {
              const hasFinalStatus =
                typeof message.content === "string" &&
                (/^\[(Done|Info|Error)\]/.test(message.content.trim()) || message.isThinkingDone)
              const visibleActiveStep = hasFinalStatus ? undefined : message.activeStep
              const showThinkingBox = message.thinkingSteps !== undefined || !!visibleActiveStep

              return (
                <>
            {/* Avatar */}
            {message.role === "user" ? (
              <Avatar className="shrink-0 h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                  {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="shrink-0 flex h-8 w-8 items-center justify-center">
                <BrandIcon className="h-7 w-7 rounded-none" />
              </div>
            )}

            {/* Message content */}
            <div className={`flex-1 max-w-[85%] ${message.role === "user" ? "text-right" : ""}`}>
              <div
                className={`rounded-lg px-4 py-2 text-sm ${
                  message.role === "user"
                    ? "inline-block bg-primary text-primary-foreground"
                    : "block w-full bg-muted overflow-hidden"
                }`}
              >
                <div className={`prose prose-sm max-w-none ${message.role === "user" ? "text-primary-foreground" : ""}`}>
                  {/* Copilot-style thinking box for agent/scraper */}
                  {showThinkingBox && (
                    <ThinkingBox
                      steps={message.thinkingSteps || []}
                      activeStep={visibleActiveStep}
                      isDone={hasFinalStatus || message.isThinkingDone || false}
                    />
                  )}
                  {/* Initial spinner before any steps or content arrive */}
                  {!message.content && !message.thinkingSteps && !visibleActiveStep && message.isStreaming ? (
                    <span className="flex items-center gap-2 text-muted-foreground italic text-sm">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Thinking...
                    </span>
                  ) : message.content ? (
                    renderMessageContent(message.content)
                  ) : null}
                  {/* Cursor blink for live chat text streaming */}
                  {message.isStreaming && message.content && !message.thinkingSteps && (
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
                </>
              )
            })()}
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

      {/* Pending Changes Bar */}
      {pendingChanges && (
        <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/30 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">1 file changed</span>
            <span className="text-sm font-medium text-foreground">+{pendingChanges.newChanges.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="h-7 px-3 bg-foreground hover:bg-foreground/80 text-background text-xs font-medium"
              onClick={onKeepChanges}
            >
              Keep
            </Button>
            <Button
              size="sm"
              className="h-7 px-3 bg-muted hover:bg-muted/60 text-foreground border border-border text-xs font-medium"
              onClick={onUndoChanges}
            >
              Undo
            </Button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-border p-3">
        <div className="rounded-lg border border-border bg-muted/30 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">

          {/* Attached context pills */}
          {selectedContextIds.size > 0 && (
            <div className="flex flex-wrap gap-1.5 px-3 pt-2.5">
              {userContexts?.filter(c => selectedContextIds.has(c._id)).map(c => (
                <span
                  key={c._id}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium"
                >
                  {c.icon && !c.icon.startsWith("http") ? (
                    <span className="text-xs">{c.icon}</span>
                  ) : null}
                  {c.title}
                  <button
                    onClick={() => setSelectedContextIds(prev => {
                      const next = new Set(prev)
                      next.delete(c._id)
                      return next
                    })}
                    className="ml-0.5 rounded-full hover:bg-muted p-0.5 transition-colors"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

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
              {/* Context picker button */}
              <div className="relative" ref={contextPickerRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 transition-colors ${selectedContextIds.size > 0 ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  title="Attach context"
                  onClick={() => setShowContextPicker(v => !v)}
                >
                  <Plus className="h-4 w-4" />
                </Button>

                {showContextPicker && (
                  <div className="absolute bottom-full left-0 mb-1 w-64 rounded-lg border border-border bg-popover shadow-lg z-50 overflow-hidden">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-xs font-semibold text-foreground">Attach Context</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Select contexts to give the AI business knowledge</p>
                    </div>
                    {!userContexts || userContexts.length === 0 ? (
                      <div className="px-3 py-4 text-center">
                        <p className="text-xs text-muted-foreground">No contexts saved yet.</p>
                        <a href="/contexts" className="text-xs text-primary hover:underline mt-1 block">Create one on the Contexts page →</a>
                      </div>
                    ) : (
                      <div className="max-h-52 overflow-y-auto py-1">
                        {userContexts.map(c => {
                          const isSelected = selectedContextIds.has(c._id)
                          return (
                            <button
                              key={c._id}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-muted transition-colors ${isSelected ? "bg-primary/5" : ""}`}
                              onClick={() => {
                                setSelectedContextIds(prev => {
                                  const next = new Set(prev)
                                  if (next.has(c._id)) next.delete(c._id)
                                  else next.add(c._id)
                                  return next
                                })
                              }}
                            >
                              <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${isSelected ? "border-primary bg-primary" : "border-border bg-background"}`}>
                                {isSelected && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                              </div>
                              <span className="text-base leading-none shrink-0">
                                {c.icon && !c.icon.startsWith("http") ? c.icon : "DOC"}
                              </span>
                              <span className="text-sm truncate">{c.title}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                    {selectedContextIds.size > 0 && (
                      <div className="border-t border-border px-3 py-2">
                        <button
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setSelectedContextIds(new Set())}
                        >
                          Clear all
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
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

