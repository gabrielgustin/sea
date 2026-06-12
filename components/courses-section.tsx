'use client';

import { useInView } from '@/hooks/useInView';
import Link from 'next/link';

export default function CoursesSection({ initialCourses }) {
  const { ref, isInView } = useInView({ once: true, threshold: 0.1 });
  const courses = initialCourses || [];

  return (
    <section ref={ref} className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12" style={{ color: '#031e41' }}>
          Cursos Disponibles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <Link key={course.id} href={`/villada/cursos/${course.slug || course.id}`}>
                <div
                  className={`overflow-hidden rounded-3xl border-2 transition-all duration-700 hover:shadow-lg hover:scale-105 cursor-pointer h-80 flex flex-col ${
                    isInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    borderColor: '#031e41',
                    backgroundImage: course.imageUrl ? `url('${course.imageUrl}')` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transitionDelay: isInView ? `${index * 0.1}s` : '0s',
                  }}
                >
                  <div className="flex-1 flex flex-col justify-end p-4 md:p-6 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-200 line-clamp-2">{course.description}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No hay cursos disponibles en este momento.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
