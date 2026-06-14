'use client';

import Link from 'next/link';
import { useInView } from '@/hooks/useInView';

export default function TrainingCenterCards() {
  const { ref, isInView } = useInView({ once: true, threshold: 0.1 });

  const cards = [
    {
      href: '/savio/formaciones',
      title: 'Lleva SEA a tu Institución',
      description: 'Creamos tu Centro de Formación junto a la Secretaría de Extensión Académica.',
    },
    {
      href: '/savio/trabaja-con-nosotros',
      title: 'Trabajá con Nosotros',
      description: 'Graduado/a y estudiante avanzado/a: Postulate para trabajar en nuestros proyectos o dictar cursos',
    },
    {
      href: '/savio/catalogo-formaciones',
      title: 'Nuestras Formaciones',
      description: 'Explora todo nuestro catálogo de formaciones disponibles y encuentra la que mejor se adapte a tus necesidades',
    },
  ];

  return (
    <section ref={ref} className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {cards.map((card, index) => (
          <Link key={card.href} href={card.href}>
            <div
              className={`p-4 md:p-8 rounded-2xl text-white text-center transition-all duration-700 hover:shadow-xl hover:scale-105 cursor-pointer flex flex-col justify-center min-h-64 md:min-h-80 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                backgroundColor: '#031e41',
                transitionDelay: isInView ? `${index * 0.15}s` : '0s',
              }}
            >
              <h3 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">{card.title}</h3>
              <p className="text-sm md:text-lg leading-relaxed">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
