// Course detail page - loads course data by slug from the API
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CourseDetailClient from '@/components/course-detail-client';

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
        setCourse(data.course || null);
        setLoading(false);
      })
      .catch(err => {
        console.error('[v0] Course fetch error:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 text-sm">Cargando formación...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-4">
        <h1 className="text-2xl font-bold text-gray-900">Curso no encontrado</h1>
        <p className="text-gray-500">El curso que buscas no existe o ha sido eliminado.</p>
      </div>
    );
  }

  return <CourseDetailClient course={course} />;
}
