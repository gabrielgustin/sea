import { redirect } from 'next/navigation';
import { SchoolProvider } from '@/components/school-provider';

export default async function SchoolLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ schoolId: string }>;
}) {
  const { schoolId } = await params;

  // Validar que el schoolId sea válido
  const validSchools = ['savio', 'villada'];
  if (!validSchools.includes(schoolId)) {
    redirect('/savio');
  }

  return (
    <SchoolProvider schoolId={schoolId}>
      {children}
    </SchoolProvider>
  );
}
