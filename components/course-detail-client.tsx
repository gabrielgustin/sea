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
      <div className="p-4 md:p-6 space-y-4">
        <div>
          <h3 className="text-base md:text-lg font-bold mb-1" style={{ color: '#031e41' }}>
            Me interesa esta formación
          </h3>
          <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
            Dejanos tus datos y te avisamos cuando se abra una nueva edición.
          </p>
        </div>
        {!formSubmitted && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="text"
              placeholder="Nombre y Apellido"
              value={interestForm.nombre}
              onChange={(e) => setInterestForm(prev => ({ ...prev, nombre: e.target.value }))}
              required
              className="w-full border-gray-300 rounded-lg text-sm"
            />
            <Input
              type="email"
              placeholder="Email"
              value={interestForm.email}
              onChange={(e) => setInterestForm(prev => ({ ...prev, email: e.target.value }))}
              required
              className="w-full border-gray-300 rounded-lg text-sm"
            />
            <Input
              type="tel"
              placeholder="Teléfono"
              value={interestForm.telefono}
              onChange={(e) => setInterestForm(prev => ({ ...prev, telefono: e.target.value }))}
              required
              className="w-full border-gray-300 rounded-lg text-sm"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all duration-300 hover:shadow-lg hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#031e41' }}
            >
              Enviar
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
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full text-center space-y-4 animate-in fade-in zoom-in-95">
            {/* Icono de check */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#031e41' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Contenido */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#031e41' }}>
                ¡Consulta recibida!
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Gracias por tu interés en esta formación. Nos pondremos en contacto contigo cuando vuelvan a abrirse las inscripciones.
              </p>
            </div>

            {/* Botón cerrar */}
            <button
              onClick={handleCloseModal}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-300 hover:shadow-lg hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#031e41' }}
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
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_30px_60px_-30px_rgb(3_30_65/0.35)]">
      {canEnroll ? (
        <>
          <div className="flex items-end justify-between gap-4 bg-[#031e41] px-6 py-5 text-white">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">Inversión</p>
              <p className="mt-1 text-2xl font-semibold">{course.price || 'Consultar'}</p>
            </div>
            {days !== null && (
              <p className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium">
                Faltan <span className="font-semibold text-[#9cbadb]">{days} {days === 1 ? 'día' : 'días'}</span>
              </p>
            )}
          </div>
          <div className="space-y-5 p-6">
            {course.commissions && course.commissions.length > 0 && (
              <div>
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Comisiones</p>
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
                      <div key={commission.id} className="rounded-2xl border border-slate-200 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-slate-800">{commission.name}</span>
                          {isFull ? (
                            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">Completa</span>
                          ) : (
                            <span className={`text-xs font-medium ${isAlmostFull ? 'text-amber-600' : 'text-slate-500'}`}>{available} {available === 1 ? 'lugar' : 'lugares'}</span>
                          )}
                        </div>
                        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
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
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Requisitos</p>
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
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#031e41] py-4 font-semibold text-white transition hover:bg-[#0b2d5c] active:scale-[.98]"
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
      {/* Hero */}
      <section data-nav="dark" className="relative -mt-[76px] flex min-h-[78svh] items-end overflow-hidden bg-[#031e41] text-white">
        <Image src={course.image} alt="" fill priority sizes="100vw" className="kenburns object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-40 sm:px-8 sm:pb-20">
          <nav aria-label="Ruta" className="rise flex items-center gap-1.5 text-sm text-white/60">
            <Link href={`/${schoolId}/catalogo-formaciones`} className="transition hover:text-white">Formaciones</Link>
            <ChevronRight size={14} />
            <span className="line-clamp-1 text-white/85">{course.title}</span>
          </nav>
          {course.badge && (
            <span className="rise mt-5 inline-block rounded-full bg-[#9cbadb] px-3.5 py-1 text-xs font-semibold text-[#031e41]" style={{ animationDelay: '.05s' }}>{course.badge}</span>
          )}
          <h1 className="rise mt-4 max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl" style={{ animationDelay: '.1s' }}>
            {course.title}
          </h1>
          {course.subtitle && <p className="rise mt-5 max-w-2xl text-lg text-white/70" style={{ animationDelay: '.15s' }}>{course.subtitle}</p>}
          {facts.length > 0 && (
            <dl className="rise mt-8 flex flex-wrap gap-2" style={{ animationDelay: '.2s' }}>
              {facts.map((f) => (
                <div key={f.k} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-md">
                  <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/55">{f.k}</dt>
                  <dd className="text-sm font-semibold">{f.v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      <div className="relative z-10 -mt-6 px-4 lg:hidden">
        <InfoBox />
      </div>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          <div className="min-w-0 flex-1 space-y-14">
            <div className="reveal">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Sobre este curso</h2>
              <p className="mt-4 whitespace-pre-wrap text-lg leading-relaxed text-slate-600">{course.description}</p>
            </div>

            {course.objective && (
              <div className="reveal relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#eef3f9] to-white p-7 ring-1 ring-slate-200">
                <Target className="absolute -right-4 -top-4 size-28 text-[#9cbadb]/30" aria-hidden />
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#031e41]/60">Objetivo</h2>
                <p className="relative mt-3 text-lg leading-relaxed text-slate-800">{course.objective}</p>
              </div>
            )}

            {course.modules && course.modules.length > 0 && (
              <div className="reveal">
                <div className="flex items-end justify-between gap-4">
                  <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Programa</h2>
                  <p className="text-sm text-slate-400">{course.modules.length} unidades</p>
                </div>
                <ol className="mt-6 space-y-3">
                  {course.modules.map((module, index) => {
                    const isOpen = openModule === index;
                    return (
                      <li key={index} className={`overflow-hidden rounded-3xl border transition-colors ${isOpen ? 'border-[#031e41]/20 bg-[#f4f7fb]' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                        <button onClick={() => setOpenModule(isOpen ? null : index)} aria-expanded={isOpen} className="flex w-full items-center gap-4 px-5 py-4 text-left">
                          <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-semibold transition ${isOpen ? 'bg-[#031e41] text-white' : 'bg-slate-100 text-[#031e41]'}`}>
                            {module.number || index + 1}
                          </span>
                          <span className="flex-1 font-medium text-slate-900">{module.title}</span>
                          <ChevronDown size={18} className={`shrink-0 text-slate-400 transition duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                          <div className="overflow-hidden">
                            <ul className="space-y-2 px-5 pb-5 pl-[4.75rem]">
                              {module.topics?.map((topic, t) => (
                                <li key={t} className="flex gap-2.5 text-slate-600"><Check size={16} className="mt-1 shrink-0 text-[#031e41]" />{topic}</li>
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
                  <div key={title} className="reveal rounded-[1.75rem] border border-slate-200 p-7">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-[#eef3f9] text-[#031e41]"><Icon size={20} /></span>
                    <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
                    <p className="mt-2 leading-relaxed text-slate-600">{text}</p>
                  </div>
                ))}
              </div>
            )}

            {course.teachers && course.teachers.length > 0 ? (
              <div className="reveal">
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Docente{course.teachers.length > 1 ? 's' : ''}</h2>
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
                      <div key={index} className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgb(3_30_65/0.3)]">
                        <div className="flex items-center gap-4">
                          <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                            {teacher.photo && <Image src={teacher.photo} alt={teacher.name} fill sizes="64px" className="object-cover" />}
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900">{teacher.name}</h3>
                        </div>
                        {teacher.description && <p className="mt-4 text-sm leading-relaxed text-slate-600">{teacher.description}</p>}
                        {socials.length > 0 && (
                          <div className="mt-4 flex gap-2">
                            {socials.map(({ href, label, icon: Icon }) => (
                              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} de ${teacher.name}`} className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-[#031e41] transition hover:bg-[#031e41] hover:text-white">
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
              <div className="reveal flex items-center gap-4 rounded-[1.75rem] border border-slate-200 p-6">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-xl font-semibold text-slate-500">{course.teacher.charAt(0)}</span>
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
