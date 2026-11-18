import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/admin-dashboard';
import { getSession } from '@/lib/auth/session';

// El control de acceso lo hace el servidor: sin sesión de administrador de ESTE cliente no se renderiza nada.
export default async function AdminPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const session = await getSession(tenant);
  if (session?.role !== 'admin') redirect(`/${tenant}`);
  // Suspense: el panel lee la sección de la dirección (?seccion=…).
  return (
    <Suspense>
      <AdminDashboard />
    </Suspense>
  );
}
