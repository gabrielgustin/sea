'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
}

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { ref, isInView } = useInView({ once: true, threshold: 0.1 });

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Juan Pérez',
      text: '"Superé mis expectativas. No esperaba aprender tanto en tan poco tiempo. El ambiente de la Academia es muy motivador."',
      rating: 5,
    },
    {
      id: 2,
      name: 'Ana Fernández',
      text: '"Clases prácticas en motores reales, componentes originales y profesores con experiencia en la industria. Muy satisfecha con mi experiencia."',
      rating: 5,
    },
    {
      id: 3,
      name: 'Carlos López',
      text: '"Excelente programa con instructores profesionales. Los cursos están diseñados para la práctica real. Recomendado al 100%."',
      rating: 5,
    },
    {
      id: 4,
      name: 'María González',
      text: '"La certificación de ITS Villada me abrió muchas puertas laborales. Inversión que valió totalmente la pena."',
      rating: 5,
    },
  ];

  const itemsPerPage = 2;
  const maxIndex = Math.ceil(testimonials.length / itemsPerPage) - 1;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  const currentTestimonials = testimonials.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  return (
    <section ref={ref} className="w-full px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-4 transition-all duration-700 ${isInView ? 'animate-fade-in' : 'opacity-0'}`} style={{ color: '#08207f' }}>
            Lo que dicen nuestros estudiantes
          </h2>
          <p className={`text-lg text-gray-600 transition-all duration-700 ${isInView ? 'animate-fade-in stagger-1' : 'opacity-0'}`}>
            Transformando vidas a través de educación de calidad
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {currentTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`rounded-2xl p-8 bg-white transition-all duration-700 hover-lift ${
                  isInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  border: '2px solid #08207f',
                  animationDelay: isInView ? `${index * 0.1}s` : '0s'
                }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      fill="#08207f"
                      style={{ color: '#08207f' }}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 italic mb-6 leading-relaxed">
                  {testimonial.text}
                </p>

                {/* Name */}
                <p className="font-semibold text-gray-900" style={{ color: '#08207f' }}>
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {/* Left Arrow */}
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-smooth hover:scale-110 hover:shadow-blue-md"
              style={{ borderColor: '#08207f', color: '#08207f' }}
              aria-label="Previous testimonials"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Pagination Dots */}
            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(testimonials.length / itemsPerPage) }).map(
                (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className="transition-all rounded-full"
                    style={{
                      width: currentIndex === i ? '32px' : '8px',
                      height: '8px',
                      backgroundColor: currentIndex === i ? '#08207f' : '#d1d5db',
                    }}
                    aria-label={`Go to page ${i + 1}`}
                  />
                )
              )}
            </div>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-smooth hover:scale-110 hover:shadow-blue-md"
              style={{ borderColor: '#08207f', color: '#08207f' }}
              aria-label="Next testimonials"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
