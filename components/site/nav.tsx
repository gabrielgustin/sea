'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Instagram, Menu, X, LayoutDashboard, LogIn } from 'lucide-react';
import { useSchool } from '@/context/SchoolContext';
import { useAuth } from '@/context/AuthContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import LoginModal from '@/components/login-modal';

export default function SiteNav() {
  const { schoolId, tenant } = useSchool();
  const { isAuthenticated } = useAuth();
  const { settings } = useSiteSettings();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const base = `/${schoolId}`;
  const links = [
    { href: base, label: 'Inicio' },
    { href: `${base}/catalogo-formaciones`, label: 'Formaciones' },
    { href: `${base}/formaciones`, label: 'Para instituciones' },
    { href: `${base}/trabaja-con-nosotros`, label: 'Trabajá con nosotros' },
    { href: `${base}#contacto`, label: 'Contacto' },
  ];
  const isActive = (href: string) => (href === base ? pathname === base : pathname.startsWith(href));
  const seaLogo = tenant.config.seaLogo ?? '/logo-sea.png';

  const account = () => (isAuthenticated ? router.push(`${base}/admin`) : setLoginOpen(true));

  return (
    <>
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
        <nav
          aria-label="Principal"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/75 pl-3 pr-2 shadow-[0_8px_30px_rgb(3_30_65/0.08)] backdrop-blur-xl backdrop-saturate-150 sm:pl-4"
        >
          <Link href={base} className="flex shrink-0 items-center gap-3" aria-label={`Inicio — ${tenant.name}`}>
            <Image src={seaLogo} alt={tenant.config.seaLogoAlt ?? 'SEA'} width={96} height={48} className="h-9 w-auto object-contain" priority />
            <span className="h-7 w-px bg-slate-200" aria-hidden />
            <Image src={tenant.config.logo} alt={tenant.config.logoAlt} width={120} height={48} className="h-9 w-auto object-contain" priority />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:text-[#031e41] ${
                    isActive(l.href) ? 'text-[#031e41]' : 'text-slate-500'
                  }`}
                >
                  {l.label}
                  {isActive(l.href) && <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-[#031e41]" />}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hidden size-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-[#031e41] sm:flex"
              >
                <Instagram size={19} />
              </a>
            )}
            <button
              onClick={account}
              className="hidden items-center gap-2 rounded-xl bg-[#031e41] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b2d5c] active:scale-95 sm:flex"
            >
              {isAuthenticated ? <LayoutDashboard size={16} /> : <LogIn size={16} />}
              {isAuthenticated ? 'Panel' : 'Ingresar'}
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
              className="flex size-11 items-center justify-center rounded-xl text-[#031e41] transition hover:bg-slate-100 lg:hidden"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Menú móvil */}
        <div
          className={`absolute inset-x-3 top-[calc(100%+0.5rem)] origin-top sm:inset-x-5 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur-xl transition-all duration-300 lg:hidden ${
            open ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0'
          }`}
        >
          <ul className="p-2">
            {links.map((l, i) => (
              <li key={l.href} style={{ transitionDelay: open ? `${60 + i * 40}ms` : '0ms' }} className={`transition-all duration-300 ${open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium ${isActive(l.href) ? 'bg-slate-100 text-[#031e41]' : 'text-slate-600'}`}
                >
                  {l.label}
                  <span aria-hidden className="text-slate-300">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 border-t border-slate-100 p-3">
            <button onClick={() => { setOpen(false); account(); }} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#031e41] py-3 text-sm font-semibold text-white">
              {isAuthenticated ? <LayoutDashboard size={16} /> : <LogIn size={16} />}
              {isAuthenticated ? 'Panel' : 'Ingresar'}
            </button>
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex w-14 items-center justify-center rounded-xl border border-slate-200 text-[#031e41]">
                <Instagram size={19} />
              </a>
            )}
          </div>
        </div>
      </header>
      {open && <div className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-[2px] lg:hidden" onClick={() => setOpen(false)} aria-hidden />}

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
