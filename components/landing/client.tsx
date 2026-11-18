'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';

const LINKS = [
  { href: '/#cursos', label: 'Capacitaciones' },
  { href: '/#como', label: 'Cómo funciona' },
  { href: '/#instituciones', label: 'Escuelas' },
  { href: '/#faq', label: 'Preguntas' },
];

// Barra fija tipo píldora: clara u oscura según la sección que tiene debajo (secciones oscuras: data-nav="dark").
export function LandingNav() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

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
        className={`fixed inset-x-3 top-3.5 z-[60] flex h-16 items-center gap-4 rounded-full pl-5 pr-2 backdrop-blur-md transition-[background-color,color,box-shadow] duration-500 sm:inset-x-6 ${
          light
            ? 'bg-white/80 text-slate-900 shadow-[inset_0_0_0_1px_rgb(3_30_65/0.08),0_10px_30px_-18px_rgb(3_30_65/0.45)]'
            : 'bg-[#031e41]/60 text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.14)]'
        }`}
      >
        <Link href="/" className="mr-auto flex items-center gap-3" aria-label="Portal SEA, inicio">
          <Image src="/logo-sea.png" alt="SEA" width={96} height={48} priority className={`h-9 w-auto object-contain transition duration-500 ${light ? '' : 'brightness-0 invert'}`} />
          <span className="hidden text-sm font-semibold leading-tight sm:block">Secretaría de<br />Extensión Académica</span>
        </Link>
        <nav aria-label="Principal" className="hidden gap-1 lg:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className={`rounded-full px-3.5 py-2 text-[14.5px] font-medium transition-colors duration-300 ${tone}`}>{l.label}</a>
          ))}
        </nav>
        <a href="/#sumate" className="hidden rounded-full bg-[#FFC531] px-5 py-3 text-sm font-bold text-[#031e41] transition hover:bg-[#ffd560] active:scale-95 sm:block">
          Sumá tu escuela
        </a>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="menu-landing"
          className="relative size-11 shrink-0 rounded-full bg-[#031e41] lg:hidden"
        >
          <span className={`absolute inset-x-[13px] top-[18px] h-0.5 rounded bg-white transition duration-300 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`absolute inset-x-[13px] top-[25px] h-0.5 rounded bg-white transition duration-300 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </header>

      <div
        id="menu-landing"
        aria-hidden={!open}
        className={`fixed inset-0 z-50 flex flex-col justify-center gap-1 bg-[#031e41] px-6 transition-[clip-path,visibility] duration-700 ease-[cubic-bezier(.7,0,.2,1)] lg:hidden ${
          open ? 'visible [clip-path:circle(150%_at_calc(100%-44px)_46px)]' : 'invisible [clip-path:circle(0%_at_calc(100%-44px)_46px)]'
        }`}
      >
        {LINKS.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            style={{ transitionDelay: open ? `${200 + i * 60}ms` : '0ms' }}
            className={`relative text-[clamp(30px,9vw,46px)] font-extrabold leading-[1.15] tracking-tight text-white transition duration-500 [font-family:var(--font-display)] ${open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
          >
            {l.label}
          </a>
        ))}
        <a
          href="/#sumate"
          onClick={() => setOpen(false)}
          tabIndex={open ? 0 : -1}
          style={{ transitionDelay: open ? `${200 + LINKS.length * 60}ms` : '0ms' }}
          className={`relative mt-8 self-start rounded-full bg-[#FFC531] px-7 py-4 text-lg font-bold text-[#031e41] transition duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          Sumá tu escuela
        </a>
      </div>
    </>
  );
}

export type WallCourse = { key: string; title: string; href: string; image: string | null; area: 'tec' | 'ofi' };

const AREAS = [
  { id: 'all', label: 'Todo' },
  { id: 'tec', label: 'Tecnología' },
  { id: 'ofi', label: 'Oficios' },
] as const;

const TILT = [-2, 1.5, -1, 2, -1.5, 1];
const TAPE = ['#FFC531', '#FF6FA8', '#2FD3A0', '#9cbadb'];

export function CourseWall({ courses }: { courses: WallCourse[] }) {
  const [area, setArea] = useState<(typeof AREAS)[number]['id']>('all');
  const [active, setActive] = useState(0);
  const track = useRef<HTMLUListElement>(null);
  const shown = area === 'all' ? courses : courses.filter((c) => c.area === area);

  // Carrusel del celular: qué tarjeta está centrada (en compu es grilla y no se usa).
  const onScroll = () => {
    const el = track.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    setActive(Math.min(shown.length - 1, Math.round(el.scrollLeft / (first.offsetWidth + 20))));
  };
  const goTo = (i: number) => {
    const item = track.current?.children[i] as HTMLElement | undefined;
    item?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };
  const pick = (id: (typeof AREAS)[number]['id']) => {
    setArea(id);
    setActive(0);
    track.current?.scrollTo({ left: 0 });
  };

  return (
    <>
      <div role="group" aria-label="Filtrar cursos por tema" className="mt-8 flex flex-wrap gap-2 sm:mt-10 sm:gap-2.5">
        {AREAS.map((a) => {
          const n = a.id === 'all' ? courses.length : courses.filter((c) => c.area === a.id).length;
          if (n === 0) return null;
          const on = area === a.id;
          return (
            <button
              key={a.id}
              onClick={() => pick(a.id)}
              aria-pressed={on}
              className={`rounded-full border-2 border-[#031e41] px-4 py-2 text-[15px] font-semibold transition active:scale-95 sm:px-5 sm:py-2.5 sm:text-base ${on ? 'bg-[#031e41] text-white' : 'bg-white text-[#031e41] hover:bg-[#FFC531]'}`}
            >
              {a.label} <span className={on ? 'text-white/60' : 'text-[#031e41]/50'}>{n}</span>
            </button>
          );
        })}
      </div>

      {/* Celular: carrusel horizontal que se desliza de a una tarjeta. Desde sm: grilla. */}
      <ul
        ref={track}
        onScroll={onScroll}
        className="-mx-5 mt-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[11%] pb-8 pt-8 [scrollbar-width:none] sm:mx-0 sm:mt-12 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 sm:overflow-visible sm:p-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
      >
        {shown.map((c, i) => (
          <li key={c.key} className="w-[78%] shrink-0 snap-center sm:w-auto sm:h-full">
            <Link
              href={c.href}
              style={{ ['--tilt' as string]: `${TILT[i % TILT.length]}deg` }}
              className="group relative flex h-full rotate-[var(--tilt)] flex-col rounded-[22px] border-2 border-[#031e41] bg-white p-2.5 pb-4 shadow-[5px_5px_0_#031e41] transition duration-300 hover:-translate-y-1.5 hover:rotate-0 hover:shadow-[8px_9px_0_#031e41] focus-visible:rotate-0 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#3D6BFF]"
            >
              <span aria-hidden className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-3 rounded-sm opacity-90" style={{ background: TAPE[i % TAPE.length] }} />
              <span className="relative block aspect-[4/3] overflow-hidden rounded-[14px] bg-[#EAF2FB]">
                {c.image && <Image src={c.image} alt="" fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />}
              </span>
              <span className="mb-2 mt-3.5 block px-1.5 text-lg font-bold leading-snug text-[#031e41] [font-family:var(--font-display)]">{c.title}</span>
              <span className={`mx-1.5 mt-auto w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.area === 'ofi' ? 'bg-[#FFE7D6] text-[#8a3a00]' : 'bg-[#E3EAFF] text-[#1f3fae]'}`}>
                {c.area === 'ofi' ? 'Oficio' : 'Tecnología'}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Puntos del carrusel (solo celular): muestran dónde estás y llevan a cada tarjeta */}
      {shown.length > 1 && (
        <div className="flex items-center justify-center gap-2 sm:hidden">
          {shown.map((c, i) => (
            <button
              key={c.key}
              onClick={() => goTo(i)}
              aria-label={`Ver ${c.title}`}
              aria-current={i === active}
              className={`h-2.5 rounded-full transition-all duration-300 ${i === active ? 'w-7 bg-[#031e41]' : 'w-2.5 bg-[#031e41]/25'}`}
            />
          ))}
        </div>
      )}
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
          <li key={f.q} className={`overflow-hidden rounded-3xl border-2 border-[#031e41] transition-colors duration-300 ${isOpen ? 'bg-[#FFF4D1]' : 'bg-white'}`}>
            <h3>
              <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-lg font-semibold text-[#031e41]">
                {f.q}
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-full transition duration-300 ${isOpen ? 'rotate-45 bg-[#031e41] text-white' : 'bg-[#FFC531] text-[#031e41]'}`}><Plus size={18} strokeWidth={2.6} /></span>
              </button>
            </h3>
            <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden"><p className="px-6 pb-6 leading-relaxed text-slate-700">{f.a}</p></div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
