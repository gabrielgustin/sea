'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type UserRole = 'student' | 'admin' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  selectedRole: 'student' | 'admin';
  userDNI?: string;
  userCourse?: string;
  setSelectedRole: (role: 'student' | 'admin') => void;
  login: (username: string, password: string) => Promise<{ success: boolean; redirectUrl?: string; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userDNI, setUserDNI] = useState<string>();
  const [userCourse, setUserCourse] = useState<string>();
  const [selectedRole, setSelectedRole] = useState<'student' | 'admin'>('admin');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Solo ejecutar en cliente
    if (typeof window === 'undefined') {
      setHydrated(true);
      return;
    }

    // Restaurar estado de autenticación del localStorage
    const savedAuth = localStorage.getItem('userAuth') === 'true';
    const savedRole = localStorage.getItem('userRole') as UserRole;
    const savedDNI = localStorage.getItem('userDNI');
    const savedCourse = localStorage.getItem('userCourse');
    
    if (savedAuth && savedRole) {
      setIsAuthenticated(true);
      setUserRole(savedRole);
      setUserDNI(savedDNI || undefined);
      setUserCourse(savedCourse || undefined);
    }

    setHydrated(true);
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; redirectUrl?: string; error?: string }> => {
    // Validar credenciales basadas en el rol seleccionado
    if (selectedRole === 'admin') {
      if (username === 'admin' && password === 'admin') {
        setIsAuthenticated(true);
        setUserRole('admin');
        localStorage.setItem('userAuth', 'true');
        localStorage.setItem('userRole', 'admin');
        return { success: true, redirectUrl: '/admin' };
      }
      return { success: false, error: 'Credenciales incorrectas' };
    } else if (selectedRole === 'student') {
      // Validar DNI como usuario y contraseña
      if (!username || !password || username !== password) {
        return { success: false, error: 'El usuario y la contraseña deben ser el mismo (tu DNI)' };
      }

      // Buscar el estudiante por DNI
      try {
        const response = await fetch('/api/students');
        const data = await response.json();
        const students = data.students || [];
        
        const student = students.find((s: any) => s.dni === username);
        
        if (!student) {
          return { success: false, error: 'DNI no encontrado en el sistema' };
        }

        // Autenticar al estudiante
        setIsAuthenticated(true);
        setUserRole('student');
        setUserDNI(username);
        setUserCourse(student.curso);
        
        localStorage.setItem('userAuth', 'true');
        localStorage.setItem('userRole', 'student');
        localStorage.setItem('userDNI', username);
        localStorage.setItem('userCourse', student.curso);

        // Redirigir a URL externa si es alumno de Diseño e Impresión 3D
        if (student.curso === 'Diseño e Impresión 3D') {
          return { success: true, redirectUrl: 'https://v0-hello-eight-ochre.vercel.app/academy' };
        }

        return { success: true, redirectUrl: '/aula-virtual' };
      } catch (error) {
        console.error('[v0] Error validating student:', error);
        return { success: false, error: 'Error al validar credenciales. Intenta de nuevo.' };
      }
    }
    return { success: false, error: 'Rol no válido' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserDNI(undefined);
    setUserCourse(undefined);
    localStorage.removeItem('userAuth');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userDNI');
    localStorage.removeItem('userCourse');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userDNI, userCourse, selectedRole, setSelectedRole, login, logout }}>
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
