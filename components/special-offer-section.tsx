'use client';

import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useInView } from '@/hooks/useInView';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function SpecialOfferSection() {
  const { settings } = useSiteSettings();
  const { ref, isInView } = useInView({ once: true, threshold: 0.15 });
  const whatsappLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappMessage)}`;

  return (
    <section ref={ref} className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div
        className={`max-w-4xl mx-auto rounded-3xl bg-white p-6 md:p-12 transition-all duration-700 ${
          isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`}
        style={{ border: '2px solid #031e41' }}
      >
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full mb-4 md:mb-6" style={{ backgroundColor: '#031e41' }}>
            <Sparkles className="text-white" size={24} />
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4" style={{ color: '#031e41' }}>
            Oferta Especial
          </h2>
          <p className="text-sm md:text-lg leading-relaxed text-gray-700">
            Inscribite ahora en nuestras formaciones especiales. ¡Plazas limitadas! Acceso a contenido premium, certificados oficiales y acompañamiento personalizado.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
          <Link
            href="/villada/formaciones"
            className="px-6 md:px-10 py-2.5 md:py-4 text-white font-semibold rounded-full transition-opacity hover:opacity-90 text-sm md:text-base text-center"
            style={{ backgroundColor: '#031e41' }}
          >
            Reservar mi lugar
          </Link>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 md:px-10 py-2.5 md:py-4 text-white font-semibold rounded-full transition-opacity hover:opacity-90 text-sm md:text-base text-center"
            style={{ backgroundColor: '#25D366' }}
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
