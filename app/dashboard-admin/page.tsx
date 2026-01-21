"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import { LayoutDashboard } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="flex h-screen">
      <AdminSidebar />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border px-8 py-4">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-lg font-semibold text-foreground">Admin Dashboard</h1>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground">Welcome to Admin Dashboard</h2>
              <p className="mt-2 text-muted-foreground">
                This is the admin panel. More features coming soon.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
