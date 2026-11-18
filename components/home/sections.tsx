import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Award, Building2, GraduationCap, Hammer, Rocket, Target, Users, BookOpen } from 'lucide-react';
import type { Course } from '@/context/CoursesContext';
import CourseCard from './course-card';
import { SpotlightLink } from './interactive';

function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${light ? 'text-[#9cbadb]' : 'text-[#031e41]/60'}`}>
      <span className={`h-px w-6 ${light ? 'bg-[#9cbadb]' : 'bg-[#031e41]/40'}`} />
      {children}
    </p>
  );
}

// Cinta infinita con los nombres de las formaciones.
export function Marquee({ items }: { items: string[] }) {
  const unique = [...new Set(items.map((t) => t.trim()).filter(Boolean))];
  if (unique.length === 0) return null;
  // Con pocos cursos se repiten para que la cinta llene el ancho.
  const list = Array.from({ length: Math.ceil(8 / unique.length) }, () => unique).flat();
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden}>
      {list.map((t, i) => (
        <li key={i} className="flex items-center">
          <span className={`whitespace-nowrap px-6 text-3xl font-semibold tracking-tight sm:text-5xl ${i % 2 ? 'text-transparent [-webkit-text-stroke:1.2px_#031e41]' : 'text-[#031e41]'}`}>{t}</span>
          <span className="text-2xl text-[#9cbadb]" aria-hidden>✦</span>
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Formaciones" className="marquee overflow-hidden border-y border-slate-200/70 bg-white py-7 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div className="marquee-track flex w-max">{row()}{row(true)}</div>
    </section>
  );
}

export function UpcomingCourses({ courses, base }: { courses: Course[]; base: string }) {
  if (courses.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8 sm:pt-32">
      <div className="reveal flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <Eyebrow>Inscripciones abiertas</Eyebrow>
          <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Próximas formaciones</h2>
        </div>
        <Link href={`${base}/catalogo-formaciones`} className="group inline-flex items-center gap-2 self-start rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-[#031e41] transition hover:border-[#031e41] sm:self-auto">
          Ver catálogo completo <ArrowRight size={16} className="transition group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c, i) => (
          <CourseCard key={c.id} course={c} href={`${base}/cursos/${c.slug || c.id}`} priority={i < 3} />
        ))}
      </div>
    </section>
  );
}

export function QuickLinks({ base }: { base: string }) {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8 sm:pt-32">
      <div className="grid gap-5 lg:grid-cols-3 lg:grid-rows-2">
        <SpotlightLink href={`${base}/formaciones`} className="aurora reveal group flex min-h-[320px] flex-col justify-between rounded-[2rem] bg-[#031e41] p-8 text-white sm:p-10 lg:row-span-2">
          <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
          <span className="relative flex size-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur"><Building2 size={26} /></span>
          <div className="relative">
            <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">Llevá SEA a tu institución</h3>
            <p className="mt-4 max-w-sm text-white/65">Creamos tu Centro de Formación junto a la Secretaría de Extensión Académica.</p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#9cbadb]">Conocer la propuesta <ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
          </div>
        </SpotlightLink>
        <SpotlightLink href={`${base}/catalogo-formaciones`} className="reveal group flex items-start gap-5 rounded-[2rem] border border-slate-200 bg-white p-8 transition hover:border-[#9cbadb] lg:col-span-2">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#eef3f9] text-[#031e41]"><BookOpen size={26} /></span>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold tracking-tight text-slate-900">Nuestras formaciones</h3>
            <p className="mt-2 text-slate-500">Explorá el catálogo completo y encontrá la que mejor se adapte a vos.</p>
          </div>
          <ArrowUpRight className="shrink-0 text-slate-300 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#031e41]" />
        </SpotlightLink>
        <SpotlightLink href={`${base}/trabaja-con-nosotros`} className="reveal group flex items-start gap-5 rounded-[2rem] border border-slate-200 bg-white p-8 transition hover:border-[#9cbadb] lg:col-span-2">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#eef3f9] text-[#031e41]"><GraduationCap size={26} /></span>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold tracking-tight text-slate-900">Trabajá con nosotros</h3>
            <p className="mt-2 text-slate-500">¿Sos graduado/a o estudiante avanzado/a? Postulate para dictar cursos o sumarte a nuestros proyectos.</p>
          </div>
          <ArrowUpRight className="shrink-0 text-slate-300 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#031e41]" />
        </SpotlightLink>
      </div>
    </section>
  );
}

export function Benefits({ schoolName }: { schoolName: string }) {
  const items = [
    { icon: Award, title: 'Certificación oficial', text: `Todos los cursos cuentan con certificación oficial de ${schoolName}.` },
    { icon: Hammer, title: 'Formación práctica', text: 'Desde la primera clase empezás a hacer proyectos reales.' },
    { icon: Target, title: 'Proyectos reales', text: 'Trabajás en casos reales que después sumás a tu portfolio.' },
    { icon: Users, title: 'Grupos reducidos', text: 'Pocos estudiantes por clase para una atención personalizada.' },
  ];
  return (
    <section className="px-3 pt-24 sm:px-5 sm:pt-32">
      <div data-nav="dark" className="aurora relative mx-auto max-w-[96rem] rounded-[2.5rem] bg-[#031e41] px-5 py-20 text-white sm:px-8 sm:py-28">
        <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div className="reveal lg:sticky lg:top-32 lg:self-start">
            <Eyebrow light>Por qué elegirnos</Eyebrow>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Más que cursos, una transformación profesional.</h2>
            <p className="mt-6 max-w-md text-lg text-white/60">Aprendés haciendo, con docentes de la industria y en grupos donde nadie queda atrás.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map(({ icon: Icon, title, text }) => (
              <div key={title} className="reveal group rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.08]">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-[#9cbadb] text-[#031e41] transition duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]"><Icon size={22} /></span>
                <h3 className="mt-6 text-xl font-semibold">{title}</h3>
                <p className="mt-2 leading-relaxed text-white/60">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Journey() {
  const steps = [
    { icon: BookOpen, title: 'Aprendé', text: 'Clases guiadas y materiales creados por profesionales de la industria.' },
    { icon: Hammer, title: 'Practicá', text: 'Aplicás lo aprendido en ejercicios y desafíos del mundo real.' },
    { icon: Rocket, title: 'Construí', text: 'Creás proyectos de portfolio que muestran lo que sabés hacer.' },
    { icon: Award, title: 'Certificá', text: 'Obtenés tu certificación y das el siguiente paso profesional.' },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8 sm:pt-32">
      <div className="reveal mx-auto max-w-2xl text-center">
        <Eyebrow>Cómo aprendés</Eyebrow>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Nuestra ruta de aprendizaje</h2>
        <p className="mt-4 text-lg text-slate-500">Un camino probado para construir habilidades reales y confianza.</p>
      </div>
      <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
        {/* Línea que se completa al hacer scroll */}
        <span className="absolute left-7 top-7 hidden h-px w-[calc(100%-3.5rem)] bg-slate-200 md:block" aria-hidden />
        <span className="reveal-line absolute left-7 top-7 hidden h-px w-[calc(100%-3.5rem)] bg-[#031e41] md:block" aria-hidden />
        {steps.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="reveal relative flex gap-5 md:block">
            <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[#031e41] shadow-sm">
              <Icon size={22} />
            </span>
            <div className="md:mt-7">
              <p className="font-mono text-xs text-slate-400">0{i + 1}</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 leading-relaxed text-slate-500">{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
