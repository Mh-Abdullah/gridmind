"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const { logout } = useAuth()

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="gap-2 w-full justify-start" 
      onClick={() => logout()}
    >
      <LogOut className="h-4 w-4" />
      Log out
    </Button>
  )
}
