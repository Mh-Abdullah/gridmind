# GridMind Features And Tech

This file explains the main features in GridMind, what each feature does, and the main technology used to build it.

## 1. Authentication And Accounts

What it does:
- Lets users register, log in, log out, and manage their account.
- Protects private pages so only authenticated users can access them.
- Supports role-based access for regular users and admins.

Main tech used:
- `Next.js` App Router API routes in `app/api/auth/*`
- `bcryptjs` for password hashing
- `jsonwebtoken` for auth tokens
- Cookie-based session handling
- Shared auth helpers in `lib/auth.ts`, `lib/auth-context.tsx`, and `lib/server-auth.ts`

## 2. Spreadsheet Creation And Management

What it does:
- Lets users create, rename, open, and delete spreadsheets.
- Keeps a list of user tables in the dashboard.
- Supports multiple spreadsheets per user.

Main tech used:
- `React` + `Next.js` pages in `app/dashboard/tables/*`
- `Convex` for table metadata and persistence
- Shared sync logic in `lib/spreadsheet-sync-provider.tsx` and `lib/use-spreadsheet-sync.ts`

## 3. Spreadsheet Editor

What it does:
- Provides the main grid editor for cells, rows, and columns.
- Supports editing values, adding/removing rows and columns, resizing, sorting, filtering, and searching.
- Tracks selected cells and selected rows for AI and column tools.

Main tech used:
- `React 19`
- `Next.js`
- Spreadsheet UI logic in `app/dashboard/tables/[id]/page.tsx`
- Local state plus `Convex` sync

## 4. Cell Formatting

What it does:
- Lets users apply bold, italic, underline, alignment, text color, background color, and font size.
- Supports formatting from toolbar actions and AI-driven formatting changes.

Main tech used:
- UI formatting controls in spreadsheet page and toolbar components
- Formatting state synced through `Convex`
- Shared formatting types used by `AI Agent`

## 5. Import And Export

What it does:
- Imports CSV and Excel files into sheets.
- Exports spreadsheets back out.
- Supports landing-page import flow before login.

Main tech used:
- `xlsx`
- Custom import/export components in `components/*import*` and `components/*export*`
- `Next.js` client flows and browser file handling

## 6. Real-Time Sync

What it does:
- Syncs spreadsheet edits in real time.
- Keeps multiple open tabs updated.
- Persists cell values, formatting, dimensions, and table metadata.

Main tech used:
- `Convex`
- `ConvexReactClient`
- Sync provider in `lib/convex-provider.tsx`
- Spreadsheet sync hooks in `lib/use-spreadsheet-sync.ts`

## 7. AI Chat Assistant

What it does:
- Lets the user chat about spreadsheet data in natural language.
- Uses the sheet context to answer questions about rows, columns, and cell content.
- Streams replies and shows thinking/progress state.

Main tech used:
- `Vercel AI SDK`
- `OpenAI` via `@ai-sdk/openai`
- Chat route in `app/api/ai/chat/route.ts`
- Chat UI in `components/ai-chat-panel.tsx`

## 8. AI Spreadsheet Agent

What it does:
- Acts as a spreadsheet operator that can inspect the sheet, selected cells, rows, columns, and full-sheet snapshots.
- Can edit values, add data, apply formatting, and enrich missing details using web lookup and scraping.
- Returns structured sheet changes that the UI applies.

Main tech used:
- `Vercel AI SDK ToolLoopAgent`
- Structured output with `Output.object(...)`
- Tool-based spreadsheet inspection in `app/api/ai/agent/route.ts`
- `OpenAI` for agent reasoning

## 9. Web Scraper Agent

What it does:
- Generates new table data from web research.
- Enriches selected rows using web search, direct page scraping, OpenStreetMap, company sources, and fallback logic.
- Supports both table generation mode and row enrichment mode.

Main tech used:
- `Vercel AI SDK ToolLoopAgent`
- `OpenAI`
- Route in `app/api/ai/scraper/route.ts`
- Built-in search/scrape helpers
- OpenStreetMap / Overpass / DuckDuckGo / optional external search APIs

## 10. Run Column Tools

What it does:
- Runs a column operation against all rows or only selected rows.
- Supports:
- `AI Agent`
- `AI Web`
- `Scrape Website`
- `Regex`
- `Normalize Company`
- `Normalize Domain`
- `Read File`

Main tech used:
- `Next.js` API route in `app/api/ai/run-column/route.ts`
- `OpenAI` for AI-driven column runs
- Direct web fetch/search logic for deterministic scraping
- Spreadsheet UI integration in `app/dashboard/tables/[id]/page.tsx`

## 11. Scrape Website Column Type

