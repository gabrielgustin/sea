'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useInView } from '@/hooks/useInView';

const courses = [
  {
    id: 1,
    title: 'Desarrollo de Aplicaciones',
    subtitle: 'Crea aplicaciones profesionales desde cero',
    image: '/course-app-development.jpg',
    badge: 'EDUCACIÓN PRESENCIAL',
    startDate: 'Lun 1/06/2026',
    modality: 'Presencial',
    slug: 'desarrollo-de-aplicaciones',
    description: 'Aprende a crear aplicaciones profesionales con las herramientas y tecnologías más demandadas en la industria. Este curso presencial te brinda experiencia práctica desde el primer día.',
    schedule: 'Lunes a Viernes: 16:30 a 18:30',
    location: 'Planta Baja Edificio Central',
    teacher: 'Ing. Sebastián Oliva',
    duration: '160 horas',
    price: '$15.000',
  },
  {
    id: 2,
    title: 'Desarrollo de Videojuegos',
    subtitle: 'Crea tus propios videojuegos interactivos',
    image: '/course-game-development.jpg',
    badge: 'EDUCACIÓN PRESENCIAL',
    startDate: 'Jue 4/06/2026',
    modality: 'Presencial',
    slug: 'desarrollo-de-videojuegos',
    description: 'Diseña y desarrolla videojuegos 3D profesionales utilizando motores de juego modernos. Clases prácticas en laboratorio con equipamiento profesional.',
    schedule: 'Jueves y Viernes: 16:30 a 19:30',
    location: 'Laboratorio de Desarrollo - Piso 3',
    teacher: 'Lic. María González',
    duration: '140 horas',
    price: '$18.000',
  },
  {
    id: 3,
    title: 'Diseño e Impresión 3D',
    subtitle: 'Diseña y crea modelos 3D profesionales',
    image: '/course-3d-design.jpg',
    badge: 'EDUCACIÓN PRESENCIAL',
    startDate: 'Mar 3/06/2026',
    modality: 'Presencial',
    slug: 'diseno-impresion-3d',
    description: 'Domina el diseño CAD y la impresión 3D. Desde modelado hasta materialización de tus proyectos en máquinas profesionales.',
    schedule: 'Martes y Miércoles: 17:00 a 20:00',
    location: 'Centro de Fabricación Digital',
    teacher: 'Arq. Carlos Ruiz',
    duration: '120 horas',
    price: '$16.500',
  },
  {
    id: 4,
    title: 'Mecánica Automotriz',
    subtitle: 'Domina el funcionamiento de sistemas automotrices',
    image: '/course-automotive.jpg',
    badge: 'EDUCACIÓN PRESENCIAL',
    startDate: 'Mar 3/06/2026',
    modality: 'Presencial',
    slug: 'mecanica-automotriz',
    description: 'Capacitación integral en sistemas automotrices modernos. Aprende reparación, mantenimiento y diagnóstico con equipamiento profesional.',
    schedule: 'Martes, Miércoles y Viernes: 18:00 a 20:30',
    location: 'Taller de Mecánica - Anexo Sur',
    teacher: 'Ing. Técnico Roberto López',
    duration: '180 horas',
    price: '$20.000',
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
            <Link
              key={course.id}
              href={`/cursos/${course.slug}`}
              className={`overflow-hidden rounded-3xl border-2 transition-all duration-700 hover-lift shadow-blue-sm hover:shadow-blue-md block ${
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
              <div className="p-4 md:p-5">
                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight">
                  {course.title}
                </h3>

                {/* Subtitle */}
                <p className="text-gray-600 text-xs md:text-sm mb-4">
                  {course.subtitle}
                </p>

                {/* Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-semibold text-xs">Inicia:</span>
                    <span className="text-xs">{course.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-semibold text-xs">Modalidad:</span>
                    <span className="text-xs">{course.modality}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
