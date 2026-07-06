module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/local-businesses/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const BUSINESS_TYPE_MAP = {
    restaurant: {
        key: "amenity",
        value: "restaurant"
    },
    cafe: {
        key: "amenity",
        value: "cafe"
    },
    bar: {
        key: "amenity",
        value: "bar"
    },
    hotel: {
        key: "tourism",
        value: "hotel"
    },
    shop: {
        key: "shop",
        value: ""
    },
    supermarket: {
        key: "shop",
        value: "supermarket"
    },
    pharmacy: {
        key: "amenity",
        value: "pharmacy"
    },
    clinic: {
        key: "amenity",
        value: "clinic"
    },
    bank: {
        key: "amenity",
        value: "bank"
    },
    gym: {
        key: "leisure",
        value: "fitness_centre"
    },
    salon: {
        key: "shop",
        value: "hairdresser"
    },
    school: {
        key: "amenity",
        value: "school"
    },
    fuel: {
        key: "amenity",
        value: "fuel"
    },
    bakery: {
        key: "shop",
        value: "bakery"
    },
    dentist: {
        key: "amenity",
        value: "dentist"
    }
};
// Nominatim key used for amenity/shop/tourism/leisure category searches
const NOMINATIM_TAG_MAP = {
    restaurant: {
        key: "amenity",
        value: "restaurant"
    },
    cafe: {
        key: "amenity",
        value: "cafe"
    },
    bar: {
        key: "amenity",
        value: "bar"
    },
    hotel: {
        key: "tourism",
        value: "hotel"
    },
    shop: {
        key: "shop",
        value: ""
    },
    supermarket: {
        key: "shop",
        value: "supermarket"
    },
    pharmacy: {
        key: "amenity",
        value: "pharmacy"
    },
    clinic: {
        key: "amenity",
        value: "clinic"
    },
    bank: {
        key: "amenity",
        value: "bank"
    },
    gym: {
        key: "leisure",
        value: "fitness_centre"
    },
    salon: {
        key: "shop",
        value: "hairdresser"
    },
    school: {
        key: "amenity",
        value: "school"
    },
    fuel: {
        key: "amenity",
        value: "fuel"
    },
    bakery: {
        key: "shop",
        value: "bakery"
    },
    dentist: {
        key: "amenity",
        value: "dentist"
    }
};
function mapOverpassElements(elements, maxResults) {
    return elements.filter((el)=>el.tags?.name).slice(0, maxResults).map((el)=>{
        const tags = el.tags || {};
        const elLat = el.lat ?? el.center?.lat;
        const elLng = el.lon ?? el.center?.lon;
        const addrParts = [
            tags["addr:housenumber"],
            tags["addr:street"],
            tags["addr:city"],
            tags["addr:postcode"],
            tags["addr:country"]
        ].filter(Boolean);
        return {
            name: tags.name || "",
            address: addrParts.join(", "),
            phone: tags.phone || tags["contact:phone"] || "",
            website: tags.website || tags["contact:website"] || tags.url || "",
            category: tags.amenity || tags.shop || tags.tourism || tags.leisure || "",
            openingHours: tags.opening_hours || "",
            lat: elLat ?? null,
            lng: elLng ?? null
        };
    });
}
async function nominatimFallback(area, type, text, searchMode, maxResults) {
    try {
        const params = new URLSearchParams({
            format: "json",
            limit: String(maxResults),
            addressdetails: "1",
            extratags: "1"
        });
        // Viewbox = west,north,east,south  (Nominatim convention)
        if (area.type === "bbox") {
            params.set("viewbox", `${area.west},${area.north},${area.east},${area.south}`);
            params.set("bounded", "1");
        } else {
            // Approximate a bounding box from radius
            const deg = area.radiusMeters / 111000;
            params.set("viewbox", `${area.lng - deg},${area.lat + deg},${area.lng + deg},${area.lat - deg}`);
            params.set("bounded", "1");
        }
        if (searchMode === "text" && text.trim()) {
            params.set("q", text.trim());
        } else {
            const tag = NOMINATIM_TAG_MAP[type];
            if (tag) {
                params.set(tag.key, tag.value || "*");
            } else {
                params.set("q", type);
            }
        }
        const url = `https://nominatim.openstreetmap.org/search?${params}`;
        const res = await fetch(url, {
            headers: {
                "User-Agent": "GridMind/1.0 (gridmind.app)"
            },
            signal: AbortSignal.timeout(12000)
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.map((item)=>{
            const addr = item.address || {};
            const addrParts = [
                addr.house_number,
                addr.road,
                addr.city || addr.town || addr.village,
                addr.postcode,
                addr.country
            ].filter(Boolean);
            const ex = item.extratags || {};
            return {
                name: item.name || item.display_name.split(",")[0],
                address: addrParts.join(", ") || item.display_name,
                phone: ex.phone || ex["contact:phone"] || "",
                website: ex.website || ex["contact:website"] || "",
                category: ex.amenity || ex.shop || ex.tourism || ex.leisure || type,
                openingHours: ex.opening_hours || "",
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon)
            };
        });
    } catch  {
        return [];
    }
}
async function geocode(location) {
    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;
        const res = await fetch(url, {
            headers: {
                "User-Agent": "GridMind/1.0 (gridmind.app)"
            }
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (!data.length) return null;
        return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            displayName: data[0].display_name
        };
    } catch  {
        return null;
    }
}
function buildOverpassQuery(area, type, text, searchMode, maxResults) {
    const areaFilter = area.type === "bbox" ? `(${area.south},${area.west},${area.north},${area.east})` : `(around:${area.radiusMeters},${area.lat},${area.lng})`;
    if (searchMode === "text" && text.trim()) {
        const safeText = text.replace(/["\\/]/g, "");
        return `[out:json][timeout:25];(node["name"~"${safeText}",i]${areaFilter};way["name"~"${safeText}",i]${areaFilter};);out body center ${maxResults};`;
    }
    const typeInfo = BUSINESS_TYPE_MAP[type];
    if (!typeInfo) return null;
    const tag = typeInfo.value ? `["${typeInfo.key}"="${typeInfo.value}"]` : `["${typeInfo.key}"]`;
    return `[out:json][timeout:25];(node${tag}${areaFilter};way${tag}${areaFilter};);out body center ${maxResults};`;
}
async function POST(req) {
    try {
        const { location } = await req.json();
        if (!location?.trim()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Location required"
            }, {
                status: 400
            });
        }
        const coords = await geocode(location.trim());
        if (!coords) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Location not found"
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(coords);
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal error"
        }, {
            status: 500
        });
    }
}
async function GET(req) {
    try {
        const { searchParams } = req.nextUrl;
        // Bbox params (from map viewport) take priority over center+radius
        const south = parseFloat(searchParams.get("south") || "");
        const north = parseFloat(searchParams.get("north") || "");
        const west = parseFloat(searchParams.get("west") || "");
        const east = parseFloat(searchParams.get("east") || "");
        const hasBbox = !isNaN(south) && !isNaN(north) && !isNaN(west) && !isNaN(east);
        const lat = parseFloat(searchParams.get("lat") || "");
        const lng = parseFloat(searchParams.get("lng") || "");
        const radiusKm = Math.min(parseFloat(searchParams.get("radiusKm") || "1"), 20);
        const type = searchParams.get("type") || "restaurant";
        const text = searchParams.get("text") || "";
        const searchMode = searchParams.get("searchMode") || "type";
        const maxResults = Math.min(parseInt(searchParams.get("maxResults") || "10"), 50);
        if (!hasBbox && (isNaN(lat) || isNaN(lng))) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Either bbox (south/north/east/west) or lat+lng are required"
            }, {
                status: 400
            });
        }
        const area = hasBbox ? {
            type: "bbox",
            south,
            north,
            west,
            east
        } : {
            type: "radius",
            lat,
            lng,
            radiusMeters: radiusKm * 1000
        };
        const query = buildOverpassQuery(area, type, text, searchMode, maxResults);
        if (!query) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid business type"
            }, {
                status: 400
            });
        }
        const overpassEndpoints = [
            "https://overpass-api.de/api/interpreter",
            "https://overpass.kumi.systems/api/interpreter",
            "https://overpass.openstreetmap.ru/api/interpreter"
        ];
        // Race all Overpass endpoints in parallel with a short timeout
        const tryOverpass = async (url)=>{
            const res = await fetch(url, {
                method: "POST",
                body: query,
                headers: {
                    "Content-Type": "text/plain"
                },
                signal: AbortSignal.timeout(8000)
            });
            if (!res.ok) throw new Error(`${url} returned ${res.status}`);
            return res.json();
        };
        let businesses;
        try {
            const overpassData = await Promise.any(overpassEndpoints.map(tryOverpass));
            businesses = mapOverpassElements(overpassData.elements, maxResults);
        } catch  {
            console.warn("[local-businesses] Overpass unavailable, falling back to Nominatim");
            businesses = await nominatimFallback(area, type, text, searchMode, maxResults);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            businesses,
            count: businesses.length
        });
    } catch (err) {
        console.error("[local-businesses] GET error:", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch businesses"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a950a3d6._.js.map