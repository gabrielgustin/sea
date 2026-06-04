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
  badge: string;
  image: string;
  startDate: string;
  duration: string;
  modality: string;
  slug: string;
}

const slides: CarouselSlide[] = [
  {
    id: '1',
    title: 'PLC Controladores lógicos programables – Nivel Avanzado',
    badge: 'FORMACIÓN',
    image: '/carousel/plc-advanced.png',
    startDate: '27 de junio, 2026',
    duration: '40 horas (10 encuentros)',
    modality: 'Modalidad Presencial',
    slug: 'plc-avanzado'
  },
  {
    id: '2',
    title: 'Desarrollo de Aplicaciones Web Modernas',
    badge: 'FORMACIÓN',
    image: '/carousel/web-development.png',
    startDate: '4 de junio, 2026',
    duration: '6 meses',
    modality: 'Educación Presencial',
    slug: 'desarrollo-de-aplicaciones'
  },
  {
    id: '3',
    title: 'Diseño e Impresión 3D',
    badge: 'FORMACIÓN',
    image: '/carousel/3d-design.png',
    startDate: '4 de junio, 2026',
    duration: '6 meses',
    modality: 'Educación Presencial',
    slug: 'diseno-impresion-3d'
  },
  {
    id: '4',
    title: 'Desarrollo de Videojuegos',
    badge: 'FORMACIÓN',
    image: '/carousel/game-development.png',
    startDate: '4 de junio, 2026',
    duration: '6 meses',
    modality: 'Educación Presencial',
    slug: 'desarrollo-de-videojuegos'
  }
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );
  
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

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
  }, [emblaApi]);

  const scroll = (direction: 'prev' | 'next') => {
    if (emblaApi) {
      direction === 'prev' ? emblaApi.scrollPrev() : emblaApi.scrollNext();
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
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
              <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 w-full h-full flex flex-col justify-between py-20">
                {/* Badge */}
                <div className="flex justify-start">
                  <div
                    className="px-6 py-2 rounded-sm text-white font-bold text-sm md:text-base animate-fade-in"
                    style={{ backgroundColor: '#031e41' }}
                  >
                    {slide.badge}
                  </div>
                </div>

                {/* Título y descripción - Centrado */}
                <div className="flex flex-col items-start justify-center">
                  <div className="mb-4 text-sm md:text-base font-semibold text-gray-300 opacity-90 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    CURSO
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl mb-6 text-balance animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    {slide.title}
                  </h1>

                  {/* Información del curso */}
                  <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-white text-sm md:text-base border-l-2 border-l-white pl-6 md:pl-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
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
                </div>

                {/* CTA Button */}
                <div className="flex justify-start animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <Link
                    href={`/cursos/${slide.slug}`}
                    className="px-8 py-3 rounded-lg font-bold text-white transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 backdrop-blur-sm hover:scale-105 active:scale-95"
                    style={{ backgroundColor: '#031e41' }}
                  >
                    Ver más →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controles de navegación */}
      <div className="absolute bottom-8 left-8 right-8 z-20 flex items-center justify-between">
        {/* Indicadores de slides */}
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              title={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>

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

      {/* Número de slide actual */}
      <div className="absolute top-8 right-8 z-20 text-white/80 text-sm font-medium backdrop-blur-sm px-4 py-2 rounded-full bg-white/5">
        {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </div>
  );
}
