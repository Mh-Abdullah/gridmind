"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="bg-card p-8 rounded-lg shadow-md w-96 border border-border">
        <h1 className="text-3xl font-bold mb-6 text-center text-foreground">Login</h1>

        {error && (
          <div className="bg-destructive/20 border border-destructive text-destructive px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
          Don't have an account?{" "}
          <Link href="/register" className="text-accent hover:underline font-medium">
            Sign up
          </Link>
        </p>

        {/* Demo credentials hint */}
        
      </div>
    </div>
  );
}
