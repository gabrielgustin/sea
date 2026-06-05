import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import TrabajaConNosotrosPage from '@/components/trabaja-con-nosotros-page';

export const metadata = {
  title: 'Trabaja con Nosotros | SEA',
  description: 'Únete a nuestro equipo de educadores y colaboradores',
};

export default function Page() {
  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      <Sidebar />
      <div className="flex h-screen w-full">
        <main className="w-full ml-[10%] overflow-x-hidden overflow-y-auto">
          <Header />
          <TrabajaConNosotrosPage />
        </main>
      </div>
    </div>
  );
}
