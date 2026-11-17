import { notFound } from 'next/navigation';
import EnrollmentFlow from '@/components/enrollment-flow';
import { tenantDb } from '@/lib/tenants/db';
import { getCourse } from '@/lib/data/courses';

export default async function EnrollmentPage({ params }: { params: Promise<{ tenant: string; id: string }> }) {
  const { tenant, id } = await params;
  const { db } = await tenantDb(tenant);
  const course = await getCourse(db, decodeURIComponent(id));
  if (!course) notFound();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <EnrollmentFlow course={course as any} />;
}
