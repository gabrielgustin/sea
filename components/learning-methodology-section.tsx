'use client';

import { useEffect, useState, useRef } from 'react';

export default function LearningMethodologySection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInSection, setIsInSection] = useState(false);
  const [isSectionActive, setIsSectionActive] = useState(false);
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);
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

  // Detectar cuando la sección entra en viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isSectionActive) {
          setIsInSection(true);
          setIsSectionActive(true);
          setSavedScrollPosition(window.scrollY);
          // Bloquear scroll
          document.documentElement.style.overflow = 'hidden';
          document.body.style.overflow = 'hidden';
        } else if (!entry.isIntersecting && isSectionActive) {
          setIsInSection(false);
        }
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
  }, [isSectionActive]);

  // Manejo del scroll hijack
  useEffect(() => {
    if (!isSectionActive) return;

    let wheelDelta = 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      wheelDelta += e.deltaY;
      const progressIncrement = wheelDelta / 1000; // Sensibilidad del scroll
      
      let newProgress = scrollProgress + progressIncrement;
      newProgress = Math.max(0, Math.min(1, newProgress));
      
      setScrollProgress(newProgress);

      // Si la animación está completa, desbloquear scroll y permitir continuar
      if (newProgress === 1 && scrollProgress < 1) {
        setTimeout(() => {
          document.documentElement.style.overflow = 'auto';
          document.body.style.overflow = 'auto';
          setIsSectionActive(false);
          // Hacer scroll hacia la siguiente sección
          const sectionEnd = sectionRef.current ? sectionRef.current.offsetTop + sectionRef.current.offsetHeight : 0;
          const main = document.querySelector('main');
          if (main) {
            main.scrollTop = sectionEnd;
          } else {
            window.scrollTo(0, sectionEnd);
          }
        }, 300);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    };
  }, [isSectionActive, scrollProgress]);

  // Limpiar overflow cuando el componente se desmonta
  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#031e41' }}>
            Nuestra ruta de aprendizaje
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Un camino probado diseñado para construir habilidades reales y confianza
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${scrollProgress * 100}%`,
              background: `linear-gradient(90deg, #031e41 0%, #9cbadb 100%)`,
              boxShadow: scrollProgress > 0 ? `0 0 20px rgba(3, 30, 65, 0.6)` : 'none',
            }}
          />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const stepProgress = scrollProgress * 4; // 4 pasos
            const stepStart = index;
            const stepEnd = index + 1;
            const isActive = stepProgress >= stepStart;
            const isCompleted = stepProgress > stepEnd;

            return (
              <div
                key={index}
                className={`p-6 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gray-100 shadow-md transform -translate-y-2'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {/* Número del paso */}
                <div
                  className="text-3xl font-bold mb-3 transition-colors duration-300"
                  style={{
                    color: isActive ? '#9cbadb' : '#031e41',
                  }}
                >
                  {step.number}
                </div>

                {/* Indicador de progreso del paso */}
                <div className="h-1 w-full bg-gray-200 rounded-full mb-4 overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${Math.max(0, Math.min(1, stepProgress - stepStart)) * 100}%`,
                      backgroundColor: '#031e41',
                    }}
                  />
                </div>

                {/* Título y descripción */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* Instrucción visual */}
        {isSectionActive && scrollProgress === 0 && (
          <div className="text-center mt-12 animate-bounce">
            <p className="text-gray-500 text-sm">
              Scrollea para activar la animación ↓
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
