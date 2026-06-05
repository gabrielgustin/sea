import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function SpecialOfferSection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto rounded-3xl bg-white p-8 md:p-12" style={{ border: '2px solid #031e41' }}>
        {/* Badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles size={20} style={{ color: '#031e41' }} />
          <span className="font-semibold text-sm md:text-base tracking-wider" style={{ color: '#031e41' }}>
            OFERTA ESPECIAL
          </span>
          <Sparkles size={20} style={{ color: '#031e41' }} />
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 text-center mb-4">
          Inscripciones Abiertas
        </h2>

        {/* Description */}
        <p className="text-gray-700 text-center mb-10 max-w-2xl mx-auto leading-relaxed">
          No esperes más para transformar tu futuro. Los lugares se asignan por orden de
          inscripción. Todos nuestros cursos incluyen certificación oficial de ITS Villada.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button className="px-8 py-3 md:px-10 md:py-4 text-white font-semibold rounded-full transition-opacity hover:opacity-90" style={{ backgroundColor: '#031e41' }}>
            Reservar mi lugar
          </button>
          <button className="px-8 py-3 md:px-10 md:py-4 font-semibold rounded-full transition-colors hover:bg-opacity-5" style={{ border: '2px solid #031e41', color: '#031e41' }}>
            Consultar por WhatsApp
          </button>
        </div>
      </div>

      {/* Info Cards Section */}
      <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <Link href="/formaciones">
          <div className="p-8 rounded-2xl text-white text-center transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer flex flex-col justify-center min-h-80" style={{ backgroundColor: '#031e41' }}>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Centro de Formacion</h3>
            <p className="text-base md:text-lg leading-relaxed">
              Conocé las propuestas de formaciones que tiene la SEU para vos
            </p>
          </div>
        </Link>

        {/* Card 2 */}
        <Link href="/trabaja-con-nosotros">
          <div className="p-8 rounded-2xl text-white text-center transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer flex flex-col justify-center min-h-80" style={{ backgroundColor: '#031e41' }}>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Trabajá con Nosotros</h3>
            <p className="text-base md:text-lg leading-relaxed">
              Graduado/a y estudiante avanzado/a: Postulate para trabajar en nuestros proyectos o dictar cursos
            </p>
          </div>
        </Link>

        {/* Card 3 */}
        <Link href="/catalogo-formaciones">
          <div className="p-8 rounded-2xl text-white text-center transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer flex flex-col justify-center min-h-80" style={{ backgroundColor: '#031e41' }}>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Nuestras Formaciones</h3>
            <p className="text-base md:text-lg leading-relaxed">
              Explora todo nuestro catálogo de formaciones disponibles y encuentra la que mejor se adapte a tus necesidades
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
