import { Sparkles } from 'lucide-react';

export default function SpecialOfferSection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto rounded-3xl bg-white p-8 md:p-12" style={{ border: '2px solid #08207f' }}>
        {/* Badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles size={20} style={{ color: '#08207f' }} />
          <span className="font-semibold text-sm md:text-base tracking-wider" style={{ color: '#08207f' }}>
            OFERTA ESPECIAL
          </span>
          <Sparkles size={20} style={{ color: '#08207f' }} />
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 text-center mb-4">
          Inscripciones Abiertas
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-center mb-6 font-semibold" style={{ color: '#08207f' }}>
          Inicio en junio 2026 - Cupos limitados
        </p>

        {/* Description */}
        <p className="text-gray-700 text-center mb-10 max-w-2xl mx-auto leading-relaxed">
          No esperes más para transformar tu futuro. Los lugares se asignan por orden de
          inscripción. Todos nuestros cursos incluyen certificación oficial de ITS Villada.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button className="px-8 py-3 md:px-10 md:py-4 text-white font-semibold rounded-full transition-opacity hover:opacity-90" style={{ backgroundColor: '#08207f' }}>
            Reservar mi lugar
          </button>
          <button className="px-8 py-3 md:px-10 md:py-4 font-semibold rounded-full transition-colors hover:bg-opacity-5" style={{ border: '2px solid #08207f', color: '#08207f' }}>
            Consultar por WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
}
