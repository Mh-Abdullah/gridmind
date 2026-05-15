import { NextRequest } from "next/server"
import { generateText, tool, stepCountIs } from "ai"
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

      // Step 3: Query Overpass API (free OSM data service)
      const overpassQuery = `[out:json][timeout:30];(nwr${tagFilter}(${bbox}););out body center ${maxResults};`
      const overpassRes = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(overpassQuery)}`,
        signal: AbortSignal.timeout(30000),
      })
      if (!overpassRes.ok) return { error: `Overpass API error: HTTP ${overpassRes.status}`, results: [] }

      type OsmElement = { tags?: Record<string, string> }
      const data = await overpassRes.json() as { elements: OsmElement[] }

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

// Helper function to extract text from HTML
function extractTextFromHTML(html: string): string {
  // Remove script and style tags
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
  
  // Remove HTML tags but keep content
  text = text.replace(/<[^>]+>/g, " ")
  
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, " ")
  text = text.replace(/&amp;/g, "&")
  text = text.replace(/&lt;/g, "<")
  text = text.replace(/&gt;/g, ">")
  text = text.replace(/&quot;/g, '"')
  text = text.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num)))
  
  // Clean up whitespace
  text = text.replace(/\s+/g, " ").trim()
  
  return text
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
- If a value is not found, use "N/A"
- Be consistent across all rows
- Run tool calls in bulk — do not call one tool per row when one call covers all rows
- If scrapeWebPage returns success=false or a "blocked" error, skip that URL and try the next one from searchWeb results — do NOT give up entirely

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
1. ANNOUNCE — output the plan as the FIRST thinking step: which tool, what query, why
2. RESEARCH — call ALL needed tools. For places, call searchOpenStreetMap once per place type + location. Collect as many rows as the user asked for.
3. OUTPUT — after ALL tools have run, return the complete JSON table

━━━ RULES ━━━
- Only use REAL data from tool results — never fabricate rows, names, or addresses
- If a field is unavailable, use "N/A"
- Deduplicate results — each place/company appears only once
- Column names must match what the user asked for (e.g. "Phone", "Website", "Address", "Opening Hours", "Rating")
- If the user asks for 20 results and you got 35, include 20
- If scrapeWebPage returns success=false or a "blocked" error for a URL, move on to the next URL from searchWeb — never stop on a single blocked page

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

export async function POST(request: NextRequest) {
  const body: ScraperRequest = await request.json()
  const { prompt, mode = "generate", chatHistory, selectedRows, existingColumns, tableInfo } = body

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
          await streamGenerateMode(prompt, tableInfo, chatHistory, send)
        } else {
          await streamEnrichMode(prompt, selectedRows, existingColumns || [], tableInfo, chatHistory, send)
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

// GENERATE mode — streams thinking events then emits final result
async function streamGenerateMode(
  prompt: string,
  tableInfo: ScraperRequest["tableInfo"],
  chatHistory: ScraperRequest["chatHistory"],
  send: (obj: object) => void
) {
  console.log("[Scraper] Starting GENERATE mode with prompt:", prompt)
  send({ type: "thinking", content: "🔍 Analyzing your request..." })

  const result = await generateText({
    model: openai("gpt-4o-mini"),
    system: SCRAPER_GENERATE_PROMPT,
    prompt: `User request: ${prompt}

Context:
- Project name: ${tableInfo.projectName}
- This is a NEW data generation request - the user wants you to search the web and create table data

Recent chat context:
${formatChatHistory(chatHistory)}

Instructions:
1. Analyze what specific data the user is asking for
2. Search the web to find this information
3. Structure the data as a table with appropriate columns
4. Return real, scraped data - do not make up information

