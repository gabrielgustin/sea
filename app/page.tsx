import { redirect } from 'next/navigation';
import { listTenants } from '@/lib/tenants/registry';

export const dynamic = 'force-dynamic'; // consulta clientes: nunca se congela en el build

// La raíz del dominio no es un sitio: lleva al primer cliente activo (o al que se indique en DEFAULT_TENANT).
export default async function RootPage() {
  const slug = process.env.DEFAULT_TENANT ?? (await listTenants())[0]?.slug;
  if (!slug) return <main style={{ padding: 40 }}>No hay clientes configurados.</main>;
  redirect(`/${slug}`);
}
