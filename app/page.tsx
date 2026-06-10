import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import HeroCarousel from '@/components/hero-carousel';
import TrainingCenterCards from '@/components/training-center-cards';
import CoursesSection from '@/components/courses-section';
import BenefitsSection from '@/components/benefits-section';
import LearningMethodologySection from '@/components/learning-methodology-section';
import SpecialOfferSection from '@/components/special-offer-section';
import FAQSection from '@/components/faq-section';
import ContactSection from '@/components/contact-section';
import WhatsAppButton from '@/components/whatsapp-button';

async function getCarouselSlides() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/carousel`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.slides || [];
  } catch {
    return [];
  }
}

async function getCourses() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/courses`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.courses || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [slides, courses] = await Promise.all([
    getCarouselSlides(),
    getCourses(),
  ]);

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar - 10% width */}
      <div className="hidden md:block md:w-[10%] md:h-screen md:overflow-y-auto">
        <Sidebar />
      </div>
      
      {/* Main content - 90% width */}
      <main className="w-full md:w-[90%] overflow-x-hidden overflow-y-auto">
        <Header />
        <HeroCarousel initialSlides={slides} />
        <TrainingCenterCards />
        <CoursesSection initialCourses={courses} />
        <BenefitsSection />
        <LearningMethodologySection />
        <SpecialOfferSection />
        <FAQSection />
        <ContactSection />
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
