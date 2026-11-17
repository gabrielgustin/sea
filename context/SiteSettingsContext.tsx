'use client';

import React, { createContext, useContext, useState } from 'react';
import type { FAQ, SiteSettings } from '@/lib/default-settings';

export type { FAQ, SiteSettings };

interface SiteSettingsContextType {
  faqs: FAQ[];
  settings: SiteSettings;
  loading: boolean;
  addFAQ: (faq: Omit<FAQ, 'id'>) => void;
  updateFAQ: (id: number, faq: Partial<FAQ>) => void;
  deleteFAQ: (id: number) => void;
  reorderFAQs: (faqs: FAQ[]) => void;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({
  children,
  schoolId,
  initialSettings,
  initialFaqs,
}: {
  children: React.ReactNode;
  schoolId: string;
  initialSettings: SiteSettings;
  initialFaqs: FAQ[];
}) {
  const [faqs, setFAQs] = useState<FAQ[]>(initialFaqs);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const api = `/api/${schoolId}/settings`;

  const saveFaqs = async (next: FAQ[]) => {
    setFAQs(next);
    // Las preguntas frecuentes se guardan en la base del cliente (antes quedaban solo en el navegador de quien las editaba).
    try {
      await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ faqs: JSON.stringify(next) }) });
    } catch (error) {
      console.error('Failed to save FAQs:', error);
    }
  };

  const addFAQ = (faq: Omit<FAQ, 'id'>) => saveFaqs([...faqs, { ...faq, id: Date.now() }]);
  const updateFAQ = (id: number, data: Partial<FAQ>) => saveFaqs(faqs.map((f) => (f.id === id ? { ...f, ...data } : f)));
  const deleteFAQ = (id: number) => saveFaqs(faqs.filter((f) => f.id !== id));
  const reorderFAQs = (next: FAQ[]) => saveFaqs(next);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    try {
      await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newSettings) });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <SiteSettingsContext.Provider value={{ faqs, settings, loading: false, addFAQ, updateFAQ, deleteFAQ, reorderFAQs, updateSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  return context;
}
