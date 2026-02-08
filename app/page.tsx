import { AppFooter } from "@/components/app-footer"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-8 py-2">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-foreground">Welcome to GridMind</h1>
        </div>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Sign Up</Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex items-center justify-center p-8 min-h-[calc(100vh-200px)]">
        <div className="text-center space-y-6 max-w-2xl">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">AI-Powered Data Enrichment Platform</h2>
            <p className="text-lg text-muted-foreground">
              Transform your spreadsheets with intelligent automation. Create, enrich, and analyze your data with AI-powered tools.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">Login to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <AppFooter />      
    </div>
  )
}
