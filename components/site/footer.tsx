'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useSchool } from '@/context/SchoolContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function SiteFooter() {
  const { schoolId, tenant } = useSchool();
  const { settings } = useSiteSettings();
  const base = `/${schoolId}`;

  const cols = [
    {
      title: 'Explorar',
      links: [
        { href: `${base}/catalogo-formaciones`, label: 'Formaciones' },
        { href: `${base}/formaciones`, label: 'Para instituciones' },
        { href: `${base}/trabaja-con-nosotros`, label: 'Trabajá con nosotros' },
        { href: `${base}#contacto`, label: 'Contacto' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { href: `${base}/politicas-de-privacidad`, label: 'Políticas de privacidad' },
        { href: `${base}/condiciones-de-servicio`, label: 'Condiciones de servicio' },
      ],
    },
  ];

  return (
    <footer data-nav="dark" className="relative mt-28 bg-[#031e41] text-white" style={{ backgroundImage: 'radial-gradient(rgb(255 255 255 / .07) 1.4px, transparent 1.6px)', backgroundSize: '26px 26px' }}>
      {/* Franja con el color de la escuela */}
      <div className="h-2 bg-[var(--accent)]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="inline-flex items-center gap-3 rounded-2xl border-2 border-white bg-white px-4 py-3 shadow-[4px_4px_0_var(--accent)]">
              <Image src={tenant.config.seaLogo ?? '/logo-sea.png'} alt="SEA" width={80} height={40} className="h-8 w-auto object-contain" />
              <span className="h-6 w-px bg-slate-200" aria-hidden />
              <Image src={tenant.config.logo} alt={tenant.config.logoAlt} width={100} height={40} className="h-8 w-auto object-contain" />
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              Secretaría de Extensión Académica de {tenant.name}. Formaciones prácticas con certificación oficial.
            </p>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h3 className="text-lg font-bold [font-family:var(--font-display)]">{c.title}</h3>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-white/75 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-lg font-bold [font-family:var(--font-display)]">Contacto</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              {settings.address && (
                <li className="flex gap-2.5"><MapPin size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />{settings.address}</li>
              )}
              {settings.email && (
                <li><a href={`mailto:${settings.email}`} className="flex gap-2.5 transition hover:text-white"><Mail size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />{settings.email}</a></li>
              )}
              {settings.whatsappNumber && (
                <li><a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex gap-2.5 transition hover:text-white"><MessageCircle size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />WhatsApp</a></li>
              )}
              {settings.instagramUrl && (
                <li><a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex gap-2.5 transition hover:text-white"><Instagram size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />Instagram</a></li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {tenant.name}</p>
          <p>Portal SEA · Secretaría de Extensión Académica</p>
        </div>
      </div>
    </footer>
  );
}
