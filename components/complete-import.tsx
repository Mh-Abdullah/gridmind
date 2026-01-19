"use client"

import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface CellFormatting {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  alignment?: "left" | "center" | "right"
  textColor?: string
  backgroundColor?: string
  fontSize?: number
}

interface CompleteImportProps {
  onImport: (
    cells: { [key: string]: string },
    formatting: { [key: string]: CellFormatting },
    numRows: number,
    numCols: number
  ) => void
}

export function CompleteImport({ onImport }: CompleteImportProps) {
  const handleImportComplete = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"

    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event: any) => {
        try {
          const jsonData = JSON.parse(event.target.result)
          
          if (!jsonData.cells || !jsonData.numRows || !jsonData.numCols) {
            alert("Invalid file format. Please use a valid exported file.")
            return
          }

          const { cells, formatting = {}, numRows, numCols } = jsonData
          onImport(cells, formatting, numRows, numCols)
        } catch (error) {
          console.error("Error parsing JSON file:", error)
          alert("Error parsing JSON file. Please try again.")
        }
      }

      reader.readAsText(file)
    }

    input.click()
  }

  return (
    <Button variant="ghost" size="sm" className="gap-2" onClick={handleImportComplete}>
      <Upload className="h-4 w-4" />
      Import All
    </Button>
  )
}
