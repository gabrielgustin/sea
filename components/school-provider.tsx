'use client';

import { CoursesProvider, type Course } from '@/context/CoursesContext';
import { AuthProvider, type InitialSession } from '@/context/AuthContext';
import { SchoolProvider as SchoolContextProvider } from '@/context/SchoolContext';
import { SiteSettingsProvider } from '@/context/SiteSettingsContext';
import type { PublicTenant } from '@/lib/tenants/types';
import type { SiteSettings, FAQ } from '@/lib/default-settings';

export function SchoolProvider(props: {
  children: React.ReactNode;
  tenant: PublicTenant;
  session: InitialSession;
  courses: Course[];
  settings: SiteSettings;
  faqs: FAQ[];
}) {
  const { tenant } = props;
  return (
    <SchoolContextProvider tenant={tenant}>
      <AuthProvider schoolId={tenant.slug} initialSession={props.session}>
        <CoursesProvider schoolId={tenant.slug} initialCourses={props.courses}>
          <SiteSettingsProvider schoolId={tenant.slug} initialSettings={props.settings} initialFaqs={props.faqs}>
            {props.children}
          </SiteSettingsProvider>
        </CoursesProvider>
      </AuthProvider>
    </SchoolContextProvider>
  );
}
