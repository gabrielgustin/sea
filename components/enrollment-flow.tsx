'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Course, Commission } from '@/context/CoursesContext';
import { useSchool } from '@/context/SchoolContext';
import { ArrowLeft, ArrowRight, Calendar, Clock, User, CheckCircle, Mail, Phone, CreditCard, AlertCircle, Users } from 'lucide-react';
import { submitEnrollment } from '@/app/actions/enrollments';

interface EnrollmentFlowProps {
  course: Course;
}

interface StudentData {
  nombre: string;
  dni: string;
  email: string;
  telefono: string;
}

export default function EnrollmentFlow({ course }: EnrollmentFlowProps) {
  const router = useRouter();
  const { schoolId } = useSchool();

  const hasCommissions = (course.commissions || []).length > 0;
  // Dynamic step count: if commissions exist, we insert a commission-selection step
  const totalSteps = hasCommissions ? 5 : 4;

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [enrollmentCounts, setEnrollmentCounts] = useState<Record<string, number>>({});
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [studentData, setStudentData] = useState<StudentData>({ nombre: '', dni: '', email: '', telefono: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStudentDataVerified, setIsStudentDataVerified] = useState(false);


  const progress = (currentStep / totalSteps) * 100;

  // Fetch enrollment counts when component mounts (to show capacity)
  useEffect(() => {
    if (!hasCommissions) return;
    const fetchCounts = async () => {
      setLoadingCounts(true);
      try {
        const res = await fetch(`/api/enrollments?courseId=${course.id}&schoolId=${schoolId}`);
        if (res.ok) {
          const data = await res.json();
          setEnrollmentCounts(data.counts || {});
        }
      } catch (_) {}
      setLoadingCounts(false);
    };
    fetchCounts();
  }, [course.id, schoolId, hasCommissions]);

  const getAvailableSpots = (commission: Commission) => {
    const enrolled = enrollmentCounts[commission.id] || 0;
    return Math.max(0, commission.maxCapacity - enrolled);
  };

  const isCommissionFull = (commission: Commission) => getAvailableSpots(commission) === 0;

  // Map steps: if has commissions, step 2 = commission. Otherwise step 2 = student data
  // Steps: 1=Course, 2=Commission(optional), 3=StudentData, 4=Review, 5=Done
  // Without commissions: 1=Course, 2=StudentData, 3=Review, 4=Done
  const getStepLabels = () =>
    hasCommissions
      ? ['Curso', 'Comision', 'Datos', 'Revision', 'Listo']
      : ['Curso', 'Datos', 'Revision', 'Listo'];

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push(`/${schoolId}/cursos/${course.slug || course.id}`);
    }
  };

  const handleInputChange = (field: keyof StudentData, value: string) => {
    setStudentData(prev => ({ ...prev, [field]: value }));
  };

  // Which "logical" step we are in (commission, data, review, done)
  const getLogicalStep = () => {
    if (!hasCommissions) {
      // Steps: 1=course, 2=data, 3=review, 4=done
      if (currentStep === 1) return 'course';
      if (currentStep === 2) return 'data';
      if (currentStep === 3) return 'review';
      return 'done';
    } else {
      // Steps: 1=course, 2=commission, 3=data, 4=review, 5=done
      if (currentStep === 1) return 'course';
      if (currentStep === 2) return 'commission';
      if (currentStep === 3) return 'data';
      if (currentStep === 4) return 'review';
      return 'done';
    }
  };

  const canProceed = () => {
    const logical = getLogicalStep();
    if (logical === 'commission') return selectedCommission !== null && !isCommissionFull(selectedCommission);
    if (logical === 'data') return !!(studentData.nombre && studentData.dni && studentData.email && studentData.telefono && isStudentDataVerified);
    return true;
  };

  const isConfirmStep = () => getLogicalStep() === 'review';

  const handleConfirmEnrollment = async () => {
    setIsSubmitting(true);
    try {
      const parts = studentData.nombre.trim().split(' ');
      const nombre = parts[0] ?? '';
      const apellido = parts.slice(1).join(' ') || '';

      console.log('[v0] Starting enrollment submission:', {
        schoolId,
        courseId: course.id,
        courseName: course.title,
        commissionId: selectedCommission?.id,
        nombre,
        apellido,
        email: studentData.email,
      });

      await submitEnrollment({
        schoolId,
        courseId: String(course.id),
        courseName: course.title,
        commissionId: selectedCommission?.id,
        commissionName: selectedCommission?.name,
        nombre,
        apellido,
        email: studentData.email,
        telefono: studentData.telefono,
        dni: studentData.dni,
      });

      console.log('[v0] Enrollment submitted successfully');
    } catch (err) {
      console.error('[v0] Error submitting enrollment:', err);
    } finally {
      setCurrentStep(totalSteps); // Go to success step
      setIsSubmitting(false);
    }
  };

  // ── Paso 1: Confirmar Curso ──────────────────────────────────────────────
  const renderStepCourse = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-4" style={{ borderColor: '#9cbadb' }}>
          <span className="text-xs md:text-sm font-bold" style={{ color: '#031e41' }}>INSCRIPCION</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold mb-2 text-balance" style={{ color: '#031e41' }}>
          Confirma tu <span style={{ color: '#9cbadb', fontStyle: 'italic' }}>Curso</span>
        </h1>
        <p className="text-sm md:text-base text-gray-600">Estas a punto de inscribirte en un excelente programa</p>
      </div>

      <div className="rounded-2xl p-4 md:p-6" style={{ backgroundColor: '#ffffff', border: '2px solid #9cbadb' }}>
        <div className="flex items-start gap-3 md:gap-4 mb-5">
          <div className="min-w-0">
            <span className="inline-block px-3 py-1 rounded text-xs font-bold mb-2" style={{ backgroundColor: '#9cbadb', color: '#031e41' }}>
              {course.level || 'PRINCIPIANTE'}
            </span>
            <h2 className="text-lg md:text-2xl font-bold mb-1 leading-snug" style={{ color: '#031e41' }}>{course.title}</h2>
            <p className="text-gray-600 text-xs md:text-sm line-clamp-2">{course.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="rounded-xl p-3 md:p-4" style={{ backgroundColor: '#f8f9fa', border: '1px solid #9cbadb' }}>
            <div className="flex items-center gap-2 mb-1"><Calendar size={14} style={{ color: '#031e41' }} /><span className="text-xs text-gray-500 font-medium">Modalidad</span></div>
            <p className="font-semibold text-sm" style={{ color: '#031e41' }}>{course.modality}</p>
          </div>
          <div className="rounded-xl p-3 md:p-4" style={{ backgroundColor: '#f8f9fa', border: '1px solid #9cbadb' }}>
            <div className="flex items-center gap-2 mb-1"><Clock size={14} style={{ color: '#031e41' }} /><span className="text-xs text-gray-500 font-medium">Duracion</span></div>
            <p className="font-semibold text-sm" style={{ color: '#031e41' }}>{course.duration}</p>
          </div>
          <div className="rounded-xl p-3 md:p-4" style={{ backgroundColor: '#f8f9fa', border: '1px solid #9cbadb' }}>
            <div className="flex items-center gap-2 mb-1"><User size={14} style={{ color: '#031e41' }} /><span className="text-xs text-gray-500 font-medium">Docente</span></div>
            <p className="font-semibold text-sm" style={{ color: '#031e41' }}>{course.teacher || 'Por confirmar'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <CheckCircle size={16} style={{ color: '#031e41' }} />
          <span className="text-gray-700 text-xs md:text-sm font-medium">Certificado oficial al finalizar</span>
        </div>
      </div>
    </div>
  );

  // ── Paso 2 (opcional): Seleccionar Comision ──────────────────────────────
  const renderStepCommission = () => {
    const commissions = course.commissions || [];
    return (
      <div className="space-y-5">
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-1 text-balance" style={{ color: '#031e41' }}>
            Elige tu <span style={{ color: '#9cbadb', fontStyle: 'italic' }}>Comision</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600">Selecciona el horario que mejor se adapte a ti</p>
        </div>

        {loadingCounts ? (
          <div className="text-center py-8 text-gray-400 text-sm">Cargando disponibilidad...</div>
        ) : (
          <div className="space-y-3">
            {commissions.map((commission) => {
              const spots = getAvailableSpots(commission);
              const full = spots === 0;
              const enrolled = enrollmentCounts[commission.id] || 0;
              const fillPct = Math.min(100, (enrolled / commission.maxCapacity) * 100);
              const isSelected = selectedCommission?.id === commission.id;

              return (
                <button
                  key={commission.id}
                  type="button"
                  disabled={full}
                  onClick={() => setSelectedCommission(commission)}
                  className="w-full text-left rounded-2xl p-4 md:p-5 transition-all"
                  style={{
                    border: `2px solid ${full ? '#e5e7eb' : isSelected ? '#031e41' : '#9cbadb'}`,
                    backgroundColor: full ? '#f9fafb' : isSelected ? 'rgba(3,30,65,0.04)' : '#ffffff',
                    opacity: full ? 0.7 : 1,
                    cursor: full ? 'not-allowed' : 'pointer',
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {/* Radio circle */}
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{ borderColor: isSelected ? '#031e41' : '#9cbadb' }}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#031e41' }} />}
                      </div>
                      <div>
                        <p className="font-bold text-sm md:text-base" style={{ color: full ? '#9ca3af' : '#031e41' }}>
                          {commission.name || `Comision ${(course.commissions || []).indexOf(commission) + 1}`}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: full ? '#ef4444' : '#6b7280' }}>
                          {full ? 'Sin lugares disponibles' : `${spots} lugar${spots !== 1 ? 'es' : ''} disponible${spots !== 1 ? 's' : ''}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Users size={13} style={{ color: '#6b7280' }} />
                      <span className="text-xs font-medium text-gray-500">{enrolled}/{commission.maxCapacity}</span>
                    </div>
                  </div>

                  {/* Capacity bar */}
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#e5e7eb' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${fillPct}%`,
                        backgroundColor: full ? '#ef4444' : fillPct > 75 ? '#f59e0b' : '#10b981',
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">Capacidad</span>
                    <span className="text-xs font-medium" style={{ color: full ? '#ef4444' : fillPct > 75 ? '#f59e0b' : '#10b981' }}>
                      {Math.round(fillPct)}% ocupado
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ── Paso 3: Datos del Estudiante ─────────────────────────────────────────
  const renderStepData = () => (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-1 text-balance" style={{ color: '#031e41' }}>
          Datos del <span style={{ color: '#e74c3c', fontStyle: 'italic' }}>Estudiante</span>
        </h1>
        <p className="text-sm md:text-base text-gray-600">Completa los datos de quien asistira al curso</p>
      </div>

      <div className="rounded-xl p-3 md:p-4 flex gap-3" style={{ backgroundColor: '#fef2f2', border: '2px solid #e74c3c' }}>
        <AlertCircle size={18} style={{ color: '#e74c3c', flexShrink: 0, marginTop: 1 }} />
        <div>
          <p className="font-bold text-sm" style={{ color: '#e74c3c' }}>Datos de la Persona que se Inscribe</p>
          <p className="text-xs text-gray-700 mt-0.5">Estos datos seran utilizados para emitir el certificado oficial del curso.</p>
        </div>
      </div>

      <div className="rounded-2xl p-4 md:p-6" style={{ backgroundColor: '#ffffff', border: '2px solid #9cbadb' }}>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-1.5" style={{ color: '#031e41' }}>
              <User size={15} style={{ color: '#9cbadb' }} />Nombre Completo *
            </label>
            <input type="text" value={studentData.nombre} onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Juan Perez" className="w-full px-4 py-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
              style={{ backgroundColor: '#f8f9fa', border: '1px solid #9cbadb', color: '#031e41' }} />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-1.5" style={{ color: '#031e41' }}>
              <CreditCard size={15} style={{ color: '#9cbadb' }} />DNI *
            </label>
            <input type="text" value={studentData.dni} onChange={(e) => handleInputChange('dni', e.target.value)}
              placeholder="12345678" className="w-full px-4 py-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
              style={{ backgroundColor: '#f8f9fa', border: '1px solid #9cbadb', color: '#031e41' }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-1.5" style={{ color: '#031e41' }}>
                <Mail size={15} style={{ color: '#9cbadb' }} />Email *
              </label>
              <input type="email" value={studentData.email} onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="juan@ejemplo.com" className="w-full px-4 py-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                style={{ backgroundColor: '#f8f9fa', border: '1px solid #9cbadb', color: '#031e41' }} />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-1.5" style={{ color: '#031e41' }}>
                <Phone size={15} style={{ color: '#9cbadb' }} />Telefono *
              </label>
              <input type="tel" value={studentData.telefono} onChange={(e) => handleInputChange('telefono', e.target.value)}
                placeholder="+54 9 11 1234-5678" className="w-full px-4 py-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                style={{ backgroundColor: '#f8f9fa', border: '1px solid #9cbadb', color: '#031e41' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-4 flex items-start gap-3" style={{ backgroundColor: '#f0f9ff', border: '2px solid #031e41' }}>
        <input type="checkbox" id="verify-student" checked={isStudentDataVerified} onChange={(e) => setIsStudentDataVerified(e.target.checked)}
          className="w-5 h-5 mt-0.5 cursor-pointer rounded flex-shrink-0" style={{ accentColor: '#031e41' }} />
        <label htmlFor="verify-student" className="cursor-pointer flex-1">
          <p className="font-semibold text-sm" style={{ color: '#031e41' }}>Confirmo que los datos ingresados son del estudiante</p>
          <p className="text-xs text-gray-600 mt-0.5">Estos datos seran utilizados para emitir el certificado oficial del curso.</p>
        </label>
      </div>
    </div>
  );

  // ── Paso 4: Revision ─────────────────────────────────────────────────────
  const renderStepReview = () => (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-1 text-balance" style={{ color: '#031e41' }}>
          Revisa tu <span style={{ color: '#9cbadb', fontStyle: 'italic' }}>Inscripcion</span>
        </h1>
        <p className="text-sm md:text-base text-gray-600">Verifica que todos los datos sean correctos</p>
      </div>

      <div className="rounded-2xl p-4 md:p-6" style={{ backgroundColor: '#ffffff', border: '2px solid #9cbadb' }}>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle size={18} style={{ color: '#031e41' }} />
          <h3 className="font-bold text-sm md:text-base" style={{ color: '#031e41' }}>Curso Seleccionado</h3>
        </div>
        <p className="font-bold text-sm" style={{ color: '#031e41' }}>{course.title}</p>
        {selectedCommission && (
          <p className="text-xs text-gray-500 mt-1">Comision: <span className="font-semibold">{selectedCommission.name}</span></p>
        )}
      </div>

      <div className="rounded-2xl p-4 md:p-6" style={{ backgroundColor: '#ffffff', border: '2px solid #9cbadb' }}>
        <div className="flex items-center gap-2 mb-3">
          <User size={18} style={{ color: '#031e41' }} />
          <h3 className="font-bold text-sm md:text-base" style={{ color: '#031e41' }}>Tus Datos</h3>
        </div>
        <div className="space-y-2.5">
          {[
            { label: 'Nombre', value: studentData.nombre },
            { label: 'DNI', value: studentData.dni },
            { label: 'Email', value: studentData.email },
            { label: 'Telefono', value: studentData.telefono },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <span className="text-gray-500 text-sm flex-shrink-0">{label}:</span>
              <span className="font-medium text-sm text-right truncate" style={{ color: '#031e41' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-4 flex items-center justify-between" style={{ backgroundColor: '#f0f9ff', border: '2px solid #031e41' }}>
        <span className="text-sm font-semibold" style={{ color: '#031e41' }}>Inversion mensual</span>
        <span className="text-lg font-bold" style={{ color: '#031e41' }}>{course.price}</span>
      </div>
    </div>
  );

  // ── Paso 5: Exito ─────────────────────────────────────────────────────────
  const buildWhatsAppURL = () => {
    const phone = '5493516307002'; // +54 9 3516 30-7002 sin espacios ni +
    const nombre = studentData.nombre || '';
    const primerNombre = nombre.trim().split(' ')[0] || 'alumno';
    const message = [
      `Hola ${primerNombre}! 👋`,
      `Acabo de completar mi inscripción y aquí están mis datos:`,
      ``,
      `📝 DATOS PERSONALES`,
      `Nombre: ${studentData.nombre}`,
      `DNI: ${studentData.dni}`,
      `Email: ${studentData.email}`,
      `Teléfono: ${studentData.telefono}`,
      ``,
      `📚 CURSO SELECCIONADO`,
      `Curso: ${course.title}`,
      `Comisión: ${selectedCommission?.name || 'Sin comisión'}`,
      `Profesor: ${course.teacher || 'Por confirmar'}`,
      ``,
      `¿Podrían confirmarme los próximos pasos? 🚀`,
    ].join('\n');
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const renderStepDone = () => (
    <div className="space-y-6 text-center">
      <div className="flex justify-center pt-2">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(156, 186, 219, 0.15)', border: '2px solid #031e41' }}>
          <CheckCircle size={40} style={{ color: '#031e41' }} />
        </div>
      </div>

      <div>
        <h1 className="text-2xl md:text-4xl font-bold mb-1 text-balance" style={{ color: '#031e41' }}>
          Inscripcion <span style={{ color: '#9cbadb', fontStyle: 'italic' }}>Exitosa!</span>
        </h1>
        <p className="text-sm md:text-base text-gray-600">Tu inscripcion ha sido registrada correctamente</p>
        {selectedCommission && (
          <p className="text-sm mt-1 font-medium" style={{ color: '#031e41' }}>Comision: {selectedCommission.name}</p>
        )}
      </div>

      {/* Resumen de datos */}
      <div className="rounded-2xl p-4 md:p-6 text-left" style={{ backgroundColor: '#ffffff', border: '2px solid #9cbadb' }}>
        <div className="space-y-2.5">
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-gray-500 flex-shrink-0">Nombre:</span>
            <span className="font-medium text-right" style={{ color: '#031e41' }}>{studentData.nombre}</span>
          </div>
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-gray-500 flex-shrink-0">DNI:</span>
            <span className="font-medium text-right" style={{ color: '#031e41' }}>{studentData.dni}</span>
          </div>
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-gray-500 flex-shrink-0">Email:</span>
            <span className="font-medium text-right truncate" style={{ color: '#031e41' }}>{studentData.email}</span>
          </div>
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-gray-500 flex-shrink-0">Telefono:</span>
            <span className="font-medium text-right" style={{ color: '#031e41' }}>{studentData.telefono}</span>
          </div>
          <div className="border-t border-gray-100 pt-2.5 mt-1">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500 flex-shrink-0">Curso:</span>
              <span className="font-semibold text-right" style={{ color: '#031e41' }}>{course.title}</span>
            </div>
            {selectedCommission && (
              <div className="flex justify-between gap-4 text-sm mt-1.5">
                <span className="text-gray-500 flex-shrink-0">Comision:</span>
                <span className="font-medium text-right" style={{ color: '#031e41' }}>{selectedCommission.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Boton WhatsApp */}
      <div className="rounded-2xl p-4 md:p-6 text-left" style={{ backgroundColor: '#f0fdf4', border: '2px solid #22c55e' }}>
        <div className="text-center mb-4">
          <h2 className="text-lg md:text-xl font-bold mb-1" style={{ color: '#15803d' }}>Confirma tu inscripcion</h2>
          <p className="text-gray-600 text-xs md:text-sm">
            Envia un mensaje a nuestro equipo con tus datos para que podamos confirmar tu lugar
          </p>
        </div>
        <a
          href={buildWhatsAppURL()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-white transition-all hover:shadow-lg w-full text-sm md:text-base"
          style={{ backgroundColor: '#25D366' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Enviar mis datos por WhatsApp
        </a>
        <p className="text-center text-xs text-gray-400 mt-2">Se abrira WhatsApp con el mensaje ya redactado</p>
      </div>

      <button
        onClick={() => router.push(`/${schoolId}`)}
        className="text-gray-500 text-sm hover:text-gray-800 hover:font-semibold transition-all"
      >
        Volver al inicio
      </button>
    </div>
  );

  const logical = getLogicalStep();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Progress Bar */}
      <div className="sticky top-0 z-50 px-4 py-3" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-xs md:text-sm font-medium">Paso {currentStep} de {totalSteps}</span>
            <span className="text-xs md:text-sm font-bold" style={{ color: '#031e41' }}>{Math.round(progress)}% completado</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#e5e7eb' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: '#031e41' }} />
          </div>
          <div className="flex justify-between mt-2">
            {getStepLabels().map((label, i) => (
              <span key={label} className="text-xs font-medium" style={{ color: i + 1 <= currentStep ? '#031e41' : '#9ca3af' }}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-32">
        {logical === 'course' && renderStepCourse()}
        {logical === 'commission' && renderStepCommission()}
        {logical === 'data' && renderStepData()}
        {logical === 'review' && renderStepReview()}
        {logical === 'done' && renderStepDone()}
      </div>

      {/* Navigation */}
      {logical !== 'done' && (
        <div className="fixed bottom-0 left-0 right-0 p-4" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
          <div className="max-w-2xl mx-auto flex gap-3">
            <button
              onClick={handleBack}
              className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl font-bold transition-all text-sm"
              style={{ backgroundColor: '#f3f4f6', border: '2px solid #031e41', color: '#031e41', minWidth: '7rem' }}
            >
              <ArrowLeft size={18} />
              {currentStep === 1 ? 'Al curso' : 'Atras'}
            </button>

            {isConfirmStep() ? (
              <button
                onClick={() => {
                  console.log('[v0] BUTTON CLICKED - handleConfirmEnrollment');
                  handleConfirmEnrollment();
                }}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 text-sm"
                style={{ backgroundColor: '#031e41' }}
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar inscripcion'}
                {!isSubmitting && <CheckCircle size={18} />}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                style={{ backgroundColor: '#031e41' }}
              >
                Continuar
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
