import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Role } from '@/types';
import { USERS } from '@/data/users';

// Demo accounts: email → userId map
const DEMO_ACCOUNTS: Record<string, string> = {
  'rajesh@greenroots.in': 'u001',
  'priya@solarfarm.in': 'u002',
  'verify@greencert.in': 'u003',
  'abhay@abccorp.com': 'u004',
  'meera@ecobuyers.com': 'u005',
  'admin@carbonvault.demo': 'u006',
};

// Role → dashboard root
export const ROLE_ROOTS: Record<Role, string> = {
  producer: '/producer',
  certifier: '/certifier',
  market: '/market',
  admin: '/admin',
};

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('cv_user');
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('cv_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cv_user');
    }
  }, [user]);

  function login(email: string, _password: string): { ok: boolean; error?: string } {
    const userId = DEMO_ACCOUNTS[email.toLowerCase().trim()];
    if (!userId) {
      return { ok: false, error: 'No demo account found for that email. Try one of the demo credentials below.' };
    }
    const found = USERS.find(u => u.id === userId);
    if (!found) return { ok: false, error: 'User data not found.' };
    setUser(found);
    return { ok: true };
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
