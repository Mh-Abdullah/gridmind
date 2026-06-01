import { NextRequest, NextResponse } from "next/server"

const BUSINESS_TYPE_MAP: Record<string, { key: string; value: string }> = {
  restaurant: { key: "amenity", value: "restaurant" },
  cafe: { key: "amenity", value: "cafe" },
  bar: { key: "amenity", value: "bar" },
  hotel: { key: "tourism", value: "hotel" },
  shop: { key: "shop", value: "" }, // wildcard — any shop
  supermarket: { key: "shop", value: "supermarket" },
  pharmacy: { key: "amenity", value: "pharmacy" },
  clinic: { key: "amenity", value: "clinic" },
  bank: { key: "amenity", value: "bank" },
  gym: { key: "leisure", value: "fitness_centre" },
  salon: { key: "shop", value: "hairdresser" },
  school: { key: "amenity", value: "school" },
  fuel: { key: "amenity", value: "fuel" },
  bakery: { key: "shop", value: "bakery" },
  dentist: { key: "amenity", value: "dentist" },
}

async function geocode(location: string): Promise<{ lat: number; lng: number; displayName: string } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
    const res = await fetch(url, {
      headers: { "User-Agent": "GridMind/1.0 (gridmind.app)" },
    })
    if (!res.ok) return null
    const data = await res.json()
    if (!data.length) return null
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    }
  } catch {
    return null
  }
}

function buildOverpassQuery(
  lat: number,
  lng: number,
  radiusMeters: number,
  type: string,
  text: string,
  searchMode: string,
  maxResults: number
): string | null {
  const around = `(around:${radiusMeters},${lat},${lng})`

  if (searchMode === "text" && text.trim()) {
    const safeText = text.replace(/["\\/]/g, "")
    return `[out:json][timeout:25];(node["name"~"${safeText}",i]${around};way["name"~"${safeText}",i]${around};);out body center ${maxResults};`
  }

  const typeInfo = BUSINESS_TYPE_MAP[type]
  if (!typeInfo) return null

  const tag = typeInfo.value
    ? `["${typeInfo.key}"="${typeInfo.value}"]`
    : `["${typeInfo.key}"]`

  return `[out:json][timeout:25];(node${tag}${around};way${tag}${around};);out body center ${maxResults};`
}

// POST: geocode a location name → lat/lng
export async function POST(req: NextRequest) {
  try {
    const { location } = await req.json()
    if (!location?.trim()) {
      return NextResponse.json({ error: "Location required" }, { status: 400 })
    }
    const coords = await geocode(location.trim())
    if (!coords) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }
    return NextResponse.json(coords)
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

// GET: search businesses
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const lat = parseFloat(searchParams.get("lat") || "")
    const lng = parseFloat(searchParams.get("lng") || "")
    const radiusKm = Math.min(parseFloat(searchParams.get("radiusKm") || "1"), 20)
    const type = searchParams.get("type") || "restaurant"
    const text = searchParams.get("text") || ""
    const searchMode = searchParams.get("searchMode") || "type"
    const maxResults = Math.min(parseInt(searchParams.get("maxResults") || "10"), 50)

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: "lat and lng are required" }, { status: 400 })
    }

    const radiusMeters = radiusKm * 1000
    const query = buildOverpassQuery(lat, lng, radiusMeters, type, text, searchMode, maxResults)
    if (!query) {
      return NextResponse.json({ error: "Invalid business type" }, { status: 400 })
    }

    const overpassRes = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
      headers: { "Content-Type": "text/plain" },
      signal: AbortSignal.timeout(30000),
    })

    if (!overpassRes.ok) {
      return NextResponse.json({ error: "Overpass API error" }, { status: 502 })
    }

    const overpassData = await overpassRes.json()

    const businesses = (overpassData.elements as Record<string, unknown>[])
      .filter((el) => (el.tags as Record<string, string>)?.name)
      .slice(0, maxResults)
      .map((el) => {
        const tags = (el.tags as Record<string, string>) || {}
        const elLat = (el.lat as number) ?? (el.center as Record<string, number>)?.lat
        const elLng = (el.lon as number) ?? (el.center as Record<string, number>)?.lon

        const addrParts = [
          tags["addr:housenumber"],
          tags["addr:street"],
          tags["addr:city"],
          tags["addr:postcode"],
          tags["addr:country"],
        ].filter(Boolean)

        return {
          name: tags.name || "",
          address: addrParts.join(", "),
          phone: tags.phone || tags["contact:phone"] || "",
          website: tags.website || tags["contact:website"] || tags.url || "",
          category: tags.amenity || tags.shop || tags.tourism || tags.leisure || "",
          openingHours: tags.opening_hours || "",
          lat: elLat ?? null,
          lng: elLng ?? null,
        }
      })

    return NextResponse.json({ businesses, count: businesses.length })
  } catch (err) {
    console.error("[local-businesses] GET error:", err)
    return NextResponse.json({ error: "Failed to fetch businesses" }, { status: 500 })
  }
}
