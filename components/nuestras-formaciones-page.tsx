'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Users, Award } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  startDate: string;
  duration: string;
  modality: string;
  image: string;
  redirectSlug: string;
}

export default function NuestrasFormacionesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/carousel');
        const data = await response.json();
        setCourses(data.slides || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="w-full px-4 pt-10 pb-10 md:pt-14 md:pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance" style={{ color: '#031e41' }}>Nuestras Formaciones</h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Descubre todos nuestros cursos y programas diseñados para tu desarrollo profesional
          </p>
        </div>
      </section>

      {/* Courses Grid Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Cargando formaciones...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No hay formaciones disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div key={course.id} className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white border border-gray-100">
                  {/* Image Container */}
                  <div className="h-64 overflow-hidden bg-gray-200 relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Content Container */}
                  <div className="p-6 flex flex-col justify-between h-96">
                    {/* Title and Description */}
                    <div>
                      <h3 className="text-2xl font-bold mb-3" style={{ color: '#031e41' }}>
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-base leading-relaxed mb-6">
                        {course.description}
                      </p>
                    </div>

                    {/* Course Details */}
                    <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                      <div className="flex items-start gap-3">
                        <Users size={18} style={{ color: '#031e41' }} className="flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-xs uppercase tracking-wide font-semibold text-gray-600">Modalidad</p>
                          <p className="text-gray-900 font-medium">{course.modality}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Award size={18} style={{ color: '#031e41' }} className="flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-xs uppercase tracking-wide font-semibold text-gray-600">Inicia</p>
                          <p className="text-gray-900 font-medium">{course.startDate}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock size={18} style={{ color: '#031e41' }} className="flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-xs uppercase tracking-wide font-semibold text-gray-600">Duración</p>
                          <p className="text-gray-900 font-medium">{course.duration}</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={`/cursos/${course.redirectSlug}`}
                      className="w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 group/btn text-white"
                      style={{ backgroundColor: '#031e41' }}
                    >
                      Ver Detalles
                      <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4"
        style={{
          background: 'linear-gradient(135deg, #031e41 0%, #1a4d7a 100%)'
        }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Necesitas más información?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Contacta con nosotros para conocer más detalles sobre nuestras formaciones
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link
              href="https://wa.me/5493516307002?text=Hola!%20Me%20interesa%20conocer%20sobre%20nuestras%20formaciones"
              target="_blank"
              className="px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#25D366', color: 'white' }}
            >
              💬 Consultar por WhatsApp
            </Link>
            <a
              href="mailto:info@centroformaciones.com"
              className="px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 border-2 border-blue-300 hover:bg-white/10"
            >
              📧 Enviar Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
