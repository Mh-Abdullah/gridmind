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
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  isStreaming?: boolean
}

interface ScrapedColumn {
  header: string
  values: { rowIndex: number; value: string }[]
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
  }
  onApplyChanges?: (changes: { row: number; col: number; value: string }[]) => void
  onAddColumns?: (columns: ScrapedColumn[]) => void
}

export function AIChatPanel({ isOpen, onClose, tableContext, onApplyChanges, onAddColumns }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your AI assistant for GridMind. I can help you with:\n\n• **Analyzing data** in your spreadsheet\n• **Generating formulas** and calculations\n• **Suggesting improvements** to your data\n• **Answering questions** about your content\n\nHow can I help you today?",
      timestamp: new Date(),
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState("Agent")
  const [showAgentMenu, setShowAgentMenu] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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
  const handleScraperAgent = async (prompt: string, assistantMessageId: string) => {
    if (!tableContext) {
      setMessages(prev => prev.map(m => 
        m.id === assistantMessageId 
          ? { 
              ...m, 
              content: "Please select some cells in the spreadsheet first. The Web Scraper agent needs selected rows to know what data to look up.",
              isStreaming: false,
            }
          : m
      ))
      return
    }

    const { selectedCells, getCellValue, numCols, getColumnLabel } = tableContext

    if (!selectedCells || selectedCells.size === 0) {
      setMessages(prev => prev.map(m => 
        m.id === assistantMessageId 
          ? { 
              ...m, 
              content: "Please select some cells in the spreadsheet first. The Web Scraper agent needs selected rows to know what data to look up.",
              isStreaming: false,
            }
          : m
      ))
      return
    }

    // Group selected cells by row
    const rowsMap = new Map<number, { [colIndex: string]: string }>()
    selectedCells.forEach(cellKey => {
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
        ? { ...m, content: `🔍 Scraping data for ${selectedRows.length} row(s)...\n\nThis may take a moment as I search the web and extract information.` }
        : m
    ))

    try {
      const response = await fetch("/api/ai/scraper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          selectedRows,
          existingColumns,
          tableInfo: {
            tableId: tableContext.tableId,
            projectName: tableContext.projectName,
            numRows: tableContext.numRows,
            numCols: tableContext.numCols,
          },
        }),
      })

      const result = await response.json()

      if (!result.success) {
        setMessages(prev => prev.map(m => 
          m.id === assistantMessageId 
            ? { 
                ...m, 
                content: `❌ **Scraping failed**\n\n${result.error || "Unknown error occurred"}\n\n${result.rawResponse ? `\n\nRaw response:\n${result.rawResponse}` : ""}`,
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

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    }

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

    // Handle Web Scraper agent differently
    if (selectedAgent === "Web Scraper") {
      await handleScraperAgent(userMessage.content, assistantMessageId)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].filter(m => m.role !== "system").map(m => ({
            role: m.role,
            content: m.content,
          })),
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
    setMessages([{
      id: "welcome-" + Date.now(),
      role: "assistant",
      content: "Hi! I'm your AI assistant for GridMind. I can help you with:\n\n• **Analyzing data** in your spreadsheet\n• **Generating formulas** and calculations\n• **Suggesting improvements** to your data\n• **Answering questions** about your content\n\nHow can I help you today?",
      timestamp: new Date(),
    }])
    setInputValue("")
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
      className={`h-full bg-background border-l border-border flex flex-col transition-all duration-300 shrink-0 ${
        isExpanded ? "w-150" : "w-100"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-linear-to-br from-primary to-accent">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">GridMind AI</h2>
            <p className="text-xs text-muted-foreground">Your data assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={clearChat}
            title="New chat"
          >
            <SquarePen className="h-4 w-4" />
          </Button>
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
                    {["Agent", "Web Scraper", "Data Analyst", "Formula Expert"].map((agent) => (
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
                          {agent === "Web Scraper" && (
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
    </div>
  )
}
