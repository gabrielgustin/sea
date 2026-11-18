import SiteNav from '@/components/site/nav';
import SiteFooter from '@/components/site/footer';
import WhatsAppButton from '@/components/whatsapp-button';
import { getTenant } from '@/lib/tenants/registry';
import { brandVars } from '@/lib/brand';
import { display } from '@/lib/fonts';

// Estructura común de las páginas públicas: barra superior, contenido y pie.
// El color propio de la escuela queda en --accent / --accent-ink para todo el sitio.
export default async function SitioLayout({ children, params }: { children: React.ReactNode; params: Promise<{ tenant: string }> }) {
  const tenant = await getTenant((await params).tenant);
  return (
    <div className={`${display.variable} min-h-screen bg-[#F7FAFD] text-[#031e41]`} style={brandVars(tenant?.config ?? {})}>
      <SiteNav />
      {/* La barra es fija: este espacio evita que tape el contenido; los héroes oscuros suben con -mt-[76px]. */}
      <main className="pt-[76px]">{children}</main>
      <SiteFooter />
      <WhatsAppButton />
    </div>
  );
}
