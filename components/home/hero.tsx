'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  slideDuration?: string;
  slideModality?: string;
  slideStart?: string;
}

const DELAY = 6500;
const D = '[font-family:var(--font-display)]';
const pegboard = { backgroundImage: 'radial-gradient(rgb(3 30 65 / .14) 1.4px, transparent 1.6px)', backgroundSize: '26px 26px' };
const TAPE = ['#FFC531', '#FF6FA8', '#2FD3A0', '#9cbadb'];

// Los slides viejos guardaban los datos en el subtítulo ("Modalidad: …", "Fecha de Inicio: …", "Duración: …").
function meta(s: Slide) {
  const lines = (s.subtitle ?? '').split('\n').map((l) => l.trim()).filter(Boolean);
  const pick = (p: string) => lines.find((l) => l.startsWith(p))?.slice(p.length).trim() ?? '';
  return [
    { k: 'Modalidad', v: s.slideModality || pick('Modalidad:') },
    { k: 'Inicia', v: s.slideStart || pick('Fecha de Inicio:') },
    { k: 'Duración', v: s.slideDuration || pick('Duración:') },
  ].filter((m) => m.v);
}

// Lugar de cada foto en la pila según su distancia a la actual: 0 arriba y después las de atrás.
// La que deja de estar arriba pasa al fondo de la pila (sin salir volando), igual tenga la escuela 2 fotos o 10.
function place(offset: number): React.CSSProperties {
  if (offset === 0) return { transform: 'translate(0,0) rotate(-3deg) scale(1)', zIndex: 30, opacity: 1 };
  if (offset === 1) return { transform: 'translate(7%, -5%) rotate(6deg) scale(.93)', zIndex: 20, opacity: 1 };
  if (offset === 2) return { transform: 'translate(-6%, 4%) rotate(-9deg) scale(.88)', zIndex: 10, opacity: 1 };
  return { transform: 'translate(0, 6%) rotate(3deg) scale(.82)', zIndex: 0, opacity: 0 };
}

