import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import FormacionesCatalog from '@/components/formaciones-catalog';

export const metadata = {
  title: 'Catálogo de Formaciones | Colegio Domingo Savio',
  description: 'Explora todos nuestros cursos y programas de formación disponibles.',
};

export default function CatalogoFormacionesPage() {
  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      <Sidebar />
      <div className="flex h-screen w-full">
        <main className="w-full md:ml-[10%] overflow-x-hidden overflow-y-auto">
          <Header />
          <FormacionesCatalog />
        </main>
      </div>
    </div>
  );
}
