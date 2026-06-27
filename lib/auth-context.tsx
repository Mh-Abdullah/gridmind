"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  updateUser: (nextUser: User | null) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUser = useCallback((nextUser: User | null) => {
    if (nextUser) {
      localStorage.setItem("user", JSON.stringify(nextUser));
    } else {
      localStorage.removeItem("user");
    }
    setUser(nextUser);
  }, []);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    const response = await fetch("/api/auth/me");

    if (!response.ok) {
      updateUser(null);
      return null;
    }

    const data = await response.json();
    updateUser(data.user);
    return data.user;
  }, [updateUser]);

  // Load user from localStorage and refresh from server on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        // Set stored user immediately for fast initial render
        setUser(JSON.parse(storedUser));
        
        // Fetch fresh user data from server
        try {
          await refreshUser();
        } catch (error) {
          console.error("Failed to refresh user data:", error);
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Login failed");
    }

    const data = await response.json();
    console.log("Login response data:", data);
    localStorage.setItem("token", data.token);
    console.log("Setting user state:", data.user);
    updateUser(data.user);
    // Don't redirect here - let the caller handle the redirect based on role
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("token");
    updateUser(null);
    window.location.href = "/";
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, updateUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
