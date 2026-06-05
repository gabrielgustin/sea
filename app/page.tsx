import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import HeroCarousel from '@/components/hero-carousel';
import CoursesSection from '@/components/courses-section';
import BenefitsSection from '@/components/benefits-section';
import LearningMethodologySection from '@/components/learning-methodology-section';
import SpecialOfferSection from '@/components/special-offer-section';
import FAQSection from '@/components/faq-section';
import ContactSection from '@/components/contact-section';
import WhatsAppButton from '@/components/whatsapp-button';

export default function Home() {
  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar - 10% width */}
      <div className="hidden md:block md:w-[10%] md:h-screen md:overflow-y-auto">
        <Sidebar />
      </div>
      
      {/* Main content - 90% width */}
      <main className="w-full md:w-[90%] overflow-x-hidden overflow-y-auto flex flex-col">
        <Header />
        <HeroCarousel />
        <CoursesSection />
        <BenefitsSection />
        <LearningMethodologySection />
        <div className="flex flex-col order-last md:order-none">
          <div className="order-1 md:order-2">
            <FAQSection />
          </div>
          <div className="order-2 md:order-3">
            <SpecialOfferSection />
          </div>
          <div className="order-3 md:order-4">
            <ContactSection />
          </div>
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
