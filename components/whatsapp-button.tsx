'use client';

import { MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function WhatsAppButton() {
  const { settings } = useSiteSettings();
  if (!settings.whatsappNumber) return null;
  const href = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappMessage)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-5px_rgb(37_211_102/0.6)] transition hover:scale-110"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 motion-safe:animate-ping [animation-duration:2.5s]" aria-hidden />
      <MessageCircle size={26} className="relative" />
    </a>
  );
}
