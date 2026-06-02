'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useInView } from '@/hooks/useInView';

const courses = [
  {
    id: 1,
    title: 'Desarrollo de Aplicaciones',
    subtitle: 'Forma a estudiantes en fundamentos de programación con Python',
    image: '/course-app-development.jpg',
    badge: 'EDUCACIÓN PRESENCIAL',
    startDate: 'Lun 1/06/2026',
    modality: 'Presencial',
    slug: 'desarrollo-de-aplicaciones',
    description: 'Formar a los estudiantes en los fundamentos de la programación, desarrollando habilidades para crear aplicaciones funcionales utilizando Python, incluyendo interfaces gráficas.',
    schedule: 'Lunes: 16:30 a 18:00',
    location: 'Centro de Programación',
    teacher: 'Gabriel Muñoz',
    duration: '6 meses',
    price: '$35.000/mes',
    objective: 'Formar a los estudiantes en los fundamentos de la programación, desarrollando habilidades para crear aplicaciones funcionales utilizando Python, incluyendo interfaces gráficas.',
    modules: [
      {
        number: '01',
        title: 'Fundamentos de Programación',
        topics: ['Concepto de algoritmo', 'Tipos de datos y sintaxis', 'Operadores lógicos y aritméticos']
      },
      {
        number: '02',
        title: 'Estructuras Condicionales',
        topics: ['Estructura de algoritmos', 'Expresiones y proposiciones lógicas', 'Operadores relacionales y lógicos']
      },
      {
        number: '03',
        title: 'Estructuras Repetitivas',
        topics: ['Control de flujo', 'Ciclos', 'Variables contadoras y acumuladoras']
      },
      {
        number: '04',
        title: 'Funciones',
        topics: ['Sintaxis de funciones', 'Funciones con y sin retorno', 'Modularización del código']
      },
      {
        number: '05',
        title: 'Interfaces Gráficas con Tkinter',
        topics: ['Introducción a interfaces gráficas', 'Ventanas y widgets básicos', 'Botones, etiquetas y entradas', 'Diseño de aplicaciones simples con interfaz']
      }
    ],
    methodology: 'Clases prácticas basadas en resolución de problemas reales, más de 20 ejercicios prácticos por unidad, trabajo práctico integrador por módulo',
    finalProject: 'Desarrollo de una aplicación funcional con interfaz gráfica',
  },
  {
    id: 2,
    title: 'Desarrollo de Videojuegos',
    subtitle: 'Desarrolla videojuegos completos con herramientas modernas',
    image: '/course-game-development.jpg',
    badge: 'EDUCACIÓN PRESENCIAL',
    startDate: 'Jue 4/06/2026',
    modality: 'Presencial',
    slug: 'desarrollo-de-videojuegos',
    description: 'Que los alumnos desarrollen videojuegos completos mientras adquieren habilidades de lógica y pensamiento computacional utilizando herramientas modernas.',
    schedule: 'Jueves: 16:30 a 18:00',
    location: 'Laboratorio de Desarrollo',
    teacher: 'Gabriel Muñoz',
    duration: '6 meses',
    price: '$35.000/mes',
    objective: 'Que los alumnos desarrollen videojuegos completos mientras adquieren habilidades de lógica y pensamiento computacional utilizando herramientas modernas.',
    modules: [
      {
        number: '01',
        title: 'Lógica y diseño de juegos',
        topics: ['Cómo funcionan los videojuegos', 'Objetivos y reglas', 'Introducción al pensamiento computacional']
      },
      {
        number: '02',
        title: 'Primeros juegos',
        topics: ['Uso de herramientas (GDevelop)', 'Escenas y objetos', 'Movimiento de personajes']
      },
      {
        number: '03',
        title: 'Mecánicas de juego',
        topics: ['Sistema de puntaje', 'Vidas y condiciones de derrota', 'Colisiones', 'Eventos y lógica de juego']
      },
      {
        number: '04',
        title: 'Mejora y personalización',
        topics: ['Animaciones', 'Sonidos', 'Interfaces (menú, inicio, game over)', 'Diseño visual']
      },
      {
        number: '05',
        title: 'Proyecto Final',
        topics: ['Desarrollo de videojuego completo', 'Personalización total', 'Presentación final']
      }
    ],
    methodology: 'Clases prácticas basadas en proyectos, resolución de desafíos progresivos, trabajo práctico integrador',
    finalProject: 'Desarrollo de un videojuego funcional e interactivo',
  },
  {
    id: 3,
    title: 'Diseño e Impresión 3D',
    subtitle: 'Capacita en diseño 3D y fabricación mediante impresión 3D',
    image: '/course-3d-design.jpg',
    badge: 'EDUCACIÓN PRESENCIAL',
    startDate: 'Mar 3/06/2026',
    modality: 'Presencial',
    slug: 'diseno-impresion-3d',
    description: 'Capacitar a los estudiantes en el diseño de modelos tridimensionales y su fabricación mediante impresión 3D.',
    schedule: 'Martes: 16:30 a 18:00',
    location: 'Centro de Fabricación Digital',
    teacher: 'Santiago Henderson',
    duration: '6 meses',
    price: '$35.000/mes',
    objective: 'Capacitar a los estudiantes en el diseño de modelos tridimensionales y su fabricación mediante impresión 3D.',
    modules: [
      {
        number: '01',
        title: 'Introducción a la Impresión 3D',
        topics: ['Qué es la impresión 3D', 'Tipos de impresoras', 'Partes de una impresora 3D', 'Flujo de trabajo']
      },
      {
        number: '02',
        title: 'Herramientas de Diseño',
        topics: ['Introducción a Autodesk Fusion 360', 'Interfaz y navegación', 'Operaciones básicas', 'Modificadores iniciales']
      },
      {
        number: '03',
        title: 'Modelado para Impresión',
        topics: ['Modelado básico', 'Modificadores avanzados', 'Sketches (bocetos)', 'Diseño orientado a fabricación']
      },
      {
        number: '04',
        title: 'Preparación de Impresión',
        topics: ['Uso de Ultimaker Cura', 'Configuración de perfiles', 'Preparación de archivos', 'Ajustes de calidad']
      },
      {
        number: '05',
        title: 'Producción y Optimización',
        topics: ['Puesta a punto', 'Mantenimiento', 'Problemas habituales', 'Comunidad Maker']
      }
    ],
    methodology: 'Metodología teórico-práctica orientada a recorrer el proceso completo: diseño, preparación e impresión de piezas. Aprendizaje basado en proyectos reales',
    finalProject: 'Diseño y fabricación de un producto funcional en 3D',
  },
  {
    id: 4,
    title: 'Mecánica de Motores',
    subtitle: 'Brindar conocimientos técnicos sobre funcionamiento de motores',
    image: '/course-automotive.jpg',
    badge: 'EDUCACIÓN PRESENCIAL',
    startDate: 'Mar 3/06/2026',
    modality: 'Presencial',
    slug: 'mecanica-de-motores',
    description: 'Brindar conocimientos técnicos sobre el funcionamiento, mantenimiento y reparación de motores y sistemas automotrices.',
    schedule: 'Martes: 16:30 a 18:00',
    location: 'Taller de Mecánica',
    teacher: 'Kevin Altamirano',
    duration: '6 meses',
    price: '$35.000/mes',
    objective: 'Brindar conocimientos técnicos sobre el funcionamiento, mantenimiento y reparación de motores y sistemas automotrices.',
    modules: [
      {
        number: '01',
        title: 'Principios del Motor',
        topics: ['Partes constitutivas', 'Ciclo Otto y Diesel', 'Evolución de los motores']
      },
      {
        number: '02',
        title: 'Sistemas del Motor',
        topics: ['Admisión', 'Escape', 'Encendido', 'Lubricación y refrigeración', 'Sistema de combustible']
      },
      {
        number: '03',
        title: 'Sistemas del Vehículo',
        topics: ['Frenos', 'Dirección', 'Suspensión', 'Transmisión']
      },
      {
        number: '04',
        title: 'Mantenimiento',
        topics: ['Diagnóstico de fallas', 'Cambio de fluidos', 'Verificación del tren delantero', 'Sistema de distribución']
      },
      {
        number: '05',
        title: 'Reparación de Motores',
        topics: ['Armado y desarmado', 'Metrología', 'Verificaciones previas a la puesta en marcha']
      }
    ],
    methodology: 'Metodología teórico-práctica con comprensión de sistemas automotrices y resolución de problemas mecánicos reales',
    finalProject: 'Diagnóstico y simulación de reparación de un motor',
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
              className={`overflow-hidden rounded-3xl border-2 transition-all duration-300 hover-lift shadow-blue-sm hover:shadow-blue-md block group ${
                isInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                borderColor: '#e5e5e5',
                backgroundColor: '#ffffff',
                animationDelay: isInView ? `${index * 0.1}s` : '0s'
              }}
            >
              {/* Image Container */}
              <div className="relative h-48 md:h-56 overflow-hidden bg-gray-100">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Badge */}
                <div 
                  className="absolute top-4 right-4 px-4 py-2 rounded-full text-white text-xs font-bold transition-all duration-300 group-hover:translate-y-1"
                  style={{ backgroundColor: '#00a8cc' }}
                >
                  {course.badge}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-5">
                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight transition-colors duration-300 group-hover:text-blue-600">
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
