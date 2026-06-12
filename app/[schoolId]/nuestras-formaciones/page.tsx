import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import NuestrasFormacionesPage from '@/components/nuestras-formaciones-page';

export const metadata = {
  title: 'Nuestras Formaciones | Colegio Domingo Savio',
  description: 'Explora todos nuestros cursos y programas de formación disponibles.',
};

export default function NuestrasFormacionesRoute() {
  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      <Sidebar />
      <div className="flex h-screen w-full">
        <main className="w-full overflow-x-hidden overflow-y-auto">
          <Header />
          <NuestrasFormacionesPage />
        </main>
      </div>
    </div>
  );
}
