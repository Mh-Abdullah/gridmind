"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface CSVExportProps {
  projectName: string
  numRows: number
  numCols: number
  getCellValue: (row: number, col: number) => string
  getColumnLabel: (index: number) => string
}

export function CSVExport({
  projectName,
  numRows,
  numCols,
  getCellValue,
  getColumnLabel,
}: CSVExportProps) {
  const handleExportCSV = () => {
    // Build CSV content - only export actual data rows, not column headers
    let csvContent = ""

    // Add data rows
    for (let row = 0; row < numRows; row++) {
      const rowData = Array.from({ length: numCols })
        .map((_, col) => {
          const value = getCellValue(row, col)
          // Escape quotes and wrap in quotes if contains comma or newline
          if (value.includes(",") || value.includes("\n") || value.includes('"')) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        })
        .join(",")
      csvContent += rowData + "\n"
    }

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `${projectName}.csv`)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button variant="ghost" size="sm" className="gap-1.5 h-7 text-xs shrink-0 px-2.5" onClick={handleExportCSV}>
      <Download className="h-3.5 w-3.5" />
      Export CSV
    </Button>
  )
}
