"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { AppSidebar } from "@/components/app-sidebar"
import { BackToTablesButton } from "@/components/back-to-tables-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Plus,
  X,
  Trash2,
  Edit2,
  Target,
  FileText,
  Sparkles,
  Menu,
  ChevronRight,
  ArrowLeft,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── ICP Generator ──────────────────────────────────────────────────────────────

function ICPGenerator({ onBack }: { onBack: () => void }) {
  const { user } = useAuth()
  const createContext = useMutation(api.contexts.createContext)
  const [step, setStep] = useState(1)
  const totalSteps = 4

  // Step 1
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [icpDescription, setIcpDescription] = useState("")
  // Step 2
  const [industry, setIndustry] = useState("")
  const [companySize, setCompanySize] = useState("")
  // Step 3
  const [painPoints, setPainPoints] = useState("")
  const [goals, setGoals] = useState("")
  // Step 4
  const [contextTitle, setContextTitle] = useState("ICP Context")
  const [isCreating, setIsCreating] = useState(false)

  const progress = (step / totalSteps) * 100

  const handleFinish = async () => {
    if (!user?.id) return
    setIsCreating(true)
    try {
      const content = `# Ideal Customer Profile

## Overview
${icpDescription || "No description provided."}

## Company Details
- **Website:** ${websiteUrl || "N/A"}
- **Industry:** ${industry || "N/A"}
- **Company Size:** ${companySize || "N/A"}

## Pain Points
${painPoints || "N/A"}

## Goals
${goals || "N/A"}`

      await createContext({
        userId: user.id,
        title: contextTitle,
        icon: "🎯",
        content,
      })
      onBack()
    } catch (err) {
      console.error("Failed to create ICP context:", err)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 h-14 shrink-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={onBack} className="hover:text-foreground transition-colors">
            Contexts
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">ICP Generator</span>
        </div>
        <ThemeToggle />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-8">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-end">
              <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-foreground transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step content */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Tell us about your ideal customer</h2>
                <p className="text-sm text-muted-foreground mt-1">Add a website and/or a short ICP description.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Website URL</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    </span>
                    <Input
                      className="pl-9"
                      placeholder="example.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    ICP Description <span className="text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  <textarea
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-32 resize-y"
                    placeholder="Describe your ideal customer — who they are, what they do, and what problems they have."
                    value={icpDescription}
                    onChange={(e) => setIcpDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Company profile</h2>
                <p className="text-sm text-muted-foreground mt-1">Tell us more about the type of company you&apos;re targeting.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Industry</label>
                  <Input
                    placeholder="e.g. SaaS, Healthcare, Finance..."
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Size</label>
                  <Input
                    placeholder="e.g. 10-50 employees, SMB, Enterprise..."
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Pain points & goals</h2>
                <p className="text-sm text-muted-foreground mt-1">What challenges does your ideal customer face and what do they want to achieve?</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pain Points</label>
                  <textarea
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-28 resize-y"
                    placeholder="What problems are they struggling with?"
                    value={painPoints}
                    onChange={(e) => setPainPoints(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Goals</label>
                  <textarea
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-28 resize-y"
                    placeholder="What outcomes are they trying to achieve?"
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Name your context</h2>
                <p className="text-sm text-muted-foreground mt-1">Give this ICP context a name so you can reuse it across projects.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Context Title</label>
                <Input
                  placeholder="ICP Context"
                  value={contextTitle}
                  onChange={(e) => setContextTitle(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              onClick={step === 1 ? onBack : () => setStep(step - 1)}
            >
              {step === 1 ? "Cancel" : "Back"}
            </Button>
            {step < totalSteps ? (
              <Button onClick={() => setStep(step + 1)}>Next</Button>
            ) : (
              <Button onClick={handleFinish} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Context"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Add Context Modal ──────────────────────────────────────────────────────────

type AISubView = "prompt" | "preview"

function AddContextModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: () => void
}) {
  const { user } = useAuth()
  const createContext = useMutation(api.contexts.createContext)
  const [activeTab, setActiveTab] = useState<"ai" | "manual">("ai")

  // AI sub-view state
  const [aiView, setAiView] = useState<AISubView>("prompt")
  const [contextPrompt, setContextPrompt] = useState("")
  const [generationLoading, setGenerationLoading] = useState(false)
  const [generationError, setGenerationError] = useState("")
  // Preview / save
  const [generatedContent, setGeneratedContent] = useState("")
  const [generatedTitle, setGeneratedTitle] = useState("")
  const [generatedIcon, setGeneratedIcon] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState("")

  // Manual entry state
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [manualError, setManualError] = useState("")

  const handleSaveGenerated = async () => {
    if (!user?.id) return
    setIsSaving(true)
    setSaveError("")
    try {
      await createContext({
        userId: user.id,
        title: generatedTitle.trim() || "AI Context",
        icon: generatedIcon || undefined,
        content: generatedContent,
      })
      onCreated()
      onClose()
    } catch (err) {
      console.error("Failed to save context:", err)
      setSaveError("Failed to save. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleGenerateContext = async () => {
    if (!contextPrompt.trim()) return
    setGenerationLoading(true)
    setGenerationError("")
    try {
      const res = await fetch("/api/ai/context-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "prompt", prompt: contextPrompt.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      setGeneratedContent(data.content)
      setGeneratedTitle(data.title)
      setGeneratedIcon(data.icon)
      setAiView("preview")
    } catch (err: unknown) {
      setGenerationError(err instanceof Error ? err.message : "Failed to generate context. Try again.")
    } finally {
      setGenerationLoading(false)
    }
  }

  const handleManualCreate = async () => {
    if (!title.trim()) { setManualError("Title is required."); return }
    if (!content.trim()) { setManualError("Content is required."); return }
    if (!user?.id) return
    setIsCreating(true)
    setManualError("")
    try {
      await createContext({
        userId: user.id,
        title: title.trim(),
        content: content.trim(),
      })
      onCreated()
      onClose()
    } catch {
      setManualError("Failed to create context. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const resetAI = () => {
    setAiView("prompt")
    setContextPrompt("")
    setGenerationError("")
    setGeneratedContent("")
    setGeneratedTitle("")
    setGeneratedIcon("")
    setSaveError("")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-xl bg-background border border-border shadow-xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
          <h2 className="text-lg font-semibold">Add New Knowledge Piece</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pb-4 shrink-0">
          <div className="flex rounded-lg overflow-hidden border border-border">
            <button
              onClick={() => { setActiveTab("ai"); resetAI() }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
                activeTab === "ai"
                  ? "bg-muted text-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted/50"
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Generate business context with AI
            </button>
            <button
              onClick={() => setActiveTab("manual")}
              className={cn(
                "flex-1 px-4 py-2.5 text-sm font-medium transition-colors",
                activeTab === "manual"
                  ? "bg-foreground text-background"
                  : "bg-background text-muted-foreground hover:bg-muted/50"
              )}
            >
              Manual Entry
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          {/* ── AI TAB ── */}
          {activeTab === "ai" && (
            <div className="px-6 pb-6">

              {aiView === "prompt" && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-base font-semibold">What context should AI create?</h3>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="context-prompt" className="text-sm font-semibold">Context instructions</label>
                    <textarea
                      id="context-prompt"
                      className="min-h-40 w-full resize-y rounded-xl border border-input bg-muted/30 px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="For example: Create a sales context for our B2B analytics platform. Include our target market, main customer pain points, value proposition, differentiators, and preferred tone."
                      value={contextPrompt}
                      onChange={(event) => setContextPrompt(event.target.value)}
                      disabled={generationLoading}
                      maxLength={4000}
                      autoFocus
                    />
                  </div>
                  {generationError && <p role="alert" className="text-xs text-destructive">{generationError}</p>}
                  <button
                    onClick={handleGenerateContext}
                    disabled={contextPrompt.trim().length < 10 || generationLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {generationLoading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Creating context...</>
                    ) : (
                      <><Sparkles className="h-4 w-4" /> Create context</>
                    )}
                  </button>
                </div>
              )}

              {/* Preview & save generated content */}
              {aiView === "preview" && (
                <div className="space-y-4">
                  <button
                    onClick={() => setAiView("prompt")}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={generatedTitle}
                      onChange={(e) => setGeneratedTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Generated Context</label>
                    <textarea
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-52 resize-y"
                      value={generatedContent}
                      onChange={(e) => setGeneratedContent(e.target.value)}
                    />
                  </div>
                  {saveError && <p className="text-xs text-destructive">{saveError}</p>}
                  <Button className="w-full" onClick={handleSaveGenerated} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Context"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ── MANUAL TAB ── */}
          {activeTab === "manual" && (
            <div className="px-6 pb-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="manual-context-title" className="text-sm font-medium">Title</label>
                <Input
                  id="manual-context-title"
                  placeholder="For example: Lead search rules"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="manual-context-rules" className="text-sm font-medium">Rules and context <span className="font-normal text-muted-foreground">(Markdown supported)</span></label>
                <textarea
                  id="manual-context-rules"
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-36 resize-y font-mono"
                  placeholder={"# Lead search rules\n\n- Only find B2B SaaS companies.\n- Prioritize verified contact information.\n- Required columns: Name, Contact"}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              {manualError && <p role="alert" className="text-sm text-destructive">{manualError}</p>}
              <Button
                className="w-full"
                onClick={handleManualCreate}
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create Context"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Context Card ───────────────────────────────────────────────────────────────

function ContextCard({
  id,
  title,
  icon,
  content,
  onDelete,
}: {
  id: Id<"contexts">
  title: string
  icon?: string
  content: string
  onDelete: (id: Id<"contexts">) => void
}) {
  const preview = content.slice(0, 120).replace(/#+\s/g, "").replace(/\n/g, " ")

  const renderIcon = () => {
    if (!icon) return <FileText className="h-5 w-5 text-muted-foreground" />
    if (icon.startsWith("http")) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={icon} alt="" className="h-5 w-5 rounded object-cover" />
    }
    return <span className="text-xl leading-none">{icon}</span>
  }

  return (
    <div className="group relative rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-colors cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
          {renderIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold truncate">{title}</h3>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{preview}</p>
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(id) }}
        className="absolute top-3 right-3 rounded-md p-1.5 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
        title="Delete context"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function ContextsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeView, setActiveView] = useState<"list" | "icp-generator">("list")
  const [refreshKey, setRefreshKey] = useState(0)

  const contexts = useQuery(
    api.contexts.getContextsByUser,
    user?.id ? { userId: user.id } : "skip"
  )
  const deleteContext = useMutation(api.contexts.deleteContext)

  if (!loading && !user) {
    router.push("/login")
    return null
  }

  const handleDelete = async (id: Id<"contexts">) => {
    if (!confirm("Delete this context?")) return
    await deleteContext({ id })
  }

  if (activeView === "icp-generator") {
    return (
      <div className="flex h-screen bg-background">
        <AppSidebar className={cn("hidden md:flex", sidebarOpen && "flex fixed inset-y-0 left-0 z-40")} />
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <ICPGenerator onBack={() => setActiveView("list")} />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AppSidebar className={cn("hidden md:flex", sidebarOpen && "flex fixed inset-y-0 left-0 z-40")} />
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-background px-4 md:px-8 h-16 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <BackToTablesButton />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-0.5">Workspace</p>
              <h1 className="text-lg font-semibold text-foreground">Contexts</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              size="sm"
              className="gap-2 lg:hidden"
              onClick={() => setShowModal(true)}
            >
              <Plus className="h-4 w-4" />
              Add Context
            </Button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar panel — tools/templates */}
          <aside className="hidden lg:flex w-56 shrink-0 flex-col border-r border-border bg-muted/30 p-3 gap-1">
            <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Tools</p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-colors w-full text-left"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background">
                <Plus className="h-4 w-4 text-foreground" />
              </div>
              Add Context
            </button>
            <button
              onClick={() => setActiveView("icp-generator")}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-colors w-full text-left"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background">
                <Target className="h-4 w-4 text-foreground" />
              </div>
              ICP Generator
            </button>
          </aside>

          {/* Context list area */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Contexts</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Contexts are pieces of information that can be reused across different projects.
              </p>
            </div>

            {contexts === undefined ? (
              // Loading skeleton
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl border border-border p-5 h-28 animate-pulse bg-muted/50" />
                ))}
              </div>
            ) : contexts.length === 0 ? (
              // Empty state
              <div className="rounded-xl border border-border bg-card">
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-sm text-muted-foreground">No contexts found. Create one to get started.</p>
                </div>
              </div>
            ) : (
              // Context grid
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {contexts.map((ctx) => (
                  <ContextCard
                    key={ctx._id}
                    id={ctx._id}
                    title={ctx.title}
                    icon={ctx.icon}
                    content={ctx.content}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Add Context Modal */}
      {showModal && (
        <AddContextModal
          onClose={() => setShowModal(false)}
          onCreated={() => setRefreshKey(k => k + 1)}
        />
      )}
    </div>
  )
}
