import { redirect } from 'next/navigation';

// Redirige rutas sin schoolId a /savio
export default function RootPage() {
  redirect('/savio');
}
