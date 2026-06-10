"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  FileText,
  Wallet,
  BarChart3,
  Shield,
  LogOut,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const { user, logout } = useAuth()

  const adminItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard-admin" },
    { icon: Users, label: "Users", href: "/dashboard-admin/users" },
    { icon: Wallet, label: "Billing", href: "/dashboard-admin/billing" },
    { icon: BarChart3, label: "Analytics", href: "/dashboard-admin/analytics" },
    { icon: FileText, label: "Reports", href: "/dashboard-admin/reports" },
    { icon: Shield, label: "Security", href: "/dashboard-admin/security" },
  ]

  return (
    <aside className={cn("flex h-screen w-64 flex-col border-r border-border bg-sidebar", className)}>
      <div className="flex items-center gap-2 border-b border-border px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-lg font-bold text-primary-foreground">G</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-sidebar-foreground">GridMind</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
        {adminItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-hover hover:text-sidebar-foreground"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-between px-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={user?.name} />
                  <AvatarFallback>{user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "AD"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-medium text-sidebar-foreground">{user?.name || "Admin"}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem disabled>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{user?.name || "Admin"}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard-admin/account">Account Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard-admin/preferences">Preferences</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
