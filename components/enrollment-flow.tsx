'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '@/context/CoursesContext';
import { ArrowLeft, ArrowRight, Calendar, Clock, User, CheckCircle, Mail, Phone, CreditCard, AlertCircle } from 'lucide-react';

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
  const [currentStep, setCurrentStep] = useState(1);
  const [studentData, setStudentData] = useState<StudentData>({
    nombre: '',
    dni: '',
    email: '',
    telefono: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStudentDataVerified, setIsStudentDataVerified] = useState(false);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // Extraer el día de la semana del horario
  const getDay = () => {
    const schedule = course.schedule || '';
    const dayMatch = schedule.match(/^(\w+)/);
    return dayMatch ? dayMatch[1] : 'Por definir';
  };

  // Extraer la hora del horario
  const getTime = () => {
    const schedule = course.schedule || '';
    const timeMatch = schedule.match(/(\d{1,2}:\d{2}\s*(?:a|to|-)\s*\d{1,2}:\d{2})/i);
    return timeMatch ? timeMatch[1] : schedule.split(':').slice(1).join(':').trim() || 'Por definir';
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push(`/cursos/${course.id}`);
    }
  };

  const handleInputChange = (field: keyof StudentData, value: string) => {
    setStudentData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep2 = () => {
    return studentData.nombre && studentData.dni && studentData.email && studentData.telefono && isStudentDataVerified;
  };

  const handleConfirmEnrollment = async () => {
    setIsSubmitting(true);
    
    // Simular envío de datos
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Ir al paso 4 (Confirmación con WhatsApp)
    setCurrentStep(4);
    setIsSubmitting(false);
  };

  // Paso 1: Confirma tu Curso
  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-4" style={{ borderColor: '#9cbadb' }}>
          <span style={{ color: '#031e41' }}>✨</span>
          <span className="text-xs md:text-sm font-bold" style={{ color: '#031e41' }}>INSCRIPCIÓN</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold mb-2 text-balance" style={{ color: '#031e41' }}>
          Confirma tu <span style={{ color: '#9cbadb', fontStyle: 'italic' }}>Curso</span>
        </h1>
        <p className="text-sm md:text-base text-gray-600">Estás a punto de inscribirte en un excelente programa</p>
      </div>

      {/* Course Card */}
      <div className="rounded-2xl p-4 md:p-6" style={{ backgroundColor: '#ffffff', border: '2px solid #9cbadb' }}>
        <div className="flex items-start gap-3 md:gap-4 mb-5">
          <div className="text-3xl md:text-4xl flex-shrink-0">📚</div>
          <div className="min-w-0">
            <span
              className="inline-block px-3 py-1 rounded text-xs font-bold mb-2"
              style={{ backgroundColor: '#9cbadb', color: '#031e41' }}
            >
              {course.level || 'PRINCIPIANTE'}
            </span>
            <h2 className="text-lg md:text-2xl font-bold mb-1 leading-snug" style={{ color: '#031e41' }}>{course.title}</h2>
            <p className="text-gray-600 text-xs md:text-sm line-clamp-2">{course.subtitle}</p>
          </div>
        </div>

        {/* Course Info Grid — apilado en mobile, 3 columnas en md */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="rounded-xl p-3 md:p-4" style={{ backgroundColor: '#f8f9fa', border: '1px solid #9cbadb' }}>
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={14} style={{ color: '#031e41' }} />
              <span className="text-xs text-gray-500 font-medium">Día</span>
            </div>
            <p className="font-semibold text-sm md:text-base" style={{ color: '#031e41' }}>{getDay()}</p>
          </div>
          <div className="rounded-xl p-3 md:p-4" style={{ backgroundColor: '#f8f9fa', border: '1px solid #9cbadb' }}>
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} style={{ color: '#031e41' }} />
              <span className="text-xs text-gray-500 font-medium">Horario</span>
            </div>
            <p className="font-semibold text-sm md:text-base" style={{ color: '#031e41' }}>{getTime()}</p>
          </div>
          <div className="rounded-xl p-3 md:p-4" style={{ backgroundColor: '#f8f9fa', border: '1px solid #9cbadb' }}>
            <div className="flex items-center gap-2 mb-1">
              <User size={14} style={{ color: '#031e41' }} />
              <span className="text-xs text-gray-500 font-medium">Profesor</span>
            </div>
            <p className="font-semibold text-sm" style={{ color: '#031e41' }}>{course.teacher}</p>
          </div>
        </div>

        {/* Certificate Badge */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <CheckCircle size={16} style={{ color: '#031e41' }} />
          <span className="text-gray-700 text-xs md:text-sm font-medium">Certificado oficial por ITS Villada</span>
        </div>
      </div>
    </div>
  );

  // Paso 2: Datos del Estudiante
  const renderStep2 = () => (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-1 text-balance" style={{ color: '#031e41' }}>
          Datos del <span style={{ color: '#e74c3c', fontStyle: 'italic' }}>Estudiante</span>
        </h1>
        <p className="text-sm md:text-base text-gray-600">Completa los datos de quien asistirá al curso</p>
      </div>

      {/* Important Notice */}
      <div className="rounded-xl p-3 md:p-4 flex gap-3" style={{ backgroundColor: '#fef2f2', border: '2px solid #e74c3c' }}>
        <AlertCircle size={18} style={{ color: '#e74c3c', flexShrink: 0, marginTop: 1 }} />
        <div>
          <p className="font-bold text-sm md:text-base" style={{ color: '#e74c3c' }}>Datos de la Persona que se Inscribe</p>
          <p className="text-xs md:text-sm text-gray-700 mt-0.5">Estos datos serán utilizados para emitir el certificado oficial del curso.</p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl p-4 md:p-6" style={{ backgroundColor: '#ffffff', border: '2px solid #9cbadb' }}>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-1.5" style={{ color: '#031e41' }}>
              <User size={15} style={{ color: '#9cbadb' }} />
              Nombre Completo *
            </label>
            <input
              type="text"
              value={studentData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Juan Perez"
              className="w-full px-4 py-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm md:text-base"
              style={{ backgroundColor: '#f8f9fa', border: '1px solid #9cbadb', color: '#031e41' }}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-1.5" style={{ color: '#031e41' }}>
              <CreditCard size={15} style={{ color: '#9cbadb' }} />
              DNI *
            </label>
            <input
              type="text"
              value={studentData.dni}
              onChange={(e) => handleInputChange('dni', e.target.value)}
              placeholder="12345678"
              className="w-full px-4 py-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm md:text-base"
              style={{ backgroundColor: '#f8f9fa', border: '1px solid #9cbadb', color: '#031e41' }}
            />
          </div>

          {/* Email + Teléfono en grid en pantallas medianas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-1.5" style={{ color: '#031e41' }}>
                <Mail size={15} style={{ color: '#9cbadb' }} />
                Email *
              </label>
              <input
                type="email"
                value={studentData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="juan@ejemplo.com"
                className="w-full px-4 py-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                style={{ backgroundColor: '#f8f9fa', border: '1px solid #9cbadb', color: '#031e41' }}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-1.5" style={{ color: '#031e41' }}>
                <Phone size={15} style={{ color: '#9cbadb' }} />
                Teléfono *
              </label>
              <input
                type="tel"
                value={studentData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                placeholder="+54 9 11 1234-5678"
                className="w-full px-4 py-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                style={{ backgroundColor: '#f8f9fa', border: '1px solid #9cbadb', color: '#031e41' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Verification Checkbox */}
      <div className="rounded-xl p-4 flex items-start gap-3" style={{ backgroundColor: '#f0f9ff', border: '2px solid #031e41' }}>
        <input
          type="checkbox"
          id="verify-student"
          checked={isStudentDataVerified}
          onChange={(e) => setIsStudentDataVerified(e.target.checked)}
          className="w-5 h-5 mt-0.5 cursor-pointer rounded flex-shrink-0"
          style={{ accentColor: '#031e41' }}
        />
        <label htmlFor="verify-student" className="cursor-pointer flex-1">
          <p className="font-semibold text-sm md:text-base" style={{ color: '#031e41' }}>Confirmo que los datos ingresados son del estudiante</p>
          <p className="text-xs md:text-sm text-gray-600 mt-0.5">Estos datos serán utilizados para emitir el certificado oficial del curso.</p>
        </label>
      </div>
    </div>
  );

  // Paso 3: Revisa tu Inscripcion
  const renderStep3 = () => (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-1 text-balance" style={{ color: '#031e41' }}>
          Revisa tu <span style={{ color: '#9cbadb', fontStyle: 'italic' }}>Inscripción</span>
        </h1>
        <p className="text-sm md:text-base text-gray-600">Verifica que todos los datos sean correctos</p>
      </div>

      {/* Course Summary */}
      <div className="rounded-2xl p-4 md:p-6" style={{ backgroundColor: '#ffffff', border: '2px solid #9cbadb' }}>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle size={18} style={{ color: '#031e41' }} />
          <h3 className="font-bold text-sm md:text-base" style={{ color: '#031e41' }}>Curso Seleccionado</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-2xl md:text-3xl flex-shrink-0">📚</div>
          <div className="min-w-0">
            <p className="font-bold text-sm md:text-base leading-snug" style={{ color: '#031e41' }}>{course.title}</p>
            <p className="text-gray-500 text-xs md:text-sm mt-0.5">{getDay()} · {getTime()}</p>
          </div>
        </div>
      </div>

      {/* Student Data Summary */}
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
            { label: 'Teléfono', value: studentData.telefono },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <span className="text-gray-500 text-sm flex-shrink-0">{label}:</span>
              <span className="font-medium text-sm text-right truncate" style={{ color: '#031e41' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price summary */}
      <div className="rounded-xl p-4 flex items-center justify-between" style={{ backgroundColor: '#f0f9ff', border: '2px solid #031e41' }}>
        <span className="text-sm font-semibold" style={{ color: '#031e41' }}>Inversión mensual</span>
        <span className="text-lg font-bold" style={{ color: '#031e41' }}>{course.price}</span>
      </div>
    </div>
  );

  // Paso 4: Confirmacion y WhatsApp
  const renderStep4 = () => (
    <div className="space-y-6 text-center">
      {/* Success Icon */}
      <div className="flex justify-center pt-2">
        <div
          className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(156, 186, 219, 0.15)', border: '2px solid #031e41' }}
        >
          <CheckCircle size={40} style={{ color: '#031e41' }} />
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-4xl font-bold mb-1 text-balance" style={{ color: '#031e41' }}>
          Inscripción <span style={{ color: '#9cbadb', fontStyle: 'italic' }}>Exitosa!</span>
        </h1>
        <p className="text-sm md:text-base text-gray-600">Tu inscripción ha sido registrada correctamente</p>
      </div>

      {/* WhatsApp Group Card */}
      <div className="rounded-2xl p-4 md:p-6 text-left" style={{ backgroundColor: '#ffffff', border: '2px solid #9cbadb' }}>
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">💬</div>
          <h2 className="text-lg md:text-xl font-bold" style={{ color: '#031e41' }}>¡Súmate al grupo!</h2>
          <p className="text-gray-600 text-xs md:text-sm mt-1">
            Únete al grupo de WhatsApp del curso para recibir todas las novedades y comunicarte con tus compañeros
          </p>
        </div>

        {course.whatsappGroup ? (
          <div className="space-y-3">
            <a
              href={course.whatsappGroup}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-bold text-white transition-all hover:shadow-lg w-full text-sm md:text-base"
              style={{ backgroundColor: '#25D366' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Unirse al Grupo de WhatsApp
            </a>

            <button
              onClick={() => {
                const message = encodeURIComponent(`Hola! Te comparto el link para unirte al grupo de WhatsApp del curso "${course.title}" del ITS Villada: ${course.whatsappGroup}`);
                window.open(`https://wa.me/?text=${message}`, '_blank');
              }}
              className="w-full px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm md:text-base"
              style={{ backgroundColor: '#f3f4f6', border: '2px solid #031e41', color: '#031e41' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Compartir link por WhatsApp
            </button>
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center">
            El link del grupo será compartido próximamente
          </p>
        )}
      </div>

      {/* Back to Courses */}
      <button
        onClick={() => router.push('/')}
        className="text-gray-500 text-sm hover:text-gray-800 hover:font-semibold transition-all"
      >
        Volver a los cursos
      </button>
    </div>
  );

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
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: '#031e41' }}
            />
          </div>
          {/* Step indicators */}
          <div className="flex justify-between mt-2">
            {['Curso', 'Datos', 'Revisión', 'Listo'].map((label, i) => (
              <span
                key={label}
                className="text-xs font-medium"
                style={{ color: i + 1 <= currentStep ? '#031e41' : '#9ca3af' }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-32">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      {/* Navigation Buttons */}
      {currentStep < 4 && (
        <div className="fixed bottom-0 left-0 right-0 p-4" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
          <div className="max-w-2xl mx-auto flex gap-3">
            <button
              onClick={handleBack}
              className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl font-bold transition-all text-sm md:text-base"
              style={{ backgroundColor: '#f3f4f6', border: '2px solid #031e41', color: '#031e41', minWidth: '7rem' }}
            >
              <ArrowLeft size={18} />
              {currentStep === 1 ? 'Al curso' : 'Atrás'}
            </button>

            {currentStep === 3 ? (
              <button
                onClick={handleConfirmEnrollment}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 text-sm md:text-base"
                style={{ backgroundColor: '#031e41' }}
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar inscripción'}
                {!isSubmitting && <CheckCircle size={18} />}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentStep === 2 && !validateStep2()}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
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
