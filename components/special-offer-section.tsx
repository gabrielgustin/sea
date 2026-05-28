import { Sparkles } from 'lucide-react';

export default function SpecialOfferSection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto border border-cyan-500 rounded-3xl bg-slate-900 p-8 md:p-12">
        {/* Badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles size={20} className="text-cyan-500" />
          <span className="text-cyan-500 font-semibold text-sm md:text-base tracking-wider">
            OFERTA ESPECIAL
          </span>
          <Sparkles size={20} className="text-cyan-500" />
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-4">
          Inscripciones Abiertas
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-cyan-500 text-center mb-6">
          Inicio en junio 2026 - Cupos limitados
        </p>

        {/* Description */}
        <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto leading-relaxed">
          No esperes más para transformar tu futuro. Los lugares se asignan por orden de
          inscripción. Todos nuestros cursos incluyen certificación oficial de ITS Villada.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button className="px-8 py-3 md:px-10 md:py-4 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold rounded-full transition-colors">
            Reservar mi lugar
          </button>
          <button className="px-8 py-3 md:px-10 md:py-4 border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 font-semibold rounded-full transition-colors">
            Consultar por WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
}
