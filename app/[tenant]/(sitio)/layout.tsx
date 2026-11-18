import SiteNav from '@/components/site/nav';
import SiteFooter from '@/components/site/footer';
import WhatsAppButton from '@/components/whatsapp-button';

// Estructura común de las páginas públicas: barra superior, contenido y pie.
export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      {/* La barra es fija: este espacio evita que tape el contenido; los héroes oscuros suben con -mt-[76px]. */}
      <main className="pt-[76px]">{children}</main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
