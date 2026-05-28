'use client';

import { Code, Gamepad2, Box, Wrench, CheckCircle2, Calendar } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: 'Desarrollo de Aplicaciones',
    icon: Code,
    badge: 'PRINCIPIANTE',
    schedule: 'Lunes - 16:30 a 18:00',
    description: 'Aprende a crear aplicaciones profesionales desde cero. Domina los fundamentos de la programación con Python y desarrolla soluciones con interfaces gráficas.',
    benefits: ['Clases prácticas desde el primer día', 'Proyectos reales', 'Certificado oficial'],
  },
  {
    id: 2,
    title: 'Desarrollo de Videojuegos',
    icon: Gamepad2,
    badge: 'PRINCIPIANTE',
    schedule: 'Jueves - 16:30 a 18:00',
    description: 'Crea videojuegos interactivos y emocionantes. Aprende lógica, mecánicas de juego y diseño visual para crear tus propios juegos completos.',
    benefits: ['Crea tu propio videojuego', 'Grupos reducidos', 'Mentorhip constante'],
  },
  {
    id: 3,
    title: 'Diseño e Impresión 3D',
    icon: Box,
    badge: 'PRINCIPIANTE',
    schedule: 'Martes - 16:30 a 18:00',
    description: 'Diseña modelos 3D profesionales con Fusion 360 y aprende impresión 3D. Transforma tus ideas en prototipos físicos funcionales.',
    benefits: ['Diseña e imprime tus proyectos', 'Equipamiento profesional', 'Portfolio real'],
  },
  {
    id: 4,
    title: 'Mecánica Automotriz',
    icon: Wrench,
    badge: 'PRINCIPIANTE',
    schedule: 'Martes - 16:30 a 18:00 • Viernes - 16:30 a 18:00',
    description: 'Domina el funcionamiento, mantenimiento y reparación de motores y sistemas automotrices con tecnología de punta.',
    benefits: ['Práctica en motores reales', 'Componentes auténticos', 'Diploma profesional'],
  },
];

export default function CoursesSection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 text-center mb-4">
            Elige Tu Camino de Aprendizaje
          </h2>
          <p className="text-gray-600 text-center text-lg">
            Cursos completos diseñados para llevarte de principiante a experto
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => {
            const Icon = course.icon;
            return (
              <div
                key={course.id}
                className="p-6 md:p-8 rounded-2xl border-2"
                style={{ borderColor: '#08207f', backgroundColor: '#f8f9fb' }}
              >
                {/* Top section with icon and badge */}
                <div className="flex justify-between items-start mb-4">
                  <Icon size={32} style={{ color: '#08207f' }} />
                  <span className="text-xs font-bold px-3 py-1 rounded" style={{ color: '#08207f', backgroundColor: 'rgba(8, 32, 127, 0.1)' }}>
                    {course.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {course.title}
                </h3>

                {/* Schedule */}
                <div className="flex items-center gap-2 mb-4" style={{ color: '#08207f' }}>
                  <Calendar size={16} />
                  <span className="text-sm font-medium">{course.schedule}</span>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {course.description}
                </p>

                {/* Benefits */}
                <div className="space-y-2 mb-6">
                  {course.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 size={18} style={{ color: '#08207f' }} />
                      <span className="text-gray-700 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button className="text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all" style={{ color: '#08207f' }}>
                  Consultar
                  <span>→</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
