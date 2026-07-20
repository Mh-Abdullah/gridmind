"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  // Read the current authentication state and the user's access level.
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for authentication to finish loading before choosing a destination.
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (isAdmin) {
        router.push("/dashboard-admin");
      } else {
        // Send regular authenticated users to their spreadsheet tables.
        router.push("/dashboard/tables");
      }
    }
  }, [user, loading, isAdmin, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
