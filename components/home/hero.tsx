'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

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

export default function Hero({ slides, schoolName, catalogHref }: { slides: Slide[]; schoolName: string; catalogHref: string }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, duration: 32 }, [Autoplay({ delay: DELAY, stopOnInteraction: false })]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setCurrent(embla.selectedScrollSnap());
    embla.on('select', onSelect);
    return () => { embla.off('select', onSelect); };
  }, [embla]);

  const go = useCallback((i: number) => embla?.scrollTo(i), [embla]);

  if (slides.length === 0) {
    return (
      <section data-nav="dark" className="aurora relative -mt-[76px] flex min-h-[80svh] items-end bg-[#031e41] px-5 pb-20 pt-40 text-white sm:px-10">
        <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto w-full max-w-7xl">
          <p className="rise text-sm font-medium uppercase tracking-[0.2em] text-[#9cbadb]">{schoolName}</p>
          <h1 className="rise mt-4 max-w-4xl text-5xl font-semibold tracking-tight sm:text-7xl" style={{ animationDelay: '.1s' }}>
            Formaciones que te llevan a hacer.
          </h1>
          <Link href={catalogHref} className="rise mt-10 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#031e41]" style={{ animationDelay: '.2s' }}>
            Ver formaciones <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  const slide = slides[current];
  const info = meta(slide);

  return (
    <section data-nav="dark" className="relative -mt-[76px] h-[100svh] min-h-[620px] max-h-[980px] overflow-hidden bg-[#031e41] text-white" aria-roledescription="carrusel">
      <div ref={emblaRef} className="absolute inset-0 overflow-hidden">
        <div className="flex h-full">
          {slides.map((s, i) => (
            <div key={s.id} className="relative h-full min-w-full overflow-hidden" aria-hidden={i !== current}>
              <Image
                src={s.image}
                alt=""
                fill
                sizes="100vw"
                priority={i === 0}
                className={`object-cover ${i === current ? 'kenburns' : ''}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Velos para que el texto se lea sobre cualquier foto */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#031e41] via-[#031e41]/45 to-[#031e41]/10" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#031e41]/80 via-[#031e41]/20 to-transparent" />

      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-28 sm:px-8 sm:pb-32">
        {/* key: al cambiar de slide el bloque se vuelve a montar y repite la animación de entrada */}
        <div key={slide.id} className="max-w-3xl">
          <p className="rise inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-white/90 backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px] shadow-emerald-400" />
            Inscripciones abiertas
          </p>
          <h1 className="rise mt-5 text-balance text-[2.6rem] font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl" style={{ animationDelay: '.08s' }}>
            {slide.title}
          </h1>
          {info.length > 0 && (
            <dl className="rise mt-7 flex flex-wrap gap-2" style={{ animationDelay: '.16s' }}>
              {info.map((m) => (
                <div key={m.k} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-md">
                  <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/55">{m.k}</dt>
                  <dd className="text-sm font-semibold">{m.v}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: '.24s' }}>
            {slide.ctaLink && (
              <Link href={slide.ctaLink} className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#031e41] transition hover:bg-[#9cbadb]">
                {slide.ctaText || 'Ver formación'}
                <ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            )}
            <Link href={catalogHref} className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold backdrop-blur-md transition hover:bg-white/15">
              Todas las formaciones
            </Link>
          </div>
        </div>
      </div>

      {/* Controles: barras de progreso, contador y flechas */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto flex max-w-7xl items-center gap-5 px-5 pb-8 sm:px-8">
          <span className="font-mono text-xs tabular-nums text-white/70">
            {String(current + 1).padStart(2, '0')} <span className="text-white/35">/ {String(slides.length).padStart(2, '0')}</span>
          </span>
          <div className="hidden flex-1 gap-1.5 sm:flex">
            {slides.map((s, i) => (
              <button key={s.id} onClick={() => go(i)} aria-label={`Ir a: ${s.title}`} className="group relative h-6 flex-1">
                <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/20 transition group-hover:bg-white/40">
                  {i === current && <span key={current} className="block h-full origin-left rounded-full bg-white" style={{ animation: `fill-x ${DELAY}ms linear both` }} />}
                  {i < current && <span className="block h-full rounded-full bg-white/60" />}
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-2 sm:ml-auto">
            <button onClick={() => embla?.scrollPrev()} aria-label="Anterior" className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md transition hover:bg-white hover:text-[#031e41]">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => embla?.scrollNext()} aria-label="Siguiente" className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md transition hover:bg-white hover:text-[#031e41]">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
