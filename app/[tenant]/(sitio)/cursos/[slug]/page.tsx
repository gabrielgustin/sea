import { notFound } from 'next/navigation';
import CourseDetailClient from '@/components/course-detail-client';
import { tenantDb } from '@/lib/tenants/db';
import { getCourse } from '@/lib/data/courses';

export default async function CoursePage({ params }: { params: Promise<{ tenant: string; slug: string }> }) {
  const { tenant, slug } = await params;
  const { db } = await tenantDb(tenant);
  const course = await getCourse(db, decodeURIComponent(slug));
  if (!course) notFound();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <CourseDetailClient course={course as any} />;
}
