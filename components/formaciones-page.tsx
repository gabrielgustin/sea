'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Award, Building2, Check, Code, Lightbulb, Mail, MessageCircle, Plus, TrendingUp, Users, Zap } from 'lucide-react';
import { EMAIL, wa } from '@/lib/contact';

const D = '[font-family:var(--font-display)]';
const COLORS = ['#FFC531', '#FF6FA8', '#2FD3A0', '#9cbadb'];
const SPARKS = [0, 45, 90, 135, 180, 225, 270, 315];
const pegboard = { backgroundImage: 'radial-gradient(rgb(3 30 65 / .14) 1.4px, transparent 1.6px)', backgroundSize: '26px 26px' };
const dark = { backgroundImage: 'radial-gradient(rgb(255 255 255 / .08) 1.4px, transparent 1.6px)', backgroundSize: '26px 26px' };
const ASK = wa('Hola! Me interesa conocer el Centro de Formación para mi institución.');

const whyUs = [
  { icon: Zap, title: 'Flexibilidad total', description: 'Diseñamos programas adaptados a las necesidades específicas de tu institución, horarios y duración personalizada.' },
  { icon: Award, title: 'Certificaciones', description: 'Entregamos constancias de participación que respaldan el conocimiento adquirido y enriquecen el portfolio de cada estudiante.' },
  { icon: Users, title: 'Instructores expertos', description: 'Profesionales con experiencia comprobada en sus áreas, comprometidos con la excelencia educativa.' },
];

const services = [
  { id: 'instituciones', icon: Building2, title: 'Capacitaciones institucionales', description: 'Programas diseñados exclusivamente para instituciones educativas como extensión académica de calidad.', features: ['Currículum personalizado', 'Validación institucional', 'Certificación oficial'] },
  { id: 'comunidad', icon: Users, title: 'Programas comunitarios', description: 'Formaciones abiertas a la comunidad, generando impacto social y oportunidades para todos.', features: ['Acceso democrático', 'Precios accesibles', 'Impacto social'] },
  { id: 'tecnologia', icon: Code, title: 'Formaciones tecnológicas', description: 'Capacitaciones en las últimas tecnologías: desarrollo web, robótica, IA y herramientas digitales.', features: ['Docentes especializados', 'Equipamiento moderno', 'Proyectos prácticos'] },
  { id: 'talleres', icon: Lightbulb, title: 'Formaciones de oficio', description: 'Formaciones especializadas en oficios técnicos y prácticos que demanda el mercado laboral actual.', features: ['Aprendizaje práctico', 'Inserción laboral', 'Certificación profesional'] },
];

const benefits = [
  { icon: TrendingUp, title: 'Generación de ingresos', description: 'Diversificá las fuentes de ingresos de tu institución con programas educativos de calidad.' },
  { icon: Users, title: 'Impacto comunitario', description: 'Fortalecé la relación con la comunidad y posicioná tu institución como referente educativo.' },
  { icon: Award, title: 'Reconocimiento académico', description: 'Potenciá la reputación de tu institución con certificaciones y programas innovadores.' },
];

const steps = [
  { title: 'Consulta inicial', description: 'Conocemos tus necesidades específicas y objetivos institucionales.' },
  { title: 'Diseño personalizado', description: 'Creamos un programa adaptado a tu comunidad e institución.' },
  { title: 'Ejecución', description: 'Implementamos el programa con docentes especializados y seguimiento continuo.' },
  { title: 'Certificación', description: 'Emitimos certificados de reconocimiento validados.' },
];

