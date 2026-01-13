"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

export default function TableEditorPage() {
  const router = useRouter()
  const [projectName, setProjectName] = useState("Untitled Project")
  const [numRows, setNumRows] = useState(1)
  const [numCols, setNumCols] = useState(1)
  const [cells, setCells] = useState<{ [key: string]: string }>({})
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null)
  const [columnWidths, setColumnWidths] = useState<{ [key: number]: number }>({ 0: 150 })
  const [rowHeights, setRowHeights] = useState<{ [key: number]: number }>({})
  const resizingRef = useRef<{ col?: number; row?: number; startPos: number; startSize: number } | null>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

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

  const getCellValue = (row: number, col: number): string => {
    return cells[`${row}-${col}`] || ""
  }

  const setCellValue = (row: number, col: number, value: string) => {
    setCells({ ...cells, [`${row}-${col}`]: value })
  }

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col })
    setEditingCell({ row, col })
  }

  const handleCellKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    if (e.key === "Enter") {
      setEditingCell(null)
      if (row < numRows - 1) {
        setSelectedCell({ row: row + 1, col })
        setEditingCell({ row: row + 1, col })
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      setEditingCell(null)
      if (col < numCols - 1) {
        setSelectedCell({ row, col: col + 1 })
        setEditingCell({ row, col: col + 1 })
      }
    } else if (e.key === "Escape") {
      setEditingCell(null)
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
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Cols synced</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Rows synced</span>
          </div>
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
        <Button variant="ghost" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Import CSV
        </Button>
        <div className="h-4 w-px bg-border" />
        <Button variant="ghost" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowUpDown className="h-4 w-4" />
          Sort
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <Columns3 className="h-4 w-4" />
          Columns
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
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
        <Button variant="ghost" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
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

      <div className="flex-1 overflow-auto">
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
                    className="relative border-b border-r border-border bg-muted p-2 text-center text-xs font-medium text-muted-foreground"
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
                  <td className="relative left-0 z-10 border-b border-r border-border bg-muted/80 p-2 text-center text-xs font-medium text-muted-foreground">
                    {rowIndex + 1}
                    {/* Resize handle */}
                    <div
                      onMouseDown={(e) => onRowMouseDown(e, rowIndex)}
                      className="absolute bottom-0 left-0 h-1 w-full cursor-row-resize hover:bg-primary/50 active:bg-primary"
                    />
                  </td>
                  {/* Cells */}
                  {Array.from({ length: numCols }).map((_, colIndex) => {
                    const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                    const isEditing = editingCell?.row === rowIndex && editingCell?.col === colIndex
                    const width = columnWidths[colIndex] || 150
                    const height = rowHeights[rowIndex] || 36
                    return (
                      <td
                        key={colIndex}
                        style={{ width, height }}
                        className={`border-b border-r border-border p-0 ${
                          isSelected ? "ring-2 ring-inset ring-primary" : ""
                        }`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                        {isEditing ? (
                          <Input
                            ref={editInputRef}
                            value={getCellValue(rowIndex, colIndex)}
                            onChange={(e) => setCellValue(rowIndex, colIndex, e.target.value)}
                            onKeyDown={(e) => handleCellKeyDown(e, rowIndex, colIndex)}
                            onBlur={() => setEditingCell(null)}
                            style={{ height }}
                            className="w-full rounded-none border-none bg-background px-2 text-sm focus-visible:ring-0"
                          />
                        ) : (
                          <div style={{ width, height }} className="truncate px-2 py-2 text-sm">
                            {getCellValue(rowIndex, colIndex)}
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
          <Button variant="ghost" size="sm">
            Auto scroll off
          </Button>
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
    </div>
  )
}
