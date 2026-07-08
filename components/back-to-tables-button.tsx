import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export function BackToTablesButton() {
  return (
    <Button variant="ghost" size="icon-sm" className="shrink-0 rounded-full" asChild>
      <Link href="/dashboard/tables" aria-label="Back to tables">
        <ArrowLeft className="h-4 w-4" />
      </Link>
    </Button>
  )
}
