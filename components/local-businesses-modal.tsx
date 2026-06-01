"use client"

import { useState, useCallback, useEffect } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import { X, Loader2, MapPin, Search, ExternalLink, Zap } from "lucide-react"
import type { BusinessMarker } from "./local-businesses-map"

// Dynamically import map (Leaflet is client-only)
const LocalBusinessesMap = dynamic(() => import("./local-businesses-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-muted flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span className="text-xs text-muted-foreground">Loading map…</span>
      </div>
    </div>
  ),
})

const BUSINESS_TYPES = [
  { value: "restaurant", label: "Restaurant" },
  { value: "cafe", label: "Cafe" },
  { value: "bar", label: "Bar / Pub" },
  { value: "hotel", label: "Hotel" },
  { value: "shop", label: "Shop / Retail" },
  { value: "supermarket", label: "Supermarket" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "clinic", label: "Hospital / Clinic" },
  { value: "bank", label: "Bank" },
  { value: "gym", label: "Gym / Fitness" },
  { value: "salon", label: "Hair Salon" },
  { value: "bakery", label: "Bakery" },
  { value: "school", label: "School" },
  { value: "fuel", label: "Gas Station" },
  { value: "dentist", label: "Dentist" },
]

interface Business {
  name: string
  address: string
  phone: string
  website: string
  category: string
  openingHours: string
  lat: number | null
  lng: number | null
}

interface Props {
  onClose: () => void
}

