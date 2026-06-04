'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

export default function LearningMethodologySection() {
  const [progress, setProgress] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const touchStartY = useRef(0);

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

  const getScrollContainer = useCallback(() => {
    return document.querySelector('main') as HTMLElement | null;
  }, []);

  const unlock = useCallback(() => {
    const container = getScrollContainer();
    if (container) {
      container.style.overflow = '';
      container.style.touchAction = '';
    }
    setIsLocked(false);
  }, [getScrollContainer]);

  const lock = useCallback(() => {
    const container = getScrollContainer();
    if (container) {
      container.style.overflow = 'hidden';
      container.style.touchAction = 'none';
    }
    setIsLocked(true);
  }, [getScrollContainer]);

  const handleDelta = useCallback((delta: number) => {
    if (!isLocked) return;

    const sensitivity = 0.003;
    progressRef.current += delta * sensitivity;

    // Scroll hacia arriba y progreso <= 0: desbloquear
    if (progressRef.current <= 0 && delta < 0) {
      progressRef.current = 0;
      setProgress(0);
      unlock();
      return;
    }

    // Limitar entre 0 y 1
    progressRef.current = Math.max(0, Math.min(1, progressRef.current));
    setProgress(progressRef.current);

    // Si llega al 100%: completar y desbloquear
    if (progressRef.current >= 1) {
      setHasCompleted(true);
      setTimeout(unlock, 150);
    }
  }, [isLocked, unlock]);

  // Detectar entrada a la sección
  useEffect(() => {
    const section = sectionRef.current;
    const container = getScrollContainer();
    if (!section || !container) return;

    const checkPosition = () => {
      if (hasCompleted || isLocked) return;

      const sectionRect = section.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const viewportHeight = containerRect.height;

      // Activar cuando la sección esté centrada en el viewport
      const sectionCenterY = sectionRect.top + sectionRect.height / 2 - containerRect.top;
      const viewportCenter = viewportHeight / 2;
      const distanceFromCenter = Math.abs(sectionCenterY - viewportCenter);

      if (distanceFromCenter < viewportHeight * 0.3 && sectionRect.top < viewportHeight * 0.4) {
        lock();
        progressRef.current = progress;
      }
    };

    container.addEventListener('scroll', checkPosition, { passive: true });
    return () => container.removeEventListener('scroll', checkPosition);
  }, [hasCompleted, isLocked, lock, progress, getScrollContainer]);

  // Wheel handler
  useEffect(() => {
    if (!isLocked) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleDelta(e.deltaY);
    };

    const options = { passive: false, capture: true };
    window.addEventListener('wheel', handleWheel, options);
    document.addEventListener('wheel', handleWheel, options);

    return () => {
      window.removeEventListener('wheel', handleWheel, options as EventListenerOptions);
      document.removeEventListener('wheel', handleWheel, options as EventListenerOptions);
    };
  }, [isLocked, handleDelta]);

  // Touch handlers
  useEffect(() => {
    if (!isLocked) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const deltaY = touchStartY.current - e.touches[0].clientY;
      touchStartY.current = e.touches[0].clientY;
      handleDelta(deltaY * 2);
    };

    const options = { passive: false, capture: true };
    window.addEventListener('touchstart', handleTouchStart, options);
    window.addEventListener('touchmove', handleTouchMove, options);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart, options as EventListenerOptions);
      window.removeEventListener('touchmove', handleTouchMove, options as EventListenerOptions);
    };
  }, [isLocked, handleDelta]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const container = getScrollContainer();
      if (container) {
        container.style.overflow = '';
        container.style.touchAction = '';
      }
    };
  }, [getScrollContainer]);

  const activeStep = Math.floor(progress * 4);

  return (
    <section ref={sectionRef} className="w-full px-4 sm:px-6 lg:px-8 py-16 relative min-h-[650px]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#031e41' }}>
            Nuestra ruta de aprendizaje
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Un camino probado diseñado para construir habilidades reales y confianza
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="relative mb-8">
          {/* Step Labels */}
          <div className="flex justify-between mb-3">
            {steps.map((step, index) => (
              <span
                key={index}
                className="text-sm font-semibold transition-all duration-300"
                style={{
                  color: progress * 4 > index ? '#031e41' : '#9ca3af',
                  transform: progress * 4 > index ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {step.title}
              </span>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all duration-100 ease-out relative"
              style={{
                width: `${progress * 100}%`,
                background: 'linear-gradient(90deg, #031e41 0%, #1a4d7a 50%, #9cbadb 100%)',
              }}
            >
              {progress > 0 && progress < 1 && (
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full animate-pulse"
                  style={{
                    background: '#9cbadb',
                    boxShadow: '0 0 15px 5px rgba(156, 186, 219, 0.8)',
                  }}
                />
              )}
            </div>

            {/* Step Markers */}
            <div className="absolute inset-0 flex justify-between items-center">
              {steps.map((_, index) => {
                const markerPosition = (index / (steps.length - 1)) * 100;
                const isReached = progress * 100 >= markerPosition;
                return (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border-2 transition-all duration-300"
                    style={{
                      backgroundColor: isReached ? '#031e41' : '#fff',
                      borderColor: isReached ? '#031e41' : '#d1d5db',
                      transform: isReached ? 'scale(1.2)' : 'scale(1)',
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {steps.map((step, index) => {
            const isActive = activeStep >= index;
            const isCurrent = activeStep === index;

            return (
              <div
                key={index}
                className="relative p-6 rounded-xl transition-all duration-300"
                style={{
                  backgroundColor: isActive ? '#f3f4f6' : '#ffffff',
                  border: isCurrent ? '2px solid #031e41' : '1px solid #e5e7eb',
                  transform: isCurrent ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: isCurrent ? '0 10px 25px rgba(3, 30, 65, 0.15)' : 'none',
                }}
              >
                <div
                  className="text-4xl font-bold mb-3 transition-colors duration-300"
                  style={{ color: isActive ? '#9cbadb' : '#031e41' }}
                >
                  {step.number}
                </div>

                <div className="h-1 w-full bg-gray-200 rounded-full mb-4 overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: isActive ? '100%' : '0%',
                      backgroundColor: '#031e41',
                    }}
                  />
                </div>

                <h3
                  className="text-lg font-bold mb-2 transition-colors duration-300"
                  style={{ color: isCurrent ? '#031e41' : '#1f2937' }}
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

        {/* Scroll Hint */}
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
