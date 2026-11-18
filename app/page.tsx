import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Bot, Box, Check, Cog, Cpu, Flame, Gamepad2, Mail, MessageCircle, Smartphone, Sparkles, Wrench, Zap, type LucideIcon } from 'lucide-react';
import { CourseWall, Faq, LandingNav } from '@/components/landing/client';
import { LandingFooter } from '@/components/landing/footer';
import { D, EMAIL, JOIN, display, loadCatalog, pegboard } from '@/lib/landing';

export const dynamic = 'force-dynamic'; // lista los clientes activos y sus cursos: nunca se congela en el build

export const metadata: Metadata = {
  title: 'Portal SEA · Cursos extracurriculares de tecnología y oficios para tu escuela',
  description: 'Llevamos cursos de robótica, programación, electricidad, soldadura y más a tu escuela: docentes, programa, inscripciones y certificados.',
};

const STEPS = [
  { title: 'Charlamos', text: 'Nos contás cómo es tu escuela y qué cursos le interesan a tu comunidad.', bg: '#FFC531' },
  { title: 'Armamos la propuesta', text: 'Elegimos juntos los cursos, los horarios y los docentes.', bg: '#FF6FA8' },
  { title: 'Abrimos inscripciones', text: 'Tu escuela tiene su página en el portal, con los cursos y la inscripción online.', bg: '#2FD3A0' },
  { title: 'Dictamos y certificamos', text: 'Nuestros docentes dan las clases y cada estudiante recibe su constancia.', bg: '#9cbadb' },
];

// Dibujito de cada curso según su nombre. shortcut: por palabras clave; un curso sin coincidencia usa la llave inglesa.
const ICONS: [RegExp, LucideIcon][] = [
  [/robot/, Bot], [/videojuego|juego/, Gamepad2], [/arduino|electron/, Cpu], [/aplicacion|app/, Smartphone],
  [/3d|impresion/, Box], [/soldad/, Flame], [/electric/, Zap], [/mecanic|motor/, Cog], [/\bia\b|inteligencia/, Sparkles],
];
const iconFor = (title: string) => {
  const t = title.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  return ICONS.find(([re]) => re.test(t))?.[1] ?? Wrench;
};
const TILE = ['#ffffff', '#FF6FA8', '#2FD3A0', '#9cbadb'];

const SPARKS = [0, 45, 90, 135, 180, 225, 270, 315];

const INCLUDES = [
  'Docentes con experiencia en cada área',
  'Programa de cada curso, clase por clase',
  'La página de tu escuela, con tu logo y tus cursos',
  'Inscripciones online con cupos por horario',
  'Certificados para cada estudiante',
];

const FAQS = [
  { q: '¿Qué necesita mi escuela para empezar?', a: 'Una reunión inicial. A partir de lo que charlemos armamos la propuesta: qué cursos, en qué horarios y con qué docentes. La página y las inscripciones las preparamos nosotros.' },
  { q: '¿Quién dicta los cursos?', a: 'Docentes de nuestro equipo, con experiencia en cada área. También podés sumar a graduados y docentes de tu propia escuela.' },
  { q: '¿Los cursos se cruzan con las clases?', a: 'No. Son extracurriculares: se dictan aparte del horario de clases de la escuela.' },
  { q: '¿Para quién son?', a: 'Para toda la comunidad de tu escuela: estudiantes, familias, graduados y vecinos.' },
  { q: '¿Se entregan certificados?', a: 'Sí. Cada curso cierra con una constancia que respalda lo aprendido.' },
  { q: '¿Puedo ver cómo funciona en otra escuela?', a: 'Sí. El Instituto Domingo Savio y el ITS Villada ya dictan nuestros cursos: podés entrar a sus páginas desde esta misma web.' },
];