Please search, scrape, and return the data in the required JSON format.`,
    tools: { scrapeWebPage, searchWeb, searchOpenStreetMap, searchCompaniesHouse, searchOpenCorporates },
    stopWhen: stepCountIs(20),
    onStepFinish: ({ toolCalls, toolResults }) => {
      for (const tc of toolCalls || []) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tcAny = tc as any
        const args = (tcAny.args ?? tcAny.input ?? {}) as Record<string, string>
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const trAny = tr as any
        const res = (trAny.result ?? trAny.output ?? {}) as Record<string, unknown>
        if (tr.toolName === "searchWeb" && Array.isArray(res.results) && res.results.length > 0) {
          const hits = res.results as { title: string; url: string }[]
          const preview = hits.slice(0, 3).map(r => `  • ${r.title?.slice(0, 55) || r.url}`).join("\n")
          send({ type: "thinking", content: `✅ Web: ${hits.length} sources found\n${preview}` })
        } else if (tr.toolName === "scrapeWebPage") {
          const r = res as { success?: boolean; error?: string }
          send({ type: "thinking", content: r.success ? `✅ Scraped page successfully` : `⚠️ Scrape failed: ${r.error || "unknown"}` })
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
    },
  })

  console.log("[Scraper] Generate steps:", result.steps.length)
  send({ type: "thinking", content: "📊 Processing and structuring data..." })

  const responseText = result.text
  let generatedData: { table: GeneratedTable; summary: string } | null = null

  try {
    const codeBlock = responseText.match(/```json\s*([\s\S]*?)```/)
    if (codeBlock) generatedData = JSON.parse(codeBlock[1].trim())
    if (!generatedData) {
      const jsonMatch = responseText.match(/\{[\s\S]*"table"\s*:[\s\S]*"headers"[\s\S]*"rows"[\s\S]*\}/)
      if (jsonMatch) generatedData = JSON.parse(jsonMatch[0])
    }
    if (!generatedData) {
      const parsed = JSON.parse(responseText)
      if (parsed.table?.headers && parsed.table?.rows) generatedData = parsed
    }
  } catch (e) {
    console.error("[Scraper] JSON parse error:", e)
  }

  if (!generatedData?.table) {
    send({ type: "error", content: "Failed to parse structured data from agent response." })
    return
  }

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
  send: (obj: object) => void
) {
  console.log("[Scraper] Starting ENRICH mode with prompt:", prompt)
  send({ type: "thinking", content: `🔍 Enriching ${selectedRows!.length} row(s)...` })

  let rowContext = "Selected rows data:\n"
  for (const row of selectedRows!) {
    rowContext += `\nRow ${row.rowIndex + 1}:\n`
    for (const [colIndex, value] of Object.entries(row.cells)) {
      const colLabel = existingColumns[parseInt(colIndex)] || `Column ${parseInt(colIndex) + 1}`
      rowContext += `  ${colLabel}: "${value}"\n`
    }
  }

  const result = await generateText({
    model: openai("gpt-4o-mini"),
    system: SCRAPER_ENRICH_PROMPT,
    prompt: `User request: ${prompt}

Spreadsheet context:
- Project: ${tableInfo.projectName}
- Dimensions: ${tableInfo.numRows} rows × ${tableInfo.numCols} columns
- Existing columns: ${existingColumns.join(", ")}

Recent chat context:
${formatChatHistory(chatHistory)}

${rowContext}

Please scrape the requested data and return it in the required JSON format.`,
    tools: { scrapeWebPage, searchWeb, searchOpenStreetMap, searchCompaniesHouse, searchOpenCorporates, extractFromRowData },
    stopWhen: stepCountIs(20),
    onStepFinish: ({ toolCalls, toolResults }) => {
      for (const tc of toolCalls || []) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tcAny = tc as any
        const args = (tcAny.args ?? tcAny.input ?? {}) as Record<string, string>
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const trAny = tr as any
        const res = (trAny.result ?? trAny.output ?? {}) as Record<string, unknown>
        if (tr.toolName === "searchWeb" && Array.isArray(res.results) && res.results.length > 0) {
          const hits = res.results as { title: string; url: string }[]
          const preview = hits.slice(0, 3).map(r => `  • ${r.title?.slice(0, 55) || r.url}`).join("\n")
          send({ type: "thinking", content: `✅ Web: ${hits.length} sources found\n${preview}` })
        } else if (tr.toolName === "scrapeWebPage") {
          const r = res as { success?: boolean; error?: string }
          send({ type: "thinking", content: r.success ? `✅ Scraped page successfully` : `⚠️ Scrape failed: ${r.error || "unknown"}` })
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
    },
  })

  console.log("[Scraper] Enrich steps:", result.steps.length)
  send({ type: "thinking", content: "📋 Building column data..." })

  const responseText = result.text
  let scrapedData: { columns: ScrapedColumn[]; summary: string } | null = null

  try {
    const codeBlock = responseText.match(/```json\s*([\s\S]*?)```/)
    if (codeBlock) scrapedData = JSON.parse(codeBlock[1].trim())
    if (!scrapedData) {
      const jsonMatch = responseText.match(/\{[\s\S]*"columns"\s*:\s*\[[\s\S]*\][\s\S]*\}/)
      if (jsonMatch) scrapedData = JSON.parse(jsonMatch[0])
    }
    if (!scrapedData) {
      const parsed = JSON.parse(responseText)
      if (parsed.columns && Array.isArray(parsed.columns)) scrapedData = parsed
    }
  } catch (e) {
    console.error("[Scraper] JSON parse error:", e)
  }

  if (!scrapedData?.columns?.length) {
    send({ type: "error", content: "Failed to parse structured data from agent response." })
    return
  }

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
