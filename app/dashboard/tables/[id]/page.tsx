"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { CSVExport } from "@/components/csv-export"
import { CSVImport } from "@/components/csv-import"
import { TextFormattingToolbar } from "@/components/text-formatting-toolbar"
import { AIChatPanel } from "@/components/ai-chat-panel"
import { useAuth } from "@/lib/auth-context"
import { useSpreadsheetSync } from "@/lib/use-spreadsheet-sync"
import {
  Download,
  Share2,
  Filter,
  ArrowUpDown,
  Columns3,
  Search,
  Plus,
  Trash2,
  Sparkles,
  Upload,
  Loader2,
  Cloud,
  CloudOff,
  Check,
  X,
  ChevronUp,
  ChevronDown,
  Menu,
  RotateCcw,
  RotateCw,
  Settings,
  Zap,
  Link2,
  AlignJustify,
  Type,
  RefreshCw,
  GitMerge,
  Globe,
  FileText,
  Regex,
  Building2,
  Wand2,
} from "lucide-react"

const getColumnLabel = (index: number): string => {
  let label = ""
  let num = index
  while (num >= 0) {
    label = String.fromCharCode(65 + (num % 26)) + label
    num = Math.floor(num / 26) - 1
  }
  return label
}

const detectFieldType = (values: string[]): string => {
  const nonEmpty = values.filter(v => v && v.trim() !== "" && v.trim() !== "N/A")
  if (nonEmpty.length === 0) return "Text"
  if (nonEmpty.every(v => /^https?:\/\//i.test(v.trim()))) return "URL"
  if (nonEmpty.every(v => /^(true|false|yes|no)$/i.test(v.trim()))) return "Boolean"
  if (nonEmpty.every(v => {
    const cleaned = v.replace(/[$,%]/g, "").trim()
    return cleaned !== "" && !isNaN(Number(cleaned))
  })) return "Number"
  if (nonEmpty.every(v => {
    const d = Date.parse(v)
    return !isNaN(d) && /\d{4}|\d{1,2}[\/\-]\d{1,2}/.test(v)
  })) return "Date"
  return "Text"
}

interface Cell {
  value: string
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

export default function TableEditorPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const tableId = params?.id as string || "default"
  const userId = user?.id || "anonymous"

  // Real-time sync with Convex
  const sync = useSpreadsheetSync({
    tableId,
    userId,
    initialName: "Untitled Project",
  })

  // Local state that syncs with Convex
  const [projectName, setProjectNameLocal] = useState("Untitled Project")
  const [numRows, setNumRowsLocal] = useState(1)
  const [numCols, setNumColsLocal] = useState(1)
  const [cells, setCellsLocal] = useState<{ [key: string]: string }>({})
  const [columnWidths, setColumnWidthsLocal] = useState<{ [key: number]: number }>({ 0: 150 })
  const [rowHeights, setRowHeightsLocal] = useState<{ [key: number]: number }>({})
  const [cellFormatting, setCellFormattingState] = useState<{ [key: string]: CellFormatting }>({})
  
  // UI state (not synced)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set())
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState<{ row: number; col: number } | null>(null)
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null)
  const [mergedCells, setMergedCells] = useState<{ [key: string]: { rowSpan: number; colSpan: number } }>({})
  const [sortColumn, setSortColumn] = useState<number | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [showCopyNotification, setShowCopyNotification] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Search state
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<{ row: number; col: number }[]>([])
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0)
  
  // Filter state
  const [showFilter, setShowFilter] = useState(false)
  const [filters, setFilters] = useState<{ column: number; value: string; operator: "contains" | "equals" | "not-contains" | "not-equals" }[]>([])
  const [filteredRows, setFilteredRows] = useState<number[] | null>(null)
  
  // AI Chat state
  const [showAIChat, setShowAIChat] = useState(true)

  // Loopster-style column names, editing state, autorun
  const [colNames, setColNames] = useState<{ [key: number]: string }>({ 0: "Input" })
  const [editingColName, setEditingColName] = useState<number | null>(null)
  const [autorun, setAutorun] = useState(false)

  // Column header menu
  const [colMenuOpen, setColMenuOpen] = useState<number | null>(null)
  const [colMenuName, setColMenuName] = useState("") // editable name inside menu
  const [colTypeExpanded, setColTypeExpanded] = useState(true)
  const [colColumnType, setColColumnType] = useState<{ [key: number]: string }>({ 0: "User Input" })
  const [colFieldType, setColFieldType] = useState<{ [key: number]: string }>({ 0: "Text" })
  const [hiddenCols, setHiddenCols] = useState<Set<number>>(new Set())
  const colMenuRef = useRef<HTMLDivElement>(null)

  // Add-column panel
  const [showAddColPanel, setShowAddColPanel] = useState(false)
  const [newColName, setNewColName] = useState("")
  const [newColColumnType, setNewColColumnType] = useState("User Input")
  const [newColFieldType, setNewColFieldType] = useState("Text")
  const [newColTypeExpanded, setNewColTypeExpanded] = useState(true)
  const [newColSearch, setNewColSearch] = useState("")
  const [newColAIPrompt, setNewColAIPrompt] = useState("")
  const [newColTab, setNewColTab] = useState("All")
  const addColPanelRef = useRef<HTMLDivElement>(null)
  // Add-column: configure step
  const [newColStep, setNewColStep] = useState<"browse" | "configure">("browse")
  const [newColConfigPrompt, setNewColConfigPrompt] = useState("")
  const [newColSourceCol, setNewColSourceCol] = useState(0)
  const [newColRegex, setNewColRegex] = useState("")
  const [isGeneratingCol, setIsGeneratingCol] = useState(false)

  // Delete All confirmation
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false)
  
  // AI Pending Changes state (for keep/undo feature)
  const [pendingAIChanges, setPendingAIChanges] = useState<{
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
  } | null>(null)
  
  const resizingRef = useRef<{ col?: number; row?: number; startPos: number; startSize: number } | null>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const clipboardRef = useRef<{ cells: { [key: string]: string }; minRow: number; minCol: number; maxRow: number; maxCol: number } | null>(null)
  const selectedCellsRef = useRef(selectedCells)
  const selectedCellRef = useRef(selectedCell)
  const cellsRef = useRef(cells)
  const editingCellRef = useRef(editingCell)
  const pastePendingRef = useRef(false)

  // Initialize local state from Convex data
  useEffect(() => {
    if (!isInitialized && sync.spreadsheet) {
      setCellsLocal(sync.cells)
      setCellFormattingState(sync.cellFormatting as { [key: string]: CellFormatting })
      setColumnWidthsLocal(sync.columnWidths)
      setRowHeightsLocal(sync.rowHeights)
      setNumRowsLocal(sync.spreadsheet.numRows || 1)
      setNumColsLocal(sync.spreadsheet.numCols || 1)
      setProjectNameLocal(sync.spreadsheet.name || "Untitled Project")
      setIsInitialized(true)
    }
  }, [sync.spreadsheet, sync.cells, isInitialized])

  // Keep cells in sync with Convex (real-time updates from other clients)
  useEffect(() => {
    if (isInitialized) {
      setCellsLocal(sync.cells)
    }
  }, [sync.cells, isInitialized])

  // Wrapped setters that sync to Convex
  const setCells = useCallback((newCells: { [key: string]: string } | ((prev: { [key: string]: string }) => { [key: string]: string })) => {
    if (typeof newCells === 'function') {
      setCellsLocal(prev => {
        const updated = newCells(prev)
        // Sync changed cells to Convex
        const changedCells: { [key: string]: string } = {}
        for (const key of Object.keys(updated)) {
          if (updated[key] !== prev[key]) {
            changedCells[key] = updated[key]
          }
        }
        if (Object.keys(changedCells).length > 0) {
          sync.setCellsBatch(changedCells)
        }
        return updated
      })
    } else {
      setCellsLocal(newCells)
      sync.setCellsBatch(newCells)
    }
  }, [sync])

  const setNumRows = useCallback((rows: number) => {
    setNumRowsLocal(rows)
    sync.setMetadata({ numRows: rows })
  }, [sync])

  const setNumCols = useCallback((cols: number) => {
    setNumColsLocal(cols)
    sync.setMetadata({ numCols: cols })
  }, [sync])

  const setProjectName = useCallback((name: string) => {
    setProjectNameLocal(name)
    sync.setMetadata({ name })
  }, [sync])

  const setColumnWidths = useCallback((widths: { [key: number]: number } | ((prev: { [key: number]: number }) => { [key: number]: number })) => {
    if (typeof widths === 'function') {
      setColumnWidthsLocal(prev => {
        const updated = widths(prev)
        // Find changed columns and sync
        for (const key of Object.keys(updated)) {
          const colIndex = parseInt(key)
          if (updated[colIndex] !== prev[colIndex]) {
            sync.setColumnWidth(colIndex, updated[colIndex])
          }
        }
        return updated
      })
    } else {
      setColumnWidthsLocal(widths)
      for (const [key, value] of Object.entries(widths)) {
        sync.setColumnWidth(parseInt(key), value)
      }
    }
  }, [sync])

  const setRowHeights = useCallback((heights: { [key: number]: number } | ((prev: { [key: number]: number }) => { [key: number]: number })) => {
    if (typeof heights === 'function') {
      setRowHeightsLocal(prev => {
        const updated = heights(prev)
        // Find changed rows and sync
        for (const key of Object.keys(updated)) {
          const rowIndex = parseInt(key)
          if (updated[rowIndex] !== prev[rowIndex]) {
            sync.setRowHeight(rowIndex, updated[rowIndex])
          }
        }
        return updated
      })
    } else {
      setRowHeightsLocal(heights)
      for (const [key, value] of Object.entries(heights)) {
        sync.setRowHeight(parseInt(key), value)
      }
    }
  }, [sync])

  // Helper function to calculate optimal column width based on content
  const calculateOptimalWidth = (colIndex: number): number => {
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    if (!context) return 150

    context.font = "14px system-ui, -apple-system, sans-serif" // Match the app's font size
    
    // Get the column header label width
    const headerLabel = getColumnLabel(colIndex)
    const headerWidth = context.measureText(headerLabel).width + 20 // Add padding

    // Get the maximum width of all cells in the column
    let maxCellWidth = 0
    for (let row = 0; row < numRows; row++) {
      const cellValue = getCellValue(row, colIndex)
      const cellWidth = context.measureText(cellValue).width + 16 // Add padding for cell content
      maxCellWidth = Math.max(maxCellWidth, cellWidth)
    }

    // Return the maximum of header and cell widths, with a minimum of 50px and maximum of 500px
    return Math.min(500, Math.max(50, Math.max(headerWidth, maxCellWidth)))
  }

  // Helper function to calculate optimal row height based on content
  const calculateOptimalHeight = (rowIndex: number): number => {
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    if (!context) return 36

    context.font = "14px system-ui, -apple-system, sans-serif"
    
    // Get the maximum height needed for text in this row
    let maxHeight = 24 // Minimum height
    for (let col = 0; col < numCols; col++) {
      const cellValue = getCellValue(rowIndex, col)
      // Rough estimation: approximately 14px per line, assuming width constraint
      const lines = Math.max(1, Math.ceil(cellValue.length / 30))
      const estimatedHeight = lines * 18 + 8 // 18px per line + padding
      maxHeight = Math.max(maxHeight, estimatedHeight)
    }

    // Return height with minimum of 24px and maximum of 200px
    return Math.min(200, Math.max(24, maxHeight))
  }

  const onMouseDown = (e: React.MouseEvent, colIndex: number) => {
    e.preventDefault()
    resizingRef.current = {
      col: colIndex,
      startPos: e.pageX,
      startSize: columnWidths[colIndex] || 150,
    }
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }

  const onRowMouseDown = (e: React.MouseEvent, rowIndex: number) => {
    e.preventDefault()
    resizingRef.current = {
      row: rowIndex,
      startPos: e.pageY,
      startSize: rowHeights[rowIndex] || 36, // Default height of 36px (h-9)
    }
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }

  const onColumnHeaderDoubleClick = (colIndex: number) => {
    const optimalWidth = calculateOptimalWidth(colIndex)
    setColumnWidths((prev) => ({
      ...prev,
      [colIndex]: optimalWidth,
    }))
  }

  const onRowHeaderDoubleClick = (rowIndex: number) => {
    const optimalHeight = calculateOptimalHeight(rowIndex)
    setRowHeights((prev) => ({
      ...prev,
      [rowIndex]: optimalHeight,
    }))
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!resizingRef.current) return

    if (resizingRef.current.col !== undefined) {
      const deltaX = e.pageX - resizingRef.current.startPos
      const newWidth = Math.max(50, resizingRef.current.startSize + deltaX)
      setColumnWidths((prev) => ({
        ...prev,
        [resizingRef.current!.col!]: newWidth,
      }))
    } else if (resizingRef.current.row !== undefined) {
      const deltaY = e.pageY - resizingRef.current.startPos
      const newHeight = Math.max(24, resizingRef.current.startSize + deltaY)
      setRowHeights((prev) => ({
        ...prev,
        [resizingRef.current!.row!]: newHeight,
      }))
    }
  }

  const onMouseUp = () => {
    resizingRef.current = null
    document.removeEventListener("mousemove", onMouseMove)
    document.removeEventListener("mouseup", onMouseUp)
  }

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }
  }, [])

  useEffect(() => {
    if (editingCell && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingCell])

  // Function ref that always has fresh values
  const handlePasteRef = useRef<() => void>(() => {})
  
  // Update the paste function whenever cells changes
  useEffect(() => {
    handlePasteRef.current = () => {
      if (!clipboardRef.current || !selectedCellRef.current) return
      
      const { cells: clipboardCells, minRow, minCol } = clipboardRef.current
      const { row: pasteRow, col: pasteCol } = selectedCellRef.current
      
      console.log('INSIDE handlePasteRef - cells:', cells)
      const rowOffset = pasteRow - minRow
      const colOffset = pasteCol - minCol
      
      const newCells = { ...cells }  // Use current cells state, not ref
      Object.entries(clipboardCells).forEach(([key, value]) => {
        const [origRow, origCol] = key.split('-').map(Number)
        const newRow = origRow + rowOffset
        const newCol = origCol + colOffset
        
        if (newRow >= 0 && newCol >= 0) {
          newCells[`${newRow}-${newCol}`] = value
        }
      })
      
      console.log('Pasted cells:', newCells)
      setCells(newCells)
    }
  }, [cells])  // Update whenever cells changes
  useEffect(() => {
    selectedCellsRef.current = selectedCells
    selectedCellRef.current = selectedCell
    cellsRef.current = cells
    editingCellRef.current = editingCell
  }, [selectedCells, selectedCell, cells, editingCell])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editingCellRef.current && (e.ctrlKey || e.metaKey)) {
        if (e.key === 'i' || e.key === 'I') {
          e.preventDefault()
          setShowAIChat(prev => !prev)
        } else if (e.key === 'f' || e.key === 'F') {
          e.preventDefault()
          setShowSearch(prev => {
            if (!prev) {
              setTimeout(() => searchInputRef.current?.focus(), 100)
            }
            return true
          })
        } else if (e.key === 'c' || e.key === 'C') {
          e.preventDefault()
          // Inline copy logic
          console.log('Copy pressed, selectedCells size:', selectedCellsRef.current.size, 'selectedCell:', selectedCellRef.current)
          if (selectedCellsRef.current.size === 0 || !selectedCellRef.current) {
            console.log('No cells selected')
            return
          }

          const selectedArray = Array.from(selectedCellsRef.current).map((key: any) => {
            const [row, col] = key.split('-').map(Number)
            return { row, col }
          })

          const minRow = Math.min(...selectedArray.map(c => c.row))
          const maxRow = Math.max(...selectedArray.map(c => c.row))
          const minCol = Math.min(...selectedArray.map(c => c.col))
          const maxCol = Math.max(...selectedArray.map(c => c.col))

          const clipboardData: { [key: string]: string } = {}
          selectedArray.forEach(({ row, col }: any) => {
            const cellKey = `${row}-${col}`
            clipboardData[cellKey] = cellsRef.current[cellKey] || ""
          })

          console.log('Copied cells:', clipboardData)
          clipboardRef.current = {
            cells: clipboardData,
            minRow,
            minCol,
            maxRow,
            maxCol,
          }
          console.log('Clipboard stored in ref:', clipboardRef.current)
          
          setShowCopyNotification(true)
          setTimeout(() => setShowCopyNotification(false), 2000)
        } else if (e.key === 'v' || e.key === 'V') {
          e.preventDefault()
          console.log('Paste pressed')
          handlePasteRef.current()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const getCellValue = (row: number, col: number): string => {
    return cells[`${row}-${col}`] || ""
  }

  const setCellValue = (row: number, col: number, value: string) => {
    const cellKey = `${row}-${col}`
    setCellsLocal(prev => ({ ...prev, [cellKey]: value }))
    sync.setCellValue(row, col, value)
  }

  const handleCellClick = (row: number, col: number, e?: React.MouseEvent) => {
    console.log('handleCellClick called:', { row, col })
    const cellKey = `${row}-${col}`

    if (e?.ctrlKey || e?.metaKey) {
      // Ctrl+Click: Toggle individual cell in selection
      setSelectedCells((prev) => {
        const newSelection = new Set(prev)
        if (newSelection.has(cellKey)) {
          newSelection.delete(cellKey)
        } else {
          newSelection.add(cellKey)
        }
        console.log('After ctrl+click, selectedCells:', newSelection)
        return newSelection
      })
      setSelectedCell({ row, col })
      setEditingCell(null)
    } else if (e?.shiftKey && selectedCell) {
      // Shift+Click: Select range from last selected to current cell
      const newSelection = new Set<string>()
      const minRow = Math.min(selectedCell.row, row)
      const maxRow = Math.max(selectedCell.row, row)
      const minCol = Math.min(selectedCell.col, col)
      const maxCol = Math.max(selectedCell.col, col)

      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          newSelection.add(`${r}-${c}`)
        }
      }
      setSelectedCells(newSelection)
      setSelectedCell({ row, col })
      setEditingCell(null)
    } else {
      // Single click: if already editing another cell, move editing to this cell.
      // Otherwise just select it.
      setSelectedCell({ row, col })
      setSelectedCells(new Set([cellKey]))
      if (editingCellRef.current) {
        setEditingCell({ row, col })
      } else {
        setEditingCell(null)
      }
    }
  }

  const handleCellDoubleClick = (row: number, col: number) => {
    // Double-click: Enter edit mode
    setSelectedCell({ row, col })
    setSelectedCells(new Set([`${row}-${col}`]))
    setEditingCell({ row, col })
  }

  const handleCellMouseDown = (row: number, col: number, e?: React.MouseEvent) => {
    if (!e?.ctrlKey && !e?.metaKey && !e?.shiftKey) {
      setIsSelecting(true)
      setSelectionStart({ row, col })
      setSelectedCell({ row, col })
      setSelectedCells(new Set([`${row}-${col}`]))
      // Starting a drag-selection always exits editing mode
      if (editingCellRef.current && (editingCellRef.current.row !== row || editingCellRef.current.col !== col)) {
        setEditingCell(null)
      }
    }
  }

  const handleCellMouseEnter = (row: number, col: number) => {
    if (isSelecting && selectionStart) {
      const minRow = Math.min(selectionStart.row, row)
      const maxRow = Math.max(selectionStart.row, row)
      const minCol = Math.min(selectionStart.col, col)
      const maxCol = Math.max(selectionStart.col, col)

      const newSelection = new Set<string>()
      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          newSelection.add(`${r}-${c}`)
        }
      }
      console.log('After drag, selectedCells:', newSelection)
      setSelectedCells(newSelection)
    }
  }

  useEffect(() => {
    const handleMouseUp = () => {
      setIsSelecting(false)
    }
    document.addEventListener("mouseup", handleMouseUp)
    return () => document.removeEventListener("mouseup", handleMouseUp)
  }, [])

  useEffect(() => {
    const handleDocumentMouseDown = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return

      const elementTarget = target instanceof Element ? target : null

      // Deselect only when user clicks the top navigation/header bar.
      const clickedTopNav = !!elementTarget?.closest("[data-top-nav='true']")
      if (!clickedTopNav) {
        return
      }

      if (selectedCellsRef.current.size > 0 || selectedCellRef.current) {
        setSelectedCells(new Set())
        setSelectedCell(null)
        setEditingCell(null)
      }
    }

    document.addEventListener("mousedown", handleDocumentMouseDown)
    return () => document.removeEventListener("mousedown", handleDocumentMouseDown)
  }, [])

  // Close column menu when clicking outside
  useEffect(() => {
    if (colMenuOpen === null) return
    const handler = (e: MouseEvent) => {
      if (colMenuRef.current && !colMenuRef.current.contains(e.target as Node)) {
        setColMenuOpen(null)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [colMenuOpen])

  useEffect(() => {
    if (!showAddColPanel) return
    const handler = (e: MouseEvent) => {
      if (addColPanelRef.current && !addColPanelRef.current.contains(e.target as Node)) {
        setShowAddColPanel(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [showAddColPanel])

  const handleCellKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    // When a cell is selected and user starts typing, enter edit mode
    if (!editingCell && selectedCell?.row === row && selectedCell?.col === col) {
      if (e.key === "Enter") {
        e.preventDefault()
        setEditingCell({ row, col })
      } else if (e.key !== "Tab" && e.key !== "Escape" && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.key.length === 1) {
        // Any printable character: Enter edit mode
        e.preventDefault()
        setEditingCell({ row, col })
        // The character will be added by the input field's onChange after it mounts
      }
    } else if (editingCell?.row === row && editingCell?.col === col) {
      // Already editing
      if (e.key === "Enter") {
        setEditingCell(null)
        if (row < numRows - 1) {
          setSelectedCell({ row: row + 1, col })
        }
      } else if (e.key === "Tab") {
        e.preventDefault()
        setEditingCell(null)
        if (col < numCols - 1) {
          setSelectedCell({ row, col: col + 1 })
        }
      } else if (e.key === "Escape") {
        setEditingCell(null)
      }
    }
  }

  const handleDeleteAll = async () => {
    const defaultRows = 1
    const defaultCols = 1

    // Reset ALL local state immediately for instant UI response
    setCellsLocal({})
    setCellFormattingState({})
    setColumnWidthsLocal({})
    setRowHeightsLocal({})
    setMergedCells({})
    setNumRowsLocal(defaultRows)
    setNumColsLocal(defaultCols)
    setSelectedCell(null)
    setSelectedCells(new Set())
    setEditingCell(null)
    setFilters([])
    setFilteredRows(null)
    setSortColumn(null)
    setSortOrder("asc")
    setPendingAIChanges(null)
    setShowDeleteAllConfirm(false)

    // Persist full reset to DB: deletes all cells, formatting, column widths,
    // row heights and resets numRows/numCols to defaults
    await sync.resetAll(defaultRows, defaultCols)

    // Force re-initialisation from the now-clean DB state so every piece of
    // local state (including columnWidths, rowHeights, formatting) is guaranteed
    // to match the database after the reset
    setIsInitialized(false)
  }

  const handleAddRow = () => {
    setNumRows(numRows + 1)
  }

  const handleAddMultipleRows = (count: number) => {
    if (count > 0) {
      setNumRows(numRows + count)
    }
  }

  const handleAddColumn = () => {
    setNewColName("")
    setNewColColumnType("User Input")
    setNewColFieldType("Text")
    setNewColTypeExpanded(true)
    setNewColSearch("")
    setNewColAIPrompt("")
    setNewColTab("All")
    setNewColStep("browse")
    setNewColConfigPrompt("")
    setNewColSourceCol(0)
    setNewColRegex("")
    setShowAddColPanel(true)
  }

  // Types that need a configure step before adding
  const COL_TYPES_NEED_CONFIG = ["AI Agent", "AI Web", "Scrape Website", "Regex", "Normalize Company", "Read File"]

  const confirmAddColumn = (colType: string = newColColumnType) => {
    if (COL_TYPES_NEED_CONFIG.includes(colType)) {
      setNewColColumnType(colType)
      setNewColConfigPrompt("")
      setNewColStep("configure")
      return
    }
    doAddColumn(colType, newColName.trim() || colType, "", 0, "")
  }

  const doAddColumn = (colType: string, colName: string, configPrompt: string, sourceCol: number, regex: string) => {
    const newColIdx = numCols
    setColNames(prev => ({ ...prev, [newColIdx]: colName || colType }))
    setColColumnType(prev => ({ ...prev, [newColIdx]: colType }))
    setColFieldType(prev => ({ ...prev, [newColIdx]: newColFieldType }))
    setNumCols(numCols + 1)
    setShowAddColPanel(false)
    setNewColStep("browse")
    // For AI-powered column types, run generation immediately after adding
    if (["AI Agent", "AI Web"].includes(colType) && configPrompt) {
      runAIColumn(newColIdx, colType, configPrompt, sourceCol)
    } else if (colType === "Scrape Website") {
      runScrapeColumn(newColIdx, sourceCol)
    } else if (colType === "Regex") {
      runRegexColumn(newColIdx, sourceCol, regex)
    } else if (colType === "Normalize Company" || colType === "Normalize Domain") {
      runNormalizeColumn(newColIdx, colType, sourceCol)
    }
  }

  // Read an SSE stream from /api/ai/agent and resolve with the result payload
  const readAgentSSE = (response: Response): Promise<{ changes?: {row:number;col:number;value:string}[]; formatting?: unknown[]; summary?: string; newNumRows?: number; newNumCols?: number } | null> =>
    new Promise((resolve) => {
      const reader = response.body?.getReader()
      if (!reader) { resolve(null); return }
      const decoder = new TextDecoder()
      let result: ReturnType<typeof readAgentSSE> extends Promise<infer T> ? T : never = null
      const pump = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            for (const line of decoder.decode(value).split('\n')) {
              if (!line.startsWith('data: ')) continue
              const raw = line.slice(6).trim()
              if (raw === '[DONE]') break
              try {
                const evt = JSON.parse(raw)
                if (evt.type === 'result') result = evt.data
              } catch { /* skip */ }
            }
          }
        } finally {
          reader.releaseLock()
          resolve(result)
        }
      }
      pump()
    })

  const generateAIColumnFromPrompt = async () => {
    if (!newColAIPrompt.trim()) return
    setIsGeneratingCol(true)
    try {
      // Build spreadsheet context
      const cells: { [key: string]: string } = {}
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const v = getCellValue(r, c)
          if (v) cells[`${r}-${c}`] = v
        }
      }
      const agentPrompt = `Add a new column at column index ${numCols} (column ${getColumnLabel(numCols)}). For each row 0 to ${numRows - 1}, generate a value based on this instruction: "${newColAIPrompt}". Use existing column values as context. Return cell changes for every row in the new column.`
      const res = await fetch("/api/ai/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: agentPrompt, cells, numRows, numCols }),
      })
      if (!res.ok) throw new Error("AI request failed")
      const result = await readAgentSSE(res)
      if (result?.changes?.length) {
        // Derive column name from prompt (first 4 words)
        const autoName = newColAIPrompt.trim().split(/\s+/).slice(0, 4).join(" ")
        const colName = newColName.trim() || autoName
        setColNames(prev => ({ ...prev, [numCols]: colName }))
        setColColumnType(prev => ({ ...prev, [numCols]: "AI Agent" }))
        setColFieldType(prev => ({ ...prev, [numCols]: "Text" }))
        setNumCols(numCols + 1)
        // Apply the AI-generated cell changes
        const updates: { [key: string]: string } = {}
        result.changes.forEach((ch: { row: number; col: number; value: string }) => {
          updates[`${ch.row}-${ch.col}`] = ch.value
        })
        setCells(prev => ({ ...prev, ...updates }))
        await sync.setCellsBatch(updates)
      }
    } catch (e) {
      console.error("AI column generation failed", e)
    } finally {
      setIsGeneratingCol(false)
      setShowAddColPanel(false)
      setNewColStep("browse")
    }
  }

  const runAIColumn = async (colIdx: number, colType: string, prompt: string, _sourceCol: number) => {
    const cells: { [key: string]: string } = {}
    for (let r = 0; r < numRows; r++) for (let c = 0; c < numCols; c++) { const v = getCellValue(r, c); if (v) cells[`${r}-${c}`] = v }
    const agentPrompt = `For each row 0 to ${numRows - 1}, fill column ${colIdx} using this instruction: "${prompt}". Use existing row data as context.${colType === "AI Web" ? " You may reference web knowledge." : ""}`
    try {
      const res = await fetch("/api/ai/agent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: agentPrompt, cells, numRows, numCols: colIdx + 1 }) })
      const result = await readAgentSSE(res)
      if (result?.changes?.length) {
        const updates: { [key: string]: string } = {}
        result.changes.forEach((ch: { row: number; col: number; value: string }) => { updates[`${ch.row}-${ch.col}`] = ch.value })
        setCells(prev => ({ ...prev, ...updates }))
        await sync.setCellsBatch(updates)
      }
    } catch (e) { console.error("runAIColumn failed", e) }
  }

  const runScrapeColumn = async (colIdx: number, sourceCol: number) => {
    const updates: { [key: string]: string } = {}
    for (let r = 0; r < numRows; r++) {
      const url = getCellValue(r, sourceCol)
      if (!url) continue
      try {
        const res = await fetch("/api/ai/scraper", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: "Scrape this URL and return the main page content as plain text",
            mode: "enrich",
            selectedRows: [{ rowIndex: r, cells: { [String(sourceCol)]: url } }],
            existingColumns: Array.from({ length: numCols }, (_, i) => colNames[i] || getColumnLabel(i)),
            tableInfo: { tableId, projectName, numRows, numCols },
          }),
        })
        if (!res.ok) continue
        const reader = res.body?.getReader()
        if (!reader) continue
        const dec = new TextDecoder()
        let content = ""
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            for (const line of dec.decode(value).split('\n')) {
              if (!line.startsWith('data: ')) continue
              const raw = line.slice(6).trim()
              if (raw === '[DONE]') break
              try {
                const evt = JSON.parse(raw)
                if (evt.type === 'result' && evt.data?.columns?.length) {
                  const vals = evt.data.columns[0].values as { rowIndex: number; value: string }[]
                  if (vals?.length) content = String(vals[0].value || "")
                }
              } catch { /* skip malformed */ }
            }
          }
        } finally { reader.releaseLock() }
        if (content) updates[`${r}-${colIdx}`] = content
      } catch {}
    }
    if (Object.keys(updates).length) { setCells(prev => ({ ...prev, ...updates })); await sync.setCellsBatch(updates) }
  }

  const runRegexColumn = (colIdx: number, sourceCol: number, pattern: string) => {
    const updates: { [key: string]: string } = {}
    try {
      const re = new RegExp(pattern)
      for (let r = 0; r < numRows; r++) {
        const val = getCellValue(r, sourceCol)
        const m = val.match(re)
        updates[`${r}-${colIdx}`] = m ? (m[1] ?? m[0]) : ""
      }
    } catch {}
    if (Object.keys(updates).length) { setCells(prev => ({ ...prev, ...updates })); sync.setCellsBatch(updates) }
  }

  const runNormalizeColumn = (colIdx: number, colType: string, sourceCol: number) => {
    const updates: { [key: string]: string } = {}
    for (let r = 0; r < numRows; r++) {
      const val = getCellValue(r, sourceCol).trim()
      if (!val) continue
      if (colType === "Normalize Domain") {
        try { updates[`${r}-${colIdx}`] = new URL(val.startsWith("http") ? val : `https://${val}`).hostname.replace(/^www\./, "") } catch { updates[`${r}-${colIdx}`] = val }
      } else {
        // Normalize company: trim, title-case
        updates[`${r}-${colIdx}`] = val.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()).replace(/\bInc\b|\bLlc\b|\bLtd\b|\bCorp\b/g, s => s.toUpperCase())
      }
    }
    if (Object.keys(updates).length) { setCells(prev => ({ ...prev, ...updates })); sync.setCellsBatch(updates) }
  }

  // Open column header menu
  const openColMenu = (colIndex: number) => {
    setColMenuOpen(colIndex)
    setColMenuName(colNames[colIndex] ?? "Input")
    setColTypeExpanded(true)
  }

  // Save column name from menu
  const saveColMenu = (colIndex: number) => {
    if (colMenuName.trim()) {
      setColNames(prev => ({ ...prev, [colIndex]: colMenuName.trim() }))
    }
    setColMenuOpen(null)
  }

  // Sort column ASC / DESC from header menu
  const sortColFromMenu = (colIndex: number, order: "asc" | "desc") => {
    const rowIndices = Array.from({ length: numRows }, (_, i) => i)
    rowIndices.sort((a, b) => {
      const vA = getCellValue(a, colIndex).toLowerCase()
      const vB = getCellValue(b, colIndex).toLowerCase()
      const nA = parseFloat(vA), nB = parseFloat(vB)
      const cmp = (!isNaN(nA) && !isNaN(nB)) ? nA - nB : vA.localeCompare(vB)
      return order === "asc" ? cmp : -cmp
    })
    const newCells: { [key: string]: string } = {}
    const newFormatting: { [key: string]: CellFormatting } = {}
    rowIndices.forEach((oldRow, newRow) => {
      for (let col = 0; col < numCols; col++) {
        const v = getCellValue(oldRow, col)
        if (v) newCells[`${newRow}-${col}`] = v
        const fmt = cellFormatting[`${oldRow}-${col}`]
        if (fmt && Object.keys(fmt).length) newFormatting[`${newRow}-${col}`] = fmt
      }
    })
    setCells(newCells)
    setCellFormattingState(newFormatting)
    setSortColumn(colIndex)
    setSortOrder(order)
    setColMenuOpen(null)
  }

  // Duplicate column
  const duplicateColumn = (colIndex: number) => {
    const insertAt = colIndex + 1
    // Shift existing columns right
    const newCells: { [key: string]: string } = {}
    const newFormatting: { [key: string]: CellFormatting } = {}
    const newColNames: { [key: number]: string } = {}
    const newColColumnType: { [key: number]: string } = {}
    const newColFieldType: { [key: number]: string } = {}

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const targetCol = col < insertAt ? col : col + 1
        const v = getCellValue(row, col)
        if (v) newCells[`${row}-${targetCol}`] = v
        const fmt = cellFormatting[`${row}-${col}`]
        if (fmt && Object.keys(fmt).length) newFormatting[`${row}-${targetCol}`] = fmt
      }
      // copy duplicated col
      const v = getCellValue(row, colIndex)
      if (v) newCells[`${row}-${insertAt}`] = v
      const fmt = cellFormatting[`${row}-${colIndex}`]
      if (fmt && Object.keys(fmt).length) newFormatting[`${row}-${insertAt}`] = fmt
    }
    for (let col = 0; col < numCols; col++) {
      const targetCol = col < insertAt ? col : col + 1
      newColNames[targetCol] = colNames[col] ?? `Column ${col + 1}`
      newColColumnType[targetCol] = colColumnType[col] ?? "User Input"
      newColFieldType[targetCol] = colFieldType[col] ?? "Text"
    }
    newColNames[insertAt] = (colNames[colIndex] ?? "Input") + " (copy)"
    newColColumnType[insertAt] = colColumnType[colIndex] ?? "User Input"
    newColFieldType[insertAt] = colFieldType[colIndex] ?? "Text"

    setCellsLocal(newCells)
    setCellFormattingState(newFormatting)
    setColNames(newColNames)
    setColColumnType(newColColumnType)
    setColFieldType(newColFieldType)
    setNumCols(numCols + 1)
    setColMenuOpen(null)
  }

  // Clear all values in a column
  const clearColumn = (colIndex: number) => {
    const newCells = { ...cells }
    for (let row = 0; row < numRows; row++) {
      delete newCells[`${row}-${colIndex}`]
    }
    setCells(newCells)
    setColMenuOpen(null)
  }

  // Delete a column (shift remaining columns left)
  const deleteColumn = (colIndex: number) => {
    if (numCols <= 1) return
    const newCells: { [key: string]: string } = {}
    const newFormatting: { [key: string]: CellFormatting } = {}
    const newColNames: { [key: number]: string } = {}
    const newColColumnType: { [key: number]: string } = {}
    const newColFieldType: { [key: number]: string } = {}

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (col === colIndex) continue
        const newCol = col < colIndex ? col : col - 1
        const v = getCellValue(row, col)
        if (v) newCells[`${row}-${newCol}`] = v
        const fmt = cellFormatting[`${row}-${col}`]
        if (fmt && Object.keys(fmt).length) newFormatting[`${row}-${newCol}`] = fmt
      }
    }
    for (let col = 0; col < numCols; col++) {
      if (col === colIndex) continue
      const newCol = col < colIndex ? col : col - 1
      newColNames[newCol] = colNames[col] ?? `Column ${col + 1}`
      newColColumnType[newCol] = colColumnType[col] ?? "User Input"
      newColFieldType[newCol] = colFieldType[col] ?? "Text"
    }

    setCellsLocal(newCells)
    setCellFormattingState(newFormatting)
    setColNames(newColNames)
    setColColumnType(newColColumnType)
    setColFieldType(newColFieldType)
    setNumCols(numCols - 1)
    setColMenuOpen(null)
  }

  // Toggle hide column
  const toggleHideColumn = (colIndex: number) => {
    setHiddenCols(prev => {
      const next = new Set(prev)
      if (next.has(colIndex)) next.delete(colIndex)
      else next.add(colIndex)
      return next
    })
    setColMenuOpen(null)
  }

  // Add filter for column from menu
  const filterColumn = (colIndex: number) => {
    setFilters(prev => [...prev, { column: colIndex, value: "", operator: "contains" }])
    setShowFilter(true)
    setColMenuOpen(null)
  }

  const handleDeduplicate = () => {
    // Create a Set to track seen rows
    const seenRows = new Set<string>()
    const newCells: { [key: string]: string } = {}
    const newFormatting: { [key: string]: CellFormatting } = {}
    let newRowIndex = 0
    let duplicatesRemoved = 0

    // Iterate through each row
    for (let row = 0; row < numRows; row++) {
      // Get all cell values for this row
      const rowData: string[] = []
      for (let col = 0; col < numCols; col++) {
        rowData.push(getCellValue(row, col))
      }
      const rowKey = JSON.stringify(rowData)

      // Check if we've seen this row before
      if (!seenRows.has(rowKey)) {
        seenRows.add(rowKey)
        
        // Copy cells to new row index
        for (let col = 0; col < numCols; col++) {
          const oldKey = `${row}-${col}`
          const newKey = `${newRowIndex}-${col}`
          const value = getCellValue(row, col)
          if (value) {
            newCells[newKey] = value
          }
          
          // Copy formatting
          const oldFormat = cellFormatting[oldKey]
          if (oldFormat && Object.keys(oldFormat).length > 0) {
            newFormatting[newKey] = oldFormat
          }
        }
        newRowIndex++
      } else {
        duplicatesRemoved++
      }
    }

    // Update state
    setNumRows(newRowIndex)
    setCells(newCells)
    setCellFormattingState(newFormatting)
    setSelectedCell(null)
    setSelectedCells(new Set())
    
    // Show feedback
    if (duplicatesRemoved > 0) {
      alert(`Removed ${duplicatesRemoved} duplicate row(s). Total rows: ${newRowIndex}`)
    } else {
      alert('No duplicate rows found.')
    }
  }

  const handleSort = () => {
    if (numCols === 0 || numRows === 0) {
      alert('No data to sort')
      return
    }

    const columnInput = prompt(
      `Enter column to sort by (A-${getColumnLabel(numCols - 1)}):`,
      sortColumn !== null ? getColumnLabel(sortColumn) : 'A'
    )

    if (!columnInput) return

    // Convert column letter to index
    let colIndex = 0
    for (let i = 0; i < columnInput.length; i++) {
      colIndex = colIndex * 26 + (columnInput.charCodeAt(i) - 64)
    }
    colIndex = colIndex - 1

    if (colIndex < 0 || colIndex >= numCols) {
      alert(`Invalid column. Please enter a column between A and ${getColumnLabel(numCols - 1)}`)
      return
    }

    // Check if we're sorting the same column
    const newSortOrder = sortColumn === colIndex && sortOrder === "asc" ? "desc" : "asc"

    // Create array of rows with their original indices
    const rowIndices = Array.from({ length: numRows }, (_, i) => i)

    // Sort rows based on column values
    rowIndices.sort((rowA, rowB) => {
      const valueA = getCellValue(rowA, colIndex).toLowerCase()
      const valueB = getCellValue(rowB, colIndex).toLowerCase()

      // Try numeric comparison first
      const numA = parseFloat(valueA)
      const numB = parseFloat(valueB)

      let comparison = 0
      if (!isNaN(numA) && !isNaN(numB)) {
        comparison = numA - numB
      } else {
        comparison = valueA.localeCompare(valueB)
      }

      return newSortOrder === "asc" ? comparison : -comparison
    })

    // Reorganize cells and formatting based on sorted order
    const newCells: { [key: string]: string } = {}
    const newFormatting: { [key: string]: CellFormatting } = {}

    rowIndices.forEach((oldRowIndex, newRowIndex) => {
      for (let col = 0; col < numCols; col++) {
        const oldKey = `${oldRowIndex}-${col}`
        const newKey = `${newRowIndex}-${col}`
        const value = getCellValue(oldRowIndex, col)
        if (value) {
          newCells[newKey] = value
        }

        const oldFormat = cellFormatting[oldKey]
        if (oldFormat && Object.keys(oldFormat).length > 0) {
          newFormatting[newKey] = oldFormat
        }
      }
    })

    setCells(newCells)
    setCellFormattingState(newFormatting)
    setSortColumn(colIndex)
    setSortOrder(newSortOrder)
    setSelectedCell(null)
    setSelectedCells(new Set())

    const orderText = newSortOrder === "asc" ? "ascending" : "descending"
    alert(`Sorted by column ${getColumnLabel(colIndex)} in ${orderText} order`)
  }

  // Search functionality
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
    if (!term.trim()) {
      setSearchResults([])
      setCurrentSearchIndex(0)
      return
    }

    const results: { row: number; col: number }[] = []
    const lowerTerm = term.toLowerCase()
    
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const cellValue = getCellValue(row, col).toLowerCase()
        if (cellValue.includes(lowerTerm)) {
          results.push({ row, col })
        }
      }
    }
    
    setSearchResults(results)
    setCurrentSearchIndex(0)
    
    // Navigate to first result
    if (results.length > 0) {
      setSelectedCell(results[0])
      setSelectedCells(new Set([`${results[0].row}-${results[0].col}`]))
    }
  }, [numRows, numCols, cells])

  const navigateSearchResult = (direction: 'next' | 'prev') => {
    if (searchResults.length === 0) return
    
    let newIndex = currentSearchIndex
    if (direction === 'next') {
      newIndex = (currentSearchIndex + 1) % searchResults.length
    } else {
      newIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length
    }
    
    setCurrentSearchIndex(newIndex)
    const result = searchResults[newIndex]
    setSelectedCell(result)
    setSelectedCells(new Set([`${result.row}-${result.col}`]))
  }

  const toggleSearch = () => {
    setShowSearch(prev => {
      if (!prev) {
        // Opening search, focus input after render
        setTimeout(() => searchInputRef.current?.focus(), 100)
      } else {
        // Closing search, clear search state
        setSearchTerm("")
        setSearchResults([])
        setCurrentSearchIndex(0)
      }
      return !prev
    })
  }

  const isSearchMatch = (row: number, col: number): boolean => {
    return searchResults.some(r => r.row === row && r.col === col)
  }

  const isCurrentSearchMatch = (row: number, col: number): boolean => {
    if (searchResults.length === 0) return false
    const current = searchResults[currentSearchIndex]
    return current?.row === row && current?.col === col
  }

  // Filter functionality
  const applyFilters = useCallback(() => {
    if (filters.length === 0) {
      setFilteredRows(null)
      return
    }

    const matchingRows: number[] = []
    
    for (let row = 0; row < numRows; row++) {
      let rowMatches = true
      
      for (const filter of filters) {
        const cellValue = getCellValue(row, filter.column).toLowerCase()
        const filterValue = filter.value.toLowerCase()
        
        switch (filter.operator) {
          case 'contains':
            if (!cellValue.includes(filterValue)) rowMatches = false
            break
          case 'equals':
            if (cellValue !== filterValue) rowMatches = false
            break
          case 'not-contains':
            if (cellValue.includes(filterValue)) rowMatches = false
            break
          case 'not-equals':
            if (cellValue === filterValue) rowMatches = false
            break
        }
        
        if (!rowMatches) break
      }
      
      if (rowMatches) {
        matchingRows.push(row)
      }
    }
    
    setFilteredRows(matchingRows)
  }, [filters, numRows, numCols, cells])

  // Apply filters when filters change
  useEffect(() => {
    applyFilters()
  }, [filters, applyFilters])

  const addFilter = () => {
    setFilters(prev => [...prev, { column: 0, value: "", operator: "contains" }])
  }

  const updateFilter = (index: number, updates: Partial<typeof filters[0]>) => {
    setFilters(prev => prev.map((f, i) => i === index ? { ...f, ...updates } : f))
  }

  const removeFilter = (index: number) => {
    setFilters(prev => prev.filter((_, i) => i !== index))
  }

  const clearAllFilters = () => {
    setFilters([])
    setFilteredRows(null)
  }

  const handleImportCSVData = (importedCells: { [key: string]: string }, rows: number, cols: number) => {
    setNumCols(cols)
    setNumRows(rows)
    setCells(importedCells)
    // Preserve existing cell formatting on import
  }

  const handleClearAll = async () => {
    if (!confirm("Clear all data from the spreadsheet? This cannot be undone.")) return
    // Reset local state immediately
    setCells({})
    setNumRows(1)
    setNumCols(1)
    setCellFormattingState({})
    setMergedCells({})
    setFilters([])
    setFilteredRows(null)
    setSelectedCell(null)
    setSelectedCells(new Set())
    // Persist the reset to the backend so it survives refresh
    await sync.resetAll(1, 1)
  }

  const getCellFormatting = (row: number, col: number): CellFormatting => {
    return cellFormatting[`${row}-${col}`] || {}
  }

  const setCellFormatting = (row: number, col: number, format: CellFormatting) => {
    setCellFormattingState((prev) => ({
      ...prev,
      [`${row}-${col}`]: format,
    }))
    // Sync formatting to Convex
    sync.setCellFormatting(row, col, format)
  }

  const mergeCells = () => {
    if (selectedCells.size === 0) return

    // Convert selected cells to array and find bounds
    const cellArray = Array.from(selectedCells).map((key) => {
      const [row, col] = key.split('-').map(Number)
      return { row, col }
    })

    const startRow = Math.min(...cellArray.map((c) => c.row))
    const endRow = Math.max(...cellArray.map((c) => c.row))
    const startCol = Math.min(...cellArray.map((c) => c.col))
    const endCol = Math.max(...cellArray.map((c) => c.col))

    const rowSpan = endRow - startRow + 1
    const colSpan = endCol - startCol + 1

    setMergedCells((prev) => ({
      ...prev,
      [`${startRow}-${startCol}`]: { rowSpan, colSpan },
    }))

    // Clear selection
    setSelectedCell({ row: startRow, col: startCol })
    setSelectedCells(new Set([`${startRow}-${startCol}`]))
  }

  const unmergeCells = () => {
    if (!selectedCell) return

    const key = `${selectedCell.row}-${selectedCell.col}`
    setMergedCells((prev) => {
      const newMerged = { ...prev }
      delete newMerged[key]
      return newMerged
    })
  }

  const isCellMerged = (row: number, col: number): boolean => {
    return !!mergedCells[`${row}-${col}`]
  }

  const getMergeInfo = (row: number, col: number) => {
    return mergedCells[`${row}-${col}`] || { rowSpan: 1, colSpan: 1 }
  }

  const isRangeSelected = (): boolean => {
    return selectedCells.size > 1
  }

  const isInSelectedRange = (row: number, col: number): boolean => {
    return selectedCells.has(`${row}-${col}`)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 transition-all duration-300">
      {/* Top Header */}
      <div data-top-nav="true" className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Button variant="ghost" size="icon" className="shrink-0" onClick={() => router.push("/dashboard/tables")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Button>
        <Input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="h-8 max-w-xs border-none bg-transparent px-1 text-sm font-medium focus-visible:ring-1"
          placeholder="Untitled Project"
        />
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {sync.isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Cloud className="h-3.5 w-3.5" />
            )}
            <span>{sync.isSaving ? "Saving..." : "Saved"}</span>
          </div>
          <ThemeToggle />
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground cursor-pointer">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        {/* <Button variant="ghost" size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          Connect API
        </Button> */}
        <CSVImport onImport={handleImportCSVData} />
        <CSVExport
          projectName={projectName}
          numRows={numRows}
          numCols={numCols}
          getCellValue={getCellValue}
          getColumnLabel={getColumnLabel}
        />
        <div className="h-4 w-px bg-border" />
        <Button
          variant={showFilter ? "secondary" : "ghost"}
          size="sm"
          className="gap-2"
          onClick={() => setShowFilter(!showFilter)}
        >
          <Filter className="h-4 w-4" />
          Filter
          {filters.length > 0 && (
            <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
              {filters.length}
            </span>
          )}
        </Button>
        <Button variant="ghost" size="sm" className="gap-2" onClick={handleSort}>
          <ArrowUpDown className="h-4 w-4" />
          Sort
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <Columns3 className="h-4 w-4" />
          Columns
        </Button>
        <Button variant="ghost" size="sm" className="gap-2" onClick={handleDeduplicate}>
          <Trash2 className="h-4 w-4" />
          Dedupe
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 text-destructive hover:text-destructive" onClick={handleClearAll}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
          Clear All
        </Button>
        <Button
          variant={showSearch ? "secondary" : "ghost"}
          size="sm"
          className="gap-2"
          onClick={toggleSearch}
        >
          <Search className="h-4 w-4" />
          Search
          <kbd className="pointer-events-none ml-1 hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
            Ctrl+F
          </kbd>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 ml-auto">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button
          variant={showAIChat ? "secondary" : "default"}
          size="sm"
          className="gap-2"
          onClick={() => setShowAIChat(!showAIChat)}
        >
          <Sparkles className="h-4 w-4" />
          AI Agent
        </Button>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search in cells..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                navigateSearchResult(e.shiftKey ? 'prev' : 'next')
              } else if (e.key === 'Escape') {
                toggleSearch()
              }
            }}
            className="h-8 w-64 text-sm"
          />
          {searchResults.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {currentSearchIndex + 1} of {searchResults.length}
            </span>
          )}
          {searchTerm && searchResults.length === 0 && (
            <span className="text-xs text-muted-foreground">No results</span>
          )}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigateSearchResult('prev')}
              disabled={searchResults.length === 0}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigateSearchResult('next')}
              disabled={searchResults.length === 0}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={toggleSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Text Formatting Toolbar - shows when a cell is selected */}
      {selectedCell && (
        <TextFormattingToolbar
          selectedCell={selectedCell}
          selectedCells={selectedCells}
          getCellFormatting={getCellFormatting}
          setCellFormatting={setCellFormatting}
          getColumnLabel={getColumnLabel}
          isRangeSelected={isRangeSelected}
          isCellMerged={isCellMerged}
          onMergeCells={mergeCells}
          onUnmergeCells={unmergeCells}
        />
      )}

      {/* Filter Panel */}
      {showFilter && (
        <div className="border-b border-border bg-muted/30 px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters</span>
              {filteredRows !== null && (
                <span className="text-xs text-muted-foreground">
                  ({filteredRows.length} of {numRows} rows)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {filters.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  Clear All
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setShowFilter(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            {filters.map((filter, index) => (
              <div key={index} className="flex items-center gap-2">
                <select
                  value={filter.column}
                  onChange={(e) => updateFilter(index, { column: parseInt(e.target.value) })}
                  className="h-8 rounded-md border border-border bg-background px-2 text-sm"
                >
                  {Array.from({ length: numCols }).map((_, colIndex) => (
                    <option key={colIndex} value={colIndex}>
                      Column {getColumnLabel(colIndex)}
                    </option>
                  ))}
                </select>
                <select
                  value={filter.operator}
                  onChange={(e) => updateFilter(index, { operator: e.target.value as typeof filter.operator })}
                  className="h-8 rounded-md border border-border bg-background px-2 text-sm"
                >
                  <option value="contains">Contains</option>
                  <option value="equals">Equals</option>
                  <option value="not-contains">Does not contain</option>
                  <option value="not-equals">Does not equal</option>
                </select>
                <Input
                  type="text"
                  placeholder="Filter value..."
                  value={filter.value}
                  onChange={(e) => updateFilter(index, { value: e.target.value })}
                  className="h-8 w-48 text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => removeFilter(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button variant="outline" size="sm" onClick={addFilter} className="gap-1">
              <Plus className="h-3 w-3" />
              Add Filter
            </Button>
          </div>
        </div>
      )}

      {/* Main content area - Table */}
      <div className="flex flex-1 overflow-hidden">
        {/* Table container */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <div className="flex-1 overflow-auto" tabIndex={0} onKeyDown={(e) => {
            selectedCell && handleCellKeyDown(e as any, selectedCell.row, selectedCell.col);
          }}>
        <div className="inline-block min-w-full">
          <table className="border-collapse">
            <thead>
              <tr className="sticky top-0 z-20">
                {/* Corner cell with checkbox */}
                <th className="sticky left-0 z-30 w-10 border-b border-r border-border bg-background p-0 text-center text-xs font-medium text-muted-foreground">
                  <div className="flex items-center justify-center py-2.5">
                    <input type="checkbox" className="h-3.5 w-3.5 rounded border-border" />
                  </div>
                </th>
                {/* Named column headers with type icons - Loopster style */}
                {Array.from({ length: numCols }).map((_, colIndex) => {
                  if (hiddenCols.has(colIndex)) return null
                  const isMenuOpen = colMenuOpen === colIndex
                  return (
                  <th
                    key={colIndex}
                    style={{ width: columnWidths[colIndex] || 200 }}
                    className={`relative border-b border-r border-border p-0 text-left text-xs font-medium select-none ${isMenuOpen ? 'bg-primary/10 z-30' : 'bg-background z-0'}`}
                  >
                    {/* Header content */}
                    <div
                      className={`flex items-center gap-1.5 px-3 py-2 w-full cursor-pointer hover:bg-muted/40 transition-colors ${isMenuOpen ? 'bg-primary/10' : ''}`}
                      onClick={() => isMenuOpen ? setColMenuOpen(null) : openColMenu(colIndex)}
                    >
                      <Type className={`h-3.5 w-3.5 shrink-0 ${isMenuOpen ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`flex-1 min-w-0 truncate text-xs font-medium ${isMenuOpen ? 'text-primary' : ''}`}>
                        {colNames[colIndex] ?? "Input"}
                      </span>
                    </div>

                    {/* Column menu panel */}
                    {isMenuOpen && (
                      <div
                        ref={colMenuRef}
                        className="absolute left-0 top-full z-50 w-72 rounded-b-lg border border-border bg-background shadow-xl"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        {/* Column name input */}
                        <div className="px-3 pt-3 pb-2">
                          <input
                            autoFocus
                            value={colMenuName}
                            onChange={(e) => setColMenuName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') saveColMenu(colIndex); if (e.key === 'Escape') setColMenuOpen(null) }}
                            className="w-full rounded border border-border bg-muted/30 px-2 py-1.5 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        {/* COLUMN TYPE section */}
                        <div className="border-t border-border">
                          <button
                            className="flex w-full items-center justify-between px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:bg-muted/30"
                            onClick={() => setColTypeExpanded(v => !v)}
                          >
                            Column Type
                            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${colTypeExpanded ? 'rotate-180' : ''}`} />
                          </button>
                          {colTypeExpanded && (
                            <div className="px-3 pb-3 space-y-2">
                              {/* Column type row */}
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs text-muted-foreground w-14 shrink-0">Column</span>
                                <div className="relative flex-1">
                                  <select
                                    value={colColumnType[colIndex] ?? "User Input"}
                                    onChange={(e) => setColColumnType(prev => ({ ...prev, [colIndex]: e.target.value }))}
                                    className="w-full rounded border border-border bg-background px-2 py-1.5 text-xs appearance-none pr-6 cursor-pointer"
                                  >
                                    <option value="User Input">User Input</option>
                                    <option value="AI Agent">AI Agent</option>
                                    <option value="Formula">Formula</option>
                                  </select>
                                  <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                                </div>
                              </div>
                              {/* Field type row */}
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs text-muted-foreground w-14 shrink-0">Field</span>
                                <div className="relative flex-1">
                                  <select
                                    value={colFieldType[colIndex] ?? "Text"}
                                    onChange={(e) => setColFieldType(prev => ({ ...prev, [colIndex]: e.target.value }))}
                                    className="w-full rounded border border-border bg-background px-2 py-1.5 text-xs appearance-none pr-6 cursor-pointer"
                                  >
                                    <option value="Text">Text</option>
                                    <option value="Number">Number</option>
                                    <option value="URL">URL</option>
                                    <option value="Date">Date</option>
                                    <option value="Boolean">Boolean</option>
                                  </select>
                                  <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Save button */}
                        <div className="border-t border-border px-3 py-2">
                          <button
                            onClick={() => saveColMenu(colIndex)}
                            className="w-full rounded bg-foreground py-1.5 text-xs font-semibold text-background hover:opacity-90 transition-opacity"
                          >
                            Save
                          </button>
                        </div>

                        {/* Action buttons */}
                        <div className="border-t border-border">
                          {/* ASC / DESC */}
                          <div className="flex items-stretch border-b border-border">
                            <button
                              onClick={() => sortColFromMenu(colIndex, "asc")}
                              className="flex flex-1 items-center gap-2 px-3 py-2 text-xs hover:bg-muted/40 transition-colors"
                            >
                              <ChevronUp className="h-3.5 w-3.5" />
                              ASC
                            </button>
                            <div className="w-px bg-border" />
                            <button
                              onClick={() => sortColFromMenu(colIndex, "desc")}
                              className="flex flex-1 items-center gap-2 px-3 py-2 text-xs hover:bg-muted/40 transition-colors"
                            >
                              <ChevronDown className="h-3.5 w-3.5" />
                              DESC
                            </button>
                          </div>

                          {/* Dedupe (disabled for now) */}
                          <button
                            disabled
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-muted-foreground/50 cursor-not-allowed border-b border-border"
                          >
                            <GitMerge className="h-3.5 w-3.5" />
                            Dedupe
                          </button>

                          {/* Filter */}
                          <button
                            onClick={() => filterColumn(colIndex)}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs hover:bg-muted/40 transition-colors border-b border-border"
                          >
                            <Filter className="h-3.5 w-3.5" />
                            Filter
                          </button>

                          {/* Hide column */}
                          <button
                            onClick={() => toggleHideColumn(colIndex)}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs hover:bg-muted/40 transition-colors border-b border-border"
                          >
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                              <line x1="1" y1="1" x2="23" y2="23"/>
                            </svg>
                            Hide column
                          </button>

                          {/* Duplicate column */}
                          <button
                            onClick={() => duplicateColumn(colIndex)}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs hover:bg-muted/40 transition-colors border-b border-border"
                          >
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                            Duplicate column
                          </button>

                          {/* Clear column */}
                          <button
                            onClick={() => clearColumn(colIndex)}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs hover:bg-muted/40 transition-colors border-b border-border"
                          >
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                            </svg>
                            Clear column
                          </button>

                          {/* Delete column */}
                          <button
                            onClick={() => deleteColumn(colIndex)}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete column
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Resize handle */}
                    <div
                      onMouseDown={(e) => onMouseDown(e, colIndex)}
                      className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-primary/50 active:bg-primary"
                    />
                  </th>
                  )
                })}
                {/* Add column button with full functional panel */}
                <th
                  className={`relative min-w-24 border-b border-r border-dashed border-primary/40 bg-background p-0 text-left cursor-pointer transition-colors ${showAddColPanel ? 'bg-primary/10 z-30' : 'hover:bg-primary/5 z-0'}`}
                  onClick={() => !showAddColPanel && handleAddColumn()}
                >
                  <div className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-primary">
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </div>

                  {showAddColPanel && (
                    <div
                      ref={addColPanelRef}
                      className="absolute left-0 top-full z-50 w-80 rounded-b-lg border border-border bg-background shadow-2xl"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-border px-3 py-2">
                        <span className="text-xs font-semibold">
                          {newColStep === "configure" ? `Configure: ${newColColumnType}` : "Add Column"}
                        </span>
                        <button onClick={() => { setShowAddColPanel(false); setNewColStep("browse") }} className="text-muted-foreground hover:text-foreground">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Column name input (always visible) */}
                      <div className="px-3 pt-3 pb-2">
                        <label className="text-[11px] text-muted-foreground">Column name</label>
                        <input
                          autoFocus={newColStep === "browse"}
                          placeholder={newColStep === "configure" ? newColColumnType : "e.g. Email, Company..."}
                          value={newColName}
                          onChange={(e) => setNewColName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Escape') { setShowAddColPanel(false); setNewColStep("browse") } }}
                          className="mt-1 w-full rounded border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      {newColStep === "browse" ? (
                        <>
                          {/* Generate with AI */}
                          <div className="px-3 pb-2">
                            <label className="text-[11px] text-muted-foreground">Generate with AI</label>
                            <textarea
                              rows={2}
                              placeholder="Describe what values to generate for each row..."
                              value={newColAIPrompt}
                              onChange={(e) => setNewColAIPrompt(e.target.value)}
                              className="mt-1 w-full resize-none rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
                            />
                            <button
                              onClick={generateAIColumnFromPrompt}
                              disabled={!newColAIPrompt.trim() || isGeneratingCol}
                              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {isGeneratingCol ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
                              {isGeneratingCol ? "Generating..." : "Generate with AI"}
                            </button>
                          </div>

                          {/* Divider */}
                          <div className="flex items-center gap-2 px-3 pb-2">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-[10px] text-muted-foreground">or choose type</span>
                            <div className="flex-1 h-px bg-border" />
                          </div>

                          {/* Search */}
                          <div className="px-3 pb-2">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                              <input
                                placeholder="Search column types..."
                                value={newColSearch}
                                onChange={(e) => setNewColSearch(e.target.value)}
                                className="w-full rounded border border-border bg-muted/30 pl-8 pr-3 py-1.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                              />
                            </div>
                          </div>

                          {/* Tabs */}
                          <div className="flex border-b border-border px-3">
                            {["All", "Data Tools", "Enrichments", "Exports"].map(tab => (
                              <button key={tab} onClick={() => setNewColTab(tab)}
                                className={`mr-4 pb-2 pt-1 text-xs font-medium transition-colors border-b-2 -mb-px ${newColTab === tab ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                                {tab}
                              </button>
                            ))}
                          </div>

                          {/* Type list */}
                          <div className="max-h-52 overflow-y-auto">
                            {(newColTab === "All" || newColTab === "Data Tools") && (
                              <>
                                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/20">User Input</div>
                                {[
                                  { label: "Text / User Input", icon: <Type className="h-4 w-4" />, type: "User Input" },
                                  { label: "User Input – File", icon: <FileText className="h-4 w-4" />, type: "User Input - File" },
                                ].filter(i => !newColSearch || i.label.toLowerCase().includes(newColSearch.toLowerCase())).map(item => (
                                  <button key={item.label} onClick={() => confirmAddColumn(item.type)}
                                    className="flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-muted/40 transition-colors border-b border-border/50">
                                    <span className="text-muted-foreground shrink-0">{item.icon}</span>
                                    <span className="flex-1 text-left">{item.label}</span>
                                  </button>
                                ))}
                              </>
                            )}
                            {(newColTab === "All" || newColTab === "Enrichments") && (
                              <>
                                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/20">AI</div>
                                {[
                                  { label: "AI Generation", icon: <Sparkles className="h-4 w-4" />, type: "AI Agent", desc: "Fill rows using AI" },
                                  { label: "AI with Web Access", icon: <Globe className="h-4 w-4" />, type: "AI Web", desc: "AI with live web search" },
                                ].filter(i => !newColSearch || i.label.toLowerCase().includes(newColSearch.toLowerCase())).map(item => (
                                  <button key={item.label} onClick={() => confirmAddColumn(item.type)}
                                    className="flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-muted/40 transition-colors border-b border-border/50">
                                    <span className="text-muted-foreground shrink-0">{item.icon}</span>
                                    <div className="flex-1 text-left">
                                      <div>{item.label}</div>
                                      <div className="text-[11px] text-muted-foreground">{item.desc}</div>
                                    </div>
                                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground -rotate-90 shrink-0" />
                                  </button>
                                ))}
                              </>
                            )}
                            {(newColTab === "All" || newColTab === "Data Tools") && (
                              <>
                                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 bg-muted/20">API (PRO)</div>
                                <button disabled className="flex w-full items-center gap-3 px-3 py-2 text-sm border-b border-border/50 opacity-40 cursor-not-allowed">
                                  <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
                                  <span className="flex-1 text-left">HTTP (POST/GET)</span>
                                  <span className="flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground"><Zap className="h-2.5 w-2.5" />PRO</span>
                                </button>
                              </>
                            )}
                            {(newColTab === "All" || newColTab === "Enrichments") && (
                              <>
                                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/20">Tools</div>
                                {[
                                  { label: "Normalize Company Name", icon: <Building2 className="h-4 w-4" />, type: "Normalize Company", credit: "Free" },
                                  { label: "Normalize Domain", icon: <Link2 className="h-4 w-4" />, type: "Normalize Domain", credit: "Free" },
                                  { label: "Scrape Website", icon: <Globe className="h-4 w-4" />, type: "Scrape Website", credit: "~0.02" },
                                  { label: "Run Regex", icon: <span className="text-xs font-mono font-bold">(.*)</span>, type: "Regex", credit: "Free" },
                                  { label: "Read File (PDF, Image)", icon: <FileText className="h-4 w-4" />, type: "Read File", credit: "~1" },
                                ].filter(i => !newColSearch || i.label.toLowerCase().includes(newColSearch.toLowerCase())).map(item => (
                                  <button key={item.label} onClick={() => confirmAddColumn(item.type)}
                                    className="flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-muted/40 transition-colors border-b border-border/50">
                                    <span className="text-muted-foreground shrink-0">{item.icon}</span>
                                    <span className="flex-1 text-left">{item.label}</span>
                                    <span className={`text-[11px] shrink-0 ${item.credit === "Free" ? "text-green-600 dark:text-green-400 font-medium" : "text-muted-foreground"}`}>{item.credit}</span>
                                  </button>
                                ))}
                              </>
                            )}
                            {newColTab === "Exports" && (
                              <div className="px-3 py-8 text-center text-xs text-muted-foreground">No export columns available yet</div>
                            )}
                          </div>
                        </>
                      ) : (
                        /* CONFIGURE STEP */
                        <div className="px-3 pb-3">
                          {/* Source column selector (for tools that need input) */}
                          {["AI Agent", "AI Web", "Scrape Website", "Regex", "Normalize Company", "Normalize Domain", "Read File"].includes(newColColumnType) && (
                            <div className="mb-3">
                              <label className="text-[11px] text-muted-foreground">Source column</label>
                              <select
                                value={newColSourceCol}
                                onChange={(e) => setNewColSourceCol(Number(e.target.value))}
                                className="mt-1 w-full rounded border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary"
                              >
                                {Array.from({ length: numCols }).map((_, ci) => (
                                  <option key={ci} value={ci}>{getColumnLabel(ci)} — {colNames[ci] ?? `Col ${ci + 1}`}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/* AI prompt (for AI types) */}
                          {["AI Agent", "AI Web"].includes(newColColumnType) && (
                            <div className="mb-3">
                              <label className="text-[11px] text-muted-foreground">
                                AI prompt <span className="text-muted-foreground/60">(use {"{{A}}"}, {"{{B}}"} to reference columns)</span>
                              </label>
                              <textarea
                                autoFocus
                                rows={3}
                                placeholder={`e.g. "Summarize the company in column A in one sentence"`}
                                value={newColConfigPrompt}
                                onChange={(e) => setNewColConfigPrompt(e.target.value)}
                                className="mt-1 w-full resize-none rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
                              />
                            </div>
                          )}

                          {/* Regex pattern */}
                          {newColColumnType === "Regex" && (
                            <div className="mb-3">
                              <label className="text-[11px] text-muted-foreground">Regex pattern</label>
                              <input
                                autoFocus
                                placeholder="e.g. \d+ or ([a-z]+@[a-z]+\.[a-z]+)"
                                value={newColRegex}
                                onChange={(e) => setNewColRegex(e.target.value)}
                                className="mt-1 w-full rounded border border-border bg-background px-3 py-1.5 text-sm font-mono outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                              />
                              <p className="mt-1 text-[11px] text-muted-foreground">First capture group (or full match) is used as the cell value.</p>
                            </div>
                          )}

                          {["Scrape Website"].includes(newColColumnType) && (
                            <p className="mb-3 text-[11px] text-muted-foreground">Will scrape the URL in the selected source column for each row.</p>
                          )}
                          {["Normalize Company", "Normalize Domain"].includes(newColColumnType) && (
                            <p className="mb-3 text-[11px] text-muted-foreground">Will normalize each value in the selected source column.</p>
                          )}
                          {newColColumnType === "Read File" && (
                            <p className="mb-3 text-[11px] text-muted-foreground">Reads the file path/URL in the source column and extracts text content.</p>
                          )}

                          {/* Action buttons */}
                          <div className="flex gap-2">
                            <button onClick={() => setNewColStep("browse")}
                              className="flex-1 rounded border border-border px-3 py-1.5 text-xs hover:bg-muted/40 transition-colors">
                              Back
                            </button>
                            <button
                              onClick={() => doAddColumn(newColColumnType, newColName.trim() || newColColumnType, newColConfigPrompt, newColSourceCol, newColRegex)}
                              disabled={["AI Agent", "AI Web"].includes(newColColumnType) && !newColConfigPrompt.trim()}
                              className="flex-1 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Add Column &amp; Run
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {(filteredRows !== null ? filteredRows : Array.from({ length: numRows }, (_, i) => i)).map((rowIndex) => (
                <tr key={rowIndex} style={{ height: rowHeights[rowIndex] || 36 }} className="group hover:bg-muted/20">
                  {/* Row number */}
                  <td className="relative left-0 z-10 border-b border-r border-border bg-muted/80 p-2 text-center text-xs font-medium text-muted-foreground cursor-pointer select-none"
                      onDoubleClick={() => onRowHeaderDoubleClick(rowIndex)}
                  >
                    {rowIndex + 1}
                    {/* Resize handle */}
                    <div
                      onMouseDown={(e) => onRowMouseDown(e, rowIndex)}
                      className="absolute bottom-0 left-0 h-1 w-full cursor-row-resize hover:bg-primary/50 active:bg-primary"
                    />
                  </td>
                  {/* Cells */}
                  {Array.from({ length: numCols }).map((_, colIndex) => {
                    // Skip hidden columns
                    if (hiddenCols.has(colIndex)) return null

                    // Skip cells that are part of a merge (covered by another cell)
                    const isCoveredByMerge = Object.entries(mergedCells).some(([key, merge]) => {
                      const [mergeRow, mergeCol] = key.split('-').map(Number)
                      return (
                        rowIndex >= mergeRow &&
                        rowIndex < mergeRow + merge.rowSpan &&
                        colIndex >= mergeCol &&
                        colIndex < mergeCol + merge.colSpan &&
                        !(rowIndex === mergeRow && colIndex === mergeCol)
                      )
                    })

                    if (isCoveredByMerge) return null

                    const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                    const isEditing = editingCell?.row === rowIndex && editingCell?.col === colIndex
                    const isMatch = isSearchMatch(rowIndex, colIndex)
                    const isCurrentMatch = isCurrentSearchMatch(rowIndex, colIndex)
                    const width = columnWidths[colIndex] || 150
                    const height = rowHeights[rowIndex] || 36
                    const formatting = getCellFormatting(rowIndex, colIndex)
                    const cellValue = getCellValue(rowIndex, colIndex)
                    const fontSize = formatting.fontSize || 14
                    const charWidth = fontSize * 0.6 // Approximate character width (roughly 60% of font size)
                    const paddingLeft = 2 + charWidth // Base padding + one character width
                    const mergeInfo = getMergeInfo(rowIndex, colIndex)

                    // Determine background color based on selection and search
                    let bgColor = formatting.backgroundColor
                    if (isCurrentMatch) {
                      bgColor = "rgb(251, 191, 36)" // amber-400 for current match
                    } else if (isMatch) {
                      bgColor = "rgb(253, 230, 138)" // amber-200 for other matches
                    }

                    return (
                      <td
                        key={colIndex}
                        data-grid-cell="true"
                        rowSpan={mergeInfo.rowSpan}
                        colSpan={mergeInfo.colSpan}
                        style={{
                          width,
                          height,
                          backgroundColor: bgColor,
                          borderBottom: "1px solid var(--border)",
                          borderRight: "1px solid var(--border)",
                          padding: 0,
                          userSelect: "none",
                        }}
                        className={`${
                          isSelected ? "ring-2 ring-inset ring-primary" : ""
                        } ${
                          isInSelectedRange(rowIndex, colIndex) && !isMatch ? "bg-primary/20" : ""
                        }`}
                        onClick={(e) => handleCellClick(rowIndex, colIndex, e)}
                        onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
                        onMouseDown={(e) => handleCellMouseDown(rowIndex, colIndex, e)}
                        onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                        title={cellValue}
                      >
                        {isEditing ? (
                          colFieldType[colIndex] === "Boolean" ? (
                            <select
                              ref={editInputRef as unknown as React.RefObject<HTMLSelectElement>}
                              value={cellValue}
                              onChange={(e) => setCellValue(rowIndex, colIndex, e.target.value)}
                              onKeyDown={(e) => handleCellKeyDown(e, rowIndex, colIndex)}
                              onBlur={() => setEditingCell(null)}
                              autoFocus
                              style={{
                                width: "100%",
                                height: "100%",
                                color: formatting.textColor || "inherit",
                                backgroundColor: "transparent",
                                fontSize: `${fontSize}px`,
                                paddingLeft: `${paddingLeft}px`,
                                paddingRight: "8px",
                                boxSizing: "border-box",
                                border: "none",
                                outline: "none",
                                fontFamily: "inherit",
                              }}
                            >
                              <option value="">—</option>
                              <option value="true">true</option>
                              <option value="false">false</option>
                            </select>
                          ) : (
                          <input
                            ref={editInputRef}
                            value={cellValue}
                            onChange={(e) => {
                              const v = e.target.value
                              if (colFieldType[colIndex] === "Number") {
                                // Allow digits, decimal point, minus sign, and empty
                                if (v === "" || v === "-" || /^-?\d*\.?\d*$/.test(v)) {
                                  setCellValue(rowIndex, colIndex, v)
                                }
                              } else {
                                setCellValue(rowIndex, colIndex, v)
                              }
                            }}
                            onKeyDown={(e) => handleCellKeyDown(e, rowIndex, colIndex)}
                            onBlur={() => setEditingCell(null)}
                            type={
                              colFieldType[colIndex] === "Number" ? "text" :
                              colFieldType[colIndex] === "Date" ? "date" :
                              "text"
                            }
                            autoComplete="off"
                            style={{ 
                              width: "100%",
                              height: "100%",
                              color: formatting.textColor || "inherit",
                              backgroundColor: "transparent",
                              fontSize: `${fontSize}px`,
                              fontWeight: formatting.bold ? "bold" : "normal",
                              fontStyle: formatting.italic ? "italic" : "normal",
                              textDecoration: formatting.underline ? "underline" : "none",
                              textAlign: colFieldType[colIndex] === "Number" ? "right" : (formatting.alignment || "left"),
                              paddingLeft: `${paddingLeft}px`,
                              paddingRight: "8px",
                              paddingTop: "0px",
                              paddingBottom: "0px",
                              boxSizing: "border-box",
                              margin: 0,
                              border: "none",
                              outline: "none",
                              lineHeight: "1",
                              fontFamily: "inherit",
                              letterSpacing: "inherit",
                              verticalAlign: "top",
                            }}
                          />
                          )
                        ) : (
                          <div 
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: colFieldType[colIndex] === "Number"
                                ? "flex-end"
                                : formatting.alignment === "center" ? "center" : formatting.alignment === "right" ? "flex-end" : "flex-start",
                              color: formatting.textColor,
                              fontSize: `${fontSize}px`,
                              fontWeight: formatting.bold ? "bold" : "normal",
                              fontStyle: formatting.italic ? "italic" : "normal",
                              textDecoration: formatting.underline ? "underline" : "none",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              paddingLeft: formatting.alignment === "left" ? `${paddingLeft}px` : "8px",
                              paddingRight: (formatting.alignment === "right" || colFieldType[colIndex] === "Number") ? `${paddingLeft}px` : "8px",
                              paddingTop: "0px",
                              paddingBottom: "0px",
                              boxSizing: "border-box",
                              userSelect: "none",
                              WebkitUserSelect: "none",
                            }}
                          >
                            {colFieldType[colIndex] === "URL" && cellValue && /^https?:\/\//i.test(cellValue) ? (
                              <a
                                href={cellValue}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{ color: "var(--primary)", textDecoration: "underline", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}
                              >
                                {cellValue}
                              </a>
                            ) : colFieldType[colIndex] === "Boolean" ? (
                              <span style={{ color: cellValue === "true" ? "var(--primary)" : cellValue === "false" ? "var(--destructive)" : "inherit" }}>
                                {cellValue === "true" ? "✓" : cellValue === "false" ? "✗" : cellValue}
                              </span>
                            ) : (
                              cellValue
                            )}
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
              {/* + New entry row - Loopster style */}
              <tr
                className="h-9 hover:bg-muted/20 cursor-pointer group/newentry"
                onClick={handleAddRow}
              >
                <td className="border-b border-r border-border px-2 w-10">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground opacity-0 group-hover/newentry:opacity-100 transition-opacity">
                    <Plus className="h-3 w-3" />
                    New entry
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Bar - Loopster style */}
      <div className="flex items-center justify-between border-t border-border px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" className="gap-1.5 h-7 text-xs" onClick={handleAddRow}>
            <Plus className="h-3.5 w-3.5" />
            New entry
            <kbd className="ml-1 inline-flex h-4 items-center rounded border border-border bg-muted px-1 font-mono text-[10px]">N</kbd>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 h-7 text-xs">
            <RefreshCw className="h-3.5 w-3.5" />
            Auto scroll off
          </Button>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            Records: <strong className="text-foreground">{filteredRows !== null ? filteredRows.length : numRows}</strong> rows
          </span>
          <span>Views:</span>
          <Button variant="ghost" size="sm" className="h-6 gap-1 bg-primary/10 text-primary text-xs px-2">
            🪡 Main
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
        </div>
      </div>
      </div>

      {/* AI Chat Panel - full right side of page */}
      <div data-ai-chat-panel="true">
        <AIChatPanel
          isOpen={showAIChat}
          onClose={() => setShowAIChat(false)}
          tableContext={{
            tableId,
            projectName,
            numRows,
            numCols,
            selectedCells,
            getCellValue,
            getColumnLabel,
            getCellFormatting,
          }}
          onApplyFormatting={(formattingChanges) => {
            formattingChanges.forEach(({ row, col, format }) => {
              const existing = getCellFormatting(row, col)
              setCellFormatting(row, col, { ...existing, ...format })
            })
          }}
          onApplyChanges={(changes, newNumRows, newNumCols) => {
            // Save previous state for undo
            const previousState = {
              cells: { ...cells },
              numRows,
              numCols,
            }

            // Apply dimension changes first
            if (newNumRows && newNumRows > numRows) setNumRows(newNumRows)
            if (newNumCols && newNumCols > numCols) setNumCols(newNumCols)

            // Apply cell changes
            changes.forEach(({ row, col, value }) => {
              setCellValue(row, col, value)
            })

            // Store for undo
            setPendingAIChanges({
              type: 'generate',
              previousState,
              newChanges: changes,
              summary: `Agent applied ${changes.length} change${changes.length === 1 ? "" : "s"}`,
            })
          }}
          onAddColumns={(columns) => {
            // Save previous state for undo
            const previousState = {
              cells: { ...cells },
              numRows,
              numCols,
            }

            // Calculate new changes
            const startCol = numCols
            let maxColIndex = startCol
            const newChanges: { row: number; col: number; value: string }[] = []

            columns.forEach((column, colOffset) => {
              const colIndex = startCol + colOffset
              maxColIndex = Math.max(maxColIndex, colIndex + 1)

              // Write header to row 0
              newChanges.push({ row: 0, col: colIndex, value: column.header })

              column.values.forEach(({ rowIndex, value }) => {
                newChanges.push({ row: rowIndex, col: colIndex, value })
              })
            })

            // Apply changes immediately (preview)
            newChanges.forEach(({ row, col, value }) => {
              setCellValue(row, col, value)
            })
            setNumCols(maxColIndex)

            // Store for undo
            const columnNames = columns.map(c => c.header).join(", ")
            setPendingAIChanges({
              type: 'enrich',
              previousState,
              newChanges,
              summary: `Added columns: ${columnNames}`,
            })
          }}
          onGenerateTable={(table) => {
            // Save previous state for undo
            const previousState = {
              cells: { ...cells },
              numRows,
              numCols,
              colNames: { ...colNames },
              colFieldType: { ...colFieldType },
            }

            const { headers, rows } = table
            const newNumCols = headers.length
            const newNumRows = rows.length
            const newChanges: { row: number; col: number; value: string }[] = []

            // Set headers as column names
            const newColNames: { [key: number]: string } = {}
            headers.forEach((header, colIndex) => {
              newColNames[colIndex] = header
            })

            // Auto-detect field type for each column from the data values
            const newColFieldTypes: { [key: number]: string } = {}
            headers.forEach((_, colIndex) => {
              const colValues = rows.map(row => row[colIndex] ?? "")
              newColFieldTypes[colIndex] = detectFieldType(colValues)
            })

            // Collect data rows starting at row 0
            rows.forEach((row, rowIndex) => {
              row.forEach((value, colIndex) => {
                newChanges.push({ row: rowIndex, col: colIndex, value })
              })
            })

            // Apply changes immediately (preview)
            setNumCols(newNumCols)
            setNumRows(newNumRows)
            setColNames(newColNames)
            setColFieldType(newColFieldTypes)
            newChanges.forEach(({ row, col, value }) => {
              setCellValue(row, col, value)
            })

            // Store for undo
            setPendingAIChanges({
              type: 'generate',
              previousState,
              newChanges,
              summary: `Generated ${newNumRows} rows × ${newNumCols} columns`,
            })
          }}
          pendingChanges={pendingAIChanges}
          onKeepChanges={() => setPendingAIChanges(null)}
          onUndoChanges={() => {
            if (pendingAIChanges?.previousState) {
              const { cells: prevCells, numRows: prevRows, numCols: prevCols, colNames: prevColNames, colFieldType: prevColFieldType } = pendingAIChanges.previousState

              // Restore dimensions (syncs to Convex)
              setNumRows(prevRows)
              setNumCols(prevCols)
              if (prevColNames) setColNames(prevColNames)
              if (prevColFieldType) setColFieldType(prevColFieldType)

              // Clear new cells first
              pendingAIChanges.newChanges.forEach(({ row, col }) => {
                const key = `${row}-${col}`
                if (!prevCells[key]) {
                  setCellValue(row, col, '')
                }
              })

              // Restore previous cell values
              Object.entries(prevCells).forEach(([key, value]) => {
                const [row, col] = key.split('-').map(Number)
                setCellValue(row, col, value)
              })
            }
            setPendingAIChanges(null)
          }}
        />
      </div>

      {/* Copy Notification */}
      {showCopyNotification && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          Copied {selectedCells.size} cell(s)
        </div>
      )}

      {/* Delete All Confirmation Dialog */}
      {showDeleteAllConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg border border-border bg-background p-6 shadow-xl">
            <div className="mb-1 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <h2 className="text-base font-semibold">Delete all data?</h2>
            </div>
            <p className="mb-6 pl-13 text-sm text-muted-foreground">
              This will permanently clear all cells, formatting, filters, and sort settings. The spreadsheet will be reset to its default state. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteAllConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteAll}
              >
                Delete All
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
