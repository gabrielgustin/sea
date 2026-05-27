'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    id: 1,
    title: 'Programas de Extensión Académica',
    description: 'Amplía tus conocimientos con nuestros programas innovadores',
    image: 'linear-gradient(135deg, rgb(69, 120, 197) 0%, rgb(41, 98, 255) 100%)',
  },
  {
    id: 2,
    title: 'Formaciones Especializadas',
    description: 'Obtén certificaciones profesionales reconocidas',
    image: 'linear-gradient(135deg, rgb(41, 98, 255) 0%, rgb(69, 120, 197) 100%)',
  },
  {
    id: 3,
    title: 'Conecta con Profesionales',
    description: 'Construye tu red académica y profesional',
    image: 'linear-gradient(135deg, rgb(69, 120, 197) 0%, rgb(41, 98, 255) 100%)',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const next = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg shadow-lg">
      {/* Slides */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            idx === current ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ background: slide.image }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-pretty">{slide.title}</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl">{slide.description}</p>
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Explorar Ahora
            </Button>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-primary" />
      </button>

      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-primary" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === current ? 'bg-white w-8' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
