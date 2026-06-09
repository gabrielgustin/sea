'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function CoursePage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    fetch(`/api/courses?slug=${slug}`)
      .then(r => r.json())
      .then(data => {
        setCourse(data.course);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <div className="p-8 text-center">Cargando...</div>;
  }

  if (!course) {
    return <div className="p-8 text-center">Curso no encontrado</div>;
  }

  return (
    <div className="w-full bg-white">
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-lg text-blue-100 mb-6">{course.subtitle}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {course.price && (
              <div className="bg-blue-700 p-4 rounded">
                <p className="text-sm">Precio</p>
                <p className="font-bold">{course.price}</p>
              </div>
            )}
            {course.duration && (
              <div className="bg-blue-700 p-4 rounded">
                <p className="text-sm">Duración</p>
                <p className="font-bold">{course.duration}</p>
              </div>
            )}
            {course.startDate && (
              <div className="bg-blue-700 p-4 rounded">
                <p className="text-sm">Inicia</p>
                <p className="font-bold">{course.startDate}</p>
              </div>
            )}
            {course.modality && (
              <div className="bg-blue-700 p-4 rounded">
                <p className="text-sm">Modalidad</p>
                <p className="font-bold">{course.modality}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {course.description && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Descripción</h2>
                <p className="text-gray-700 text-lg">{course.description}</p>
              </div>
            )}

            {course.objective && (
              <div className="mb-12 bg-blue-50 p-8 rounded">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Objetivo</h2>
                <p className="text-gray-700">{course.objective}</p>
              </div>
            )}

            {course.methodology && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Metodología</h2>
                <p className="text-gray-700">{course.methodology}</p>
              </div>
            )}

            {course.modules && course.modules.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Modulos</h2>
                {course.modules.map((m: any, i: number) => (
                  <div key={i} className="border-l-4 border-blue-900 pl-4 py-4 mb-4">
                    <h3 className="font-bold text-gray-900">{m.number}. {m.title}</h3>
                    <p className="text-gray-600">{m.topics.join(', ')}</p>
                  </div>
                ))}
              </div>
            )}

            {course.finalProject && (
              <div className="mb-12 bg-green-50 p-8 rounded">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Proyecto Final</h2>
                <p className="text-gray-700">{course.finalProject}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-8 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Información</h3>
              
              {course.teacher && (
                <div className="mb-6 pb-6 border-b">
                  <p className="text-gray-600 font-semibold mb-2">Docente</p>
                  <p className="text-gray-900 font-bold">{course.teacher}</p>
                </div>
              )}
              
              {course.schedule && (
                <div className="mb-6 pb-6 border-b">
                  <p className="text-gray-600 font-semibold mb-2">Horario</p>
                  <p className="text-gray-900">{course.schedule}</p>
                </div>
              )}
              
              {course.location && (
                <div className="mb-6 pb-6 border-b">
                  <p className="text-gray-600 font-semibold mb-2">Ubicacion</p>
                  <p className="text-gray-900">{course.location}</p>
                </div>
              )}
              
              {course.requirements && (
                <div className="mb-6">
                  <p className="text-gray-600 font-semibold mb-2">Requisitos</p>
                  <p className="text-gray-900">{course.requirements}</p>
                </div>
              )}

              <button className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 mb-4">
                Inscribirse
              </button>
              <button className="w-full border-2 border-blue-900 text-blue-900 font-bold py-3 rounded-lg hover:bg-blue-50">
                Mas Informacion
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
