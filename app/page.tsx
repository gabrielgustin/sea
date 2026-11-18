import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpenText, Bot, Box, ChartLine, Check, CircleCheck, ClipboardCheck, Cog, Cpu, Flame, Gamepad2, Mail, MessageCircle, MonitorPlay, Smartphone, Sparkles, Wrench, Zap, type LucideIcon } from 'lucide-react';
import { CourseWall, Faq, LandingNav } from '@/components/landing/client';
import { LandingFooter } from '@/components/landing/footer';
import { BoomObserver } from '@/components/home/boom-observer';
import { D, EMAIL, JOIN, display, loadCatalog, pegboard, shortTitle } from '@/lib/landing';

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

// Posición y giro de cada polaroid del collage del hero.
const POLA = [
  { pos: 'left-0 top-6 w-[54%]', rot: -7, z: 1 },
  { pos: 'right-0 top-0 w-[50%]', rot: 6, z: 2 },
  { pos: 'left-[1%] bottom-0 w-[52%]', rot: 4, z: 3 },
  { pos: 'right-0 bottom-12 w-[46%]', rot: -5, z: 4 },
];
const TAPE = ['#FFC531', '#FF6FA8', '#2FD3A0', '#9cbadb'];

const SPARKS = [0, 45, 90, 135, 180, 225, 270, 315];

// Plataforma de aprendizaje propia: lo que tiene cada estudiante durante la cursada.
const PLATFORM: { icon: LucideIcon; title: string; text: string; bg: string }[] = [
  { icon: MonitorPlay, title: 'Cada clase, a mano', text: 'Lo que se vio en el aula queda en la plataforma para repasarlo cuando quieran.', bg: '#FFC531' },
  { icon: ClipboardCheck, title: 'Tareas y entregas', text: 'Las consignas, las fechas y las entregas, todo en un mismo lugar.', bg: '#FF6FA8' },
  { icon: BookOpenText, title: 'Material de estudio', text: 'Apuntes, videos y recursos de cada curso, ordenados clase por clase.', bg: '#ffffff' },
  { icon: ChartLine, title: 'Evaluación y seguimiento', text: 'Evaluamos ahí mismo y seguimos el avance de cada estudiante.', bg: '#9cbadb' },
];

const INCLUDES = [
  'Docentes con experiencia en cada área',
  'Programa de cada curso, clase por clase',
  'Plataforma de aprendizaje con seguimiento de cada estudiante',
  'La página de tu escuela, con tu logo y tus cursos',
  'Inscripciones online con cupos por horario',
  'Certificados para cada estudiante',
];

const FAQS = [
  { q: '¿Qué necesita mi escuela para empezar?', a: 'Una reunión inicial. A partir de lo que charlemos armamos la propuesta: qué cursos, en qué horarios y con qué docentes. La página y las inscripciones las preparamos nosotros.' },
  { q: '¿Quién dicta los cursos?', a: 'Docentes de nuestro equipo, con experiencia en cada área. También podés sumar a graduados y docentes de tu propia escuela.' },
  { q: '¿Los cursos se cruzan con las clases?', a: 'No. Son extracurriculares: se dictan aparte del horario de clases de la escuela.' },
  { q: '¿Para quién son?', a: 'Para toda la comunidad de tu escuela: estudiantes, familias, graduados y vecinos.' },
  { q: '¿Cómo siguen las clases los estudiantes?', a: 'Durante la cursada cada estudiante tiene acceso a nuestra plataforma de aprendizaje: ahí están las clases, las tareas y el material de estudio. También es donde evaluamos y seguimos el avance de cada uno.' },
  { q: '¿Se entregan certificados?', a: 'Sí. Cada curso cierra con una constancia que respalda lo aprendido.' },
  { q: '¿Puedo ver cómo funciona en otra escuela?', a: 'Sí. El Instituto Domingo Savio y el ITS Villada ya dictan nuestros cursos: podés entrar a sus páginas desde esta misma web.' },
];

