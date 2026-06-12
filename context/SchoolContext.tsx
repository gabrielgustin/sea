'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface SchoolContextType {
  schoolId: string;
  isReady: boolean;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [schoolId, setSchoolId] = useState<string>('savio');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Detecta si la ruta empieza con /villada o /savio
    const segments = pathname.split('/').filter(Boolean);
    const possibleSchoolId = segments[0];

    if (possibleSchoolId === 'villada' || possibleSchoolId === 'savio') {
      setSchoolId(possibleSchoolId);
    } else {
      // Default a savio si no hay schoolId en la ruta
      setSchoolId('savio');
    }
    setIsReady(true);
  }, [pathname]);

  return (
    <SchoolContext.Provider value={{ schoolId, isReady }}>
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
}
