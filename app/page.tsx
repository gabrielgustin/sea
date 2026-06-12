import { redirect } from 'next/navigation';

// Redirige rutas sin schoolId a /villada
export default function RootPage() {
  redirect('/villada');
}
