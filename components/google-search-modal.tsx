"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import { X, Loader2, Search, ExternalLink, Zap, Wand2 } from "lucide-react"

const EXAMPLE_QUERIES = [
  { label: "Software Engineers from London", query: "site:linkedin.com/in + Software Engineers from London" },
  { label: "Social Media Agencies in New York", query: "site:clutch.co + Social Media Agencies in New York" },
  { label: "Shopify Stores Selling Pet Products", query: "site:linkedin.com + Shopify Stores Selling Pet Products" },
  { label: "Recently Funded Startups in Germany", query: "site:crunchbase.com + Recently Funded Startups in Germany" },
  { label: "Marketing Job Openings in San Francisco", query: "site:linkedin.com/jobs + Marketing Job Openings in San Francisco" },
  { label: "Competitor Case Studies in AI SaaS", query: "site:g2.com + Competitor Case Studies in AI SaaS" },
  { label: "SaaS companies in Berlin", query: "site:linkedin.com/company + SaaS companies in Berlin" },
  { label: "E-commerce brands on Shopify", query: "site:myshopify.com + E-commerce brands on Shopify" },
  { label: "Freelance designers on Dribbble", query: "site:dribbble.com + Freelance designers on Dribbble" },
]

const LANGUAGES = [
  "English", "German", "French", "Spanish", "Italian",
  "Portuguese", "Dutch", "Russian", "Japanese", "Chinese", "Arabic", "Hindi", "Urdu",
]

const COUNTRIES = [
  "United States", "United Kingdom", "Germany", "France", "Spain",
  "Italy", "Canada", "Australia", "India", "Pakistan", "Japan",
  "Brazil", "Netherlands", "Russia", "Saudi Arabia", "United Arab Emirates",
]

interface SearchResult {
  title: string
  url: string
  snippet: string
  displayedLink: string
  position: number
}

interface Props {
  onClose: () => void
}

