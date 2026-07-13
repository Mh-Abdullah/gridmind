import type React from "react"
import type { Metadata } from "next"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeProvider } from "@/lib/theme-provider"
import { ConvexClientProvider } from "@/lib/convex-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "GridMind - AI-Powered Data Enrichment Platform",
  description: "Transform spreadsheets into intelligent, AI-ready datasets with automated enrichment",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ConvexClientProvider>
          <ThemeProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