export default async function LandingPage() {
  const { schools, catalog } = await loadCatalog();
  const courses = catalog.map((c) => ({ key: c.slug, title: c.title, href: `/capacitaciones/${c.slug}`, image: c.image, area: c.area }));

  return (
    <div className={`${display.variable} bg-[#F7FAFD] text-[#031e41]`}>
      <LandingNav />
      <main>
        {/* Hero: tablero de taller */}
        <section className="relative flex min-h-[92svh] items-center justify-center overflow-hidden bg-[#EAF2FB] px-5 pb-24 pt-36 sm:px-8" style={pegboard}>
          <div className="relative mx-auto max-w-4xl text-center">
            <h1 className={`rise text-balance text-[clamp(3.2rem,11vw,8.5rem)] font-extrabold leading-[0.9] tracking-[-0.045em] ${D}`}>
              Acá se aprende haciendo
            </h1>
            <p className="rise mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-[#031e41]/75 sm:text-xl" style={{ animationDelay: '.12s' }}>
              Llevamos cursos extracurriculares de tecnología y oficios a tu escuela. Nosotros ponemos los docentes y el programa; tu escuela, el espacio y la comunidad.
            </p>
            <div className="rise mt-9 flex flex-wrap justify-center gap-3" style={{ animationDelay: '.2s' }}>
              <a href={JOIN} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-[#031e41] bg-[#031e41] px-7 py-4 font-bold text-white shadow-[4px_4px_0_#FFC531] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#FFC531] active:translate-y-0 active:shadow-none">
                <MessageCircle size={18} /> Quiero cursos en mi escuela
              </a>
              <a href="#cursos" className="inline-flex items-center rounded-full border-2 border-[#031e41] bg-white px-7 py-4 font-bold transition hover:bg-[#FFC531]">
                Ver capacitaciones
              </a>
            </div>
          </div>
        </section>

        {/* Cinta con las capacitaciones */}
        {catalog.length > 0 && (
          <section aria-label="Capacitaciones" className="marquee my-20 -rotate-2 overflow-hidden border-y-2 border-[#031e41] bg-[#FFC531] py-5 sm:my-28">
            <div className="marquee-track flex w-max">
              {[false, true].map((hidden) => (
                <ul key={String(hidden)} className="flex shrink-0 items-center" aria-hidden={hidden}>
                  {Array.from({ length: Math.ceil(10 / catalog.length) }, () => catalog).flat().map((c, i) => (
                    <li key={i} className="flex items-center">
                      <span className={`whitespace-nowrap px-6 text-3xl font-extrabold tracking-tight sm:text-5xl ${D}`}>{c.title}</span>
                      <span className="size-4 rounded-full border-2 border-[#031e41]" style={{ background: ['#FF6FA8', '#2FD3A0', '#3D6BFF', '#fff'][i % 4] }} aria-hidden />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </section>
        )}

        {/* Capacitaciones */}
        <section id="cursos" className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className={`max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl ${D}`}>Capacitaciones que dictamos en tu escuela</h2>
          <p className="mt-4 max-w-xl text-lg text-slate-600">Tecnología y oficios, con docentes de nuestro equipo. Tocá una para ver de qué se trata.</p>
          <CourseWall courses={courses} />
        </section>

        {/* Cómo funciona: es una secuencia real, por eso va numerada */}
        <section id="como" className="mx-auto max-w-7xl px-5 pt-28 sm:px-8 sm:pt-36">
          <h2 className={`max-w-2xl text-4xl font-extrabold tracking-tight sm:text-6xl ${D}`}>Así llegamos a tu escuela</h2>
          <ol className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <span aria-hidden className="boom-line absolute left-8 right-8 top-8 hidden border-t-[3px] border-dashed border-[#031e41]/25 lg:block" />
            {STEPS.map((s, i) => (
              <li key={s.title} className="boom-step relative" style={{ ['--i' as string]: i }}>
                {/* Número con onda expansiva y chispas (animaciones en globals.css, atadas al scroll) */}
                <span className="relative block size-16">
                  <span aria-hidden className="boom-ring absolute inset-0 rounded-full border-4" style={{ borderColor: s.bg }} />
                  {SPARKS.map((a, k) => (
                    <span
                      key={a}
                      aria-hidden
                      className="boom-spark absolute left-1/2 top-1/2 h-6 w-2.5 rounded-full"
                      style={{ ['--a' as string]: `${a}deg`, background: ['#FFC531', '#FF6FA8', '#2FD3A0', '#3D6BFF'][(k + i) % 4] }}
                    />
                  ))}
                  <span className={`boom-num relative flex size-16 items-center justify-center rounded-full border-2 border-[#031e41] text-2xl font-extrabold shadow-[3px_3px_0_#031e41] ${D}`} style={{ background: s.bg }}>{i + 1}</span>
                </span>
                <div className="boom-text">
                  <h3 className={`mt-6 text-2xl font-bold tracking-tight ${D}`}>{s.title}</h3>
                  <p className="mt-2 max-w-xs leading-relaxed text-slate-600">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Escuelas que ya trabajan con nosotros */}
        <section id="instituciones" className="mx-auto max-w-7xl px-5 pt-28 sm:px-8 sm:pt-36">
          <h2 className={`max-w-2xl text-4xl font-extrabold tracking-tight sm:text-6xl ${D}`}>Escuelas que ya los dictan</h2>
          <p className="mt-4 max-w-xl text-lg text-slate-600">Así se ve el Centro de Formación de cada una. Entrá y mirá cómo funciona.</p>
          <ul className={`mt-12 grid gap-8 ${schools.length > 1 ? 'md:grid-cols-2' : ''}`}>
            {schools.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/${s.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[32px] border-2 border-[#031e41] p-7 shadow-[7px_7px_0_#031e41] transition duration-300 hover:-translate-y-1 hover:shadow-[10px_11px_0_#031e41] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#3D6BFF] sm:p-9"
                  style={{ background: s.color.bg, color: s.color.fg }}
                >
                  <span className="flex h-20 w-32 items-center justify-center rounded-2xl border-2 border-[#031e41] bg-white p-3">
                    <Image src={s.config.logo} alt="" width={120} height={64} className="max-h-full w-auto object-contain" />
                  </span>
                  <span className={`mt-8 block text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl ${D}`}>{s.name}</span>
                  <span className="mt-2 block text-lg opacity-80">
                    {s.count === 0 ? 'Cursos en preparación' : `${s.count} ${s.count === 1 ? 'curso' : 'cursos'} en marcha`}
                  </span>
                  <span className="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-6 pt-10">
                    {/* Dibujitos de lo que se dicta en esa escuela */}
                    <span className="flex items-center -space-x-3" aria-hidden>
                      {s.topics.slice(0, 4).map((t, k) => {
                        const Icon = iconFor(t);
                        return (
                          <span key={t} title={t} className="flex size-16 items-center justify-center rounded-2xl border-[3px] border-white text-[#031e41] shadow-lg transition duration-300 group-hover:rotate-0 sm:size-20" style={{ background: TILE[k % TILE.length], transform: `rotate(${[-8, 4, -3, 9][k]}deg)` }}>
                            <Icon className="size-8 sm:size-10" strokeWidth={2} />
                          </span>
                        );
                      })}
                      {s.topics.length > 4 && (
                        <span className="flex size-12 items-center justify-center rounded-full border-[3px] border-white bg-[#031e41] text-sm font-bold text-white shadow-lg">+{s.topics.length - 4}</span>
                      )}
                    </span>
                    <span className="shrink-0 rounded-full border-2 border-[#031e41] bg-white px-5 py-3 font-bold text-[#031e41] transition group-hover:bg-[#031e41] group-hover:text-white">
                      Ver su página
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Sumá tu escuela */}
        <section id="sumate" className="px-3 pt-28 sm:px-6 sm:pt-36">
          <div data-nav="dark" className="relative mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-[#031e41] px-6 py-16 text-white sm:px-14 sm:py-20" style={{ backgroundImage: 'radial-gradient(rgb(255 255 255 / .09) 1.4px, transparent 1.6px)', backgroundSize: '26px 26px' }}>
            <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
              <div>
                <h2 className={`text-balance text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl ${D}`}>Llevemos estos cursos a tu escuela</h2>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/70">
                  Hacemos con tu escuela lo mismo que con Savio y Villada: un Centro de Formación propio, con cursos extracurriculares abiertos a toda la comunidad.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <a href={JOIN} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#FFC531] px-7 py-4 font-bold text-[#031e41] transition hover:-translate-y-0.5 hover:bg-[#ffd560]">
                    <MessageCircle size={18} /> Escribinos por WhatsApp
                  </a>
                  <a href={`mailto:${EMAIL}`} className="inline-flex min-w-0 items-center gap-2 rounded-full border-2 border-white/30 px-7 py-4 font-bold transition hover:bg-white/10">
                    <Mail size={18} className="shrink-0" /> <span className="truncate">{EMAIL}</span>
                  </a>
                </div>
              </div>
              <ul className="space-y-3">
                {INCLUDES.map((t, i) => (
                  <li key={t} className="flex items-center gap-4 rounded-2xl bg-white/[0.07] px-5 py-4 ring-1 ring-white/10 lg:ml-[var(--off)]" style={{ ['--off' as string]: `${[0, 24, 8, 32, 12][i]}px` }}>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#031e41]" style={{ background: ['#FFC531', '#FF6FA8', '#2FD3A0', '#9cbadb', '#fff'][i] }}><Check size={17} strokeWidth={3} /></span>
                    <span className="font-medium">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Preguntas */}
        <section id="faq" className="mx-auto grid max-w-7xl gap-12 px-5 py-28 sm:px-8 sm:py-36 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className={`text-4xl font-extrabold tracking-tight sm:text-6xl ${D}`}>Preguntas que nos hacen seguido</h2>
            <p className="mt-5 text-lg text-slate-600">¿Te quedó otra? <a href={JOIN} target="_blank" rel="noopener noreferrer" className="font-semibold underline decoration-[#FFC531] decoration-4 underline-offset-4">Escribinos</a></p>
          </div>
          <Faq items={FAQS} />
        </section>
      </main>
      <LandingFooter schools={schools} />
    </div>
  );
}
