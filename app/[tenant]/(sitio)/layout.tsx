import SiteNav from '@/components/site/nav';
import SiteFooter from '@/components/site/footer';
import WhatsAppButton from '@/components/whatsapp-button';

// Estructura común de las páginas públicas: barra superior, contenido y pie.
export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
