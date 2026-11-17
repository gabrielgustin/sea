'use client';

import React, { createContext, useContext } from 'react';
import type { PublicTenant } from '@/lib/tenants/types';

interface SchoolContextType {
  schoolId: string; // slug del cliente (lo que va en la URL)
  tenant: PublicTenant;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export function SchoolProvider({ children, tenant }: { children: React.ReactNode; tenant: PublicTenant }) {
  return <SchoolContext.Provider value={{ schoolId: tenant.slug, tenant }}>{children}</SchoolContext.Provider>;
}

export function useSchool() {
  const context = useContext(SchoolContext);
  if (!context) throw new Error('useSchool must be used within a SchoolProvider');
  return context;
}
