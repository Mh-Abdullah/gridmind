"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { AppFooter } from "@/components/app-footer"
import { Button } from "@/components/ui/button"
import { Table2, Search, Wand2, Upload, Instagram, MessageSquare, MapPin, PlaySquare, FolderPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useEffect } from "react"

export default function TablesPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  // Protect the page - only logged in regular users can access
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }
    if (!loading && user?.role === "admin") {
      router.push("/dashboard-admin")
    }
  }, [user, loading, router])

  const projectOptions = [
    { icon: Table2, label: "Blank table", description: "Start with an empty table" },
    { icon: Search, label: "Search templates", description: "Browse pre-built templates" },
    { icon: Wand2, label: "Creator", description: "AI-powered table generation" },
    { icon: Upload, label: "Import & enrich CSV", description: "Upload and enhance your data" },
    { icon: PlaySquare, label: "Run Google Search", description: "Search and extract data" },
    { icon: MapPin, label: "Local businesses", description: "Find nearby businesses" },
  ]

  const scrapeOptions = [
    { icon: Instagram, label: "Scrape Instagram", color: "text-pink-500" },
    { icon: MessageSquare, label: "Scrape Reactions", color: "text-blue-500" },
  ]

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-background px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Table2 className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-2xl font-bold text-foreground">Tables</h1>
            </div>
            <Button variant="default" size="sm" className="gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
              Need Help?
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome, {user?.name}! 👑</h2>
          </div>
            {/* Create New Project Section */}
            <section className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-foreground">Create a new project</h2>

              <div className="grid gap-4 grid-cols-3 sm:grid-cols-6">
                {projectOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant="outline"
                    className="h-auto flex items-center gap-2 p-4 hover:bg-accent bg-transparent"
                    onClick={() => {
                      if (option.label === "Blank table") {
                        router.push(`/dashboard/tables/new`)
                      }
                    }}
                  >
                    <option.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">{option.label}</span>
                  </Button>
                ))}
              </div>

              {/* <div className="mt-4 grid gap-4 grid-cols-6">
                {scrapeOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant="outline"
                    className="h-auto flex items-center gap-2 p-4 hover:bg-accent bg-transparent col-span-3"
                  >
                    <option.icon className={`h-5 w-5 ${option.color}`} />
                    <span className="font-medium text-foreground">{option.label}</span>
                  </Button>
                ))}
              </div> */}
            </section>

            {/* Projects & Folders Section */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Projects & Folders</h2>
                <Button variant="ghost" size="sm" className="gap-2">
                  <FolderPlus className="h-4 w-4" />
                  Add Folder
                </Button>
              </div>

              {/* Table Header */}
              <div className="rounded-lg border border-border bg-card">
                <div className="grid grid-cols-4 gap-4 border-b border-border px-6 py-3 text-sm font-medium text-muted-foreground">
                  <div>Title</div>
                  <div>Columns</div>
                  <div>Created</div>
                  <div>Actions</div>
                </div>

                {/* Empty State */}
                <div className="flex min-h-50 items-center justify-center py-12">
                  <div className="text-center">
                    <Table2 className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">No projects yet. Create your first project above.</p>
                  </div>
                </div>
              </div>
            </section>
        </main>

        {/* Footer */}
        {/* <AppFooter /> */}
      </div>
    </div>
  )
}