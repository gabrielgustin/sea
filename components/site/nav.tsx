'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Instagram, LayoutDashboard, LogIn } from 'lucide-react';
import { useSchool } from '@/context/SchoolContext';
import { useAuth } from '@/context/AuthContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import LoginModal from '@/components/login-modal';

// Barra fija tipo píldora (como somoswavi.com): siempre visible y cambia de color según la sección que tiene debajo.
// Las secciones oscuras se marcan con data-nav="dark".
export default function SiteNav() {
  const { schoolId, tenant } = useSchool();
  const { isAuthenticated } = useAuth();
  const { settings } = useSiteSettings();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      // Qué hay debajo del centro de la barra (la barra misma se ignora porque no tiene data-nav).
      const under = document.elementsFromPoint(window.innerWidth / 2, 46);
      setDark(under.some((el) => el.closest('[data-nav="dark"]')));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check); };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  const base = `/${schoolId}`;
  const links = [
    { href: base, label: 'Inicio' },
    { href: `${base}/catalogo-formaciones`, label: 'Formaciones' },
    { href: `${base}/formaciones`, label: 'Para instituciones' },
    { href: `${base}/trabaja-con-nosotros`, label: 'Trabajá con nosotros' },
    { href: `${base}#contacto`, label: 'Contacto' },
  ];
  const isActive = (href: string) => (href === base ? pathname === base : pathname.startsWith(href));
  const account = () => (isAuthenticated ? router.push(`${base}/admin`) : setLoginOpen(true));
  const light = (tenant.config.navLight || !dark) && !open;
  // Los logos son PNG de color: sobre fondo oscuro se muestran en blanco.
  const logoTone = light ? '' : 'brightness-0 invert';

  return (
    <>
      {/* Barra de progreso de lectura (CSS puro; si el navegador no lo soporta, no se muestra) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[70] hidden h-[3px] origin-left bg-[var(--accent)] [animation:fill-x_linear_both] [animation-timeline:scroll(root)] supports-[animation-timeline:scroll()]:block"
      />

      <header
        className={`rise fixed inset-x-3 top-3.5 z-[60] flex h-16 items-center gap-4 rounded-full pl-5 pr-2 backdrop-blur-md transition-[background-color,color,box-shadow] duration-500 sm:inset-x-6 ${
          light
            ? 'bg-white/75 text-slate-900 shadow-[inset_0_0_0_1px_rgb(3_30_65/0.08),0_10px_30px_-18px_rgb(3_30_65/0.45)]'
            : 'bg-[#031e41]/55 text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.14)]'
        }`}
      >
        <div className="mr-auto flex shrink-0 items-center gap-3">
          {/* El sello SEA lleva a la página madre (portalsea.com.ar); el logo de la escuela, a su inicio. */}
          <Link href="/" aria-label="Portal SEA, página principal">
            {tenant.config.seaLogo ? (
              <Image src={tenant.config.seaLogo} alt={tenant.config.seaLogoAlt ?? 'SEA'} width={96} height={48} priority className={`h-8 w-auto object-contain transition duration-500 ${logoTone}`} />
            ) : (
              <Image src={light ? '/logo-sea.svg' : '/logo-sea-dark.svg'} alt="SEA" width={40} height={40} priority className="size-10 transition hover:scale-105" />
            )}
          </Link>
          <span className={`h-6 w-px transition-colors duration-500 ${light ? 'bg-slate-300' : 'bg-white/30'}`} aria-hidden />
          <Link href={base} aria-label={`Inicio — ${tenant.name}`}>
            <Image src={tenant.config.logo} alt={tenant.config.logoAlt} width={120} height={48} priority className={`h-8 w-auto object-contain transition duration-500 ${logoTone}`} />
          </Link>
        </div>

        <nav aria-label="Principal" className="hidden gap-1.5 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? 'page' : undefined}
              className={`rounded-full px-3.5 py-2 text-[14.5px] font-medium transition-colors duration-300 ${
                light ? 'hover:bg-[#031e41]/[0.08]' : 'hover:bg-white/15'
              } ${isActive(l.href) ? (light ? 'bg-[#031e41]/[0.08]' : 'bg-white/15') : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {settings.instagramUrl && (
          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className={`hidden size-10 items-center justify-center rounded-full transition-colors sm:flex ${light ? 'hover:bg-[#031e41]/[0.08]' : 'hover:bg-white/15'}`}
          >
            <Instagram size={19} />
          </a>
        )}
        <button
          onClick={account}
          className="group hidden items-center gap-2 rounded-full border-2 border-[#031e41] bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-[var(--accent-ink)] shadow-[3px_3px_0_#031e41] transition hover:-translate-y-0.5 hover:shadow-[4px_5px_0_#031e41] active:translate-y-0 active:shadow-none sm:flex"
        >
          {isAuthenticated ? <LayoutDashboard size={16} /> : <LogIn size={16} />}
          {isAuthenticated ? 'Panel' : 'Ingresar'}
        </button>

        {/* Hamburguesa: dos líneas que se cruzan en X */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="menu-movil"
          className="relative size-11 shrink-0 rounded-full bg-[#031e41] ring-2 ring-white/40 lg:hidden"
        >
          <span className={`absolute inset-x-[13px] top-[18px] h-0.5 rounded bg-white transition duration-300 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`absolute inset-x-[13px] top-[25px] h-0.5 rounded bg-white transition duration-300 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </header>

      {/* Menú móvil a pantalla completa: se abre en círculo desde la hamburguesa */}
      <div
        id="menu-movil"
        aria-hidden={!open}
        className={`fixed inset-0 z-50 flex flex-col justify-center gap-1 bg-[#031e41] px-6 transition-[clip-path,visibility] duration-700 ease-[cubic-bezier(.7,0,.2,1)] lg:hidden ${
          open ? 'visible [clip-path:circle(150%_at_calc(100%-44px)_46px)]' : 'invisible [clip-path:circle(0%_at_calc(100%-44px)_46px)]'
        }`}
      >
        <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
        {links.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            style={{ transitionDelay: open ? `${200 + i * 60}ms` : '0ms' }}
            className={`relative text-[clamp(30px,9vw,46px)] font-extrabold leading-[1.15] tracking-tight transition duration-500 [font-family:var(--font-display)] ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            } ${isActive(l.href) ? 'text-[var(--accent)]' : 'text-white'}`}
          >
            {l.label}
          </Link>
        ))}
        <button
          onClick={() => { setOpen(false); account(); }}
          tabIndex={open ? 0 : -1}
          style={{ transitionDelay: open ? `${200 + links.length * 60}ms` : '0ms' }}
          className={`relative mt-8 self-start rounded-full border-2 border-white bg-[var(--accent)] px-7 py-4 text-lg font-bold text-[var(--accent-ink)] transition duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          {isAuthenticated ? 'Ir al panel' : 'Ingresar'}
        </button>
        {settings.instagramUrl && (
          <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} className={`relative mt-10 flex items-center gap-2 text-sm text-white/60 transition duration-500 ${open ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: open ? '600ms' : '0ms' }}>
            <Instagram size={18} /> Instagram
          </a>
        )}
      </div>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
