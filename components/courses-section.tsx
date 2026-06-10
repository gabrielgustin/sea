'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useInView } from '@/hooks/useInView';
import { useCourses } from '@/context/CoursesContext';
import type { Course } from '@/context/CoursesContext';

interface CoursesSectionProps {
  initialCourses?: Course[];
}

export default function CoursesSection({ initialCourses }: CoursesSectionProps) {
  const { courses: contextCourses } = useCourses();
  const { ref, isInView } = useInView({ once: true, threshold: 0.1 });

  // Use server-prefetched data if available, fallback to context
  const courses = (initialCourses && initialCourses.length > 0) ? initialCourses : contextCourses;

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course, index) => (
            <Link
              key={course.id}
              href={`/cursos/${course.slug || course.id}`}
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
      </div>
    </section>
  );
}
