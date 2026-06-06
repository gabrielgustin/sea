'use client';

import { useEffect, useState } from 'react';
import { useCourses } from '@/context/CoursesContext';
import CourseDetailClient from '@/components/course-detail-client';
import { useParams } from 'next/navigation';

export default function CoursePage() {
  const params = useParams();
  const id = params.id as string;
  const { getCourseById } = useCourses();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const courseId = parseInt(id);
    const foundCourse = getCourseById(courseId);
    if (foundCourse) {
      setCourse(foundCourse);
    }
    setLoading(false);
  }, [id, getCourseById]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Curso no encontrado</h1>
          <p className="text-gray-600">El curso que buscas no existe o ha sido eliminado.</p>
        </div>
      </div>
    );
  }

  return <CourseDetailClient course={course} />;
}
