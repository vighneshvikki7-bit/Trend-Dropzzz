import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.ts';

interface AuthContextType {
  isAdmin: boolean;
  adminEmail: string | null;
  isLoading: boolean;
  login: (password: string, email?: string) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    try {
      const isValid = await api.verifyAuth();
      if (isValid) {
        setIsAdmin(true);
        const user = api.getAdminUser();
        setAdminEmail(user?.email || 'admin@trenddropzz.com');
      } else {
        setIsAdmin(false);
        setAdminEmail(null);
      }
    } catch {
      setIsAdmin(false);
      setAdminEmail(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (password: string, email: string = 'admin@trenddropzz.com') => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      setIsAdmin(true);
      setAdminEmail(res.user?.email || email);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setIsAdmin(false);
    setAdminEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        adminEmail,
        isLoading,
        login,
        logout,
        refreshAuth: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
