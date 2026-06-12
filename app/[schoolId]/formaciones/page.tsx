import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import FormacionesPage from '@/components/formaciones-page';

export const metadata = {
  title: 'Centro de Formacion - Capacitaciones Extracurriculares',
  description: 'Descubre nuestro servicio de formaciones como extensión académica para instituciones educativas. Programas personalizados de calidad para tu comunidad.'
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
