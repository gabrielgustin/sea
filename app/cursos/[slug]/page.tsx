import Image from 'next/image';
import { coursesData } from '@/lib/coursesData';
import CourseDetailClient from '@/components/course-detail-client';

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = coursesData.find(c => c.slug === slug);

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
