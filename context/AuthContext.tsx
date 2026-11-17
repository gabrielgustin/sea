'use client';

import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'student' | 'admin' | null;
export type InitialSession = { role: UserRole; dni?: string; course?: string };

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  selectedRole: 'student' | 'admin';
  userDNI?: string;
  userCourse?: string;
  schoolId: string;
  hydrated: boolean;
  setSelectedRole: (role: 'student' | 'admin') => void;
  login: (username: string, password: string) => Promise<{ success: boolean; redirectUrl?: string; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// La sesión vive en una cookie httpOnly que firma el servidor (una por cliente). Acá solo se refleja su estado:
// el navegador ya no decide quién es admin.
export function AuthProvider({ children, schoolId, initialSession }: { children: React.ReactNode; schoolId: string; initialSession: InitialSession }) {
  const [session, setSession] = useState<InitialSession>(initialSession);
  const [selectedRole, setSelectedRole] = useState<'student' | 'admin'>('admin');

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(`/api/${schoolId}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole, username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return { success: false, error: data.error ?? 'Credenciales incorrectas' };
      setSession({ role: data.role, dni: data.dni, course: data.course });
      if (data.role === 'admin') return { success: true, redirectUrl: `/${schoolId}/admin` };
      // Alumnos de este curso usan una plataforma externa.
      if (data.course === 'Diseño e Impresión 3D') return { success: true, redirectUrl: 'https://v0-hello-eight-ochre.vercel.app/academy' };
      return { success: true, redirectUrl: `/${schoolId}/aula-virtual` };
    } catch {
      return { success: false, error: 'Error de conexión. Intenta de nuevo.' };
    }
  };

  const logout = async () => {
    await fetch(`/api/${schoolId}/auth/logout`, { method: 'POST' }).catch(() => {});
    setSession({ role: null });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: session.role !== null,
        userRole: session.role,
        userDNI: session.dni,
        userCourse: session.course,
        schoolId,
        hydrated: true,
        selectedRole,
        setSelectedRole,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
