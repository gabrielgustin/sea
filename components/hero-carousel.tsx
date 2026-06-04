'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface CarouselSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  startDate: string;
  duration: string;
  modality: string;
  redirectSlug: string;
}

export default function HeroCarousel() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );
  
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Cargar slides desde API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/carousel');
        const data = await response.json();
        setSlides(data.slides || []);
      } catch (error) {
        console.error('Error fetching carousel slides:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (!emblaApi || slides.length === 0) return;

    const onSelect = () => {
      setCurrentSlide(emblaApi.selectedIndex);
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, slides]);

  const scroll = (direction: 'prev' | 'next') => {
    if (emblaApi) {
      direction === 'prev' ? emblaApi.scrollPrev() : emblaApi.scrollNext();
    }
  };

  if (loading) {
    return (
      <div className="relative w-full h-screen bg-gradient-to-b from-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Cargando formaciones...</div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-screen bg-gradient-to-b from-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Sin slides disponibles</div>
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height: '65vh' }}>
      {/* Carrusel Container */}
      <div ref={emblaRef} className="h-full w-full">
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="relative min-w-full h-full flex items-center justify-center overflow-hidden"
            >
              {/* Imagen de fondo con overlay */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Overlay oscuro con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"></div>
              </div>

              {/* Contenido */}
              <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 w-full h-full flex flex-col justify-end pb-20">
                {/* Título y información del curso */}
                <div className="flex flex-col gap-4">
                  {/* Título */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl text-balance animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {slide.title}
                  </h1>

                  {/* Información del curso */}
                  <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-white text-sm md:text-base border-l-2 border-l-white pl-6 md:pl-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div>
                      <p className="text-gray-300 text-xs md:text-sm uppercase tracking-wide mb-1">Modalidad</p>
                      <p className="font-semibold">{slide.modality}</p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-xs md:text-sm uppercase tracking-wide mb-1">Inicia</p>
                      <p className="font-semibold">{slide.startDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-xs md:text-sm uppercase tracking-wide mb-1">Duración</p>
                      <p className="font-semibold">{slide.duration}</p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="flex justify-start animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <Link
                      href={`/cursos/${slide.redirectSlug}`}
                      className="px-8 py-3 rounded-lg font-bold text-white transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 active:scale-95 bg-transparent border-none"
                    >
                      Ver más →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controles de navegación */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center justify-end">
        {/* Botones de navegación */}
        <div className="flex gap-4">
          <button
            onClick={() => scroll('prev')}
            disabled={!canScrollPrev}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm hover:scale-110 active:scale-95"
            title="Slide anterior"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <button
            onClick={() => scroll('next')}
            disabled={!canScrollNext}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm hover:scale-110 active:scale-95"
            title="Siguiente slide"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
