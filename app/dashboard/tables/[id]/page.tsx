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
import { useAuth } from "@/lib/auth-context"
import { useSpreadsheetSync } from "@/lib/use-spreadsheet-sync"
import {
  ArrowLeft,
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
  Users,
  Loader2,
  Cloud,
  CloudOff,
  Check,
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
  
  const resizingRef = useRef<{ col?: number; row?: number; startPos: number; startSize: number } | null>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
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
        if (e.key === 'c' || e.key === 'C') {
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
      // Single click: Select the cell only (NO edit mode)
      setSelectedCell({ row, col })
      setSelectedCells(new Set([cellKey]))
      setEditingCell(null)
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

  const handleAddRow = () => {
    setNumRows(numRows + 1)
  }

  const handleAddMultipleRows = (count: number) => {
    if (count > 0) {
      setNumRows(numRows + count)
    }
  }

  const handleAddColumn = () => {
    setNumCols(numCols + 1)
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

  const handleImportCSVData = (importedCells: { [key: string]: string }, rows: number, cols: number) => {
    setNumCols(cols)
    setNumRows(rows)
    setCells(importedCells)
    // Preserve existing cell formatting on import
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
    <div className="flex h-screen flex-col bg-background">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Projects</span>
            <span className="text-muted-foreground">›</span>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="h-7 w-48 border-none bg-transparent px-1 text-sm font-medium focus-visible:ring-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Autorun Off</div>
            {/* Real-time sync status indicator */}
            <div className="flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs">
              {sync.isSaving ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                  <span className="text-blue-500">Saving...</span>
                </>
              ) : sync.lastSaved ? (
                <>
                  <Cloud className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">Saved</span>
                </>
              ) : sync.isLoading ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">Loading...</span>
                </>
              ) : (
                <>
                  <CloudOff className="h-3 w-3 text-yellow-500" />
                  <span className="text-yellow-500">Offline</span>
                </>
              )}
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="default" size="sm" className="gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
            Need Help?
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <Button variant="ghost" size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          Connect API
        </Button>
        <CSVImport onImport={handleImportCSVData} />
        <div className="h-4 w-px bg-border" />
        <Button variant="ghost" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
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
        <Button variant="ghost" size="sm" className="gap-2">
          <Search className="h-4 w-4" />
          Search
          <kbd className="pointer-events-none ml-1 hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
            <span className="text-xs">Ctrl</span>+<span className="text-xs">F</span>
          </kbd>
        </Button>
        <div className="flex-1" />
        <CSVExport
          projectName={projectName}
          numRows={numRows}
          numCols={numCols}
          getCellValue={getCellValue}
          getColumnLabel={getColumnLabel}
        />
        <Button variant="ghost" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button variant="default" size="sm" className="gap-2">
          <Sparkles className="h-4 w-4" />
          AI Agent
          <Users className="h-4 w-4" />
        </Button>
      </div>

      {/* Text Formatting Toolbar */}
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

      <div className="flex-1 overflow-auto" tabIndex={0} onKeyDown={(e) => {
        selectedCell && handleCellKeyDown(e as any, selectedCell.row, selectedCell.col);
      }}>
        <div className="inline-block min-w-full">
          <table className="border-collapse">
            <thead>
              <tr className="sticky top-0 z-20">
                {/* Corner cell */}
                <th className="sticky left-0 z-30 w-12 border-b border-r border-border bg-muted p-2 text-center text-xs font-medium text-muted-foreground">
                  <input type="checkbox" className="rounded border-border" />
                </th>
                {/* Column headers A, B, C, etc. */}
                {Array.from({ length: numCols }).map((_, colIndex) => (
                  <th
                    key={colIndex}
                    style={{ width: columnWidths[colIndex] || 150 }}
                    className="relative border-b border-r border-border bg-muted p-2 text-center text-xs font-medium text-muted-foreground cursor-pointer select-none"
                    onDoubleClick={() => onColumnHeaderDoubleClick(colIndex)}
                  >
                    {getColumnLabel(colIndex)}
                    {/* Resize handle */}
                    <div
                      onMouseDown={(e) => onMouseDown(e, colIndex)}
                      className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-primary/50 active:bg-primary"
                    />
                  </th>
                ))}
                <th
                  className="min-w-20 border-b border-border bg-muted p-2 text-left cursor-pointer hover:bg-muted/80"
                  onClick={handleAddColumn}
                >
                  <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <Plus className="h-3 w-3" />
                    Add
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: numRows }).map((_, rowIndex) => (
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
                    const width = columnWidths[colIndex] || 150
                    const height = rowHeights[rowIndex] || 36
                    const formatting = getCellFormatting(rowIndex, colIndex)
                    const cellValue = getCellValue(rowIndex, colIndex)
                    const fontSize = formatting.fontSize || 14
                    const charWidth = fontSize * 0.6 // Approximate character width (roughly 60% of font size)
                    const paddingLeft = 2 + charWidth // Base padding + one character width
                    const mergeInfo = getMergeInfo(rowIndex, colIndex)

                    const cellStyle: React.CSSProperties = {
                      width,
                      height,
                      backgroundColor: formatting.backgroundColor,
                      color: formatting.textColor,
                      fontSize: `${fontSize}px`,
                      fontWeight: formatting.bold ? "bold" : "normal",
                      fontStyle: formatting.italic ? "italic" : "normal",
                      textDecoration: formatting.underline ? "underline" : "none",
                      textAlign: formatting.alignment || "left",
                      paddingLeft: `${paddingLeft}px`,
                      paddingRight: "8px",
                      paddingTop: "4px",
                      paddingBottom: "4px",
                    }

                    return (
                      <td
                        key={colIndex}
                        rowSpan={mergeInfo.rowSpan}
                        colSpan={mergeInfo.colSpan}
                        style={{
                          width,
                          height,
                          backgroundColor: formatting.backgroundColor,
                          borderBottom: "1px solid var(--border)",
                          borderRight: "1px solid var(--border)",
                          padding: 0,
                          userSelect: "none",
                        }}
                        className={`${
                          isSelected ? "ring-2 ring-inset ring-primary" : ""
                        } ${
                          isInSelectedRange(rowIndex, colIndex) ? "bg-primary/20" : ""
                        }`}
                        onClick={(e) => handleCellClick(rowIndex, colIndex, e)}
                        onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
                        onMouseDown={(e) => handleCellMouseDown(rowIndex, colIndex, e)}
                        onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                        title={cellValue}
                      >
                        {isEditing ? (
                          <input
                            ref={editInputRef}
                            value={cellValue}
                            onChange={(e) => setCellValue(rowIndex, colIndex, e.target.value)}
                            onKeyDown={(e) => handleCellKeyDown(e, rowIndex, colIndex)}
                            onBlur={() => setEditingCell(null)}
                            type="text"
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
                              textAlign: formatting.alignment || "left",
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
                        ) : (
                          <div 
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: formatting.alignment === "center" ? "center" : formatting.alignment === "right" ? "flex-end" : "flex-start",
                              color: formatting.textColor,
                              fontSize: `${fontSize}px`,
                              fontWeight: formatting.bold ? "bold" : "normal",
                              fontStyle: formatting.italic ? "italic" : "normal",
                              textDecoration: formatting.underline ? "underline" : "none",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              paddingLeft: formatting.alignment === "left" ? `${paddingLeft}px` : "8px",
                              paddingRight: formatting.alignment === "right" ? `${paddingLeft}px` : "8px",
                              paddingTop: "0px",
                              paddingBottom: "0px",
                              boxSizing: "border-box",
                              userSelect: "none",
                              WebkitUserSelect: "none",
                            }}
                          >
                            {cellValue}
                          </div>
                        )}
                      </td>
                    )
                  })}
                  <td className="border-b border-border bg-muted/5"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between border-t border-border px-4 py-2">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-2" onClick={handleAddRow}>
            <Plus className="h-4 w-4" />
            New entry
          </Button>
          <Input
            type="number"
            min="1"
            placeholder="Add rows"
            className="h-8 w-32"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const count = parseInt((e.target as HTMLInputElement).value, 10)
                handleAddMultipleRows(count)
                ;(e.target as HTMLInputElement).value = ""
              }
            }}
          />
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Records: {numRows} rows</span>
          <span>Views:</span>
          <Button variant="ghost" size="sm" className="h-7 gap-1 bg-primary/10 text-primary">
            <Columns3 className="h-3 w-3" />
            Main
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Copy Notification */}
      {showCopyNotification && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg">
          Copied {selectedCells.size} cell(s)
        </div>
      )}
    </div>
  )
}
