import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import FormacionesPage from '@/components/formaciones-page';

export const metadata = {
  title: 'Formaciones | Colegio Domingo Savio',
  description: 'Descubre nuestros programas de formación como extensión académica.',
};

export default function FormacionesRoute() {
  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      <Sidebar />
      <div className="flex h-screen w-full">
        <main className="w-full md:ml-[10%] overflow-x-hidden overflow-y-auto">
          <Header />
          <FormacionesPage />
        </main>
      </div>
    </div>
  );
}
