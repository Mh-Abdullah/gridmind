import { NextRequest } from "next/server"
import { Output, ToolLoopAgent, generateText, tool, stepCountIs } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// Types for the request
interface ScraperRequest {
  prompt: string
  mode: "enrich" | "generate" // enrich = add columns to selected rows, generate = create new table data
  chatHistory?: {
    role: "user" | "assistant" | "system"
    content: string
  }[]
  selectedRows?: {
    rowIndex: number
    cells: { [colIndex: string]: string }
  }[]
  existingColumns?: string[] // Column headers/labels
  businessContext?: string  // User's saved context docs injected from Contexts page
  tableInfo: {
    tableId: string
    projectName: string
    numRows: number
    numCols: number
  }
}

interface ScrapedColumn {
  header: string
  values: { rowIndex: number; value: string }[]
}

// Response for generation mode - creates entire table structure
interface GeneratedTable {
  headers: string[]
  rows: string[][] // Each row is an array of cell values
}

const GeneratedTableSchema = z.object({
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
})

const GenerateAgentResultSchema = z.object({
  table: GeneratedTableSchema,
  summary: z.string().optional(),
})

const ScrapedColumnSchema = z.object({
  header: z.string(),
  values: z.array(z.object({
    rowIndex: z.number(),
    value: z.string(),
  })),
})

const EnrichAgentResultSchema = z.object({
  columns: z.array(ScrapedColumnSchema),
  summary: z.string().optional(),
})

const ScraperAgentResultSchema = z.union([
  GenerateAgentResultSchema,
  EnrichAgentResultSchema,
])

const ScraperAgentCallOptionsSchema = z.object({
  mode: z.enum(["generate", "enrich"]),
  prompt: z.string(),
  tableInfo: z.object({
    tableId: z.string(),
    projectName: z.string(),
    numRows: z.number(),
    numCols: z.number(),
  }),
  chatHistory: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
  })).optional(),
  selectedRows: z.array(z.object({
    rowIndex: z.number(),
    cells: z.record(z.string(), z.string()),
  })).optional(),
  existingColumns: z.array(z.string()).optional(),
  businessContext: z.string().optional(),
})

type ScraperAgentCallOptions = z.infer<typeof ScraperAgentCallOptionsSchema>

// Rotating User-Agent pool — reduces bot detection
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
]
const randomUA = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]

