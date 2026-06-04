import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import FormacionesPage from '@/components/formaciones-page';

export const metadata = {
  title: 'Centro de Formaciones - Capacitaciones Extracurriculares',
  description: 'Descubre nuestro servicio de formaciones como extensión académica para instituciones educativas. Programas personalizados de calidad para tu comunidad.'
};

export default function FormacionesRoute() {
  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      <Sidebar />
      <div className="flex h-screen w-full md:w-[90%]">
        <main className="w-full overflow-x-hidden overflow-y-auto">
          <Header />
          <FormacionesPage />
        </main>
      </div>
    </div>
  );
}
