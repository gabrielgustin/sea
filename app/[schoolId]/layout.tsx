import { redirect } from 'next/navigation';

export default async function SchoolLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ schoolId: string }>;
}) {
  const { schoolId } = await params;

  // Validar que el schoolId sea válido
  const validSchools = ['villada', 'savio'];
  if (!validSchools.includes(schoolId)) {
    redirect('/villada');
  }

  // El SchoolContext en el root layout ya detecta el schoolId automáticamente
  // Este layout solo sirve para validación
  return <>{children}</>;
}
