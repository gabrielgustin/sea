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
import { db } from '@/lib/db';
import { carouselSlides, courses } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

async function getCarouselSlides() {
  try {
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

async function getCourses() {
  try {
    const data = await db
      .select()
      .from(courses)
      .orderBy(courses.createdAt);
    return data.map((c) => ({
      id: c.id,
      title: c.title,
      subtitle: c.subtitle ?? '',
      description: c.description,
      image: c.image ?? '',
      badge: c.badge,
      startDate: c.startDate ?? '',
      enrollmentDeadline: c.enrollmentDeadline ?? '',
      modality: c.modality ?? c.badge,
      slug: c.slug ?? c.id,
      schedule: c.schedule ?? '',
      location: c.location ?? '',
      teacher: c.teacher ?? '',
      teachers: (c.teachers as any[]) ?? [],
      duration: c.duration ?? '',
      price: c.price ?? '',
      requirements: c.requirements != null ? String(c.requirements) : '',
      objective: c.objective ?? '',
      methodology: c.methodology ?? '',
      finalProject: c.finalProject ?? '',
      whatsappGroup: c.whatsappGroup ?? '',
      level: c.level ?? 'PRINCIPIANTE',
      modules: (c.modules as any[]) ?? [],
      status: c.status,
      category: c.category,
      maxStudents: c.maxStudents,
    }));
  } catch {
    return [];
  }
}

export default async function Home() {
  const [slides, initialCourses] = await Promise.all([
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
        <CoursesSection initialCourses={initialCourses} />
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
