'use client';

import { use } from 'react';
import { useCourses } from '@/context/CoursesContext';
import { useSchool } from '@/context/SchoolContext';
import EnrollmentFlow from '@/components/enrollment-flow';

interface PageProps {
  params: Promise<{ schoolId: string; id: string }>;
}

export default function EnrollmentPage({ params }: PageProps) {
  const { id } = use(params);
  const { courses } = useCourses();
  const { schoolId } = useSchool();

  const course = courses.find(c => c.id === id || c.slug === id);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4" style={{ borderColor: '#00d4ff' }}></div>
          <p className="text-gray-400">Cargando curso...</p>
        </div>
      </div>
    );
  }

  return <EnrollmentFlow course={course} />;
}
