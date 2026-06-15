'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type UserRole = 'student' | 'admin' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  selectedRole: 'student' | 'admin';
  userDNI?: string;
  userCourse?: string;
  schoolId?: string;
  setSelectedRole: (role: 'student' | 'admin') => void;
  login: (username: string, password: string, schoolId: string) => Promise<{ success: boolean; redirectUrl?: string; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children, schoolId = 'savio' }: { children: React.ReactNode; schoolId?: string }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userDNI, setUserDNI] = useState<string>();
  const [userCourse, setUserCourse] = useState<string>();
  const [selectedRole, setSelectedRole] = useState<'student' | 'admin'>('admin');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Restaurar sesión desde sessionStorage si existe
    // sessionStorage se limpia automáticamente al cerrar la pestaña
    // Persiste durante F5/reload en la misma pestaña
    const savedAuth = sessionStorage.getItem('userAuth') === 'true';
    const savedRole = sessionStorage.getItem('userRole') as UserRole;
    const savedDNI = sessionStorage.getItem('userDNI');
    const savedCourse = sessionStorage.getItem('userCourse');
    
    if (savedAuth && savedRole) {
      setIsAuthenticated(true);
      setUserRole(savedRole);
      setUserDNI(savedDNI || undefined);
      setUserCourse(savedCourse || undefined);
    }

    setHydrated(true);
  }, []);

  const login = async (username: string, password: string, loginSchoolId: string): Promise<{ success: boolean; redirectUrl?: string; error?: string }> => {
    // Validar credenciales basadas en el rol seleccionado
    if (selectedRole === 'admin') {
      try {
        const res = await fetch('/api/admin-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: username.toLowerCase(), password, schoolId: loginSchoolId }),
        })
        const data = await res.json()
        if (!res.ok || !data.success) {
          return { success: false, error: data.error ?? 'Credenciales incorrectas' }
        }
        setIsAuthenticated(true);
        setUserRole('admin');
        sessionStorage.setItem('userAuth', 'true');
        sessionStorage.setItem('userRole', 'admin');
        return { success: true, redirectUrl: `/${loginSchoolId}/admin` };
      } catch (err) {
        return { success: false, error: 'Error de conexión. Intenta de nuevo.' };
      }
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
        
        sessionStorage.setItem('userAuth', 'true');
        sessionStorage.setItem('userRole', 'student');
        sessionStorage.setItem('userDNI', username);
        sessionStorage.setItem('userCourse', student.curso);

        // Redirigir a URL externa si es alumno de Diseño e Impresión 3D
        if (student.curso === 'Diseño e Impresión 3D') {
          return { success: true, redirectUrl: 'https://v0-hello-eight-ochre.vercel.app/academy' };
        }

        return { success: true, redirectUrl: '/savio/aula-virtual' };
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
    sessionStorage.removeItem('userAuth');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userDNI');
    sessionStorage.removeItem('userCourse');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userDNI, userCourse, schoolId, selectedRole, setSelectedRole, login, logout }}>
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
