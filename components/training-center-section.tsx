'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function TrainingCenterSection() {
  return (
    <section className="w-full bg-white py-16 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Título principal */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance leading-tight" style={{ color: '#031e41' }}>
            Centro de Formación
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl leading-relaxed">
            Potenciá tu proyecto educativo y descubrí cómo adaptamos nuestros programas para convertirlos en la extensión académica que tu institución necesita
          </p>
        </div>

        {/* Grid de 3 columnas */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Card 1: Centro de Formación */}
          <div className="group bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#031e41' }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold" style={{ color: '#031e41' }}>
                Centro de Formación
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Potenciá tu proyecto educativo y descubrí cómo adaptamos nuestros programas para convertirlos en la extensión académica que tu institución necesita
              </p>
              <Link href="#" className="inline-flex items-center gap-2 text-sm font-semibold transition-all group-hover:translate-x-1" style={{ color: '#031e41' }}>
                Conocer más
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Trabajá con Nosotros */}
          <div className="group bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#031e41' }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20h12a6 6 0 00-6-6 6 6 0 00-6 6z" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold" style={{ color: '#031e41' }}>
                Trabajá con Nosotros
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Graduado/a y estudiante avanzado/a: Postulate para trabajar en nuestros proyectos o dictar cursos
              </p>
              <Link href="#" className="inline-flex items-center gap-2 text-sm font-semibold transition-all group-hover:translate-x-1" style={{ color: '#031e41' }}>
                Postulate ahora
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Nuestras Formaciones */}
          <div className="group bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#031e41' }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold" style={{ color: '#031e41' }}>
                Nuestras Formaciones
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Explora todo nuestro catálogo de formaciones disponibles y encuentra la que mejor se adapte a tus necesidades
              </p>
              <Link href="/formaciones" className="inline-flex items-center gap-2 text-sm font-semibold transition-all group-hover:translate-x-1" style={{ color: '#031e41' }}>
                Ver catálogo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
