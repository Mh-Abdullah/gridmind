"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";

type Step = "sending" | "reset" | "send-error" | "missing" | "success";

async function sendVerificationCode(email: string) {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  return { response, data };
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const requestStarted = useRef(false);
  const [step, setStep] = useState<Step>("sending");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (requestStarted.current) return;
    requestStarted.current = true;

    const accountEmail = sessionStorage.getItem("password-reset-email")?.trim() || "";
    if (!accountEmail) {
      Promise.resolve().then(() => setStep("missing"));
      return;
    }

    void sendVerificationCode(accountEmail)
      .then(({ response, data }) => {
        setEmail(accountEmail);
        if (!response.ok) {
          setError(data.error || "Unable to send a verification code.");
          setStep("send-error");
          return;
        }
        setMessage(data.message);
        setStep("reset");
      })
      .catch(() => {
        setEmail(accountEmail);
        setError("Unable to send a verification code. Please try again.");
        setStep("send-error");
      });
  }, []);

  const resendCode = async () => {
    if (!email) return;
    setError("");
    setLoading(true);

    try {
      const { response, data } = await sendVerificationCode(email);
      if (!response.ok) {
        setError(data.error || "Unable to send a verification code.");
        setStep("send-error");
        return;
      }
      setMessage(data.message);
      setStep("reset");
    } catch {
      setError("Unable to send a verification code. Please try again.");
      setStep("send-error");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

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
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to reset your password.");
        return;
      }

      sessionStorage.removeItem("password-reset-email");
      setMessage(data.message);
      setStep("success");
    } catch {
      setError("Unable to reset your password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-20">
      <Link
        href="/login"
        aria-label="Back to login"
        title="Back to login"
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

        {step === "sending" && (
          <div className="py-4 text-center" aria-live="polite">
            <LoaderCircle className="mx-auto mb-4 h-10 w-10 animate-spin text-primary" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-foreground">Sending your code</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              We’re sending a verification code to your registered user email.
            </p>
          </div>
        )}

        {step === "missing" && (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Enter your email first</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Return to login, enter the email used to create your user account, then select Forgot password.
            </p>
            <Link
              href="/login"
              className="mt-6 flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Back to login
            </Link>
          </div>
        )}

        {step === "send-error" && (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Code not sent</h1>
            <div
              role="alert"
              className="mt-4 rounded-lg border border-destructive bg-destructive/20 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
            <button
              type="button"
              onClick={resendCode}
              disabled={loading}
              className="mt-6 min-h-11 w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Sending code..." : "Try again"}
            </button>
            <Link
              href="/login"
              className="mt-3 flex min-h-11 w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Back to login
            </Link>
          </div>
        )}

        {step === "success" && (
          <div className="text-center" aria-live="polite">
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-primary" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-foreground">Password reset</h1>
            <p className="mt-3 text-muted-foreground">{message}</p>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="mt-6 min-h-11 w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Go to login
            </button>
          </div>
        )}

        {step === "reset" && (
          <>
            <h1 className="text-center text-3xl font-bold text-foreground">Check your email</h1>
            <p className="mt-2 text-center text-sm leading-6 text-muted-foreground">{message}</p>

            {error && (
              <div
                role="alert"
                className="mt-4 rounded-lg border border-destructive bg-destructive/20 px-4 py-3 text-sm text-destructive"
              >
                {error}
              </div>
            )}

            <form onSubmit={resetPassword} className="mt-6 space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-foreground">
                  Verification code
                </label>
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
                  aria-describedby="otp-help"
                />
                <p id="otp-help" className="mt-1 text-xs text-muted-foreground">
                  Enter the six-digit code. It expires in 10 minutes.
                </p>
              </div>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-foreground">
                  New password
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                  className="mt-1 min-h-11 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground">
                  Confirm new password
                </label>
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
                disabled={loading || otp.length !== 6}
                className="min-h-11 w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Resetting password..." : "Reset password"}
              </button>
              <button
                type="button"
                onClick={resendCode}
                disabled={loading}
                className="min-h-11 w-full rounded-lg px-4 py-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send code again
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Back to login
              </Link>
            </p>
          </>
        )}
      </section>
    </main>
  );
}
