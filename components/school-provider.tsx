'use client';

import { CoursesProvider } from '@/context/CoursesContext';
import { AuthProvider } from '@/context/AuthContext';
import { SchoolProvider as SchoolContextProvider } from '@/context/SchoolContext';
import { SiteSettingsProvider } from '@/context/SiteSettingsContext';

export function SchoolProvider({ children, schoolId }: { children: React.ReactNode; schoolId: string }) {
  return (
    <SchoolContextProvider>
      <AuthProvider schoolId={schoolId}>
        <CoursesProvider schoolId={schoolId}>
          <SiteSettingsProvider schoolId={schoolId}>
            {children}
          </SiteSettingsProvider>
        </CoursesProvider>
      </AuthProvider>
    </SchoolContextProvider>
  );
}
