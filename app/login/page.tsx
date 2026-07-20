"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to appropriate dashboard
  useEffect(() => {
    if (!loading && user) {
      // Small delay to ensure state is updated
      setTimeout(() => {
        if (user.role === "admin") {
          router.push("/dashboard-admin");
        } else {
          router.push("/dashboard/tables");
        }
      }, 100);
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      console.log("Login completed, checking cookies...");
      console.log("Cookies:", document.cookie);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    const accountEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountEmail)) {
      setError("Enter your registered user email first, then select Forgot password.");
      return;
    }

    setError("");
    sessionStorage.setItem("password-reset-email", accountEmail);
    router.push("/forgot-password");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Link
        href="/"
        aria-label="Back to landing page"
        title="Back to landing page"
        className="absolute left-6 top-6 rounded-lg p-2 text-foreground transition-colors hover:bg-hover"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      </Link>
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="bg-card p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm mx-4 border border-border">
        <div className="mb-5 flex justify-center">
          <Image
            src="/gridsmind.png"
            alt="GridMind"
            width={220}
            height={44}
            priority
            className="h-auto w-48 dark:invert"
          />
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center text-foreground">Login</h1>

        {error && (
          <div role="alert" className="bg-destructive/20 border border-destructive text-destructive px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">Password</label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            Sign up
          </Link>
        </p>

        {/* Demo credentials hint */}
        
      </div>
    </div>
  );
}
