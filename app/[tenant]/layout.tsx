import { SchoolProvider } from '@/components/school-provider';
import { tenantDb } from '@/lib/tenants/db';
import { getTenant, toPublic } from '@/lib/tenants/registry';
import { getSession } from '@/lib/auth/session';
import { listCourses } from '@/lib/data/courses';
import { getSettings } from '@/lib/data/settings';
import { defaultFAQs, defaultSettings, type FAQ, type SiteSettings } from '@/lib/default-settings';
import type { Course } from '@/context/CoursesContext';

export async function generateMetadata({ params }: { params: Promise<{ tenant: string }> }) {
  const t = await getTenant((await params).tenant);
  return { title: t ? `${t.name} - Formaciones` : 'Portal SEA', description: 'Programas de formación de calidad' };
}

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const { tenant, db } = await tenantDb(slug); // 404 si el cliente no existe o está dado de baja

  // Todo en paralelo: la página llega renderizada con sus datos, sin esperar fetch en el navegador.
  const [session, courses, saved] = await Promise.all([getSession(slug), listCourses(db), getSettings(db)]);

  let faqs: FAQ[] = defaultFAQs;
  try {
    const parsed = saved.faqs ? JSON.parse(saved.faqs) : null;
    if (Array.isArray(parsed)) faqs = parsed;
  } catch {}
  const { faqs: _faqs, ...rest } = saved;
  const settings = { ...defaultSettings, ...rest } as SiteSettings;

  return (
    <SchoolProvider
      tenant={toPublic(tenant)}
      session={{ role: session?.role ?? null, dni: session?.dni, course: session?.course }}
      courses={courses as unknown as Course[]}
      settings={settings}
      faqs={faqs}
    >
      {children}
    </SchoolProvider>
  );
}
