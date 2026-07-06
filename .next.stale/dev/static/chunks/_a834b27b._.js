(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "border bg-background shadow-xs hover:bg-hover text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-hover text-foreground dark:hover:bg-hover",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2 has-[>svg]:px-3",
            sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
            lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
            icon: "size-9",
            "icon-sm": "size-8",
            "icon-lg": "size-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
function Button({ className, variant = "default", size = "default", asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        "data-variant": variant,
        "data-size": size,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Input({ className, type, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        "data-slot": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]', 'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Input;
;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/theme-toggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeToggle",
    ()=>ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function ThemeToggle() {
    _s();
    const [isDark, setIsDark] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeToggle.useEffect": ()=>{
            setMounted(true);
            // Check if dark mode is set
            const isDarkMode = document.documentElement.classList.contains('dark');
            setIsDark(isDarkMode);
        }
    }["ThemeToggle.useEffect"], []);
    const toggleTheme = ()=>{
        const html = document.documentElement;
        if (isDark) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };
    // Don't render until mounted to avoid hydration mismatch
    if (!mounted) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: toggleTheme,
        className: "rounded-lg p-2 hover:bg-hover transition-colors",
        "aria-label": "Toggle theme",
        children: isDark ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
            className: "h-5 w-5 text-accent"
        }, void 0, false, {
            fileName: "[project]/components/theme-toggle.tsx",
            lineNumber: 42,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
            className: "h-5 w-5 text-primary"
        }, void 0, false, {
            fileName: "[project]/components/theme-toggle.tsx",
            lineNumber: 44,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/theme-toggle.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_s(ThemeToggle, "4PPoEPuUE5ZM05wB23N+LA9kxlg=");
_c = ThemeToggle;
var _c;
__turbopack_context__.k.register(_c, "ThemeToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/csv-export.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CSVExport",
    ()=>CSVExport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
"use client";
;
;
;
function CSVExport({ projectName, numRows, numCols, getCellValue, getColumnLabel }) {
    const handleExportCSV = ()=>{
        // Build CSV content - only export actual data rows, not column headers
        let csvContent = "";
        // Add data rows
        for(let row = 0; row < numRows; row++){
            const rowData = Array.from({
                length: numCols
            }).map((_, col)=>{
                const value = getCellValue(row, col);
                // Escape quotes and wrap in quotes if contains comma or newline
                if (value.includes(",") || value.includes("\n") || value.includes('"')) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(",");
            csvContent += rowData + "\n";
        }
        // Create blob and download
        const blob = new Blob([
            csvContent
        ], {
            type: "text/csv;charset=utf-8;"
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${projectName}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        variant: "ghost",
        size: "sm",
        className: "gap-1.5 h-7 text-xs shrink-0 px-2.5",
        onClick: handleExportCSV,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                className: "h-3.5 w-3.5"
            }, void 0, false, {
                fileName: "[project]/components/csv-export.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            "Export CSV"
        ]
    }, void 0, true, {
        fileName: "[project]/components/csv-export.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
_c = CSVExport;
var _c;
__turbopack_context__.k.register(_c, "CSVExport");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/csv-import.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CSVImport",
    ()=>CSVImport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/xlsx/xlsx.mjs [app-client] (ecmascript)");
"use client";
;
;
;
function CSVImport({ onImport }) {
    const parseExcelFile = (file)=>{
        const reader = new FileReader();
        reader.onload = (event)=>{
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["read"](data, {
                    type: "array"
                });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                // Get the range of data in the worksheet
                const range = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].decode_range(worksheet['!ref'] || 'A1');
                const rows = range.e.r + 1;
                const cols = range.e.c + 1;
                // Populate cells - get all cells from the worksheet
                const newCells = {};
                for(let rowIndex = 0; rowIndex < rows; rowIndex++){
                    for(let colIndex = 0; colIndex < cols; colIndex++){
                        const cellAddress = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].encode_cell({
                            r: rowIndex,
                            c: colIndex
                        });
                        const cell = worksheet[cellAddress];
                        const cellValue = cell ? String(cell.v || "").trim() : "";
                        newCells[`${rowIndex}-${colIndex}`] = cellValue;
                    }
                }
                console.log("Imported Excel cells:", newCells);
                console.log("Rows:", rows, "Cols:", cols);
                onImport(newCells, rows, cols);
            } catch (error) {
                console.error("Error parsing Excel file:", error);
                alert("Error parsing Excel file. Please try again.");
            }
        };
        reader.readAsArrayBuffer(file);
    };
    const parseCSVFile = (file)=>{
        const reader = new FileReader();
        reader.onload = (event)=>{
            const csv = event.target.result;
            const lines = csv.trim().split("\n");
            if (lines.length === 0) return;
            // Parse CSV lines
            const parsedLines = lines.map((line)=>{
                const result = [];
                let current = "";
                let insideQuotes = false;
                for(let i = 0; i < line.length; i++){
                    const char = line[i];
                    const nextChar = line[i + 1];
                    if (char === '"') {
                        if (insideQuotes && nextChar === '"') {
                            current += '"';
                            i++;
                        } else {
                            insideQuotes = !insideQuotes;
                        }
                    } else if (char === "," && !insideQuotes) {
                        result.push(current);
                        current = "";
                    } else {
                        current += char;
                    }
                }
                result.push(current);
                return result;
            });
            // Set number of columns (use max column count across all rows) and rows
            const cols = Math.max(...parsedLines.map((row)=>row.length), 1);
            const rows = parsedLines.length;
            // Populate cells - create entries for ALL cells up to max rows and columns
            const newCells = {};
            parsedLines.forEach((row, rowIndex)=>{
                // Iterate through all columns (including empty ones)
                for(let colIndex = 0; colIndex < cols; colIndex++){
                    const cellValue = row[colIndex] || "";
                    newCells[`${rowIndex}-${colIndex}`] = cellValue.trim();
                }
            });
            console.log("Imported cells:", newCells);
            console.log("Rows:", rows, "Cols:", cols);
            onImport(newCells, rows, cols);
        };
        reader.readAsText(file);
    };
    const handleImportFile = ()=>{
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".csv,.xlsx,.xls";
        input.onchange = (e)=>{
            const file = e.target.files[0];
            if (!file) return;
            if (file.name.endsWith(".csv")) {
                parseCSVFile(file);
            } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
                parseExcelFile(file);
            } else {
                alert("Unsupported file format. Please use CSV, XLSX, or XLS files.");
            }
        };
        input.click();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        variant: "ghost",
        size: "sm",
        className: "gap-2",
        onClick: handleImportFile,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                    }, void 0, false, {
                        fileName: "[project]/components/csv-import.tsx",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                        points: "14 2 14 8 20 8"
                    }, void 0, false, {
                        fileName: "[project]/components/csv-import.tsx",
                        lineNumber: 130,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: "5",
                        y: "19",
                        fontSize: "6",
                        fontWeight: "bold",
                        fill: "currentColor",
                        stroke: "none",
                        fontFamily: "monospace",
                        children: "CSV"
                    }, void 0, false, {
                        fileName: "[project]/components/csv-import.tsx",
                        lineNumber: 131,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/csv-import.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this),
            "Import"
        ]
    }, void 0, true, {
        fileName: "[project]/components/csv-import.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
}
_c = CSVImport;
var _c;
__turbopack_context__.k.register(_c, "CSVImport");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/text-formatting-toolbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TextFormattingToolbar",
    ()=>TextFormattingToolbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bold$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bold$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bold.js [app-client] (ecmascript) <export default as Bold>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$italic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Italic$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/italic.js [app-client] (ecmascript) <export default as Italic>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$underline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Underline$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/underline.js [app-client] (ecmascript) <export default as Underline>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/text-align-start.js [app-client] (ecmascript) <export default as AlignLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$center$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignCenter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/text-align-center.js [app-client] (ecmascript) <export default as AlignCenter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$end$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/text-align-end.js [app-client] (ecmascript) <export default as AlignRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eraser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eraser$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eraser.js [app-client] (ecmascript) <export default as Eraser>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rows$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rows3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rows-3.js [app-client] (ecmascript) <export default as Rows3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$columns$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Columns3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/columns-3.js [app-client] (ecmascript) <export default as Columns3>");
"use client";
;
;
;
function TextFormattingToolbar({ selectedCell, selectedCells, getCellFormatting, setCellFormatting, getColumnLabel, isRangeSelected, isCellMerged, onMergeCells, onUnmergeCells }) {
    const getSelectedCells = ()=>{
        if (selectedCells && selectedCells.size > 0) {
            return Array.from(selectedCells).map((key)=>{
                const [row, col] = key.split('-').map(Number);
                return {
                    row,
                    col
                };
            });
        }
        return selectedCell ? [
            selectedCell
        ] : [];
    };
    const toggleBold = ()=>{
        const cells = getSelectedCells();
        cells.forEach(({ row, col })=>{
            const formatting = getCellFormatting(row, col);
            setCellFormatting(row, col, {
                ...formatting,
                bold: !formatting.bold
            });
        });
    };
    const toggleItalic = ()=>{
        const cells = getSelectedCells();
        cells.forEach(({ row, col })=>{
            const formatting = getCellFormatting(row, col);
            setCellFormatting(row, col, {
                ...formatting,
                italic: !formatting.italic
            });
        });
    };
    const toggleUnderline = ()=>{
        const cells = getSelectedCells();
        cells.forEach(({ row, col })=>{
            const formatting = getCellFormatting(row, col);
            setCellFormatting(row, col, {
                ...formatting,
                underline: !formatting.underline
            });
        });
    };
    const setTextAlignment = (alignment)=>{
        const cells = getSelectedCells();
        cells.forEach(({ row, col })=>{
            const formatting = getCellFormatting(row, col);
            setCellFormatting(row, col, {
                ...formatting,
                alignment
            });
        });
    };
    const setTextColor = (color)=>{
        const cells = getSelectedCells();
        cells.forEach(({ row, col })=>{
            const formatting = getCellFormatting(row, col);
            setCellFormatting(row, col, {
                ...formatting,
                textColor: color
            });
        });
    };
    const setBackgroundColor = (color)=>{
        const cells = getSelectedCells();
        cells.forEach(({ row, col })=>{
            const formatting = getCellFormatting(row, col);
            setCellFormatting(row, col, {
                ...formatting,
                backgroundColor: color
            });
        });
    };
    const setFontSize = (size)=>{
        const cells = getSelectedCells();
        cells.forEach(({ row, col })=>{
            const formatting = getCellFormatting(row, col);
            setCellFormatting(row, col, {
                ...formatting,
                fontSize: size
            });
        });
    };
    const clearFormatting = ()=>{
        const cells = getSelectedCells();
        cells.forEach(({ row, col })=>{
            setCellFormatting(row, col, {});
        });
    };
    const currentFormatting = selectedCell ? getCellFormatting(selectedCell.row, selectedCell.col) : {};
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-1 border-b border-border bg-muted/30 px-4 py-1.5",
        // Prevent mousedown from stealing DOM focus away from the table,
        // which would break formatting when clicking toolbar buttons.
        onMouseDown: (e)=>e.preventDefault(),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                value: currentFormatting.fontSize || 14,
                onChange: (e)=>setFontSize(parseInt(e.target.value)),
                onMouseDown: (e)=>e.stopPropagation(),
                className: "h-7 rounded border border-border bg-background px-2 text-xs text-foreground cursor-pointer",
                children: [
                    10,
                    11,
                    12,
                    13,
                    14,
                    16,
                    18,
                    20,
                    24
                ].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: s,
                        children: s
                    }, s, false, {
                        fileName: "[project]/components/text-formatting-toolbar.tsx",
                        lineNumber: 160,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/text-formatting-toolbar.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-4 w-px bg-border mx-0.5"
            }, void 0, false, {
                fileName: "[project]/components/text-formatting-toolbar.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                variant: currentFormatting.bold ? "default" : "ghost",
                size: "sm",
                className: "h-7 w-7 p-0",
                onMouseDown: (e)=>{
                    e.preventDefault();
                    toggleBold();
                },
                title: "Bold",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bold$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bold$3e$__["Bold"], {
                    className: "h-3.5 w-3.5"
                }, void 0, false, {
                    fileName: "[project]/components/text-formatting-toolbar.tsx",
                    lineNumber: 174,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/text-formatting-toolbar.tsx",
                lineNumber: 167,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                variant: currentFormatting.italic ? "default" : "ghost",
                size: "sm",
                className: "h-7 w-7 p-0",
                onMouseDown: (e)=>{
                    e.preventDefault();
                    toggleItalic();
                },
                title: "Italic",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$italic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Italic$3e$__["Italic"], {
                    className: "h-3.5 w-3.5"
                }, void 0, false, {
                    fileName: "[project]/components/text-formatting-toolbar.tsx",
                    lineNumber: 185,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/text-formatting-toolbar.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                variant: currentFormatting.underline ? "default" : "ghost",
                size: "sm",
                className: "h-7 w-7 p-0",
                onMouseDown: (e)=>{
                    e.preventDefault();
                    toggleUnderline();
                },
                title: "Underline",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$underline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Underline$3e$__["Underline"], {
                    className: "h-3.5 w-3.5"
                }, void 0, false, {
                    fileName: "[project]/components/text-formatting-toolbar.tsx",
                    lineNumber: 196,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/text-formatting-toolbar.tsx",
                lineNumber: 189,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-4 w-px bg-border mx-0.5"
            }, void 0, false, {
                fileName: "[project]/components/text-formatting-toolbar.tsx",
                lineNumber: 199,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                variant: currentFormatting.alignment === "left" ? "default" : "ghost",
                size: "sm",
                className: "h-7 w-7 p-0",
                onMouseDown: (e)=>{
                    e.preventDefault();
                    setTextAlignment("left");
                },
                title: "Align Left",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__["AlignLeft"], {
                    className: "h-3.5 w-3.5"
                }, void 0, false, {
                    fileName: "[project]/components/text-formatting-toolbar.tsx",
                    lineNumber: 209,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/text-formatting-toolbar.tsx",
                lineNumber: 202,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                variant: currentFormatting.alignment === "center" ? "default" : "ghost",
                size: "sm",
                className: "h-7 w-7 p-0",
                onMouseDown: (e)=>{
                    e.preventDefault();
                    setTextAlignment("center");
                },
                title: "Align Center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$center$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignCenter$3e$__["AlignCenter"], {
                    className: "h-3.5 w-3.5"
                }, void 0, false, {
                    fileName: "[project]/components/text-formatting-toolbar.tsx",
                    lineNumber: 218,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/text-formatting-toolbar.tsx",
                lineNumber: 211,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                variant: currentFormatting.alignment === "right" ? "default" : "ghost",
                size: "sm",
                className: "h-7 w-7 p-0",
                onMouseDown: (e)=>{
                    e.preventDefault();
                    setTextAlignment("right");
                },
                title: "Align Right",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$end$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignRight$3e$__["AlignRight"], {
                    className: "h-3.5 w-3.5"
                }, void 0, false, {
                    fileName: "[project]/components/text-formatting-toolbar.tsx",
                    lineNumber: 227,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/text-formatting-toolbar.tsx",
                lineNumber: 220,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-4 w-px bg-border mx-0.5"
            }, void 0, false, {
                fileName: "[project]/components/text-formatting-toolbar.tsx",
                lineNumber: 230,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1",
                title: "Text Color",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-muted-foreground select-none",
                        children: "A"
                    }, void 0, false, {
                        fileName: "[project]/components/text-formatting-toolbar.tsx",
                        lineNumber: 234,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "relative h-5 w-5 cursor-pointer",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "block h-5 w-5 rounded border border-border",
                                style: {
                                    backgroundColor: currentFormatting.textColor || "#888888"
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/text-formatting-toolbar.tsx",
                                lineNumber: 236,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "color",
                                value: currentFormatting.textColor || "#000000",
                                onChange: (e)=>setTextColor(e.target.value),
                                onInput: (e)=>setTextColor(e.target.value),
                                className: "absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                            }, void 0, false, {
                                fileName: "[project]/components/text-formatting-toolbar.tsx",
                                lineNumber: 240,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/text-formatting-toolbar.tsx",
                        lineNumber: 235,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/text-formatting-toolbar.tsx",
                lineNumber: 233,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1",
                title: "Background Color",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-muted-foreground select-none",
                        children: "BG"
                    }, void 0, false, {
                        fileName: "[project]/components/text-formatting-toolbar.tsx",
                        lineNumber: 252,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "relative h-5 w-5 cursor-pointer",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "block h-5 w-5 rounded border border-border",
                                style: {
                                    backgroundColor: currentFormatting.backgroundColor || "transparent"
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/text-formatting-toolbar.tsx",
                                lineNumber: 254,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "color",
                                value: currentFormatting.backgroundColor || "#ffffff",
                                onChange: (e)=>setBackgroundColor(e.target.value),
                                onInput: (e)=>setBackgroundColor(e.target.value),
                                className: "absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                            }, void 0, false, {
                                fileName: "[project]/components/text-formatting-toolbar.tsx",
                                lineNumber: 258,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/text-formatting-toolbar.tsx",
                        lineNumber: 253,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/text-formatting-toolbar.tsx",
                lineNumber: 251,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-4 w-px bg-border mx-0.5"
            }, void 0, false, {
                fileName: "[project]/components/text-formatting-toolbar.tsx",
                lineNumber: 268,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                variant: "ghost",
                size: "sm",
                className: "h-7 gap-1 px-2 text-xs",
                onMouseDown: (e)=>{
                    e.preventDefault();
                    onMergeCells?.();
                },
                disabled: !isRangeSelected || !isRangeSelected(),
                title: "Merge Selected Cells (Shift+click to select range first)",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$columns$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Columns3$3e$__["Columns3"], {
                        className: "h-3.5 w-3.5"
                    }, void 0, false, {
                        fileName: "[project]/components/text-formatting-toolbar.tsx",
                        lineNumber: 279,
                        columnNumber: 9
                    }, this),
                    "Merge"
                ]
            }, void 0, true, {
                fileName: "[project]/components/text-formatting-toolbar.tsx",
                lineNumber: 271,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                variant: "ghost",
                size: "sm",
                className: "h-7 gap-1 px-2 text-xs",
                onMouseDown: (e)=>{
                    e.preventDefault();
                    onUnmergeCells?.();
                },
                disabled: !selectedCell || !isCellMerged || !isCellMerged(selectedCell.row, selectedCell.col),
                title: "Unmerge Cells",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rows$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rows3$3e$__["Rows3"], {
                        className: "h-3.5 w-3.5"
                    }, void 0, false, {
                        fileName: "[project]/components/text-formatting-toolbar.tsx",
                        lineNumber: 292,
                        columnNumber: 9
                    }, this),
                    "Unmerge"
                ]
            }, void 0, true, {
                fileName: "[project]/components/text-formatting-toolbar.tsx",
                lineNumber: 284,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-4 w-px bg-border mx-0.5"
            }, void 0, false, {
                fileName: "[project]/components/text-formatting-toolbar.tsx",
                lineNumber: 296,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                variant: "ghost",
                size: "sm",
                className: "h-7 gap-1 px-2 text-xs",
                onMouseDown: (e)=>{
                    e.preventDefault();
                    clearFormatting();
                },
                title: "Clear Formatting",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eraser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eraser$3e$__["Eraser"], {
                        className: "h-3.5 w-3.5"
                    }, void 0, false, {
                        fileName: "[project]/components/text-formatting-toolbar.tsx",
                        lineNumber: 306,
                        columnNumber: 9
                    }, this),
                    "Clear"
                ]
            }, void 0, true, {
                fileName: "[project]/components/text-formatting-toolbar.tsx",
                lineNumber: 299,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1"
            }, void 0, false, {
                fileName: "[project]/components/text-formatting-toolbar.tsx",
                lineNumber: 310,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-xs text-muted-foreground pr-2",
                children: selectedCell && `Cell: ${getColumnLabel(selectedCell.col)}${selectedCell.row + 1}`
            }, void 0, false, {
                fileName: "[project]/components/text-formatting-toolbar.tsx",
                lineNumber: 311,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/text-formatting-toolbar.tsx",
        lineNumber: 146,
        columnNumber: 5
    }, this);
}
_c = TextFormattingToolbar;
var _c;
__turbopack_context__.k.register(_c, "TextFormattingToolbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ai-chat-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AIChatPanel",
    ()=>AIChatPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/maximize-2.js [app-client] (ecmascript) <export default as Maximize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minimize-2.js [app-client] (ecmascript) <export default as Minimize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$at$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AtSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/at-sign.js [app-client] (ecmascript) <export default as AtSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up.js [app-client] (ecmascript) <export default as ArrowUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SquarePen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as SquarePen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/history.js [app-client] (ecmascript) <export default as History>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
// Helper to get storage key for a table
const getChatStorageKey = (tableId)=>`gridmind-chat-history-${tableId}`;
// Helper to serialize/deserialize dates in messages
const serializeSession = (session)=>{
    return JSON.stringify({
        ...session,
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
        messages: session.messages.map((m)=>({
                ...m,
                timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp
            }))
    });
};
const deserializeSession = (data)=>{
    const parsed = JSON.parse(data);
    return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt),
        messages: parsed.messages.map((m)=>({
                ...m,
                timestamp: new Date(m.timestamp)
            }))
    };
};
// Load all sessions for a table
const loadChatSessions = (tableId)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const stored = localStorage.getItem(getChatStorageKey(tableId));
        if (!stored) return [];
        const sessions = JSON.parse(stored);
        return sessions.map((s)=>deserializeSession(s)).sort((a, b)=>new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } catch (e) {
        console.error('Failed to load chat sessions:', e);
        return [];
    }
};
// Save all sessions for a table
const saveChatSessions = (tableId, sessions)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const serialized = sessions.map((s)=>serializeSession(s));
        localStorage.setItem(getChatStorageKey(tableId), JSON.stringify(serialized));
    } catch (e) {
        console.error('Failed to save chat sessions:', e);
    }
};
// Generate title from first user message
const generateTitle = (messages)=>{
    const firstUserMessage = messages.find((m)=>m.role === 'user');
    if (!firstUserMessage) return 'New Chat';
    const content = firstUserMessage.content.trim();
    return content.length > 40 ? content.slice(0, 40) + '...' : content;
};
// Collapsible step-by-step thinking box — like GitHub Copilot's "Thinking..." panel
function ThinkingBox({ steps, activeStep, isDone }) {
    _s();
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const didAutoCollapse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThinkingBox.useEffect": ()=>{
            if (isDone && !didAutoCollapse.current && steps.length > 0) {
                didAutoCollapse.current = true;
                const t = setTimeout({
                    "ThinkingBox.useEffect.t": ()=>setExpanded(false)
                }["ThinkingBox.useEffect.t"], 1800);
                return ({
                    "ThinkingBox.useEffect": ()=>clearTimeout(t)
                })["ThinkingBox.useEffect"];
            }
        }
    }["ThinkingBox.useEffect"], [
        isDone,
        steps.length
    ]);
    const headerText = isDone ? `Used ${steps.length} step${steps.length !== 1 ? 's' : ''}` : activeStep || 'Working...';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mb-2 rounded border border-border/50 bg-muted/30 text-xs overflow-hidden w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setExpanded((v)=>!v),
                className: "flex items-center gap-2 w-full px-3 py-1.5 text-left hover:bg-muted/50 transition-colors",
                children: [
                    isDone ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                        className: "h-3 w-3 text-green-500 shrink-0"
                    }, void 0, false, {
                        fileName: "[project]/components/ai-chat-panel.tsx",
                        lineNumber: 210,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "h-3 w-3 animate-spin text-primary shrink-0"
                    }, void 0, false, {
                        fileName: "[project]/components/ai-chat-panel.tsx",
                        lineNumber: 212,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `font-medium truncate flex-1 ${isDone ? 'text-muted-foreground' : 'text-foreground'}`,
                        children: headerText
                    }, void 0, false, {
                        fileName: "[project]/components/ai-chat-panel.tsx",
                        lineNumber: 214,
                        columnNumber: 9
                    }, this),
                    expanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                        className: "h-3 w-3 text-muted-foreground shrink-0"
                    }, void 0, false, {
                        fileName: "[project]/components/ai-chat-panel.tsx",
                        lineNumber: 218,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                        className: "h-3 w-3 text-muted-foreground shrink-0"
                    }, void 0, false, {
                        fileName: "[project]/components/ai-chat-panel.tsx",
                        lineNumber: 220,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ai-chat-panel.tsx",
                lineNumber: 205,
                columnNumber: 7
            }, this),
            expanded && (steps.length > 0 || activeStep) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3 pb-2 pt-1 border-t border-border/40 space-y-1.5 max-h-72 overflow-y-auto",
                children: [
                    steps.map((step, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-2 text-muted-foreground min-w-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                    className: "h-3 w-3 mt-0.5 text-green-500 shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                    lineNumber: 227,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "whitespace-pre-line wrap-break-word min-w-0 flex-1",
                                    children: step
                                }, void 0, false, {
                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                    lineNumber: 228,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, i, true, {
                            fileName: "[project]/components/ai-chat-panel.tsx",
                            lineNumber: 226,
                            columnNumber: 13
                        }, this)),
                    activeStep && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-2 text-foreground min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                className: "h-3 w-3 mt-0.5 animate-spin text-primary shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat-panel.tsx",
                                lineNumber: 233,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "whitespace-pre-line wrap-break-word min-w-0 flex-1",
                                children: activeStep
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat-panel.tsx",
                                lineNumber: 234,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ai-chat-panel.tsx",
                        lineNumber: 232,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ai-chat-panel.tsx",
                lineNumber: 224,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ai-chat-panel.tsx",
        lineNumber: 204,
        columnNumber: 5
    }, this);
}
_s(ThinkingBox, "37Ms4JlUed/2Ky0p/ovmsQVpzEE=");
_c = ThinkingBox;
function AIChatPanel({ isOpen, onClose, tableContext, onApplyChanges, onApplyFormatting, onAddColumns, onGenerateTable, pendingChanges, onKeepChanges, onUndoChanges }) {
    _s1();
    const welcomeMessage = {
        id: "welcome",
        role: "assistant",
        content: "Hi! I'm your AI assistant for GridMind. I can help you with:\n\n• **Analyzing data** in your spreadsheet\n• **Generating formulas** and calculations\n• **Suggesting improvements** to your data\n• **Answering questions** about your content\n\nHow can I help you today?",
        timestamp: new Date()
    };
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        welcomeMessage
    ]);
    const [inputValue, setInputValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isExpanded, setIsExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [copiedMessageId, setCopiedMessageId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showScrollButton, setShowScrollButton] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedAgent, setSelectedAgent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Scraper");
    const [showAgentMenu, setShowAgentMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Chat history state
    const [chatSessions, setChatSessions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [currentSessionId, setCurrentSessionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showHistory, setShowHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const messagesContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const tableId = tableContext?.tableId || 'default';
    // Load chat sessions on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AIChatPanel.useEffect": ()=>{
            const sessions = loadChatSessions(tableId);
            setChatSessions(sessions);
            // If there are existing sessions, load the most recent one
            if (sessions.length > 0) {
                const mostRecent = sessions[0];
                setCurrentSessionId(mostRecent.id);
                setMessages(mostRecent.messages);
            } else {
                // Create a new session
                const newSession = {
                    id: Date.now().toString(),
                    title: 'New Chat',
                    messages: [
                        welcomeMessage
                    ],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    tableId
                };
                setCurrentSessionId(newSession.id);
                setChatSessions([
                    newSession
                ]);
                saveChatSessions(tableId, [
                    newSession
                ]);
            }
        }
    }["AIChatPanel.useEffect"], [
        tableId
    ]);
    // Save current session when messages change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AIChatPanel.useEffect": ()=>{
            if (!currentSessionId || messages.length === 0) return;
            // Don't save if only welcome message and no user messages
            const hasUserMessage = messages.some({
                "AIChatPanel.useEffect.hasUserMessage": (m)=>m.role === 'user'
            }["AIChatPanel.useEffect.hasUserMessage"]);
            if (!hasUserMessage && messages.length === 1 && messages[0].id.startsWith('welcome')) return;
            const updatedSessions = chatSessions.map({
                "AIChatPanel.useEffect.updatedSessions": (session)=>{
                    if (session.id === currentSessionId) {
                        return {
                            ...session,
                            messages,
                            title: generateTitle(messages),
                            updatedAt: new Date()
                        };
                    }
                    return session;
                }
            }["AIChatPanel.useEffect.updatedSessions"]);
            setChatSessions(updatedSessions);
            saveChatSessions(tableId, updatedSessions);
        }
    }["AIChatPanel.useEffect"], [
        messages,
        currentSessionId,
        tableId
    ]);
    // Create a new chat session
    const createNewChat = ()=>{
        const newSession = {
            id: Date.now().toString(),
            title: 'New Chat',
            messages: [
                {
                    ...welcomeMessage,
                    id: 'welcome-' + Date.now()
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
            tableId
        };
        const updatedSessions = [
            newSession,
            ...chatSessions
        ];
        setChatSessions(updatedSessions);
        saveChatSessions(tableId, updatedSessions);
        setCurrentSessionId(newSession.id);
        setMessages(newSession.messages);
        setInputValue("");
        setShowHistory(false);
    };
    // Switch to a different chat session
    const switchToSession = (sessionId)=>{
        const session = chatSessions.find((s)=>s.id === sessionId);
        if (session) {
            setCurrentSessionId(session.id);
            setMessages(session.messages);
            setShowHistory(false);
        }
    };
    // Delete a chat session
    const deleteSession = (sessionId, e)=>{
        e.stopPropagation();
        const updatedSessions = chatSessions.filter((s)=>s.id !== sessionId);
        setChatSessions(updatedSessions);
        saveChatSessions(tableId, updatedSessions);
        // If we deleted the current session, switch to another or create new
        if (sessionId === currentSessionId) {
            if (updatedSessions.length > 0) {
                setCurrentSessionId(updatedSessions[0].id);
                setMessages(updatedSessions[0].messages);
            } else {
                createNewChat();
            }
        }
    };
    // Format relative time
    const formatRelativeTime = (date)=>{
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };
    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AIChatPanel.useCallback[scrollToBottom]": ()=>{
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth"
            });
        }
    }["AIChatPanel.useCallback[scrollToBottom]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AIChatPanel.useEffect": ()=>{
            scrollToBottom();
        }
    }["AIChatPanel.useEffect"], [
        messages,
        scrollToBottom
    ]);
    // Focus input when panel opens
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AIChatPanel.useEffect": ()=>{
            if (isOpen) {
                setTimeout({
                    "AIChatPanel.useEffect": ()=>inputRef.current?.focus()
                }["AIChatPanel.useEffect"], 100);
            }
        }
    }["AIChatPanel.useEffect"], [
        isOpen
    ]);
    // Close menus when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AIChatPanel.useEffect": ()=>{
            const handleClickOutside = {
                "AIChatPanel.useEffect.handleClickOutside": ()=>{
                    setShowAgentMenu(false);
                }
            }["AIChatPanel.useEffect.handleClickOutside"];
            if (showAgentMenu) {
                document.addEventListener("click", handleClickOutside);
                return ({
                    "AIChatPanel.useEffect": ()=>document.removeEventListener("click", handleClickOutside)
                })["AIChatPanel.useEffect"];
            }
        }
    }["AIChatPanel.useEffect"], [
        showAgentMenu
    ]);
    // Check if should show scroll button
    const handleScroll = ()=>{
        if (messagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            setShowScrollButton(!isNearBottom);
        }
    };
    // Get context from the spreadsheet
    const buildSpreadsheetSnapshot = ()=>{
        if (!tableContext) return null;
        const { numRows, numCols, getCellValue, getColumnLabel, selectedCells } = tableContext;
        // Build column headers row
        const colLabels = Array.from({
            length: numCols
        }, (_, i)=>getColumnLabel(i));
        // Build rows as objects { col: value }
        const rows = [];
        for(let r = 0; r < numRows; r++){
            const row = {};
            let hasData = false;
            for(let c = 0; c < numCols; c++){
                const val = getCellValue(r, c);
                if (val) {
                    row[colLabels[c]] = val;
                    hasData = true;
                }
            }
            if (hasData) rows.push(row);
        }
        const selectedInfo = [];
        if (selectedCells && selectedCells.size > 0) {
            selectedCells.forEach((cellKey)=>{
                const [r, c] = cellKey.split('-').map(Number);
                const val = getCellValue(r, c);
                if (val) selectedInfo.push(`${getColumnLabel(c)}${r + 1}: "${val}"`);
            });
        }
        return {
            columns: colLabels,
            rows,
            numRows,
            numCols,
            selectedCells: selectedInfo
        };
    };
    // Handle Web Scraper agent
    const handleScraperAgent = async (prompt, assistantMessageId, chatHistory)=>{
        const hasSelection = tableContext?.selectedCells && tableContext.selectedCells.size > 0;
        const mode = hasSelection ? "enrich" : "generate";
        // Build request body
        let requestBody;
        if (mode === "generate") {
            requestBody = {
                prompt,
                mode: "generate",
                chatHistory,
                tableInfo: {
                    tableId: tableContext?.tableId || "new",
                    projectName: tableContext?.projectName || "Untitled",
                    numRows: tableContext?.numRows || 0,
                    numCols: tableContext?.numCols || 0
                }
            };
        } else {
            const { selectedCells, getCellValue, numCols, getColumnLabel } = tableContext;
            const rowsMap = new Map();
            selectedCells.forEach((cellKey)=>{
                const [row, col] = cellKey.split('-').map(Number);
                if (!rowsMap.has(row)) rowsMap.set(row, {});
                const rowData = rowsMap.get(row);
                for(let c = 0; c < numCols; c++){
                    const value = getCellValue(row, c);
                    if (value) rowData[c.toString()] = value;
                }
            });
            const selectedRows = Array.from(rowsMap.entries()).map(([rowIndex, cells])=>({
                    rowIndex,
                    cells
                }));
            const existingColumns = [];
            for(let c = 0; c < numCols; c++)existingColumns.push(getColumnLabel(c));
            requestBody = {
                prompt,
                mode: "enrich",
                chatHistory,
                selectedRows,
                existingColumns,
                tableInfo: {
                    tableId: tableContext.tableId,
                    projectName: tableContext.projectName,
                    numRows: tableContext.numRows,
                    numCols: tableContext.numCols
                }
            };
        }
        try {
            const response = await fetch("/api/ai/scraper", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });
            await readThinkingStream(response, assistantMessageId, (resultData)=>{
                const result = resultData;
                if (!result.success) {
                    setMessages((prev)=>prev.map((m)=>m.id === assistantMessageId ? {
                                ...m,
                                content: `❌ **${mode === "generate" ? "Generation" : "Scraping"} failed**\n\n${result.error || "Unknown error"}`,
                                isStreaming: false
                            } : m));
                    return;
                }
                if (result.mode === "generate" && result.table && onGenerateTable) {
                    onGenerateTable(result.table);
                    const { headers, rows } = result.table;
                    setMessages((prev)=>prev.map((m)=>m.id === assistantMessageId ? {
                                ...m,
                                content: `✅ **Table generated!**\n\n${result.summary || ""}\n\n**Created:** ${rows.length} rows × ${headers.length} columns\n\n**Columns:** ${headers.join(", ")}\n\n*${result.steps} AI steps*`,
                                isStreaming: false
                            } : m));
                } else if (result.mode === "enrich" && result.columns && result.columns.length > 0 && onAddColumns) {
                    onAddColumns(result.columns);
                    const columnNames = result.columns.map((c)=>c.header).join(", ");
                    setMessages((prev)=>prev.map((m)=>m.id === assistantMessageId ? {
                                ...m,
                                content: `✅ **Scraping complete!**\n\n${result.summary || ""}\n\n**Added columns:** ${columnNames}\n\n*${result.steps} AI steps*`,
                                isStreaming: false
                            } : m));
                } else {
                    setMessages((prev)=>prev.map((m)=>m.id === assistantMessageId ? {
                                ...m,
                                content: `⚠️ **No data found**\n\nI couldn't find the requested information. Try being more specific.\n\n${result.summary || ""}`,
                                isStreaming: false
                            } : m));
                }
            });
        } catch (error) {
            console.error("Scraper error:", error);
            setMessages((prev)=>prev.map((m)=>m.id === assistantMessageId ? {
                        ...m,
                        content: `❌ **Error**\n\nFailed to run the scraper agent. ${error instanceof Error ? error.message : "Please try again."}`,
                        isStreaming: false
                    } : m));
        }
    };
    // Handle general-purpose spreadsheet Agent
    const handleAgentTask = async (prompt, assistantMessageId, chatHistory)=>{
        if (!tableContext) {
            setMessages((prev)=>prev.map((m)=>m.id === assistantMessageId ? {
                        ...m,
                        content: "⚠️ **No spreadsheet open**\n\nPlease open a spreadsheet table first.",
                        isStreaming: false
                    } : m));
            return;
        }
        const { numRows, numCols, getCellValue, getColumnLabel, selectedCells, getCellFormatting } = tableContext;
        const cells = {};
        for(let r = 0; r < numRows; r++){
            for(let c = 0; c < numCols; c++){
                const val = getCellValue(r, c);
                if (val) cells[`${r}-${c}`] = val;
            }
        }
        const hasSelection = selectedCells && selectedCells.size > 0;
        const selectedCellsList = [];
        if (hasSelection) {
            selectedCells.forEach((cellKey)=>{
                const [row, col] = cellKey.split('-').map(Number);
                selectedCellsList.push({
                    row,
                    col,
                    colLabel: getColumnLabel(col),
                    value: getCellValue(row, col),
                    formatting: getCellFormatting ? getCellFormatting(row, col) : undefined
                });
            });
            selectedCellsList.sort((a, b)=>a.row !== b.row ? a.row - b.row : a.col - b.col);
        }
        try {
            const response = await fetch("/api/ai/agent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt,
                    cells,
                    numRows,
                    numCols,
                    chatHistory,
                    selectedCells: hasSelection ? selectedCellsList : undefined
                })
            });
            await readThinkingStream(response, assistantMessageId, (resultData)=>{
                const result = resultData;
                if (!result.success) {
                    setMessages((prev)=>prev.map((m)=>m.id === assistantMessageId ? {
                                ...m,
                                content: `❌ **Agent failed**\n\n${result.error || "Unknown error"}`,
                                isStreaming: false
                            } : m));
                    return;
                }
                const hasValueChanges = result.changes && result.changes.length > 0;
                const hasFormatChanges = result.formatting && result.formatting.length > 0;
                if (hasValueChanges && onApplyChanges) onApplyChanges(result.changes, result.newNumRows, result.newNumCols);
                if (hasFormatChanges && onApplyFormatting) onApplyFormatting(result.formatting);
                if (hasValueChanges || hasFormatChanges) {
                    const parts = [
                        `✅ **Done!**\n\n${result.summary}`
                    ];
                    if (hasValueChanges) parts.push(`**Cell edits:** ${result.changes.length}`);
                    if (hasFormatChanges) parts.push(`**Formatting changes:** ${result.formatting.length}`);
                    setMessages((prev)=>prev.map((m)=>m.id === assistantMessageId ? {
                                ...m,
                                content: parts.join('\n'),
                                isStreaming: false
                            } : m));
                } else {
                    setMessages((prev)=>prev.map((m)=>m.id === assistantMessageId ? {
                                ...m,
                                content: `ℹ️ **No changes needed**\n\n${result.summary}`,
                                isStreaming: false
                            } : m));
                }
            });
        } catch (error) {
            console.error("Agent error:", error);
            setMessages((prev)=>prev.map((m)=>m.id === assistantMessageId ? {
                        ...m,
                        content: `❌ **Error**\n\nFailed to run the agent. ${error instanceof Error ? error.message : "Please try again."}`,
                        isStreaming: false
                    } : m));
        }
    };
    // Shared SSE stream reader for agent/scraper — drives ThinkingBox state,
    // then calls onResult with the final data payload.
    const readThinkingStream = async (response, assistantMessageId, onResult)=>{
        const reader = response.body?.getReader();
        if (!reader) return;
        const decoder = new TextDecoder();
        const completedSteps = [];
        let currentActive;
        const pushStep = (content)=>{
            if (currentActive) completedSteps.push(currentActive);
            currentActive = content;
            setMessages((prev)=>prev.map((m)=>m.id === assistantMessageId ? {
                        ...m,
                        thinkingSteps: [
                            ...completedSteps
                        ],
                        activeStep: currentActive,
                        isThinkingDone: false,
                        isStreaming: true
                    } : m));
        };
        try {
            while(true){
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                for (const line of chunk.split('\n')){
                    if (!line.startsWith('data: ')) continue;
                    const data = line.slice(6).trim();
                    if (data === '[DONE]') break;
                    try {
                        const event = JSON.parse(data);
                        if (event.type === 'thinking') {
                            pushStep(event.content);
                        } else if (event.type === 'result') {
                            if (currentActive) completedSteps.push(currentActive);
                            currentActive = undefined;
                            setMessages((prev)=>prev.map((m)=>m.id === assistantMessageId ? {
                                        ...m,
                                        thinkingSteps: [
                                            ...completedSteps
                                        ],
                                        activeStep: undefined,
                                        isThinkingDone: true
                                    } : m));
                            onResult(event.data);
                        } else if (event.type === 'error') {
                            if (currentActive) completedSteps.push(currentActive);
                            setMessages((prev)=>prev.map((m)=>m.id === assistantMessageId ? {
                                        ...m,
                                        content: `❌ **Error**\n\n${event.content}`,
                                        isStreaming: false,
                                        thinkingSteps: [
                                            ...completedSteps
                                        ],
                                        activeStep: undefined,
                                        isThinkingDone: true
                                    } : m));
                        }
                    } catch  {
                    // skip malformed lines
                    }
                }
            }
        } finally{
            reader.releaseLock();
        }
    };
    const handleSendMessage = async ()=>{
        if (!inputValue.trim() || isLoading) return;
        const prompt = inputValue.trim();
        const userMessage = {
            id: Date.now().toString(),
            role: "user",
            content: prompt,
            timestamp: new Date()
        };
        // Build a consistent conversation snapshot so each prompt includes the ongoing chat context.
        const conversationHistory = [
            ...messages,
            userMessage
        ].filter((m)=>(m.role === "user" || m.role === "assistant") && m.content.trim().length > 0).map((m)=>({
                role: m.role,
                content: m.content
            }));
        setMessages((prev)=>[
                ...prev,
                userMessage
            ]);
        setInputValue("");
        setIsLoading(true);
        // Create a placeholder for the assistant message
        const assistantMessageId = (Date.now() + 1).toString();
        setMessages((prev)=>[
                ...prev,
                {
                    id: assistantMessageId,
                    role: "assistant",
                    content: "",
                    timestamp: new Date(),
                    isStreaming: true
                }
            ]);
        // Route to the correct agent
        if (selectedAgent === "Scraper") {
            await handleScraperAgent(userMessage.content, assistantMessageId, conversationHistory);
            setIsLoading(false);
            return;
        }
        if (selectedAgent === "Agent") {
            await handleAgentTask(userMessage.content, assistantMessageId, conversationHistory);
            setIsLoading(false);
            return;
        }
        try {
            const snapshot = buildSpreadsheetSnapshot();
            const response = await fetch("/api/ai/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages: conversationHistory,
                    tableInfo: tableContext ? {
                        tableId: tableContext.tableId,
                        projectName: tableContext.projectName,
                        numRows: tableContext.numRows,
                        numCols: tableContext.numCols
                    } : null,
                    spreadsheetData: snapshot
                })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                const errorMessage = errorData.code === "quota_exceeded" ? "⚠️ OpenAI quota exceeded. The AI service needs billing setup. Contact your admin or try again later." : errorData.code === "invalid_key" ? "⚠️ Invalid API key configuration. Please contact your admin." : "Sorry, the AI service is temporarily unavailable. Please try again.";
                throw new Error(errorMessage);
            }
            // Handle streaming response
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (reader) {
                let fullContent = "";
                while(true){
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value);
                    const lines = chunk.split("\n");
                    for (const line of lines){
                        if (line.startsWith("data: ")) {
                            const data = line.slice(6);
                            if (data === "[DONE]") continue;
                            try {
                                const parsed = JSON.parse(data);
                                if (parsed.content) {
                                    fullContent += parsed.content;
                                    setMessages((prev)=>prev.map((m)=>m.id === assistantMessageId ? {
                                                ...m,
                                                content: fullContent
                                            } : m));
                                }
                            } catch (e) {
                                // Non-JSON data, append as is
                                fullContent += data;
                                setMessages((prev)=>prev.map((m)=>m.id === assistantMessageId ? {
                                            ...m,
                                            content: fullContent
                                        } : m));
                            }
                        }
                    }
                }
                // Mark streaming as complete
                setMessages((prev)=>prev.map((m)=>m.id === assistantMessageId ? {
                            ...m,
                            isStreaming: false
                        } : m));
            }
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage = error instanceof Error ? error.message : "Sorry, I encountered an error. Please try again.";
            setMessages((prev)=>prev.map((m)=>m.id === assistantMessageId ? {
                        ...m,
                        content: errorMessage,
                        isStreaming: false
                    } : m));
        } finally{
            setIsLoading(false);
        }
    };
    const handleKeyDown = (e)=>{
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    const copyToClipboard = async (content, messageId)=>{
        try {
            await navigator.clipboard.writeText(content);
            setCopiedMessageId(messageId);
            setTimeout(()=>setCopiedMessageId(null), 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };
    const clearChat = ()=>{
        createNewChat();
    };
    const regenerateLastResponse = async ()=>{
        // Find the last user message
        const lastUserMessageIndex = messages.findLastIndex((m)=>m.role === "user");
        if (lastUserMessageIndex === -1) return;
        // Remove the last assistant message
        const newMessages = messages.slice(0, lastUserMessageIndex + 1);
        setMessages(newMessages);
        // Resend the last user message
        const lastUserMessage = messages[lastUserMessageIndex];
        setInputValue(lastUserMessage.content);
        // Small delay then send
        setTimeout(()=>{
            setInputValue("");
            handleSendMessage();
        }, 100);
    };
    // Parse markdown-like content for rendering
    const renderMessageContent = (content)=>{
        // Simple markdown parsing
        const lines = content.split('\n');
        return lines.map((line, index)=>{
            // Bold text
            line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            // Inline code
            line = line.replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs">$1</code>');
            // Bullet points
            if (line.startsWith('• ') || line.startsWith('- ')) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                    className: "ml-4 list-disc",
                    dangerouslySetInnerHTML: {
                        __html: line.slice(2)
                    }
                }, index, false, {
                    fileName: "[project]/components/ai-chat-panel.tsx",
                    lineNumber: 912,
                    columnNumber: 11
                }, this);
            }
            // Regular line
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: line ? "" : "h-2",
                dangerouslySetInnerHTML: {
                    __html: line || "&nbsp;"
                }
            }, index, false, {
                fileName: "[project]/components/ai-chat-panel.tsx",
                lineNumber: 917,
                columnNumber: 9
            }, this);
        });
    };
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-ai-chat-panel-root": "true",
        className: `h-full bg-background border-l border-border flex flex-col transition-all duration-300 shrink-0 ${isExpanded ? "w-150" : "w-100"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between border-b border-border px-4 py-3 bg-muted/30",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            showHistory ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "icon",
                                className: "h-8 w-8",
                                onClick: ()=>setShowHistory(false),
                                title: "Back to chat",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                    lineNumber: 942,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat-panel.tsx",
                                lineNumber: 935,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center h-8 w-8 rounded-lg bg-linear-to-br from-primary to-accent",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                    className: "h-4 w-4 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                    lineNumber: 946,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat-panel.tsx",
                                lineNumber: 945,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-sm font-semibold",
                                        children: showHistory ? 'Chat History' : 'GridMind AI'
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                        lineNumber: 950,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: showHistory ? `${chatSessions.length} conversations` : 'Your data assistant'
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                        lineNumber: 951,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat-panel.tsx",
                                lineNumber: 949,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ai-chat-panel.tsx",
                        lineNumber: 933,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1",
                        children: [
                            !showHistory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "icon",
                                        className: "h-8 w-8",
                                        onClick: ()=>setShowHistory(true),
                                        title: "Chat history",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ai-chat-panel.tsx",
                                            lineNumber: 966,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                        lineNumber: 959,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "icon",
                                        className: "h-8 w-8",
                                        onClick: clearChat,
                                        title: "New chat",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SquarePen$3e$__["SquarePen"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ai-chat-panel.tsx",
                                            lineNumber: 975,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                        lineNumber: 968,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "icon",
                                className: "h-8 w-8",
                                onClick: ()=>setIsExpanded(!isExpanded),
                                title: isExpanded ? "Collapse" : "Expand",
                                children: isExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize2$3e$__["Minimize2"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                    lineNumber: 986,
                                    columnNumber: 27
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__["Maximize2"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                    lineNumber: 986,
                                    columnNumber: 63
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat-panel.tsx",
                                lineNumber: 979,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "icon",
                                className: "h-8 w-8",
                                onClick: onClose,
                                title: "Close",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                    lineNumber: 995,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat-panel.tsx",
                                lineNumber: 988,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ai-chat-panel.tsx",
                        lineNumber: 956,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ai-chat-panel.tsx",
                lineNumber: 932,
                columnNumber: 7
            }, this),
            showHistory ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-3 border-b border-border",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            className: "w-full gap-2",
                            onClick: createNewChat,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                    lineNumber: 1010,
                                    columnNumber: 15
                                }, this),
                                "New Chat"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ai-chat-panel.tsx",
                            lineNumber: 1005,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ai-chat-panel.tsx",
                        lineNumber: 1004,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "divide-y divide-border",
                        children: [
                            chatSessions.map((session)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    onClick: ()=>switchToSession(session.id),
                                    className: `p-3 cursor-pointer hover:bg-muted/50 transition-colors group ${session.id === currentSessionId ? 'bg-primary/10' : ''}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start justify-between gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-medium truncate",
                                                        children: session.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                                        lineNumber: 1027,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 mt-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                className: "h-3 w-3 text-muted-foreground"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ai-chat-panel.tsx",
                                                                lineNumber: 1031,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-muted-foreground",
                                                                children: formatRelativeTime(session.updatedAt)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ai-chat-panel.tsx",
                                                                lineNumber: 1032,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-muted-foreground",
                                                                children: [
                                                                    "• ",
                                                                    session.messages.filter((m)=>m.role !== 'system').length,
                                                                    " messages"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ai-chat-panel.tsx",
                                                                lineNumber: 1035,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                                        lineNumber: 1030,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ai-chat-panel.tsx",
                                                lineNumber: 1026,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "icon",
                                                className: "h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity",
                                                onClick: (e)=>deleteSession(session.id, e),
                                                title: "Delete chat",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                    className: "h-3.5 w-3.5 text-muted-foreground hover:text-destructive"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                                    lineNumber: 1047,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-chat-panel.tsx",
                                                lineNumber: 1040,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                        lineNumber: 1025,
                                        columnNumber: 17
                                    }, this)
                                }, session.id, false, {
                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                    lineNumber: 1018,
                                    columnNumber: 15
                                }, this)),
                            chatSessions.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-8 text-center text-muted-foreground",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                        className: "h-8 w-8 mx-auto mb-2 opacity-50"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                        lineNumber: 1055,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm",
                                        children: "No chat history yet"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                        lineNumber: 1056,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs mt-1",
                                        children: "Start a conversation to see it here"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                        lineNumber: 1057,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat-panel.tsx",
                                lineNumber: 1054,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ai-chat-panel.tsx",
                        lineNumber: 1016,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ai-chat-panel.tsx",
                lineNumber: 1002,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    tableContext && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 py-2 bg-primary/5 border-b border-border",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 text-xs text-muted-foreground",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                    className: "h-3 w-3"
                                }, void 0, false, {
                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                    lineNumber: 1068,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        "Context: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-medium text-foreground",
                                            children: tableContext.projectName
                                        }, void 0, false, {
                                            fileName: "[project]/components/ai-chat-panel.tsx",
                                            lineNumber: 1070,
                                            columnNumber: 24
                                        }, this),
                                        " • ",
                                        tableContext.numRows,
                                        " rows × ",
                                        tableContext.numCols,
                                        " cols",
                                        tableContext.selectedCells && tableContext.selectedCells.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-primary",
                                            children: [
                                                " • ",
                                                tableContext.selectedCells.size,
                                                " selected"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ai-chat-panel.tsx",
                                            lineNumber: 1074,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                    lineNumber: 1069,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ai-chat-panel.tsx",
                            lineNumber: 1067,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ai-chat-panel.tsx",
                        lineNumber: 1066,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: messagesContainerRef,
                        className: "flex-1 overflow-y-auto p-4 space-y-4",
                        onScroll: handleScroll,
                        children: [
                            messages.map((message)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `flex gap-3 animate-message-appear ${message.role === "user" ? "flex-row-reverse" : ""}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-linear-to-br from-primary/20 to-accent/20"}`,
                                            children: message.role === "user" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-chat-panel.tsx",
                                                lineNumber: 1099,
                                                columnNumber: 17
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                                                className: "h-4 w-4 text-primary"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-chat-panel.tsx",
                                                lineNumber: 1101,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ai-chat-panel.tsx",
                                            lineNumber: 1093,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `flex-1 max-w-[85%] ${message.role === "user" ? "text-right" : ""}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `rounded-lg px-4 py-2 text-sm ${message.role === "user" ? "inline-block bg-primary text-primary-foreground" : "block w-full bg-muted overflow-hidden"}`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `prose prose-sm max-w-none ${message.role === "user" ? "text-primary-foreground" : ""}`,
                                                        children: [
                                                            (message.thinkingSteps !== undefined || message.activeStep) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThinkingBox, {
                                                                steps: message.thinkingSteps || [],
                                                                activeStep: message.activeStep,
                                                                isDone: message.isThinkingDone || false
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ai-chat-panel.tsx",
                                                                lineNumber: 1117,
                                                                columnNumber: 21
                                                            }, this),
                                                            !message.content && !message.thinkingSteps && !message.activeStep && message.isStreaming ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "flex items-center gap-2 text-muted-foreground italic text-sm",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                        className: "h-3 w-3 animate-spin"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                                                        lineNumber: 1126,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    "Thinking..."
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ai-chat-panel.tsx",
                                                                lineNumber: 1125,
                                                                columnNumber: 21
                                                            }, this) : message.content ? renderMessageContent(message.content) : null,
                                                            message.isStreaming && message.content && !message.thinkingSteps && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "inline-block w-2 h-4 bg-primary animate-pulse ml-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ai-chat-panel.tsx",
                                                                lineNumber: 1134,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                                        lineNumber: 1114,
                                                        columnNumber: 17
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                                    lineNumber: 1107,
                                                    columnNumber: 15
                                                }, this),
                                                message.role === "assistant" && !message.isStreaming && message.content && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1 mt-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            variant: "ghost",
                                                            size: "sm",
                                                            className: "h-6 px-2 text-xs text-muted-foreground hover:text-foreground",
                                                            onClick: ()=>copyToClipboard(message.content, message.id),
                                                            children: copiedMessageId === message.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                        className: "h-3 w-3 mr-1"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                                                        lineNumber: 1150,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    "Copied"
                                                                ]
                                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                                        className: "h-3 w-3 mr-1"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                                                        lineNumber: 1155,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    "Copy"
                                                                ]
                                                            }, void 0, true)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ai-chat-panel.tsx",
                                                            lineNumber: 1142,
                                                            columnNumber: 19
                                                        }, this),
                                                        message === messages[messages.length - 1] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            variant: "ghost",
                                                            size: "sm",
                                                            className: "h-6 px-2 text-xs text-muted-foreground hover:text-foreground",
                                                            onClick: regenerateLastResponse,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                                                    className: "h-3 w-3 mr-1"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                                                    lineNumber: 1167,
                                                                    columnNumber: 23
                                                                }, this),
                                                                "Regenerate"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/ai-chat-panel.tsx",
                                                            lineNumber: 1161,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                                    lineNumber: 1141,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ai-chat-panel.tsx",
                                            lineNumber: 1106,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, message.id, true, {
                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                    lineNumber: 1088,
                                    columnNumber: 11
                                }, this)),
                            isLoading && messages[messages.length - 1]?.content === "" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 text-muted-foreground",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "h-4 w-4 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                        lineNumber: 1180,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm",
                                        children: "Thinking..."
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                        lineNumber: 1181,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat-panel.tsx",
                                lineNumber: 1179,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: messagesEndRef
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat-panel.tsx",
                                lineNumber: 1185,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ai-chat-panel.tsx",
                        lineNumber: 1082,
                        columnNumber: 7
                    }, this),
                    showScrollButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-24 left-1/2 -translate-x-1/2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "secondary",
                            size: "sm",
                            className: "rounded-full shadow-lg",
                            onClick: scrollToBottom,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/components/ai-chat-panel.tsx",
                                lineNumber: 1197,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/ai-chat-panel.tsx",
                            lineNumber: 1191,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ai-chat-panel.tsx",
                        lineNumber: 1190,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 py-2 border-t border-border",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    size: "sm",
                                    className: "h-7 text-xs",
                                    onClick: ()=>setInputValue("Summarize the data in this table"),
                                    children: "Summarize data"
                                }, void 0, false, {
                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                    lineNumber: 1205,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    size: "sm",
                                    className: "h-7 text-xs",
                                    onClick: ()=>setInputValue("Find patterns or anomalies in the selected cells"),
                                    children: "Find patterns"
                                }, void 0, false, {
                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                    lineNumber: 1213,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    size: "sm",
                                    className: "h-7 text-xs",
                                    onClick: ()=>setInputValue("Suggest formulas for calculations"),
                                    children: "Suggest formulas"
                                }, void 0, false, {
                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                    lineNumber: 1221,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ai-chat-panel.tsx",
                            lineNumber: 1204,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ai-chat-panel.tsx",
                        lineNumber: 1203,
                        columnNumber: 7
                    }, this),
                    pendingChanges && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-3 border-t border-border bg-muted/30 px-4 py-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-muted-foreground",
                                        children: "1 file changed"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                        lineNumber: 1236,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-medium text-green-500",
                                        children: [
                                            "+",
                                            pendingChanges.newChanges.length
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                        lineNumber: 1237,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat-panel.tsx",
                                lineNumber: 1235,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        className: "h-7 px-3 bg-teal-500 hover:bg-teal-600 text-white text-xs font-medium",
                                        onClick: onKeepChanges,
                                        children: "Keep"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                        lineNumber: 1240,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        className: "h-7 px-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium",
                                        onClick: onUndoChanges,
                                        children: "Undo"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                        lineNumber: 1247,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-chat-panel.tsx",
                                lineNumber: 1239,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ai-chat-panel.tsx",
                        lineNumber: 1234,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-t border-border p-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-border bg-muted/30 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-3 pb-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        ref: inputRef,
                                        placeholder: "Describe what to build",
                                        value: inputValue,
                                        onChange: (e)=>setInputValue(e.target.value),
                                        onKeyDown: (e)=>{
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        },
                                        disabled: isLoading,
                                        rows: 1,
                                        className: "w-full bg-transparent text-sm resize-none outline-none placeholder:text-muted-foreground min-h-6 max-h-50",
                                        style: {
                                            height: 'auto'
                                        },
                                        onInput: (e)=>{
                                            const target = e.target;
                                            target.style.height = 'auto';
                                            target.style.height = Math.min(target.scrollHeight, 200) + 'px';
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                        lineNumber: 1263,
                                        columnNumber: 13
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                    lineNumber: 1262,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between px-2 pb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "ghost",
                                                    size: "icon",
                                                    className: "h-7 w-7 text-muted-foreground hover:text-foreground",
                                                    title: "Add context",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                                        lineNumber: 1296,
                                                        columnNumber: 17
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                                    lineNumber: 1290,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            variant: "ghost",
                                                            size: "sm",
                                                            className: "h-7 px-2 gap-1 text-muted-foreground hover:text-foreground text-xs",
                                                            onClick: ()=>{
                                                                setShowAgentMenu(!showAgentMenu);
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$at$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AtSign$3e$__["AtSign"], {
                                                                    className: "h-3.5 w-3.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                                                    lineNumber: 1309,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: selectedAgent
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                                                    lineNumber: 1310,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                    className: "h-3 w-3"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                                                    lineNumber: 1311,
                                                                    columnNumber: 19
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/ai-chat-panel.tsx",
                                                            lineNumber: 1301,
                                                            columnNumber: 17
                                                        }, this),
                                                        showAgentMenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute bottom-full left-0 mb-1 w-48 rounded-md border border-border bg-popover p-1 shadow-lg z-50",
                                                            children: [
                                                                "Chat",
                                                                "Agent",
                                                                "Scraper"
                                                            ].map((agent)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    className: `w-full text-left px-3 py-1.5 text-sm rounded hover:bg-muted ${selectedAgent === agent ? "bg-muted text-foreground" : "text-muted-foreground"}`,
                                                                    onClick: ()=>{
                                                                        setSelectedAgent(agent);
                                                                        setShowAgentMenu(false);
                                                                    },
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                children: agent
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ai-chat-panel.tsx",
                                                                                lineNumber: 1328,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            agent === "Scraper" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded",
                                                                                children: "New"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ai-chat-panel.tsx",
                                                                                lineNumber: 1330,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                                                        lineNumber: 1327,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, agent, false, {
                                                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                                                    lineNumber: 1317,
                                                                    columnNumber: 23
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ai-chat-panel.tsx",
                                                            lineNumber: 1315,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                                    lineNumber: 1300,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-muted-foreground",
                                                    children: "GPT-4o"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                                    lineNumber: 1340,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ai-chat-panel.tsx",
                                            lineNumber: 1288,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "ghost",
                                                    size: "icon",
                                                    className: "h-7 w-7 text-muted-foreground hover:text-foreground",
                                                    title: "Settings",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                                        lineNumber: 1351,
                                                        columnNumber: 17
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                                    lineNumber: 1345,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    size: "icon",
                                                    onClick: handleSendMessage,
                                                    disabled: !inputValue.trim() || isLoading,
                                                    className: "h-7 w-7 rounded-md",
                                                    children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                        className: "h-4 w-4 animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                                        lineNumber: 1362,
                                                        columnNumber: 19
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__["ArrowUp"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ai-chat-panel.tsx",
                                                        lineNumber: 1364,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                                    lineNumber: 1355,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ai-chat-panel.tsx",
                                            lineNumber: 1343,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ai-chat-panel.tsx",
                                    lineNumber: 1287,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ai-chat-panel.tsx",
                            lineNumber: 1260,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ai-chat-panel.tsx",
                        lineNumber: 1259,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ai-chat-panel.tsx",
        lineNumber: 925,
        columnNumber: 5
    }, this);
}
_s1(AIChatPanel, "GWMMR0Cnlnj/yJ6UQBVfspv1jQ8=");
_c1 = AIChatPanel;
var _c, _c1;
__turbopack_context__.k.register(_c, "ThinkingBox");
__turbopack_context__.k.register(_c1, "AIChatPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/convex/_generated/api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api,
    "components",
    ()=>components,
    "internal",
    ()=>internal
]);
/* eslint-disable */ /**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/server/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/server/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$components$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/server/components/index.js [app-client] (ecmascript) <locals>");
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["anyApi"];
const internal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["anyApi"];
const components = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$server$2f$components$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["componentsGeneric"])();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/use-spreadsheet-sync.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSpreadsheetSync",
    ()=>useSpreadsheetSync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/client.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/convex/_generated/api.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function useSpreadsheetSync({ tableId, userId, initialName = "Untitled Project" }) {
    _s();
    const [spreadsheetId, setSpreadsheetId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastSaved, setLastSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Convex mutations
    const getOrCreateSpreadsheet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].spreadsheets.getOrCreateSpreadsheet);
    const updateCell = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].spreadsheets.updateCell);
    const updateCellsBatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].spreadsheets.updateCellsBatch);
    const updateMetadata = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].spreadsheets.updateSpreadsheetMetadata);
    const updateCellFormattingMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].spreadsheets.updateCellFormatting);
    const updateColumnWidthMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].spreadsheets.updateColumnWidth);
    const updateRowHeightMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].spreadsheets.updateRowHeight);
    const resetSpreadsheetMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].spreadsheets.resetSpreadsheet);
    const updateColumnNamesBatchMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].spreadsheets.updateColumnNamesBatch);
    // Convex queries - real-time subscriptions
    const spreadsheet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].spreadsheets.getSpreadsheet, tableId ? {
        tableId
    } : "skip");
    const cells = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].spreadsheets.getCells, spreadsheetId ? {
        spreadsheetId
    } : "skip");
    const cellFormatting = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].spreadsheets.getCellFormatting, spreadsheetId ? {
        spreadsheetId
    } : "skip");
    const columnWidths = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].spreadsheets.getColumnWidths, spreadsheetId ? {
        spreadsheetId
    } : "skip");
    const rowHeights = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].spreadsheets.getRowHeights, spreadsheetId ? {
        spreadsheetId
    } : "skip");
    const columnNames = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].spreadsheets.getColumnNames, spreadsheetId ? {
        spreadsheetId
    } : "skip");
    // Debounce refs for batching updates
    const pendingCellUpdates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const debounceTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Initialize spreadsheet
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSpreadsheetSync.useEffect": ()=>{
            if (!tableId || !userId) return;
            const init = {
                "useSpreadsheetSync.useEffect.init": async ()=>{
                    setIsLoading(true);
                    try {
                        const id = await getOrCreateSpreadsheet({
                            tableId,
                            userId,
                            name: initialName
                        });
                        setSpreadsheetId(id);
                    } catch (error) {
                        console.error("Failed to initialize spreadsheet:", error);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["useSpreadsheetSync.useEffect.init"];
            init();
        }
    }["useSpreadsheetSync.useEffect"], [
        tableId,
        userId,
        initialName,
        getOrCreateSpreadsheet
    ]);
    // Set spreadsheetId when query returns
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSpreadsheetSync.useEffect": ()=>{
            if (spreadsheet?._id) {
                setSpreadsheetId(spreadsheet._id);
                setIsLoading(false);
            }
        }
    }["useSpreadsheetSync.useEffect"], [
        spreadsheet
    ]);
    // Flush pending cell updates
    const flushCellUpdates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSpreadsheetSync.useCallback[flushCellUpdates]": async ()=>{
            if (!spreadsheetId || pendingCellUpdates.current.size === 0) return;
            setIsSaving(true);
            try {
                const updates = Array.from(pendingCellUpdates.current.entries()).map({
                    "useSpreadsheetSync.useCallback[flushCellUpdates].updates": ([cellKey, value])=>({
                            cellKey,
                            value
                        })
                }["useSpreadsheetSync.useCallback[flushCellUpdates].updates"]);
                pendingCellUpdates.current.clear();
                await updateCellsBatch({
                    spreadsheetId,
                    cells: updates
                });
                setLastSaved(new Date());
            } catch (error) {
                console.error("Failed to save cells:", error);
            } finally{
                setIsSaving(false);
            }
        }
    }["useSpreadsheetSync.useCallback[flushCellUpdates]"], [
        spreadsheetId,
        updateCellsBatch
    ]);
    // Debounced cell update
    const setCellValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSpreadsheetSync.useCallback[setCellValue]": (row, col, value)=>{
            if (!spreadsheetId) return;
            const cellKey = `${row}-${col}`;
            pendingCellUpdates.current.set(cellKey, value);
            // Clear existing timer
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            // Set new timer to flush updates after 300ms of inactivity
            debounceTimerRef.current = setTimeout({
                "useSpreadsheetSync.useCallback[setCellValue]": ()=>{
                    flushCellUpdates();
                }
            }["useSpreadsheetSync.useCallback[setCellValue]"], 300);
        }
    }["useSpreadsheetSync.useCallback[setCellValue]"], [
        spreadsheetId,
        flushCellUpdates
    ]);
    // Immediate cell update (for important changes)
    const setCellValueImmediate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSpreadsheetSync.useCallback[setCellValueImmediate]": async (row, col, value)=>{
            if (!spreadsheetId) return;
            setIsSaving(true);
            try {
                await updateCell({
                    spreadsheetId,
                    cellKey: `${row}-${col}`,
                    value
                });
                setLastSaved(new Date());
            } catch (error) {
                console.error("Failed to save cell:", error);
            } finally{
                setIsSaving(false);
            }
        }
    }["useSpreadsheetSync.useCallback[setCellValueImmediate]"], [
        spreadsheetId,
        updateCell
    ]);
    // Batch update cells (for paste, import operations)
    const setCellsBatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSpreadsheetSync.useCallback[setCellsBatch]": async (cellUpdates)=>{
            if (!spreadsheetId) return;
            setIsSaving(true);
            try {
                const updates = Object.entries(cellUpdates).map({
                    "useSpreadsheetSync.useCallback[setCellsBatch].updates": ([cellKey, value])=>({
                            cellKey,
                            value
                        })
                }["useSpreadsheetSync.useCallback[setCellsBatch].updates"]);
                await updateCellsBatch({
                    spreadsheetId,
                    cells: updates
                });
                setLastSaved(new Date());
            } catch (error) {
                console.error("Failed to batch save cells:", error);
            } finally{
                setIsSaving(false);
            }
        }
    }["useSpreadsheetSync.useCallback[setCellsBatch]"], [
        spreadsheetId,
        updateCellsBatch
    ]);
    // Update spreadsheet metadata
    const setMetadata = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSpreadsheetSync.useCallback[setMetadata]": async (updates)=>{
            if (!spreadsheetId) return;
            try {
                await updateMetadata({
                    spreadsheetId,
                    ...updates
                });
            } catch (error) {
                console.error("Failed to update metadata:", error);
            }
        }
    }["useSpreadsheetSync.useCallback[setMetadata]"], [
        spreadsheetId,
        updateMetadata
    ]);
    // Update cell formatting
    const setCellFormatting = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSpreadsheetSync.useCallback[setCellFormatting]": async (row, col, formatting)=>{
            if (!spreadsheetId) return;
            // Convex v.optional() rejects null — strip null/undefined values and coerce types
            const sanitized = {};
            if (formatting.bold != null) sanitized.bold = Boolean(formatting.bold);
            if (formatting.italic != null) sanitized.italic = Boolean(formatting.italic);
            if (formatting.underline != null) sanitized.underline = Boolean(formatting.underline);
            if (formatting.alignment != null) sanitized.alignment = formatting.alignment;
            if (formatting.textColor != null) sanitized.textColor = String(formatting.textColor);
            if (formatting.backgroundColor != null) sanitized.backgroundColor = String(formatting.backgroundColor);
            if (formatting.fontSize != null) sanitized.fontSize = Number(formatting.fontSize);
            try {
                await updateCellFormattingMutation({
                    spreadsheetId,
                    cellKey: `${row}-${col}`,
                    formatting: sanitized
                });
            } catch (error) {
                console.error("Failed to update cell formatting:", error);
            }
        }
    }["useSpreadsheetSync.useCallback[setCellFormatting]"], [
        spreadsheetId,
        updateCellFormattingMutation
    ]);
    // Update column width
    const setColumnWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSpreadsheetSync.useCallback[setColumnWidth]": async (colIndex, width)=>{
            if (!spreadsheetId) return;
            try {
                await updateColumnWidthMutation({
                    spreadsheetId,
                    colIndex,
                    width
                });
            } catch (error) {
                console.error("Failed to update column width:", error);
            }
        }
    }["useSpreadsheetSync.useCallback[setColumnWidth]"], [
        spreadsheetId,
        updateColumnWidthMutation
    ]);
    // Update row height
    const setRowHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSpreadsheetSync.useCallback[setRowHeight]": async (rowIndex, height)=>{
            if (!spreadsheetId) return;
            try {
                await updateRowHeightMutation({
                    spreadsheetId,
                    rowIndex,
                    height
                });
            } catch (error) {
                console.error("Failed to update row height:", error);
            }
        }
    }["useSpreadsheetSync.useCallback[setRowHeight]"], [
        spreadsheetId,
        updateRowHeightMutation
    ]);
    // Reset all spreadsheet data to defaults
    const resetAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSpreadsheetSync.useCallback[resetAll]": async (defaultNumRows = 10, defaultNumCols = 5)=>{
            if (!spreadsheetId) return;
            try {
                await resetSpreadsheetMutation({
                    spreadsheetId,
                    defaultNumRows,
                    defaultNumCols
                });
            } catch (error) {
                console.error("Failed to reset spreadsheet:", error);
            }
        }
    }["useSpreadsheetSync.useCallback[resetAll]"], [
        spreadsheetId,
        resetSpreadsheetMutation
    ]);
    // Flush on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSpreadsheetSync.useEffect": ()=>{
            return ({
                "useSpreadsheetSync.useEffect": ()=>{
                    if (debounceTimerRef.current) {
                        clearTimeout(debounceTimerRef.current);
                    }
                    // Flush remaining updates synchronously
                    if (pendingCellUpdates.current.size > 0) {
                        flushCellUpdates();
                    }
                }
            })["useSpreadsheetSync.useEffect"];
        }
    }["useSpreadsheetSync.useEffect"], [
        flushCellUpdates
    ]);
    // Flush before page unload
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSpreadsheetSync.useEffect": ()=>{
            const handleBeforeUnload = {
                "useSpreadsheetSync.useEffect.handleBeforeUnload": ()=>{
                    if (pendingCellUpdates.current.size > 0) {
                        // Use sendBeacon for reliable last-minute saves
                        flushCellUpdates();
                    }
                }
            }["useSpreadsheetSync.useEffect.handleBeforeUnload"];
            window.addEventListener("beforeunload", handleBeforeUnload);
            return ({
                "useSpreadsheetSync.useEffect": ()=>window.removeEventListener("beforeunload", handleBeforeUnload)
            })["useSpreadsheetSync.useEffect"];
        }
    }["useSpreadsheetSync.useEffect"], [
        flushCellUpdates
    ]);
    // Stabilize objects to prevent new references on every render
    const stableCells = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSpreadsheetSync.useMemo[stableCells]": ()=>cells ?? {}
    }["useSpreadsheetSync.useMemo[stableCells]"], [
        JSON.stringify(cells)
    ]);
    const stableCellFormatting = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSpreadsheetSync.useMemo[stableCellFormatting]": ()=>cellFormatting ?? {}
    }["useSpreadsheetSync.useMemo[stableCellFormatting]"], [
        JSON.stringify(cellFormatting)
    ]);
    const stableColumnWidths = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSpreadsheetSync.useMemo[stableColumnWidths]": ()=>columnWidths ?? {}
    }["useSpreadsheetSync.useMemo[stableColumnWidths]"], [
        JSON.stringify(columnWidths)
    ]);
    const stableRowHeights = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSpreadsheetSync.useMemo[stableRowHeights]": ()=>rowHeights ?? {}
    }["useSpreadsheetSync.useMemo[stableRowHeights]"], [
        JSON.stringify(rowHeights)
    ]);
    const stableColumnNames = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSpreadsheetSync.useMemo[stableColumnNames]": ()=>columnNames ?? {}
    }["useSpreadsheetSync.useMemo[stableColumnNames]"], [
        JSON.stringify(columnNames)
    ]);
    // Batch update column names (upsert)
    const setColumnNamesBatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSpreadsheetSync.useCallback[setColumnNamesBatch]": async (names)=>{
            if (!spreadsheetId) return;
            try {
                const entries = Object.entries(names).map({
                    "useSpreadsheetSync.useCallback[setColumnNamesBatch].entries": ([colIndex, name])=>({
                            colIndex: Number(colIndex),
                            name
                        })
                }["useSpreadsheetSync.useCallback[setColumnNamesBatch].entries"]);
                await updateColumnNamesBatchMutation({
                    spreadsheetId,
                    names: entries
                });
            } catch (error) {
                console.error("Failed to save column names:", error);
            }
        }
    }["useSpreadsheetSync.useCallback[setColumnNamesBatch]"], [
        spreadsheetId,
        updateColumnNamesBatchMutation
    ]);
    return {
        // State
        spreadsheetId,
        isLoading,
        isSaving,
        lastSaved,
        // Real-time data from Convex (stabilized)
        cells: stableCells,
        cellFormatting: stableCellFormatting,
        columnWidths: stableColumnWidths,
        rowHeights: stableRowHeights,
        columnNames: stableColumnNames,
        isColumnNamesReady: columnNames !== undefined,
        spreadsheet: spreadsheet ?? null,
        // Actions
        setCellValue,
        setCellValueImmediate,
        setCellsBatch,
        setMetadata,
        setCellFormatting,
        setColumnWidth,
        setRowHeight,
        setColumnNamesBatch,
        resetAll,
        flushCellUpdates
    };
}
_s(useSpreadsheetSync, "NDJJoJ1ez65CaC/Iox9iIp58sk0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dashboard/tables/[id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TableEditorPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/theme-toggle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$csv$2d$export$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/csv-export.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$csv$2d$import$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/csv-import.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$text$2d$formatting$2d$toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/text-formatting-toolbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$chat$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ai-chat-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$spreadsheet$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-spreadsheet-sync.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/share-2.js [app-client] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/funnel.js [app-client] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up-down.js [app-client] (ecmascript) <export default as ArrowUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$columns$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Columns3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/columns-3.js [app-client] (ecmascript) <export default as Columns3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud.js [app-client] (ecmascript) <export default as Cloud>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link-2.js [app-client] (ecmascript) <export default as Link2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$type$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Type$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/type.js [app-client] (ecmascript) <export default as Type>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitMerge$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/git-merge.js [app-client] (ecmascript) <export default as GitMerge>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wand$2d$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wand2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wand-sparkles.js [app-client] (ecmascript) <export default as Wand2>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
const getColumnLabel = (index)=>{
    let label = "";
    let num = index;
    while(num >= 0){
        label = String.fromCharCode(65 + num % 26) + label;
        num = Math.floor(num / 26) - 1;
    }
    return label;
};
const detectFieldType = (values)=>{
    const nonEmpty = values.filter((v)=>v && v.trim() !== "" && v.trim() !== "N/A");
    if (nonEmpty.length === 0) return "Text";
    if (nonEmpty.every((v)=>/^https?:\/\//i.test(v.trim()))) return "URL";
    if (nonEmpty.every((v)=>/^(true|false|yes|no)$/i.test(v.trim()))) return "Boolean";
    if (nonEmpty.every((v)=>{
        const cleaned = v.replace(/[$,%]/g, "").trim();
        return cleaned !== "" && !isNaN(Number(cleaned));
    })) return "Number";
    if (nonEmpty.every((v)=>{
        const d = Date.parse(v);
        return !isNaN(d) && /\d{4}|\d{1,2}[\/\-]\d{1,2}/.test(v);
    })) return "Date";
    return "Text";
};
function TableEditorPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const tableId = params?.id || "default";
    const userId = user?.id || "anonymous";
    // Real-time sync with Convex
    const sync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$spreadsheet$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpreadsheetSync"])({
        tableId,
        userId,
        initialName: "Untitled Project"
    });
    // Local state that syncs with Convex
    const [projectName, setProjectNameLocal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Untitled Project");
    const [numRows, setNumRowsLocal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [numCols, setNumColsLocal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [cells, setCellsLocal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [columnWidths, setColumnWidthsLocal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        0: 150
    });
    const [rowHeights, setRowHeightsLocal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [cellFormatting, setCellFormattingState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    // UI state (not synced)
    const [selectedCell, setSelectedCell] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedCells, setSelectedCells] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [isSelecting, setIsSelecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectionStart, setSelectionStart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editingCell, setEditingCell] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mergedCells, setMergedCells] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [sortColumn, setSortColumn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sortOrder, setSortOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("asc");
    const [showCopyNotification, setShowCopyNotification] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isInitialized, setIsInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Search state
    const [showSearch, setShowSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [searchResults, setSearchResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [currentSearchIndex, setCurrentSearchIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // Filter state
    const [showFilter, setShowFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filteredRows, setFilteredRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // AI Chat state
    const [showAIChat, setShowAIChat] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Loopster-style column names, editing state, autorun
    const [colNames, setColNames] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        0: "Input"
    });
    const [editingColName, setEditingColName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [autorun, setAutorun] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Column header menu
    const [colMenuOpen, setColMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [colMenuName, setColMenuName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("") // editable name inside menu
    ;
    const [colTypeExpanded, setColTypeExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [colColumnType, setColColumnType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        0: "User Input"
    });
    const [colFieldType, setColFieldType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        0: "Text"
    });
    const [hiddenCols, setHiddenCols] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const colMenuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Add-column panel
    const [showAddColPanel, setShowAddColPanel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newColName, setNewColName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [newColColumnType, setNewColColumnType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("User Input");
    const [newColFieldType, setNewColFieldType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Text");
    const [newColTypeExpanded, setNewColTypeExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [newColSearch, setNewColSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [newColAIPrompt, setNewColAIPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [newColTab, setNewColTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("All");
    const addColPanelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Add-column: configure step
    const [newColStep, setNewColStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("browse");
    const [newColConfigPrompt, setNewColConfigPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [newColSourceCol, setNewColSourceCol] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [newColRegex, setNewColRegex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isGeneratingCol, setIsGeneratingCol] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Delete All confirmation
    const [showDeleteAllConfirm, setShowDeleteAllConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // AI Pending Changes state (for keep/undo feature)
    const [pendingAIChanges, setPendingAIChanges] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const resizingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const editInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const searchInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clipboardRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const selectedCellsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(selectedCells);
    const selectedCellRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(selectedCell);
    const cellsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(cells);
    const editingCellRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(editingCell);
    const pastePendingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Initialize local state from Convex data
    // Wait for both spreadsheet metadata AND columnNames query to be ready
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TableEditorPage.useEffect": ()=>{
            if (!isInitialized && sync.spreadsheet && sync.isColumnNamesReady) {
                setCellsLocal(sync.cells);
                setCellFormattingState(sync.cellFormatting);
                setColumnWidthsLocal(sync.columnWidths);
                setRowHeightsLocal(sync.rowHeights);
                setNumRowsLocal(sync.spreadsheet.numRows || 1);
                setNumColsLocal(sync.spreadsheet.numCols || 1);
                setProjectNameLocal(sync.spreadsheet.name || "Untitled Project");
                // Load persisted column names (may be empty for new spreadsheets)
                if (Object.keys(sync.columnNames).length > 0) {
                    setColNames(sync.columnNames);
                }
                setIsInitialized(true);
            }
        }
    }["TableEditorPage.useEffect"], [
        sync.spreadsheet,
        sync.cells,
        sync.columnNames,
        sync.isColumnNamesReady,
        isInitialized
    ]);
    // Keep cells in sync with Convex (real-time updates from other clients)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TableEditorPage.useEffect": ()=>{
            if (isInitialized) {
                setCellsLocal(sync.cells);
            }
        }
    }["TableEditorPage.useEffect"], [
        sync.cells,
        isInitialized
    ]);
    // Wrapped setters that sync to Convex
    const setCells = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TableEditorPage.useCallback[setCells]": (newCells)=>{
            if (typeof newCells === 'function') {
                setCellsLocal({
                    "TableEditorPage.useCallback[setCells]": (prev)=>{
                        const updated = newCells(prev);
                        // Sync changed cells to Convex
                        const changedCells = {};
                        for (const key of Object.keys(updated)){
                            if (updated[key] !== prev[key]) {
                                changedCells[key] = updated[key];
                            }
                        }
                        if (Object.keys(changedCells).length > 0) {
                            sync.setCellsBatch(changedCells);
                        }
                        return updated;
                    }
                }["TableEditorPage.useCallback[setCells]"]);
            } else {
                setCellsLocal(newCells);
                sync.setCellsBatch(newCells);
            }
        }
    }["TableEditorPage.useCallback[setCells]"], [
        sync
    ]);
    const setNumRows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TableEditorPage.useCallback[setNumRows]": (rows)=>{
            setNumRowsLocal(rows);
            sync.setMetadata({
                numRows: rows
            });
        }
    }["TableEditorPage.useCallback[setNumRows]"], [
        sync
    ]);
    const setNumCols = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TableEditorPage.useCallback[setNumCols]": (cols)=>{
            setNumColsLocal(cols);
            sync.setMetadata({
                numCols: cols
            });
        }
    }["TableEditorPage.useCallback[setNumCols]"], [
        sync
    ]);
    const setProjectName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TableEditorPage.useCallback[setProjectName]": (name)=>{
            setProjectNameLocal(name);
            sync.setMetadata({
                name
            });
        }
    }["TableEditorPage.useCallback[setProjectName]"], [
        sync
    ]);
    const setColumnWidths = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TableEditorPage.useCallback[setColumnWidths]": (widths)=>{
            if (typeof widths === 'function') {
                setColumnWidthsLocal({
                    "TableEditorPage.useCallback[setColumnWidths]": (prev)=>{
                        const updated = widths(prev);
                        // Find changed columns and sync
                        for (const key of Object.keys(updated)){
                            const colIndex = parseInt(key);
                            if (updated[colIndex] !== prev[colIndex]) {
                                sync.setColumnWidth(colIndex, updated[colIndex]);
                            }
                        }
                        return updated;
                    }
                }["TableEditorPage.useCallback[setColumnWidths]"]);
            } else {
                setColumnWidthsLocal(widths);
                for (const [key, value] of Object.entries(widths)){
                    sync.setColumnWidth(parseInt(key), value);
                }
            }
        }
    }["TableEditorPage.useCallback[setColumnWidths]"], [
        sync
    ]);
    const setRowHeights = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TableEditorPage.useCallback[setRowHeights]": (heights)=>{
            if (typeof heights === 'function') {
                setRowHeightsLocal({
                    "TableEditorPage.useCallback[setRowHeights]": (prev)=>{
                        const updated = heights(prev);
                        // Find changed rows and sync
                        for (const key of Object.keys(updated)){
                            const rowIndex = parseInt(key);
                            if (updated[rowIndex] !== prev[rowIndex]) {
                                sync.setRowHeight(rowIndex, updated[rowIndex]);
                            }
                        }
                        return updated;
                    }
                }["TableEditorPage.useCallback[setRowHeights]"]);
            } else {
                setRowHeightsLocal(heights);
                for (const [key, value] of Object.entries(heights)){
                    sync.setRowHeight(parseInt(key), value);
                }
            }
        }
    }["TableEditorPage.useCallback[setRowHeights]"], [
        sync
    ]);
    // Helper function to calculate optimal column width based on content
    const calculateOptimalWidth = (colIndex)=>{
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) return 150;
        context.font = "14px system-ui, -apple-system, sans-serif"; // Match the app's font size
        // Get the column header label width
        const headerLabel = getColumnLabel(colIndex);
        const headerWidth = context.measureText(headerLabel).width + 20 // Add padding
        ;
        // Get the maximum width of all cells in the column
        let maxCellWidth = 0;
        for(let row = 0; row < numRows; row++){
            const cellValue = getCellValue(row, colIndex);
            const cellWidth = context.measureText(cellValue).width + 16 // Add padding for cell content
            ;
            maxCellWidth = Math.max(maxCellWidth, cellWidth);
        }
        // Return the maximum of header and cell widths, with a minimum of 50px and maximum of 500px
        return Math.min(500, Math.max(50, Math.max(headerWidth, maxCellWidth)));
    };
    // Helper function to calculate optimal row height based on content
    const calculateOptimalHeight = (rowIndex)=>{
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) return 36;
        context.font = "14px system-ui, -apple-system, sans-serif";
        // Get the maximum height needed for text in this row
        let maxHeight = 24 // Minimum height
        ;
        for(let col = 0; col < numCols; col++){
            const cellValue = getCellValue(rowIndex, col);
            // Rough estimation: approximately 14px per line, assuming width constraint
            const lines = Math.max(1, Math.ceil(cellValue.length / 30));
            const estimatedHeight = lines * 18 + 8 // 18px per line + padding
            ;
            maxHeight = Math.max(maxHeight, estimatedHeight);
        }
        // Return height with minimum of 24px and maximum of 200px
        return Math.min(200, Math.max(24, maxHeight));
    };
    const onMouseDown = (e, colIndex)=>{
        e.preventDefault();
        resizingRef.current = {
            col: colIndex,
            startPos: e.pageX,
            startSize: columnWidths[colIndex] || 150
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };
    const onRowMouseDown = (e, rowIndex)=>{
        e.preventDefault();
        resizingRef.current = {
            row: rowIndex,
            startPos: e.pageY,
            startSize: rowHeights[rowIndex] || 36
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };
    const onColumnHeaderDoubleClick = (colIndex)=>{
        const optimalWidth = calculateOptimalWidth(colIndex);
        setColumnWidths((prev)=>({
                ...prev,
                [colIndex]: optimalWidth
            }));
    };
    const onRowHeaderDoubleClick = (rowIndex)=>{
        const optimalHeight = calculateOptimalHeight(rowIndex);
        setRowHeights((prev)=>({
                ...prev,
                [rowIndex]: optimalHeight
            }));
    };
    const onMouseMove = (e)=>{
        if (!resizingRef.current) return;
        if (resizingRef.current.col !== undefined) {
            const deltaX = e.pageX - resizingRef.current.startPos;
            const newWidth = Math.max(50, resizingRef.current.startSize + deltaX);
            setColumnWidths((prev)=>({
                    ...prev,
                    [resizingRef.current.col]: newWidth
                }));
        } else if (resizingRef.current.row !== undefined) {
            const deltaY = e.pageY - resizingRef.current.startPos;
            const newHeight = Math.max(24, resizingRef.current.startSize + deltaY);
            setRowHeights((prev)=>({
                    ...prev,
                    [resizingRef.current.row]: newHeight
                }));
        }
    };
    const onMouseUp = ()=>{
        resizingRef.current = null;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TableEditorPage.useEffect": ()=>{
            return ({
                "TableEditorPage.useEffect": ()=>{
                    document.removeEventListener("mousemove", onMouseMove);
                    document.removeEventListener("mouseup", onMouseUp);
                }
            })["TableEditorPage.useEffect"];
        }
    }["TableEditorPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TableEditorPage.useEffect": ()=>{
            if (editingCell && editInputRef.current) {
                editInputRef.current.focus();
            }
        }
    }["TableEditorPage.useEffect"], [
        editingCell
    ]);
    // Function ref that always has fresh values
    const handlePasteRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        "TableEditorPage.useRef[handlePasteRef]": ()=>{}
    }["TableEditorPage.useRef[handlePasteRef]"]);
    // Update the paste function whenever cells changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TableEditorPage.useEffect": ()=>{
            handlePasteRef.current = ({
                "TableEditorPage.useEffect": ()=>{
                    if (!clipboardRef.current || !selectedCellRef.current) return;
                    const { cells: clipboardCells, minRow, minCol } = clipboardRef.current;
                    const { row: pasteRow, col: pasteCol } = selectedCellRef.current;
                    console.log('INSIDE handlePasteRef - cells:', cells);
                    const rowOffset = pasteRow - minRow;
                    const colOffset = pasteCol - minCol;
                    const newCells = {
                        ...cells
                    } // Use current cells state, not ref
                    ;
                    Object.entries(clipboardCells).forEach({
                        "TableEditorPage.useEffect": ([key, value])=>{
                            const [origRow, origCol] = key.split('-').map(Number);
                            const newRow = origRow + rowOffset;
                            const newCol = origCol + colOffset;
                            if (newRow >= 0 && newCol >= 0) {
                                newCells[`${newRow}-${newCol}`] = value;
                            }
                        }
                    }["TableEditorPage.useEffect"]);
                    console.log('Pasted cells:', newCells);
                    setCells(newCells);
                }
            })["TableEditorPage.useEffect"];
        }
    }["TableEditorPage.useEffect"], [
        cells
    ]); // Update whenever cells changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TableEditorPage.useEffect": ()=>{
            selectedCellsRef.current = selectedCells;
            selectedCellRef.current = selectedCell;
            cellsRef.current = cells;
            editingCellRef.current = editingCell;
        }
    }["TableEditorPage.useEffect"], [
        selectedCells,
        selectedCell,
        cells,
        editingCell
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TableEditorPage.useEffect": ()=>{
            const handleKeyDown = {
                "TableEditorPage.useEffect.handleKeyDown": (e)=>{
                    if (!editingCellRef.current && (e.ctrlKey || e.metaKey)) {
                        if (e.key === 'i' || e.key === 'I') {
                            e.preventDefault();
                            setShowAIChat({
                                "TableEditorPage.useEffect.handleKeyDown": (prev)=>!prev
                            }["TableEditorPage.useEffect.handleKeyDown"]);
                        } else if (e.key === 'f' || e.key === 'F') {
                            e.preventDefault();
                            setShowSearch({
                                "TableEditorPage.useEffect.handleKeyDown": (prev)=>{
                                    if (!prev) {
                                        setTimeout({
                                            "TableEditorPage.useEffect.handleKeyDown": ()=>searchInputRef.current?.focus()
                                        }["TableEditorPage.useEffect.handleKeyDown"], 100);
                                    }
                                    return true;
                                }
                            }["TableEditorPage.useEffect.handleKeyDown"]);
                        } else if (e.key === 'c' || e.key === 'C') {
                            e.preventDefault();
                            // Inline copy logic
                            console.log('Copy pressed, selectedCells size:', selectedCellsRef.current.size, 'selectedCell:', selectedCellRef.current);
                            if (selectedCellsRef.current.size === 0 || !selectedCellRef.current) {
                                console.log('No cells selected');
                                return;
                            }
                            const selectedArray = Array.from(selectedCellsRef.current).map({
                                "TableEditorPage.useEffect.handleKeyDown.selectedArray": (key)=>{
                                    const [row, col] = key.split('-').map(Number);
                                    return {
                                        row,
                                        col
                                    };
                                }
                            }["TableEditorPage.useEffect.handleKeyDown.selectedArray"]);
                            const minRow = Math.min(...selectedArray.map({
                                "TableEditorPage.useEffect.handleKeyDown.minRow": (c)=>c.row
                            }["TableEditorPage.useEffect.handleKeyDown.minRow"]));
                            const maxRow = Math.max(...selectedArray.map({
                                "TableEditorPage.useEffect.handleKeyDown.maxRow": (c)=>c.row
                            }["TableEditorPage.useEffect.handleKeyDown.maxRow"]));
                            const minCol = Math.min(...selectedArray.map({
                                "TableEditorPage.useEffect.handleKeyDown.minCol": (c)=>c.col
                            }["TableEditorPage.useEffect.handleKeyDown.minCol"]));
                            const maxCol = Math.max(...selectedArray.map({
                                "TableEditorPage.useEffect.handleKeyDown.maxCol": (c)=>c.col
                            }["TableEditorPage.useEffect.handleKeyDown.maxCol"]));
                            const clipboardData = {};
                            selectedArray.forEach({
                                "TableEditorPage.useEffect.handleKeyDown": ({ row, col })=>{
                                    const cellKey = `${row}-${col}`;
                                    clipboardData[cellKey] = cellsRef.current[cellKey] || "";
                                }
                            }["TableEditorPage.useEffect.handleKeyDown"]);
                            console.log('Copied cells:', clipboardData);
                            clipboardRef.current = {
                                cells: clipboardData,
                                minRow,
                                minCol,
                                maxRow,
                                maxCol
                            };
                            console.log('Clipboard stored in ref:', clipboardRef.current);
                            setShowCopyNotification(true);
                            setTimeout({
                                "TableEditorPage.useEffect.handleKeyDown": ()=>setShowCopyNotification(false)
                            }["TableEditorPage.useEffect.handleKeyDown"], 2000);
                        } else if (e.key === 'v' || e.key === 'V') {
                            e.preventDefault();
                            console.log('Paste pressed');
                            handlePasteRef.current();
                        }
                    }
                }
            }["TableEditorPage.useEffect.handleKeyDown"];
            document.addEventListener('keydown', handleKeyDown);
            return ({
                "TableEditorPage.useEffect": ()=>document.removeEventListener('keydown', handleKeyDown)
            })["TableEditorPage.useEffect"];
        }
    }["TableEditorPage.useEffect"], []);
    const getCellValue = (row, col)=>{
        return cells[`${row}-${col}`] || "";
    };
    const setCellValue = (row, col, value)=>{
        const cellKey = `${row}-${col}`;
        setCellsLocal((prev)=>({
                ...prev,
                [cellKey]: value
            }));
        sync.setCellValue(row, col, value);
    };
    const handleCellClick = (row, col, e)=>{
        console.log('handleCellClick called:', {
            row,
            col
        });
        const cellKey = `${row}-${col}`;
        if (e?.ctrlKey || e?.metaKey) {
            // Ctrl+Click: Toggle individual cell in selection
            setSelectedCells((prev)=>{
                const newSelection = new Set(prev);
                if (newSelection.has(cellKey)) {
                    newSelection.delete(cellKey);
                } else {
                    newSelection.add(cellKey);
                }
                console.log('After ctrl+click, selectedCells:', newSelection);
                return newSelection;
            });
            setSelectedCell({
                row,
                col
            });
            setEditingCell(null);
        } else if (e?.shiftKey && selectedCell) {
            // Shift+Click: Select range from last selected to current cell
            const newSelection = new Set();
            const minRow = Math.min(selectedCell.row, row);
            const maxRow = Math.max(selectedCell.row, row);
            const minCol = Math.min(selectedCell.col, col);
            const maxCol = Math.max(selectedCell.col, col);
            for(let r = minRow; r <= maxRow; r++){
                for(let c = minCol; c <= maxCol; c++){
                    newSelection.add(`${r}-${c}`);
                }
            }
            setSelectedCells(newSelection);
            setSelectedCell({
                row,
                col
            });
            setEditingCell(null);
        } else {
            // Single click: if already editing another cell, move editing to this cell.
            // Otherwise just select it.
            setSelectedCell({
                row,
                col
            });
            setSelectedCells(new Set([
                cellKey
            ]));
            if (editingCellRef.current) {
                setEditingCell({
                    row,
                    col
                });
            } else {
                setEditingCell(null);
            }
        }
    };
    const handleCellDoubleClick = (row, col)=>{
        // Double-click: Enter edit mode
        setSelectedCell({
            row,
            col
        });
        setSelectedCells(new Set([
            `${row}-${col}`
        ]));
        setEditingCell({
            row,
            col
        });
    };
    const handleCellMouseDown = (row, col, e)=>{
        if (!e?.ctrlKey && !e?.metaKey && !e?.shiftKey) {
            setIsSelecting(true);
            setSelectionStart({
                row,
                col
            });
            setSelectedCell({
                row,
                col
            });
            setSelectedCells(new Set([
                `${row}-${col}`
            ]));
            // Starting a drag-selection always exits editing mode
            if (editingCellRef.current && (editingCellRef.current.row !== row || editingCellRef.current.col !== col)) {
                setEditingCell(null);
            }
        }
    };
    const handleCellMouseEnter = (row, col)=>{
        if (isSelecting && selectionStart) {
            const minRow = Math.min(selectionStart.row, row);
            const maxRow = Math.max(selectionStart.row, row);
            const minCol = Math.min(selectionStart.col, col);
            const maxCol = Math.max(selectionStart.col, col);
            const newSelection = new Set();
            for(let r = minRow; r <= maxRow; r++){
                for(let c = minCol; c <= maxCol; c++){
                    newSelection.add(`${r}-${c}`);
                }
            }
            console.log('After drag, selectedCells:', newSelection);
            setSelectedCells(newSelection);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TableEditorPage.useEffect": ()=>{
            const handleMouseUp = {
                "TableEditorPage.useEffect.handleMouseUp": ()=>{
                    setIsSelecting(false);
                }
            }["TableEditorPage.useEffect.handleMouseUp"];
            document.addEventListener("mouseup", handleMouseUp);
            return ({
                "TableEditorPage.useEffect": ()=>document.removeEventListener("mouseup", handleMouseUp)
            })["TableEditorPage.useEffect"];
        }
    }["TableEditorPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TableEditorPage.useEffect": ()=>{
            const handleDocumentMouseDown = {
                "TableEditorPage.useEffect.handleDocumentMouseDown": (event)=>{
                    const target = event.target;
                    if (!(target instanceof Node)) return;
                    const elementTarget = target instanceof Element ? target : null;
                    // Deselect only when user clicks the top navigation/header bar.
                    const clickedTopNav = !!elementTarget?.closest("[data-top-nav='true']");
                    if (!clickedTopNav) {
                        return;
                    }
                    if (selectedCellsRef.current.size > 0 || selectedCellRef.current) {
                        setSelectedCells(new Set());
                        setSelectedCell(null);
                        setEditingCell(null);
                    }
                }
            }["TableEditorPage.useEffect.handleDocumentMouseDown"];
            document.addEventListener("mousedown", handleDocumentMouseDown);
            return ({
                "TableEditorPage.useEffect": ()=>document.removeEventListener("mousedown", handleDocumentMouseDown)
            })["TableEditorPage.useEffect"];
        }
    }["TableEditorPage.useEffect"], []);
    // Close column menu when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TableEditorPage.useEffect": ()=>{
            if (colMenuOpen === null) return;
            const handler = {
                "TableEditorPage.useEffect.handler": (e)=>{
                    if (colMenuRef.current && !colMenuRef.current.contains(e.target)) {
                        setColMenuOpen(null);
                    }
                }
            }["TableEditorPage.useEffect.handler"];
            document.addEventListener("mousedown", handler);
            return ({
                "TableEditorPage.useEffect": ()=>document.removeEventListener("mousedown", handler)
            })["TableEditorPage.useEffect"];
        }
    }["TableEditorPage.useEffect"], [
        colMenuOpen
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TableEditorPage.useEffect": ()=>{
            if (!showAddColPanel) return;
            const handler = {
                "TableEditorPage.useEffect.handler": (e)=>{
                    if (addColPanelRef.current && !addColPanelRef.current.contains(e.target)) {
                        setShowAddColPanel(false);
                    }
                }
            }["TableEditorPage.useEffect.handler"];
            document.addEventListener("mousedown", handler);
            return ({
                "TableEditorPage.useEffect": ()=>document.removeEventListener("mousedown", handler)
            })["TableEditorPage.useEffect"];
        }
    }["TableEditorPage.useEffect"], [
        showAddColPanel
    ]);
    const handleCellKeyDown = (e, row, col)=>{
        // When a cell is selected and user starts typing, enter edit mode
        if (!editingCell && selectedCell?.row === row && selectedCell?.col === col) {
            if (e.key === "Enter") {
                e.preventDefault();
                setEditingCell({
                    row,
                    col
                });
            } else if (e.key !== "Tab" && e.key !== "Escape" && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.key.length === 1) {
                // Any printable character: Enter edit mode
                e.preventDefault();
                setEditingCell({
                    row,
                    col
                });
            // The character will be added by the input field's onChange after it mounts
            }
        } else if (editingCell?.row === row && editingCell?.col === col) {
            // Already editing
            if (e.key === "Enter") {
                setEditingCell(null);
                if (row < numRows - 1) {
                    setSelectedCell({
                        row: row + 1,
                        col
                    });
                }
            } else if (e.key === "Tab") {
                e.preventDefault();
                setEditingCell(null);
                if (col < numCols - 1) {
                    setSelectedCell({
                        row,
                        col: col + 1
                    });
                }
            } else if (e.key === "Escape") {
                setEditingCell(null);
            }
        }
    };
    const handleDeleteAll = async ()=>{
        const defaultRows = 1;
        const defaultCols = 1;
        // Reset ALL local state immediately for instant UI response
        setCellsLocal({});
        setCellFormattingState({});
        setColumnWidthsLocal({});
        setRowHeightsLocal({});
        setMergedCells({});
        setNumRowsLocal(defaultRows);
        setNumColsLocal(defaultCols);
        setSelectedCell(null);
        setSelectedCells(new Set());
        setEditingCell(null);
        setFilters([]);
        setFilteredRows(null);
        setSortColumn(null);
        setSortOrder("asc");
        setPendingAIChanges(null);
        setShowDeleteAllConfirm(false);
        // Persist full reset to DB: deletes all cells, formatting, column widths,
        // row heights and resets numRows/numCols to defaults
        await sync.resetAll(defaultRows, defaultCols);
        // Force re-initialisation from the now-clean DB state so every piece of
        // local state (including columnWidths, rowHeights, formatting) is guaranteed
        // to match the database after the reset
        setIsInitialized(false);
    };
    const handleAddRow = ()=>{
        setNumRows(numRows + 1);
    };
    const handleAddMultipleRows = (count)=>{
        if (count > 0) {
            setNumRows(numRows + count);
        }
    };
    const handleAddColumn = ()=>{
        setNewColName("");
        setNewColColumnType("User Input");
        setNewColFieldType("Text");
        setNewColTypeExpanded(true);
        setNewColSearch("");
        setNewColAIPrompt("");
        setNewColTab("All");
        setNewColStep("browse");
        setNewColConfigPrompt("");
        setNewColSourceCol(0);
        setNewColRegex("");
        setShowAddColPanel(true);
    };
    // Types that need a configure step before adding
    const COL_TYPES_NEED_CONFIG = [
        "AI Agent",
        "AI Web",
        "Scrape Website",
        "Regex",
        "Normalize Company",
        "Read File"
    ];
    const confirmAddColumn = (colType = newColColumnType)=>{
        if (COL_TYPES_NEED_CONFIG.includes(colType)) {
            setNewColColumnType(colType);
            setNewColConfigPrompt("");
            setNewColStep("configure");
            return;
        }
        doAddColumn(colType, newColName.trim() || colType, "", 0, "");
    };
    const doAddColumn = (colType, colName, configPrompt, sourceCol, regex)=>{
        const newColIdx = numCols;
        setColNames((prev)=>({
                ...prev,
                [newColIdx]: colName || colType
            }));
        setColColumnType((prev)=>({
                ...prev,
                [newColIdx]: colType
            }));
        setColFieldType((prev)=>({
                ...prev,
                [newColIdx]: newColFieldType
            }));
        setNumCols(numCols + 1);
        setShowAddColPanel(false);
        setNewColStep("browse");
        // For AI-powered column types, run generation immediately after adding
        if ([
            "AI Agent",
            "AI Web"
        ].includes(colType) && configPrompt) {
            runAIColumn(newColIdx, colType, configPrompt, sourceCol);
        } else if (colType === "Scrape Website") {
            runScrapeColumn(newColIdx, sourceCol);
        } else if (colType === "Regex") {
            runRegexColumn(newColIdx, sourceCol, regex);
        } else if (colType === "Normalize Company" || colType === "Normalize Domain") {
            runNormalizeColumn(newColIdx, colType, sourceCol);
        }
    };
    // Read an SSE stream from /api/ai/agent and resolve with the result payload
    const readAgentSSE = (response)=>new Promise((resolve)=>{
            const reader = response.body?.getReader();
            if (!reader) {
                resolve(null);
                return;
            }
            const decoder = new TextDecoder();
            let result = null;
            const pump = async ()=>{
                try {
                    while(true){
                        const { done, value } = await reader.read();
                        if (done) break;
                        for (const line of decoder.decode(value).split('\n')){
                            if (!line.startsWith('data: ')) continue;
                            const raw = line.slice(6).trim();
                            if (raw === '[DONE]') break;
                            try {
                                const evt = JSON.parse(raw);
                                if (evt.type === 'result') result = evt.data;
                            } catch  {}
                        }
                    }
                } finally{
                    reader.releaseLock();
                    resolve(result);
                }
            };
            pump();
        });
    const generateAIColumnFromPrompt = async ()=>{
        if (!newColAIPrompt.trim()) return;
        setIsGeneratingCol(true);
        try {
            // Build spreadsheet context
            const cells = {};
            for(let r = 0; r < numRows; r++){
                for(let c = 0; c < numCols; c++){
                    const v = getCellValue(r, c);
                    if (v) cells[`${r}-${c}`] = v;
                }
            }
            const agentPrompt = `Add a new column at column index ${numCols} (column ${getColumnLabel(numCols)}). For each row 0 to ${numRows - 1}, generate a value based on this instruction: "${newColAIPrompt}". Use existing column values as context. Return cell changes for every row in the new column.`;
            const res = await fetch("/api/ai/agent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt: agentPrompt,
                    cells,
                    numRows,
                    numCols
                })
            });
            if (!res.ok) throw new Error("AI request failed");
            const result = await readAgentSSE(res);
            if (result?.changes?.length) {
                // Derive column name from prompt (first 4 words)
                const autoName = newColAIPrompt.trim().split(/\s+/).slice(0, 4).join(" ");
                const colName = newColName.trim() || autoName;
                setColNames((prev)=>({
                        ...prev,
                        [numCols]: colName
                    }));
                setColColumnType((prev)=>({
                        ...prev,
                        [numCols]: "AI Agent"
                    }));
                setColFieldType((prev)=>({
                        ...prev,
                        [numCols]: "Text"
                    }));
                setNumCols(numCols + 1);
                // Apply the AI-generated cell changes
                const updates = {};
                result.changes.forEach((ch)=>{
                    updates[`${ch.row}-${ch.col}`] = ch.value;
                });
                setCells((prev)=>({
                        ...prev,
                        ...updates
                    }));
                await sync.setCellsBatch(updates);
            }
        } catch (e) {
            console.error("AI column generation failed", e);
        } finally{
            setIsGeneratingCol(false);
            setShowAddColPanel(false);
            setNewColStep("browse");
        }
    };
    const runColumn = async (colIdx, colType, prompt1, sourceCol, regex = "")=>{
        const cellsSnapshot = {};
        for(let r = 0; r < numRows; r++)for(let c = 0; c < numCols; c++){
            const v = getCellValue(r, c);
            if (v) cellsSnapshot[`${r}-${c}`] = v;
        }
        // If cells are selected, scope to those rows only (exclude header row 0)
        const selectedRowSet = new Set();
        for (const key of selectedCells){
            const row = parseInt(key.split("-")[0], 10);
            if (row > 0) selectedRowSet.add(row);
        }
        const selectedRows = selectedRowSet.size > 0 ? Array.from(selectedRowSet).sort((a, b)=>a - b) : undefined;
        try {
            const res = await fetch("/api/ai/run-column", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    colIdx,
                    colType,
                    prompt: prompt1,
                    sourceCol,
                    regex,
                    cells: cellsSnapshot,
                    numRows,
                    numCols,
                    selectedRows
                })
            });
            if (!res.ok) return;
            const reader = res.body?.getReader();
            if (!reader) return;
            const dec = new TextDecoder();
            try {
                while(true){
                    const { done, value } = await reader.read();
                    if (done) break;
                    for (const line of dec.decode(value).split('\n')){
                        if (!line.startsWith('data: ')) continue;
                        const raw = line.slice(6).trim();
                        if (raw === '[DONE]') break;
                        try {
                            const evt = JSON.parse(raw);
                            if (evt.type === 'result' && evt.data?.updates) {
                                const updates = evt.data.updates;
                                if (Object.keys(updates).length) {
                                    setCells((prev)=>({
                                            ...prev,
                                            ...updates
                                        }));
                                    await sync.setCellsBatch(updates);
                                }
                            }
                        } catch  {}
                    }
                }
            } finally{
                reader.releaseLock();
            }
        } catch (e) {
            console.error("runColumn failed", e);
        }
    };
    const runAIColumn = (colIdx, colType, prompt1, sourceCol)=>runColumn(colIdx, colType, prompt1, sourceCol);
    const runScrapeColumn = (colIdx, sourceCol)=>runColumn(colIdx, "Scrape Website", "", sourceCol);
    const runRegexColumn = (colIdx, sourceCol, pattern)=>runColumn(colIdx, "Regex", "", sourceCol, pattern);
    const runNormalizeColumn = (colIdx, colType, sourceCol)=>runColumn(colIdx, colType, "", sourceCol);
    // Open column header menu
    const openColMenu = (colIndex)=>{
        setColMenuOpen(colIndex);
        setColMenuName(colNames[colIndex] ?? "Input");
        setColTypeExpanded(true);
    };
    // Save column name from menu
    const saveColMenu = (colIndex)=>{
        if (colMenuName.trim()) {
            setColNames((prev)=>({
                    ...prev,
                    [colIndex]: colMenuName.trim()
                }));
            sync.setColumnNamesBatch({
                [colIndex]: colMenuName.trim()
            });
        }
        setColMenuOpen(null);
    };
    // Sort column ASC / DESC from header menu
    const sortColFromMenu = (colIndex, order)=>{
        const rowIndices = Array.from({
            length: numRows
        }, (_, i)=>i);
        rowIndices.sort((a, b)=>{
            const vA = getCellValue(a, colIndex).toLowerCase();
            const vB = getCellValue(b, colIndex).toLowerCase();
            const nA = parseFloat(vA), nB = parseFloat(vB);
            const cmp = !isNaN(nA) && !isNaN(nB) ? nA - nB : vA.localeCompare(vB);
            return order === "asc" ? cmp : -cmp;
        });
        const newCells = {};
        const newFormatting = {};
        rowIndices.forEach((oldRow, newRow)=>{
            for(let col = 0; col < numCols; col++){
                const v = getCellValue(oldRow, col);
                if (v) newCells[`${newRow}-${col}`] = v;
                const fmt = cellFormatting[`${oldRow}-${col}`];
                if (fmt && Object.keys(fmt).length) newFormatting[`${newRow}-${col}`] = fmt;
            }
        });
        setCells(newCells);
        setCellFormattingState(newFormatting);
        setSortColumn(colIndex);
        setSortOrder(order);
        setColMenuOpen(null);
    };
    // Duplicate column
    const duplicateColumn = (colIndex)=>{
        const insertAt = colIndex + 1;
        // Shift existing columns right
        const newCells = {};
        const newFormatting = {};
        const newColNames = {};
        const newColColumnType = {};
        const newColFieldType = {};
        for(let row = 0; row < numRows; row++){
            for(let col = 0; col < numCols; col++){
                const targetCol = col < insertAt ? col : col + 1;
                const v = getCellValue(row, col);
                if (v) newCells[`${row}-${targetCol}`] = v;
                const fmt = cellFormatting[`${row}-${col}`];
                if (fmt && Object.keys(fmt).length) newFormatting[`${row}-${targetCol}`] = fmt;
            }
            // copy duplicated col
            const v = getCellValue(row, colIndex);
            if (v) newCells[`${row}-${insertAt}`] = v;
            const fmt = cellFormatting[`${row}-${colIndex}`];
            if (fmt && Object.keys(fmt).length) newFormatting[`${row}-${insertAt}`] = fmt;
        }
        for(let col = 0; col < numCols; col++){
            const targetCol = col < insertAt ? col : col + 1;
            newColNames[targetCol] = colNames[col] ?? `Column ${col + 1}`;
            newColColumnType[targetCol] = colColumnType[col] ?? "User Input";
            newColFieldType[targetCol] = colFieldType[col] ?? "Text";
        }
        newColNames[insertAt] = (colNames[colIndex] ?? "Input") + " (copy)";
        newColColumnType[insertAt] = colColumnType[colIndex] ?? "User Input";
        newColFieldType[insertAt] = colFieldType[colIndex] ?? "Text";
        setCellsLocal(newCells);
        setCellFormattingState(newFormatting);
        setColNames(newColNames);
        setColColumnType(newColColumnType);
        setColFieldType(newColFieldType);
        setNumCols(numCols + 1);
        setColMenuOpen(null);
    };
    // Clear all values in a column
    const clearColumn = (colIndex)=>{
        const newCells = {
            ...cells
        };
        for(let row = 0; row < numRows; row++){
            delete newCells[`${row}-${colIndex}`];
        }
        setCells(newCells);
        setColMenuOpen(null);
    };
    // Delete a column (shift remaining columns left)
    const deleteColumn = (colIndex)=>{
        if (numCols <= 1) return;
        const newCells = {};
        const newFormatting = {};
        const newColNames = {};
        const newColColumnType = {};
        const newColFieldType = {};
        for(let row = 0; row < numRows; row++){
            for(let col = 0; col < numCols; col++){
                if (col === colIndex) continue;
                const newCol = col < colIndex ? col : col - 1;
                const v = getCellValue(row, col);
                if (v) newCells[`${row}-${newCol}`] = v;
                const fmt = cellFormatting[`${row}-${col}`];
                if (fmt && Object.keys(fmt).length) newFormatting[`${row}-${newCol}`] = fmt;
            }
        }
        for(let col = 0; col < numCols; col++){
            if (col === colIndex) continue;
            const newCol = col < colIndex ? col : col - 1;
            newColNames[newCol] = colNames[col] ?? `Column ${col + 1}`;
            newColColumnType[newCol] = colColumnType[col] ?? "User Input";
            newColFieldType[newCol] = colFieldType[col] ?? "Text";
        }
        setCellsLocal(newCells);
        setCellFormattingState(newFormatting);
        setColNames(newColNames);
        setColColumnType(newColColumnType);
        setColFieldType(newColFieldType);
        setNumCols(numCols - 1);
        setColMenuOpen(null);
    };
    // Toggle hide column
    const toggleHideColumn = (colIndex)=>{
        setHiddenCols((prev)=>{
            const next = new Set(prev);
            if (next.has(colIndex)) next.delete(colIndex);
            else next.add(colIndex);
            return next;
        });
        setColMenuOpen(null);
    };
    // Add filter for column from menu
    const filterColumn = (colIndex)=>{
        setFilters((prev)=>[
                ...prev,
                {
                    column: colIndex,
                    value: "",
                    operator: "contains"
                }
            ]);
        setShowFilter(true);
        setColMenuOpen(null);
    };
    const handleDeduplicate = ()=>{
        // Create a Set to track seen rows
        const seenRows = new Set();
        const newCells = {};
        const newFormatting = {};
        let newRowIndex = 0;
        let duplicatesRemoved = 0;
        // Iterate through each row
        for(let row = 0; row < numRows; row++){
            // Get all cell values for this row
            const rowData = [];
            for(let col = 0; col < numCols; col++){
                rowData.push(getCellValue(row, col));
            }
            const rowKey = JSON.stringify(rowData);
            // Check if we've seen this row before
            if (!seenRows.has(rowKey)) {
                seenRows.add(rowKey);
                // Copy cells to new row index
                for(let col = 0; col < numCols; col++){
                    const oldKey = `${row}-${col}`;
                    const newKey = `${newRowIndex}-${col}`;
                    const value = getCellValue(row, col);
                    if (value) {
                        newCells[newKey] = value;
                    }
                    // Copy formatting
                    const oldFormat = cellFormatting[oldKey];
                    if (oldFormat && Object.keys(oldFormat).length > 0) {
                        newFormatting[newKey] = oldFormat;
                    }
                }
                newRowIndex++;
            } else {
                duplicatesRemoved++;
            }
        }
        // Update state
        setNumRows(newRowIndex);
        setCells(newCells);
        setCellFormattingState(newFormatting);
        setSelectedCell(null);
        setSelectedCells(new Set());
        // Show feedback
        if (duplicatesRemoved > 0) {
            alert(`Removed ${duplicatesRemoved} duplicate row(s). Total rows: ${newRowIndex}`);
        } else {
            alert('No duplicate rows found.');
        }
    };
    const handleSort = ()=>{
        if (numCols === 0 || numRows === 0) {
            alert('No data to sort');
            return;
        }
        const columnInput = prompt(`Enter column to sort by (A-${getColumnLabel(numCols - 1)}):`, sortColumn !== null ? getColumnLabel(sortColumn) : 'A');
        if (!columnInput) return;
        // Convert column letter to index
        let colIndex = 0;
        for(let i = 0; i < columnInput.length; i++){
            colIndex = colIndex * 26 + (columnInput.charCodeAt(i) - 64);
        }
        colIndex = colIndex - 1;
        if (colIndex < 0 || colIndex >= numCols) {
            alert(`Invalid column. Please enter a column between A and ${getColumnLabel(numCols - 1)}`);
            return;
        }
        // Check if we're sorting the same column
        const newSortOrder = sortColumn === colIndex && sortOrder === "asc" ? "desc" : "asc";
        // Create array of rows with their original indices
        const rowIndices = Array.from({
            length: numRows
        }, (_, i)=>i);
        // Sort rows based on column values
        rowIndices.sort((rowA, rowB)=>{
            const valueA = getCellValue(rowA, colIndex).toLowerCase();
            const valueB = getCellValue(rowB, colIndex).toLowerCase();
            // Try numeric comparison first
            const numA = parseFloat(valueA);
            const numB = parseFloat(valueB);
            let comparison = 0;
            if (!isNaN(numA) && !isNaN(numB)) {
                comparison = numA - numB;
            } else {
                comparison = valueA.localeCompare(valueB);
            }
            return newSortOrder === "asc" ? comparison : -comparison;
        });
        // Reorganize cells and formatting based on sorted order
        const newCells = {};
        const newFormatting = {};
        rowIndices.forEach((oldRowIndex, newRowIndex)=>{
            for(let col = 0; col < numCols; col++){
                const oldKey = `${oldRowIndex}-${col}`;
                const newKey = `${newRowIndex}-${col}`;
                const value = getCellValue(oldRowIndex, col);
                if (value) {
                    newCells[newKey] = value;
                }
                const oldFormat = cellFormatting[oldKey];
                if (oldFormat && Object.keys(oldFormat).length > 0) {
                    newFormatting[newKey] = oldFormat;
                }
            }
        });
        setCells(newCells);
        setCellFormattingState(newFormatting);
        setSortColumn(colIndex);
        setSortOrder(newSortOrder);
        setSelectedCell(null);
        setSelectedCells(new Set());
        const orderText = newSortOrder === "asc" ? "ascending" : "descending";
        alert(`Sorted by column ${getColumnLabel(colIndex)} in ${orderText} order`);
    };
    // Search functionality
    const handleSearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TableEditorPage.useCallback[handleSearch]": (term)=>{
            setSearchTerm(term);
            if (!term.trim()) {
                setSearchResults([]);
                setCurrentSearchIndex(0);
                return;
            }
            const results = [];
            const lowerTerm = term.toLowerCase();
            for(let row = 0; row < numRows; row++){
                for(let col = 0; col < numCols; col++){
                    const cellValue = getCellValue(row, col).toLowerCase();
                    if (cellValue.includes(lowerTerm)) {
                        results.push({
                            row,
                            col
                        });
                    }
                }
            }
            setSearchResults(results);
            setCurrentSearchIndex(0);
            // Navigate to first result
            if (results.length > 0) {
                setSelectedCell(results[0]);
                setSelectedCells(new Set([
                    `${results[0].row}-${results[0].col}`
                ]));
            }
        }
    }["TableEditorPage.useCallback[handleSearch]"], [
        numRows,
        numCols,
        cells
    ]);
    const navigateSearchResult = (direction)=>{
        if (searchResults.length === 0) return;
        let newIndex = currentSearchIndex;
        if (direction === 'next') {
            newIndex = (currentSearchIndex + 1) % searchResults.length;
        } else {
            newIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length;
        }
        setCurrentSearchIndex(newIndex);
        const result = searchResults[newIndex];
        setSelectedCell(result);
        setSelectedCells(new Set([
            `${result.row}-${result.col}`
        ]));
    };
    const toggleSearch = ()=>{
        setShowSearch((prev)=>{
            if (!prev) {
                // Opening search, focus input after render
                setTimeout(()=>searchInputRef.current?.focus(), 100);
            } else {
                // Closing search, clear search state
                setSearchTerm("");
                setSearchResults([]);
                setCurrentSearchIndex(0);
            }
            return !prev;
        });
    };
    const isSearchMatch = (row, col)=>{
        return searchResults.some((r)=>r.row === row && r.col === col);
    };
    const isCurrentSearchMatch = (row, col)=>{
        if (searchResults.length === 0) return false;
        const current = searchResults[currentSearchIndex];
        return current?.row === row && current?.col === col;
    };
    // Filter functionality
    const applyFilters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TableEditorPage.useCallback[applyFilters]": ()=>{
            if (filters.length === 0) {
                setFilteredRows(null);
                return;
            }
            const matchingRows = [];
            for(let row = 0; row < numRows; row++){
                let rowMatches = true;
                for (const filter of filters){
                    const cellValue = getCellValue(row, filter.column).toLowerCase();
                    const filterValue = filter.value.toLowerCase();
                    switch(filter.operator){
                        case 'contains':
                            if (!cellValue.includes(filterValue)) rowMatches = false;
                            break;
                        case 'equals':
                            if (cellValue !== filterValue) rowMatches = false;
                            break;
                        case 'not-contains':
                            if (cellValue.includes(filterValue)) rowMatches = false;
                            break;
                        case 'not-equals':
                            if (cellValue === filterValue) rowMatches = false;
                            break;
                    }
                    if (!rowMatches) break;
                }
                if (rowMatches) {
                    matchingRows.push(row);
                }
            }
            setFilteredRows(matchingRows);
        }
    }["TableEditorPage.useCallback[applyFilters]"], [
        filters,
        numRows,
        numCols,
        cells
    ]);
    // Apply filters when filters change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TableEditorPage.useEffect": ()=>{
            applyFilters();
        }
    }["TableEditorPage.useEffect"], [
        filters,
        applyFilters
    ]);
    const addFilter = ()=>{
        setFilters((prev)=>[
                ...prev,
                {
                    column: 0,
                    value: "",
                    operator: "contains"
                }
            ]);
    };
    const updateFilter = (index, updates)=>{
        setFilters((prev)=>prev.map((f, i)=>i === index ? {
                    ...f,
                    ...updates
                } : f));
    };
    const removeFilter = (index)=>{
        setFilters((prev)=>prev.filter((_, i)=>i !== index));
    };
    const clearAllFilters = ()=>{
        setFilters([]);
        setFilteredRows(null);
    };
    const handleImportCSVData = (importedCells, rows, cols)=>{
        setNumCols(cols);
        setNumRows(rows);
        setCells(importedCells);
    // Preserve existing cell formatting on import
    };
    const handleClearAll = async ()=>{
        if (!confirm("Clear all data from the spreadsheet? This cannot be undone.")) return;
        // Reset local state immediately
        setCells({});
        setNumRows(1);
        setNumCols(1);
        setCellFormattingState({});
        setMergedCells({});
        setFilters([]);
        setFilteredRows(null);
        setSelectedCell(null);
        setSelectedCells(new Set());
        // Persist the reset to the backend so it survives refresh
        await sync.resetAll(1, 1);
    };
    const getCellFormatting = (row, col)=>{
        return cellFormatting[`${row}-${col}`] || {};
    };
    const setCellFormatting = (row, col, format)=>{
        setCellFormattingState((prev)=>({
                ...prev,
                [`${row}-${col}`]: format
            }));
        // Sync formatting to Convex
        sync.setCellFormatting(row, col, format);
    };
    const mergeCells = ()=>{
        if (selectedCells.size === 0) return;
        // Convert selected cells to array and find bounds
        const cellArray = Array.from(selectedCells).map((key)=>{
            const [row, col] = key.split('-').map(Number);
            return {
                row,
                col
            };
        });
        const startRow = Math.min(...cellArray.map((c)=>c.row));
        const endRow = Math.max(...cellArray.map((c)=>c.row));
        const startCol = Math.min(...cellArray.map((c)=>c.col));
        const endCol = Math.max(...cellArray.map((c)=>c.col));
        const rowSpan = endRow - startRow + 1;
        const colSpan = endCol - startCol + 1;
        setMergedCells((prev)=>({
                ...prev,
                [`${startRow}-${startCol}`]: {
                    rowSpan,
                    colSpan
                }
            }));
        // Clear selection
        setSelectedCell({
            row: startRow,
            col: startCol
        });
        setSelectedCells(new Set([
            `${startRow}-${startCol}`
        ]));
    };
    const unmergeCells = ()=>{
        if (!selectedCell) return;
        const key = `${selectedCell.row}-${selectedCell.col}`;
        setMergedCells((prev)=>{
            const newMerged = {
                ...prev
            };
            delete newMerged[key];
            return newMerged;
        });
    };
    const isCellMerged = (row, col)=>{
        return !!mergedCells[`${row}-${col}`];
    };
    const getMergeInfo = (row, col)=>{
        return mergedCells[`${row}-${col}`] || {
            rowSpan: 1,
            colSpan: 1
        };
    };
    const isRangeSelected = ()=>{
        return selectedCells.size > 1;
    };
    const isInSelectedRange = (row, col)=>{
        return selectedCells.has(`${row}-${col}`);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-screen bg-background",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col flex-1 min-w-0 transition-all duration-300",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "data-top-nav": "true",
                        className: "flex items-center gap-2 border-b border-border px-4 py-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "icon",
                                className: "shrink-0",
                                onClick: ()=>router.push("/dashboard/tables"),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    width: "18",
                                    height: "18",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "2",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "m15 18-6-6 6-6"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                        lineNumber: 1452,
                                        columnNumber: 189
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                    lineNumber: 1452,
                                    columnNumber: 11
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                lineNumber: 1451,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                value: projectName,
                                onChange: (e)=>setProjectName(e.target.value),
                                className: "h-8 max-w-xs border-none bg-transparent px-1 text-sm font-medium focus-visible:ring-1",
                                placeholder: "Untitled Project"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                lineNumber: 1454,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "ml-auto flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1.5 text-xs text-muted-foreground",
                                        children: [
                                            sync.isSaving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                className: "h-3.5 w-3.5 animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                lineNumber: 1463,
                                                columnNumber: 15
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"], {
                                                className: "h-3.5 w-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                lineNumber: 1465,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: sync.isSaving ? "Saving..." : "Saved"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                lineNumber: 1467,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                        lineNumber: 1461,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeToggle"], {}, void 0, false, {
                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                        lineNumber: 1469,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground cursor-pointer",
                                        children: user?.email?.[0]?.toUpperCase() || 'U'
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                        lineNumber: 1470,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                lineNumber: 1460,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                        lineNumber: 1450,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 border-b border-border px-4 py-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$csv$2d$import$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CSVImport"], {
                                onImport: handleImportCSVData
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                lineNumber: 1482,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$csv$2d$export$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CSVExport"], {
                                projectName: projectName,
                                numRows: numRows,
                                numCols: numCols,
                                getCellValue: getCellValue,
                                getColumnLabel: getColumnLabel
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                lineNumber: 1483,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-4 w-px bg-border"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                lineNumber: 1490,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: showFilter ? "secondary" : "ghost",
                                size: "sm",
                                className: "gap-2",
                                onClick: ()=>setShowFilter(!showFilter),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                        lineNumber: 1497,
                                        columnNumber: 11
                                    }, this),
                                    "Filter",
                                    filters.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "rounded-full bg-primary px-1.5 text-xs text-primary-foreground",
                                        children: filters.length
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                        lineNumber: 1500,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                lineNumber: 1491,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                className: "gap-2",
                                onClick: handleSort,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                        lineNumber: 1506,
                                        columnNumber: 11
                                    }, this),
                                    "Sort"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                lineNumber: 1505,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                className: "gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$columns$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Columns3$3e$__["Columns3"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                        lineNumber: 1510,
                                        columnNumber: 11
                                    }, this),
                                    "Columns"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                lineNumber: 1509,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                className: "gap-2",
                                onClick: handleDeduplicate,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                        lineNumber: 1514,
                                        columnNumber: 11
                                    }, this),
                                    "Dedupe"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                lineNumber: 1513,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                className: "gap-2 text-destructive hover:text-destructive",
                                onClick: handleClearAll,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        width: "16",
                                        height: "16",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M3 6h18"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                lineNumber: 1519,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                lineNumber: 1519,
                                                columnNumber: 32
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                lineNumber: 1519,
                                                columnNumber: 81
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "10",
                                                y1: "11",
                                                x2: "10",
                                                y2: "17"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                lineNumber: 1520,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "14",
                                                y1: "11",
                                                x2: "14",
                                                y2: "17"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                lineNumber: 1520,
                                                columnNumber: 52
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                        lineNumber: 1518,
                                        columnNumber: 11
                                    }, this),
                                    "Clear All"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                lineNumber: 1517,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: showSearch ? "secondary" : "ghost",
                                size: "sm",
                                className: "gap-2",
                                onClick: toggleSearch,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                        lineNumber: 1530,
                                        columnNumber: 11
                                    }, this),
                                    "Search",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                        className: "pointer-events-none ml-1 hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex",
                                        children: "Ctrl+F"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                        lineNumber: 1532,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                lineNumber: 1524,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                className: "gap-2 ml-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                        lineNumber: 1537,
                                        columnNumber: 11
                                    }, this),
                                    "Share"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                lineNumber: 1536,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: showAIChat ? "secondary" : "default",
                                size: "sm",
                                className: "gap-2",
                                onClick: ()=>setShowAIChat(!showAIChat),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                        lineNumber: 1546,
                                        columnNumber: 11
                                    }, this),
                                    "AI Agent"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                lineNumber: 1540,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                        lineNumber: 1477,
                        columnNumber: 7
                    }, this),
                    showSearch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "h-4 w-4 text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                lineNumber: 1554,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                ref: searchInputRef,
                                type: "text",
                                placeholder: "Search in cells...",
                                value: searchTerm,
                                onChange: (e)=>handleSearch(e.target.value),
                                onKeyDown: (e)=>{
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        navigateSearchResult(e.shiftKey ? 'prev' : 'next');
                                    } else if (e.key === 'Escape') {
                                        toggleSearch();
                                    }
                                },
                                className: "h-8 w-64 text-sm"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                lineNumber: 1555,
                                columnNumber: 11
                            }, this),
                            searchResults.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-muted-foreground",
                                children: [
                                    currentSearchIndex + 1,
                                    " of ",
                                    searchResults.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                lineNumber: 1572,
                                columnNumber: 13
                            }, this),
                            searchTerm && searchResults.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-muted-foreground",
                                children: "No results"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                lineNumber: 1577,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "icon",
                                        className: "h-7 w-7",
                                        onClick: ()=>navigateSearchResult('prev'),
                                        disabled: searchResults.length === 0,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                            lineNumber: 1587,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                        lineNumber: 1580,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "icon",
                                        className: "h-7 w-7",
                                        onClick: ()=>navigateSearchResult('next'),
                                        disabled: searchResults.length === 0,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                            lineNumber: 1596,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                        lineNumber: 1589,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                lineNumber: 1579,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "icon",
                                className: "h-7 w-7",
                                onClick: toggleSearch,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                    lineNumber: 1605,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                lineNumber: 1599,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                        lineNumber: 1553,
                        columnNumber: 9
                    }, this),
                    selectedCell && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$text$2d$formatting$2d$toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextFormattingToolbar"], {
                        selectedCell: selectedCell,
                        selectedCells: selectedCells,
                        getCellFormatting: getCellFormatting,
                        setCellFormatting: setCellFormatting,
                        getColumnLabel: getColumnLabel,
                        isRangeSelected: isRangeSelected,
                        isCellMerged: isCellMerged,
                        onMergeCells: mergeCells,
                        onUnmergeCells: unmergeCells
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                        lineNumber: 1612,
                        columnNumber: 9
                    }, this),
                    showFilter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-b border-border bg-muted/30 px-4 py-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                                className: "h-4 w-4 text-muted-foreground"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                lineNumber: 1630,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium",
                                                children: "Filters"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                lineNumber: 1631,
                                                columnNumber: 15
                                            }, this),
                                            filteredRows !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-muted-foreground",
                                                children: [
                                                    "(",
                                                    filteredRows.length,
                                                    " of ",
                                                    numRows,
                                                    " rows)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                lineNumber: 1633,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                        lineNumber: 1629,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            filters.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "sm",
                                                onClick: clearAllFilters,
                                                children: "Clear All"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                lineNumber: 1640,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "icon",
                                                className: "h-7 w-7",
                                                onClick: ()=>setShowFilter(false),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                    lineNumber: 1650,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                lineNumber: 1644,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                        lineNumber: 1638,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                lineNumber: 1628,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    filters.map((filter, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: filter.column,
                                                    onChange: (e)=>updateFilter(index, {
                                                            column: parseInt(e.target.value)
                                                        }),
                                                    className: "h-8 rounded-md border border-border bg-background px-2 text-sm",
                                                    children: Array.from({
                                                        length: numCols
                                                    }).map((_, colIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: colIndex,
                                                            children: [
                                                                "Column ",
                                                                getColumnLabel(colIndex)
                                                            ]
                                                        }, colIndex, true, {
                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                            lineNumber: 1664,
                                                            columnNumber: 21
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                    lineNumber: 1658,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: filter.operator,
                                                    onChange: (e)=>updateFilter(index, {
                                                            operator: e.target.value
                                                        }),
                                                    className: "h-8 rounded-md border border-border bg-background px-2 text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "contains",
                                                            children: "Contains"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                            lineNumber: 1674,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "equals",
                                                            children: "Equals"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                            lineNumber: 1675,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "not-contains",
                                                            children: "Does not contain"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                            lineNumber: 1676,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "not-equals",
                                                            children: "Does not equal"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                            lineNumber: 1677,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                    lineNumber: 1669,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    type: "text",
                                                    placeholder: "Filter value...",
                                                    value: filter.value,
                                                    onChange: (e)=>updateFilter(index, {
                                                            value: e.target.value
                                                        }),
                                                    className: "h-8 w-48 text-sm"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                    lineNumber: 1679,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "ghost",
                                                    size: "icon",
                                                    className: "h-7 w-7",
                                                    onClick: ()=>removeFilter(index),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                        lineNumber: 1692,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                    lineNumber: 1686,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, index, true, {
                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                            lineNumber: 1657,
                                            columnNumber: 15
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "sm",
                                        onClick: addFilter,
                                        className: "gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                lineNumber: 1698,
                                                columnNumber: 15
                                            }, this),
                                            "Add Filter"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                        lineNumber: 1697,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                lineNumber: 1655,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                        lineNumber: 1627,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-1 overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col flex-1 min-w-0 overflow-hidden",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 overflow-auto",
                                    tabIndex: 0,
                                    onKeyDown: (e)=>{
                                        selectedCell && handleCellKeyDown(e, selectedCell.row, selectedCell.col);
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "inline-block min-w-full",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                            className: "border-collapse",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "sticky top-0 z-20",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "sticky left-0 z-30 w-10 border-b border-r border-border bg-background p-0 text-center text-xs font-medium text-muted-foreground",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center justify-center py-2.5",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "checkbox",
                                                                        className: "h-3.5 w-3.5 rounded border-border"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                        lineNumber: 1719,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                    lineNumber: 1718,
                                                                    columnNumber: 19
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                lineNumber: 1717,
                                                                columnNumber: 17
                                                            }, this),
                                                            Array.from({
                                                                length: numCols
                                                            }).map((_, colIndex)=>{
                                                                if (hiddenCols.has(colIndex)) return null;
                                                                const isMenuOpen = colMenuOpen === colIndex;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    style: {
                                                                        width: columnWidths[colIndex] || 200
                                                                    },
                                                                    className: `relative border-b border-r border-border p-0 text-left text-xs font-medium select-none ${isMenuOpen ? 'bg-primary/10 z-30' : 'bg-background z-0'}`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `flex items-center gap-1.5 px-3 py-2 w-full cursor-pointer hover:bg-muted/40 transition-colors ${isMenuOpen ? 'bg-primary/10' : ''}`,
                                                                            onClick: ()=>isMenuOpen ? setColMenuOpen(null) : openColMenu(colIndex),
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$type$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Type$3e$__["Type"], {
                                                                                    className: `h-3.5 w-3.5 shrink-0 ${isMenuOpen ? 'text-primary' : 'text-muted-foreground'}`
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                    lineNumber: 1737,
                                                                                    columnNumber: 23
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: `flex-1 min-w-0 truncate text-xs font-medium ${isMenuOpen ? 'text-primary' : ''}`,
                                                                                    children: colNames[colIndex] ?? "Input"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                    lineNumber: 1738,
                                                                                    columnNumber: 23
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                            lineNumber: 1733,
                                                                            columnNumber: 21
                                                                        }, this),
                                                                        isMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            ref: colMenuRef,
                                                                            className: "absolute left-0 top-full z-50 w-72 rounded-b-lg border border-border bg-background shadow-xl",
                                                                            onMouseDown: (e)=>e.stopPropagation(),
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "px-3 pt-3 pb-2",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                        autoFocus: true,
                                                                                        value: colMenuName,
                                                                                        onChange: (e)=>setColMenuName(e.target.value),
                                                                                        onKeyDown: (e)=>{
                                                                                            if (e.key === 'Enter') saveColMenu(colIndex);
                                                                                            if (e.key === 'Escape') setColMenuOpen(null);
                                                                                        },
                                                                                        className: "w-full rounded border border-border bg-muted/30 px-2 py-1.5 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                        lineNumber: 1752,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                    lineNumber: 1751,
                                                                                    columnNumber: 25
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "border-t border-border",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            className: "flex w-full items-center justify-between px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:bg-muted/30",
                                                                                            onClick: ()=>setColTypeExpanded((v)=>!v),
                                                                                            children: [
                                                                                                "Column Type",
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                                                    className: `h-3.5 w-3.5 transition-transform ${colTypeExpanded ? 'rotate-180' : ''}`
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                    lineNumber: 1768,
                                                                                                    columnNumber: 29
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                            lineNumber: 1763,
                                                                                            columnNumber: 27
                                                                                        }, this),
                                                                                        colTypeExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "px-3 pb-3 space-y-2",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "flex items-center justify-between gap-2",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                            className: "text-xs text-muted-foreground w-14 shrink-0",
                                                                                                            children: "Column"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                            lineNumber: 1774,
                                                                                                            columnNumber: 33
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                            className: "relative flex-1",
                                                                                                            children: [
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                                                    value: colColumnType[colIndex] ?? "User Input",
                                                                                                                    onChange: (e)=>setColColumnType((prev)=>({
                                                                                                                                ...prev,
                                                                                                                                [colIndex]: e.target.value
                                                                                                                            })),
                                                                                                                    className: "w-full rounded border border-border bg-background px-2 py-1.5 text-xs appearance-none pr-6 cursor-pointer",
                                                                                                                    children: [
                                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                                            value: "User Input",
                                                                                                                            children: "User Input"
                                                                                                                        }, void 0, false, {
                                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                            lineNumber: 1781,
                                                                                                                            columnNumber: 37
                                                                                                                        }, this),
                                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                                            value: "AI Agent",
                                                                                                                            children: "AI Agent"
                                                                                                                        }, void 0, false, {
                                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                            lineNumber: 1782,
                                                                                                                            columnNumber: 37
                                                                                                                        }, this),
                                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                                            value: "Formula",
                                                                                                                            children: "Formula"
                                                                                                                        }, void 0, false, {
                                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                            lineNumber: 1783,
                                                                                                                            columnNumber: 37
                                                                                                                        }, this)
                                                                                                                    ]
                                                                                                                }, void 0, true, {
                                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                    lineNumber: 1776,
                                                                                                                    columnNumber: 35
                                                                                                                }, this),
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                                                                    className: "absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none"
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                    lineNumber: 1785,
                                                                                                                    columnNumber: 35
                                                                                                                }, this)
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                            lineNumber: 1775,
                                                                                                            columnNumber: 33
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                    lineNumber: 1773,
                                                                                                    columnNumber: 31
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "flex items-center justify-between gap-2",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                            className: "text-xs text-muted-foreground w-14 shrink-0",
                                                                                                            children: "Field"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                            lineNumber: 1790,
                                                                                                            columnNumber: 33
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                            className: "relative flex-1",
                                                                                                            children: [
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                                                    value: colFieldType[colIndex] ?? "Text",
                                                                                                                    onChange: (e)=>setColFieldType((prev)=>({
                                                                                                                                ...prev,
                                                                                                                                [colIndex]: e.target.value
                                                                                                                            })),
                                                                                                                    className: "w-full rounded border border-border bg-background px-2 py-1.5 text-xs appearance-none pr-6 cursor-pointer",
                                                                                                                    children: [
                                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                                            value: "Text",
                                                                                                                            children: "Text"
                                                                                                                        }, void 0, false, {
                                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                            lineNumber: 1797,
                                                                                                                            columnNumber: 37
                                                                                                                        }, this),
                                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                                            value: "Number",
                                                                                                                            children: "Number"
                                                                                                                        }, void 0, false, {
                                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                            lineNumber: 1798,
                                                                                                                            columnNumber: 37
                                                                                                                        }, this),
                                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                                            value: "URL",
                                                                                                                            children: "URL"
                                                                                                                        }, void 0, false, {
                                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                            lineNumber: 1799,
                                                                                                                            columnNumber: 37
                                                                                                                        }, this),
                                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                                            value: "Date",
                                                                                                                            children: "Date"
                                                                                                                        }, void 0, false, {
                                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                            lineNumber: 1800,
                                                                                                                            columnNumber: 37
                                                                                                                        }, this),
                                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                                            value: "Boolean",
                                                                                                                            children: "Boolean"
                                                                                                                        }, void 0, false, {
                                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                            lineNumber: 1801,
                                                                                                                            columnNumber: 37
                                                                                                                        }, this)
                                                                                                                    ]
                                                                                                                }, void 0, true, {
                                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                    lineNumber: 1792,
                                                                                                                    columnNumber: 35
                                                                                                                }, this),
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                                                                    className: "absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none"
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                    lineNumber: 1803,
                                                                                                                    columnNumber: 35
                                                                                                                }, this)
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                            lineNumber: 1791,
                                                                                                            columnNumber: 33
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                    lineNumber: 1789,
                                                                                                    columnNumber: 31
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                            lineNumber: 1771,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                    lineNumber: 1762,
                                                                                    columnNumber: 25
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "border-t border-border px-3 py-2",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        onClick: ()=>saveColMenu(colIndex),
                                                                                        className: "w-full rounded bg-foreground py-1.5 text-xs font-semibold text-background hover:opacity-90 transition-opacity",
                                                                                        children: "Save"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                        lineNumber: 1812,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                    lineNumber: 1811,
                                                                                    columnNumber: 25
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "border-t border-border",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "flex items-stretch border-b border-border",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                    onClick: ()=>sortColFromMenu(colIndex, "asc"),
                                                                                                    className: "flex flex-1 items-center gap-2 px-3 py-2 text-xs hover:bg-muted/40 transition-colors",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                                                                                            className: "h-3.5 w-3.5"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                            lineNumber: 1828,
                                                                                                            columnNumber: 31
                                                                                                        }, this),
                                                                                                        "ASC"
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                    lineNumber: 1824,
                                                                                                    columnNumber: 29
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "w-px bg-border"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                    lineNumber: 1831,
                                                                                                    columnNumber: 29
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                    onClick: ()=>sortColFromMenu(colIndex, "desc"),
                                                                                                    className: "flex flex-1 items-center gap-2 px-3 py-2 text-xs hover:bg-muted/40 transition-colors",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                                                            className: "h-3.5 w-3.5"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                            lineNumber: 1836,
                                                                                                            columnNumber: 31
                                                                                                        }, this),
                                                                                                        "DESC"
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                    lineNumber: 1832,
                                                                                                    columnNumber: 29
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                            lineNumber: 1823,
                                                                                            columnNumber: 27
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            disabled: true,
                                                                                            className: "flex w-full items-center gap-2.5 px-3 py-2 text-xs text-muted-foreground/50 cursor-not-allowed border-b border-border",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitMerge$3e$__["GitMerge"], {
                                                                                                    className: "h-3.5 w-3.5"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                    lineNumber: 1846,
                                                                                                    columnNumber: 29
                                                                                                }, this),
                                                                                                "Dedupe"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                            lineNumber: 1842,
                                                                                            columnNumber: 27
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            onClick: ()=>filterColumn(colIndex),
                                                                                            className: "flex w-full items-center gap-2.5 px-3 py-2 text-xs hover:bg-muted/40 transition-colors border-b border-border",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                                                                                    className: "h-3.5 w-3.5"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                    lineNumber: 1855,
                                                                                                    columnNumber: 29
                                                                                                }, this),
                                                                                                "Filter"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                            lineNumber: 1851,
                                                                                            columnNumber: 27
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            onClick: ()=>toggleHideColumn(colIndex),
                                                                                            className: "flex w-full items-center gap-2.5 px-3 py-2 text-xs hover:bg-muted/40 transition-colors border-b border-border",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                                    className: "h-3.5 w-3.5",
                                                                                                    viewBox: "0 0 24 24",
                                                                                                    fill: "none",
                                                                                                    stroke: "currentColor",
                                                                                                    strokeWidth: "2",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                                            d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                            lineNumber: 1865,
                                                                                                            columnNumber: 31
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                                                            x1: "1",
                                                                                                            y1: "1",
                                                                                                            x2: "23",
                                                                                                            y2: "23"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                            lineNumber: 1866,
                                                                                                            columnNumber: 31
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                    lineNumber: 1864,
                                                                                                    columnNumber: 29
                                                                                                }, this),
                                                                                                "Hide column"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                            lineNumber: 1860,
                                                                                            columnNumber: 27
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            onClick: ()=>duplicateColumn(colIndex),
                                                                                            className: "flex w-full items-center gap-2.5 px-3 py-2 text-xs hover:bg-muted/40 transition-colors border-b border-border",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                                    className: "h-3.5 w-3.5",
                                                                                                    viewBox: "0 0 24 24",
                                                                                                    fill: "none",
                                                                                                    stroke: "currentColor",
                                                                                                    strokeWidth: "2",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                                                                            x: "9",
                                                                                                            y: "9",
                                                                                                            width: "13",
                                                                                                            height: "13",
                                                                                                            rx: "2",
                                                                                                            ry: "2"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                            lineNumber: 1877,
                                                                                                            columnNumber: 31
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                                            d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                            lineNumber: 1878,
                                                                                                            columnNumber: 31
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                    lineNumber: 1876,
                                                                                                    columnNumber: 29
                                                                                                }, this),
                                                                                                "Duplicate column"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                            lineNumber: 1872,
                                                                                            columnNumber: 27
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            onClick: ()=>clearColumn(colIndex),
                                                                                            className: "flex w-full items-center gap-2.5 px-3 py-2 text-xs hover:bg-muted/40 transition-colors border-b border-border",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                                    className: "h-3.5 w-3.5",
                                                                                                    viewBox: "0 0 24 24",
                                                                                                    fill: "none",
                                                                                                    stroke: "currentColor",
                                                                                                    strokeWidth: "2",
                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                                        d: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                        lineNumber: 1889,
                                                                                                        columnNumber: 31
                                                                                                    }, this)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                    lineNumber: 1888,
                                                                                                    columnNumber: 29
                                                                                                }, this),
                                                                                                "Clear column"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                            lineNumber: 1884,
                                                                                            columnNumber: 27
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            onClick: ()=>deleteColumn(colIndex),
                                                                                            className: "flex w-full items-center gap-2.5 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                                                    className: "h-3.5 w-3.5"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                    lineNumber: 1899,
                                                                                                    columnNumber: 29
                                                                                                }, this),
                                                                                                "Delete column"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                            lineNumber: 1895,
                                                                                            columnNumber: 27
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                    lineNumber: 1821,
                                                                                    columnNumber: 25
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                            lineNumber: 1745,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            onMouseDown: (e)=>onMouseDown(e, colIndex),
                                                                            className: "absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-primary/50 active:bg-primary"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                            lineNumber: 1907,
                                                                            columnNumber: 21
                                                                        }, this)
                                                                    ]
                                                                }, colIndex, true, {
                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                    lineNumber: 1727,
                                                                    columnNumber: 19
                                                                }, this);
                                                            }),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: `relative min-w-24 border-b border-r border-dashed border-primary/40 bg-background p-0 text-left cursor-pointer transition-colors ${showAddColPanel ? 'bg-primary/10 z-30' : 'hover:bg-primary/5 z-0'}`,
                                                                onClick: ()=>!showAddColPanel && handleAddColumn(),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-1 px-3 py-2 text-xs font-medium text-primary",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                                className: "h-3.5 w-3.5"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                lineNumber: 1920,
                                                                                columnNumber: 21
                                                                            }, this),
                                                                            "Add"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                        lineNumber: 1919,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    showAddColPanel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        ref: addColPanelRef,
                                                                        className: "absolute left-0 top-full z-50 w-80 rounded-b-lg border border-border bg-background shadow-2xl",
                                                                        onMouseDown: (e)=>e.stopPropagation(),
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center justify-between border-b border-border px-3 py-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-xs font-semibold",
                                                                                        children: newColStep === "configure" ? `Configure: ${newColColumnType}` : "Add Column"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                        lineNumber: 1932,
                                                                                        columnNumber: 25
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        onClick: ()=>{
                                                                                            setShowAddColPanel(false);
                                                                                            setNewColStep("browse");
                                                                                        },
                                                                                        className: "text-muted-foreground hover:text-foreground",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                                            className: "h-3.5 w-3.5"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                            lineNumber: 1936,
                                                                                            columnNumber: 27
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                        lineNumber: 1935,
                                                                                        columnNumber: 25
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                lineNumber: 1931,
                                                                                columnNumber: 23
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "px-3 pt-3 pb-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                        className: "text-[11px] text-muted-foreground",
                                                                                        children: "Column name"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                        lineNumber: 1942,
                                                                                        columnNumber: 25
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                        autoFocus: newColStep === "browse",
                                                                                        placeholder: newColStep === "configure" ? newColColumnType : "e.g. Email, Company...",
                                                                                        value: newColName,
                                                                                        onChange: (e)=>setNewColName(e.target.value),
                                                                                        onKeyDown: (e)=>{
                                                                                            if (e.key === 'Escape') {
                                                                                                setShowAddColPanel(false);
                                                                                                setNewColStep("browse");
                                                                                            }
                                                                                        },
                                                                                        className: "mt-1 w-full rounded border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                        lineNumber: 1943,
                                                                                        columnNumber: 25
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                lineNumber: 1941,
                                                                                columnNumber: 23
                                                                            }, this),
                                                                            newColStep === "browse" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "px-3 pb-2",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                                className: "text-[11px] text-muted-foreground",
                                                                                                children: "Generate with AI"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                lineNumber: 1957,
                                                                                                columnNumber: 29
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                                                rows: 2,
                                                                                                placeholder: "Describe what values to generate for each row...",
                                                                                                value: newColAIPrompt,
                                                                                                onChange: (e)=>setNewColAIPrompt(e.target.value),
                                                                                                className: "mt-1 w-full resize-none rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                lineNumber: 1958,
                                                                                                columnNumber: 29
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                onClick: generateAIColumnFromPrompt,
                                                                                                disabled: !newColAIPrompt.trim() || isGeneratingCol,
                                                                                                className: "mt-2 flex w-full items-center justify-center gap-1.5 rounded bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed",
                                                                                                children: [
                                                                                                    isGeneratingCol ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                                                        className: "h-3.5 w-3.5 animate-spin"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                        lineNumber: 1970,
                                                                                                        columnNumber: 50
                                                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wand$2d$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wand2$3e$__["Wand2"], {
                                                                                                        className: "h-3.5 w-3.5"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                        lineNumber: 1970,
                                                                                                        columnNumber: 101
                                                                                                    }, this),
                                                                                                    isGeneratingCol ? "Generating..." : "Generate with AI"
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                lineNumber: 1965,
                                                                                                columnNumber: 29
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                        lineNumber: 1956,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "flex items-center gap-2 px-3 pb-2",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "flex-1 h-px bg-border"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                lineNumber: 1977,
                                                                                                columnNumber: 29
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "text-[10px] text-muted-foreground",
                                                                                                children: "or choose type"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                lineNumber: 1978,
                                                                                                columnNumber: 29
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "flex-1 h-px bg-border"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                lineNumber: 1979,
                                                                                                columnNumber: 29
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                        lineNumber: 1976,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "px-3 pb-2",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "relative",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                                                                    className: "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                    lineNumber: 1985,
                                                                                                    columnNumber: 31
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                    placeholder: "Search column types...",
                                                                                                    value: newColSearch,
                                                                                                    onChange: (e)=>setNewColSearch(e.target.value),
                                                                                                    className: "w-full rounded border border-border bg-muted/30 pl-8 pr-3 py-1.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                    lineNumber: 1986,
                                                                                                    columnNumber: 31
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                            lineNumber: 1984,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                        lineNumber: 1983,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "flex border-b border-border px-3",
                                                                                        children: [
                                                                                            "All",
                                                                                            "Data Tools",
                                                                                            "Enrichments",
                                                                                            "Exports"
                                                                                        ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                onClick: ()=>setNewColTab(tab),
                                                                                                className: `mr-4 pb-2 pt-1 text-xs font-medium transition-colors border-b-2 -mb-px ${newColTab === tab ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
                                                                                                children: tab
                                                                                            }, tab, false, {
                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                lineNumber: 1998,
                                                                                                columnNumber: 31
                                                                                            }, this))
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                        lineNumber: 1996,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "max-h-52 overflow-y-auto",
                                                                                        children: [
                                                                                            (newColTab === "All" || newColTab === "Data Tools") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/20",
                                                                                                        children: "User Input"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                        lineNumber: 2009,
                                                                                                        columnNumber: 33
                                                                                                    }, this),
                                                                                                    [
                                                                                                        {
                                                                                                            label: "Text / User Input",
                                                                                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$type$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Type$3e$__["Type"], {
                                                                                                                className: "h-4 w-4"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                lineNumber: 2011,
                                                                                                                columnNumber: 71
                                                                                                            }, this),
                                                                                                            type: "User Input"
                                                                                                        },
                                                                                                        {
                                                                                                            label: "User Input – File",
                                                                                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                                                                className: "h-4 w-4"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                lineNumber: 2012,
                                                                                                                columnNumber: 71
                                                                                                            }, this),
                                                                                                            type: "User Input - File"
                                                                                                        }
                                                                                                    ].filter((i)=>!newColSearch || i.label.toLowerCase().includes(newColSearch.toLowerCase())).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                            onClick: ()=>confirmAddColumn(item.type),
                                                                                                            className: "flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-muted/40 transition-colors border-b border-border/50",
                                                                                                            children: [
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                    className: "text-muted-foreground shrink-0",
                                                                                                                    children: item.icon
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                    lineNumber: 2016,
                                                                                                                    columnNumber: 37
                                                                                                                }, this),
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                    className: "flex-1 text-left",
                                                                                                                    children: item.label
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                    lineNumber: 2017,
                                                                                                                    columnNumber: 37
                                                                                                                }, this)
                                                                                                            ]
                                                                                                        }, item.label, true, {
                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                            lineNumber: 2014,
                                                                                                            columnNumber: 35
                                                                                                        }, this))
                                                                                                ]
                                                                                            }, void 0, true),
                                                                                            (newColTab === "All" || newColTab === "Enrichments") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/20",
                                                                                                        children: "AI"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                        lineNumber: 2024,
                                                                                                        columnNumber: 33
                                                                                                    }, this),
                                                                                                    [
                                                                                                        {
                                                                                                            label: "AI Generation",
                                                                                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                                                                                className: "h-4 w-4"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                lineNumber: 2026,
                                                                                                                columnNumber: 67
                                                                                                            }, this),
                                                                                                            type: "AI Agent",
                                                                                                            desc: "Fill rows using AI"
                                                                                                        },
                                                                                                        {
                                                                                                            label: "AI with Web Access",
                                                                                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                                                                                                className: "h-4 w-4"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                lineNumber: 2027,
                                                                                                                columnNumber: 72
                                                                                                            }, this),
                                                                                                            type: "AI Web",
                                                                                                            desc: "AI with live web search"
                                                                                                        }
                                                                                                    ].filter((i)=>!newColSearch || i.label.toLowerCase().includes(newColSearch.toLowerCase())).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                            onClick: ()=>confirmAddColumn(item.type),
                                                                                                            className: "flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-muted/40 transition-colors border-b border-border/50",
                                                                                                            children: [
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                    className: "text-muted-foreground shrink-0",
                                                                                                                    children: item.icon
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                    lineNumber: 2031,
                                                                                                                    columnNumber: 37
                                                                                                                }, this),
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                    className: "flex-1 text-left",
                                                                                                                    children: [
                                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                            children: item.label
                                                                                                                        }, void 0, false, {
                                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                            lineNumber: 2033,
                                                                                                                            columnNumber: 39
                                                                                                                        }, this),
                                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                            className: "text-[11px] text-muted-foreground",
                                                                                                                            children: item.desc
                                                                                                                        }, void 0, false, {
                                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                            lineNumber: 2034,
                                                                                                                            columnNumber: 39
                                                                                                                        }, this)
                                                                                                                    ]
                                                                                                                }, void 0, true, {
                                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                    lineNumber: 2032,
                                                                                                                    columnNumber: 37
                                                                                                                }, this),
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                                                                    className: "h-3.5 w-3.5 text-muted-foreground -rotate-90 shrink-0"
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                    lineNumber: 2036,
                                                                                                                    columnNumber: 37
                                                                                                                }, this)
                                                                                                            ]
                                                                                                        }, item.label, true, {
                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                            lineNumber: 2029,
                                                                                                            columnNumber: 35
                                                                                                        }, this))
                                                                                                ]
                                                                                            }, void 0, true),
                                                                                            (newColTab === "All" || newColTab === "Data Tools") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 bg-muted/20",
                                                                                                        children: "API (PRO)"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                        lineNumber: 2043,
                                                                                                        columnNumber: 33
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                        disabled: true,
                                                                                                        className: "flex w-full items-center gap-3 px-3 py-2 text-sm border-b border-border/50 opacity-40 cursor-not-allowed",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"], {
                                                                                                                className: "h-4 w-4 text-muted-foreground shrink-0"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                lineNumber: 2045,
                                                                                                                columnNumber: 35
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "flex-1 text-left",
                                                                                                                children: "HTTP (POST/GET)"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                lineNumber: 2046,
                                                                                                                columnNumber: 35
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground",
                                                                                                                children: [
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                                                                                        className: "h-2.5 w-2.5"
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                        lineNumber: 2047,
                                                                                                                        columnNumber: 158
                                                                                                                    }, this),
                                                                                                                    "PRO"
                                                                                                                ]
                                                                                                            }, void 0, true, {
                                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                lineNumber: 2047,
                                                                                                                columnNumber: 35
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                        lineNumber: 2044,
                                                                                                        columnNumber: 33
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true),
                                                                                            (newColTab === "All" || newColTab === "Enrichments") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/20",
                                                                                                        children: "Tools"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                        lineNumber: 2053,
                                                                                                        columnNumber: 33
                                                                                                    }, this),
                                                                                                    [
                                                                                                        {
                                                                                                            label: "Normalize Company Name",
                                                                                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                                                                                className: "h-4 w-4"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                lineNumber: 2055,
                                                                                                                columnNumber: 76
                                                                                                            }, this),
                                                                                                            type: "Normalize Company",
                                                                                                            credit: "Free"
                                                                                                        },
                                                                                                        {
                                                                                                            label: "Normalize Domain",
                                                                                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"], {
                                                                                                                className: "h-4 w-4"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                lineNumber: 2056,
                                                                                                                columnNumber: 70
                                                                                                            }, this),
                                                                                                            type: "Normalize Domain",
                                                                                                            credit: "Free"
                                                                                                        },
                                                                                                        {
                                                                                                            label: "Scrape Website",
                                                                                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                                                                                                className: "h-4 w-4"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                lineNumber: 2057,
                                                                                                                columnNumber: 68
                                                                                                            }, this),
                                                                                                            type: "Scrape Website",
                                                                                                            credit: "~0.02"
                                                                                                        },
                                                                                                        {
                                                                                                            label: "Run Regex",
                                                                                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "text-xs font-mono font-bold",
                                                                                                                children: "(.*)"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                lineNumber: 2058,
                                                                                                                columnNumber: 63
                                                                                                            }, this),
                                                                                                            type: "Regex",
                                                                                                            credit: "Free"
                                                                                                        },
                                                                                                        {
                                                                                                            label: "Read File (PDF, Image)",
                                                                                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                                                                className: "h-4 w-4"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                lineNumber: 2059,
                                                                                                                columnNumber: 76
                                                                                                            }, this),
                                                                                                            type: "Read File",
                                                                                                            credit: "~1"
                                                                                                        }
                                                                                                    ].filter((i)=>!newColSearch || i.label.toLowerCase().includes(newColSearch.toLowerCase())).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                            onClick: ()=>confirmAddColumn(item.type),
                                                                                                            className: "flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-muted/40 transition-colors border-b border-border/50",
                                                                                                            children: [
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                    className: "text-muted-foreground shrink-0",
                                                                                                                    children: item.icon
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                    lineNumber: 2063,
                                                                                                                    columnNumber: 37
                                                                                                                }, this),
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                    className: "flex-1 text-left",
                                                                                                                    children: item.label
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                    lineNumber: 2064,
                                                                                                                    columnNumber: 37
                                                                                                                }, this),
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                    className: `text-[11px] shrink-0 ${item.credit === "Free" ? "text-green-600 dark:text-green-400 font-medium" : "text-muted-foreground"}`,
                                                                                                                    children: item.credit
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                                    lineNumber: 2065,
                                                                                                                    columnNumber: 37
                                                                                                                }, this)
                                                                                                            ]
                                                                                                        }, item.label, true, {
                                                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                            lineNumber: 2061,
                                                                                                            columnNumber: 35
                                                                                                        }, this))
                                                                                                ]
                                                                                            }, void 0, true),
                                                                                            newColTab === "Exports" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "px-3 py-8 text-center text-xs text-muted-foreground",
                                                                                                children: "No export columns available yet"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                lineNumber: 2071,
                                                                                                columnNumber: 31
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                        lineNumber: 2006,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true) : /* CONFIGURE STEP */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "px-3 pb-3",
                                                                                children: [
                                                                                    [
                                                                                        "AI Agent",
                                                                                        "AI Web",
                                                                                        "Scrape Website",
                                                                                        "Regex",
                                                                                        "Normalize Company",
                                                                                        "Normalize Domain",
                                                                                        "Read File"
                                                                                    ].includes(newColColumnType) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "mb-3",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                                className: "text-[11px] text-muted-foreground",
                                                                                                children: "Source column"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                lineNumber: 2081,
                                                                                                columnNumber: 31
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                                value: newColSourceCol,
                                                                                                onChange: (e)=>setNewColSourceCol(Number(e.target.value)),
                                                                                                className: "mt-1 w-full rounded border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary",
                                                                                                children: Array.from({
                                                                                                    length: numCols
                                                                                                }).map((_, ci)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                        value: ci,
                                                                                                        children: [
                                                                                                            getColumnLabel(ci),
                                                                                                            " — ",
                                                                                                            colNames[ci] ?? `Col ${ci + 1}`
                                                                                                        ]
                                                                                                    }, ci, true, {
                                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                        lineNumber: 2088,
                                                                                                        columnNumber: 35
                                                                                                    }, this))
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                lineNumber: 2082,
                                                                                                columnNumber: 31
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                        lineNumber: 2080,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    [
                                                                                        "AI Agent",
                                                                                        "AI Web"
                                                                                    ].includes(newColColumnType) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "mb-3",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                                className: "text-[11px] text-muted-foreground",
                                                                                                children: [
                                                                                                    "AI prompt ",
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "text-muted-foreground/60",
                                                                                                        children: [
                                                                                                            "(use ",
                                                                                                            "{{A}}",
                                                                                                            ", ",
                                                                                                            "{{B}}",
                                                                                                            " to reference columns)"
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                        lineNumber: 2098,
                                                                                                        columnNumber: 43
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                lineNumber: 2097,
                                                                                                columnNumber: 31
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                                                autoFocus: true,
                                                                                                rows: 3,
                                                                                                placeholder: `e.g. "Summarize the company in column A in one sentence"`,
                                                                                                value: newColConfigPrompt,
                                                                                                onChange: (e)=>setNewColConfigPrompt(e.target.value),
                                                                                                className: "mt-1 w-full resize-none rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                lineNumber: 2100,
                                                                                                columnNumber: 31
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                        lineNumber: 2096,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    newColColumnType === "Regex" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "mb-3",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                                className: "text-[11px] text-muted-foreground",
                                                                                                children: "Regex pattern"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                lineNumber: 2114,
                                                                                                columnNumber: 31
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                autoFocus: true,
                                                                                                placeholder: "e.g. \\d+ or ([a-z]+@[a-z]+\\.[a-z]+)",
                                                                                                value: newColRegex,
                                                                                                onChange: (e)=>setNewColRegex(e.target.value),
                                                                                                className: "mt-1 w-full rounded border border-border bg-background px-3 py-1.5 text-sm font-mono outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                lineNumber: 2115,
                                                                                                columnNumber: 31
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "mt-1 text-[11px] text-muted-foreground",
                                                                                                children: "First capture group (or full match) is used as the cell value."
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                lineNumber: 2122,
                                                                                                columnNumber: 31
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                        lineNumber: 2113,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    [
                                                                                        "Scrape Website"
                                                                                    ].includes(newColColumnType) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "mb-3 text-[11px] text-muted-foreground",
                                                                                        children: "Will scrape the URL in the selected source column for each row."
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                        lineNumber: 2127,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    [
                                                                                        "Normalize Company",
                                                                                        "Normalize Domain"
                                                                                    ].includes(newColColumnType) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "mb-3 text-[11px] text-muted-foreground",
                                                                                        children: "Will normalize each value in the selected source column."
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                        lineNumber: 2130,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    newColColumnType === "Read File" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "mb-3 text-[11px] text-muted-foreground",
                                                                                        children: "Reads the file path/URL in the source column and extracts text content."
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                        lineNumber: 2133,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "flex gap-2",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                onClick: ()=>setNewColStep("browse"),
                                                                                                className: "flex-1 rounded border border-border px-3 py-1.5 text-xs hover:bg-muted/40 transition-colors",
                                                                                                children: "Back"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                lineNumber: 2138,
                                                                                                columnNumber: 29
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                onClick: ()=>doAddColumn(newColColumnType, newColName.trim() || newColColumnType, newColConfigPrompt, newColSourceCol, newColRegex),
                                                                                                disabled: [
                                                                                                    "AI Agent",
                                                                                                    "AI Web"
                                                                                                ].includes(newColColumnType) && !newColConfigPrompt.trim(),
                                                                                                className: "flex-1 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                                                                                                children: "Add Column & Run"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                                lineNumber: 2142,
                                                                                                columnNumber: 29
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                        lineNumber: 2137,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                lineNumber: 2077,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                        lineNumber: 1925,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                lineNumber: 1915,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                        lineNumber: 1715,
                                                        columnNumber: 15
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                    lineNumber: 1714,
                                                    columnNumber: 13
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                    children: [
                                                        (filteredRows !== null ? filteredRows : Array.from({
                                                            length: numRows
                                                        }, (_, i)=>i)).map((rowIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                style: {
                                                                    height: rowHeights[rowIndex] || 36
                                                                },
                                                                className: "group hover:bg-muted/20",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "relative left-0 z-10 border-b border-r border-border bg-muted/80 p-2 text-center text-xs font-medium text-muted-foreground cursor-pointer select-none",
                                                                        onDoubleClick: ()=>onRowHeaderDoubleClick(rowIndex),
                                                                        children: [
                                                                            rowIndex + 1,
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                onMouseDown: (e)=>onRowMouseDown(e, rowIndex),
                                                                                className: "absolute bottom-0 left-0 h-1 w-full cursor-row-resize hover:bg-primary/50 active:bg-primary"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                lineNumber: 2166,
                                                                                columnNumber: 21
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                        lineNumber: 2161,
                                                                        columnNumber: 19
                                                                    }, this),
                                                                    Array.from({
                                                                        length: numCols
                                                                    }).map((_, colIndex)=>{
                                                                        // Skip hidden columns
                                                                        if (hiddenCols.has(colIndex)) return null;
                                                                        // Skip cells that are part of a merge (covered by another cell)
                                                                        const isCoveredByMerge = Object.entries(mergedCells).some(([key, merge])=>{
                                                                            const [mergeRow, mergeCol] = key.split('-').map(Number);
                                                                            return rowIndex >= mergeRow && rowIndex < mergeRow + merge.rowSpan && colIndex >= mergeCol && colIndex < mergeCol + merge.colSpan && !(rowIndex === mergeRow && colIndex === mergeCol);
                                                                        });
                                                                        if (isCoveredByMerge) return null;
                                                                        const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                                                                        const isEditing = editingCell?.row === rowIndex && editingCell?.col === colIndex;
                                                                        const isMatch = isSearchMatch(rowIndex, colIndex);
                                                                        const isCurrentMatch = isCurrentSearchMatch(rowIndex, colIndex);
                                                                        const width = columnWidths[colIndex] || 150;
                                                                        const height = rowHeights[rowIndex] || 36;
                                                                        const formatting = getCellFormatting(rowIndex, colIndex);
                                                                        const cellValue = getCellValue(rowIndex, colIndex);
                                                                        const fontSize = formatting.fontSize || 14;
                                                                        const charWidth = fontSize * 0.6 // Approximate character width (roughly 60% of font size)
                                                                        ;
                                                                        const paddingLeft = 2 + charWidth // Base padding + one character width
                                                                        ;
                                                                        const mergeInfo = getMergeInfo(rowIndex, colIndex);
                                                                        // Determine background color based on selection and search
                                                                        let bgColor = formatting.backgroundColor;
                                                                        if (isCurrentMatch) {
                                                                            bgColor = "rgb(251, 191, 36)"; // amber-400 for current match
                                                                        } else if (isMatch) {
                                                                            bgColor = "rgb(253, 230, 138)"; // amber-200 for other matches
                                                                        }
                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            "data-grid-cell": "true",
                                                                            rowSpan: mergeInfo.rowSpan,
                                                                            colSpan: mergeInfo.colSpan,
                                                                            style: {
                                                                                width,
                                                                                height,
                                                                                backgroundColor: bgColor,
                                                                                borderBottom: "1px solid var(--border)",
                                                                                borderRight: "1px solid var(--border)",
                                                                                padding: 0,
                                                                                userSelect: "none"
                                                                            },
                                                                            className: `${isSelected ? "ring-2 ring-inset ring-primary" : ""} ${isInSelectedRange(rowIndex, colIndex) && !isMatch ? "bg-primary/20" : ""}`,
                                                                            onClick: (e)=>handleCellClick(rowIndex, colIndex, e),
                                                                            onDoubleClick: ()=>handleCellDoubleClick(rowIndex, colIndex),
                                                                            onMouseDown: (e)=>handleCellMouseDown(rowIndex, colIndex, e),
                                                                            onMouseEnter: ()=>handleCellMouseEnter(rowIndex, colIndex),
                                                                            title: cellValue,
                                                                            children: isEditing ? colFieldType[colIndex] === "Boolean" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                ref: editInputRef,
                                                                                value: cellValue,
                                                                                onChange: (e)=>setCellValue(rowIndex, colIndex, e.target.value),
                                                                                onKeyDown: (e)=>handleCellKeyDown(e, rowIndex, colIndex),
                                                                                onBlur: ()=>setEditingCell(null),
                                                                                autoFocus: true,
                                                                                style: {
                                                                                    width: "100%",
                                                                                    height: "100%",
                                                                                    color: formatting.textColor || "inherit",
                                                                                    backgroundColor: "transparent",
                                                                                    fontSize: `${fontSize}px`,
                                                                                    paddingLeft: `${paddingLeft}px`,
                                                                                    paddingRight: "8px",
                                                                                    boxSizing: "border-box",
                                                                                    border: "none",
                                                                                    outline: "none",
                                                                                    fontFamily: "inherit"
                                                                                },
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                        value: "",
                                                                                        children: "—"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                        lineNumber: 2260,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                        value: "true",
                                                                                        children: "true"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                        lineNumber: 2261,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                        value: "false",
                                                                                        children: "false"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                        lineNumber: 2262,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                lineNumber: 2239,
                                                                                columnNumber: 29
                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                ref: editInputRef,
                                                                                value: cellValue,
                                                                                onChange: (e)=>{
                                                                                    const v = e.target.value;
                                                                                    if (colFieldType[colIndex] === "Number") {
                                                                                        // Allow digits, decimal point, minus sign, and empty
                                                                                        if (v === "" || v === "-" || /^-?\d*\.?\d*$/.test(v)) {
                                                                                            setCellValue(rowIndex, colIndex, v);
                                                                                        }
                                                                                    } else {
                                                                                        setCellValue(rowIndex, colIndex, v);
                                                                                    }
                                                                                },
                                                                                onKeyDown: (e)=>handleCellKeyDown(e, rowIndex, colIndex),
                                                                                onBlur: ()=>setEditingCell(null),
                                                                                type: colFieldType[colIndex] === "Number" ? "text" : colFieldType[colIndex] === "Date" ? "date" : "text",
                                                                                autoComplete: "off",
                                                                                style: {
                                                                                    width: "100%",
                                                                                    height: "100%",
                                                                                    color: formatting.textColor || "inherit",
                                                                                    backgroundColor: "transparent",
                                                                                    fontSize: `${fontSize}px`,
                                                                                    fontWeight: formatting.bold ? "bold" : "normal",
                                                                                    fontStyle: formatting.italic ? "italic" : "normal",
                                                                                    textDecoration: formatting.underline ? "underline" : "none",
                                                                                    textAlign: colFieldType[colIndex] === "Number" ? "right" : formatting.alignment || "left",
                                                                                    paddingLeft: `${paddingLeft}px`,
                                                                                    paddingRight: "8px",
                                                                                    paddingTop: "0px",
                                                                                    paddingBottom: "0px",
                                                                                    boxSizing: "border-box",
                                                                                    margin: 0,
                                                                                    border: "none",
                                                                                    outline: "none",
                                                                                    lineHeight: "1",
                                                                                    fontFamily: "inherit",
                                                                                    letterSpacing: "inherit",
                                                                                    verticalAlign: "top"
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                lineNumber: 2265,
                                                                                columnNumber: 27
                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                style: {
                                                                                    width: "100%",
                                                                                    height: "100%",
                                                                                    display: "flex",
                                                                                    alignItems: "center",
                                                                                    justifyContent: colFieldType[colIndex] === "Number" ? "flex-end" : formatting.alignment === "center" ? "center" : formatting.alignment === "right" ? "flex-end" : "flex-start",
                                                                                    color: formatting.textColor,
                                                                                    fontSize: `${fontSize}px`,
                                                                                    fontWeight: formatting.bold ? "bold" : "normal",
                                                                                    fontStyle: formatting.italic ? "italic" : "normal",
                                                                                    textDecoration: formatting.underline ? "underline" : "none",
                                                                                    whiteSpace: "nowrap",
                                                                                    overflow: "hidden",
                                                                                    textOverflow: "ellipsis",
                                                                                    paddingLeft: formatting.alignment === "left" ? `${paddingLeft}px` : "8px",
                                                                                    paddingRight: formatting.alignment === "right" || colFieldType[colIndex] === "Number" ? `${paddingLeft}px` : "8px",
                                                                                    paddingTop: "0px",
                                                                                    paddingBottom: "0px",
                                                                                    boxSizing: "border-box",
                                                                                    userSelect: "none",
                                                                                    WebkitUserSelect: "none"
                                                                                },
                                                                                children: colFieldType[colIndex] === "URL" && cellValue && /^https?:\/\//i.test(cellValue) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                                    href: cellValue,
                                                                                    target: "_blank",
                                                                                    rel: "noopener noreferrer",
                                                                                    onClick: (e)=>e.stopPropagation(),
                                                                                    style: {
                                                                                        color: "var(--primary)",
                                                                                        textDecoration: "underline",
                                                                                        overflow: "hidden",
                                                                                        textOverflow: "ellipsis",
                                                                                        whiteSpace: "nowrap",
                                                                                        maxWidth: "100%"
                                                                                    },
                                                                                    children: cellValue
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                    lineNumber: 2340,
                                                                                    columnNumber: 31
                                                                                }, this) : colFieldType[colIndex] === "Boolean" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    style: {
                                                                                        color: cellValue === "true" ? "var(--primary)" : cellValue === "false" ? "var(--destructive)" : "inherit"
                                                                                    },
                                                                                    children: cellValue === "true" ? "✓" : cellValue === "false" ? "✗" : cellValue
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                    lineNumber: 2350,
                                                                                    columnNumber: 31
                                                                                }, this) : cellValue
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                                lineNumber: 2313,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        }, colIndex, false, {
                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                            lineNumber: 2212,
                                                                            columnNumber: 23
                                                                        }, this);
                                                                    })
                                                                ]
                                                            }, rowIndex, true, {
                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                lineNumber: 2159,
                                                                columnNumber: 17
                                                            }, this)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            className: "h-9 hover:bg-muted/20 cursor-pointer group/newentry",
                                                            onClick: handleAddRow,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "border-b border-r border-border px-2 w-10",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-1 text-xs text-muted-foreground opacity-0 group-hover/newentry:opacity-100 transition-opacity",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                            className: "h-3 w-3"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                            lineNumber: 2370,
                                                                            columnNumber: 21
                                                                        }, this),
                                                                        "New entry"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                    lineNumber: 2369,
                                                                    columnNumber: 19
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                                lineNumber: 2368,
                                                                columnNumber: 17
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                            lineNumber: 2364,
                                                            columnNumber: 15
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                    lineNumber: 2157,
                                                    columnNumber: 13
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                            lineNumber: 1713,
                                            columnNumber: 11
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                        lineNumber: 1712,
                                        columnNumber: 9
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                    lineNumber: 1709,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between border-t border-border px-3 py-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "ghost",
                                                    size: "sm",
                                                    className: "gap-1.5 h-7 text-xs",
                                                    onClick: handleAddRow,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                            className: "h-3.5 w-3.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                            lineNumber: 2384,
                                                            columnNumber: 13
                                                        }, this),
                                                        "New entry",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                            className: "ml-1 inline-flex h-4 items-center rounded border border-border bg-muted px-1 font-mono text-[10px]",
                                                            children: "N"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                            lineNumber: 2386,
                                                            columnNumber: 13
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                    lineNumber: 2383,
                                                    columnNumber: 11
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "ghost",
                                                    size: "sm",
                                                    className: "gap-1.5 h-7 text-xs",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                            className: "h-3.5 w-3.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                            lineNumber: 2389,
                                                            columnNumber: 13
                                                        }, this),
                                                        "Auto scroll off"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                    lineNumber: 2388,
                                                    columnNumber: 11
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                            lineNumber: 2382,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3 text-xs text-muted-foreground",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "Records: ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            className: "text-foreground",
                                                            children: filteredRows !== null ? filteredRows.length : numRows
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                            lineNumber: 2395,
                                                            columnNumber: 22
                                                        }, this),
                                                        " rows"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                    lineNumber: 2394,
                                                    columnNumber: 11
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Views:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                    lineNumber: 2397,
                                                    columnNumber: 11
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "ghost",
                                                    size: "sm",
                                                    className: "h-6 gap-1 bg-primary/10 text-primary text-xs px-2",
                                                    children: "🪡 Main"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                    lineNumber: 2398,
                                                    columnNumber: 11
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "ghost",
                                                    size: "icon",
                                                    className: "h-6 w-6",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                        className: "h-3 w-3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                        lineNumber: 2402,
                                                        columnNumber: 13
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                                    lineNumber: 2401,
                                                    columnNumber: 11
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                            lineNumber: 2393,
                                            columnNumber: 9
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                    lineNumber: 2381,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                            lineNumber: 1708,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                        lineNumber: 1706,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                lineNumber: 1448,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-ai-chat-panel": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$chat$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AIChatPanel"], {
                    isOpen: showAIChat,
                    onClose: ()=>setShowAIChat(false),
                    tableContext: {
                        tableId,
                        projectName,
                        numRows,
                        numCols,
                        selectedCells,
                        getCellValue,
                        getColumnLabel,
                        getCellFormatting
                    },
                    onApplyFormatting: (formattingChanges)=>{
                        formattingChanges.forEach(({ row, col, format })=>{
                            const existing = getCellFormatting(row, col);
                            setCellFormatting(row, col, {
                                ...existing,
                                ...format
                            });
                        });
                    },
                    onApplyChanges: (changes, newNumRows, newNumCols)=>{
                        // Save previous state for undo
                        const previousState = {
                            cells: {
                                ...cells
                            },
                            numRows,
                            numCols
                        };
                        // Apply dimension changes first
                        if (newNumRows && newNumRows > numRows) setNumRows(newNumRows);
                        if (newNumCols && newNumCols > numCols) setNumCols(newNumCols);
                        // Apply cell changes
                        changes.forEach(({ row, col, value })=>{
                            setCellValue(row, col, value);
                        });
                        // Store for undo
                        setPendingAIChanges({
                            type: 'generate',
                            previousState,
                            newChanges: changes,
                            summary: `Agent applied ${changes.length} change${changes.length === 1 ? "" : "s"}`
                        });
                    },
                    onAddColumns: (columns)=>{
                        // Save previous state for undo
                        const previousState = {
                            cells: {
                                ...cells
                            },
                            numRows,
                            numCols
                        };
                        // Calculate new changes
                        const startCol = numCols;
                        let maxColIndex = startCol;
                        const newChanges = [];
                        columns.forEach((column, colOffset)=>{
                            const colIndex = startCol + colOffset;
                            maxColIndex = Math.max(maxColIndex, colIndex + 1);
                            // Write header to row 0
                            newChanges.push({
                                row: 0,
                                col: colIndex,
                                value: column.header
                            });
                            column.values.forEach(({ rowIndex, value })=>{
                                newChanges.push({
                                    row: rowIndex,
                                    col: colIndex,
                                    value
                                });
                            });
                        });
                        // Apply changes immediately (preview)
                        newChanges.forEach(({ row, col, value })=>{
                            setCellValue(row, col, value);
                        });
                        setNumCols(maxColIndex);
                        // Store for undo
                        const columnNames = columns.map((c)=>c.header).join(", ");
                        setPendingAIChanges({
                            type: 'enrich',
                            previousState,
                            newChanges,
                            summary: `Added columns: ${columnNames}`
                        });
                    },
                    onGenerateTable: (table)=>{
                        // Save previous state for undo
                        const previousState = {
                            cells: {
                                ...cells
                            },
                            numRows,
                            numCols,
                            colNames: {
                                ...colNames
                            },
                            colFieldType: {
                                ...colFieldType
                            }
                        };
                        const { headers, rows } = table;
                        const newNumCols = headers.length;
                        const newNumRows = rows.length;
                        const newChanges = [];
                        // Set headers as column names
                        const newColNames = {};
                        headers.forEach((header, colIndex)=>{
                            newColNames[colIndex] = header;
                        });
                        // Auto-detect field type for each column from the data values
                        const newColFieldTypes = {};
                        headers.forEach((_, colIndex)=>{
                            const colValues = rows.map((row)=>row[colIndex] ?? "");
                            newColFieldTypes[colIndex] = detectFieldType(colValues);
                        });
                        // Collect data rows starting at row 0
                        rows.forEach((row, rowIndex)=>{
                            row.forEach((value, colIndex)=>{
                                newChanges.push({
                                    row: rowIndex,
                                    col: colIndex,
                                    value
                                });
                            });
                        });
                        // Apply changes immediately (preview)
                        setNumCols(newNumCols);
                        setNumRows(newNumRows);
                        setColNames(newColNames);
                        setColFieldType(newColFieldTypes);
                        newChanges.forEach(({ row, col, value })=>{
                            setCellValue(row, col, value);
                        });
                        // Persist column names to Convex
                        sync.setColumnNamesBatch(newColNames);
                        // Store for undo
                        setPendingAIChanges({
                            type: 'generate',
                            previousState,
                            newChanges,
                            summary: `Generated ${newNumRows} rows × ${newNumCols} columns`
                        });
                    },
                    pendingChanges: pendingAIChanges,
                    onKeepChanges: ()=>setPendingAIChanges(null),
                    onUndoChanges: ()=>{
                        if (pendingAIChanges?.previousState) {
                            const { cells: prevCells, numRows: prevRows, numCols: prevCols, colNames: prevColNames, colFieldType: prevColFieldType } = pendingAIChanges.previousState;
                            // Restore dimensions (syncs to Convex)
                            setNumRows(prevRows);
                            setNumCols(prevCols);
                            if (prevColNames) {
                                setColNames(prevColNames);
                                sync.setColumnNamesBatch(prevColNames);
                            }
                            if (prevColFieldType) setColFieldType(prevColFieldType);
                            // Clear new cells first
                            pendingAIChanges.newChanges.forEach(({ row, col })=>{
                                const key = `${row}-${col}`;
                                if (!prevCells[key]) {
                                    setCellValue(row, col, '');
                                }
                            });
                            // Restore previous cell values
                            Object.entries(prevCells).forEach(([key, value])=>{
                                const [row, col] = key.split('-').map(Number);
                                setCellValue(row, col, value);
                            });
                        }
                        setPendingAIChanges(null);
                    }
                }, void 0, false, {
                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                    lineNumber: 2412,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                lineNumber: 2411,
                columnNumber: 7
            }, this),
            showCopyNotification && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50",
                children: [
                    "Copied ",
                    selectedCells.size,
                    " cell(s)"
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                lineNumber: 2587,
                columnNumber: 9
            }, this),
            showDeleteAllConfirm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-sm rounded-lg border border-border bg-background p-6 shadow-xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-1 flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                        className: "h-5 w-5 text-destructive"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                        lineNumber: 2598,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                    lineNumber: 2597,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-base font-semibold",
                                    children: "Delete all data?"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                    lineNumber: 2600,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                            lineNumber: 2596,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-6 pl-13 text-sm text-muted-foreground",
                            children: "This will permanently clear all cells, formatting, filters, and sort settings. The spreadsheet will be reset to its default state. This action cannot be undone."
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                            lineNumber: 2602,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    size: "sm",
                                    onClick: ()=>setShowDeleteAllConfirm(false),
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                    lineNumber: 2606,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "destructive",
                                    size: "sm",
                                    onClick: handleDeleteAll,
                                    children: "Delete All"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                                    lineNumber: 2613,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                            lineNumber: 2605,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                    lineNumber: 2595,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
                lineNumber: 2594,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/tables/[id]/page.tsx",
        lineNumber: 1446,
        columnNumber: 5
    }, this);
}
_s(TableEditorPage, "7923ESQcyMdiym6TXiy00IHHuq4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$spreadsheet$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpreadsheetSync"]
    ];
});
_c = TableEditorPage;
var _c;
__turbopack_context__.k.register(_c, "TableEditorPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_a834b27b._.js.map