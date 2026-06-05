'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

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
  addFAQ: (faq: Omit<FAQ, 'id'>) => void;
  updateFAQ: (id: number, faq: Partial<FAQ>) => void;
  deleteFAQ: (id: number) => void;
  reorderFAQs: (faqs: FAQ[]) => void;
  updateSettings: (settings: Partial<SiteSettings>) => void;
}

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

const defaultSettings: SiteSettings = {
  instagramUrl: 'https://www.instagram.com/seu_villada/',
  whatsappNumber: '5493516307002',
  whatsappMessage: 'Hola! Me interesa obtener más información sobre los cursos disponibles.',
  email: 'extension@itsvillada.edu.ar',
  address: 'Cno a La Calera km 7 1/2 Valle',
};

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedFAQs = localStorage.getItem('site_faqs');
    const savedSettings = localStorage.getItem('site_settings');
    
    if (savedFAQs) {
      try {
        setFAQs(JSON.parse(savedFAQs));
      } catch {
        setFAQs(defaultFAQs);
      }
    } else {
      setFAQs(defaultFAQs);
    }

    if (savedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  // Save FAQs to localStorage whenever they change
  useEffect(() => {
    if (faqs.length > 0) {
      localStorage.setItem('site_faqs', JSON.stringify(faqs));
    }
  }, [faqs]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('site_settings', JSON.stringify(settings));
  }, [settings]);

  const addFAQ = (faq: Omit<FAQ, 'id'>) => {
    const newFAQ: FAQ = {
      ...faq,
      id: Date.now(),
    };
    setFAQs((prev) => [...prev, newFAQ]);
  };

  const updateFAQ = (id: number, faqData: Partial<FAQ>) => {
    setFAQs((prev) =>
      prev.map((faq) => (faq.id === id ? { ...faq, ...faqData } : faq))
    );
  };

  const deleteFAQ = (id: number) => {
    setFAQs((prev) => prev.filter((faq) => faq.id !== id));
  };

  const reorderFAQs = (newFAQs: FAQ[]) => {
    setFAQs(newFAQs);
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        faqs,
        settings,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        reorderFAQs,
        updateSettings,
      }}
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
