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
import { tenantDb } from '@/lib/tenants/db';
import { listSlides } from '@/lib/data/carousel';
import { listCourses } from '@/lib/data/courses';

export default async function Home({ params }: { params: Promise<{ tenant: string }> }) {
  const { db } = await tenantDb((await params).tenant);
  const [slides, initialCourses] = await Promise.all([listSlides(db, { activeOnly: true }), listCourses(db, { homeOnly: true })]);

  return (
    <>
      <Sidebar />
      <div className="md:pl-[10%]">
        <Header />
        <main>
          <HeroCarousel initialSlides={slides as never} />
          <TrainingCenterCards />
          <CoursesSection initialCourses={initialCourses as never} />
          <BenefitsSection />
          <LearningMethodologySection />
          <SpecialOfferSection />
          <FAQSection />
          <ContactSection />
        </main>
      </div>
      <WhatsAppButton />
    </>
  );
}
