"use client";

import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Menu } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function AdminDashboardPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Real-time user list from Convex — updates automatically when users are added/removed
  const allUsers = useQuery(api.users.getAllUsers, isAdmin ? {} : "skip");
  const users = allUsers ?? [];
  const loadingUsers = allUsers === undefined;

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
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <AdminSidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b border-border bg-background px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">Dashboard</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Welcome, {user?.name}! </h2>
            <p className="text-muted-foreground">Manage users and monitor your GridMind platform</p>
          </div>

          {/* Stats Cards - Optional */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Users</p>
              <p className="text-3xl font-bold text-foreground">{users.length}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Admin Users</p>
              <p className="text-3xl font-bold text-foreground">{users.filter(u => u.role === "admin").length}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Regular Users</p>
              <p className="text-3xl font-bold text-foreground">{users.filter(u => u.role !== "admin").length}</p>
            </div>
          </div>

          {/* Users Management Table */}
          <div className="bg-card border border-border rounded-lg">
            <div className="border-b border-border px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground">User Management</h2>
              <span className="text-xs text-muted-foreground">Live — updates automatically</span>
            </div>

            <div className="overflow-x-auto">
              {loadingUsers ? (
                <p className="text-muted-foreground p-6">Loading users...</p>
              ) : users.length === 0 ? (
                <p className="text-muted-foreground p-6">No users found.</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Role</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-border hover:bg-muted/50 transition">
                        <td className="px-6 py-4 text-sm text-foreground font-medium">{u.name || "N/A"}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{u.email}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              u.role === "admin" 
                                ? "bg-red-500/10 text-red-600" 
                                : "bg-blue-500/10 text-blue-600"
                            }`}
                          >
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
