'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSchool } from './SchoolContext';

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  order: number;
}

export interface SiteSettings {
  instagramUrl: string;
  whatsappNumber: string;
  whatsappMessage: string;
  email: string;
  address: string;
}

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

// Default settings for Villada
const defaultSettingsVillada: SiteSettings = {
  instagramUrl: 'https://www.instagram.com/itsvillada/?hl=es',
  whatsappNumber: '5493516307002',
  whatsappMessage: 'Hola! Me interesa obtener más información sobre los cursos disponibles.',
  email: 'formaciones@portalsea.com.ar',
  address: 'Cno a La Calera km 7 1/2 Valle',
};

// Default settings for Savio
const defaultSettingsSavio: SiteSettings = {
  instagramUrl: 'https://www.instagram.com/colegio.savio',
  whatsappNumber: '5491234567890',
  whatsappMessage: 'Hola! Me interesa obtener más información sobre los cursos del Colegio Savio.',
  email: 'contacto@colegiosavio.edu.ar',
  address: 'Dirección del Colegio Savio',
};

const defaultFAQs: FAQ[] = [
  {
    id: 1,
    question: '¿Cómo me inscribo a un curso?',
    answer: 'Para inscribirte, simplemente navega al curso de tu interés y haz clic en el botón "Inscribirme". Completa el formulario con tus datos y recibirás confirmación por email.',
    order: 1,
  },
  {
    id: 2,
    question: '¿Cuáles son las formas de pago?',
    answer: 'Aceptamos transferencias bancarias, Mercado Pago y pagos en efectivo en nuestra sede. Consulta con el equipo administrativo para planes de financiación.',
    order: 2,
  },
  {
    id: 3,
    question: '¿Otorgan certificados?',
    answer: 'Sí, todos nuestros cursos otorgan certificado oficial de la Secretaría de Extensión Académica del ITS Villada al completar satisfactoriamente el programa.',
    order: 3,
  },
  {
    id: 4,
    question: '¿Puedo tomar cursos si no soy estudiante del ITS Villada?',
    answer: 'Sí, nuestros cursos están abiertos a toda la comunidad. No es necesario ser estudiante del instituto para inscribirse.',
    order: 4,
  },
];

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const { schoolId, isReady } = useSchool();
  const [faqs, setFAQs] = useState<FAQ[]>(defaultFAQs);
  const [settings, setSettings] = useState<SiteSettings>(schoolId === 'savio' ? defaultSettingsSavio : defaultSettingsVillada);
  const [loading, setLoading] = useState(true);

  // Load settings from DB on mount and when schoolId changes
  useEffect(() => {
    if (!isReady) return;

    async function loadSettings() {
      try {
        const res = await fetch(`/api/settings?schoolId=${schoolId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.settings && Object.keys(data.settings).length > 0) {
            const defaultSettings = schoolId === 'savio' ? defaultSettingsSavio : defaultSettingsVillada;
            setSettings((prev) => ({ ...prev, ...data.settings }));
          } else {
            // If no DB settings, use defaults for this school
            const defaultSettings = schoolId === 'savio' ? defaultSettingsSavio : defaultSettingsVillada;
            setSettings(defaultSettings);
          }
        }
      } catch (error) {
        console.error('[v0] Failed to load settings from DB:', error);
        // Fallback to defaults
        const defaultSettings = schoolId === 'savio' ? defaultSettingsSavio : defaultSettingsVillada;
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();

    // FAQs from localStorage (scoped by schoolId)
    const savedFAQs = localStorage.getItem(`site_faqs_${schoolId}`);
    if (savedFAQs) {
      try { setFAQs(JSON.parse(savedFAQs)); } catch { setFAQs(defaultFAQs); }
    }
  }, [schoolId, isReady]);

  // Save FAQs to localStorage whenever they change
  useEffect(() => {
    if (faqs.length > 0 && isReady) {
      localStorage.setItem(`site_faqs_${schoolId}`, JSON.stringify(faqs));
    }
  }, [faqs, schoolId, isReady]);

  const addFAQ = (faq: Omit<FAQ, 'id'>) => {
    const newFAQ: FAQ = { ...faq, id: Date.now() };
    setFAQs((prev) => [...prev, newFAQ]);
  };

  const updateFAQ = (id: number, faqData: Partial<FAQ>) => {
    setFAQs((prev) => prev.map((faq) => (faq.id === id ? { ...faq, ...faqData } : faq)));
  };

  const deleteFAQ = (id: number) => {
    setFAQs((prev) => prev.filter((faq) => faq.id !== id));
  };

  const reorderFAQs = (newFAQs: FAQ[]) => {
    setFAQs(newFAQs);
  };

  // Save settings to DB and update local state
  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    try {
      await fetch(`/api/settings?schoolId=${schoolId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
    } catch (error) {
      console.error('[v0] Failed to save settings to DB:', error);
    }
  };

  return (
    <SiteSettingsContext.Provider
      value={{ faqs, settings, loading, addFAQ, updateFAQ, deleteFAQ, reorderFAQs, updateSettings }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
}
