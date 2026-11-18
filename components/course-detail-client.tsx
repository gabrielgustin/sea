'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, ChevronDown, ChevronRight, Instagram, Lightbulb, Linkedin, MapPin, MessageCircle, Music2, Rocket, Target, Youtube } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSchool } from '@/context/SchoolContext';

// Componente extraído fuera del padre para evitar que se re-monte en cada render
// y así no perder el foco del input al escribir
function InterestForm() {
  const [interestForm, setInterestForm] = useState({ nombre: '', email: '', telefono: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const handleCloseModal = () => {
    setFormSubmitted(false);
    // Limpiar los datos del formulario al cerrar el modal
    setInterestForm({ nombre: '', email: '', telefono: '' });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="border-b-2 border-[#031e41] bg-[var(--accent)] px-6 py-5 text-[var(--accent-ink)]">
          <h3 className="text-2xl font-extrabold [font-family:var(--font-display)]">
            Me interesa esta formación
          </h3>
          <p className="mt-1 text-sm leading-relaxed opacity-80">
            Dejanos tus datos y te avisamos cuando se abra una nueva edición.
          </p>
        </div>
        {!formSubmitted && (
          <form onSubmit={handleSubmit} className="space-y-3 px-6 pb-6">
            <Input
              type="text"
              placeholder="Nombre y Apellido"
              value={interestForm.nombre}
              onChange={(e) => setInterestForm(prev => ({ ...prev, nombre: e.target.value }))}
              required
              className="h-12 w-full rounded-2xl border-2 border-[#031e41] bg-white"
            />
            <Input
              type="email"
              placeholder="Email"
              value={interestForm.email}
              onChange={(e) => setInterestForm(prev => ({ ...prev, email: e.target.value }))}
              required
              className="h-12 w-full rounded-2xl border-2 border-[#031e41] bg-white"
            />
            <Input
              type="tel"
              placeholder="Teléfono"
              value={interestForm.telefono}
              onChange={(e) => setInterestForm(prev => ({ ...prev, telefono: e.target.value }))}
              required
              className="h-12 w-full rounded-2xl border-2 border-[#031e41] bg-white"
            />
            <button
              type="submit"
              className="w-full rounded-full border-2 border-[#031e41] bg-[#031e41] py-3.5 font-bold text-white shadow-[4px_4px_0_var(--accent)] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
            >
              Avisarme
            </button>
          </form>
        )}
      </div>

      {/* Modal flotante de confirmación */}
      {formSubmitted && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Modal */}
          <div className="relative w-full max-w-md space-y-4 rounded-[28px] border-2 border-[#031e41] bg-white p-6 text-center shadow-[8px_8px_0_#031e41] animate-in fade-in zoom-in-95 md:p-8">
            {/* Icono de check */}
            <div className="flex justify-center">
              <div className="flex size-16 items-center justify-center rounded-full border-2 border-[#031e41] bg-[#2FD3A0]">
                <svg className="size-8 text-[#031e41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Contenido */}
            <div>
              <h2 className="mb-2 text-2xl font-extrabold [font-family:var(--font-display)]">
                ¡Consulta recibida!
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Gracias por tu interés en esta formación. Nos pondremos en contacto contigo cuando vuelvan a abrirse las inscripciones.
              </p>
            </div>

            {/* Botón cerrar */}
            <button
              onClick={handleCloseModal}
              className="w-full rounded-full border-2 border-[#031e41] bg-[var(--accent)] py-3.5 font-bold text-[var(--accent-ink)] transition hover:-translate-y-0.5"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}

interface CourseTeacher {
  name: string;
  photo: string;
  description: string;
  linkedin?: string;
  whatsapp?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
}

interface Commission {
  id: string;
  name: string;
  maxCapacity: number;
}

interface Course {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  startDate: string;
  enrollmentDeadline?: string;
  modality: string;
  slug: string;
  description: string;
  schedule: string;
  location: string;
  teacher: string;
  teachers?: CourseTeacher[];
  duration: string;
  price: string;
  objective: string;
  modules: Array<{
    number: string;
    title: string;
    topics: string[];
  }>;
  methodology: string;
  finalProject: string;
  requirements?: string;
  commissions?: Commission[];
}

export default function CourseDetailClient({ course }: { course: Course }) {
  const router = useRouter();
  const { schoolId } = useSchool();
  const [openModule, setOpenModule] = useState<number | null>(0);
  const [enrollmentCounts, setEnrollmentCounts] = useState<Record<string, number>>({});

  // Fetch current enrollment counts per commission
  useEffect(() => {
    if (!course.commissions?.length) return;
    fetch(`/api/${schoolId}/enrollments?courseId=${course.id}`)
      .then(r => r.json())
      .then(data => { if (data.counts) setEnrollmentCounts(data.counts); })
      .catch(() => {});
  }, [course.id, course.commissions, schoolId]);

  // Formatear fecha de YYYY-MM-DD a DD/MM/YYYY
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return dateStr;
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    return `${parseInt(day)}/${month}/${year}`;
  };

  // Parsear una fecha en formato ISO "YYYY-MM-DD" o "Lun 1/06/2026"
  const parseDate = (dateStr: string): Date | null => {
    try {
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
      } else {
        const datePart = dateStr.split(' ').slice(1).join(' ');
        const [day, month, year] = datePart.split('/').map(Number);
        return new Date(year, month - 1, day);
      }
    } catch {
      return null;
    }
  };

  // Verificar si el curso ya ha comenzado
  const hasCourseStarted = (): boolean => {
    if (!course.startDate) return false;
    const startDate = parseDate(course.startDate);
    if (!startDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    return today > startDate;
  };

  // Verificar si estamos dentro del período de inscripción
  const isEnrollmentOpen = (): boolean => {
    if (!course.enrollmentDeadline) {
      // Sin deadline explícito: abierto solo si el curso no comenzó
      return !hasCourseStarted();
    }
    const deadline = parseDate(course.enrollmentDeadline);
    if (!deadline) return true;
    deadline.setHours(23, 59, 59, 999);
    return new Date() <= deadline;
  };

  // Calcular días faltantes para el inicio del curso
  const getDaysUntilStart = (): number | null => {
    if (!course.startDate || hasCourseStarted()) return null;
    const startDate = parseDate(course.startDate);
    if (!startDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    const days = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : null;
  };

  const courseHasStarted = hasCourseStarted();
  const canEnroll = isEnrollmentOpen();

  // Generar mensaje dinámico sobre la fecha de inicio del curso
  const getStartDateMessage = (): string | null => {
    if (!course.startDate) return null;
    if (courseHasStarted) {
      return canEnroll
        ? `El curso comenzó el ${formatDate(course.startDate)}, pero aún puedes inscribirte!`
        : `El curso comenzó el ${formatDate(course.startDate)} y ya no es posible inscribirse.`;
    }
    return `El curso comienza el ${formatDate(course.startDate)}`;
  };

  const days = getDaysUntilStart();
  const facts = [
    { k: courseHasStarted ? 'Inició' : 'Inicia', v: course.startDate ? formatDate(course.startDate) : '' },
    { k: 'Duración', v: course.duration },
    { k: 'Modalidad', v: course.modality },
    { k: 'Horario', v: course.schedule },
  ].filter((f) => f.v);

  // Info box: se reutiliza en móvil (bajo el hero) y en escritorio (fija al costado)
  const InfoBox = () => (
    <div className="overflow-hidden rounded-[28px] border-2 border-[#031e41] bg-white shadow-[7px_7px_0_#031e41]">
      {canEnroll ? (
        <>
          <div className="flex items-end justify-between gap-4 border-b-2 border-[#031e41] bg-[var(--accent)] px-6 py-5 text-[var(--accent-ink)]">
            <div>
              <p className="text-sm font-medium opacity-75">Inversión</p>
              <p className="mt-0.5 text-3xl font-extrabold [font-family:var(--font-display)]">{course.price || 'Consultar'}</p>
            </div>
            {days !== null && (
              <p className="rounded-full border-2 border-[#031e41] bg-white px-3 py-1.5 text-xs font-bold text-[#031e41]">
                Faltan {days} {days === 1 ? 'día' : 'días'}
              </p>
            )}
          </div>
          <div className="space-y-5 p-6">
            {course.commissions && course.commissions.length > 0 && (
              <div>
                <p className="mb-2.5 font-bold">Comisiones</p>
                <div className="space-y-2">
                  {course.commissions.map((commission) => {
                    // Deterministic marketing percentage: 40–75% in steps of 5
                    const idHash = commission.id.split('').reduce((acc: number, ch: string) => acc + ch.charCodeAt(0), 0);
                    const steps = [40, 45, 50, 55, 60, 65, 70, 75];
                    const marketingPct = steps[idHash % steps.length];
                    const realEnrolled = enrollmentCounts[commission.id] ?? 0;
                    const pct = Math.max(marketingPct, Math.min(100, Math.round((realEnrolled / commission.maxCapacity) * 100)));
                    const displayEnrolled = Math.round((pct / 100) * commission.maxCapacity);
                    const available = commission.maxCapacity - displayEnrolled;
                    const isFull = available <= 0;
                    const isAlmostFull = !isFull && pct >= 65;
                    const barColor = isFull ? '#ef4444' : isAlmostFull ? '#f59e0b' : '#22c55e';
                    return (
                      <div key={commission.id} className="rounded-2xl border-2 border-[#031e41] p-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-slate-800">{commission.name}</span>
                          {isFull ? (
                            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">Completa</span>
                          ) : (
                            <span className={`text-xs font-medium ${isAlmostFull ? 'text-amber-600' : 'text-slate-500'}`}>{available} {available === 1 ? 'lugar' : 'lugares'}</span>
                          )}
                        </div>
                        <div className="mt-2.5 h-2.5 overflow-hidden rounded-full border-2 border-[#031e41] bg-white">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {course.requirements && (
              <div>
                <p className="font-bold">Requisitos</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">{course.requirements}</p>
              </div>
            )}
            {course.location && (
              <div className="flex items-start gap-2.5 text-sm text-slate-700">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#031e41]" />
                {course.location}
              </div>
            )}
            <button
              onClick={() => router.push(`/${schoolId}/inscripcion/${course.id}`)}
              className="group flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#031e41] bg-[#031e41] py-4 font-bold text-white shadow-[4px_4px_0_var(--accent)] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--accent)] active:translate-y-0 active:shadow-none"
            >
              Inscribirme <ArrowRight size={17} className="transition group-hover:translate-x-1" />
            </button>
            {course.startDate && days === null && <p className="text-center text-xs leading-relaxed text-slate-400">{getStartDateMessage()}</p>}
          </div>
        </>
      ) : (
        /* Inscripciones cerradas: formulario de interés */
        <InterestForm />
      )}
    </div>
  );

  return (
    <div className="w-full">
      {/* Hero: tablero claro, datos a la izquierda y la foto como polaroid */}
      <section className="relative -mt-[76px] overflow-hidden bg-[#EAF2FB] px-5 pb-16 pt-32 sm:px-8 sm:pt-40" style={{ backgroundImage: 'radial-gradient(rgb(3 30 65 / .14) 1.4px, transparent 1.6px)', backgroundSize: '26px 26px' }}>
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <nav aria-label="Ruta" className="rise flex items-center gap-1.5 text-sm font-medium text-[#031e41]/60">
              <Link href={`/${schoolId}/catalogo-formaciones`} className="rounded-full border-2 border-[#031e41] bg-white px-3 py-1 text-[#031e41] transition hover:bg-[var(--accent)] hover:text-[var(--accent-ink)]">Formaciones</Link>
              <ChevronRight size={14} />
              <span className="line-clamp-1">{course.title}</span>
            </nav>
            {course.badge && (
              <span className="rise mt-6 inline-block rounded-full border-2 border-[#031e41] bg-[var(--accent)] px-3.5 py-1 text-sm font-bold text-[var(--accent-ink)]" style={{ animationDelay: '.05s' }}>{course.badge}</span>
            )}
            <h1 className="rise mt-4 max-w-4xl text-balance text-5xl font-extrabold leading-[0.95] tracking-[-0.035em] [font-family:var(--font-display)] sm:text-7xl" style={{ animationDelay: '.1s' }}>
              {course.title}
            </h1>
            {course.subtitle && <p className="rise mt-5 max-w-2xl text-xl leading-relaxed text-[#031e41]/75" style={{ animationDelay: '.15s' }}>{course.subtitle}</p>}
            {facts.length > 0 && (
              <dl className="rise mt-8 flex flex-wrap gap-2.5" style={{ animationDelay: '.2s' }}>
                {facts.map((f) => (
                  <div key={f.k} className="rounded-2xl border-2 border-[#031e41] bg-white px-4 py-2">
                    <dt className="text-xs font-medium text-[#031e41]/55">{f.k}</dt>
                    <dd className="font-bold">{f.v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
          <div className="drop relative mx-auto w-[88%] max-w-lg" style={{ animationDelay: '.25s' }}>
            <div className="float">
              <div className="relative rotate-2 rounded-[28px] border-2 border-[#031e41] bg-white p-3 shadow-[8px_8px_0_#031e41]">
                <span aria-hidden className="absolute -top-3.5 left-1/2 z-10 h-7 w-24 -translate-x-1/2 -rotate-3 rounded-sm bg-[var(--accent)] opacity-90" />
                <span className="relative block aspect-[4/3] overflow-hidden rounded-[18px] bg-[#EAF2FB]">
                  <Image src={course.image} alt={course.title} fill priority sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 px-4 pt-2 lg:hidden">
        <InfoBox />
      </div>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          <div className="min-w-0 flex-1 space-y-14">
            <div className="reveal">
              <h2 className="text-3xl font-extrabold tracking-tight [font-family:var(--font-display)] sm:text-4xl">Sobre este curso</h2>
              <p className="mt-4 whitespace-pre-wrap text-lg leading-relaxed text-slate-700">{course.description}</p>
            </div>

            {course.objective && (
              <div className="reveal relative overflow-hidden rounded-[28px] border-2 border-[#031e41] bg-[#FFF4D1] p-7 shadow-[6px_6px_0_#031e41]">
                <Target className="absolute -right-4 -top-4 size-28 text-[#031e41]/10" aria-hidden />
                <h2 className="text-2xl font-extrabold [font-family:var(--font-display)]">Objetivo</h2>
                <p className="relative mt-3 text-lg leading-relaxed text-slate-800">{course.objective}</p>
              </div>
            )}

            {course.modules && course.modules.length > 0 && (
              <div className="reveal">
                <div className="flex items-end justify-between gap-4">
                  <h2 className="text-3xl font-extrabold tracking-tight [font-family:var(--font-display)] sm:text-4xl">Programa</h2>
                  <p className="rounded-full border-2 border-[#031e41] bg-white px-3 py-1 text-sm font-bold">{course.modules.length} unidades</p>
                </div>
                <ol className="mt-6 space-y-3">
                  {course.modules.map((module, index) => {
                    const isOpen = openModule === index;
                    return (
                      <li key={index} className={`overflow-hidden rounded-3xl border-2 border-[#031e41] transition-colors ${isOpen ? 'bg-[#EAF2FB]' : 'bg-white'}`}>
                        <button onClick={() => setOpenModule(isOpen ? null : index)} aria-expanded={isOpen} className="flex w-full items-center gap-4 px-5 py-4 text-left">
                          <span className={`flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-[#031e41] text-sm font-extrabold transition [font-family:var(--font-display)] ${isOpen ? 'bg-[var(--accent)] text-[var(--accent-ink)]' : 'bg-white'}`}>
                            {module.number || index + 1}
                          </span>
                          <span className="flex-1 font-semibold">{module.title}</span>
                          <ChevronDown size={20} className={`shrink-0 transition duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                          <div className="overflow-hidden">
                            <ul className="space-y-2 px-5 pb-5 pl-[4.75rem]">
                              {module.topics?.map((topic, t) => (
                                <li key={t} className="flex gap-2.5 text-slate-700"><Check size={16} strokeWidth={3} className="mt-1 shrink-0" />{topic}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

            {(course.methodology || course.finalProject) && (
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Lightbulb, title: 'Metodología', text: course.methodology },
                  { icon: Rocket, title: 'Proyecto final', text: course.finalProject },
                ].filter((b) => b.text).map(({ icon: Icon, title, text }) => (
                  <div key={title} className="reveal rounded-[28px] border-2 border-[#031e41] bg-white p-7 shadow-[6px_6px_0_#031e41]">
                    <span className="flex size-12 items-center justify-center rounded-full border-2 border-[#031e41] bg-[var(--accent)] text-[var(--accent-ink)]"><Icon size={21} /></span>
                    <h3 className="mt-5 text-2xl font-bold [font-family:var(--font-display)]">{title}</h3>
                    <p className="mt-2 whitespace-pre-wrap leading-relaxed text-slate-700">{text}</p>
                  </div>
                ))}
              </div>
            )}

            {course.teachers && course.teachers.length > 0 ? (
              <div className="reveal">
                <h2 className="text-3xl font-extrabold tracking-tight [font-family:var(--font-display)] sm:text-4xl">Docente{course.teachers.length > 1 ? 's' : ''}</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {course.teachers.map((teacher, index) => {
                    const socials = [
                      teacher.linkedin && { href: teacher.linkedin, label: 'LinkedIn', icon: Linkedin },
                      teacher.whatsapp && { href: `https://wa.me/${teacher.whatsapp}?text=${encodeURIComponent('Hola profe!')}`, label: 'WhatsApp', icon: MessageCircle },
                      teacher.instagram && { href: teacher.instagram, label: 'Instagram', icon: Instagram },
                      teacher.tiktok && { href: teacher.tiktok, label: 'TikTok', icon: Music2 },
                      teacher.youtube && { href: teacher.youtube, label: 'YouTube', icon: Youtube },
                    ].filter(Boolean) as { href: string; label: string; icon: typeof Instagram }[];
                    return (
                      <div key={index} className="group rounded-[28px] border-2 border-[#031e41] bg-white p-6 shadow-[6px_6px_0_#031e41] transition hover:-translate-y-1">
                        <div className="flex items-center gap-4">
                          <div className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-[#031e41] bg-[#EAF2FB]">
                            {teacher.photo && <Image src={teacher.photo} alt={teacher.name} fill sizes="64px" className="object-cover" />}
                          </div>
                          <h3 className="text-xl font-bold [font-family:var(--font-display)]">{teacher.name}</h3>
                        </div>
                        {teacher.description && <p className="mt-4 text-sm leading-relaxed text-slate-600">{teacher.description}</p>}
                        {socials.length > 0 && (
                          <div className="mt-4 flex gap-2">
                            {socials.map(({ href, label, icon: Icon }) => (
                              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} de ${teacher.name}`} className="flex size-9 items-center justify-center rounded-full border-2 border-[#031e41] bg-white transition hover:bg-[var(--accent)] hover:text-[var(--accent-ink)]">
                                <Icon size={16} />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : course.teacher ? (
              <div className="reveal flex items-center gap-4 rounded-[28px] border-2 border-[#031e41] bg-white p-6 shadow-[6px_6px_0_#031e41]">
                <span className="flex size-14 items-center justify-center rounded-full border-2 border-[#031e41] bg-[var(--accent)] text-xl font-bold text-[var(--accent-ink)]">{course.teacher.charAt(0)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{course.teacher}</h3>
                  <p className="text-sm text-slate-500">Docente del curso</p>
                </div>
              </div>
            ) : null}
          </div>

          <aside className="hidden w-[380px] shrink-0 lg:block">
            <div className="sticky top-28">
              <InfoBox />
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
