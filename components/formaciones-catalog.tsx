'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useInView } from '@/hooks/useInView';
import { useCourses } from '@/context/CoursesContext';

export default function FormacionesCatalog() {
  const { courses } = useCourses();
  const { ref, isInView } = useInView({ once: true, threshold: 0.1 });

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="w-full py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance" style={{ color: '#031e41' }}>
            Catálogo de Formaciones
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explora todos nuestros cursos y programas disponibles. Elige la formación que mejor se adapte a tus necesidades.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section ref={ref} className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: '#031e41' }} className="text-lg font-semibold">
                Cargando formaciones...
              </p>
            </div>
          ) : (
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
                      style={{ backgroundColor: '#031e41' }}
                    >
                      {course.badge}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-5">
                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight transition-colors duration-300 group-hover:text-blue-900" style={{ color: 'inherit' }}>
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
          )}

          {/* Total Count */}
          <div className="text-center mt-12">
            <p style={{ color: '#1a4d7a' }} className="text-lg">
              Mostrando <span className="font-bold">{courses.length}</span> formación(es) disponible(s)
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
