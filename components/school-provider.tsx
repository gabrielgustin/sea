'use client';

import { CoursesProvider } from '@/context/CoursesContext';
import { AuthProvider } from '@/context/AuthContext';

export function SchoolProvider({ children, schoolId }: { children: React.ReactNode; schoolId: string }) {
  return (
    <AuthProvider schoolId={schoolId}>
      <CoursesProvider schoolId={schoolId}>
        {children}
      </CoursesProvider>
    </AuthProvider>
  );
}
