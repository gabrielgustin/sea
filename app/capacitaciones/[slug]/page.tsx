import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, MessageCircle, School } from 'lucide-react';
import { LandingNav } from '@/components/landing/client';
import { LandingFooter } from '@/components/landing/footer';
import { D, display, loadCatalog, pegboard, shortTitle, wa } from '@/lib/landing';

export const dynamic = 'force-dynamic';

async function find(slug: string) {
  const data = await loadCatalog();
  const course = data.catalog.find((c) => c.slug === decodeURIComponent(slug));
  return { ...data, course };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { course } = await find((await params).slug);
  if (!course) return {};
  return {
    title: `${course.title} · Capacitación para tu escuela · Portal SEA`,
    description: course.subtitle || course.objective.slice(0, 160) || `Curso extracurricular de ${course.title} dictado en tu escuela.`,
  };
}

// Textos cargados con saltos de línea: cada renglón es un punto de la lista.
const lines = (t: string) => t.split('\n').map((l) => l.replace(/^[-•*]\s*/, '').trim()).filter(Boolean);

function Block({ title, text }: { title: string; text: string }) {
  if (!text) return null;
  const items = lines(text);
  return (
    <section className="border-t-2 border-[#031e41]/10 pt-10">
      <h2 className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${D}`}>{title}</h2>
      {items.length > 1 ? (
        <>
          <p className="mt-4 text-lg leading-relaxed text-slate-700">{items[0]}</p>
          <ul className="mt-4 space-y-2.5">
            {items.slice(1).map((l) => (
              <li key={l} className="flex gap-3 text-lg leading-relaxed text-slate-700"><span className="mt-2.5 size-2.5 shrink-0 rounded-full bg-[#FFC531] ring-2 ring-[#031e41]" aria-hidden />{l}</li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-4 text-lg leading-relaxed text-slate-700">{text}</p>
      )}
    </section>
  );
}

export default async function CapacitacionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { course, catalog, schools } = await find((await params).slug);
  if (!course) notFound();

  const ask = wa(`Hola! Me interesa dictar el curso de ${course.title} en mi escuela.`);
  const others = catalog.filter((c) => c.slug !== course.slug).slice(0, 4);
  const facts = [
    course.duration && { icon: Clock, text: course.duration },
    { icon: School, text: 'Presencial, en tu escuela' },
  ].filter(Boolean) as { icon: typeof Clock; text: string }[];

  return (
    <div className={`${display.variable} bg-[#F7FAFD] text-[#031e41]`}>
      <LandingNav />
      <main>
        {/* Encabezado */}
        <section className="bg-[#EAF2FB] px-5 pb-20 pt-32 sm:px-8 sm:pt-40" style={pegboard}>
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <Link href="/#cursos" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold ring-2 ring-[#031e41] transition hover:bg-[#FFC531]">
                <ArrowLeft size={16} /> Todas las capacitaciones
              </Link>
              <p className={`mt-8 block w-fit rounded-full px-3 py-1 text-sm font-semibold ${course.area === 'ofi' ? 'bg-[#FFE7D6] text-[#8a3a00]' : 'bg-[#E3EAFF] text-[#1f3fae]'}`}>
                {course.area === 'ofi' ? 'Oficio' : 'Tecnología'}
              </p>
              <h1 className={`mt-4 text-balance text-5xl font-extrabold leading-[0.95] tracking-[-0.035em] sm:text-7xl ${D}`}>{course.title}</h1>
              {course.subtitle && <p className="mt-5 max-w-xl text-xl leading-relaxed text-[#031e41]/75">{course.subtitle}</p>}
              <ul className="mt-8 flex flex-wrap gap-2.5">
                {facts.map(({ icon: Icon, text }) => (
                  <li key={text} className="inline-flex items-center gap-2 rounded-full border-2 border-[#031e41] bg-white px-4 py-2 font-semibold"><Icon size={17} />{text}</li>
                ))}
              </ul>
              <a href={ask} target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex items-center gap-2 rounded-full border-2 border-[#031e41] bg-[#031e41] px-7 py-4 font-bold text-white shadow-[4px_4px_0_#FFC531] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#FFC531] active:translate-y-0 active:shadow-none">
                <MessageCircle size={18} /> Quiero este curso en mi escuela
              </a>
            </div>
            {course.image && (
              <div className="relative mx-auto w-full max-w-lg rotate-2 rounded-[28px] border-2 border-[#031e41] bg-white p-3 shadow-[8px_8px_0_#031e41]">
                <span aria-hidden className="absolute -top-3.5 left-1/2 z-10 h-7 w-24 -translate-x-1/2 -rotate-3 rounded-sm bg-[#FFC531] opacity-90" />
                <span className="relative block aspect-[4/3] overflow-hidden rounded-[18px]">
                  <Image src={course.image} alt={course.title} fill priority sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Qué ponemos nosotros */}
        <section className="px-3 pt-16 sm:px-6">
          <div data-nav="dark" className="mx-auto grid max-w-7xl gap-8 rounded-[32px] bg-[#031e41] px-6 py-10 text-white sm:px-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <h2 className={`text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl ${D}`}>Este curso lo dictamos en tu escuela</h2>
            <p className="text-lg leading-relaxed text-white/75">
              Nosotros ponemos el docente, el programa, las inscripciones online y los certificados. Tu escuela pone el espacio y la comunidad. Es extracurricular: se dicta aparte del horario de clases.
            </p>
          </div>
        </section>

        {/* Contenido */}
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-12">
            <Block title="De qué se trata" text={course.description} />
            <Block title="Qué van a lograr" text={course.objective} />
            <Block title="Cómo son las clases" text={course.methodology} />

            {course.modules.length > 0 && (
              <section className="border-t-2 border-[#031e41]/10 pt-10">
                <h2 className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${D}`}>Programa</h2>
                <ol className="mt-6 space-y-4">
                  {course.modules.map((m, i) => (
                    <li key={`${i}-${m.title}`} className="rounded-3xl border-2 border-[#031e41] bg-white p-6">
                      <div className="flex items-start gap-4">
                        <span className={`flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-[#031e41] text-lg font-extrabold ${D}`} style={{ background: ['#FFC531', '#FF6FA8', '#2FD3A0', '#9cbadb'][i % 4] }}>{i + 1}</span>
                        <div>
                          <h3 className="pt-2 text-lg font-bold leading-snug">{m.title}</h3>
                          {!!m.topics?.length && (
                            <ul className="mt-3 flex flex-wrap gap-2">
                              {m.topics.filter(Boolean).map((t) => <li key={t} className="rounded-full bg-[#EAF2FB] px-3 py-1 text-sm text-slate-700">{t}</li>)}
                            </ul>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <Block title="Proyecto final" text={course.finalProject} />
          </div>

          {/* Lateral fijo con el pedido */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[28px] border-2 border-[#031e41] bg-[#FFC531] p-7 shadow-[6px_6px_0_#031e41]">
              <h2 className={`text-2xl font-extrabold leading-tight tracking-tight ${D}`}>¿Lo querés en tu escuela?</h2>
              <p className="mt-3 leading-relaxed">Contanos cuántos estudiantes calculás y en qué días podrían cursar. Te armamos la propuesta.</p>
              <a href={ask} target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#031e41] px-6 py-4 font-bold text-white transition hover:-translate-y-0.5">
                <MessageCircle size={18} /> Escribinos por WhatsApp
              </a>
              {course.schools.length > 0 && (
                <p className="mt-6 border-t-2 border-[#031e41]/15 pt-5 text-sm">Hoy ya se dicta en {course.schools.join(' y ')}.</p>
              )}
            </div>
          </aside>
        </div>

        {/* Otras capacitaciones */}
        {others.length > 0 && (
          <section className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
            <h2 className={`text-3xl font-extrabold tracking-tight sm:text-5xl ${D}`}>Otras capacitaciones</h2>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((c) => (
                <li key={c.slug}>
                  <Link href={`/capacitaciones/${c.slug}`} className="group block rounded-[22px] border-2 border-[#031e41] bg-white p-2.5 pb-4 shadow-[5px_5px_0_#031e41] transition duration-300 hover:-translate-y-1.5 hover:shadow-[8px_9px_0_#031e41]">
                    <span className="relative block aspect-[4/3] overflow-hidden rounded-[14px] bg-[#EAF2FB]">
                      {c.image && <Image src={c.image} alt="" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />}
                    </span>
                    <span className={`mt-3.5 block px-1.5 text-lg font-bold leading-snug ${D}`}>{shortTitle(c.title)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <LandingFooter schools={schools} />
    </div>
  );
}
