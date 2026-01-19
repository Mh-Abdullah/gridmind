"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import * as XLSX from "xlsx"

interface CSVImportProps {
  onImport: (cells: { [key: string]: string }, numRows: number, numCols: number) => void
}

export function CSVImport({ onImport }: CSVImportProps) {
  const parseExcelFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (event: any) => {
      try {
        const data = new Uint8Array(event.target.result)
        const workbook = XLSX.read(data, { type: "array" })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        
        // Get the range of data in the worksheet
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
        const rows = range.e.r + 1
        const cols = range.e.c + 1

        // Populate cells - get all cells from the worksheet
        const newCells: { [key: string]: string } = {}
        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
          for (let colIndex = 0; colIndex < cols; colIndex++) {
            const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })
            const cell = worksheet[cellAddress]
            const cellValue = cell ? String(cell.v || "").trim() : ""
            newCells[`${rowIndex}-${colIndex}`] = cellValue
          }
        }

        console.log("Imported Excel cells:", newCells)
        console.log("Rows:", rows, "Cols:", cols)
        onImport(newCells, rows, cols)
      } catch (error) {
        console.error("Error parsing Excel file:", error)
        alert("Error parsing Excel file. Please try again.")
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const parseCSVFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (event: any) => {
      const csv = event.target.result
      const lines = csv.trim().split("\n")

      if (lines.length === 0) return

      // Parse CSV lines
      const parsedLines = lines.map((line: string) => {
        const result = []
        let current = ""
        let insideQuotes = false

        for (let i = 0; i < line.length; i++) {
          const char = line[i]
          const nextChar = line[i + 1]

          if (char === '"') {
            if (insideQuotes && nextChar === '"') {
              current += '"'
              i++
            } else {
              insideQuotes = !insideQuotes
            }
          } else if (char === "," && !insideQuotes) {
            result.push(current)
            current = ""
          } else {
            current += char
          }
        }
        result.push(current)
        return result
      })

      // Set number of columns (use max column count across all rows) and rows
      const cols = Math.max(...parsedLines.map((row: string[]) => row.length), 1)
      const rows = parsedLines.length

      // Populate cells - create entries for ALL cells up to max rows and columns
      const newCells: { [key: string]: string } = {}
      parsedLines.forEach((row: string[], rowIndex: number) => {
        // Iterate through all columns (including empty ones)
        for (let colIndex = 0; colIndex < cols; colIndex++) {
          const cellValue = row[colIndex] || ""
          newCells[`${rowIndex}-${colIndex}`] = cellValue.trim()
        }
      })

      console.log("Imported cells:", newCells)
      console.log("Rows:", rows, "Cols:", cols)
      onImport(newCells, rows, cols)
    }

    reader.readAsText(file)
  }

  const handleImportFile = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".csv,.xlsx,.xls"

    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (!file) return

      if (file.name.endsWith(".csv")) {
        parseCSVFile(file)
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        parseExcelFile(file)
      } else {
        alert("Unsupported file format. Please use CSV, XLSX, or XLS files.")
      }
    }

    input.click()
  }

  return (
    <Button variant="ghost" size="sm" className="gap-2" onClick={handleImportFile}>
      <Download className="h-4 w-4" />
      Import CSV
    </Button>
  )
}
