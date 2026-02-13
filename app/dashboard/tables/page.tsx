"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { AppFooter } from "@/components/app-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { Table2, Search, Wand2, Upload, Instagram, MessageSquare, MapPin, PlaySquare, FolderPlus, Trash2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

export default function TablesPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [showNameModal, setShowNameModal] = useState(false)
  const [newTableName, setNewTableName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  // Fetch user's spreadsheets from Convex
  const spreadsheets = useQuery(
    api.spreadsheets.getSpreadsheetsByUser,
    user?.id ? { userId: user.id } : "skip"
  )

  // Mutations
  const createSpreadsheet = useMutation(api.spreadsheets.getOrCreateSpreadsheet)
  const deleteSpreadsheet = useMutation(api.spreadsheets.deleteSpreadsheet)

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

  const handleCreateTable = async () => {
    if (!newTableName.trim() || !user?.id) return
    
    setIsCreating(true)
    try {
      // Generate a unique tableId
      const tableId = `table-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      await createSpreadsheet({
        tableId,
        userId: user.id,
        name: newTableName.trim(),
      })
      
      setShowNameModal(false)
      setNewTableName("")
      
      // Navigate to the new table
      router.push(`/dashboard/tables/${tableId}`)
    } catch (error) {
      console.error("Failed to create table:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteTable = async (spreadsheetId: Id<"spreadsheets">) => {
    if (!confirm("Are you sure you want to delete this table? This action cannot be undone.")) {
      return
    }
    
    try {
      await deleteSpreadsheet({ spreadsheetId })
    } catch (error) {
      console.error("Failed to delete table:", error)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

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
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="default" size="sm" className="gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
                Need Help?
              </Button>
            </div>
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
                    className="h-auto flex items-center gap-2 p-4 hover:bg-hover bg-transparent"
                    onClick={() => {
                      if (option.label === "Blank table") {
                        setShowNameModal(true)
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
                    className="h-auto flex items-center gap-2 p-4 hover:bg-hover bg-transparent col-span-3"
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

                {/* Table List or Empty State */}
                {spreadsheets === undefined ? (
                  <div className="flex min-h-50 items-center justify-center py-12">
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  </div>
                ) : spreadsheets.length === 0 ? (
                  <div className="flex min-h-50 items-center justify-center py-12">
                    <div className="text-center">
                      <Table2 className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">No projects yet. Create your first project above.</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    {spreadsheets.map((sheet) => (
                      <div
                        key={sheet._id}
                        className="grid grid-cols-4 gap-4 border-b border-border px-6 py-4 hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => router.push(`/dashboard/tables/${sheet.tableId}`)}
                      >
                        <div className="flex items-center gap-2">
                          <Table2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{sheet.name}</span>
                        </div>
                        <div className="text-muted-foreground">{sheet.numCols}</div>
                        <div className="text-muted-foreground">{formatDate(sheet.updatedAt)}</div>
                        <div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteTable(sheet._id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
        </main>

        {/* Footer */}
        {/* <AppFooter /> */}
      </div>

      {/* Create Table Modal */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Create New Table</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  setShowNameModal(false)
                  setNewTableName("")
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mb-4">
              <label htmlFor="tableName" className="block text-sm font-medium text-foreground mb-2">
                Table Name
              </label>
              <Input
                id="tableName"
                type="text"
                placeholder="Enter table name..."
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newTableName.trim()) {
                    handleCreateTable()
                  }
                }}
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNameModal(false)
                  setNewTableName("")
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateTable}
                disabled={!newTableName.trim() || isCreating}
              >
                {isCreating ? "Creating..." : "Create Table"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}