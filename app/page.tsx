import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import SpecialOfferSection from '@/components/special-offer-section';
import FAQSection from '@/components/faq-section';
import ContactSection from '@/components/contact-section';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar - 10% width */}
      <div className="hidden md:block md:w-[10%] md:h-screen md:overflow-y-auto">
        <Sidebar />
      </div>
      
      {/* Main content - 90% width */}
      <main className="w-full md:w-[90%] overflow-x-hidden overflow-y-auto">
        <Header />
        <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-8 md:pt-5">
        </div>
        <SpecialOfferSection />
        <FAQSection />
        <ContactSection />
        <Footer />
      </main>

      {/* Mobile sidebar (separate from layout) */}
      <div className="md:hidden">
        <Sidebar />
      </div>
    </div>
  );
}
