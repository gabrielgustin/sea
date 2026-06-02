'use client';

import Image from 'next/image';
import { useInView } from '@/hooks/useInView';

const courses = [
  {
    id: 1,
    title: 'Desarrollo de Aplicaciones',
    subtitle: 'Crea aplicaciones profesionales desde cero',
    type: 'DIPLOMATURA',
    image: '/course-app-development.jpg',
    badge: 'EDUCACIÓN A DISTANCIA',
    startDate: 'Lun 1/06/2026',
    modality: 'Online',
  },
  {
    id: 2,
    title: 'Desarrollo de Videojuegos',
    subtitle: 'Crea tus propios videojuegos interactivos',
    type: 'CERTIFICADO',
    image: '/course-game-development.jpg',
    badge: 'EDUCACIÓN A DISTANCIA',
    startDate: 'Jue 4/06/2026',
    modality: 'Online',
  },
  {
    id: 3,
    title: 'Diseño e Impresión 3D',
    subtitle: 'Diseña y crea modelos 3D profesionales',
    type: 'CERTIFICADO',
    image: '/course-3d-design.jpg',
    badge: 'EDUCACIÓN PRESENCIAL',
    startDate: 'Mar 3/06/2026',
    modality: 'Presencial',
  },
  {
    id: 4,
    title: 'Mecánica Automotriz',
    subtitle: 'Domina el funcionamiento de sistemas automotrices',
    type: 'DIPLOMATURA',
    image: '/course-app-development.jpg',
    badge: 'EDUCACIÓN PRESENCIAL',
    startDate: 'Mar 3/06/2026',
    modality: 'Presencial',
  },
];

export default function CoursesSection() {
  const { ref, isInView } = useInView({ once: true, threshold: 0.1 });

  return (
    <section ref={ref} className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className={`text-3xl md:text-5xl font-bold text-center mb-4 transition-all duration-700 ${isInView ? 'animate-fade-in' : 'opacity-0'}`} style={{ color: '#08207f' }}>
            Próximas Formaciones
          </h2>
          <p className={`text-gray-600 text-center text-lg transition-all duration-700 ${isInView ? 'animate-fade-in stagger-1' : 'opacity-0'}`}>
            Inscripciones abiertas
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className={`overflow-hidden rounded-3xl border-2 transition-all duration-700 hover-lift shadow-blue-sm hover:shadow-blue-md ${
                isInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                borderColor: '#e5e5e5',
                backgroundColor: '#ffffff',
                animationDelay: isInView ? `${index * 0.1}s` : '0s'
              }}
            >
              {/* Image Container */}
              <div className="relative h-48 md:h-56 overflow-hidden">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Badge */}
                <div 
                  className="absolute top-4 right-4 px-4 py-2 rounded-full text-white text-xs font-bold transition-all duration-300"
                  style={{ backgroundColor: '#00a8cc' }}
                >
                  {course.badge}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Type */}
                <div className="mb-3">
                  <span className="text-xs font-bold tracking-wider" style={{ color: '#00a8cc' }}>
                    {course.type}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                  {course.title}
                </h3>

                {/* Subtitle */}
                <p className="text-gray-600 text-sm mb-6">
                  {course.subtitle}
                </p>

                {/* Details */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-semibold text-sm">Inicia:</span>
                    <span className="text-sm">{course.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-semibold text-sm">Modalidad:</span>
                    <span className="text-sm">{course.modality}</span>
                  </div>
                </div>

                {/* Button */}
                <button 
                  className="text-sm font-semibold flex items-center gap-2 group transition-all duration-300 hover:gap-3"
                  style={{ color: '#08207f' }}
                >
                  Consultar
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
