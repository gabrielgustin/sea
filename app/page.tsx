import type { Metadata } from 'next';
import Image from 'next/image';
import {
  ArrowRight, Award, BadgeCheck, Building2, CalendarCheck, Cpu, Database, Globe, Hammer, LayoutDashboard,
  Mail, MessageCircle, Palette, Rocket, Sparkles, TrendingUp, Users,
} from 'lucide-react';
import { listTenants, toPublic } from '@/lib/tenants/registry';
import { clientFor } from '@/lib/tenants/db';
import { Faq, InstitutionLink, LandingNav, SpotCard } from '@/components/landing/client';

export const dynamic = 'force-dynamic'; // lista los clientes activos: nunca se congela en el build

export const metadata: Metadata = {
  title: 'Portal SEA · Secretaría de Extensión Académica',
  description: 'Creamos el Centro de Formación de tu institución: cursos de tecnología y oficios, sitio propio, inscripciones y certificación.',
};

// Contacto de la Secretaría. shortcut: fijo en código; pasar a configuración si cambia seguido.
const WHATSAPP_NUMBER = '5493513697444';
const EMAIL = 'formaciones@portalsea.com.ar';
const wa = (msg: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
const JOIN = wa('Hola! Quiero sumar mi institución al Portal SEA.');

const FEATURES = [
  { icon: Globe, title: 'Sitio propio con tu marca', text: 'Tu institución en su propia dirección del portal, con tu logo, tus cursos y tus datos de contacto.', wide: true },
  { icon: CalendarCheck, title: 'Inscripciones con cupos', text: 'Comisiones, horarios y lugares disponibles. Los inscriptos te llegan ordenados.' },
  { icon: LayoutDashboard, title: 'Panel de administración', text: 'Cargá y editá formaciones, docentes y novedades sin depender de nadie.' },
  { icon: Award, title: 'Certificación', text: 'Constancias que respaldan lo aprendido y suman al portfolio de cada estudiante.' },
  { icon: Database, title: 'Tus datos, separados', text: 'Cada institución tiene su propia base de datos: nada se mezcla con otra.', wide: true },
];

const AREAS = [
  { icon: Cpu, title: 'Tecnología', text: 'Lo que hoy pide el mercado, con proyectos desde la primera clase.', items: ['Robótica', 'Programación Arduino', 'Automatización con IA', 'Diseño e impresión 3D', 'Desarrollo de videojuegos'] },
  { icon: Hammer, title: 'Oficios', text: 'Formación práctica con salida laboral rápida.', items: ['Electricista matriculado', 'Mecánica de motores', 'Soldadura por arco eléctrico'] },
  { icon: Palette, title: 'Deporte y arte', text: 'Propuestas para sumar a toda la comunidad.', items: ['Taller de teatro', 'Preparación física para fútbol'] },
];

const STEPS = [
  { title: 'Consulta inicial', text: 'Conocemos tu institución, tu comunidad y lo que querés lograr.' },
  { title: 'Diseño a medida', text: 'Armamos la propuesta: qué formaciones, en qué horarios y con qué docentes.' },
  { title: 'Lanzamiento', text: 'Tu institución tiene su sitio, sus inscripciones y su panel listos para usar.' },
  { title: 'Seguimiento y certificación', text: 'Acompañamos el dictado y emitimos las constancias de cada formación.' },
];

const BENEFITS = [
  { icon: TrendingUp, title: 'Nuevas fuentes de ingreso', text: 'Diversificá los ingresos de tu institución con programas educativos de calidad.' },
  { icon: Users, title: 'Más cerca de la comunidad', text: 'Abrí la institución a vecinos, familias y graduados, y posicionala como referente.' },
  { icon: BadgeCheck, title: 'Reconocimiento académico', text: 'Potenciá tu reputación con certificaciones y propuestas innovadoras.' },
];

const FAQS = [
  { q: '¿Qué necesita mi institución para empezar?', a: 'Una reunión inicial. A partir de lo que charlemos armamos la propuesta: formaciones, horarios y docentes. El sitio y el panel de tu institución los preparamos nosotros.' },
  { q: '¿Quién dicta las formaciones?', a: 'Profesionales con experiencia comprobada en cada área. También podés sumar a graduados y docentes de tu propia institución.' },
  { q: '¿Las formaciones son solo para estudiantes de la institución?', a: 'No. Están pensadas para toda la comunidad: estudiantes, graduados, familias y vecinos.' },
  { q: '¿Se entregan certificados?', a: 'Sí. Cada formación cierra con una constancia que respalda lo aprendido.' },
  { q: '¿Puedo administrar el contenido yo mismo?', a: 'Sí. Tu institución tiene un panel propio para cargar y editar formaciones, docentes e inscripciones. Si necesitás ayuda, te acompañamos.' },
  { q: '¿Mis datos y los de mis alumnos están separados de otras instituciones?', a: 'Sí. Cada institución tiene su propia base de datos, sin acceso cruzado.' },
];

async function institutions() {
  const tenants = await listTenants();
  return Promise.all(
    tenants.map(async (t) => {
      let count: number | null = null;
      try {
        count = Number((await clientFor(t).execute('SELECT COUNT(*)::int AS n FROM courses')).rows[0]?.n ?? 0);
      } catch {} // si una base no responde, la tarjeta igual se muestra
      return { ...toPublic(t), count };
    }),
  );
}

function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${light ? 'text-[#9cbadb]' : 'text-[#031e41]/60'}`}>
      <span className={`h-px w-6 ${light ? 'bg-[#9cbadb]' : 'bg-[#031e41]/40'}`} />{children}
    </p>
  );
}

export default async function LandingPage() {
  const list = await institutions();
  const totalCourses = list.reduce((s, i) => s + (i.count ?? 0), 0);

  return (
    <>
      <LandingNav whatsapp={JOIN} />
      <main>
        {/* Hero + acceso a cada institución */}
        <section id="instituciones" data-nav="dark" className="aurora relative bg-[#031e41] px-5 pb-24 pt-36 text-white sm:px-8 sm:pb-32 sm:pt-44">
          <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <p className="rise inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.16em] backdrop-blur-md">
                <Sparkles size={13} className="text-[#9cbadb]" /> Secretaría de Extensión Académica
              </p>
              <h1 className="rise mt-6 text-balance text-[2.7rem] font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl" style={{ animationDelay: '.08s' }}>
                Tu institución, con su propio <span className="text-[#9cbadb]">Centro de Formación</span>.
              </h1>
              <p className="rise mt-6 max-w-xl text-lg leading-relaxed text-white/70" style={{ animationDelay: '.16s' }}>
                Armamos junto a tu institución una oferta de cursos de tecnología y oficios, con sitio propio, inscripciones y certificación. Vos ponés la comunidad, nosotros el resto.
              </p>
              <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: '.24s' }}>
                <a href={JOIN} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-[#031e41] transition hover:bg-[#9cbadb]">
                  Sumá tu institución <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </a>
                <a href="#incluye" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-4 text-sm font-semibold backdrop-blur-md transition hover:bg-white/15">Ver qué incluye</a>
              </div>
            </div>

            <div className="rise relative rounded-[2rem] border border-white/15 bg-white/[0.07] p-5 backdrop-blur-xl sm:p-7" style={{ animationDelay: '.3s' }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9cbadb]">Ya sos parte</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Entrá a tu institución</h2>
              <ul className="mt-6 space-y-3">
                {list.map((i) => (
                  <li key={i.slug}>
                    <InstitutionLink href={`/${i.slug}`} name={i.name} logo={i.config.logo} count={i.count} />
                  </li>
                ))}
                {list.length === 0 && <li className="text-white/60">Pronto vas a ver acá a las instituciones.</li>}
              </ul>
              <p className="mt-5 text-sm text-white/50">Elegí tu institución para ver sus formaciones e inscribirte.</p>
            </div>
          </div>
        </section>

        {/* Números reales (salen de las bases de cada institución) */}
        <section className="mx-auto max-w-7xl px-5 pt-16 sm:px-8 sm:pt-20">
          <dl className="grid gap-px overflow-hidden rounded-[2rem] bg-slate-200 sm:grid-cols-3">
            {[
              { n: list.length, l: list.length === 1 ? 'institución en el portal' : 'instituciones en el portal' },
              { n: totalCourses, l: 'formaciones disponibles' },
              { n: 3, l: 'áreas: tecnología, oficios, deporte y arte' },
            ].map((s) => (
              <div key={s.l} className="reveal bg-white px-8 py-8 text-center">
                <dt className="text-5xl font-semibold tracking-tight text-[#031e41]">{s.n}</dt>
                <dd className="mt-2 text-slate-500">{s.l}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Qué incluye */}
        <section id="incluye" className="mx-auto max-w-7xl px-5 pt-24 sm:px-8 sm:pt-32">
          <div className="reveal max-w-2xl">
            <Eyebrow>Qué incluye</Eyebrow>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Todo lo que tu Centro de Formación necesita</h2>
            <p className="mt-4 text-lg text-slate-500">No tenés que armar nada desde cero: lo dejamos funcionando.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text, wide }) => (
              <SpotCard key={title} className={`reveal rounded-[2rem] border border-slate-200 bg-white p-8 transition duration-500 hover:-translate-y-1 hover:border-[#9cbadb] hover:shadow-[0_24px_50px_-20px_rgb(3_30_65/0.25)] ${wide ? 'md:col-span-2' : ''}`}>
                <span className="flex size-12 items-center justify-center rounded-2xl bg-[#eef3f9] text-[#031e41]"><Icon size={22} /></span>
                <h3 className="mt-6 text-xl font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 max-w-md leading-relaxed text-slate-500">{text}</p>
              </SpotCard>
            ))}
          </div>
        </section>

        {/* Áreas */}
        <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8 sm:pt-32">
          <div className="reveal max-w-2xl">
            <Eyebrow>Qué se puede dictar</Eyebrow>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Formaciones para toda la comunidad</h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {AREAS.map(({ icon: Icon, title, text, items }) => (
              <div key={title} className="reveal rounded-[2rem] bg-gradient-to-b from-[#eef3f9] to-white p-8 ring-1 ring-slate-200">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-[#031e41] text-white"><Icon size={22} /></span>
                <h3 className="mt-6 text-2xl font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-slate-500">{text}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {items.map((i) => <li key={i} className="rounded-full bg-white px-3.5 py-1.5 text-sm text-slate-700 ring-1 ring-slate-200">{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Proceso */}
        <section id="proceso" className="mx-auto max-w-7xl px-5 pt-24 sm:px-8 sm:pt-32">
          <div className="reveal mx-auto max-w-2xl text-center">
            <Eyebrow>Cómo trabajamos</Eyebrow>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">De la primera charla a la primera clase</h2>
          </div>
          <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
            <span className="absolute left-7 top-7 hidden h-px w-[calc(100%-3.5rem)] bg-slate-200 md:block" aria-hidden />
            <span className="reveal-line absolute left-7 top-7 hidden h-px w-[calc(100%-3.5rem)] bg-[#031e41] md:block" aria-hidden />
            {STEPS.map((s, i) => (
              <li key={s.title} className="reveal relative flex gap-5 md:block">
                <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white font-mono text-lg font-semibold text-[#031e41] shadow-sm">0{i + 1}</span>
                <div className="md:mt-7">
                  <h3 className="text-xl font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate-500">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Beneficios */}
        <section className="px-3 pt-24 sm:px-5 sm:pt-32">
          <div data-nav="dark" className="aurora relative mx-auto max-w-[96rem] rounded-[2.5rem] bg-[#031e41] px-5 py-20 text-white sm:px-8 sm:py-28">
            <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
            <div className="relative mx-auto max-w-7xl">
              <div className="reveal max-w-2xl">
                <Eyebrow light>Para tu institución</Eyebrow>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Más que cursos: una forma de crecer</h2>
              </div>
              <div className="mt-12 grid gap-4 md:grid-cols-3">
                {BENEFITS.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="reveal group rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.08]">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-[#9cbadb] text-[#031e41] transition duration-500 group-hover:scale-110 group-hover:-rotate-6"><Icon size={22} /></span>
                    <h3 className="mt-6 text-xl font-semibold">{title}</h3>
                    <p className="mt-2 leading-relaxed text-white/60">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Preguntas */}
        <section id="faq" className="mx-auto grid max-w-7xl gap-12 px-5 pt-24 sm:px-8 sm:pt-32 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div className="reveal lg:sticky lg:top-32 lg:self-start">
            <Eyebrow>Preguntas frecuentes</Eyebrow>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Lo que suelen preguntarnos</h2>
            <p className="mt-6 text-slate-500">¿Otra duda? <a href={JOIN} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#031e41] underline decoration-[#9cbadb] decoration-2 underline-offset-4">Escribinos</a>.</p>
          </div>
          <Faq items={FAQS} />
        </section>

        {/* Cierre */}
        <section id="contacto" className="mx-auto max-w-7xl px-5 pt-24 sm:px-8 sm:pt-32">
          <div className="reveal relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#eef3f9] via-white to-[#dfe9f5] px-6 py-16 text-center ring-1 ring-slate-200 sm:px-12 sm:py-24">
            <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-[#9cbadb]/40 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full bg-[#031e41]/15 blur-3xl" aria-hidden />
            <Rocket className="relative mx-auto text-[#031e41]" size={32} />
            <h2 className="relative mx-auto mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-[#031e41] sm:text-6xl">Hablemos de tu Centro de Formación</h2>
            <p className="relative mx-auto mt-5 max-w-xl text-lg text-slate-600">Contanos sobre tu institución y te armamos una propuesta a medida.</p>
            <div className="relative mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={JOIN} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#031e41] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#0b2d5c]">
                <MessageCircle size={17} /> Escribinos por WhatsApp
              </a>
              <a href={`mailto:${EMAIL}?subject=${encodeURIComponent('Quiero sumar mi institución')}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-semibold text-[#031e41] transition hover:border-[#031e41]">
                <Mail size={17} /> {EMAIL}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer data-nav="dark" className="aurora relative mt-24 bg-[#031e41] text-white">
        <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-5 pb-10 pt-14 sm:px-8 md:flex-row md:justify-between">
          <div>
            <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
              <Image src="/logo-sea.png" alt="SEA" width={80} height={40} className="h-8 w-auto object-contain" />
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">Secretaría de Extensión Académica. Centros de formación para instituciones educativas.</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Instituciones</h3>
            <ul className="mt-4 space-y-3">
              {list.map((i) => <li key={i.slug}><a href={`/${i.slug}`} className="inline-flex items-center gap-2 text-sm text-white/75 transition hover:text-white"><Building2 size={15} className="text-[#9cbadb]" />{i.name}</a></li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Contacto</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li><a href={JOIN} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-white"><MessageCircle size={15} className="text-[#9cbadb]" />WhatsApp</a></li>
              <li><a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 transition hover:text-white"><Mail size={15} className="text-[#9cbadb]" />{EMAIL}</a></li>
            </ul>
          </div>
        </div>
        <div className="relative mx-auto max-w-7xl border-t border-white/10 px-5 py-6 text-xs text-white/40 sm:px-8">© {new Date().getFullYear()} Portal SEA · Secretaría de Extensión Académica</div>
      </footer>
    </>
  );
}
