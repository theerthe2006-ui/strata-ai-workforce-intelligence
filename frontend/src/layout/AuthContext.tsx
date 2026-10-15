import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, type LoginRequest, type TokenResponse } from '../api/workforceApi';

const authStorageKey = 'enterprise-workforce-auth-session';

interface AuthContextType {
  session: TokenResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  switchWorkspaceUser: (user: { id: number; email: string; role: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<TokenResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(authStorageKey);
      if (stored) {
        setSession(JSON.parse(stored) as TokenResponse);
      }
    } catch {
      localStorage.removeItem(authStorageKey);
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function handleLogin(credentials: LoginRequest) {
    const payload = await apiLogin(credentials);
    setSession(payload);
    localStorage.setItem(authStorageKey, JSON.stringify(payload));
  }

  function handleLogout() {
    setSession(null);
    localStorage.removeItem(authStorageKey);
  }

  function switchWorkspaceUser(user: { id: number; email: string; role: string }) {
    if (!session) return;
    const updated: TokenResponse = {
      ...session,
      workspace: `${user.role.toLowerCase()}_command`,
      user: {
        ...session.user,
        id: user.id,
        email: user.email,
        name: user.email.split('@')[0],
        role: user.role,
        workspace: `${user.role.toLowerCase()}_workspace`,
      },
    };
    setSession(updated);
    localStorage.setItem(authStorageKey, JSON.stringify(updated));
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: !!session?.access_token,
        isLoading,
        login: handleLogin,
        logout: handleLogout,
        switchWorkspaceUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
