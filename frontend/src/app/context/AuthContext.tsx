'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export interface AuthUser {
  userId: string;
  id: string;
  email: string;
  role: string;
  fullName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (fullName: string, email: string, password: string, role: string) => Promise<{ success: boolean; error?: string; verificationToken?: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser({
            ...data.user,
            id: data.user.id || data.user.userId || '',
            userId: data.user.userId || data.user.id || '',
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await refreshSession();
        return { success: true };
      }
      return { success: false, error: data.error || 'Login failed.' };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const signup = async (fullName: string, email: string, password: string, role: string) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, role }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await refreshSession();
        return { success: true, verificationToken: data.verificationToken };
      }
      return { success: false, error: data.error || 'Signup failed.' };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
