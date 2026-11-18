import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Award, Building2, GraduationCap, Hammer, Rocket, Target, Users, BookOpen } from 'lucide-react';
import type { Course } from '@/context/CoursesContext';
import CourseCard from './course-card';
import { BoomObserver } from './boom-observer';

const D = '[font-family:var(--font-display)]';
const COLORS = ['#FFC531', '#FF6FA8', '#2FD3A0', '#9cbadb'];
const SPARKS = [0, 45, 90, 135, 180, 225, 270, 315];

// Cinta inclinada con los nombres de las formaciones, en el color de la escuela.
export function Marquee({ items }: { items: string[] }) {
  const unique = [...new Set(items.map((t) => t.trim()).filter(Boolean))];
  if (unique.length === 0) return null;
  // Con pocos cursos se repiten para que la cinta llene el ancho.
  const list = Array.from({ length: Math.ceil(10 / unique.length) }, () => unique).flat();
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden}>
      {list.map((t, i) => (
        <li key={i} className="flex items-center">
          <span className={`whitespace-nowrap px-6 text-3xl font-extrabold tracking-tight sm:text-5xl ${D}`}>{t}</span>
          <span className="size-4 rounded-full border-2 border-current" style={{ background: COLORS[i % COLORS.length] }} aria-hidden />
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Formaciones" className="marquee mt-6 -rotate-2 overflow-hidden border-y-2 border-[#031e41] bg-[var(--accent)] py-5 text-[var(--accent-ink)]">
      <div className="marquee-track flex w-max">{row()}{row(true)}</div>
    </section>
  );
}

export function UpcomingCourses({ courses, base }: { courses: Course[]; base: string }) {
  if (courses.length === 0) return null;
  return (
    <section id="formaciones" className="mx-auto max-w-7xl scroll-mt-20 px-5 pt-24 sm:px-8 sm:pt-32">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <h2 className={`max-w-xl text-4xl font-extrabold tracking-tight sm:text-6xl ${D}`}>Próximas formaciones</h2>
          <p className="mt-3 text-lg text-slate-600">Inscripciones abiertas. Tocá una para ver horarios y cupos.</p>
        </div>
        <Link href={`${base}/catalogo-formaciones`} className="inline-flex items-center gap-2 self-start rounded-full border-2 border-[#031e41] bg-white px-5 py-3 font-bold transition hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] sm:self-auto">
          Ver catálogo completo <ArrowRight size={17} />
        </Link>
      </div>
      {/* Celular: carrusel que se desliza de a una. Desde sm: grilla. */}
      <ul className="-mx-5 mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[10%] pb-8 pt-8 [scrollbar-width:none] sm:mx-0 sm:mt-12 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-x-7 sm:gap-y-12 sm:overflow-visible sm:p-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
        {courses.map((c, i) => (
          <li key={c.id} className="w-[80%] shrink-0 snap-center sm:w-auto">
            <CourseCard course={c} href={`${base}/cursos/${c.slug || c.id}`} priority={i < 3} index={i} />
          </li>
        ))}
      </ul>
      {courses.length > 1 && <p className="text-center text-sm font-medium text-slate-500 sm:hidden">Deslizá para ver más</p>}
    </section>
  );
}

export function QuickLinks({ base }: { base: string }) {
  const small = [
    { href: `${base}/catalogo-formaciones`, icon: BookOpen, title: 'Nuestras formaciones', text: 'Explorá el catálogo completo y encontrá la que mejor se adapte a vos.', bg: '#FF6FA8' },
    { href: `${base}/trabaja-con-nosotros`, icon: GraduationCap, title: 'Trabajá con nosotros', text: '¿Sos graduado/a o estudiante avanzado/a? Postulate para dictar cursos o sumarte a nuestros proyectos.', bg: '#2FD3A0' },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8 sm:pt-32">
      <div className="grid gap-6 lg:grid-cols-3 lg:grid-rows-2">
        <Link
          href={`${base}/formaciones`}
          data-nav="dark"
          className="group relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[32px] border-2 border-[#031e41] bg-[#031e41] p-8 text-white shadow-[7px_7px_0_var(--accent)] transition duration-300 hover:-translate-y-1 hover:shadow-[10px_11px_0_var(--accent)] sm:p-10 lg:row-span-2"
          style={{ backgroundImage: 'radial-gradient(rgb(255 255 255 / .08) 1.4px, transparent 1.6px)', backgroundSize: '26px 26px' }}
        >
          <span className="flex size-14 items-center justify-center rounded-full border-2 border-white bg-[var(--accent)] text-[var(--accent-ink)] transition duration-500 group-hover:rotate-12"><Building2 size={26} /></span>
          <div>
            <h3 className={`text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl ${D}`}>Llevá SEA a tu institución</h3>
            <p className="mt-4 max-w-sm text-white/70">Creamos tu Centro de Formación junto a la Secretaría de Extensión Académica.</p>
            <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#031e41]">Conocer la propuesta <ArrowUpRight size={16} className="transition group-hover:rotate-45" /></span>
          </div>
        </Link>
        {small.map(({ href, icon: Icon, title, text, bg }) => (
          <Link key={href} href={href} className="group flex items-start gap-5 rounded-[28px] border-2 border-[#031e41] bg-white p-7 shadow-[6px_6px_0_#031e41] transition duration-300 hover:-translate-y-1 hover:shadow-[9px_10px_0_#031e41] lg:col-span-2">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-[#031e41] transition duration-500 group-hover:-rotate-12" style={{ background: bg }}><Icon size={24} /></span>
            <div className="flex-1">
              <h3 className={`text-2xl font-extrabold tracking-tight ${D}`}>{title}</h3>
              <p className="mt-2 text-slate-600">{text}</p>
            </div>
            <ArrowUpRight className="shrink-0 transition duration-300 group-hover:rotate-45" />
          </Link>
        ))}
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
    <section className="px-3 pt-24 sm:px-6 sm:pt-32">
      <div
        data-nav="dark"
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-[#031e41] px-6 py-16 text-white sm:px-14 sm:py-20"
        style={{ backgroundImage: 'radial-gradient(rgb(255 255 255 / .08) 1.4px, transparent 1.6px)', backgroundSize: '26px 26px' }}
      >
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <h2 className={`text-balance text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl ${D}`}>Más que cursos, una transformación profesional</h2>
            <p className="mt-6 max-w-md text-lg text-white/70">Aprendés haciendo, con docentes de la industria y en grupos donde nadie queda atrás.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="reveal group rounded-[24px] bg-white/[0.07] p-7 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.12]">
                <span className="flex size-12 items-center justify-center rounded-full border-2 border-white text-[#031e41] transition duration-500 group-hover:rotate-12 group-hover:scale-110" style={{ background: COLORS[i] }}><Icon size={22} /></span>
                <h3 className={`mt-6 text-2xl font-bold ${D}`}>{title}</h3>
                <p className="mt-2 leading-relaxed text-white/70">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Mismo efecto que "Así llegamos a tu escuela" en la landing: al entrar en pantalla cada paso estalla de corrido.
export function Journey() {
  const steps = [
    { icon: BookOpen, title: 'Aprendé', text: 'Clases guiadas y materiales creados por profesionales de la industria.' },
    { icon: Hammer, title: 'Practicá', text: 'Aplicás lo aprendido en ejercicios y desafíos del mundo real.' },
    { icon: Rocket, title: 'Construí', text: 'Creás proyectos de portfolio que muestran lo que sabés hacer.' },
    { icon: Award, title: 'Certificá', text: 'Obtenés tu certificación y das el siguiente paso profesional.' },
  ];
  return (
    <section className="boom-pin relative">
      <BoomObserver />
      <div className="boom-stage mx-auto max-w-7xl px-5 pt-24 sm:px-8 sm:pt-32">
        <h2 className={`max-w-2xl text-4xl font-extrabold tracking-tight sm:text-6xl ${D}`}>Nuestra ruta de aprendizaje</h2>
        <p className="mt-3 max-w-xl text-lg text-slate-600">Un camino probado para construir habilidades reales y confianza.</p>
        <ol className="relative mt-10 grid gap-7 sm:mt-14 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-6">
          <span aria-hidden className="boom-line absolute left-8 right-8 top-8 hidden border-t-[3px] border-dashed border-[#031e41]/25 lg:block" />
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="boom-step relative flex items-start gap-5 sm:block" style={{ ['--i' as string]: i }}>
              {/* Celular: tramo de línea hasta el paso siguiente; el relleno avanza con el scroll */}
              {i < steps.length - 1 && <span aria-hidden className="absolute -bottom-7 left-8 top-16 border-l-[3px] border-dashed border-[#031e41]/25 sm:hidden"><span className="boom-fill absolute -left-[3px] top-0 h-full w-[3px] rounded-full bg-[#031e41]" /></span>}
              <span className="relative block size-16 shrink-0">
                <span aria-hidden className="boom-ring absolute inset-0 rounded-full border-4" style={{ borderColor: i % 2 ? COLORS[i] : 'var(--accent)' }} />
                {SPARKS.map((a, k) => (
                  <span key={a} aria-hidden className="boom-spark absolute left-1/2 top-1/2 h-6 w-2.5 rounded-full" style={{ ['--a' as string]: `${a}deg`, background: k % 2 ? 'var(--accent)' : COLORS[(k + i) % COLORS.length] }} />
                ))}
                <span className="boom-num relative flex size-16 items-center justify-center rounded-full border-2 border-[#031e41] shadow-[3px_3px_0_#031e41]" style={{ background: i % 2 ? COLORS[i] : 'var(--accent)', color: i % 2 ? '#031e41' : 'var(--accent-ink)' }}>
                  <Icon size={26} strokeWidth={2.2} />
                </span>
              </span>
              <div className="boom-text">
                <h3 className={`mt-1 text-xl font-bold tracking-tight sm:mt-6 sm:text-2xl ${D}`}>{title}</h3>
                <p className="mt-1.5 max-w-xs leading-relaxed text-slate-600 sm:mt-2">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
