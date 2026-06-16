"use client"
import {
  CirclePlus,
  Table2,
  FileText,
  Grid3X3,
  Plug,
  CreditCard,
  BarChart2,
  LogOut,
  ChevronDown,
  WalletCards,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

interface AppSidebarProps {
  className?: string
}

export function AppSidebar({ className }: AppSidebarProps) {
  const { logout, user } = useAuth()
  const billingSummary = useQuery(
    api.billing.getUserBillingSummary,
    user?.id ? { userId: user.id } : "skip"
  )
  const creditBalance = billingSummary?.balanceCredits ?? 0
  const totalPurchased = billingSummary?.totalPurchasedCredits ?? 0
  const totalGranted = billingSummary?.totalAdminGrantedCredits ?? 0
  const totalSpent = billingSummary?.totalSpentCredits ?? 0
  const walletTotal = Math.max(creditBalance + totalSpent, 1)
  const usagePercent = Math.min(100, Math.round((totalSpent / walletTotal) * 100))

  const platformItems = [
    { icon: Table2, label: "Tables", href: "/dashboard/tables" },
    { icon: FileText, label: "Contexts", href: "/contexts" },
    { icon: Grid3X3, label: "Templates", href: "/templates" },
    { icon: Plug, label: "Integrations", href: "/integrations" },
    { icon: BarChart2, label: "Usage", href: "/usage" },
    { icon: CreditCard, label: "Billing", href: "/billing" },
  ]

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen w-64 shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar",
        className
      )}
    >
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-lg font-bold text-primary-foreground">G</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-sidebar-foreground">GridMind</span>
        </div>
      </div>

      {/* Start New Button */}
      <div className="shrink-0 px-3 py-3">
        <Button className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
          <CirclePlus className="h-4 w-4" />
          Start New
        </Button>
      </div>

      {/* Navigation */}
      <nav className="shrink-0 px-3 pb-3">
        {/* Platform Section */}
        <div className="space-y-1.5">
          <h3 className="px-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Platform</h3>
          <div className="space-y-0.5">
            {platformItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-hover hover:text-sidebar-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>

      </nav>

      <div className="shrink-0 border-t border-sidebar-border bg-sidebar">
        {/* Usage Stats */}
        <div className="space-y-3 p-3">
        <div className="rounded-2xl border border-border/70 bg-background/70 p-3 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.45)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Wallet</p>
              <p className="mt-1 text-2xl font-semibold text-sidebar-foreground">{creditBalance}</p>
              <p className="text-xs text-muted-foreground">Credits available now</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
              <WalletCards className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Credits spent</span>
              <span className="font-medium text-sidebar-foreground">{totalSpent}</span>
            </div>
            <Progress value={usagePercent} className="h-1.5" />
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="rounded-xl border border-border/60 bg-background/70 px-2.5 py-2">
                Purchased: <span className="font-medium text-sidebar-foreground">{totalPurchased}</span>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/70 px-2.5 py-2">
                Granted: <span className="font-medium text-sidebar-foreground">{totalGranted}</span>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* User Profile */}
        <div className="border-t border-sidebar-border p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-auto w-full justify-between rounded-xl px-2 py-2 hover:bg-sidebar-hover">
                <div className="flex min-w-0 items-center gap-2">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                      {user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 text-left">
                    <span className="block truncate text-xs font-medium text-sidebar-foreground">
                      {user?.name || "User"}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem disabled>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/account">Account Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/preferences">Preferences</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  )
}
