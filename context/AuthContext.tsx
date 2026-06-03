'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type UserRole = 'student' | 'admin' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  selectedRole: 'student' | 'admin';
  setSelectedRole: (role: 'student' | 'admin') => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [selectedRole, setSelectedRole] = useState<'student' | 'admin'>('admin');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Sincronizar estado con localStorage después del mount
    const savedAuth = localStorage.getItem('userAuth') === 'true';
    const savedRole = localStorage.getItem('userRole') as UserRole;
    
    if (savedAuth && savedRole) {
      setIsAuthenticated(true);
      setUserRole(savedRole);
    }
    setHydrated(true);
  }, []);

  const login = (username: string, password: string): boolean => {
    // Validar credenciales basadas en el rol seleccionado
    if (selectedRole === 'admin') {
      if (username === 'admin' && password === 'admin') {
        setIsAuthenticated(true);
        setUserRole('admin');
        localStorage.setItem('userAuth', 'true');
        localStorage.setItem('userRole', 'admin');
        return true;
      }
    } else if (selectedRole === 'student') {
      if (username === 'alumno' && password === 'alumno') {
        setIsAuthenticated(true);
        setUserRole('student');
        localStorage.setItem('userAuth', 'true');
        localStorage.setItem('userRole', 'student');
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('userAuth');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, selectedRole, setSelectedRole, login, logout }}>
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
