'use client';

import { Award, Zap, Target, Users } from 'lucide-react';

export default function BenefitsSection() {
  const benefits = [
    {
      icon: Award,
      title: 'Certificación Oficial',
      description: 'Todos nuestros cursos cuentan con certificación oficial de ITS Villada',
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
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4" style={{ color: '#031e41' }}>
          Ventajas de nuestros cursos
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Más que educación, una transformación hacia tu futuro profesional
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="p-8 rounded-2xl bg-white hover:shadow-md transition-shadow duration-300"
                style={{ border: '2px solid #031e41' }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: '#031e41', color: 'white' }}
                  >
                    <Icon size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
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
