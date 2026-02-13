"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

// Create a single Convex client instance
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convex = useMemo(() => {
    if (!convexUrl) {
      console.warn(
        "NEXT_PUBLIC_CONVEX_URL is not set. Real-time sync will not work."
      );
      return null;
    }
    return new ConvexReactClient(convexUrl);
  }, []);

  if (!convex) {
    // Render children without Convex provider if URL is not configured
    return <>{children}</>;
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
