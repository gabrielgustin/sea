'use client';

import { MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function WhatsAppButton() {
  const { settings } = useSiteSettings();
  const whatsappLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappMessage)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
      style={{ backgroundColor: '#25D366', width: '60px', height: '60px' }}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={32} className="text-white" />
    </a>
  );
}