export default function Hero({ slides, schoolName, catalogHref, courseCount = 0 }: { slides: Slide[]; schoolName: string; catalogHref: string; courseCount?: number }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0); // reinicia la cuenta del autoplay al navegar a mano
  const swipe = useRef<number | null>(null);
  const n = slides.length;

  const go = useCallback((i: number) => { setCurrent(((i % n) + n) % n); setTick((t) => t + 1); }, [n]);

  useEffect(() => {
    if (n < 2 || paused) return;
    const t = setTimeout(() => setCurrent((c) => (c + 1) % n), DELAY);
    return () => clearTimeout(t);
  }, [current, paused, tick, n]);

  if (n === 0) {
    return (
      <section className="relative -mt-[76px] flex min-h-[80svh] items-center bg-[#EAF2FB] px-5 pb-20 pt-40 sm:px-10" style={pegboard}>
        <div className="mx-auto w-full max-w-7xl">
          <p className="rise inline-block rounded-full border-2 border-[#031e41] bg-white px-4 py-2 text-sm font-semibold">{schoolName}</p>
          <h1 className={`rise mt-6 max-w-4xl text-balance text-[clamp(3rem,8vw,7rem)] font-extrabold leading-[0.92] tracking-[-0.04em] ${D}`} style={{ animationDelay: '.08s' }}>
            Formaciones que te llevan a hacer
          </h1>
          <Link href={catalogHref} className="rise mt-10 inline-flex items-center gap-2 rounded-full border-2 border-[#031e41] bg-[var(--accent)] px-7 py-4 font-bold text-[var(--accent-ink)] shadow-[4px_4px_0_#031e41]" style={{ animationDelay: '.16s' }}>
            Ver todas las formaciones <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    );
  }

  const slide = slides[current];
  const info = meta(slide);

  return (
    <section
      className="relative -mt-[76px] overflow-hidden bg-[#EAF2FB] px-5 pb-10 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:flex lg:min-h-[100svh] lg:items-center lg:pb-20 lg:pt-28"
      style={pegboard}
      aria-roledescription="carrusel"
      aria-label={`Formaciones de ${schoolName}`}
    >
      <MobileIntro schoolName={schoolName} catalogHref={catalogHref} courseCount={courseCount} />

      {/* Escritorio: texto a la izquierda y pila de polaroids a la derecha */}
      <div className="mx-auto hidden w-full max-w-7xl items-center gap-12 lg:grid lg:grid-cols-[1fr_1.05fr] lg:gap-10">
        {/* Texto del slide: se vuelve a montar al cambiar y repite la entrada */}
        <div key={slide.id} className="order-2 lg:order-1">
          <p className="rise inline-flex items-center gap-2.5 rounded-full border-2 border-[#031e41] bg-white px-4 py-2 text-sm font-semibold">
            <span className="relative flex size-2.5"><span className="absolute inset-0 animate-ping rounded-full bg-[#2FD3A0]" /><span className="relative size-2.5 rounded-full bg-[#2FD3A0]" /></span>
            Inscripciones abiertas
          </p>
          <h1 className={`rise mt-6 text-balance text-[clamp(2.7rem,6.4vw,6rem)] font-extrabold leading-[0.93] tracking-[-0.04em] ${D}`} style={{ animationDelay: '.06s' }}>
            {slide.title}
          </h1>
          {info.length > 0 && (
            <dl className="rise mt-7 flex flex-wrap gap-2.5" style={{ animationDelay: '.12s' }}>
              {info.map((m) => (
                <div key={m.k} className="rounded-2xl border-2 border-[#031e41] bg-white px-4 py-2">
                  <dt className="text-xs font-medium text-[#031e41]/55">{m.k}</dt>
                  <dd className="font-bold">{m.v}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: '.18s' }}>
            {slide.ctaLink && (
              <Link href={slide.ctaLink} className="inline-flex items-center gap-2 rounded-full border-2 border-[#031e41] bg-[var(--accent)] px-7 py-4 font-bold text-[var(--accent-ink)] shadow-[4px_4px_0_#031e41] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#031e41] active:translate-y-0 active:shadow-none">
                {slide.ctaText || 'Ver formación'} <ArrowRight size={18} />
              </Link>
            )}
            <Link href={catalogHref} className="inline-flex items-center rounded-full border-2 border-[#031e41] bg-white px-7 py-4 font-bold transition hover:bg-[#031e41] hover:text-white">
              Ver todas las formaciones
            </Link>
          </div>
        </div>

        {/* Pila de polaroids con las fotos del carrusel */}
        <div className="order-1 lg:order-2">
          <div
            className="relative mx-auto aspect-[5/4] w-[86%] max-w-[560px] touch-pan-y select-none"
            // Pausa solo con el mouse sobre las fotos: el inicio ocupa toda la pantalla y frenaba siempre.
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onPointerDown={(e) => { swipe.current = e.clientX; }}
            onPointerUp={(e) => {
              if (swipe.current === null) return;
              const dx = e.clientX - swipe.current;
              swipe.current = null;
              if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1));
            }}
          >
            {slides.map((s, i) => {
              const offset = (i - current + n) % n;
              return (
                <div
                  key={s.id}
                  aria-hidden={offset !== 0}
                  className="absolute inset-0 transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(.2,.9,.25,1.15)]"
                  style={place(offset)}
                >
                  <div className="relative h-full rounded-[26px] border-2 border-[#031e41] bg-white p-2.5 pb-12 shadow-[8px_8px_0_#031e41] sm:p-3 sm:pb-14">
                    <span aria-hidden className="absolute -top-3.5 left-1/2 z-10 h-7 w-24 -translate-x-1/2 -rotate-3 rounded-sm opacity-90" style={{ background: TAPE[i % TAPE.length] }} />
                    <div className="relative h-full overflow-hidden rounded-[18px] bg-[#EAF2FB]">
                      <Image src={s.image} alt="" fill sizes="(min-width:1024px) 560px, 86vw" priority={i === 0} className="object-cover" />
                    </div>
                    <p className={`absolute inset-x-4 bottom-3 truncate text-center text-base font-bold sm:bottom-4 sm:text-lg ${D}`}>{s.title}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Controles */}
          {n > 1 && (
            <div className="mx-auto mt-10 flex max-w-[560px] items-center gap-4">
              <button onClick={() => go(current - 1)} aria-label="Anterior" className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-[#031e41] bg-white transition hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] active:scale-95">
                <ChevronLeft size={22} />
              </button>
              <div className="flex flex-1 gap-1.5">
                {slides.map((s, i) => (
                  <button key={s.id} onClick={() => go(i)} aria-label={`Ir a: ${s.title}`} aria-current={i === current} className="group relative h-6 flex-1">
                    <span className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-[#031e41] bg-white">
                      {i === current && (
                        <span key={`${current}-${tick}`} className="block h-full origin-left bg-[var(--accent)]" style={{ animation: `fill-x ${DELAY}ms linear both`, animationPlayState: paused ? 'paused' : 'running' }} />
                      )}
                      {i < current && <span className="block h-full bg-[#031e41]" />}
                    </span>
                  </button>
                ))}
              </div>
              <button onClick={() => go(current + 1)} aria-label="Siguiente" className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-[#031e41] bg-white transition hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] active:scale-95">
                <ChevronRight size={22} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Celular y tablet: primero presenta la propuesta (quiénes somos y por qué cursar acá);
// los cursos se ven enseguida en "Próximas formaciones". En escritorio sigue la pila de fotos.
function MobileIntro({ schoolName, catalogHref, courseCount }: { schoolName: string; catalogHref: string; courseCount: number }) {
  const { settings } = useSiteSettings();
  const whatsapp = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappMessage)}`
    : null;
  const chips = [
    courseCount > 0 && `${courseCount} ${courseCount === 1 ? 'formación' : 'formaciones'}`,
    'Certificado oficial',
    'Plataforma incluida',
  ].filter(Boolean) as string[];

  return (
    <div className="lg:hidden">
      <p className="rise inline-flex max-w-full items-center gap-2 rounded-full border-2 border-[#031e41] bg-white px-3.5 py-1.5 text-[13px] font-semibold">
        <span className="size-2 shrink-0 rounded-full bg-[var(--accent)] ring-2 ring-[#031e41]" />
        <span className="truncate">{schoolName}</span>
      </p>
      <h1 className={`rise mt-5 text-balance text-[clamp(2.5rem,11vw,3.6rem)] font-extrabold leading-[0.95] tracking-[-0.04em] ${D}`} style={{ animationDelay: '.05s' }}>
        Formaciones para aprender haciendo
      </h1>
      <p className="rise mt-4 text-[17px] leading-relaxed text-[#031e41]/75" style={{ animationDelay: '.1s' }}>
        Cursos prácticos para estudiantes y la comunidad, con docentes de la industria, certificación oficial y nuestra plataforma de aprendizaje.
      </p>
      <ul className="rise mt-5 flex flex-wrap gap-2" style={{ animationDelay: '.15s' }}>
        {chips.map((c, i) => (
          <li key={c} className="rounded-full border-2 border-[#031e41] text-sm font-bold" style={{ background: i === 0 ? 'var(--accent)' : '#fff', color: i === 0 ? 'var(--accent-ink)' : undefined }}>
            {i === 0 && courseCount > 0 ? <Link href={catalogHref} className="flex items-center gap-1 px-3 py-1">{c} <ArrowRight size={14} /></Link> : <span className="block px-3 py-1">{c}</span>}
          </li>
        ))}
      </ul>
      <div className="rise mt-5 grid gap-2.5" style={{ animationDelay: '.2s' }}>
        <Link href={catalogHref} className="flex items-center justify-center gap-2 rounded-full border-2 border-[#031e41] bg-[#031e41] py-3.5 font-bold text-white shadow-[4px_4px_0_var(--accent)] active:translate-y-px active:shadow-none">
          Ver todas las formaciones <ArrowRight size={18} />
        </Link>
        {whatsapp && (
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full border-2 border-[#031e41] bg-white py-3.5 font-bold active:bg-[#EAF2FB]">
            <MessageCircle size={18} className="text-[#1da851]" /> Consultar por WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