// Web scraping tool - fetches and extracts data from URLs
const scrapeWebPage = tool({
  description: "Fetch and extract text content from a web page. Use this to scrape data from URLs found in the spreadsheet rows or to search for information about items in the rows.",
  inputSchema: z.object({
    url: z.string().describe("The URL to fetch and scrape"),
    extractionHint: z.string().optional().describe("What specific information to look for on the page"),
  }),
  execute: async ({ url, extractionHint }) => {
    try {
      // Validate URL
      new URL(url)

      const ua = randomUA()

      // Attempt 1 — full browser headers
      let response = await fetch(url, {
        headers: {
          "User-Agent": ua,
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-GB,en;q=0.9,en-US;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Upgrade-Insecure-Requests": "1",
          "DNT": "1",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(12000),
      })

      // Attempt 2 — on 403/429/503 try plain GET with minimal headers (some sites block Sec-Fetch headers)
      if ([403, 429, 503].includes(response.status)) {
        await new Promise(r => setTimeout(r, 800))
        response = await fetch(url, {
          headers: {
            "User-Agent": randomUA(),
            "Accept": "text/html,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
          },
          redirect: "follow",
          signal: AbortSignal.timeout(12000),
        })
      }

      // Attempt 3 — try Google Cache as a last resort for blocked pages
      if ([403, 429, 503].includes(response.status)) {
        const cacheUrl = `https://webcache.googleusercontent.com/search?q=cache:${encodeURIComponent(url)}`
        try {
          const cacheRes = await fetch(cacheUrl, {
            headers: { "User-Agent": randomUA(), "Accept": "text/html" },
            signal: AbortSignal.timeout(10000),
          })
          if (cacheRes.ok) {
            const html = await cacheRes.text()
            const text = extractTextFromHTML(html).slice(0, 8000)
            return { url, content: text, extractionHint, success: true, note: "served from Google Cache" }
          }
        } catch { /* cache unavailable, fall through */ }

        return {
          error: `Page blocked this scraper (HTTP ${response.status}). Site uses anti-bot protection.`,
          blockedUrl: url,
          content: null,
          success: false,
        }
      }

      if (!response.ok) {
        return { error: `HTTP ${response.status} — page could not be loaded`, content: null, success: false }
      }

      const html = await response.text()
      const textContent = extractTextFromHTML(html).slice(0, 8000)

      return { url, content: textContent, extractionHint, success: true }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to scrape page"
      return { error: msg, content: null, success: false }
    }
  },
})

// Search web tool - performs a web search and returns results
const searchWeb = tool({
  description: "Search the web for information. Use this when you need to find information about items in the spreadsheet that don't have URLs.",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
    context: z.string().optional().describe("Additional context about what kind of results are needed"),
  }),
  execute: async ({ query, context }) => {
    try {
      const results: { title: string; snippet: string; url: string }[] = []

      // --- Primary: DuckDuckGo HTML search ---
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
      const response = await fetch(searchUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Referer": "https://duckduckgo.com/",
        },
        signal: AbortSignal.timeout(10000),
      })

      if (response.ok) {
        const html = await response.text()
        let match

        // DuckDuckGo wraps hrefs as //duckduckgo.com/l/?uddg=<encoded-url>
        // Extract title link and decode the real destination URL
        const titleRegex = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi
        const titleMatches: { url: string; title: string }[] = []

        while ((match = titleRegex.exec(html)) !== null && titleMatches.length < 5) {
          const href = match[1]
          const title = match[2].replace(/<[^>]+>/g, "").trim()
          let actualUrl = href

          if (href.includes("uddg=")) {
            try {
              const qs = href.includes("?") ? href.split("?")[1] : href
              const uddg = new URLSearchParams(qs).get("uddg")
              if (uddg) actualUrl = decodeURIComponent(uddg)
            } catch { /* keep original */ }
          }

          if (actualUrl && !actualUrl.includes("duckduckgo.com") && actualUrl.startsWith("http")) {
            titleMatches.push({ url: actualUrl, title })
          }
        }

        // Collect snippets in order
        const snippetRegex = /<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi
        const snippets: string[] = []
        while ((match = snippetRegex.exec(html)) !== null) {
          snippets.push(match[1].replace(/<[^>]+>/g, "").trim())
        }

        for (let i = 0; i < titleMatches.length; i++) {
          results.push({
            url: titleMatches[i].url,
            title: titleMatches[i].title,
            snippet: snippets[i] || "",
          })
        }
      }

      // --- Fallback: DuckDuckGo Instant Answer JSON API ---
      if (results.length === 0) {
        const jsonUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
        const jsonRes = await fetch(jsonUrl, {
          headers: { "User-Agent": "Mozilla/5.0" },
          signal: AbortSignal.timeout(8000),
        })
        if (jsonRes.ok) {
          const data = await jsonRes.json() as {
            AbstractText?: string; AbstractURL?: string; Heading?: string
            RelatedTopics?: { Text?: string; FirstURL?: string }[]
          }
          if (data.AbstractText) {
            results.push({ url: data.AbstractURL || "", title: data.Heading || query, snippet: data.AbstractText })
          }
          for (const topic of (data.RelatedTopics || []).slice(0, 4)) {
            if (topic.Text && topic.FirstURL) {
              results.push({
                url: topic.FirstURL,
                title: topic.Text.split(" - ")[0] || topic.Text.slice(0, 60),
                snippet: topic.Text,
              })
            }
          }
        }
      }

      // --- Fallback 2: Bing HTML search ---
      if (results.length === 0) {
        try {
          const bingUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}&count=10&setlang=en`
          const bingRes = await fetch(bingUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
              "Accept": "text/html,application/xhtml+xml,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.9",
            },
            signal: AbortSignal.timeout(10000),
          })
          if (bingRes.ok) {
            const html = await bingRes.text()
            // Bing result titles are in <h2><a href="...">Title</a></h2>
            const bingTitleRe = /<h2[^>]*>\s*<a[^>]*\bhref="(https?:\/\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi
            let bm: RegExpExecArray | null
            while ((bm = bingTitleRe.exec(html)) !== null && results.length < 5) {
              const url = bm[1]
              const title = bm[2].replace(/<[^>]+>/g, "").trim()
              if (url && !url.includes("bing.com") && !url.includes("microsoft.com") && title) {
                results.push({ url, title, snippet: "" })
              }
            }
          }
        } catch { /* Bing fallback unavailable */ }
      }

      return { query, context, results, success: true }
    } catch (error) {
      return {
        results: [],
        error: error instanceof Error ? error.message : "Search failed",
      }
    }
  },
})

// OpenStreetMap tool - finds ANY physical place by type and location (100% free, no API key)
const searchOpenStreetMap = tool({
  description: `Search OpenStreetMap (Overpass API) for ANY physical place or venue in any city worldwide. 100% free, no API key needed. Covers: restaurants, cafes, pubs, bars, hotels, hostels, schools, universities, colleges, hospitals, clinics, pharmacies, gyms, sports centres, swimming pools, stadiums, museums, galleries, tourist attractions, theme parks, zoos, cinemas, theatres, libraries, mosques, churches, temples, supermarkets, shops, bakeries, hairdressers, beauty salons, spas, banks, ATMs, petrol stations, parking, offices, coworking spaces, nightclubs, parks, playgrounds, and much more. Returns name, address, phone, website, opening hours.`,
  inputSchema: z.object({
    placeType: z.string().describe(
      "Type of place to search for. Examples: 'restaurant', 'school', 'hotel', 'museum', 'mosque', 'gym', 'cinema', 'hospital', 'park', 'sports centre', 'university', 'tourist attraction', 'spa', 'nightclub', 'zoo', 'stadium', 'swimming pool', 'library', 'church', 'supermarket', 'pharmacy'"
    ),
    location: z.string().describe("City, town, or area to search in. E.g. 'Leeds', 'Dubai', 'Paris', 'New York'"),
    maxResults: z.number().optional().describe("Max results to return (default 40)"),
  }),
  execute: async ({ placeType, location, maxResults = 40 }) => {
    try {
      // Step 1: Geocode location with Nominatim (free OSM geocoder)
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
      const geocodeRes = await fetch(geocodeUrl, {
        headers: { "User-Agent": "GridMind/1.0" },
        signal: AbortSignal.timeout(8000),
      })
      if (!geocodeRes.ok) return { error: "Geocoding failed", results: [] }
      const places = await geocodeRes.json() as { lat: string; lon: string; boundingbox: string[] }[]
      if (!places.length) return { error: `Location not found: ${location}`, results: [] }

      const { boundingbox } = places[0]
      const [south, north, west, east] = boundingbox
      const bbox = `${south},${west},${north},${east}`

      // Step 2: Comprehensive OSM tag map — covers all common place types
      const tagMap: Record<string, string> = {
        // Food & Drink
        restaurant: "amenity=restaurant", cafe: "amenity=cafe", coffee: "amenity=cafe",
        bar: "amenity=bar", pub: "amenity=pub", fast_food: "amenity=fast_food",
        food: "amenity=restaurant", bakery: "shop=bakery", ice_cream: "amenity=ice_cream",
        nightclub: "amenity=nightclub",

        // Accommodation
        hotel: "tourism=hotel", hostel: "tourism=hostel", motel: "tourism=motel",
        guest_house: "tourism=guest_house", apartment: "tourism=apartment",
        camp_site: "tourism=camp_site",

        // Shops / Retail
        shop: "shop", supermarket: "shop=supermarket", grocery: "shop=supermarket",
        clothing: "shop=clothes", clothes: "shop=clothes", fashion: "shop=clothes",
        electronics: "shop=electronics", furniture: "shop=furniture",
        bookshop: "shop=books", books: "shop=books",
        butcher: "shop=butcher", fishmonger: "shop=fish",
        jewellery: "shop=jewellery", jewelry: "shop=jewellery",
        sports_shop: "shop=sports", toys: "shop=toys", games: "shop=games",
        florist: "shop=florist", gift: "shop=gift",
        pharmacy: "amenity=pharmacy", chemist: "shop=chemist",
        optician: "shop=optician", hairdresser: "shop=hairdresser",
        beauty_salon: "shop=beauty", beauty: "shop=beauty",
        car_dealership: "shop=car", mobile_phone: "shop=mobile_phone",
        laundry: "shop=laundry", dry_cleaning: "shop=dry_cleaning",

        // Education
        school: "amenity=school", college: "amenity=college",
        university: "amenity=university", kindergarten: "amenity=kindergarten",
        nursery: "amenity=kindergarten", education: "amenity=school",
        language_school: "amenity=language_school", driving_school: "amenity=driving_school",

        // Health & Wellness
        hospital: "amenity=hospital", clinic: "amenity=clinic",
        dentist: "amenity=dentist", doctor: "amenity=doctors",
        veterinary: "amenity=veterinary", vet: "amenity=veterinary",
        spa: "leisure=spa", massage: "leisure=spa",

        // Sports & Recreation
        gym: "leisure=fitness_centre", fitness: "leisure=fitness_centre",
        sports_centre: "leisure=sports_centre", sports: "leisure=sports_centre",
        swimming_pool: "leisure=swimming_pool", pool: "leisure=swimming_pool",
        stadium: "leisure=stadium", golf: "leisure=golf_course",
        tennis: "leisure=tennis", pitch: "leisure=pitch",
        ice_rink: "leisure=ice_rink", bowling: "leisure=bowling_alley",
        park: "leisure=park", playground: "leisure=playground",
        marina: "leisure=marina",

        // Tourism & Attractions
        tourist_attraction: "tourism=attraction", attraction: "tourism=attraction",
        museum: "tourism=museum", gallery: "tourism=gallery",
        art_gallery: "tourism=gallery", viewpoint: "tourism=viewpoint",
        theme_park: "tourism=theme_park", zoo: "tourism=zoo",
        aquarium: "tourism=aquarium", castle: "historic=castle",
        monument: "historic=monument", ruins: "historic=ruins",
        visit_place: "tourism=attraction",

        // Arts & Entertainment
        cinema: "amenity=cinema", theatre: "amenity=theatre",
        theater: "amenity=theatre", concert_hall: "amenity=theatre",
        library: "amenity=library",

        // Places of Worship
        mosque: "amenity=place_of_worship", church: "amenity=place_of_worship",
        temple: "amenity=place_of_worship", synagogue: "amenity=place_of_worship",
        place_of_worship: "amenity=place_of_worship",

        // Financial
        bank: "amenity=bank", atm: "amenity=atm",
        currency_exchange: "amenity=bureau_de_change",

        // Transport
        petrol: "amenity=fuel", fuel: "amenity=fuel", gas_station: "amenity=fuel",
        parking: "amenity=parking", car_wash: "amenity=car_wash",
        car_rental: "amenity=car_rental",

        // Work & Business
        office: "office", coworking: "amenity=coworking_space",

        // Government & Services
        post_office: "amenity=post_office", police: "amenity=police",
        fire_station: "amenity=fire_station", embassy: "amenity=embassy",
        townhall: "amenity=townhall", courthouse: "amenity=courthouse",
      }

      const lower = placeType.toLowerCase().replace(/\s+/g, "_")
      const osmTag = tagMap[lower]
        ?? tagMap[lower.split("_")[0]]
        ?? tagMap[Object.keys(tagMap).find(k => lower.includes(k)) ?? ""]

      let tagFilter: string
      if (osmTag) {
        const [k, v] = osmTag.includes("=") ? osmTag.split("=") : [osmTag, ""]
        tagFilter = v ? `["${k}"="${v}"]` : `["${k}"]`
      } else {
        // Generic fallback: search by name or tag value matching the keyword
        tagFilter = `[~"name|brand|amenity|tourism|shop|leisure|historic|office"~"${placeType.replace(/\s+/g, "_")}",i]`
      }

      // Step 3: Query Overpass API — race all mirrors in parallel
      const overpassQuery = `[out:json][timeout:30];(nwr${tagFilter}(${bbox}););out body center ${maxResults};`
      const overpassEndpoints = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter",
        "https://overpass.openstreetmap.ru/api/interpreter",
      ]

      type OsmElement = { tags?: Record<string, string> }

      const tryOverpass = async (url: string): Promise<{ elements: OsmElement[] }> => {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `data=${encodeURIComponent(overpassQuery)}`,
          signal: AbortSignal.timeout(25000),
        })
        if (!res.ok) throw new Error(`${url} returned HTTP ${res.status}`)
        return res.json()
      }

      let data: { elements: OsmElement[] }
      try {
        data = await Promise.any(overpassEndpoints.map(tryOverpass))
      } catch {
        return { error: "Overpass API unavailable — all mirrors failed", results: [] }
      }

      const seen = new Set<string>()
      const results = data.elements
        .map((el) => {
          const t = el.tags || {}
          const name = t.name || t.brand || t["name:en"] || ""
          if (!name || seen.has(name.toLowerCase())) return null
          seen.add(name.toLowerCase())
          return {
            name,
            address: [t["addr:housenumber"], t["addr:street"], t["addr:city"] || t["addr:town"], t["addr:postcode"]]
              .filter(Boolean).join(", ") || "N/A",
            phone: t.phone || t["contact:phone"] || "N/A",
            website: t.website || t["contact:website"] || "N/A",
            email: t.email || t["contact:email"] || "N/A",
            type: t.amenity || t.tourism || t.shop || t.leisure || t.historic || t.office || placeType,
            openingHours: t.opening_hours || "N/A",
            description: t.description || t["description:en"] || "N/A",
          }
        })
        .filter((r): r is NonNullable<typeof r> => r !== null)
        .slice(0, maxResults)

      return { location, placeType, results, total: results.length }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "OpenStreetMap request failed", results: [] }
    }
  },
})

// Companies House search tool - finds UK registered companies
// Works WITHOUT an API key by scraping the public website; use a free API key for cleaner structured data
const searchCompaniesHouse = tool({
  description: "Search the UK Companies House register for legally registered UK companies. Works for free with no API key. Use this when the user wants UK company data: ecommerce companies, software firms, any industry in any UK city. Returns company name, number, address, status, incorporation date, SIC codes.",
  inputSchema: z.object({
    query: z.string().describe("Search term, e.g. 'ecommerce Leeds' or 'software Manchester' or 'retail Birmingham'"),
    maxResults: z.number().optional().describe("Number of results to return (default 20, max 100)"),
  }),
  execute: async ({ query, maxResults = 20 }) => {
    const apiKey = process.env.COMPANIES_HOUSE_API_KEY

    // ── Path A: official API (structured, fast) ───────────────────────────
    if (apiKey) {
      try {
        const url = `https://api.company-information.service.gov.uk/search/companies?q=${encodeURIComponent(query)}&items_per_page=${Math.min(maxResults, 100)}`
        const credentials = Buffer.from(`${apiKey}:`).toString("base64")
        const res = await fetch(url, {
          headers: { Authorization: `Basic ${credentials}` },
          signal: AbortSignal.timeout(10000),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json() as {
          total_results?: number
          items?: {
            title: string; company_number: string; company_status?: string
            company_type?: string; date_of_creation?: string; address_snippet?: string
            sic_codes?: string[]
          }[]
        }
        const results = (data.items || []).map((c) => ({
          name: c.title, companyNumber: c.company_number,
          status: c.company_status ?? "N/A", type: c.company_type ?? "N/A",
          incorporated: c.date_of_creation ?? "N/A", address: c.address_snippet ?? "N/A",
          sicCodes: (c.sic_codes || []).join(", ") || "N/A",
          profileUrl: `https://find-and-update.company-information.service.gov.uk/company/${c.company_number}`,
        }))
        return { query, results, total: data.total_results ?? results.length, source: "api" }
      } catch {
        // fall through to web scrape below
      }
    }

    // ── Path B: public website scraping (no key needed) ───────────────────
    try {
      const url = `https://find-and-update.company-information.service.gov.uk/search?q=${encodeURIComponent(query)}&type=companies`
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,*/*;q=0.8",
        },
        signal: AbortSignal.timeout(12000),
      })
      if (!res.ok) return { error: `Companies House site returned HTTP ${res.status}`, results: [] }

      const html = await res.text()

      // Parse company cards from HTML
      const results: {
        name: string; companyNumber: string; status: string
        address: string; incorporated: string; profileUrl: string
      }[] = []

      // Each result block is wrapped in <li class="type-company ..."> or similar
      const blockRe = /<li[^>]*class="[^"]*type-company[^"]*"[^>]*>([\s\S]*?)<\/li>/gi
      let block: RegExpExecArray | null
      while ((block = blockRe.exec(html)) !== null && results.length < maxResults) {
        const inner = block[1]

        // Company name + href
        const nameMatch = inner.match(/<a[^>]*href="\/company\/([A-Z0-9]+)"[^>]*>([\s\S]*?)<\/a>/i)
        if (!nameMatch) continue
        const companyNumber = nameMatch[1]
        const name = nameMatch[2].replace(/<[^>]+>/g, "").trim()

        // Status
        const statusMatch = inner.match(/class="[^"]*status[^"]*"[^>]*>([\s\S]*?)<\/span>/i)
        const status = statusMatch ? statusMatch[1].replace(/<[^>]+>/g, "").trim() : "N/A"

        // Address
        const addrMatch = inner.match(/class="[^"]*address[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/i)
        const address = addrMatch ? addrMatch[1].replace(/<[^>]+>/g, "").trim() : "N/A"

        // Incorporated date
        const incMatch = inner.match(/Incorporated on\s*<[^>]*>([^<]+)</i)
          ?? inner.match(/([0-9]{1,2}\s+\w+\s+[0-9]{4})/i)
        const incorporated = incMatch ? incMatch[1].trim() : "N/A"

        results.push({
          name, companyNumber, status, address, incorporated,
          profileUrl: `https://find-and-update.company-information.service.gov.uk/company/${companyNumber}`,
        })
      }

      return { query, results, total: results.length, source: "web" }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Companies House request failed", results: [] }
    }
  },
})

// OpenCorporates tool - global registered company search (140+ countries, 100% free, no key)
const searchOpenCorporates = tool({
  description: "Search OpenCorporates for legally registered companies in ANY country worldwide (140+ jurisdictions). 100% free, no API key needed. Use this for ALL non-UK company searches: ecommerce companies in Dubai, tech startups in Germany, marketing agencies in Australia, retail companies in USA, etc. Returns company name, country, address, status, incorporation date.",
  inputSchema: z.object({
    query: z.string().describe("Industry or keyword + city/region, e.g. 'ecommerce Dubai', 'software Berlin', 'marketing Sydney', 'retail New York'"),
    countryCode: z.string().optional().describe("ISO 2-letter country code to narrow search. Examples: ae=UAE, de=Germany, us=USA, au=Australia, in=India, ca=Canada, fr=France, sg=Singapore, nl=Netherlands, es=Spain, it=Italy, pk=Pakistan, sa=Saudi Arabia, ae=UAE, ng=Nigeria, za=South Africa. Leave empty to search all countries."),
    maxResults: z.number().optional().describe("Number of results (default 30, max 100)"),
  }),
  execute: async ({ query, countryCode, maxResults = 30 }) => {
    try {
      const perPage = Math.min(maxResults, 100)
      const jurisdictionParam = countryCode ? `&jurisdiction_code=${countryCode.toLowerCase()}` : ""
      const url = `https://api.opencorporates.com/v0.4/companies/search?q=${encodeURIComponent(query)}&per_page=${perPage}${jurisdictionParam}&inactive=false`

      const res = await fetch(url, {
        headers: { "User-Agent": "GridMind/1.0" },
        signal: AbortSignal.timeout(12000),
      })

      if (!res.ok) return { error: `OpenCorporates returned HTTP ${res.status}`, results: [] }

      const data = await res.json() as {
        results?: {
          companies?: {
            company: {
              name: string
              company_number: string
              jurisdiction_code: string
              registered_address_in_full?: string
              incorporation_date?: string
              dissolution_date?: string
              current_status?: string
              company_type?: string
              registry_url?: string
            }
          }[]
        }
      }

      const results = (data.results?.companies || []).map(({ company: c }) => ({
        name: c.name,
        companyNumber: c.company_number,
        country: c.jurisdiction_code?.toUpperCase().split("_")[0] ?? "N/A",
        jurisdiction: c.jurisdiction_code ?? "N/A",
        address: c.registered_address_in_full ?? "N/A",
        status: c.current_status ?? "N/A",
        type: c.company_type ?? "N/A",
        incorporated: c.incorporation_date ?? "N/A",
        profileUrl: c.registry_url ?? `https://opencorporates.com/companies/${c.jurisdiction_code}/${c.company_number}`,
      }))

      return { query, results, total: results.length }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "OpenCorporates request failed", results: [] }
    }
  },
})

// Extract info from row data tool
const extractFromRowData = tool({
  description: "Analyze the existing row data to understand what information is available and what patterns exist. Use this first to understand the spreadsheet context.",
  inputSchema: z.object({
    analysis: z.string().describe("What aspect of the row data to analyze"),
  }),
  execute: async ({ analysis }) => {
    // This is a placeholder - actual data is injected in the prompt
    return { analysis, note: "Row data is available in the system prompt context." }
  },
})

// Wikipedia search tool — free, no key, highly reliable for factual/encyclopedic data
const searchWikipedia = tool({
  description: "Search Wikipedia for encyclopedic information about ANY topic: companies, places, landmarks, people, products, events, history, science, technology. Always free, no API key needed. Use this for factual background data on named entities.",
  inputSchema: z.object({
    query: z.string().describe("What to look up on Wikipedia, e.g. 'Tesla Inc', 'Eiffel Tower', 'Python programming language'"),
  }),
  execute: async ({ query }) => {
    try {
      // Attempt 1: Direct page summary REST API
      const cleanQuery = query.trim().replace(/ /g, "_")
      const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanQuery)}`
      const res = await fetch(summaryUrl, {
        headers: { "User-Agent": "GridMind/1.0 (data-research-bot; contact@gridmind.app)" },
        signal: AbortSignal.timeout(8000),
      })
      if (res.ok) {
        const data = await res.json() as {
          title: string; extract: string; description?: string
          content_urls?: { desktop?: { page: string } }
        }
        if (data.extract && data.extract.length > 80) {
          return {
            title: data.title,
            description: data.description || "",
            summary: data.extract.slice(0, 4000),
            url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${cleanQuery}`,
            success: true,
          }
        }
      }

      // Attempt 2: Wikipedia search API then fetch top result summary
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&srlimit=5&origin=*`
      const searchRes = await fetch(searchUrl, {
        headers: { "User-Agent": "GridMind/1.0" },
        signal: AbortSignal.timeout(8000),
      })
      if (!searchRes.ok) return { error: "Wikipedia unavailable", success: false }

      const searchData = await searchRes.json() as { query?: { search?: { title: string; snippet: string }[] } }
      const hits = searchData.query?.search || []
      if (hits.length === 0) return { results: [], note: "No Wikipedia results found", success: true }

      const top = hits[0]
      const topSummaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(top.title.replace(/ /g, "_"))}`
      const topRes = await fetch(topSummaryUrl, { headers: { "User-Agent": "GridMind/1.0" }, signal: AbortSignal.timeout(8000) })
      if (topRes.ok) {
        const topData = await topRes.json() as { title: string; extract: string; description?: string; content_urls?: { desktop?: { page: string } } }
        return {
          title: topData.title,
          description: topData.description || "",
          summary: topData.extract?.slice(0, 4000) || top.snippet.replace(/<[^>]+>/g, ""),
          url: topData.content_urls?.desktop?.page || "",
          otherResults: hits.slice(1).map(h => ({ title: h.title, snippet: h.snippet.replace(/<[^>]+>/g, "") })),
          success: true,
        }
      }

      return { results: hits.map(h => ({ title: h.title, snippet: h.snippet.replace(/<[^>]+>/g, "") })), success: true }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Wikipedia search failed", success: false }
    }
  },
})

// Brave Search API — high-quality independent web search, no Google dependency
const searchBraveWeb = tool({
  description: "Search the web using Brave Search API — higher quality results than DuckDuckGo. Use this when searchWeb returns poor/empty results. Requires BRAVE_SEARCH_API_KEY environment variable.",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
    count: z.number().optional().describe("Number of results to return (default 5, max 20)"),
  }),
  execute: async ({ query, count = 5 }) => {
    const apiKey = process.env.BRAVE_SEARCH_API_KEY
    if (!apiKey) return { error: "BRAVE_SEARCH_API_KEY not configured — skipping Brave Search", results: [], success: false }
    try {
      const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${Math.min(count, 20)}`
      const res = await fetch(url, {
        headers: {
          "Accept": "application/json",
          "Accept-Encoding": "gzip",
          "X-Subscription-Token": apiKey,
        },
        signal: AbortSignal.timeout(10000),
      })
      if (!res.ok) return { error: `Brave Search HTTP ${res.status}`, results: [], success: false }
      const data = await res.json() as { web?: { results?: { title: string; url: string; description: string }[] } }
      const results = (data.web?.results || []).map(r => ({ title: r.title, url: r.url, snippet: r.description || "" }))
      return { query, results, success: true }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Brave Search failed", results: [], success: false }
    }
  },
})

// Google Search via Serper API — best quality search results (Google index)
const searchGoogleSerper = tool({
  description: "Search Google via Serper API — the highest quality web search available, using Google's index. Use this when other search tools return poor results. Requires SERPER_API_KEY environment variable.",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
    num: z.number().optional().describe("Number of results (default 5)"),
  }),
  execute: async ({ query, num = 5 }) => {
    const apiKey = process.env.SERPER_API_KEY
    if (!apiKey) return { error: "SERPER_API_KEY not configured — skipping Google Serper", results: [], success: false }
    try {
      const res = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({ q: query, num }),
        signal: AbortSignal.timeout(10000),
      })
      if (!res.ok) return { error: `Serper HTTP ${res.status}`, results: [], success: false }
      const data = await res.json() as {
        organic?: { title: string; link: string; snippet: string }[]
        answerBox?: { answer?: string; snippet?: string }
        knowledgeGraph?: { title: string; description?: string; website?: string; attributes?: Record<string, string> }
      }
      const results = (data.organic || []).map(r => ({ title: r.title, url: r.link, snippet: r.snippet || "" }))
      return {
        query,
        results,
        answerBox: data.answerBox?.answer || data.answerBox?.snippet || null,
        knowledgeGraph: data.knowledgeGraph || null,
        success: true,
      }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Serper search failed", results: [], success: false }
    }
  },
})

const SCRAPER_TOOLS = {
  scrapeWebPage,
  searchWeb,
  searchBraveWeb,
  searchGoogleSerper,
  searchWikipedia,
  searchOpenStreetMap,
  searchCompaniesHouse,
  searchOpenCorporates,
  extractFromRowData,
}

const SCRAPER_MODEL = openai(process.env.OPENAI_MODEL || "gpt-5.5")
const SCRAPER_PROVIDER_OPTIONS = {
  openai: {
    reasoningEffort: "high" as const,
  },
}

const GENERATE_ACTIVE_TOOLS: Array<keyof typeof SCRAPER_TOOLS> = [
  "scrapeWebPage",
  "searchWeb",
  "searchBraveWeb",
  "searchGoogleSerper",
  "searchWikipedia",
  "searchOpenStreetMap",
  "searchCompaniesHouse",
  "searchOpenCorporates",
]

const ENRICH_ACTIVE_TOOLS: Array<keyof typeof SCRAPER_TOOLS> = [
  ...GENERATE_ACTIVE_TOOLS,
  "extractFromRowData",
]

// Helper function to extract text from HTML
function extractTextFromHTML(html: string): string {
  const sections: string[] = []

  // ── 1. JSON-LD structured data (highest quality — contains phone, address, hours, price, rating) ──
  const jsonLdRe = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let jm: RegExpExecArray | null
  while ((jm = jsonLdRe.exec(html)) !== null) {
    try {
      const raw = JSON.parse(jm[1].trim())
      const items: Record<string, unknown>[] = Array.isArray(raw) ? raw : [raw]
      for (const item of items) {
        const lines: string[] = []
        const s = (v: unknown) => (v ? String(v) : "")
        if (item["@type"]) lines.push(`Type: ${Array.isArray(item["@type"]) ? (item["@type"] as string[]).join(", ") : item["@type"]}`)
        if (item.name) lines.push(`Name: ${s(item.name)}`)
        if (item.description) lines.push(`Description: ${s(item.description).slice(0, 300)}`)
        if (item.telephone) lines.push(`Phone: ${s(item.telephone)}`)
        if (item.email) lines.push(`Email: ${s(item.email)}`)
        if (item.url) lines.push(`Website: ${s(item.url)}`)
        if (item.address) {
          const a = item.address as Record<string, string>
          if (typeof a === "string") lines.push(`Address: ${a}`)
          else lines.push(`Address: ${[a.streetAddress, a.addressLocality, a.addressRegion, a.postalCode, a.addressCountry].filter(Boolean).join(", ")}`)
        }
        if (item.openingHours) lines.push(`Opening Hours: ${Array.isArray(item.openingHours) ? (item.openingHours as string[]).join(", ") : item.openingHours}`)
        if (item.priceRange) lines.push(`Price Range: ${s(item.priceRange)}`)
        if (item.starRating) lines.push(`Star Rating: ${s((item.starRating as Record<string,unknown>).ratingValue)}`)
        if (item.aggregateRating) {
          const r = item.aggregateRating as Record<string, unknown>
          lines.push(`Rating: ${s(r.ratingValue)}/5 (${s(r.reviewCount)} reviews)`)
        }
        if (item.checkinTime) lines.push(`Check-in: ${s(item.checkinTime)}`)
        if (item.checkoutTime) lines.push(`Check-out: ${s(item.checkoutTime)}`)
        if (item.servesCuisine) lines.push(`Cuisine: ${Array.isArray(item.servesCuisine) ? (item.servesCuisine as string[]).join(", ") : item.servesCuisine}`)
        if (item.numberOfRooms) lines.push(`Rooms: ${s(item.numberOfRooms)}`)
        if (item.amenityFeature) {
          const amenities = (Array.isArray(item.amenityFeature) ? item.amenityFeature : [item.amenityFeature]) as Record<string, unknown>[]
          lines.push(`Amenities: ${amenities.map(a => s(a.name)).filter(Boolean).join(", ")}`)
        }
        if (item.hasMap) lines.push(`Map: ${s(item.hasMap)}`)
        if (lines.length > 1) sections.push("=== STRUCTURED DATA ===\n" + lines.join("\n"))
      }
    } catch { /* invalid JSON, skip */ }
  }

  // ── 2. Key meta tags ──
  const metaPhone = html.match(/<meta[^>]*(?:name|property)=["'](?:og:phone_number|business:contact_data:phone_number|phone)[^"']*["'][^>]*content=["']([^"']+)["']/i)
  const metaDesc = html.match(/<meta[^>]*(?:name|property)=["'](?:og:description|description)["'][^>]*content=["']([^"']+)["']/i)
  const metaEmail = html.match(/<meta[^>]*(?:name|property)=["'](?:og:email|email)["'][^>]*content=["']([^"']+)["']/i)
  if (metaPhone) sections.push(`Phone (meta): ${metaPhone[1]}`)
  if (metaEmail) sections.push(`Email (meta): ${metaEmail[1]}`)
  if (metaDesc) sections.push(`Description: ${metaDesc[1].slice(0, 200)}`)

  // ── 3. Plain text body ──
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num)))
    .replace(/\s+/g, " ").trim()
  sections.push(text)

  return sections.join("\n\n").slice(0, 8000)
}

// System prompt for ENRICH mode - adding columns to existing rows
const SCRAPER_ENRICH_PROMPT = `You are GridMind Scraper — a universal data enrichment agent. You add real data columns to existing spreadsheet rows for ANY type of query: businesses, places, schools, hotels, sports facilities, tourist attractions, companies, products, events, people, or anything else.

━━━ SOURCE SELECTION — choose the BEST source, do NOT default to searchWeb for physical places ━━━

■ PHYSICAL PLACES — restaurants, cafes, hotels, schools, gyms, hospitals, mosques, churches, museums, tourist attractions, cinemas, theatres, parks, sports centres, swimming pools, stadiums, zoos, libraries, shops, pharmacies, or ANY place that exists physically:
  → searchOpenStreetMap(placeType="...", location="...")
  → Works for EVERY city in the world — Dubai, London, Paris, New York, Lahore, Karachi, Riyadh, etc.

■ UK REGISTERED COMPANIES (any industry: ecommerce, software, marketing, retail, etc.)?
  → searchCompaniesHouse(query="keyword location")

■ NON-UK COMPANIES anywhere in the world?
  → searchOpenCorporates(query="keyword city", countryCode="xx")
  → ISO codes: ae=UAE, de=Germany, us=USA, au=Australia, in=India, ca=Canada, fr=France, sg=Singapore, pk=Pakistan, sa=Saudi Arabia, ng=Nigeria, za=South Africa

■ Rows already contain URLs?
  → scrapeWebPage(url) directly for each URL

■ Everything else — products, articles, statistics, news, people, online services?
  → searchWeb(query) to find the 3-5 best sources → scrapeWebPage(url) on each

━━━ WORKFLOW ━━━
1. Examine the row data — understand what entity type you are enriching
2. Pick the correct source from above
3. Run ALL tool calls first — collect complete data for all rows
4. Then return the final JSON

━━━ RULES ━━━
- NEVER invent or hallucinate data. Use only what tools return.
- Do NOT print fake tool calls like searchOpenStreetMap(...) in the response text. If a tool is needed, call the actual tool.
- N/A is a LAST RESORT — before writing N/A for Phone, Website, Email, Address, Hours, or Price you MUST first:
  1. If the entry has a website URL → scrapeWebPage(url) — phone/hours/price are usually in JSON-LD structured data on the page
  2. If no website → searchWeb("{name} {city} contact phone website opening hours") → scrapeWebPage the top result
  3. Only write N/A after both steps above genuinely returned nothing
- TARGET: less than 20% N/A across all cells. Many N/A values = you did not search enough.
- Be consistent across all rows
- Run tool calls in bulk — do not call one tool per row when one call covers all rows
- If scrapeWebPage returns success=false or a "blocked" error, skip that URL and try the next one — do NOT give up entirely

FINAL RESPONSE — output ONLY this JSON (no prose):
\`\`\`json
{
  "columns": [
    {
      "header": "Column Name",
      "values": [
        { "rowIndex": 0, "value": "extracted value" },
        { "rowIndex": 1, "value": "extracted value" }
      ]
    }
  ],
  "summary": "What was found and how many rows were enriched"
}
\`\`\`
rowIndex must match the original row indices.`

// System prompt for GENERATE mode - creating new table data from scratch
const SCRAPER_GENERATE_PROMPT = `You are GridMind Scraper — a universal data research agent. You find REAL data for any topic and build well-structured spreadsheet tables. Users can ask for ANYTHING: restaurants, schools, hotels, tourist places, sports clubs, ecommerce companies, hospitals, mosques, cinemas, universities, museums, parks, gyms, car dealers, or any other category worldwide.

━━━ SOURCE SELECTION — match the query type to the best source ━━━

■ ANY physical place in ANY city worldwide:
  → searchOpenStreetMap(placeType="...", location="...")
  → placeType examples: "restaurant", "school", "hotel", "mosque", "gym", "hospital", "museum", "tourist attraction", "cinema", "park", "sports centre", "swimming pool", "university", "library", "church", "pharmacy", "supermarket", "spa", "nightclub", "zoo", "stadium", "car dealership", "petrol station", "bakery", "hairdresser"
  → location examples: "Leeds", "Dubai", "Karachi", "Paris", "New York", "Riyadh"
  → This is the FIRST choice for ANY place-based query regardless of country

■ UK registered companies (ecommerce, software, retail, marketing, any industry)?
  → searchCompaniesHouse(query="keyword in city")
  → Example: "ecommerce Leeds", "software Manchester", "logistics Birmingham"

■ Non-UK companies (any country)?
  → searchOpenCorporates(query="keyword city", countryCode="xx")
  → ISO codes: ae=UAE, de=Germany, us=USA, au=Australia, in=India, ca=Canada, fr=France, sg=Singapore, nl=Netherlands, pk=Pakistan, sa=Saudi Arabia, tr=Turkey, id=Indonesia, my=Malaysia, ng=Nigeria, za=South Africa
  → Leave countryCode empty to search ALL countries

■ Online content, statistics, articles, products, rankings, news, anything not physical or registered:
  → searchWeb(query) → scrapeWebPage(url) for each of the top 3-5 results

━━━ EXECUTION ━━━
1. PLAN — state which tool you will use and why, then act immediately
2. RESEARCH — call ALL needed tools. For places: searchOpenStreetMap once. For companies: Companies House or OpenCorporates. For facts: Wikipedia first. For web data: try Serper → Brave → searchWeb in order.
3. FALLBACK — if first tool returns 0 results, immediately try the next best tool with a refined query
4. FILL GAPS — after the main data call, look for N/A values in key columns (Phone, Website, Email, Hours, Price, Rating):
   → Entries with a website URL: scrapeWebPage(website) — structured JSON-LD data on the page usually has phone/hours/price
   → Entries without a website: searchWeb("{name} {city} phone website contact") → scrapeWebPage the top result
   → Batch 3–5 entries per search round to stay efficient
5. OUTPUT — after gap-filling is done, return the final JSON table

━━━ RULES ━━━
- Only use REAL data from tool results — never fabricate rows, names, or addresses
- Do NOT print fake tool calls like searchOpenStreetMap(...) in the response text. If a tool is needed, call the actual tool.
- N/A is a LAST RESORT — for Phone, Website, Email, Address, Hours, or Price always attempt a follow-up web search before accepting N/A. Only write N/A if that search also fails.
- TARGET: less than 20% N/A across all cells. Too many N/A values means you stopped searching too early.
- Deduplicate results — each place/company appears only once
- Column names must match what the user asked for (e.g. "Phone", "Website", "Address", "Opening Hours", "Rating")
- If the user asks for 20 results and you got 35, include 20
- If a search tool returns an API key error, immediately fall back to the next search tool
- If scrapeWebPage returns success=false or blocked, move on to the next URL — never stop on a single blocked page

FINAL RESPONSE — output ONLY this JSON (no prose before or after):
\`\`\`json
{
  "table": {
    "headers": ["Name", "Address", "Phone", "Website", "Opening Hours"],
    "rows": [
      ["Example Place", "123 Main St, City", "+44 123 456", "example.com", "9am-9pm"],
      ["Another Place", "456 High St, City", "N/A", "N/A", "N/A"]
    ]
  },
  "summary": "Found X results for Y in Z"
}
\`\`\`
Headers and row values must be in the same order.\``

const scraperAgent = new ToolLoopAgent<
  ScraperAgentCallOptions,
  typeof SCRAPER_TOOLS,
  ReturnType<typeof Output.object>
>({
  id: "gridmind-scraper",
  model: SCRAPER_MODEL,
  providerOptions: SCRAPER_PROVIDER_OPTIONS,
  tools: SCRAPER_TOOLS,
  stopWhen: stepCountIs(40),
  output: Output.object({
    schema: ScraperAgentResultSchema,
    name: "scraper_result",
    description: "Structured JSON result for either table generation or row enrichment.",
  }),
  prepareStep: async ({ stepNumber }) => {
    // Some providers count the first step as 1 rather than 0.
    // Require a real tool call for the opening turn either way so the
    // agent cannot stop after returning a prose plan.
    if (stepNumber <= 1) {
      return { toolChoice: "required" }
    }

    return { toolChoice: "auto" }
  },
  callOptionsSchema: ScraperAgentCallOptionsSchema,
  prepareCall: async ({ options }) => {
    const {
      mode,
      prompt,
      tableInfo,
      chatHistory,
      selectedRows = [],
      existingColumns = [],
      businessContext,
    } = options

    if (mode === "generate") {
      return {
        model: SCRAPER_MODEL,
        instructions: SCRAPER_GENERATE_PROMPT,
        activeTools: GENERATE_ACTIVE_TOOLS,
        prompt: `User request: ${prompt}

Context:
- Project name: ${tableInfo.projectName}
- This is a NEW data generation request - the user wants you to search the web and create table data
${businessContext ? `\nBusiness context (about this user's company/ICP — tailor results to their target market):\n${businessContext}\n` : ""}
Recent chat context:
${formatChatHistory(chatHistory)}

Instructions:
1. Analyze what specific data the user is asking for
2. Search the web to find this information
3. Structure the data as a table with appropriate columns
4. Return real, scraped data - do not make up information

Please search, scrape, and return the data in the required JSON format.`,
      }
    }

    let rowContext = "Selected rows data:\n"
    for (const row of selectedRows) {
      rowContext += `\nRow ${row.rowIndex + 1}:\n`
      for (const [colIndex, value] of Object.entries(row.cells)) {
        const colNumber = parseInt(colIndex, 10)
        const colLabel = existingColumns[colNumber] || `Column ${colNumber + 1}`
        rowContext += `  ${colLabel}: "${value}"\n`
      }
    }

    return {
      model: SCRAPER_MODEL,
      instructions: SCRAPER_ENRICH_PROMPT,
      activeTools: ENRICH_ACTIVE_TOOLS,
      prompt: `User request: ${prompt}

Spreadsheet context:
- Project: ${tableInfo.projectName}
- Dimensions: ${tableInfo.numRows} rows × ${tableInfo.numCols} columns
- Existing columns: ${existingColumns.join(", ")}
${businessContext ? `\nBusiness context (about this user's company/ICP — use to enrich more relevantly):\n${businessContext}\n` : ""}
Recent chat context:
${formatChatHistory(chatHistory)}

${rowContext}

Please scrape the requested data and return it in the required JSON format.`,
    }
  },
})

export async function POST(request: NextRequest) {
  const body: ScraperRequest = await request.json()
  const { prompt, mode = "generate", chatHistory, selectedRows, existingColumns, tableInfo, businessContext } = body

  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      `data: ${JSON.stringify({ type: "error", content: "OpenAI API key not configured." })}\n\ndata: [DONE]\n\n`,
      { status: 200, headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" } }
    )
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`))

      try {
        if (mode === "generate" || !selectedRows || selectedRows.length === 0) {
          await streamGenerateMode(prompt, tableInfo, chatHistory, send, businessContext)
        } else {
          await streamEnrichMode(prompt, selectedRows, existingColumns || [], tableInfo, chatHistory, send, businessContext)
        }
      } catch (error) {
        console.error("Scraper API error:", error)
        send({ type: "error", content: error instanceof Error ? error.message : "Failed to process scraper request" })
      } finally {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  })
}

function sendStepUpdates(
  send: (obj: object) => void,
  toolCalls?: Array<{ toolName: string; input?: Record<string, string>; args?: Record<string, string> }>,
  toolResults?: Array<{ toolName: string; result?: Record<string, unknown>; output?: Record<string, unknown> }>
) {
  for (const tc of toolCalls || []) {
    const args = (tc.args ?? tc.input ?? {}) as Record<string, string>
    if (tc.toolName === "searchWeb") {
      send({ type: "thinking", content: `🔍 Searching web: "${args.query || "..."}"` })
    } else if (tc.toolName === "scrapeWebPage") {
      const short = (args.url || "").replace(/^https?:\/\//, "").slice(0, 70)
      send({ type: "thinking", content: `📄 Scraping: ${short}` })
    } else if (tc.toolName === "searchOpenStreetMap") {
      send({ type: "thinking", content: `🗺️ OpenStreetMap: "${args.placeType || ""}" in ${args.location || "..."}` })
    } else if (tc.toolName === "searchCompaniesHouse") {
      send({ type: "thinking", content: `🏢 Companies House: searching "${args.query || "..."}"` })
    } else if (tc.toolName === "searchOpenCorporates") {
      const cc = args.countryCode ? ` (${args.countryCode.toUpperCase()})` : " (worldwide)"
      send({ type: "thinking", content: `🌍 OpenCorporates: "${args.query || ""}\"${cc}` })
    }
  }

  for (const tr of toolResults || []) {
    const res = (tr.result ?? tr.output ?? {}) as Record<string, unknown>
    if (tr.toolName === "searchWeb" && Array.isArray(res.results) && res.results.length > 0) {
      const hits = res.results as { title: string; url: string }[]
      const preview = hits
        .slice(0, 3)
        .map((r, index) => `  ${index + 1}. ${(r.title?.slice(0, 50) || r.url)}\n     ${r.url}`)
        .join("\n")
      send({ type: "thinking", content: `✅ Web search found ${hits.length} result${hits.length === 1 ? "" : "s"}\n${preview}` })
    } else if (tr.toolName === "searchWeb" && Array.isArray(res.results) && res.results.length === 0) {
      send({ type: "thinking", content: "⚠️ Web search returned 0 results. Trying another route..." })
    } else if (tr.toolName === "scrapeWebPage") {
      const result = res as { success?: boolean; error?: string; url?: string; content?: string | null }
      const short = (result.url || "").replace(/^https?:\/\//, "").slice(0, 70)
      send({
        type: "thinking",
        content: result.success
          ? `✅ Scraped ${short || "page"}${result.content ? ` and extracted ${Math.min(result.content.length, 8000)} chars` : ""}`
          : `⚠️ Scrape failed for ${short || "page"}: ${result.error || "unknown"}`,
      })
    } else if (tr.toolName === "searchOpenStreetMap" && Array.isArray(res.results)) {
      const places = res.results as { name: string; address: string }[]
      const preview = places.slice(0, 4).map(p => `  • ${p.name}${p.address !== "N/A" ? " — " + p.address.slice(0, 40) : ""}`).join("\n")
      send({ type: "thinking", content: `✅ OpenStreetMap: ${places.length} places found\n${preview}${places.length > 4 ? `\n  ...+${places.length - 4} more` : ""}` })
    } else if (tr.toolName === "searchCompaniesHouse" && Array.isArray(res.results)) {
      const companies = res.results as { name: string; address: string }[]
      const preview = companies.slice(0, 4).map(c => `  • ${c.name}${c.address !== "N/A" ? " — " + c.address.slice(0, 35) : ""}`).join("\n")
      send({ type: "thinking", content: `✅ Companies House: ${companies.length} companies found\n${preview}${companies.length > 4 ? `\n  ...+${companies.length - 4} more` : ""}` })
    } else if (tr.toolName === "searchOpenCorporates" && Array.isArray(res.results)) {
      const companies = res.results as { name: string; country: string }[]
      const preview = companies.slice(0, 4).map(c => `  • ${c.name} (${c.country})`).join("\n")
      send({ type: "thinking", content: `✅ OpenCorporates: ${companies.length} companies found\n${preview}${companies.length > 4 ? `\n  ...+${companies.length - 4} more` : ""}` })
    }
  }
}

function previewValue(value: unknown, maxLength = 1200): string {
  try {
    const text = typeof value === "string" ? value : JSON.stringify(value, null, 2)
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
  } catch {
    return String(value)
  }
}

function coerceToObject(value: unknown): unknown {
  if (typeof value === "string") {
    const trimmed = value.trim()
    const codeBlock = trimmed.match(/```json\s*([\s\S]*?)```/i)
    const candidate = codeBlock ? codeBlock[1].trim() : trimmed
    try {
      return JSON.parse(candidate)
    } catch {
      return value
    }
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>
    if ("result" in record) return coerceToObject(record.result)
    if ("output" in record) return coerceToObject(record.output)
    if ("data" in record) return coerceToObject(record.data)
  }

  return value
}

const COUNT_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  fifteen: 15,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
}

function extractRequestedCount(prompt: string): number {
  const numericMatch = prompt.match(/\b(\d{1,3})\b/)
  if (numericMatch) return Math.max(1, Math.min(parseInt(numericMatch[1], 10), 50))

  const lower = prompt.toLowerCase()
  for (const [word, count] of Object.entries(COUNT_WORDS)) {
    if (lower.includes(` ${word} `) || lower.startsWith(`${word} `) || lower.endsWith(` ${word}`)) {
      return count
    }
  }

  return 10
}

function inferPlaceType(prompt: string): string | null {
  const lower = prompt.toLowerCase()
  if (/\bcar\s+(?:showrooms?|dealers?|dealerships?)\b/.test(lower)) {
    return "car dealership"
  }

  const types = [
    "school",
    "college",
    "university",
    "restaurant",
    "hotel",
    "hospital",
    "mosque",
    "gym",
    "cinema",
    "park",
    "museum",
    "library",
    "pharmacy",
    "supermarket",
    "bakery",
    "stadium",
    "swimming pool",
    "sports centre",
    "tourist attraction",
  ]

  return types.find((type) => lower.includes(type)) || null
}

function inferLocation(prompt: string): string | null {
  const lower = prompt.toLowerCase()
  const inMatch = lower.match(/\b(?:in|at|near)\s+([a-z][a-z\s-]{1,60}?)(?=\s+(?:according to|based on|by|with|for|from|using|on)\b|[,.]|$)/i)
  if (inMatch) {
    const location = inMatch[1]
      .replace(/\b(with|for|from)\b.*$/i, "")
      .trim()
      .replace(/\s+/g, " ")

    const knownLocationTypos: Record<string, string> = {
      faisalbafd: "Faisalabad",
    }
    return knownLocationTypos[location.toLowerCase()] || location
  }

  return null
}

async function runOpenStreetMapFallback(placeType: string, location: string, maxResults: number) {
  const osmTool = searchOpenStreetMap as unknown as {
    execute: (input: { placeType: string; location: string; maxResults?: number }) => Promise<{
      results?: Array<Record<string, string>>
      error?: string
    }>
  }

  return osmTool.execute({ placeType, location, maxResults })
}

function buildSearchFallbackQueries(prompt: string): string[] {
  const placeType = inferPlaceType(prompt)
  const location = inferLocation(prompt)
  const queries = [prompt.trim()]

  if (placeType && location) {
    queries.push(`best ${placeType}s in ${location} google rating`)
    queries.push(`${placeType}s in ${location} official websites`)
    queries.push(`${placeType}s in ${location}`)
  }

  return Array.from(new Set(queries.filter(Boolean))).slice(0, 4)
}

async function trySearchBackedGenerateFallback(
  prompt: string,
  send: (obj: object) => void
): Promise<{ table: GeneratedTable; summary: string } | null> {
  const requestedCount = extractRequestedCount(prompt)
  const searchTool = searchWeb as unknown as {
    execute: (input: { query: string; context?: string }) => Promise<{
      results?: Array<{ title: string; snippet: string; url: string }>
    }>
  }
  const scrapeTool = scrapeWebPage as unknown as {
    execute: (input: { url: string; extractionHint?: string }) => Promise<{
      content?: string | null
      success?: boolean
    }>
  }

  const searchQueries = buildSearchFallbackQueries(prompt)
  const aggregatedResults: Array<{ title: string; snippet: string; url: string }> = []
  const seenUrls = new Set<string>()

  send({ type: "thinking", content: "🛟 Fallback: searching and structuring results directly" })

  for (const query of searchQueries) {
    const searchResult = await searchTool.execute({
      query,
      context: "Find trustworthy sources that help answer this table-generation request",
    })

    for (const result of searchResult.results || []) {
      if (!result.url || seenUrls.has(result.url)) continue
      seenUrls.add(result.url)
      aggregatedResults.push(result)
    }

    if (aggregatedResults.length >= Math.max(5, requestedCount)) break
  }

  if (aggregatedResults.length === 0) return null

  const contextChunks: string[] = []
  for (const result of aggregatedResults.slice(0, 5)) {
    contextChunks.push(`Source: ${result.title}\nURL: ${result.url}\nSnippet: ${result.snippet || "N/A"}`)
    const scraped = await scrapeTool.execute({
      url: result.url,
      extractionHint: prompt,
    })

    if (scraped.success && scraped.content) {
      contextChunks.push(`Page content:\n${scraped.content.slice(0, 3000)}`)
    }
  }

  try {
    const structuredResult = await generateText({
      model: SCRAPER_MODEL,
      providerOptions: SCRAPER_PROVIDER_OPTIONS,
      output: Output.object({
        schema: GenerateAgentResultSchema,
        name: "search_fallback_table",
        description: "A table structured only from the supplied search evidence.",
      }),
      system: [
        "You are a data structuring tool.",
        "Use ONLY the supplied search snippets and scraped page text.",
        "Return ONLY valid JSON matching the requested schema.",
        "Do not include prose, markdown, or explanations.",
        "If a field is not available in the evidence, use N/A.",
        `Return at most ${requestedCount} rows.`,
      ].join(" "),
      prompt: `User request: ${prompt}

Evidence:
${contextChunks.join("\n\n---\n\n")}

Return JSON in exactly this shape:
{
  "table": {
    "headers": ["Name", "Address", "Rating", "Website"],
    "rows": [
      ["Example", "Address or N/A", "4.5/5 or N/A", "https://example.com or N/A"]
    ]
  },
  "summary": "Short summary"
}`,
    })

    const parsed = parseGenerateOutput(structuredResult.output) ?? parseGenerateResult(structuredResult.text)
    if (parsed) return parsed
  } catch (error) {
    console.warn("[Scraper] Structured search fallback failed; using deterministic search rows", error)
  }

  // A model/provider can still fail to emit structured output in production.
  // Search results are already structured, so return a useful evidence table
  // instead of surfacing a parser error to the user.
  const rows = aggregatedResults.slice(0, requestedCount).map((result) => [
    result.title || "N/A",
    result.url,
    result.snippet || "N/A",
  ])

  return rows.length > 0
    ? {
        table: { headers: ["Name", "Website", "Source Summary"], rows },
        summary: `Found ${rows.length} web results relevant to the request.`,
      }
    : null
}

async function trySimpleWebSearchLastRetry(
  prompt: string,
  send: (obj: object) => void
): Promise<{ table: GeneratedTable; summary: string } | null> {
  const searchTool = searchWeb as unknown as {
    execute: (input: { query: string; context?: string }) => Promise<{
      results?: Array<{ title: string; snippet: string; url: string }>
    }>
  }

  send({ type: "thinking", content: "🔄 Final retry: running one simple web search" })

  const searchResult = await searchTool.execute({ query: prompt })
  const requestedCount = extractRequestedCount(prompt)
  const seenUrls = new Set<string>()
  const results = (searchResult.results || [])
    .filter((result) => {
      if (!result.url || seenUrls.has(result.url)) return false
      seenUrls.add(result.url)
      return true
    })
    .slice(0, requestedCount)

  if (results.length === 0) return null

  return {
    table: {
      headers: ["Name", "Website", "Source Summary"],
      rows: results.map((result) => [
        result.title || "N/A",
        result.url,
        result.snippet || "N/A",
      ]),
    },
    summary: `The normal scraping methods found no structured data. A final simple web search returned ${results.length} result${results.length === 1 ? "" : "s"}.`,
  }
}

async function tryDirectGenerateFallback(prompt: string, send: (obj: object) => void): Promise<{ table: GeneratedTable; summary: string } | null> {
  const placeType = inferPlaceType(prompt)
  const location = inferLocation(prompt)

  if (!placeType || !location) return null

  const requestedCount = extractRequestedCount(prompt)
  send({ type: "thinking", content: `🛟 Fallback: directly searching ${placeType} in ${location}` })

  const result = await runOpenStreetMapFallback(placeType, location, Math.min(Math.max(requestedCount * 2, requestedCount), 40))
  const rows = (result.results || []).slice(0, requestedCount)

  if (rows.length === 0) return null

  const headers = ["Name", "Address", "Phone", "Website", "Opening Hours"]
  return {
    table: {
      headers,
      rows: rows.map((row) => [
        row.name || "N/A",
        row.address || "N/A",
        row.phone || "N/A",
        row.website || "N/A",
        row.openingHours || "N/A",
      ]),
    },
    summary: `Found ${Math.min(rows.length, requestedCount)} ${placeType}${rows.length === 1 ? "" : "s"} in ${location} using OpenStreetMap fallback.`,
  }
}

function normalizeWebsite(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(trimmed)) return `https://${trimmed}`
  return null
}

function extractBestRowField(
  row: NonNullable<ScraperRequest["selectedRows"]>[number],
  existingColumns: string[],
  matchers: RegExp[]
): string | null {
  for (const [colIndex, value] of Object.entries(row.cells)) {
    const header = (existingColumns[parseInt(colIndex, 10)] || "").toLowerCase()
    if (matchers.some((matcher) => matcher.test(header)) && value.trim()) {
      return value.trim()
    }
  }
  return null
}

function extractFallbackWebsite(
  row: NonNullable<ScraperRequest["selectedRows"]>[number],
  existingColumns: string[]
): string | null {
  const websiteField = extractBestRowField(row, existingColumns, [/website/, /\burl\b/, /domain/])
  if (websiteField) return normalizeWebsite(websiteField)

  for (const value of Object.values(row.cells)) {
    const normalized = normalizeWebsite(value)
    if (normalized) return normalized
  }

  return null
}

function extractFallbackName(
  row: NonNullable<ScraperRequest["selectedRows"]>[number],
  existingColumns: string[]
): string {
  const namedField = extractBestRowField(row, existingColumns, [/\bname\b/, /hotel/, /title/, /company/, /business/])
  if (namedField) return namedField

  return Object.values(row.cells).find(value => value.trim().length > 0) || `Row ${row.rowIndex + 1}`
}

function extractFallbackLocation(
  row: NonNullable<ScraperRequest["selectedRows"]>[number],
  existingColumns: string[]
): string {
  return extractBestRowField(row, existingColumns, [/city/, /location/, /address/, /country/, /region/]) || ""
}

function extractLabeledValue(content: string, label: string): string {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const match = content.match(new RegExp(`${escaped}:\\s*([^\\n]+)`, "i"))
  return match?.[1]?.trim() || "N/A"
}

function parseScrapedDetails(content: string, fallbackWebsite: string): Record<string, string> {
  const email = extractLabeledValue(content, "Email")
  const detectedEmail = content.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0]

  return {
    Website: extractLabeledValue(content, "Website") !== "N/A" ? extractLabeledValue(content, "Website") : fallbackWebsite,
    Phone: extractLabeledValue(content, "Phone"),
    Email: email !== "N/A" ? email : detectedEmail || "N/A",
    Address: extractLabeledValue(content, "Address"),
    "Opening Hours": extractLabeledValue(content, "Opening Hours"),
  }
}

function getRequestedEnrichmentHeaders(prompt: string): string[] {
  const requested: string[] = []
  if (/\bwebsite(?:s)?|\bdomain(?:s)?|\burl(?:s)?/i.test(prompt)) requested.push("Website")
  if (/\bphone(?:s| numbers?)?|\btelephone(?:s)?/i.test(prompt)) requested.push("Phone")
  if (/\bemail(?:s| addresses?)?/i.test(prompt)) requested.push("Email")
  if (/\baddress(?:es)?|\blocation(?:s)?/i.test(prompt)) requested.push("Address")
  if (/\bopening hours|\bbusiness hours|\bworking hours/i.test(prompt)) requested.push("Opening Hours")
  return requested.length > 0 ? requested : ["Website", "Phone", "Email", "Address", "Opening Hours"]
}

async function findWebsiteForRow(
  row: NonNullable<ScraperRequest["selectedRows"]>[number],
  existingColumns: string[]
): Promise<string | null> {
  const existingWebsite = extractFallbackWebsite(row, existingColumns)
  if (existingWebsite) return existingWebsite

  const searchTool = searchWeb as unknown as {
    execute: (input: { query: string; context?: string }) => Promise<{
      results?: Array<{ url: string }>
    }>
  }

  const name = extractFallbackName(row, existingColumns)
  const location = extractFallbackLocation(row, existingColumns)
  const searchResult = await searchTool.execute({
    query: `${name} ${location} official website`,
    context: "Find the official website for this business or place",
  })

  return normalizeWebsite(searchResult.results?.[0]?.url || "")
}

async function tryDirectEnrichFallback(
  prompt: string,
  selectedRows: NonNullable<ScraperRequest["selectedRows"]>,
  existingColumns: string[],
  send: (obj: object) => void
): Promise<{ columns: ScrapedColumn[]; summary: string } | null> {
  const scrapeTool = scrapeWebPage as unknown as {
    execute: (input: { url: string; extractionHint?: string }) => Promise<{
      content?: string | null
      success?: boolean
    }>
  }

  send({ type: "thinking", content: "🛟 Fallback: enriching directly from selected row websites" })

  const columnsMap = new Map<string, { rowIndex: number; value: string }[]>()
  const headers = getRequestedEnrichmentHeaders(prompt)
  for (const header of headers) columnsMap.set(header, [])

  let enrichedCount = 0

  for (const row of selectedRows) {
    const website = await findWebsiteForRow(row, existingColumns)
    if (!website) {
      for (const header of headers) columnsMap.get(header)!.push({ rowIndex: row.rowIndex, value: "N/A" })
      continue
    }

    const scraped = await scrapeTool.execute({
      url: website,
      extractionHint: `${prompt}. Focus on phone, email, address, opening hours, and official website.`,
    })

    const details = parseScrapedDetails(scraped.content || "", website)
    for (const header of headers) {
      columnsMap.get(header)!.push({ rowIndex: row.rowIndex, value: details[header] || "N/A" })
    }
    enrichedCount += 1
  }

  return {
    columns: headers.map((header) => ({ header, values: columnsMap.get(header)! })),
    summary: `Enriched ${enrichedCount} row(s) using direct website scraping fallback.`,
  }
}

function parseGenerateResult(responseText: string): { table: GeneratedTable; summary: string } | null {
  const trimmed = responseText.trim()
  if (!trimmed || !trimmed.includes("{")) return null

  try {
    const codeBlock = trimmed.match(/```json\s*([\s\S]*?)```/i)
    if (codeBlock) return JSON.parse(codeBlock[1].trim())

    const jsonMatch = trimmed.match(/\{[\s\S]*"table"\s*:[\s\S]*"headers"[\s\S]*"rows"[\s\S]*\}/)
    if (jsonMatch) return JSON.parse(jsonMatch[0])

    const parsed = JSON.parse(trimmed)
    if (parsed.table?.headers && parsed.table?.rows) return parsed
  } catch (e) {
    console.error("[Scraper] JSON parse error:", e)
  }

  return null
}

function parseGenerateOutput(outputValue: unknown): { table: GeneratedTable; summary: string } | null {
  const parsed = GenerateAgentResultSchema.safeParse(coerceToObject(outputValue))
  if (!parsed.success) return null
  return {
    table: parsed.data.table,
    summary: parsed.data.summary || "Data generated successfully",
  }
}

function parseEnrichResult(responseText: string): { columns: ScrapedColumn[]; summary: string } | null {
  const trimmed = responseText.trim()
  if (!trimmed || !trimmed.includes("{")) return null

  try {
    const codeBlock = trimmed.match(/```json\s*([\s\S]*?)```/i)
    if (codeBlock) return JSON.parse(codeBlock[1].trim())

    const jsonMatch = trimmed.match(/\{[\s\S]*"columns"\s*:\s*\[[\s\S]*\][\s\S]*\}/)
    if (jsonMatch) return JSON.parse(jsonMatch[0])

    const parsed = JSON.parse(trimmed)
    if (parsed.columns && Array.isArray(parsed.columns)) return parsed
  } catch (e) {
    console.error("[Scraper] JSON parse error:", e)
  }

  return null
}

function parseEnrichOutput(outputValue: unknown): { columns: ScrapedColumn[]; summary: string } | null {
  const parsed = EnrichAgentResultSchema.safeParse(coerceToObject(outputValue))
  if (!parsed.success) return null
  return {
    columns: parsed.data.columns,
    summary: parsed.data.summary || "Data enrichment complete",
  }
}

// GENERATE mode — streams thinking events then emits final result
async function streamGenerateMode(
  prompt: string,
  tableInfo: ScraperRequest["tableInfo"],
  chatHistory: ScraperRequest["chatHistory"],
  send: (obj: object) => void,
  businessContext?: string
) {
  console.log("[Scraper] Starting GENERATE mode with prompt:", prompt)
  send({ type: "thinking", content: "🔍 Analyzing your request..." })

  const result = await scraperAgent.generate({
    prompt,
    options: {
      mode: "generate",
      prompt,
      tableInfo,
      chatHistory,
      businessContext,
    },
    onStepFinish: ({ toolCalls, toolResults }) => {
      sendStepUpdates(
        send,
        toolCalls as Array<{ toolName: string; input?: Record<string, string>; args?: Record<string, string> }> | undefined,
        toolResults as Array<{ toolName: string; result?: Record<string, unknown>; output?: Record<string, unknown> }> | undefined
      )
    },
  })

  console.log("[Scraper] Generate steps:", result.steps.length)
  send({ type: "thinking", content: "📊 Processing and structuring data..." })

  const generatedData = parseGenerateOutput(result.output) ?? parseGenerateResult(result.text)

  if (!generatedData?.table) {
    console.error("[Scraper] Generate parse failed", {
      outputPreview: previewValue(result.output),
      textPreview: previewValue(result.text),
    })

    const fallbackData = await tryDirectGenerateFallback(prompt, send)
      ?? await trySearchBackedGenerateFallback(prompt, send)
      ?? await trySimpleWebSearchLastRetry(prompt, send)
    if (!fallbackData?.table) {
      send({ type: "error", content: "Failed to parse structured data from agent response." })
      return
    }

    send({
      type: "result",
      data: {
        success: true,
        mode: "generate",
        table: fallbackData.table,
        summary: fallbackData.summary,
        steps: result.steps.length,
      },
    })
    return
  }

  send({
    type: "thinking",
    content: `📝 Writing ${generatedData.table.rows.length} row${generatedData.table.rows.length === 1 ? "" : "s"} and ${generatedData.table.headers.length} column${generatedData.table.headers.length === 1 ? "" : "s"} to the sheet...`,
  })

  send({
    type: "result",
    data: {
      success: true,
      mode: "generate",
      table: generatedData.table,
      summary: generatedData.summary || "Data generated successfully",
      steps: result.steps.length,
    },
  })
}

// ENRICH mode — streams thinking events then emits final result
async function streamEnrichMode(
  prompt: string,
  selectedRows: ScraperRequest["selectedRows"],
  existingColumns: string[],
  tableInfo: ScraperRequest["tableInfo"],
  chatHistory: ScraperRequest["chatHistory"],
  send: (obj: object) => void,
  businessContext?: string
) {
  console.log("[Scraper] Starting ENRICH mode with prompt:", prompt)
  send({ type: "thinking", content: `🔍 Enriching ${selectedRows!.length} row(s)...` })

  const result = await scraperAgent.generate({
    prompt,
    options: {
      mode: "enrich",
      prompt,
      selectedRows,
      existingColumns,
      tableInfo,
      chatHistory,
      businessContext,
    },
    onStepFinish: ({ toolCalls, toolResults }) => {
      sendStepUpdates(
        send,
        toolCalls as Array<{ toolName: string; input?: Record<string, string>; args?: Record<string, string> }> | undefined,
        toolResults as Array<{ toolName: string; result?: Record<string, unknown>; output?: Record<string, unknown> }> | undefined
      )
    },
  })

  console.log("[Scraper] Enrich steps:", result.steps.length)
  send({ type: "thinking", content: "📋 Building column data..." })

  const scrapedData = parseEnrichOutput(result.output) ?? parseEnrichResult(result.text)

  if (!scrapedData?.columns?.length) {
    console.error("[Scraper] Enrich parse failed", {
      outputPreview: previewValue(result.output),
      textPreview: previewValue(result.text),
    })

    const fallbackData = await tryDirectEnrichFallback(prompt, selectedRows!, existingColumns, send)
    if (!fallbackData?.columns?.length) {
      send({ type: "error", content: "Failed to parse structured data from agent response." })
      return
    }

    send({
      type: "result",
      data: {
        success: true,
        mode: "enrich",
        columns: fallbackData.columns,
        summary: fallbackData.summary,
        steps: result.steps.length,
      },
    })
    return
  }

  send({
    type: "thinking",
    content: `📝 Writing ${scrapedData.columns.length} new column${scrapedData.columns.length === 1 ? "" : "s"} into the sheet...`,
  })

  send({
    type: "result",
    data: {
      success: true,
      mode: "enrich",
      columns: scrapedData.columns,
      summary: scrapedData.summary || "Data enrichment complete",
      steps: result.steps.length,
    },
  })
}

function formatChatHistory(chatHistory?: ScraperRequest["chatHistory"]): string {
  if (!chatHistory || chatHistory.length === 0) return "No prior conversation context."
  const recent = chatHistory
    .filter((msg) => (msg.role === "user" || msg.role === "assistant") && msg.content.trim().length > 0)
    .slice(-12)
  if (recent.length === 0) return "No prior conversation context."
  return recent.map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`).join("\n")
}
