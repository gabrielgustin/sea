'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

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

export default function LearningMethodologySection() {
  const [progress, setProgress] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const touchStartY = useRef(0);

  // Detectar móvil
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const unlock = useCallback(() => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    setIsLocked(false);
  }, []);

  const lock = useCallback(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    setIsLocked(true);
  }, []);

  const handleDelta = useCallback((delta: number) => {
    if (!isLocked) return;
    progressRef.current += delta * 0.0015;

    if (progressRef.current <= 0 && delta < 0) {
      progressRef.current = 0;
      setProgress(0);
      unlock();
      return;
    }

    progressRef.current = Math.max(0, Math.min(1, progressRef.current));
    setProgress(progressRef.current);

    if (progressRef.current >= 1) {
      setHasCompleted(true);
      setTimeout(unlock, 150);
    }
  }, [isLocked, unlock]);

  // En móvil: progress basado en scroll natural sin lock
  useEffect(() => {
    if (!isMobile) return;
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      if (rect.top < 0 && rect.top > -rect.height) {
        setProgress(Math.min(Math.abs(rect.top) / (rect.height * 0.5), 1));
      } else if (rect.top >= 0) {
        setProgress(0);
      } else {
        setProgress(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // En desktop: detectar entrada a sección y bloquear scroll
  useEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      if (hasCompleted || isLocked) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh * 0.2 && rect.bottom > vh * 0.5) {
        lock();
        progressRef.current = progress;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasCompleted, isLocked, lock, progress, isMobile]);

  // Wheel handler (desktop)
  useEffect(() => {
    if (!isLocked || isMobile) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleDelta(e.deltaY);
    };

    const opts = { passive: false, capture: true } as AddEventListenerOptions;
    window.addEventListener('wheel', handleWheel, opts);
    return () => window.removeEventListener('wheel', handleWheel, opts);
  }, [isLocked, isMobile, handleDelta]);

  // Touch handler (desktop tablets)
  useEffect(() => {
    if (!isLocked || isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const delta = touchStartY.current - e.touches[0].clientY;
      touchStartY.current = e.touches[0].clientY;
      handleDelta(delta * 2);
    };

    const opts = { passive: false, capture: true } as AddEventListenerOptions;
    window.addEventListener('touchstart', handleTouchStart, opts);
    window.addEventListener('touchmove', handleTouchMove, opts);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart, opts);
      window.removeEventListener('touchmove', handleTouchMove, opts);
    };
  }, [isLocked, isMobile, handleDelta]);

  // Cleanup
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const activeStep = Math.floor(progress * 4);

  return (
    <section ref={sectionRef} className="w-full px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance" style={{ color: '#031e41' }}>
            Nuestra ruta de aprendizaje
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Un camino probado diseñado para construir habilidades reales y confianza
          </p>
        </div>

        {/* Progress bar */}
        <div className="hidden md:block mb-10">
          <div className="relative h-2 bg-gray-200 rounded-full overflow-visible">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{ width: `${progress * 100}%`, backgroundColor: '#031e41' }}
            />
            {/* Step dots */}
            {steps.map((_, i) => {
              const pos = (i / (steps.length - 1)) * 100;
              const reached = progress * 100 >= pos;
              return (
                <div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all duration-300"
                  style={{
                    left: `${pos}%`,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: reached ? '#031e41' : '#fff',
                    borderColor: reached ? '#031e41' : '#d1d5db',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const isActive = isMobile ? progress > index * 0.25 : activeStep >= index;
            const isCurrent = isMobile
              ? Math.floor(progress * 4) === index
              : activeStep === index;

            return (
              <div
                key={index}
                className="relative p-6 rounded-xl transition-all duration-500"
                style={{
                  backgroundColor: isActive ? '#f3f4f6' : '#ffffff',
                  border: isCurrent ? '2px solid #031e41' : '1px solid #e5e7eb',
                  transform: isCurrent ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: isCurrent ? '0 10px 25px rgba(3,30,65,0.15)' : 'none',
                }}
              >
                <div
                  className="text-4xl font-bold mb-3 transition-colors duration-500"
                  style={{ color: isActive ? '#9cbadb' : '#031e41' }}
                >
                  {step.number}
                </div>
                <div className="h-1 w-full bg-gray-200 rounded-full mb-4 overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: isActive ? '100%' : '0%', backgroundColor: '#031e41' }}
                  />
                </div>
                <h3
                  className="text-lg font-bold mb-2 transition-colors duration-500"
                  style={{ color: '#1f2937' }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>

                {isCurrent && (
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#031e41' }}
                  >
                    <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Scroll hint */}
        {isLocked && progress < 1 && (
          <div className="text-center mt-8 animate-bounce">
            <div className="inline-flex items-center gap-2 text-gray-500 text-sm bg-gray-100 px-4 py-2 rounded-full">
              <span>{progress === 0 ? 'Scrollea para comenzar' : 'Sigue scrolleando'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
