"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface CellFormatting {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  alignment?: "left" | "center" | "right"
  textColor?: string
  backgroundColor?: string
  fontSize?: number
}

interface CompleteExportProps {
  projectName: string
  numRows: number
  numCols: number
  getCellValue: (row: number, col: number) => string
  getCellFormatting: (row: number, col: number) => CellFormatting
  getColumnLabel: (index: number) => string
}

export function CompleteExport({
  projectName,
  numRows,
  numCols,
  getCellValue,
  getCellFormatting,
  getColumnLabel,
}: CompleteExportProps) {
  const handleExportComplete = () => {
    // Create complete data object with values and formatting
    const exportData = {
      projectName,
      numRows,
      numCols,
      cells: {} as { [key: string]: string },
      formatting: {} as { [key: string]: CellFormatting },
    }

    // Populate cells and formatting
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const key = `${row}-${col}`
        exportData.cells[key] = getCellValue(row, col)
        const formatting = getCellFormatting(row, col)
        if (Object.keys(formatting).length > 0) {
          exportData.formatting[key] = formatting
        }
      }
    }

    // Create JSON file
    const jsonString = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `${projectName}-complete.json`)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button variant="ghost" size="sm" className="gap-2" onClick={handleExportComplete}>
      <Download className="h-4 w-4" />
      Export All
    </Button>
  )
}
