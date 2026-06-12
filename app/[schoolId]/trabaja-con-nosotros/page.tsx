import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import TrabajaConNosotrosPage from '@/components/trabaja-con-nosotros-page';

export const metadata = {
  title: 'Trabaja con Nosotros | Colegio Domingo Savio',
  description: 'Únete a nuestro equipo de educadores y colaboradores.',
};

export default function TrabajaConNosotrosRoute() {
  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      <Sidebar />
      <div className="flex h-screen w-full">
        <main className="w-full md:ml-[10%] overflow-x-hidden overflow-y-auto">
          <Header />
          <TrabajaConNosotrosPage />
        </main>
      </div>
    </div>
  );
}
