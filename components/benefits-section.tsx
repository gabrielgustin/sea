'use client';

import { Award, Zap, Target, Users } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

export default function BenefitsSection() {
  const { ref, isInView } = useInView({ once: true, threshold: 0.1 });

  const benefits = [
    {
      icon: Award,
      title: 'Certificación Oficial',
      description: 'Todos nuestros cursos cuentan con certificación oficial del Instituto Domingo Savio',
    },
    {
      icon: Zap,
      title: 'Formación práctica',
      description: 'Desde la primera clase empezás a hacer proyectos reales',
    },
    {
      icon: Target,
      title: 'Proyectos reales',
      description: 'Trabajaremos en casos reales que luego podras sumar a tu portfolio profesional',
    },
    {
      icon: Users,
      title: 'Grupos reducidos',
      description: 'Clases con pocos estudiantes para que recibas atención personalizada',
    },
  ];

  return (
    <section ref={ref} className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className={`text-3xl md:text-5xl font-bold text-gray-900 text-center mb-4 transition-all duration-700 ${isInView ? 'animate-fade-in' : 'opacity-0'}`} style={{ color: '#031e41' }}>
          Ventajas de nuestros cursos
        </h2>

        {/* Subtitle */}
        <p className={`text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto transition-all duration-700 ${isInView ? 'animate-fade-in stagger-1' : 'opacity-0'}`}>
          Más que educación, una transformación hacia tu futuro profesional
        </p>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className={`p-8 rounded-2xl bg-white transition-all duration-700 hover-lift ${
                  isInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  border: '2px solid #031e41',
                  animationDelay: isInView ? `${index * 0.1}s` : '0s'
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg flex-shrink-0 transition-smooth hover-scale"
                    style={{ backgroundColor: '#031e41', color: 'white' }}
                  >
                    <Icon size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