export default function GoogleSearchModal({ onClose }: Props) {
  const router = useRouter()
  const { user } = useAuth()

  const [query, setQuery] = useState("")
  const [numResults, setNumResults] = useState(10)
  const [language, setLanguage] = useState("English")
  const [country, setCountry] = useState("United States")

  const [scrapeWebsite, setScrapeWebsite] = useState(true)
  const [extractEntities, setExtractEntities] = useState(false)
  const [extractEmail, setExtractEmail] = useState(false)

  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])

  const [isCreating, setIsCreating] = useState(false)
  const [isBuilding, setIsBuilding] = useState(false)
  const [queryBuilderError, setQueryBuilderError] = useState("")

  const createSpreadsheet = useMutation(api.spreadsheets.getOrCreateSpreadsheet)
  const batchUpdateCells = useMutation(api.spreadsheets.updateCellsBatch)
  const updateMetadata = useMutation(api.spreadsheets.updateSpreadsheetMetadata)
  const updateColumnNames = useMutation(api.spreadsheets.updateColumnNamesBatch)
  const consumeCredits = useMutation(api.billing.consumeCredits)
  const refundCreditTransaction = useMutation(api.billing.refundCreditTransaction)

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return
    setIsSearching(true)
    setSearchError("")
    try {
      const res = await fetch("/api/google-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), num: numResults, language, country }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSearchError(data.error ?? "Search failed. Check your SERPER_API_KEY.")
        return
      }
      setResults(data.results ?? [])
      if ((data.results ?? []).length === 0) setSearchError("No results found for this query.")
    } catch {
      setSearchError("Search failed. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }, [query, numResults, language, country])

  const handleQueryBuilder = useCallback(async () => {
    if (!query.trim()) return
    setIsBuilding(true)
    setSearchError("")
    setQueryBuilderError("")

    try {
      const response = await fetch("/api/ai/query-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      })
      const data = await response.json() as { query?: string; error?: string }

      if (!response.ok || !data.query) {
        setQueryBuilderError(data.error ?? "Query Builder failed. Please try again.")
        return
      }

      setQuery(data.query)
    } catch {
      setQueryBuilderError("Query Builder could not connect. Please try again.")
    } finally {
      setIsBuilding(false)
    }
  }, [query])

  const handleCreate = useCallback(async (withData: boolean) => {
    if (!user?.id) return
    setIsCreating(true)
    let billingTransactionId: string | null = null
    try {
      const name = query.trim() || "Google Search"
      const tableId = `table-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const rows = withData ? results : []

      if (rows.length > 0) {
        const billing = await consumeCredits({
          userId: user.id as never,
          actionKey: "create_table_google_search",
          quantity: rows.length,
          note: `Google search table (${rows.length} row${rows.length === 1 ? "" : "s"})`,
        })

        if (!billing.skipped) {
          billingTransactionId = String(billing.transactionId)
        }
      }

      const spreadsheetId = await createSpreadsheet({ tableId, userId: user.id, name })

      const columns = [
        "Title", "URL", "Snippet", "Displayed Link",
        ...(scrapeWebsite ? ["Website Content"] : []),
        ...(extractEntities ? ["Entity 1", "Entity 2", "Entity 3"] : []),
        ...(extractEmail ? ["Email"] : []),
      ]

      const names = columns.map((col, ci) => ({ colIndex: ci, name: col }))
      await updateColumnNames({ spreadsheetId, names })

      const cells: { cellKey: string; value: string }[] = []
      rows.forEach((r, ri) => {
        const vals: string[] = [
          r.title, r.url, r.snippet, r.displayedLink,
          ...(scrapeWebsite ? [""] : []),
          ...(extractEntities ? ["", "", ""] : []),
          ...(extractEmail ? [""] : []),
        ]
        vals.forEach((val, ci) => { if (val) cells.push({ cellKey: `${ri}-${ci}`, value: val }) })
      })

      if (cells.length > 0) await batchUpdateCells({ spreadsheetId, cells })
      await updateMetadata({
        spreadsheetId,
        numRows: Math.max(rows.length, 1),
        numCols: columns.length,
      })
      router.push(`/dashboard/tables/${tableId}`)
    } catch (err) {
      if (billingTransactionId) {
        await refundCreditTransaction({
          userId: user.id as never,
          transactionId: billingTransactionId as never,
          note: "Google search table creation failed",
        })
      }
      console.error("Failed to create table:", err)
      setIsCreating(false)
    }
  }, [user, results, query, scrapeWebsite, extractEntities, extractEmail, consumeCredits, createSpreadsheet, updateColumnNames, batchUpdateCells, updateMetadata, router, refundCreditTransaction])

  const rowCount = results.length > 0 ? results.length : numResults

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 backdrop-blur-sm sm:p-4">
      <div
        className="flex h-[calc(100dvh-1rem)] max-h-[700px] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl md:h-[min(600px,90vh)] md:flex-row"
        role="dialog"
        aria-modal="true"
        aria-labelledby="google-search-title"
      >
        {/* ── Left: Example Queries ── */}
        <div className="flex max-h-36 w-full shrink-0 flex-col border-b border-border bg-muted/30 md:max-h-none md:w-56 md:border-b-0 md:border-r">
          <div className="shrink-0 px-4 pb-2 pt-3 md:px-5 md:pb-3 md:pt-5">
            <h4 className="text-sm font-semibold text-foreground">Example Queries</h4>
          </div>
          <div className="flex flex-1 gap-2 overflow-x-auto px-3 pb-3 md:block md:space-y-0.5 md:overflow-x-hidden md:overflow-y-auto md:pb-4">
            {EXAMPLE_QUERIES.map((example) => (
              <button
                key={example.label}
                onClick={() => {
                  setQuery(example.query)
                  setSearchError("")
                  setQueryBuilderError("")
                }}
                className={cn(
                  "min-h-11 min-w-40 rounded-lg px-3 py-2 text-left text-xs leading-snug transition-colors md:min-h-0 md:w-full md:min-w-0",
                  query === example.query
                    ? "bg-background border border-border text-foreground font-medium shadow-sm"
                    : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
                )}
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: Form ── */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {/* Header */}
          <div className="flex shrink-0 items-start justify-between border-b border-border px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-5">
            <div className="min-w-0 pr-2">
              <h3 id="google-search-title" className="text-base font-bold text-foreground">Find with a Google Search</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Pull search results from Google and enrich them.</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close Google search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">

            {/* Query field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-foreground">Google search query</label>
                <button
                  onClick={handleQueryBuilder}
                  disabled={isBuilding || !query.trim()}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 disabled:opacity-40 transition-colors"
                >
                  {isBuilding ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Wand2 className="h-3 w-3" />
                  )}
                  Query Builder
                </button>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSearchError("")
                  setQueryBuilderError("")
                }}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearch() }}
                placeholder="site:linkedin.com/in + Software Engineers from London"
                aria-describedby={queryBuilderError ? "query-builder-error" : undefined}
                aria-invalid={queryBuilderError ? true : undefined}
                className="min-h-11 w-full rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 sm:text-sm"
              />
              {queryBuilderError && (
                <p id="query-builder-error" role="alert" className="mt-1.5 text-xs text-destructive">
                  {queryBuilderError}
                </p>
              )}
            </div>

            {/* Number of results */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Number of results{" "}
                <span className="text-muted-foreground font-normal">(max. 100)</span>
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={numResults}
                onChange={(e) => setNumResults(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                className="min-h-11 w-full rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 sm:text-sm"
              />
            </div>

            {/* Language + Country */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Language</label>
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="min-h-11 w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-8 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 sm:text-sm"
                  >
                    {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                  </select>
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">⌄</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Country</label>
                <div className="relative">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="min-h-11 w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-8 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 sm:text-sm"
                  >
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">⌄</span>
                </div>
              </div>
            </div>

            {/* Enrichments */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold text-foreground">Add Enrichments</span>
              </div>
              <div className="space-y-2">
                {[
                  { id: "scrape", label: "Scrape website content", value: scrapeWebsite, set: setScrapeWebsite },
                  { id: "entities", label: "Extract entities from listings and create new rows", value: extractEntities, set: setExtractEntities },
                  { id: "email", label: "Extract email address from the website content", value: extractEmail, set: setExtractEmail },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-2.5 rounded-lg border border-border px-3 py-2.5 cursor-pointer hover:bg-muted/30 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={item.value}
                      onChange={(e) => item.set(e.target.checked)}
                      className="h-3.5 w-3.5 mt-0.5 accent-primary cursor-pointer shrink-0"
                    />
                    <span className="text-xs text-foreground leading-snug">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Results preview */}
            {results.length > 0 && (
              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <p className="text-xs font-semibold text-foreground mb-2">Found {results.length} results</p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {results.map((r, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                      <div className="min-w-0">
                        <p className="text-xs text-foreground truncate leading-tight font-medium">{r.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{r.displayedLink}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchError && (
              <p className="text-xs text-destructive">{searchError}</p>
            )}
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-border px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5" />
                Powered by Serper.dev
              </span>
              <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
                <Button
                  variant="secondary"
                  className="h-auto min-h-11 whitespace-normal px-3 py-2 text-xs sm:min-h-9 sm:px-4"
                  onClick={handleSearch}
                  disabled={isSearching || !query.trim() || isCreating}
                >
                  {isSearching ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />Searching…</>
                  ) : (
                    <><Search className="h-3.5 w-3.5 mr-1" />Search</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="h-auto min-h-11 whitespace-normal px-3 py-2 text-xs sm:min-h-9 sm:px-4"
                  onClick={() => handleCreate(false)}
                  disabled={isCreating || isSearching}
                >
                  {isCreating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Create Project"}
                </Button>
                <Button
                  className="col-span-2 h-auto min-h-11 gap-1 whitespace-normal px-3 py-2 text-xs sm:min-h-9 sm:px-4"
                  onClick={() => handleCreate(true)}
                  disabled={isCreating || isSearching || results.length === 0}
                >
                  {isCreating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <><ExternalLink className="h-3 w-3" />Create &amp; Run {rowCount} rows</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
