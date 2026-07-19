"use client";

import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Menu } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AdminBillingPanel } from "@/components/admin-billing-panel";

export default function AdminBillingPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const billingOverview = useQuery(api.billing.getAdminOverview, isAdmin ? {} : "skip");
  const billingUsers = billingOverview?.users ?? [];
  const packages = billingOverview?.packages ?? [];

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (!loading && !isAdmin) {
      router.push("/dashboard");
    }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <AdminSidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-border bg-background px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">Billing</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Billing Control Center</h2>
            <p className="text-muted-foreground">Manage packages, Polar sync, and user credit assignment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Live Packages</p>
              <p className="text-3xl font-bold text-foreground">{packages.length}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Billing Users</p>
              <p className="text-3xl font-bold text-foreground">{billingUsers.length}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Credits In Wallets</p>
              <p className="text-3xl font-bold text-foreground">{billingUsers.reduce((sum, item) => sum + item.balanceCredits, 0)}</p>
            </div>
          </div>

          {user?.id && <AdminBillingPanel adminUserId={user.id} />}
        </main>
      </div>
    </div>
  );
}
