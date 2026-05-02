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

  const currentFormatting = selectedCell ? getCellFormatting(selectedCell.row, selectedCell.col) : {}

  return (
    <div
      className="flex items-center gap-1 border-b border-border bg-muted/30 px-4 py-1.5"
      // Prevent mousedown from stealing DOM focus away from the table,
      // which would break formatting when clicking toolbar buttons.
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Font Size */}
      <select
        value={currentFormatting.fontSize || 14}
        onChange={(e) => setFontSize(parseInt(e.target.value))}
        onMouseDown={(e) => e.stopPropagation()}
        className="h-7 rounded border border-border bg-background px-2 text-xs text-foreground cursor-pointer"
      >
        {[10, 11, 12, 13, 14, 16, 18, 20, 24].map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <div className="h-4 w-px bg-border mx-0.5" />

      {/* Bold */}
      <Button
        variant={currentFormatting.bold ? "default" : "ghost"}
        size="sm"
        className="h-7 w-7 p-0"
        onMouseDown={(e) => { e.preventDefault(); toggleBold() }}
        title="Bold"
      >
        <Bold className="h-3.5 w-3.5" />
      </Button>

      {/* Italic */}
      <Button
        variant={currentFormatting.italic ? "default" : "ghost"}
        size="sm"
        className="h-7 w-7 p-0"
        onMouseDown={(e) => { e.preventDefault(); toggleItalic() }}
        title="Italic"
      >
        <Italic className="h-3.5 w-3.5" />
      </Button>

      {/* Underline */}
      <Button
        variant={currentFormatting.underline ? "default" : "ghost"}
        size="sm"
        className="h-7 w-7 p-0"
        onMouseDown={(e) => { e.preventDefault(); toggleUnderline() }}
        title="Underline"
      >
        <Underline className="h-3.5 w-3.5" />
      </Button>

      <div className="h-4 w-px bg-border mx-0.5" />

      {/* Text Alignment */}
      <Button
        variant={currentFormatting.alignment === "left" ? "default" : "ghost"}
        size="sm"
        className="h-7 w-7 p-0"
        onMouseDown={(e) => { e.preventDefault(); setTextAlignment("left") }}
        title="Align Left"
      >
        <AlignLeft className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant={currentFormatting.alignment === "center" ? "default" : "ghost"}
        size="sm"
        className="h-7 w-7 p-0"
        onMouseDown={(e) => { e.preventDefault(); setTextAlignment("center") }}
        title="Align Center"
      >
        <AlignCenter className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant={currentFormatting.alignment === "right" ? "default" : "ghost"}
        size="sm"
        className="h-7 w-7 p-0"
        onMouseDown={(e) => { e.preventDefault(); setTextAlignment("right") }}
        title="Align Right"
      >
        <AlignRight className="h-3.5 w-3.5" />
      </Button>

      <div className="h-4 w-px bg-border mx-0.5" />

      {/* Text Color */}
      <div className="flex items-center gap-1" title="Text Color">
        <span className="text-xs text-muted-foreground select-none">A</span>
        <label className="relative h-5 w-5 cursor-pointer">
          <span
            className="block h-5 w-5 rounded border border-border"
            style={{ backgroundColor: currentFormatting.textColor || "#888888" }}
          />
          <input
            type="color"
            value={currentFormatting.textColor || "#000000"}
            onChange={(e) => setTextColor(e.target.value)}
            onInput={(e) => setTextColor((e.target as HTMLInputElement).value)}
            className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
          />
        </label>
      </div>

      {/* Background Color */}
      <div className="flex items-center gap-1" title="Background Color">
        <span className="text-xs text-muted-foreground select-none">BG</span>
        <label className="relative h-5 w-5 cursor-pointer">
          <span
            className="block h-5 w-5 rounded border border-border"
            style={{ backgroundColor: currentFormatting.backgroundColor || "transparent" }}
          />
          <input
            type="color"
            value={currentFormatting.backgroundColor || "#ffffff"}
            onChange={(e) => setBackgroundColor(e.target.value)}
            onInput={(e) => setBackgroundColor((e.target as HTMLInputElement).value)}
            className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
          />
        </label>
      </div>

      <div className="h-4 w-px bg-border mx-0.5" />

      {/* Merge Cells */}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1 px-2 text-xs"
        onMouseDown={(e) => { e.preventDefault(); onMergeCells?.() }}
        disabled={!isRangeSelected || !isRangeSelected()}
        title="Merge Selected Cells (Shift+click to select range first)"
      >
        <Columns3 className="h-3.5 w-3.5" />
        Merge
      </Button>

      {/* Unmerge Cells */}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1 px-2 text-xs"
        onMouseDown={(e) => { e.preventDefault(); onUnmergeCells?.() }}
        disabled={!selectedCell || !isCellMerged || !isCellMerged(selectedCell.row, selectedCell.col)}
        title="Unmerge Cells"
      >
        <Rows3 className="h-3.5 w-3.5" />
        Unmerge
      </Button>

      <div className="h-4 w-px bg-border mx-0.5" />

      {/* Clear Formatting */}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1 px-2 text-xs"
        onMouseDown={(e) => { e.preventDefault(); clearFormatting() }}
        title="Clear Formatting"
      >
        <Eraser className="h-3.5 w-3.5" />
        Clear
      </Button>

      <div className="flex-1" />
      <div className="text-xs text-muted-foreground pr-2">
        {selectedCell && `Cell: ${getColumnLabel(selectedCell.col)}${selectedCell.row + 1}`}
      </div>
    </div>
  )
}