export default function LocalBusinessesModal({ onClose }: Props) {
  const router = useRouter()
  const { user } = useAuth()

  const [center, setCenter] = useState<[number, number]>([40.7484, -73.9967]) // fallback until geolocation resolves
  const [locationInput, setLocationInput] = useState("")
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [geocodeError, setGeocodeError] = useState("")
  const [isLocating, setIsLocating] = useState(true) // true while waiting for browser location

  // Auto-detect live location on mount
  useEffect(() => {
    if (!navigator.geolocation) { setIsLocating(false); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude])
        setIsLocating(false)
      },
      () => { setIsLocating(false) }, // permission denied or error → keep Manhattan fallback
      { timeout: 8000 }
    )
  }, [])

  const [radiusKm, setRadiusKm] = useState(1)
  const [searchMode, setSearchMode] = useState<"type" | "text">("type")
  const [businessType, setBusinessType] = useState("restaurant")
  const [searchText, setSearchText] = useState("")
  const [maxResults, setMaxResults] = useState(10)

  const [scrapeWebsite, setScrapeWebsite] = useState(true)
  const [extractEmail, setExtractEmail] = useState(true)

  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState("")
  const [businesses, setBusinesses] = useState<Business[]>([])

  const [isCreating, setIsCreating] = useState(false)

  const createSpreadsheet = useMutation(api.spreadsheets.getOrCreateSpreadsheet)
  const batchUpdateCells = useMutation(api.spreadsheets.updateCellsBatch)
  const updateMetadata = useMutation(api.spreadsheets.updateSpreadsheetMetadata)
  const updateColumnNames = useMutation(api.spreadsheets.updateColumnNamesBatch)

  const geocodeLocation = useCallback(async (loc: string) => {
    if (!loc.trim()) return
    setIsGeocoding(true)
    setGeocodeError("")
    try {
      const res = await fetch("/api/local-businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: loc.trim() }),
      })
      if (!res.ok) { setGeocodeError("Location not found"); return }
      const data = await res.json()
      setCenter([data.lat, data.lng])
    } catch {
      setGeocodeError("Failed to geocode location")
    } finally {
      setIsGeocoding(false)
    }
  }, [])

  const handleSearch = useCallback(async () => {
    setIsSearching(true)
    setSearchError("")
    try {
      const params = new URLSearchParams({
        lat: center[0].toString(),
        lng: center[1].toString(),
        radiusKm: radiusKm.toString(),
        type: businessType,
        text: searchText,
        searchMode,
        maxResults: maxResults.toString(),
      })
      const res = await fetch(`/api/local-businesses?${params}`)
      if (!res.ok) { setSearchError("Search failed. Try a different location or type."); return }
      const data = await res.json()
      setBusinesses(data.businesses || [])
      if ((data.businesses || []).length === 0) setSearchError("No businesses found in this area.")
    } catch {
      setSearchError("Search failed. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }, [center, radiusKm, businessType, searchText, searchMode, maxResults])

  const handleCreate = useCallback(async (withData: boolean) => {
    if (!user?.id) return
    setIsCreating(true)
    try {
      const typeLabel = searchMode === "type"
        ? BUSINESS_TYPES.find((t) => t.value === businessType)?.label ?? businessType
        : searchText || "Businesses"
      const name = `${typeLabel} — ${locationInput || "Local"}`
      const tableId = `table-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const spreadsheetId = await createSpreadsheet({ tableId, userId: user.id, name })

      const columns = [
        "Name", "Address", "Phone", "Website", "Category", "Opening Hours",
        ...(scrapeWebsite ? ["Website Content"] : []),
        ...(extractEmail ? ["Email"] : []),
        "Latitude", "Longitude",
      ]
      const cells: { cellKey: string; value: string }[] = []

      const names = columns.map((col, ci) => ({ colIndex: ci, name: col }))
      await updateColumnNames({ spreadsheetId, names })

      const rows = withData ? businesses : []
      rows.forEach((b, ri) => {
        const vals: string[] = [
          b.name, b.address, b.phone, b.website, b.category, b.openingHours,
          ...(scrapeWebsite ? [""] : []),
          ...(extractEmail ? [""] : []),
          b.lat !== null ? String(b.lat) : "",
          b.lng !== null ? String(b.lng) : "",
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
      console.error("Failed to create table:", err)
      setIsCreating(false)
    }
  }, [user, businesses, businessType, searchText, searchMode, locationInput, scrapeWebsite, extractEmail])

  const businessMarkers: BusinessMarker[] = businesses.map((b) => ({
    name: b.name,
    lat: b.lat,
    lng: b.lng,
    address: b.address,
  }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl rounded-2xl border border-border bg-background shadow-2xl flex overflow-hidden"
        style={{ height: "min(620px, 90vh)" }}>

        {/* ── Left: Map ── */}
        <div className="relative flex-1 min-w-0 overflow-hidden">

          {/* Location search overlay */}
          <div className="absolute top-3 left-3 right-3 z-1000">
            <div className={cn(
              "flex items-center gap-2 bg-white/95 backdrop-blur rounded-lg border shadow-sm px-3 py-2",
              geocodeError ? "border-destructive" : "border-border"
            )}>
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => { setLocationInput(e.target.value); setGeocodeError("") }}
                onKeyDown={(e) => { if (e.key === "Enter") geocodeLocation(locationInput) }}
                placeholder="Location (e.g. 'Faisalabad, Pakistan' or '38000')"
                className="flex-1 text-sm bg-transparent outline-none text-gray-900 placeholder:text-gray-400 min-w-0"
              />
              {isGeocoding ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground shrink-0" />
              ) : (
                <button
                  onClick={() => geocodeLocation(locationInput)}
                  className="text-xs font-medium text-primary hover:text-primary/80 shrink-0"
                >
                  Go
                </button>
              )}
            </div>
            {geocodeError && (
              <p className="mt-1 text-xs text-destructive bg-background/90 px-2 py-0.5 rounded">{geocodeError}</p>
            )}
          </div>

          {/* Map */}
          <LocalBusinessesMap
            center={center}
            radiusKm={radiusKm}
            businesses={businessMarkers}
            onMapClick={(lat, lng) => setCenter([lat, lng])}
          />

          {/* Live-location loading overlay */}
          {isLocating && (
            <div className="absolute inset-0 z-999 flex items-center justify-center bg-background/60 backdrop-blur-sm pointer-events-none">
              <div className="flex items-center gap-2 bg-background rounded-lg border border-border px-4 py-2.5 shadow text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Detecting your location…
              </div>
            </div>
          )}

          {/* Radius slider overlay */}
          <div className="absolute bottom-3 left-3 right-3 z-1000 bg-white/90 backdrop-blur rounded-lg border border-border px-4 py-2.5 shadow">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-600 shrink-0 whitespace-nowrap">
                Radius: {radiusKm < 1 ? `${Math.round(radiusKm * 1000)}m` : `${radiusKm} km`} / {(radiusKm * 0.621).toFixed(2)} miles
              </span>
              <input
                type="range"
                min={0.2}
                max={10}
                step={0.1}
                value={radiusKm}
                onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
                className="flex-1 cursor-pointer h-1.5 accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* ── Right: Form ── */}
        <div className="w-80 shrink-0 border-l border-border flex flex-col bg-background">

          {/* Header */}
          <div className="flex items-start justify-between px-5 py-4 border-b border-border shrink-0">
            <div className="min-w-0 pr-2">
              <h3 className="text-base font-bold text-foreground">Find local businesses</h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Search for businesses near a specific location with customizable radius.
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Scrollable form body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

            {/* Search Type toggle */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Search Type
              </label>
              <div className="flex rounded-lg border border-border overflow-hidden text-xs">
                {(["type", "text"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSearchMode(mode)}
                    className={cn(
                      "flex-1 py-1.5 font-medium transition-colors",
                      searchMode === mode
                        ? "bg-foreground text-background"
                        : "bg-background text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {mode === "type" ? "Business Type" : "Text Search"}
                  </button>
                ))}
              </div>
            </div>

            {/* Business Type or Text input */}
            {searchMode === "type" ? (
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Business Type</label>
                <div className="relative">
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 pr-8"
                  >
                    <option value="">Select business type</option>
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">⌄</span>
                </div>
              </div>
            ) : (
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Search text</label>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearch() }}
                  placeholder="e.g. pizza, yoga studio…"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            )}

            {/* Max results */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Max. number of results{" "}
                <span className="text-muted-foreground font-normal">(max. 50)</span>
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={maxResults}
                onChange={(e) => setMaxResults(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
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
            {businesses.length > 0 && (
              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <p className="text-xs font-semibold text-foreground mb-2">
                  Found {businesses.length} businesses
                </p>
                <div className="space-y-1.5 max-h-28 overflow-y-auto">
                  {businesses.map((b, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                      <div className="min-w-0">
                        <p className="text-xs text-foreground truncate leading-tight">{b.name}</p>
                        {b.address && (
                          <p className="text-[10px] text-muted-foreground truncate">{b.address}</p>
                        )}
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
          <div className="px-5 py-4 border-t border-border shrink-0 space-y-2.5">
            {/* Search button */}
            <Button
              variant="outline"
              className="w-full gap-2 text-xs h-8"
              onClick={handleSearch}
              disabled={isSearching || (searchMode === "type" && !businessType) || (searchMode === "text" && !searchText.trim())}
            >
              {isSearching ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" />Searching…</>
              ) : (
                <><Search className="h-3.5 w-3.5" />Search Businesses</>
              )}
            </Button>

            {/* Estimated cost + action buttons */}
            <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
              <span>Estimated Cost: free</span>
              <span>{businesses.length > 0 ? `${businesses.length} results` : ""}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="flex-1 text-xs h-9"
                onClick={() => handleCreate(false)}
                disabled={isCreating}
              >
                {isCreating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Create Project"}
              </Button>
              <Button
                className="flex-1 text-xs h-9 gap-1"
                onClick={() => handleCreate(true)}
                disabled={isCreating || businesses.length === 0}
              >
                {isCreating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <><ExternalLink className="h-3 w-3" />Run {businesses.length || maxResults} rows</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
