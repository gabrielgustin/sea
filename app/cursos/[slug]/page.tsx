'use client';

import Image from 'next/image';
import { MapPin, Clock, Users, DollarSign, Phone, Mail } from 'lucide-react';

// Cursos data
const coursesData = [
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
    fullDescription: 'En este curso aprenderás a desarrollar aplicaciones modernas y profesionales utilizando las tecnologías más actuales. Desde la conceptualización hasta la puesta en producción, dominarás cada aspecto del desarrollo de software.',
    program: [
      'Fundamentos de programación',
      'Desarrollo frontend avanzado',
      'Backend y bases de datos',
      'Integración de APIs',
      'Buenas prácticas y arquitectura',
      'Proyecto integrador final',
    ],
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
    fullDescription: 'Aprende a crear videojuegos 3D profesionales con Unity. Desde mecánicas de juego hasta gráficos avanzados, desarrollarás proyectos reales en equipamiento de última generación.',
    program: [
      'Introducción a motores de juego',
      'Modelado y animación 3D',
      'Programación de mecánicas',
      'Sistemas de audio y efectos',
      'Optimización y performance',
      'Publicación de juegos',
    ],
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
    fullDescription: 'Especialízate en diseño CAD profesional e impresión 3D. Aprenderás desde modelado conceptual hasta la materialización de prototipos y productos finales.',
    program: [
      'Software CAD profesional',
      'Modelado de piezas complejas',
      'Preparación para impresión',
      'Tecnologías de impresión 3D',
      'Post-procesamiento',
      'Proyecto de prototipado real',
    ],
  },
  {
    id: 4,
    title: 'Mecánica Automotriz',
    subtitle: 'Domina el funcionamiento de sistemas automotrices',
    image: '/course-app-development.jpg',
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
    fullDescription: 'Formación integral en mecánica automotriz moderna. Domina sistemas de motor, transmisión, suspensión y electrónica automotriz con equipamiento profesional.',
    program: [
      'Sistemas de motor',
      'Transmisión y transmisión de potencia',
      'Sistemas de suspensión y dirección',
      'Frenos y sistemas de seguridad',
      'Electrónica automotriz',
      'Diagnóstico y reparación',
    ],
  },
];

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = coursesData.find(c => c.slug === slug);

  if (!course) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Curso no encontrado</h1>
          <p className="text-gray-600">El curso que buscas no existe o ha sido eliminado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section with Image */}
      <section className="relative w-full h-96 md:h-[500px] overflow-hidden">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover"
          priority
        />
        
        {/* Overlay with Badge */}
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-start px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto w-full">
            <div 
              className="inline-block px-6 py-3 rounded-full text-white font-bold text-sm md:text-base mb-6"
              style={{ backgroundColor: '#00a8cc' }}
            >
              {course.badge}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
              {course.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ color: '#08207f' }}>
                Sobre este curso
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {course.fullDescription}
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Program */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8" style={{ color: '#08207f' }}>
                Contenido del Curso
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {course.program.map((topic, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                      style={{ backgroundColor: '#08207f' }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold">{topic}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Info Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl p-8 border-2" style={{ borderColor: '#08207f' }}>
              {/* Start Date */}
              <div className="mb-6 pb-6 border-b-2" style={{ borderColor: '#e5e5e5' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={20} style={{ color: '#08207f' }} />
                  <span className="text-sm font-semibold text-gray-600">Inicia</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{course.startDate}</p>
              </div>

              {/* Schedule */}
              <div className="mb-6 pb-6 border-b-2" style={{ borderColor: '#e5e5e5' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={20} style={{ color: '#08207f' }} />
                  <span className="text-sm font-semibold text-gray-600">Horario</span>
                </div>
                <p className="text-gray-900">{course.schedule}</p>
              </div>

              {/* Location */}
              <div className="mb-6 pb-6 border-b-2" style={{ borderColor: '#e5e5e5' }}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={20} style={{ color: '#08207f' }} />
                  <span className="text-sm font-semibold text-gray-600">Lugar</span>
                </div>
                <p className="text-gray-900">{course.location}</p>
              </div>

              {/* Duration */}
              <div className="mb-6 pb-6 border-b-2" style={{ borderColor: '#e5e5e5' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={20} style={{ color: '#08207f' }} />
                  <span className="text-sm font-semibold text-gray-600">Duración</span>
                </div>
                <p className="text-gray-900">{course.duration}</p>
              </div>

              {/* Price */}
              <div className="mb-8 pb-8 border-b-2" style={{ borderColor: '#e5e5e5' }}>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={20} style={{ color: '#08207f' }} />
                  <span className="text-sm font-semibold text-gray-600">Inversión</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#08207f' }}>{course.price}</p>
              </div>

              {/* Registration Button */}
              <button 
                className="w-full py-3 rounded-lg font-bold text-white transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                style={{ backgroundColor: '#08207f' }}
              >
                Solicitar Inscripción
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Teacher Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12" style={{ backgroundColor: '#f8f9fb' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8" style={{ color: '#08207f' }}>
            Instructor
          </h2>
          <div className="bg-white rounded-2xl p-8 border-2" style={{ borderColor: '#08207f' }}>
            <p className="text-xl font-bold text-gray-900 mb-2">{course.teacher}</p>
            <p className="text-gray-600">Profesional especializado con amplia experiencia en el sector</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8" style={{ color: '#08207f' }}>
            ¿Más información?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-6 bg-white rounded-lg border-2" style={{ borderColor: '#e5e5e5' }}>
              <Phone size={28} style={{ color: '#08207f' }} />
              <div>
                <p className="text-sm text-gray-600 font-semibold">Teléfono</p>
                <p className="text-lg font-bold text-gray-900">+54 (0) 351 5986016</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-white rounded-lg border-2" style={{ borderColor: '#e5e5e5' }}>
              <Mail size={28} style={{ color: '#08207f' }} />
              <div>
                <p className="text-sm text-gray-600 font-semibold">Email</p>
                <p className="text-lg font-bold text-gray-900">contacto@extension.edu.ar</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Import Calendar icon from lucide-react
import { Calendar } from 'lucide-react';
