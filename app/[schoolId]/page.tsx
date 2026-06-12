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
import { getDb } from '@/lib/db/getDb';
import { carouselSlides, courses } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

async function getCarouselSlides(schoolId: string) {
  try {
    const db = await getDb(schoolId);
    const data = await db
      .select()
      .from(carouselSlides)
      .where(eq(carouselSlides.active, true))
      .orderBy(asc(carouselSlides.order));
    return data;
  } catch {
    return [];
  }
}

async function getHomeCourses(schoolId: string) {
  try {
    const db = await getDb(schoolId);
    const data = await db
      .select()
      .from(courses)
      .where(eq(courses.showOnHome, true))
      .orderBy(asc(courses.createdAt));
    return data;
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
      <Header />
      <HeroCarousel slides={slides} />
      <TrainingCenterCards />
      <CoursesSection initialCourses={initialCourses} />
      <BenefitsSection />
      <LearningMethodologySection />
      <SpecialOfferSection />
      <FAQSection />
      <ContactSection />
      <WhatsAppButton />
    </>
  );
}
