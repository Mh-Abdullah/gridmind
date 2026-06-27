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
import { BrandLogo } from "@/components/brand-assets"

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
    <aside
      className={cn(
        "sticky top-0 flex h-screen w-64 shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar",
        className
      )}
    >
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border px-4">
        <BrandLogo className="h-9" priority />
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        {adminItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-hover hover:text-sidebar-foreground"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="shrink-0 border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-auto w-full justify-between rounded-xl px-2 py-2 hover:bg-sidebar-hover">
              <div className="flex min-w-0 items-center gap-2">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src="" alt={user?.name} />
                  <AvatarFallback>{user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "AD"}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-xs font-medium text-sidebar-foreground">{user?.name || "Admin"}</span>
                  <span className="block truncate text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
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
