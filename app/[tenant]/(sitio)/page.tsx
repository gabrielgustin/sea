import Hero, { type Slide } from '@/components/home/hero';
import { Marquee, UpcomingCourses, QuickLinks, Benefits, Journey } from '@/components/home/sections';
import { CtaBand, Faq, Contact } from '@/components/home/interactive';
import { tenantDb } from '@/lib/tenants/db';
import { listSlides } from '@/lib/data/carousel';
import { listCourses } from '@/lib/data/courses';
import type { Course } from '@/context/CoursesContext';
import { PlatformSection } from '@/components/platform-section';

export default async function Home({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const { db, tenant } = await tenantDb(slug);
  const [slides, all] = await Promise.all([listSlides(db, { activeOnly: true }), listCourses(db)]);
  const courses = all as unknown as Course[];
  const base = `/${slug}`;

  return (
    <>
      <Hero
        slides={slides as unknown as Slide[]}
        schoolName={tenant.name}
        catalogHref={`${base}/catalogo-formaciones`}
        courseCount={courses.filter((c) => c.showOnHome).length}
      />
      <Marquee items={courses.filter((c) => c.showOnHome).map((c) => c.title)} />
      <UpcomingCourses courses={courses.filter((c) => c.showOnHome)} base={base} />
      {/* Carta de presentación para estudiantes y familias: se inscriben desde esta página */}
      <PlatformSection audience="alumnos" />
      <QuickLinks base={base} />
      <Benefits schoolName={tenant.name} />
      <Journey />
      <CtaBand />
      <Faq />
      <Contact />
    </>
  );
}