export default async function LandingPage() {
  const { schools, catalog } = await loadCatalog();
  // Collage del hero: alterna tecnología y oficio para que se vea la variedad.
  const withPic = catalog.filter((c) => c.image);
  const tec = withPic.filter((c) => c.area === 'tec');
  const ofi = withPic.filter((c) => c.area === 'ofi');
  const heroPics = [tec[1], ofi[1], ofi[0], tec[0]].map((c, i) => c ?? withPic[i]).filter(Boolean).slice(0, 4);
  const courses = catalog.map((c) => ({ key: c.slug, title: shortTitle(c.title), href: `/capacitaciones/${c.slug}`, image: c.image, area: c.area }));

  return (
    <div className={`${display.variable} bg-[#F7FAFD] text-[#031e41]`}>
      <LandingNav />
      <main>
        {/* Hero: lo que se vende, a la vista. Collage de fotos reales de los cursos. */}
        <section className="relative overflow-hidden bg-[#EAF2FB] px-5 pb-20 pt-32 sm:px-8 lg:flex lg:min-h-[100svh] lg:items-center lg:pb-16 lg:pt-28" style={pegboard}>
          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
            <div>
              <p className="rise inline-flex items-center gap-2.5 rounded-full border-2 border-[#031e41] bg-white px-4 py-2 text-sm font-semibold">
                <span className="relative flex size-2.5"><span className="absolute inset-0 animate-ping rounded-full bg-[#2FD3A0]" /><span className="relative size-2.5 rounded-full bg-[#2FD3A0]" /></span>
                Cursos extracurriculares para escuelas
              </p>
              <h1 className={`rise mt-7 text-balance text-[clamp(3.1rem,8vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.045em] ${D}`} style={{ animationDelay: '.06s' }}>
                Acá se aprende haciendo
              </h1>
              <p className="rise mt-7 max-w-xl text-lg leading-relaxed text-[#031e41]/75 sm:text-xl" style={{ animationDelay: '.12s' }}>
                Llevamos cursos de tecnología y oficios a tu escuela. Nosotros ponemos los docentes y el programa; tu escuela, el espacio y la comunidad.
              </p>
              <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: '.18s' }}>
                <a href={JOIN} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-[#031e41] bg-[#031e41] px-7 py-4 font-bold text-white shadow-[4px_4px_0_#FFC531] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#FFC531] active:translate-y-0 active:shadow-none">
                  <MessageCircle size={18} /> Quiero cursos en mi escuela
                </a>
                <a href="#cursos" className="inline-flex items-center rounded-full border-2 border-[#031e41] bg-white px-7 py-4 font-bold transition hover:bg-[#FFC531]">
                  Ver capacitaciones
                </a>
              </div>
              {/* Prueba: escuelas que ya los dictan */}
              <div className="rise mt-10 flex flex-wrap items-center gap-x-5 gap-y-3" style={{ animationDelay: '.26s' }}>
                <span className="flex -space-x-3">
                  {schools.map((s) => (
                    <span key={s.slug} className="flex size-12 items-center justify-center rounded-full border-2 border-[#031e41] bg-white p-1.5">
                      <Image src={s.config.logo} alt={s.name} width={40} height={40} className="max-h-full w-auto object-contain" />
                    </span>
                  ))}
                </span>
                <p className="text-[15px] leading-snug text-[#031e41]/75">
                  <strong className="text-[#031e41]">{schools.length} {schools.length === 1 ? 'escuela ya los dicta' : 'escuelas ya los dictan'}</strong>
                  <br />{catalog.length} capacitaciones de tecnología y oficios
                </p>
              </div>
            </div>

            {/* Collage: caen de a una al cargar y después flotan */}
            <ul className="relative mx-auto h-[420px] w-full max-w-[560px] sm:h-[500px] lg:h-[580px]" aria-label="Algunas capacitaciones">
              {heroPics.map((c, k) => (
                <li key={c.slug} className={`drop absolute ${POLA[k].pos}`} style={{ animationDelay: `${0.35 + k * 0.15}s`, zIndex: POLA[k].z }}>
                  <div className="float" style={{ animationDelay: `${k * -1.6}s` }}>
                    <Link
                      href={`/capacitaciones/${c.slug}`}
                      className="group relative block rounded-[20px] border-2 border-[#031e41] bg-white p-2 pb-3 shadow-[6px_6px_0_#031e41] transition duration-300 rotate-[var(--r)] hover:z-50 hover:scale-105 hover:rotate-0 focus-visible:rotate-0 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#3D6BFF] sm:p-2.5 sm:pb-3.5"
                      style={{ ['--r' as string]: `${POLA[k].rot}deg` }}
                    >
                      <span aria-hidden className="absolute -top-3 left-1/2 z-10 h-6 w-16 -translate-x-1/2 -rotate-3 rounded-sm opacity-90 sm:w-20" style={{ background: TAPE[k] }} />
                      <span className="relative block aspect-[4/3] overflow-hidden rounded-[13px] bg-[#EAF2FB]">
                        <Image src={c.image!} alt="" fill priority={k < 2} sizes="(min-width:1024px) 300px, 55vw" className="object-cover" />
                      </span>
                      <span className={`mt-2 block px-1 text-[13px] font-bold leading-tight sm:text-base ${D}`}>{shortTitle(c.title)}</span>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
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
        {/* Al entrar en pantalla cada paso estalla de corrido (BoomObserver + .boom-* en globals.css). */}
        <section id="como" className="boom-pin relative">
          <BoomObserver />
          <div className="boom-stage mx-auto max-w-7xl px-5 pt-28 sm:px-8 sm:pt-36">
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
          </div>
        </section>

        {/* Plataforma de aprendizaje propia: texto + maqueta de la cursada y del seguimiento */}
        <section id="plataforma" className="px-3 pt-28 sm:px-6 sm:pt-36">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[40px] border-2 border-[#031e41] bg-[#2FD3A0] px-6 py-14 shadow-[8px_8px_0_#031e41] sm:px-12 sm:py-20" style={pegboard}>
            <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
              <div className="reveal">
                <p className="inline-flex items-center gap-2 rounded-full border-2 border-[#031e41] bg-white px-4 py-2 text-sm font-semibold">
                  <Sparkles size={16} aria-hidden /> Incluida en todos los cursos
                </p>
                <h2 className={`mt-6 text-balance text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl ${D}`}>Nuestra propia plataforma de aprendizaje</h2>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#031e41]/80">
                  Durante la cursada, cada estudiante entra a nuestra plataforma para seguir las clases, hacer las tareas y estudiar. Y es también donde evaluamos: tu escuela sabe cómo va cada uno.
                </p>
                <ul className="mt-9 grid gap-4 sm:grid-cols-2">
                  {PLATFORM.map(({ icon: Icon, title, text, bg }) => (
                    <li key={title} className="rounded-2xl border-2 border-[#031e41] bg-white/85 p-4 shadow-[3px_3px_0_#031e41]">
                      <span className="flex size-10 items-center justify-center rounded-xl border-2 border-[#031e41]" style={{ background: bg }}><Icon size={20} strokeWidth={2.2} aria-hidden /></span>
                      <h3 className={`mt-3 text-lg font-bold leading-tight ${D}`}>{title}</h3>
                      <p className="mt-1 text-[15px] leading-snug text-[#031e41]/75">{text}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Maqueta ilustrativa (datos de ejemplo) */}
              <div className="reveal relative pb-24 sm:pb-20" role="img" aria-label="Ejemplo de la plataforma: la cursada de Robótica con clases, una tarea y el seguimiento de los estudiantes">
                <div aria-hidden className="overflow-hidden rounded-3xl border-2 border-[#031e41] bg-white shadow-[6px_6px_0_#031e41] lg:-rotate-1">
                  <div className="flex items-center gap-1.5 border-b-2 border-[#031e41] bg-[#EAF2FB] px-4 py-3">
                    <span className="size-3 rounded-full bg-[#FF6FA8]" /><span className="size-3 rounded-full bg-[#FFC531]" /><span className="size-3 rounded-full bg-[#2FD3A0]" />
                    <span className="ml-3 truncate rounded-full bg-white px-3 py-1 text-xs text-[#031e41]/60">Mi cursada · Robótica</span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className={`text-2xl font-extrabold ${D}`}>Robótica</span>
                      <span className="text-sm font-semibold text-[#031e41]/60">Clase 6 de 12</span>
                    </div>
                    <span className="mt-3 block h-3 overflow-hidden rounded-full border-2 border-[#031e41] bg-[#EAF2FB]"><span className="block h-full w-1/2 bg-[#2FD3A0]" /></span>
                    <ul className="mt-5 space-y-2.5 text-[15px]">
                      <li className="flex items-center gap-3 rounded-xl bg-[#F7FAFD] px-3 py-2.5"><CircleCheck size={20} className="shrink-0 text-[#12a37a]" /> <span className="flex-1">Clase 5 · Sensores y motores</span></li>
                      <li className="flex items-center gap-3 rounded-xl border-2 border-[#031e41] bg-[#FFC531]/30 px-3 py-2.5 font-semibold"><MonitorPlay size={20} className="shrink-0" /> <span className="flex-1">Clase 6 · Programar el recorrido</span><span className="rounded-full bg-[#031e41] px-2.5 py-0.5 text-xs text-white">Hoy</span></li>
                      <li className="flex items-center gap-3 rounded-xl bg-[#F7FAFD] px-3 py-2.5"><ClipboardCheck size={20} className="shrink-0 text-[#d94c86]" /> <span className="flex-1">Tarea · Seguidor de línea</span><span className="text-xs font-semibold text-[#031e41]/60">Entrega vie.</span></li>
                      <li className="flex items-center gap-3 rounded-xl bg-[#F7FAFD] px-3 py-2.5"><BookOpenText size={20} className="shrink-0 text-[#3D6BFF]" /> <span className="flex-1">Apunte · Cómo funciona un servo</span></li>
                    </ul>
                  </div>
                </div>
                {/* Tarjeta del seguimiento, encimada */}
                <div aria-hidden className="absolute -bottom-8 right-0 w-[78%] max-w-[320px] rotate-2 rounded-2xl border-2 border-[#031e41] bg-[#031e41] p-4 text-white shadow-[5px_5px_0_#FFC531] sm:right-[-4%]">
                  <p className="flex items-center gap-2 text-sm font-bold"><ChartLine size={16} /> Seguimiento del grupo</p>
                  <ul className="mt-3 space-y-2.5 text-[13px]">
                    {[['Martina', 92, '#2FD3A0'], ['Tomás', 75, '#FFC531'], ['Lucía', 58, '#FF6FA8']].map(([n, p, c]) => (
                      <li key={n as string} className="grid grid-cols-[64px_1fr_34px] items-center gap-2">
                        <span>{n}</span>
                        <span className="h-2 overflow-hidden rounded-full bg-white/15"><span className="block h-full rounded-full" style={{ width: `${p}%`, background: c as string }} /></span>
                        <span className="text-right font-semibold">{p}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
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
