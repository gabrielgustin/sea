'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  commissions?: Commission[];
}

export default function CourseDetailClient({ course }: { course: Course }) {
  const router = useRouter();
  const { schoolId } = useSchool();
  const [modulesExpanded, setModulesExpanded] = useState(false);
  const [enrollmentCounts, setEnrollmentCounts] = useState<Record<string, number>>({});

  // Fetch current enrollment counts per commission
  useEffect(() => {
    if (!course.commissions?.length) return;
    fetch(`/api/enrollments?courseId=${course.id}&schoolId=${schoolId}`)
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

  // Info box content — reutilizado en móvil y desktop
  const InfoBox = () => (
    <div className="bg-white rounded-2xl border-2 overflow-hidden" style={{ borderColor: '#031e41' }}>
      {canEnroll ? (
        <>
          {/* Datos del curso en bloques apilados */}
          <div className="space-y-1">
            <div className="p-4 border-b border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                {hasCourseStarted() ? 'Inició' : 'Inicia'}
              </p>
              <p className="text-sm font-bold text-gray-900">{formatDate(course.startDate)}</p>
            </div>
            <div className="p-4 border-b border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Duración</p>
              <p className="text-sm font-bold text-gray-900">{course.duration}</p>
            </div>
            {course.commissions && course.commissions.length > 0 ? (
              <div className="p-4 border-b border-gray-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Comisiones disponibles</p>
                <div className="space-y-2">
                  {course.commissions.map((commission) => {
                    const enrolled = enrollmentCounts[commission.id] ?? 0;
                    const available = commission.maxCapacity - enrolled;
                    const pct = Math.min(100, Math.round((enrolled / commission.maxCapacity) * 100));
                    const isFull = available <= 0;
                    const isAlmostFull = !isFull && pct >= 75;
                    const barColor = isFull ? '#ef4444' : isAlmostFull ? '#f59e0b' : '#22c55e';

                    return (
                      <div key={commission.id} className="rounded-lg border overflow-hidden" style={{ borderColor: isFull ? '#fecaca' : '#e5e7eb' }}>
                        <div className="flex items-center justify-between px-3 py-2" style={{ backgroundColor: isFull ? '#fff5f5' : '#f9fafb' }}>
                          <span className="text-sm font-semibold text-gray-800">{commission.name}</span>
                          {isFull ? (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fecaca', color: '#dc2626' }}>Completa</span>
                          ) : (
                            <span className="text-xs font-medium text-gray-500">{available} {available === 1 ? 'lugar' : 'lugares'}</span>
                          )}
                        </div>
                        {/* Capacity bar */}
                        <div className="h-1.5 w-full bg-gray-100">
                          <div
                            className="h-1.5 transition-all duration-300"
                            style={{ width: `${pct}%`, backgroundColor: barColor }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
            {course.requirements && (
              <div className="p-4 border-b border-gray-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Requisitos</p>
                <p className="text-sm text-gray-900 leading-relaxed">{course.requirements}</p>
              </div>
            )}
            <div className="p-4 border-b border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Lugar</p>
              <p className="text-sm font-bold text-gray-900">{course.location}</p>
            </div>
          </div>

          {/* Precio + CTA */}
          <div className="p-4 md:p-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Inversión</p>
              <p className="text-xl font-bold" style={{ color: '#031e41' }}>{course.price}</p>
            </div>
            <button
              onClick={() => router.push(`/${schoolId}/inscripcion/${course.id}`)}
              className="w-full py-3 rounded-xl font-bold text-white text-sm md:text-base transition-all duration-300 hover:shadow-lg hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#031e41' }}
            >
              Inscribirme
            </button>

            {/* Mensaje dinámico: días faltantes o curso ya comenzado */}
            {course.startDate && (
              <div className="mt-3">
                {!hasCourseStarted() && getDaysUntilStart() !== null ? (
                  /* Curso no comenzado: mostrar días faltantes */
                  <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                    <p className="text-xs font-semibold text-amber-700 text-center">
                      Faltan <span className="text-amber-900 font-bold">{getDaysUntilStart()} {getDaysUntilStart() === 1 ? 'día' : 'días'}</span> para que comience
                    </p>
                  </div>
                ) : (
                  /* Curso ya comenzado: mostrar mensaje actual */
                  <p className="text-xs text-gray-400 text-center leading-relaxed">
                    {getStartDateMessage()}
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Inscripciones cerradas: formulario de interés */
        <InterestForm />
      )}
    </div>
  );

  return (
    <div className="w-full bg-white">

      {/* Hero */}
      <section className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 overflow-hidden">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Badge + Título sobre la imagen */}
        <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-6 lg:px-10 pb-6 md:pb-8">
          <span
            className="inline-block self-start px-3 py-1 rounded-full text-white font-bold text-xs md:text-sm mb-3"
            style={{ backgroundColor: '#9cbadb', color: '#031e41' }}
          >
            {course.badge}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl text-balance">
            {course.title}
          </h1>
          <p className="text-sm md:text-base text-white/80 mt-2 max-w-xl line-clamp-2">
            {course.subtitle}
          </p>
        </div>
      </section>

      {/* Info box en móvil — aparece JUSTO bajo el hero */}
      <div className="lg:hidden px-4 sm:px-6 py-5">
        <InfoBox />
      </div>

      {/* Contenido principal */}
      <section className="w-full px-4 sm:px-6 lg:px-10 py-8 md:py-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* Columna izquierda */}
          <div className="flex-1 min-w-0">

            {/* Descripción */}
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4" style={{ color: '#031e41' }}>
                Sobre este curso
              </h2>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-wrap">
                {course.description}
              </p>
            </div>

            {/* Objetivo */}
            {course.objective && (
              <div className="mb-8 p-4 md:p-5 rounded-xl bg-blue-50 border border-blue-100">
                <h2 className="text-base md:text-lg font-bold mb-2" style={{ color: '#031e41' }}>
                  Objetivo del curso
                </h2>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  {course.objective}
                </p>
              </div>
            )}

            {/* Contenidos colapsables */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold" style={{ color: '#031e41' }}>
                  Contenidos
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModulesExpanded(!modulesExpanded)}
                  className="flex items-center gap-2 border-2 transition-all duration-300 text-xs md:text-sm"
                  style={{ borderColor: '#031e41', color: '#031e41' }}
                >
                  {modulesExpanded ? (
                    <><span>Ocultar</span><ChevronUp size={16} /></>
                  ) : (
                    <><span>Ver unidades ({course.modules?.length || 0})</span><ChevronDown size={16} /></>
                  )}
                </Button>
              </div>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  modulesExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="space-y-3">
                  {course.modules && course.modules.map((module: any, index: number) => (
                    <div key={index} className="bg-white border-l-4 p-4 rounded-xl shadow-sm" style={{ borderColor: '#9cbadb' }}>
                      <div className="flex items-start gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs"
                          style={{ backgroundColor: '#031e41' }}
                        >
                          {module.number}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2">{module.title}</h3>
                          <ul className="space-y-1">
                            {module.topics && module.topics.map((topic: string, topicIndex: number) => (
                              <li key={topicIndex} className="flex items-start gap-2 text-gray-600 text-xs md:text-sm">
                                <span className="text-gray-400 flex-shrink-0 mt-0.5">•</span>
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {!modulesExpanded && course.modules && course.modules.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-600">
                    Este curso incluye{' '}
                    <span className="font-bold" style={{ color: '#031e41' }}>{course.modules.length} unidades</span>{' '}
                    de contenido. Tocá el botón para ver el programa completo.
                  </p>
                </div>
              )}
            </div>

            {/* Metodología y Proyecto Final */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
              <div className="p-4 md:p-5 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="text-sm md:text-base font-bold mb-2" style={{ color: '#031e41' }}>
                  Metodología
                </h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {course.methodology}
                </p>
              </div>
              <div className="p-4 md:p-5 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="text-sm md:text-base font-bold mb-2" style={{ color: '#031e41' }}>
                  Proyecto Final
                </h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {course.finalProject}
                </p>
              </div>
            </div>

            {/* Docentes */}
            {course.teachers && course.teachers.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6" style={{ color: '#031e41' }}>
                  Docente{course.teachers.length > 1 ? 's' : ''}
                </h2>
                <div className="space-y-4">
                  {course.teachers.map((teacher, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 md:p-5 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow duration-300"
                    >
                      <div
                        className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0 border-2"
                        style={{ borderColor: '#9cbadb' }}
                      >
                        <Image
                          src={teacher.photo || '/placeholder-teacher.jpg'}
                          alt={teacher.name}
                          fill
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-bold text-gray-900">{teacher.name}</h3>
                        <p className="text-xs md:text-sm text-gray-600 mt-1 leading-relaxed">{teacher.description}</p>
                        <div className="flex items-center gap-3 mt-3">
                          {teacher.linkedin && (
                            <a
                              href={teacher.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="transition-all duration-300 hover:scale-110"
                              title="Ver perfil de LinkedIn"
                            >
                              <Image src="/linkedin.png" alt="LinkedIn" width={24} height={24} />
                            </a>
                          )}
                          {teacher.whatsapp && (
                            <a
                              href={`https://wa.me/${teacher.whatsapp}?text=${encodeURIComponent('Hola profe!')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="transition-all duration-300 hover:scale-110"
                              title="Contactar por WhatsApp"
                            >
                              <Image src="/whatsapp.png" alt="WhatsApp" width={24} height={24} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Docente básico fallback */}
            {(!course.teachers || course.teachers.length === 0) && course.teacher && (
              <div className="mb-8 p-4 md:p-5 rounded-xl border border-gray-200 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-xl font-bold text-gray-500">
                  {course.teacher.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900">{course.teacher}</h3>
                  <p className="text-xs md:text-sm text-gray-500">Docente del curso</p>
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha — Info box sticky solo en desktop */}
          <div className="hidden lg:block w-80 xl:w-96 flex-shrink-0">
            <div className="sticky top-24">
              <InfoBox />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
