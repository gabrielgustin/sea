import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import WhatsAppButton from '@/components/whatsapp-button';

export default function CursosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar - 10% width */}
      <div className="hidden md:block md:w-[10%] md:h-screen md:overflow-y-auto">
        <Sidebar />
      </div>
      
      {/* Main content - 90% width */}
      <main className="w-full md:w-[90%] overflow-x-hidden overflow-y-auto">
        <Header />
        <div className="w-full">
          {children}
        </div>
      </main>

      {/* Mobile sidebar (separate from layout) */}
      <div className="md:hidden">
        <Sidebar />
      </div>
      
      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
