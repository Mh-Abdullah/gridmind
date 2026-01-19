"use client"

import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eraser,
  Rows3,
  Columns3,
} from "lucide-react"

interface CellFormatting {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  alignment?: "left" | "center" | "right"
  textColor?: string
  backgroundColor?: string
  fontSize?: number
}

interface TextFormattingToolbarProps {
  selectedCell: { row: number; col: number } | null
  selectedCells?: Set<string>
  getCellFormatting: (row: number, col: number) => CellFormatting
  setCellFormatting: (row: number, col: number, format: CellFormatting) => void
  getColumnLabel: (index: number) => string
  isRangeSelected?: () => boolean
  isCellMerged?: (row: number, col: number) => boolean
  onMergeCells?: () => void
  onUnmergeCells?: () => void
}

export function TextFormattingToolbar({
  selectedCell,
  selectedCells,
  getCellFormatting,
  setCellFormatting,
  getColumnLabel,
  isRangeSelected,
  isCellMerged,
  onMergeCells,
  onUnmergeCells,
}: TextFormattingToolbarProps) {
  const getSelectedCells = () => {
    if (selectedCells && selectedCells.size > 0) {
      return Array.from(selectedCells).map((key) => {
        const [row, col] = key.split('-').map(Number)
        return { row, col }
      })
    }
    return selectedCell ? [selectedCell] : []
  }

  const toggleBold = () => {
    const cells = getSelectedCells()
    cells.forEach(({ row, col }) => {
      const formatting = getCellFormatting(row, col)
      setCellFormatting(row, col, {
        ...formatting,
        bold: !formatting.bold,
      })
    })
  }

  const toggleItalic = () => {
    const cells = getSelectedCells()
    cells.forEach(({ row, col }) => {
      const formatting = getCellFormatting(row, col)
      setCellFormatting(row, col, {
        ...formatting,
        italic: !formatting.italic,
      })
    })
  }

  const toggleUnderline = () => {
    const cells = getSelectedCells()
    cells.forEach(({ row, col }) => {
      const formatting = getCellFormatting(row, col)
      setCellFormatting(row, col, {
        ...formatting,
        underline: !formatting.underline,
      })
    })
  }

  const setTextAlignment = (alignment: "left" | "center" | "right") => {
    const cells = getSelectedCells()
    cells.forEach(({ row, col }) => {
      const formatting = getCellFormatting(row, col)
      setCellFormatting(row, col, {
        ...formatting,
        alignment,
      })
    })
  }

  const setTextColor = (color: string) => {
    const cells = getSelectedCells()
    cells.forEach(({ row, col }) => {
      const formatting = getCellFormatting(row, col)
      setCellFormatting(row, col, {
        ...formatting,
        textColor: color,
      })
    })
  }

  const setBackgroundColor = (color: string) => {
    const cells = getSelectedCells()
    cells.forEach(({ row, col }) => {
      const formatting = getCellFormatting(row, col)
      setCellFormatting(row, col, {
        ...formatting,
        backgroundColor: color,
      })
    })
  }

  const setFontSize = (size: number) => {
    const cells = getSelectedCells()
    cells.forEach(({ row, col }) => {
      const formatting = getCellFormatting(row, col)
      setCellFormatting(row, col, {
        ...formatting,
        fontSize: size,
      })
    })
  }

  const clearFormatting = () => {
    const cells = getSelectedCells()
    cells.forEach(({ row, col }) => {
      setCellFormatting(row, col, {})
    })
  }

  return (
    <div className="flex items-center gap-1 border-b border-border bg-muted/30 px-4 py-2">
      <div className="flex items-center gap-1">
        {/* Font Size */}
        <select
          onChange={(e) => setFontSize(parseInt(e.target.value))}
          value={selectedCell ? getCellFormatting(selectedCell.row, selectedCell.col).fontSize || 14 : 14}
          className="h-7 rounded border border-border bg-background px-2 text-xs text-foreground"
        >
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="16">16</option>
          <option value="18">18</option>
          <option value="20">20</option>
          <option value="24">24</option>
        </select>
      </div>

      <div className="h-4 w-px bg-border" />

      {/* Bold */}
      <Button
        variant={selectedCell && getCellFormatting(selectedCell.row, selectedCell.col).bold ? "default" : "ghost"}
        size="sm"
        className="h-7 w-7 p-0"
        onClick={toggleBold}
        title="Bold (Apply to all selected cells)"
      >
        <Bold className="h-4 w-4" />
      </Button>

      {/* Italic */}
      <Button
        variant={selectedCell && getCellFormatting(selectedCell.row, selectedCell.col).italic ? "default" : "ghost"}
        size="sm"
        className="h-7 w-7 p-0"
        onClick={toggleItalic}
        title="Italic (Apply to all selected cells)"
      >
        <Italic className="h-4 w-4" />
      </Button>

      {/* Underline */}
      <Button
        variant={selectedCell && getCellFormatting(selectedCell.row, selectedCell.col).underline ? "default" : "ghost"}
        size="sm"
        className="h-7 w-7 p-0"
        onClick={toggleUnderline}
        title="Underline (Apply to all selected cells)"
      >
        <Underline className="h-4 w-4" />
      </Button>

      <div className="h-4 w-px bg-border" />

      {/* Text Alignment */}
      <Button
        variant={
          selectedCell && getCellFormatting(selectedCell.row, selectedCell.col).alignment === "left"
            ? "default"
            : "ghost"
        }
        size="sm"
        className="h-7 w-7 p-0"
        onClick={() => setTextAlignment("left")}
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>

      <Button
        variant={
          selectedCell && getCellFormatting(selectedCell.row, selectedCell.col).alignment === "center"
            ? "default"
            : "ghost"
        }
        size="sm"
        className="h-7 w-7 p-0"
        onClick={() => setTextAlignment("center")}
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>

      <Button
        variant={
          selectedCell && getCellFormatting(selectedCell.row, selectedCell.col).alignment === "right"
            ? "default"
            : "ghost"
        }
        size="sm"
        className="h-7 w-7 p-0"
        onClick={() => setTextAlignment("right")}
        title="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </Button>

      <div className="h-4 w-px bg-border" />

      {/* Text Color */}
      <div className="flex items-center gap-1">
        <label className="text-xs text-muted-foreground">Text:</label>
        <input
          type="color"
          value={selectedCell ? getCellFormatting(selectedCell.row, selectedCell.col).textColor || "#000000" : "#000000"}
          onChange={(e) => setTextColor(e.target.value)}
          className="h-6 w-6 cursor-pointer rounded border border-border"
          title="Text Color (Apply to all selected cells)"
        />
      </div>

      {/* Background Color */}
      <div className="flex items-center gap-1">
        <label className="text-xs text-muted-foreground">BG:</label>
        <input
          type="color"
          value={
            selectedCell ? getCellFormatting(selectedCell.row, selectedCell.col).backgroundColor || "#ffffff" : "#ffffff"
          }
          onChange={(e) => setBackgroundColor(e.target.value)}
          className="h-6 w-6 cursor-pointer rounded border border-border"
          title="Background Color (Apply to all selected cells)"
        />
      </div>

      <div className="h-4 w-px bg-border" />

      {/* Merge Cells */}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1"
        onClick={onMergeCells}
        disabled={!isRangeSelected || !isRangeSelected()}
        title="Merge Selected Cells (Select multiple with Shift+Click)"
      >
        <Columns3 className="h-4 w-4" />
        Merge
      </Button>

      {/* Unmerge Cells */}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1"
        onClick={onUnmergeCells}
        disabled={!selectedCell || !isCellMerged || !isCellMerged(selectedCell.row, selectedCell.col)}
        title="Unmerge Cells"
      >
        <Rows3 className="h-4 w-4" />
        Unmerge
      </Button>

      <div className="h-4 w-px bg-border" />

      {/* Clear Formatting */}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1"
        onClick={clearFormatting}
        title="Clear Formatting"
      >
        <Eraser className="h-4 w-4" />
        Clear
      </Button>

      <div className="flex-1" />
      <div className="text-xs text-muted-foreground">
        {selectedCell && `Cell: ${getColumnLabel(selectedCell.col)}${selectedCell.row + 1}`}
      </div>
    </div>
  )
}
