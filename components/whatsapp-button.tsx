'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const whatsappLink = 'https://wa.me/1234567890'; // Reemplaza con tu número

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
      style={{ backgroundColor: '#25D366', width: '60px', height: '60px' }}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={32} className="text-white" />
    </a>
  );
}
