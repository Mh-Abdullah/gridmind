"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  return (
    <Button variant="ghost" size="sm" className="gap-2 w-full justify-start" onClick={handleLogout}>
      <LogOut className="h-4 w-4" />
      Log out
    </Button>
  )
}