What it does:
- Reads website links from a chosen source column.
- Visits each URL and extracts text content into a new column.
- Can now respect selected rows and handle plain domains as well as full URLs.

Main tech used:
- `fetch`
- HTML text extraction + JSON-LD extraction
- Column runner logic in `app/api/ai/run-column/route.ts`

## 12. Read File Column Type

What it does:
- Reads file references from a source column.
- Extracts text from text files, remote files, images, and PDFs.
- Writes extracted content into a new column.

Main tech used:
- `Vercel AI SDK`
- `OpenAI`
- Data URL handling
- Remote fetch for file content
- Route logic in `app/api/ai/run-column/route.ts`

## 13. Google Search Tool

What it does:
- Lets users run a Google-style search workflow from the UI.
- Used as a separate research helper for lead/data workflows.

Main tech used:
- `Next.js` API route in `app/api/google-search/route.ts`
- UI modal in `components/google-search-modal.tsx`
- Billing integration through `Convex`

## 14. Local Businesses Search

What it does:
- Finds local businesses and displays them in a searchable modal/map workflow.
- Useful for lead generation and local data collection.

Main tech used:
- `Next.js` API route in `app/api/local-businesses/route.ts`
- `Leaflet` and `react-leaflet`
- UI in `components/local-businesses-modal.tsx` and `components/local-businesses-map.tsx`
- OpenStreetMap / Nominatim / Overpass style data sources

## 15. Context Generator

What it does:
- Builds reusable business context for AI tasks.
- Helps AI tools tailor decisions to the user’s company, audience, or workflow.

Main tech used:
- `OpenAI`
- Route in `app/api/ai/context-generator/route.ts`
- Context management page in `app/contexts/page.tsx`

## 16. Template System

What it does:
- Shows predefined spreadsheet templates.
- Lets users browse categories and start from structured use-case templates.

Main tech used:
- `React`
- `Next.js`
- Template data in `lib/templates-data.ts`
- Pages in `app/templates/*`

## 17. Billing And Credits

What it does:
- Tracks user credit balance.
- Charges credits for AI, scraping, search, and other billable actions.
- Refunds credits when operations fail.

Main tech used:
- `Convex` mutations and queries
- Shared billing server helpers in `lib/billing-server.ts`
- Billing config in `lib/billing-config.ts`
- User billing UI in `app/billing/page.tsx` and `app/usage/page.tsx`

## 18. Polar Payments

What it does:
- Powers package checkout and paid credit purchases.
- Connects products/packages to payment checkout and webhook fulfillment.

Main tech used:
- `@polar-sh/nextjs`
- `@polar-sh/sdk`
- Checkout routes in `app/api/billing/checkout/route.ts`
- Confirmation route in `app/api/billing/confirm/route.ts`
- Webhook route in `app/api/webhooks/polar/route.ts`

## 19. Admin Billing Dashboard

What it does:
- Lets admins manage pricing packages, usage pricing, manual credits, and Polar product sync.
- Provides billing overview and analytics.

Main tech used:
- `Convex`
- Admin UI in `components/admin-billing-panel.tsx`
- Admin pages in `app/dashboard-admin/billing/page.tsx` and `app/dashboard-admin/analytics/page.tsx`
- Polar sync route in `app/api/admin/billing/sync-product/route.ts`

## 20. Admin Dashboard

What it does:
- Provides an admin-only area for user, billing, and analytics management.
- Separates admin tools from the regular user dashboard.

Main tech used:
- `Next.js`
- Role-based auth checks
- Admin navigation in `components/admin-sidebar.tsx`

## 21. Landing Page

What it does:
- Explains the product publicly.
- Shows available agents and pricing/package information.
- Supports file-drop onboarding from the marketing page.

Main tech used:
- `Next.js`
- `React`
- Public page in `app/page.tsx`
- Billing/package display from `Convex`

## 22. Theme Support

What it does:
- Supports light/dark theme switching across the app.

Main tech used:
- Theme provider in `lib/theme-provider.tsx`
- UI toggle in `components/theme-toggle.tsx`

## 23. Analytics And Monitoring

What it does:
- Tracks usage and admin-level billing analytics.
- Adds site analytics support.

Main tech used:
- `@vercel/analytics`
- `Convex` analytics queries
- Admin analytics page

## 24. Core App Stack

Main technologies used across the project:
- `Next.js 16`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `Vercel AI SDK`
- `OpenAI`
- `Convex`
- `Polar`
- `Zod`
- `xlsx`
- `Leaflet`
- `Radix UI`

## 25. Feature Summary

GridMind is mainly a:
- spreadsheet editor
- AI-assisted spreadsheet workspace
- web research and enrichment tool
- lead generation and business data workflow app
- credit-billed SaaS with admin and payment infrastructure
