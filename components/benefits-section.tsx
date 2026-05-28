'use client';

import { Award, Zap, Target, Users } from 'lucide-react';

export default function BenefitsSection() {
  const benefits = [
    {
      icon: Award,
      title: 'Certificación Oficial ITS Villada',
      description: 'Todos nuestros cursos cuentan con certificación oficial reconocida por ITS Villada',
    },
    {
      icon: Zap,
      title: 'Formación práctica desde el primer día',
      description: 'No solo teoría: desde la primera clase empezás a hacer proyectos reales',
    },
    {
      icon: Target,
      title: 'Proyectos reales',
      description: 'Trabajás en casos verdaderos que podés mostrar en tu portfolio profesional',
    },
    {
      icon: Users,
      title: 'Grupos reducidos',
      description: 'Clases con pocos estudiantes para que recibas atención personalizada',
    },
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 text-center mb-4">
          Ventajas de nuestros cursos
        </h2>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Más que educación, una transformación hacia tu futuro profesional
        </p>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="p-8 rounded-2xl bg-white transition-all hover:shadow-lg"
                style={{ border: '2px solid #08207f' }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: '#08207f', color: 'white' }}
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
