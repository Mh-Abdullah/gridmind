"use client"

import { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  KeyRound,
  Loader2,
  Menu,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react"

import { AdminSidebar } from "@/components/admin-sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

type AccountSettingsPageProps = {
  mode: "user" | "admin"
}

export function AccountSettingsPage({ mode }: AccountSettingsPageProps) {
  const { user, loading, isAdmin, refreshUser, updateUser } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [name, setName] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [deletePassword, setDeletePassword] = useState("")
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [profileMessage, setProfileMessage] = useState<string | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (!loading && mode === "user" && isAdmin) {
      router.push("/dashboard-admin/account")
      return
    }

    if (!loading && mode === "admin" && !isAdmin) {
      router.push("/dashboard/account")
    }
  }, [isAdmin, loading, mode, router, user])

  useEffect(() => {
    setName(user?.name ?? "")
  }, [user?.name])

  const isReady = !loading && Boolean(user) && (mode === "admin" ? isAdmin : !isAdmin)

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setProfileError(null)
    setProfileMessage(null)

    const trimmedName = name.trim()
    if (trimmedName.length < 2) {
      setProfileError("Name must be at least 2 characters long.")
      return
    }

    setIsSavingProfile(true)

    try {
      const response = await fetch("/api/auth/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      })
      const payload = await response.json()

      if (!response.ok) {
        setProfileError(payload.error || "Unable to update your name.")
        return
      }

      updateUser(payload.user)
      await refreshUser()
      setProfileMessage(payload.message || "Name updated successfully.")
    } catch {
      setProfileError("Something went wrong while updating your name.")
    } finally {
      setIsSavingProfile(false)
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPasswordError(null)
    setPasswordMessage(null)

    if (newPassword.length < 4) {
      setPasswordError("New password must be at least 4 characters long.")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation must match.")
      return
    }

    setIsSavingPassword(true)

    try {
      const response = await fetch("/api/auth/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const payload = await response.json()

      if (!response.ok) {
        setPasswordError(payload.error || "Unable to update your password.")
        return
      }

      setPasswordMessage(payload.message || "Password updated successfully.")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch {
      setPasswordError("Something went wrong while updating your password.")
    } finally {
      setIsSavingPassword(false)
    }
  }

  async function handleDeleteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setDeleteError(null)
    setDeleteMessage(null)

    if (!user) {
      return
    }

    if (deleteConfirmation.trim() !== user.email) {
      setDeleteError("Enter your email address exactly to confirm deletion.")
      return
    }

    setIsDeletingAccount(true)

    try {
      const response = await fetch("/api/auth/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: deletePassword,
          confirmation: deleteConfirmation.trim(),
        }),
      })
      const payload = await response.json()

      if (!response.ok) {
        setDeleteError(payload.error || "Unable to delete your account.")
        return
      }

      setDeleteMessage(payload.message || "Account deleted successfully.")
      localStorage.removeItem("token")
      updateUser(null)
      window.location.href = "/"
    } catch {
      setDeleteError("Something went wrong while deleting your account.")
    } finally {
      setIsDeletingAccount(false)
    }
  }

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm text-muted-foreground shadow-[0_20px_50px_-35px_rgba(15,23,42,0.4)]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading account settings...
        </div>
      </div>
    )
  }

  const Sidebar = mode === "admin" ? AdminSidebar : AppSidebar
  const headingEyebrow = mode === "admin" ? "Admin account" : "Account settings"
  const headingTitle = mode === "admin" ? "Manage your admin account" : "Manage your profile and security"

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-10%] top-[-3rem] h-[18rem] w-[18rem] rounded-full bg-[radial-gradient(circle,_rgba(14,165,233,0.12),_transparent_64%)] blur-3xl" />
          <div className="absolute right-[-10%] top-[18rem] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,_rgba(239,68,68,0.09),_transparent_64%)] blur-3xl" />
        </div>

        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/82 px-4 py-4 backdrop-blur-xl md:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-card text-muted-foreground transition-colors hover:text-foreground md:hidden"
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{headingEyebrow}</p>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{headingTitle}</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="relative flex-1 overflow-auto px-4 py-6 md:px-6 md:py-8">
          <section className="overflow-hidden rounded-[32px] border border-border/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(15,118,110,0.94))] p-6 text-white shadow-[0_35px_90px_-45px_rgba(15,118,110,0.45)] md:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-50/90">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure account controls
                </div>
                <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
                  Keep your account details current and protected.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/80 md:text-base">
                  Update the name shown across your workspace, rotate your password whenever needed, and review the
                  account deletion controls carefully before taking destructive actions.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[26px] border border-white/12 bg-white/10 p-5 backdrop-blur-sm">
                  <p className="text-sm text-emerald-50/75">Signed in as</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">{user?.name || "User"}</p>
                  <p className="mt-2 text-sm text-emerald-50/80">{user?.email}</p>
                </div>
                <div className="rounded-[26px] border border-white/12 bg-white/10 p-5 backdrop-blur-sm">
                  <p className="text-sm text-emerald-50/75">Role</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                    {user?.role === "admin" ? "Administrator" : "Member"}
                  </p>
                  <p className="mt-2 text-sm text-emerald-50/80">
                    {user?.role === "admin"
                      ? "Admin deletion is blocked from this page for safety."
                      : "You can fully manage your personal account here."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-[30px] border border-border/70 bg-card/92 p-6 shadow-[0_28px_75px_-50px_rgba(15,23,42,0.45)]">
              <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Profile</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Display name</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    This name appears in the sidebar and the rest of your workspace.
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                  <UserRound className="h-5 w-5" />
                </div>
              </div>

              <form className="mt-5 space-y-4" onSubmit={handleProfileSubmit}>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Account name
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your name"
                    autoComplete="name"
                    className="h-11 rounded-2xl"
                  />
                </div>

                {profileError && (
                  <div className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {profileError}
                  </div>
                )}
                {profileMessage && (
                  <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                    {profileMessage}
                  </div>
                )}

                <Button type="submit" className="h-11 rounded-2xl px-5" disabled={isSavingProfile}>
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save name"
                  )}
                </Button>
              </form>
            </article>

            <article className="rounded-[30px] border border-border/70 bg-card/92 p-6 shadow-[0_28px_75px_-50px_rgba(15,23,42,0.45)]">
              <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Security</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Change password</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Confirm your current password before setting a new one.
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                  <KeyRound className="h-5 w-5" />
                </div>
              </div>

              <form className="mt-5 space-y-4" onSubmit={handlePasswordSubmit}>
                <div className="space-y-2">
                  <label htmlFor="current-password" className="text-sm font-medium text-foreground">
                    Current password
                  </label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    autoComplete="current-password"
                    className="h-11 rounded-2xl"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="new-password" className="text-sm font-medium text-foreground">
                    New password
                  </label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    autoComplete="new-password"
                    className="h-11 rounded-2xl"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
                    Confirm new password
                  </label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    className="h-11 rounded-2xl"
                  />
                </div>

                {passwordError && (
                  <div className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {passwordError}
                  </div>
                )}
                {passwordMessage && (
                  <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                    {passwordMessage}
                  </div>
                )}

                <Button type="submit" className="h-11 rounded-2xl px-5" disabled={isSavingPassword}>
                  {isSavingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update password"
                  )}
                </Button>
              </form>
            </article>
          </section>

          <section
            className={cn(
              "mt-6 rounded-[30px] border p-6 shadow-[0_28px_75px_-50px_rgba(15,23,42,0.45)]",
              user?.role === "admin"
                ? "border-border/70 bg-card/92"
                : "border-destructive/20 bg-[linear-gradient(180deg,rgba(239,68,68,0.08),rgba(255,255,255,0.96))] dark:bg-[linear-gradient(180deg,rgba(239,68,68,0.12),rgba(8,11,19,0.96))]"
            )}
          >
            <div className="flex flex-col gap-4 border-b border-border/60 pb-5 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-destructive">Danger zone</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Delete account</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  This permanently removes your account and all related workspace data, including tables, contexts,
                  credit history, and package records.
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>

            {user?.role === "admin" ? (
              <div className="mt-5 rounded-[24px] border border-border/70 bg-background/70 p-5 text-sm leading-6 text-muted-foreground">
                Admin accounts are protected from self-service deletion. If this account needs to be removed, handle it
                through a dedicated administrative process instead.
              </div>
            ) : (
              <form className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]" onSubmit={handleDeleteSubmit}>
                <div className="rounded-[24px] border border-destructive/20 bg-destructive/5 p-5">
                  <p className="text-sm font-medium text-foreground">Before you continue</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                    <li>Your login will stop working immediately.</li>
                    <li>Stored tables and contexts will be deleted.</li>
                    <li>Wallet and billing history will be removed from your account.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="delete-password" className="text-sm font-medium text-foreground">
                      Current password
                    </label>
                    <Input
                      id="delete-password"
                      type="password"
                      value={deletePassword}
                      onChange={(event) => setDeletePassword(event.target.value)}
                      autoComplete="current-password"
                      className="h-11 rounded-2xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="delete-confirmation" className="text-sm font-medium text-foreground">
                      Type your email to confirm
                    </label>
                    <Input
                      id="delete-confirmation"
                      value={deleteConfirmation}
                      onChange={(event) => setDeleteConfirmation(event.target.value)}
                      placeholder={user?.email}
                      autoComplete="email"
                      className="h-11 rounded-2xl"
                    />
                  </div>

                  {deleteError && (
                    <div className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {deleteError}
                    </div>
                  )}
                  {deleteMessage && (
                    <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                      {deleteMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="destructive"
                    className="h-11 rounded-2xl px-5"
                    disabled={isDeletingAccount}
                  >
                    {isDeletingAccount ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Deleting account...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Delete account permanently
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
