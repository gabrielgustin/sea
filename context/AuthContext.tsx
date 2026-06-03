'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type UserRole = 'student' | 'admin' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  login: (username: string, password: string) => boolean;
  setUserRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('userAuth');
    const savedRole = localStorage.getItem('userRole') as UserRole;
    if (savedAuth === 'true' && savedRole) {
      setIsAuthenticated(true);
      setUserRole(savedRole);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Simple hardcoded credentials for demo
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('userAuth', 'true');
      return true;
    }
    return false;
  };

  const setRole = (role: UserRole) => {
    setUserRole(role);
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('userAuth');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, setUserRole: setRole, logout }}>
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
