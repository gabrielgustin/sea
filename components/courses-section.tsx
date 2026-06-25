'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useInView } from '@/hooks/useInView';
import { useCourses } from '@/context/CoursesContext';
import type { Course } from '@/context/CoursesContext';
import { useSchool } from '@/context/SchoolContext';

interface CoursesSectionProps {
  initialCourses?: Course[];
}

export default function CoursesSection({ initialCourses }: CoursesSectionProps) {
  const { courses: contextCourses, loading } = useCourses();
  const { ref, isInView } = useInView({ once: true, threshold: 0.1 });
  const { schoolId } = useSchool();

  // Format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    return `${parseInt(day)}/${month}/${year}`;
  };

  // Always derive from context (reactive to toggle changes).
  // Fall back to initialCourses only while the context is still loading.
  const courses = loading && initialCourses && initialCourses.length > 0
    ? initialCourses
    : contextCourses.filter((c) => c.showOnHome === true);

  // Si no hay cursos marcados para mostrar en el inicio, no renderizar la sección
  if (!loading && courses.length === 0) return null;

  return (
    <section ref={ref} className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className={`text-3xl md:text-5xl font-bold text-center mb-4 transition-all duration-700 ${isInView ? 'animate-fade-in' : 'opacity-0'}`} style={{ color: '#031e41' }}>
            Próximas Formaciones
          </h2>
          <p className={`text-gray-600 text-center text-lg transition-all duration-700 ${isInView ? 'animate-fade-in stagger-1' : 'opacity-0'}`}>
            Inscripciones abiertas
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <Link
              key={course.id}
              href={`/${schoolId}/cursos/${course.slug || course.id}`}
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                <p className="text-gray-600 text-xs md:text-sm mb-3">
                  {course.subtitle}
                </p>

                {/* Requirements */}
                {course.requirements && (
                  <div className="mb-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Requisitos</p>
                    <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">{course.requirements}</p>
                  </div>
                )}

                {/* Details */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-semibold text-xs">Inicia:</span>
                    <span className="text-xs">{formatDate(course.startDate)}</span>
                  </div>
                  <span className="text-xs font-semibold transition-colors duration-200 group-hover:underline" style={{ color: '#031e41' }}>
                    Ver más →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
