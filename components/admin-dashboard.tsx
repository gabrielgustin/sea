'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, ExternalLink, HelpCircle, Images, LogOut, Settings, Users, type LucideIcon } from 'lucide-react';
import { useCourses, Course } from '@/context/CoursesContext';
import { useAuth } from '@/context/AuthContext';
import { useSchool } from '@/context/SchoolContext';
import { DISPLAY, themeProps } from '@/components/admin/ui';
import { cn } from '@/lib/utils';
import CourseForm from './course-form';
import { CourseList } from './course-list';
import { CarouselManager } from './carousel-manager';
import FAQManager from './faq-manager';
import SettingsManager from './settings-manager';
import { TeacherManager } from './teacher-manager';

// Secciones del panel. Cada una tiene su dirección (?seccion=…): recargar o ir atrás te deja donde estabas.
const SECTIONS: { id: string; label: string; icon: LucideIcon; title: string; text: string }[] = [
  { id: 'cursos', label: 'Cursos', icon: BookOpen, title: 'Cursos', text: 'Creá, editá y ordená las formaciones que se ven en el sitio.' },
  { id: 'carrusel', label: 'Carrusel', icon: Images, title: 'Carrusel del inicio', text: 'Las fotos y los textos que aparecen al entrar al sitio.' },
  { id: 'docentes', label: 'Docentes', icon: Users, title: 'Docentes', text: 'Quiénes dictan cada curso.' },
  { id: 'preguntas', label: 'Preguntas', icon: HelpCircle, title: 'Preguntas frecuentes', text: 'Las dudas que se responden en el inicio del sitio.' },
  { id: 'configuracion', label: 'Configuración', icon: Settings, title: 'Configuración', text: 'WhatsApp, enlaces y datos de contacto del sitio.' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const params = useSearchParams();
  const { logout } = useAuth();
  const { tenant } = useSchool();
  const { addCourse, updateCourse, schoolId } = useCourses();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState(false);

  const section = SECTIONS.find((s) => s.id === params.get('seccion')) ?? SECTIONS[0];
  const theme = themeProps(tenant.config);

  // pushState nativo: Next actualiza useSearchParams sin volver a pedir la página al servidor.
  const go = (id: string) => {
    setCourseForm(false);
    window.history.pushState(null, '', `?seccion=${id}`);
    window.scrollTo({ top: 0 });
  };

  const handleLogout = async () => {
    await logout();
    router.push(`/${schoolId}`);
  };

  const closeForm = () => {
    setCourseForm(false);
    setEditingCourse(null);
  };

  const handleSave = async (courseData: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    try {
      if (editingCourse) await updateCourse(editingCourse.id, courseData);
      else await addCourse(courseData);
      closeForm(); // vuelve a la lista, que ya tiene los datos nuevos (sin recargar la página)
    } catch (err) {
      console.error('[admin] handleSave error:', err);
      alert('Error al guardar el curso: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    }
  };

  const logos = (
    <span className="flex items-center gap-2.5">
      <Image src="/logo-sea.svg" alt="SEA" width={40} height={40} className="size-10" />
      <span className="h-7 w-px bg-[#031e41]/15" aria-hidden />
      <Image src={tenant.config.logo} alt={tenant.config.logoAlt} width={110} height={40} className="h-9 w-auto max-w-[110px] object-contain" />
    </span>
  );

  return (
    <div {...theme} className={cn(theme.className, 'min-h-screen bg-[#F7FAFD] text-[#031e41] lg:flex')}>
      {/* Escritorio: menú lateral fijo */}
      <aside className="sticky top-0 hidden h-screen w-[268px] shrink-0 flex-col border-r-2 border-[#031e41] bg-white lg:flex">
        <div className="border-b-2 border-[#031e41]/10 px-5 py-5">
          {logos}
          <p className="mt-3 truncate text-sm font-semibold text-[#031e41]/60">{tenant.name}</p>
        </div>
        <nav aria-label="Secciones del panel" className="flex-1 space-y-1 overflow-y-auto p-3">
          {SECTIONS.map((s) => {
            const active = s.id === section.id;
            return (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex w-full items-center gap-3 rounded-2xl border-2 px-3.5 py-2.5 text-left font-semibold transition',
                  active
                    ? 'border-[#031e41] bg-[var(--accent)] text-[var(--accent-ink)] shadow-[3px_3px_0_#031e41]'
                    : 'border-transparent hover:bg-[#031e41]/[0.05]',
                )}
              >
                <s.icon size={19} aria-hidden /> {s.label}
              </button>
            );
          })}
        </nav>
        <div className="space-y-1 border-t-2 border-[#031e41]/10 p-3">
          <Link href={`/${schoolId}`} target="_blank" className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 font-semibold transition hover:bg-[#031e41]/[0.05]">
            <ExternalLink size={19} aria-hidden /> Ver sitio
          </Link>
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left font-semibold text-[#b42318] transition hover:bg-[#fef3f2]">
            <LogOut size={19} aria-hidden /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Celular y tablet: encabezado con accesos y secciones deslizables */}
      <header className="sticky top-0 z-30 border-b-2 border-[#031e41] bg-white lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          {logos}
          <span className="flex items-center gap-1.5">
            <Link href={`/${schoolId}`} target="_blank" aria-label="Ver sitio" className="flex size-10 items-center justify-center rounded-full border-2 border-[#031e41] bg-white">
              <ExternalLink size={17} />
            </Link>
            <button onClick={handleLogout} aria-label="Cerrar sesión" className="flex size-10 items-center justify-center rounded-full border-2 border-[#b42318] bg-white text-[#b42318]">
              <LogOut size={17} />
            </button>
          </span>
        </div>
        <nav aria-label="Secciones del panel" className="flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SECTIONS.map((s) => {
            const active = s.id === section.id;
            return (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-full border-2 px-3.5 py-2 text-sm font-semibold transition',
                  active ? 'border-[#031e41] bg-[var(--accent)] text-[var(--accent-ink)]' : 'border-[#031e41]/15 bg-white',
                )}
              >
                <s.icon size={16} aria-hidden /> {s.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7">
            <h1 className={`text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl ${DISPLAY}`}>{section.title}</h1>
            <p className="mt-1.5 text-[#031e41]/60">{section.text}</p>
          </div>

          {section.id === 'cursos' && !courseForm && (
            <CourseList
              onEdit={(course: Course) => { setEditingCourse(course); setCourseForm(true); }}
              onNew={() => { setEditingCourse(null); setCourseForm(true); }}
            />
          )}
          {section.id === 'cursos' && courseForm && (
            <CourseForm course={editingCourse || undefined} onSave={handleSave} onCancel={closeForm} />
          )}
          {section.id === 'carrusel' && <CarouselManager />}
          {section.id === 'docentes' && <TeacherManager />}
          {section.id === 'preguntas' && <FAQManager />}
          {section.id === 'configuracion' && <SettingsManager />}
        </div>
      </main>
    </div>
  );
}
