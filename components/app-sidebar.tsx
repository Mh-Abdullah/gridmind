"use client"

import * as React from "react"
import {
  CirclePlus,
  Table2,
  FileText,
  Grid3X3,
  Box,
  Plug,
  Settings,
  CreditCard,
  PlayCircle,
  MessageSquare,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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

interface AppSidebarProps {
  className?: string
}

export function AppSidebar({ className }: AppSidebarProps) {
  const { logout, user } = useAuth()
  console.log("AppSidebar rendering")
  const [creditsUsed, setCreditsUsed] = React.useState(0)
  const [projectsUsed, setProjectsUsed] = React.useState(0)
  const maxCredits = 500
  const maxProjects = 20

  const platformItems = [
    { icon: Table2, label: "Tables", href: "/dashboard/tables" },
    { icon: FileText, label: "Contexts", href: "/contexts" },
    { icon: Grid3X3, label: "Templates", href: "/templates" },
    { icon: Box, label: "Models", href: "/models" },
    { icon: Plug, label: "Integrations", href: "/integrations" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: CreditCard, label: "Billing", href: "/billing" },
  ]

  return (
    <aside className={cn("flex h-screen w-57 flex-col border-r border-border bg-sidebar", className)}>
      {/* Brand */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-lg font-bold text-primary-foreground">G</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-sidebar-foreground">GridMind</span>
        </div>
      </div>

      {/* Start New Button */}
      <div className="px-3 py-4">
        <Button className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
          <CirclePlus className="h-4 w-4" />
          Start New
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3">
        {/* Platform Section */}
        <div>
          <h3 className="mb-2 px-2 text-xs font-medium text-muted-foreground">Platform</h3>
          <div className="space-y-0.5">
            {platformItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>

      </nav>

      {/* Usage Stats */}
      <div className="space-y-4 border-t border-sidebar-border p-3">
        {/* Credits Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Used credits</span>
            <span className="font-medium text-sidebar-foreground">
              {creditsUsed} / {maxCredits} ({Math.round((creditsUsed / maxCredits) * 100)}%)
            </span>
          </div>
          <Progress value={(creditsUsed / maxCredits) * 100} className="h-1.5" />
          <div className="text-xs text-muted-foreground">Available: {maxCredits - creditsUsed}</div>
        </div>

        {/* Projects Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Projects</span>
            <span className="font-medium text-sidebar-foreground">
              {projectsUsed} / {maxProjects} ({Math.round((projectsUsed / maxProjects) * 100)}%)
            </span>
          </div>
          <Progress value={(projectsUsed / maxProjects) * 100} className="h-1.5" />
        </div>

        {/* Buy Credits Button */}
        <Button variant="outline" size="sm" className="w-full bg-transparent">
          Buy credits
        </Button>
      </div>

      {/* User Profile */}
      <div className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-between px-2 hover:bg-sidebar-accent">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left">
                  <span className="text-xs font-medium text-sidebar-foreground truncate max-w-[100px]">{user?.name || "User"}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[100px]">{user?.email}</span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem disabled>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Profile</DropdownMenuItem>
            <DropdownMenuItem disabled>Account Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
