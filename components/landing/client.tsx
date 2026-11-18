'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';

// Brillo que sigue al cursor (las variables --x/--y alimentan .spotlight en globals.css).
function track(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
}

export function SpotCard({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <div onPointerMove={track} className={`spotlight ${className}`}>{children}</div>;
}

const LINKS = [
  { href: '#instituciones', label: 'Instituciones' },
  { href: '#incluye', label: 'Qué incluye' },
  { href: '#proceso', label: 'Cómo trabajamos' },
  { href: '#faq', label: 'Preguntas' },
];

// Barra fija tipo píldora: clara u oscura según la sección que tiene debajo (secciones oscuras: data-nav="dark").
export function LandingNav({ whatsapp }: { whatsapp: string }) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      setDark(document.elementsFromPoint(window.innerWidth / 2, 46).some((el) => el.closest('[data-nav="dark"]')));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check); };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame); };
  }, []);

  const light = !dark && !open;
  const tone = light ? 'hover:bg-[#031e41]/[0.08]' : 'hover:bg-white/15';

  return (
    <>
      <header
        className={`rise fixed inset-x-3 top-3.5 z-[60] flex h-16 items-center gap-4 rounded-full pl-5 pr-2 backdrop-blur-md transition-[background-color,color,box-shadow] duration-500 sm:inset-x-6 ${
          light
            ? 'bg-white/75 text-slate-900 shadow-[inset_0_0_0_1px_rgb(3_30_65/0.08),0_10px_30px_-18px_rgb(3_30_65/0.45)]'
            : 'bg-[#031e41]/55 text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.14)]'
        }`}
      >
        <Link href="/" className="mr-auto flex items-center gap-3" aria-label="Portal SEA — inicio">
          <Image src="/logo-sea.png" alt="SEA" width={96} height={48} priority className={`h-9 w-auto object-contain transition duration-500 ${light ? '' : 'brightness-0 invert'}`} />
          <span className="hidden text-sm font-semibold leading-tight sm:block">Secretaría de<br />Extensión Académica</span>
        </Link>
        <nav aria-label="Principal" className="hidden gap-1.5 lg:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className={`rounded-full px-3.5 py-2 text-[14.5px] font-medium transition-colors duration-300 ${tone}`}>{l.label}</a>
          ))}
        </nav>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="group hidden items-center gap-2 rounded-full bg-[#9cbadb] px-5 py-3 text-sm font-semibold text-[#031e41] transition hover:bg-white active:scale-95 sm:flex"
        >
          Sumá tu institución <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
        </a>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="menu-landing"
          className="relative size-11 shrink-0 rounded-full bg-white lg:hidden"
        >
          <span className={`absolute inset-x-[13px] top-[18px] h-0.5 rounded bg-[#031e41] transition duration-300 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`absolute inset-x-[13px] top-[25px] h-0.5 rounded bg-[#031e41] transition duration-300 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </header>

      <div
        id="menu-landing"
        aria-hidden={!open}
        className={`fixed inset-0 z-50 flex flex-col justify-center gap-1 bg-[#031e41] px-6 transition-[clip-path,visibility] duration-700 ease-[cubic-bezier(.7,0,.2,1)] lg:hidden ${
          open ? 'visible [clip-path:circle(150%_at_calc(100%-44px)_46px)]' : 'invisible [clip-path:circle(0%_at_calc(100%-44px)_46px)]'
        }`}
      >
        <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
        {LINKS.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            style={{ transitionDelay: open ? `${200 + i * 60}ms` : '0ms' }}
            className={`relative text-[clamp(28px,8vw,44px)] font-semibold uppercase leading-[1.15] tracking-tight text-white transition duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
          >
            {l.label}
          </a>
        ))}
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={open ? 0 : -1}
          style={{ transitionDelay: open ? `${200 + LINKS.length * 60}ms` : '0ms' }}
          className={`relative mt-6 self-start text-[clamp(24px,7vw,36px)] font-semibold uppercase leading-[1.15] tracking-tight text-[#9cbadb] transition duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          Sumá tu institución →
        </a>
      </div>
    </>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="space-y-3">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <li key={f.q} className={`reveal overflow-hidden rounded-3xl border transition-colors duration-300 ${isOpen ? 'border-[#031e41]/20 bg-[#f4f7fb]' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
            <h3>
              <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-lg font-medium text-slate-900">
                {f.q}
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-full transition duration-300 ${isOpen ? 'rotate-45 bg-[#031e41] text-white' : 'bg-slate-100 text-[#031e41]'}`}><Plus size={18} /></span>
              </button>
            </h3>
            <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden"><p className="px-6 pb-6 leading-relaxed text-slate-600">{f.a}</p></div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function InstitutionLink({ href, name, logo, count }: { href: string; name: string; logo: string; count: number | null }) {
  return (
    <Link
      href={href}
      onPointerMove={track}
      className="spotlight group flex items-center gap-4 rounded-2xl bg-white p-3 pr-4 text-slate-900 shadow-lg transition duration-500 hover:-translate-y-1 hover:shadow-2xl"
    >
      <span className="flex h-16 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-2">
        <Image src={logo} alt="" width={96} height={64} className="max-h-full w-auto object-contain" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold">{name}</span>
        <span className="block text-sm text-slate-500">{count === null ? 'Ver formaciones' : `${count} ${count === 1 ? 'formación' : 'formaciones'}`}</span>
      </span>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#031e41] text-white transition duration-500 group-hover:bg-[#9cbadb] group-hover:text-[#031e41]">
        <ArrowUpRight size={18} className="transition duration-500 group-hover:rotate-45" />
      </span>
    </Link>
  );
}
