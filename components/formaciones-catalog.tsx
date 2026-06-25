'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useInView } from '@/hooks/useInView';
import { useCourses } from '@/context/CoursesContext';
import { useSchool } from '@/context/SchoolContext';

export default function FormacionesCatalog() {
  const { courses } = useCourses();
  const { ref, isInView } = useInView({ once: true, threshold: 0.1 });
  const { schoolId } = useSchool();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="w-full pt-24 md:pt-16 pb-8 md:pb-16 md:min-h-[70vh] flex items-center justify-center px-4"
        style={{
          background: 'linear-gradient(135deg, #031e41 0%, #1a4d7a 100%)',
        }}
      >
        <div className="w-full text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Catálogo de Formaciones
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            Explora todos nuestros cursos y programas disponibles. Elige la formación que mejor se adapte a tus necesidades y comienza tu camino hacia el éxito.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section id="cursos" ref={ref} className="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto">

          {courses.length === 0 ? (
            <div className="text-center py-16 md:py-24">
              <p style={{ color: '#031e41' }} className="text-lg font-semibold">
                Cargando formaciones...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {courses.map((course, index) => (
                <Link
                  key={course.id}
                  href={`/${schoolId}/cursos/${course.slug || course.id}`}
                  className={`overflow-hidden rounded-2xl md:rounded-3xl border-2 transition-all duration-500 hover:shadow-2xl block group ${
                    isInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ 
                    borderColor: '#e5e5e5',
                    backgroundColor: '#ffffff',
                    animationDelay: isInView ? `${index * 0.1}s` : '0s'
                  }}
                >
                  {/* Image Container */}
                  <div className="relative h-40 md:h-56 overflow-hidden bg-gray-100 group-hover:bg-gray-200 transition-colors">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    
                    {/* Badge */}
                    <div 
                      className="absolute top-3 md:top-4 right-3 md:right-4 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-white text-xs font-bold transition-all duration-300 group-hover:translate-y-0 group-hover:shadow-lg transform hover:scale-105"
                      style={{ backgroundColor: '#031e41' }}
                    >
                      {course.badge}
                    </div>


                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6">
                    {/* Title */}
                    <h3 className="text-lg md:text-2xl font-bold mb-2 leading-snug transition-colors duration-300 line-clamp-2" style={{ color: '#031e41' }}>
                      {course.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">
                      {course.subtitle}
                    </p>

                    {/* Requirements */}
                    {course.requirements && (
                      <div className="mb-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Requisitos</p>
                        <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">{course.requirements}</p>
                      </div>
                    )}

                    {/* Divider */}
                    <div className="h-px bg-gray-200 my-4"></div>

                    {/* Details */}
                    <div className="space-y-2.5 md:space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#9cbadb' }}></div>
                        <div className="flex-1">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {course.startDate && new Date(course.startDate + 'T00:00:00') < new Date() ? 'Inició' : 'Inicia'}
                          </span>
                          <p className="text-sm md:text-base font-medium text-gray-900">
                            {course.startDate ? (() => { const [y,m,d] = course.startDate.split('-'); return d && m && y ? `${parseInt(d)}/${m}/${y}` : course.startDate; })() : ''}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Footer */}
                    <div className="mt-4 md:mt-5 pt-4 md:pt-5 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold" style={{ color: '#9cbadb' }}>Más información</span>
                        <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
