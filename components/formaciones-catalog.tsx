'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Clock, Calendar, BookOpen } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  modality: string;
  startDate: string;
  duration: string;
  category: string;
}

export default function FormacionesCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const categories = ['all', ...new Set(courses.map(c => c.category))];

  if (loading) {
    return (
      <div className="w-full py-20 text-center">
        <p style={{ color: '#031e41' }} className="text-lg font-semibold">Cargando formaciones...</p>
      </div>
    );
  }

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

      {/* Filters */}
      <section className="w-full py-8 px-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#031e41' }}>Filtrar por categoría:</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                style={{
                  backgroundColor: selectedCategory === category ? '#031e41' : undefined,
                }}
              >
                {category === 'all' ? 'Todas' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="w-full py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: '#031e41' }} className="text-lg font-semibold">
                No hay formaciones disponibles en esta categoría
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#031e41' }}>
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">
                      {course.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-2 mb-6 border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <BookOpen size={16} style={{ color: '#1a4d7a' }} />
                        <span>{course.modality}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar size={16} style={{ color: '#1a4d7a' }} />
                        <span>Inicia: {course.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock size={16} style={{ color: '#1a4d7a' }} />
                        <span>Duración: {course.duration}</span>
                      </div>
                    </div>

                    {/* Button */}
                    <button
                      className="w-full py-3 rounded-lg font-semibold transition-all duration-300 text-white flex items-center justify-center gap-2 hover:gap-3"
                      style={{ backgroundColor: '#031e41' }}
                    >
                      Ver Detalles
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Total Count */}
          <div className="text-center mt-12">
            <p style={{ color: '#1a4d7a' }} className="text-lg">
              Mostrando <span className="font-bold">{filteredCourses.length}</span> formación(es) disponible(s)
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
