import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function SpecialOfferSection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Info Cards Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
        {/* Card 1 */}
        <Link href="/formaciones">
          <div className="p-4 md:p-8 rounded-2xl text-white text-center transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer flex flex-col justify-center min-h-64 md:min-h-80" style={{ backgroundColor: '#031e41' }}>
            <h3 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">Centro de Formación</h3>
            <p className="text-sm md:text-lg leading-relaxed">
              Potenciá tu proyecto educativo y descubrí cómo adaptamos nuestros programas para convertirlos en la extensión académica que tu institución necesita
            </p>
          </div>
        </Link>

        {/* Card 2 */}
        <Link href="/trabaja-con-nosotros">
          <div className="p-4 md:p-8 rounded-2xl text-white text-center transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer flex flex-col justify-center min-h-64 md:min-h-80" style={{ backgroundColor: '#031e41' }}>
            <h3 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">Trabajá con Nosotros</h3>
            <p className="text-sm md:text-lg leading-relaxed">
              Graduado/a y estudiante avanzado/a: Postulate para trabajar en nuestros proyectos o dictar cursos
            </p>
          </div>
        </Link>

        {/* Card 3 */}
        <Link href="/catalogo-formaciones">
          <div className="p-4 md:p-8 rounded-2xl text-white text-center transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer flex flex-col justify-center min-h-64 md:min-h-80" style={{ backgroundColor: '#031e41' }}>
            <h3 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">Nuestras Formaciones</h3>
            <p className="text-sm md:text-lg leading-relaxed">
              Explora todo nuestro catálogo de formaciones disponibles y encuentra la que mejor se adapte a tus necesidades
            </p>
          </div>
        </Link>
      </div>

      {/* Special Offer Section */}
      <div className="max-w-4xl mx-auto rounded-3xl bg-white p-6 md:p-12" style={{ border: '2px solid #031e41' }}>
        {/* Badge */}
        <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
          <Sparkles size={16} className="md:w-5 md:h-5" style={{ color: '#031e41' }} />
          <span className="font-semibold text-xs md:text-base tracking-wider" style={{ color: '#031e41' }}>
            OFERTA ESPECIAL
          </span>
          <Sparkles size={16} className="md:w-5 md:h-5" style={{ color: '#031e41' }} />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-5xl font-bold text-gray-900 text-center mb-3 md:mb-4">
          Inscripciones Abiertas
        </h2>

        {/* Description */}
        <p className="text-gray-700 text-center mb-6 md:mb-10 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          No esperes más para transformar tu futuro. Los lugares se asignan por orden de
          inscripción. Todos nuestros cursos incluyen certificación oficial de ITS Villada.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
          <button className="px-6 md:px-10 py-2.5 md:py-4 text-white font-semibold rounded-full transition-opacity hover:opacity-90 text-sm md:text-base" style={{ backgroundColor: '#031e41' }}>
            Reservar mi lugar
          </button>
          <button className="px-6 md:px-10 py-2.5 md:py-4 font-semibold rounded-full transition-colors hover:bg-opacity-5 text-sm md:text-base" style={{ border: '2px solid #031e41', color: '#031e41' }}>
            Consultar por WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
}
