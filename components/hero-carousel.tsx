'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CarouselSlide {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
}

function parseSubtitle(subtitle?: string) {
  if (!subtitle) return { modality: '', startDate: '', duration: '' };
  const lines = subtitle.split('\n').map((l) => l.trim()).filter(Boolean);
  let modality = '';
  let startDate = '';
  let duration = '';
  for (const line of lines) {
    if (line.startsWith('Modalidad:')) modality = line.replace('Modalidad:', '').trim();
    else if (line.startsWith('Fecha de Inicio:')) startDate = line.replace('Fecha de Inicio:', '').trim();
    else if (line.startsWith('Duración:')) duration = line.replace('Duración:', '').trim();
  }
  if (!modality && !startDate && !duration && lines.length >= 3) {
    [startDate, duration, modality] = lines;
  }
  return { modality, startDate, duration };
}

export default function HeroCarousel() {
  const router = useRouter();

  // All state
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Stable refs to avoid stale closures
  const slidesRef = useRef<CarouselSlide[]>([]);
  const currentSlideRef = useRef(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  // Fetch slides on mount
  useEffect(() => {
    fetch('/api/carousel')
      .then((r) => r.json())
      .then((data) => {
        const loaded: CarouselSlide[] = data.slides || [];
        slidesRef.current = loaded;  // Update ref FIRST
        setSlides(loaded);           // Then trigger re-render
      })
      .catch((err) => console.error('[v0] carousel fetch:', err))
      .finally(() => setLoading(false));
  }, []);

  // Keep slidesRef in sync whenever slides state updates
  useEffect(() => {
    slidesRef.current = slides;
  }, [slides]);

  // Embla carousel events
  useEffect(() => {
    if (!emblaApi || slides.length === 0) return;

    const onSelect = () => {
      const idx = emblaApi.selectedIndex;
      setCurrentSlide(idx);
      currentSlideRef.current = idx;
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on('select', onSelect);
    onSelect(); // run once to init

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, slides]);

  const scroll = (dir: 'prev' | 'next') => {
    if (emblaApi) dir === 'prev' ? emblaApi.scrollPrev() : emblaApi.scrollNext();
  };

  // Navigate using the button's closest slide element
  const handleVerMas = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Find the closest slide container
    const slideEl = e.currentTarget.closest('[data-slide-index]');
    const idx = slideEl ? parseInt(slideEl.getAttribute('data-slide-index') || '0', 10) : 0;
    
    const allSlides = slidesRef.current;
    const slide = allSlides[idx];
    const target = slide?.ctaLink || '/formaciones';
    router.push(target);
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-900 flex items-center justify-center" style={{ height: '65vh' }}>
        <p className="text-white text-xl animate-pulse">Cargando formaciones...</p>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="w-full bg-gray-900 flex items-center justify-center" style={{ height: '65vh' }}>
        <p className="text-white text-xl">Sin slides disponibles</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '65vh' }}>
      {/* Embla viewport */}
      <div ref={emblaRef} className="h-full w-full overflow-hidden">
        <div className="flex h-full">
          {slides.map((slide, index) => {
            const { modality, startDate, duration } = parseSubtitle(slide.subtitle);
            return (
              <div key={slide.id} className="relative min-w-full h-full flex-shrink-0" data-slide-index={index}>
                {/* Background image */}
                <div className="absolute inset-0">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
                </div>

                {/* Slide content */}
                <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 w-full h-full flex flex-col justify-end pb-20">
                  <div className="flex flex-col gap-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl text-balance">
                      {slide.title}
                    </h1>
                    {(modality || startDate || duration) && (
                      <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-white text-sm md:text-base border-l-2 border-white pl-6 md:pl-8">
                        {modality && (
                          <div>
                            <p className="text-gray-300 text-xs uppercase tracking-widest mb-1">MODALIDAD</p>
                            <p className="font-semibold">{modality}</p>
                          </div>
                        )}
                        {startDate && (
                          <div>
                            <p className="text-gray-300 text-xs uppercase tracking-widest mb-1">INICIA</p>
                            <p className="font-semibold">{startDate}</p>
                          </div>
                        )}
                        {duration && (
                          <div>
                            <p className="text-gray-300 text-xs uppercase tracking-widest mb-1">DURACIÓN</p>
                            <p className="font-semibold">{duration}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom bar: Ver mas + arrows */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-4 md:px-8 py-4 bg-gradient-to-t from-black/60 to-transparent">
        <button
          onClick={handleVerMas}
          data-target={slides[currentSlide]?.ctaLink || '/formaciones'}
          className="text-white font-bold text-sm md:text-base hover:underline underline-offset-4 transition-all bg-transparent border-none cursor-pointer p-0"
        >
          {slides[currentSlide]?.ctaText || 'Ver mas'} →
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => scroll('prev')}
            disabled={!canScrollPrev}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/25 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-sm"
            aria-label="Slide anterior"
          >
            <ChevronLeft size={22} className="text-white" />
          </button>
          <button
            onClick={() => scroll('next')}
            disabled={!canScrollNext}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/25 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-sm"
            aria-label="Siguiente slide"
          >
            <ChevronRight size={22} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