export default function FormacionesPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative -mt-[76px] overflow-hidden bg-[#EAF2FB] px-5 pb-20 pt-36 sm:px-8 sm:pt-44" style={pegboard}>
        <div className="mx-auto max-w-5xl text-center">
          <p className="rise inline-flex items-center gap-2 rounded-full border-2 border-[#031e41] bg-white px-4 py-2 text-sm font-semibold"><Building2 size={16} /> Para instituciones</p>
          <h1 className={`rise mt-6 text-balance text-[clamp(3rem,8vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.04em] ${D}`} style={{ animationDelay: '.08s' }}>
            Centro de Formación
          </h1>
          <p className="rise mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-[#031e41]/75" style={{ animationDelay: '.14s' }}>
            Capacitaciones extracurriculares diseñadas como extensión académica para instituciones educativas.
          </p>
          <div className="rise mt-9 flex flex-wrap justify-center gap-3" style={{ animationDelay: '.2s' }}>
            <a href="#contacto" className="inline-flex items-center gap-2 rounded-full border-2 border-[#031e41] bg-[var(--accent)] px-7 py-4 font-bold text-[var(--accent-ink)] shadow-[4px_4px_0_#031e41] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#031e41] active:translate-y-0 active:shadow-none">
              Solicitar consulta gratuita <ArrowRight size={18} />
            </a>
            <Link href="/#cursos" className="inline-flex items-center rounded-full border-2 border-[#031e41] bg-white px-7 py-4 font-bold transition hover:bg-[#031e41] hover:text-white">
              Ver capacitaciones
            </Link>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8 sm:pt-32">
        <h2 className={`text-4xl font-extrabold tracking-tight sm:text-6xl ${D}`}>¿Por qué elegirnos?</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {whyUs.map(({ icon: Icon, title, description }, i) => (
            <div key={title} className="rounded-[28px] border-2 border-[#031e41] bg-white p-7 shadow-[6px_6px_0_#031e41] transition duration-300 hover:-translate-y-1" style={{ rotate: `${[-1, 0.8, -0.6][i]}deg` }}>
              <span className="flex size-14 items-center justify-center rounded-full border-2 border-[#031e41]" style={{ background: COLORS[i] }}><Icon size={24} /></span>
              <h3 className={`mt-6 text-2xl font-bold ${D}`}>{title}</h3>
              <p className="mt-2 leading-relaxed text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Servicios: se abren para ver qué incluyen */}
      <section id="servicios" className="mx-auto max-w-7xl px-5 pt-24 sm:px-8 sm:pt-32">
        <h2 className={`text-4xl font-extrabold tracking-tight sm:text-6xl ${D}`}>Nuestros servicios</h2>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">Soluciones educativas adaptadas a cada tipo de institución y comunidad. Tocá uno para ver qué incluye.</p>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {services.map(({ id, icon: Icon, title, description, features }, i) => {
            const isOpen = open === id;
            return (
              <div key={id} className={`rounded-[28px] border-2 border-[#031e41] transition-colors duration-300 ${isOpen ? 'bg-[#FFF4D1]' : 'bg-white'}`}>
                <button onClick={() => setOpen(isOpen ? null : id)} aria-expanded={isOpen} className="flex w-full items-start gap-5 p-7 text-left">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-[#031e41]" style={{ background: COLORS[i] }}><Icon size={24} /></span>
                  <span className="flex-1">
                    <span className={`block text-2xl font-bold ${D}`}>{title}</span>
                    <span className="mt-2 block leading-relaxed text-slate-600">{description}</span>
                  </span>
                  <span className={`flex size-9 shrink-0 items-center justify-center rounded-full transition duration-300 ${isOpen ? 'rotate-45 bg-[#031e41] text-white' : 'bg-[var(--accent)] text-[var(--accent-ink)]'}`}><Plus size={18} strokeWidth={2.6} /></span>
                </button>
                <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <ul className="flex flex-wrap gap-2 px-7 pb-7 pl-[6.25rem]">
                      {features.map((f) => (
                        <li key={f} className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#031e41] bg-white px-3 py-1 text-sm font-semibold"><Check size={14} strokeWidth={3} />{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Beneficios */}
      <section className="px-3 pt-24 sm:px-6 sm:pt-32">
        <div data-nav="dark" className="mx-auto max-w-7xl rounded-[40px] bg-[#031e41] px-6 py-16 text-white sm:px-14 sm:py-20" style={dark}>
          <h2 className={`text-4xl font-extrabold tracking-tight sm:text-6xl ${D}`}>Beneficios para instituciones</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }, i) => (
              <div key={title} className="group rounded-[24px] bg-white/[0.07] p-7 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.12]">
                <span className="flex size-12 items-center justify-center rounded-full border-2 border-white text-[#031e41] transition duration-500 group-hover:rotate-12" style={{ background: COLORS[i] }}><Icon size={22} /></span>
                <h3 className={`mt-6 text-2xl font-bold ${D}`}>{title}</h3>
                <p className="mt-2 leading-relaxed text-white/70">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona: mismo efecto de explosión con scroll que la landing */}
      <section className="boom-pin relative">
        <div className="boom-stage mx-auto max-w-7xl px-5 pt-24 sm:px-8 sm:pt-32">
          <h2 className={`text-4xl font-extrabold tracking-tight sm:text-6xl ${D}`}>Cómo funciona</h2>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">Un proceso simple y transparente para que tu institución reciba exactamente lo que necesita.</p>
          <ol className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <span aria-hidden className="boom-line absolute left-8 right-8 top-8 hidden border-t-[3px] border-dashed border-[#031e41]/25 lg:block" />
            {steps.map((s, i) => (
              <li key={s.title} className="boom-step relative" style={{ ['--i' as string]: i }}>
                <span className="relative block size-16">
                  <span aria-hidden className="boom-ring absolute inset-0 rounded-full border-4" style={{ borderColor: COLORS[i] }} />
                  {SPARKS.map((a, k) => (
                    <span key={a} aria-hidden className="boom-spark absolute left-1/2 top-1/2 h-6 w-2.5 rounded-full" style={{ ['--a' as string]: `${a}deg`, background: k % 2 ? 'var(--accent)' : COLORS[(k + i) % 4] }} />
                  ))}
                  <span className={`boom-num relative flex size-16 items-center justify-center rounded-full border-2 border-[#031e41] text-2xl font-extrabold shadow-[3px_3px_0_#031e41] ${D}`} style={{ background: COLORS[i] }}>{i + 1}</span>
                </span>
                <div className="boom-text">
                  <h3 className={`mt-6 text-2xl font-bold tracking-tight ${D}`}>{s.title}</h3>
                  <p className="mt-2 max-w-xs leading-relaxed text-slate-600">{s.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Cierre */}
      <section id="contacto" className="mx-auto max-w-7xl scroll-mt-24 px-5 pt-24 sm:px-8 sm:pt-32">
        <div className="rounded-[40px] border-2 border-[#031e41] bg-[var(--accent)] px-6 py-16 text-center text-[var(--accent-ink)] shadow-[8px_8px_0_#031e41] sm:px-12 sm:py-20">
          <h2 className={`mx-auto max-w-3xl text-balance text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl ${D}`}>¿Listo para transformar la educación en tu institución?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg opacity-80">Da el primer paso hacia una educación más completa y certificada. Nuestro equipo está listo para asesorarte sin compromiso.</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={ASK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#031e41] bg-[#031e41] px-7 py-4 font-bold text-white transition hover:-translate-y-0.5">
              <MessageCircle size={18} /> Contactar por WhatsApp
            </a>
            <a href={`mailto:${EMAIL}`} className="inline-flex min-w-0 items-center justify-center gap-2 rounded-full border-2 border-[#031e41] bg-white px-7 py-4 font-bold text-[#031e41] transition hover:-translate-y-0.5">
              <Mail size={18} className="shrink-0" /> <span className="truncate">{EMAIL}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
