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
"[project]/app/api/google-search/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
// Uses Serper.dev — free tier: 2,500 queries/month
// Set SERPER_API_KEY in .env.local
// Sign up free at https://serper.dev
const LANGUAGE_CODES = {
    English: "en",
    German: "de",
    French: "fr",
    Spanish: "es",
    Italian: "it",
    Portuguese: "pt",
    Dutch: "nl",
    Russian: "ru",
    Japanese: "ja",
    Chinese: "zh",
    Arabic: "ar",
    Hindi: "hi",
    Urdu: "ur"
};
const COUNTRY_CODES = {
    "United States": "us",
    "United Kingdom": "gb",
    Germany: "de",
    France: "fr",
    Spain: "es",
    Italy: "it",
    Canada: "ca",
    Australia: "au",
    India: "in",
    Pakistan: "pk",
    Japan: "jp",
    Brazil: "br",
    Netherlands: "nl",
    Russia: "ru",
    "Saudi Arabia": "sa",
    "United Arab Emirates": "ae"
};
async function POST(req) {
    const { query, num = 10, language = "English", country = "United States" } = await req.json();
    if (!query?.trim()) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Query is required"
        }, {
            status: 400
        });
    }
    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "SERPER_API_KEY not configured"
        }, {
            status: 500
        });
    }
    const hl = LANGUAGE_CODES[language] ?? "en";
    const gl = COUNTRY_CODES[country] ?? "us";
    try {
        const res = await fetch("https://google.serper.dev/search", {
            method: "POST",
            headers: {
                "X-API-KEY": apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                q: query.trim(),
                num: Math.min(num, 100),
                hl,
                gl
            })
        });
        if (!res.ok) {
            const text = await res.text();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `Serper API error: ${res.status} ${text}`
            }, {
                status: res.status
            });
        }
        const data = await res.json();
        const results = (data.organic ?? []).map((item)=>({
                title: item.title ?? "",
                url: item.link ?? "",
                snippet: item.snippet ?? "",
                displayedLink: item.displayedLink ?? "",
                position: item.position ?? 0
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            results,
            total: results.length
        });
    } catch (err) {
        console.error("Google search error:", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Search failed"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__79781cfd._.js.map