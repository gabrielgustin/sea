import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import HeroCarousel from '@/components/hero-carousel';
import ProgramsSection from '@/components/programs-section';
import NewsSection from '@/components/news-section';
import FormationsSection from '@/components/formations-section';
import FAQSection from '@/components/faq-section';
import ContactSection from '@/components/contact-section';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <>
      <Sidebar />
      <main className="w-full md:ml-24 overflow-x-hidden">
        <Header />
        <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-8 md:pt-28">
          <div className="max-w-7xl mx-auto">
            <HeroCarousel />
          </div>
        </div>
        <ProgramsSection />
        <NewsSection />
        <FormationsSection />
        <FAQSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
