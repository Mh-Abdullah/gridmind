"use client";

import { ArrowLeft, MailCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "verify">("details");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requestVerificationCode = async (event?: React.FormEvent) => {
    event?.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request", email, name, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to send the verification code.");
        return;
      }

      setMessage(data.message);
      setStep("verify");
    } catch {
      setError("Unable to send the verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyAndCreateAccount = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", email, otp }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Email verification failed.");
        return;
      }

      router.push("/login");
    } catch {
      setError("Email verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-20">
      <Link
        href="/"
        aria-label="Back to landing page"
        title="Back to landing page"
        className="absolute left-6 top-6 rounded-lg p-3 text-foreground transition-colors hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      </Link>
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>

      <section className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-md sm:p-8">
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

        {step === "details" ? (
          <>
            <h1 className="text-center text-3xl font-bold text-foreground">Sign Up</h1>
            <p className="mt-2 text-center text-sm leading-6 text-muted-foreground">
              Your email must be verified before your account is created.
            </p>

            {error && (
              <div role="alert" className="mt-4 rounded-lg border border-destructive bg-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={requestVerificationCode} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  className="mt-1 min-h-11 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  maxLength={320}
                  autoComplete="email"
                  className="mt-1 min-h-11 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                  aria-describedby="email-help"
                />
                <p id="email-help" className="mt-1 text-xs text-muted-foreground">
                  A verification code will be sent here.
                </p>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                  className="mt-1 min-h-11 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-describedby="password-help"
                />
                <p id="password-help" className="mt-1 text-xs text-muted-foreground">
                  Use at least 8 characters.
                </p>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground">Confirm Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                  className="mt-1 min-h-11 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="min-h-11 w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Sending code..." : "Verify email"}
              </button>
            </form>
          </>
        ) : (
          <>
            <MailCheck className="mx-auto mb-4 h-11 w-11 text-primary" aria-hidden="true" />
            <h1 className="text-center text-3xl font-bold text-foreground">Check your email</h1>
            <p className="mt-2 text-center text-sm leading-6 text-muted-foreground">{message}</p>

            {error && (
              <div role="alert" className="mt-4 rounded-lg border border-destructive bg-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={verifyAndCreateAccount} className="mt-6 space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-foreground">Verification code</label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  autoFocus
                  className="mt-1 min-h-11 w-full rounded-lg border border-border bg-background px-4 py-2 text-center text-xl tracking-[0.35em] text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="min-h-11 w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create verified account"}
              </button>
              <button
                type="button"
                onClick={() => void requestVerificationCode()}
                disabled={loading}
                className="min-h-11 w-full rounded-lg px-4 py-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send code again
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("details");
                  setOtp("");
                  setError("");
                  setMessage("");
                }}
                className="min-h-11 w-full rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Change email
              </button>
            </form>
          </>
        )}

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
