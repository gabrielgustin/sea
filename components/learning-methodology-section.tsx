'use client';

import { useEffect, useState, useRef } from 'react';

export default function LearningMethodologySection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      number: '01',
      title: 'Aprende',
      description: 'Participa en lecciones en video completas y materiales de curso detallados creados por expertos de la industria.',
    },
    {
      number: '02',
      title: 'Practica',
      description: 'Aplica tu conocimiento a través de ejercicios de codificación interactivos y proyectos del mundo real.',
    },
    {
      number: '03',
      title: 'Construye',
      description: 'Crea proyectos de portfolio que demuestren tus habilidades a posibles empleadores.',
    },
    {
      number: '04',
      title: 'Triunfa',
      description: 'Obtén certificación y accede a oportunidades de colocación laboral con empresas tecnológicas líderes.',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;

      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      // Calcular el progreso desde que se ve la sección hasta que se pasa completamente
      const sectionStart = sectionTop - windowHeight;
      const sectionEnd = sectionTop + sectionHeight;
      const currentPosition = scrollTop + windowHeight;

      let progress = (currentPosition - sectionStart) / (sectionEnd - sectionStart);
      progress = Math.max(0, Math.min(1, progress));

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#031e41' }}>
            Nuestra ruta de aprendizaje
          </h2>
          <p className="text-lg text-gray-600">
            Un camino probado diseñado para construir habilidades reales y confianza
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="mb-12 px-4">
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${scrollProgress * 100}%`,
                background: 'linear-gradient(90deg, #031e41, #9cbadb)',
                boxShadow: scrollProgress > 0 ? '0 0 20px rgba(3, 30, 65, 0.5)' : 'none',
              }}
            />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-4 relative">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Dot */}
                <div
                  className="w-4 h-4 rounded-full transition-all duration-300 transform"
                  style={{
                    backgroundColor: scrollProgress >= (index / (steps.length - 1)) ? '#031e41' : '#d1d5db',
                    scale: scrollProgress >= (index / (steps.length - 1)) ? 1.3 : 1,
                  }}
                />
                {/* Label */}
                <span
                  className="text-xs font-semibold mt-2 text-center transition-all duration-300"
                  style={{
                    color: scrollProgress >= (index / (steps.length - 1)) ? '#031e41' : '#9ca3af',
                  }}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="rounded-2xl p-6 border transition-all duration-500 transform"
              style={{
                borderColor: scrollProgress >= (index / (steps.length - 1)) ? '#031e41' : '#e5e7eb',
                backgroundColor: scrollProgress >= (index / (steps.length - 1)) ? '#f0f4f9' : '#ffffff',
                transform: scrollProgress >= (index / (steps.length - 1)) ? 'translateY(-8px)' : 'translateY(0)',
              }}
            >
              {/* Number */}
              <div className="mb-4">
                <span
                  className="text-4xl font-bold transition-all duration-500"
                  style={{
                    color: scrollProgress >= (index / (steps.length - 1)) ? '#9cbadb' : '#031e41',
                  }}
                >
                  {step.number}
                </span>
              </div>

              {/* Divider */}
              <div
                className="w-12 h-1 mb-4 rounded-full transition-all duration-500"
                style={{
                  backgroundColor: scrollProgress >= (index / (steps.length - 1)) ? '#031e41' : '#031e41',
                  width: scrollProgress >= (index / (steps.length - 1)) ? '48px' : '24px',
                }}
              />

              {/* Title */}
              <h3
                className="text-xl font-bold text-gray-900 mb-3 transition-all duration-500"
                style={{
                  color: scrollProgress >= (index / (steps.length - 1)) ? '#031e41' : '#6b7280',
                }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p
                className="text-gray-600 text-sm leading-relaxed transition-all duration-500"
                style={{
                  color: scrollProgress >= (index / (steps.length - 1)) ? '#374151' : '#9ca3af',
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
