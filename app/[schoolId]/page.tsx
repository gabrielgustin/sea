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
import { pool } from '@/lib/db';

async function getCarouselSlides(_schoolId: string) {
  try {
    const result = await pool.query(
      'SELECT * FROM carousel_slides WHERE active = 1 ORDER BY `order` ASC'
    );
    return result.rows || [];
  } catch {
    return [];
  }
}

async function getHomeCourses(_schoolId: string) {
  try {
    const result = await pool.query(
      'SELECT * FROM courses WHERE showOnHome = 1 ORDER BY createdAt ASC'
    );
    return result.rows || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ schoolId: string }> }) {
  const { schoolId } = await params;
  return {
    title: schoolId === 'villada' ? 'ITS Villada - Formaciones' : 'ITS Savio - Formaciones',
    description: 'Programas de formación de calidad',
  };
}

export default async function Home({ params }: { params: Promise<{ schoolId: string }> }) {
  const { schoolId } = await params;
  const slides = await getCarouselSlides(schoolId);
  const initialCourses = await getHomeCourses(schoolId);

  return (
    <>
      <Sidebar />
      <div className="md:pl-[10%]">
        <Header />
        <main>
          <HeroCarousel initialSlides={slides} />
          <TrainingCenterCards />
          <CoursesSection initialCourses={initialCourses} />
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
