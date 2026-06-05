'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '@/context/CoursesContext';
import { ArrowLeft, ArrowRight, Calendar, Clock, User, CheckCircle, Monitor, Mail, Phone, CreditCard } from 'lucide-react';
import Image from 'next/image';

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
    return studentData.nombre && studentData.dni && studentData.email && studentData.telefono;
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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6" style={{ borderColor: '#9cbadb' }}>
          <span style={{ color: '#031e41' }}>✨</span>
          <span className="text-sm font-bold" style={{ color: '#031e41' }}>INSCRIPCIÓN</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#031e41' }}>
          Confirma tu <span style={{ color: '#9cbadb', fontStyle: 'italic' }}>Curso</span>
        </h1>
        <p className="text-gray-600">Estás a punto de inscribirte en un excelente programa</p>
      </div>

      {/* Course Card */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#ffffff', border: '2px solid #9cbadb' }}>
        <div className="flex items-start gap-4 mb-6">
          <div className="text-4xl">📚</div>
          <div>
            <span 
              className="inline-block px-3 py-1 rounded text-xs font-bold mb-2"
              style={{ backgroundColor: '#9cbadb', color: '#031e41' }}
            >
              {course.level || 'PRINCIPIANTE'}
            </span>
            <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#031e41' }}>{course.title}</h2>
            <p className="text-gray-600 text-sm">{course.subtitle}</p>
          </div>
        </div>

        {/* Course Info Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl p-4" style={{ backgroundColor: '#f8f9fa', border: '1px solid #9cbadb' }}>
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={16} style={{ color: '#031e41' }} />
              <span className="text-xs text-gray-600 font-medium">Día</span>
            </div>
            <p className="font-semibold" style={{ color: '#031e41' }}>{getDay()}</p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: '#f8f9fa', border: '1px solid #9cbadb' }}>
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} style={{ color: '#031e41' }} />
              <span className="text-xs text-gray-600 font-medium">Horario</span>
            </div>
            <p className="font-semibold" style={{ color: '#031e41' }}>{getTime()}</p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: '#f8f9fa', border: '1px solid #9cbadb' }}>
            <div className="flex items-center gap-2 mb-1">
              <User size={16} style={{ color: '#031e41' }} />
              <span className="text-xs text-gray-600 font-medium">Profesor</span>
            </div>
            <p className="font-semibold text-sm" style={{ color: '#031e41' }}>{course.teacher}</p>
          </div>
        </div>

        {/* Certificate Badge */}
        <div className="flex items-center gap-2">
          <CheckCircle size={18} style={{ color: '#031e41' }} />
          <span className="text-gray-700 text-sm font-medium">Certificado oficial por ITS Villada</span>
        </div>
      </div>
    </div>
  );

  // Paso 2: Datos del Estudiante
  const renderStep2 = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#031e41' }}>
          Datos del <span style={{ color: '#9cbadb', fontStyle: 'italic' }}>Estudiante</span>
        </h1>
        <p className="text-gray-600">Completa los datos del estudiante</p>
      </div>

      {/* Form */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#ffffff', border: '2px solid #9cbadb' }}>
        <div className="space-y-5">
          {/* Nombre Completo */}
          <div>
            <label className="flex items-center gap-2 font-medium mb-2" style={{ color: '#031e41' }}>
              <User size={16} style={{ color: '#9cbadb' }} />
              Nombre Completo *
            </label>
            <input
              type="text"
              value={studentData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Juan Perez"
              className="w-full px-4 py-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: '#f8f9fa', border: '1px solid #9cbadb', color: '#031e41', focusRingColor: '#9cbadb' }}
            />
          </div>

          {/* DNI */}
          <div>
            <label className="flex items-center gap-2 font-medium mb-2" style={{ color: '#031e41' }}>
              <CreditCard size={16} style={{ color: '#9cbadb' }} />
              DNI *
            </label>
            <input
              type="text"
              value={studentData.dni}
              onChange={(e) => handleInputChange('dni', e.target.value)}
              placeholder="12345678"
              className="w-full px-4 py-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: '#f8f9fa', border: '1px solid #9cbadb', color: '#031e41' }}
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 font-medium mb-2" style={{ color: '#031e41' }}>
              <Mail size={16} style={{ color: '#9cbadb' }} />
              Email *
            </label>
            <input
              type="email"
              value={studentData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="juan@ejemplo.com"
              className="w-full px-4 py-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: '#f8f9fa', border: '1px solid #9cbadb', color: '#031e41' }}
            />
          </div>

          {/* Telefono */}
          <div>
            <label className="flex items-center gap-2 font-medium mb-2" style={{ color: '#031e41' }}>
              <Phone size={16} style={{ color: '#9cbadb' }} />
              Teléfono *
            </label>
            <input
              type="tel"
              value={studentData.telefono}
              onChange={(e) => handleInputChange('telefono', e.target.value)}
              placeholder="+54 9 11 1234-5678"
              className="w-full px-4 py-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: '#f8f9fa', border: '1px solid #9cbadb', color: '#031e41' }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Paso 3: Revisa tu Inscripcion
  const renderStep3 = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#031e41' }}>
          Revisa tu <span style={{ color: '#9cbadb', fontStyle: 'italic' }}>Inscripción</span>
        </h1>
        <p className="text-gray-600">Verifica que todos los datos sean correctos</p>
      </div>

      {/* Course Summary */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#ffffff', border: '2px solid #9cbadb' }}>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle size={20} style={{ color: '#031e41' }} />
          <h3 className="font-bold" style={{ color: '#031e41' }}>Curso Seleccionado</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-3xl">📚</div>
          <div>
            <p className="font-bold" style={{ color: '#031e41' }}>{course.title}</p>
            <p className="text-gray-600 text-sm">{getDay()} - {getTime()}</p>
          </div>
        </div>
      </div>

      {/* Student Data Summary */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#ffffff', border: '2px solid #9cbadb' }}>
        <div className="flex items-center gap-2 mb-4">
          <User size={20} style={{ color: '#031e41' }} />
          <h3 className="font-bold" style={{ color: '#031e41' }}>Tus Datos</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Nombre:</span>
            <span className="font-medium" style={{ color: '#031e41' }}>{studentData.nombre}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">DNI:</span>
            <span className="font-medium" style={{ color: '#031e41' }}>{studentData.dni}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium" style={{ color: '#031e41' }}>{studentData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Teléfono:</span>
            <span className="font-medium" style={{ color: '#031e41' }}>{studentData.telefono}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Paso 4: Confirmacion y WhatsApp
  const renderStep4 = () => (
    <div className="space-y-8 text-center">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(156, 186, 219, 0.1)', border: '2px solid #031e41' }}
        >
          <CheckCircle size={48} style={{ color: '#031e41' }} />
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#031e41' }}>
          Inscripción <span style={{ color: '#9cbadb', fontStyle: 'italic' }}>Exitosa!</span>
        </h1>
        <p className="text-gray-600">Tu inscripción ha sido registrada correctamente</p>
      </div>

      {/* WhatsApp Group Card */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#ffffff', border: '2px solid #9cbadb' }}>
        <div className="text-5xl mb-4">💬</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: '#031e41' }}>¡Súmate al grupo!</h2>
        <p className="text-gray-600 text-sm mb-6">
          Únete al grupo de WhatsApp del curso para recibir todas las novedades y comunicarte con tus compañeros
        </p>
        
        {course.whatsappGroup ? (
          <a
            href={course.whatsappGroup}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-lg font-bold text-white transition-all hover:shadow-lg"
            style={{ backgroundColor: '#25D366' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Unirse al Grupo de WhatsApp
          </a>
        ) : (
          <p className="text-gray-500 text-sm">
            El link del grupo será compartido próximamente
          </p>
        )}
      </div>

      {/* Back to Courses */}
      <button
        onClick={() => router.push('/cursos')}
        className="text-gray-600 hover:font-semibold transition-all"
      >
        Volver a los cursos
      </button>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Progress Bar */}
      <div className="sticky top-0 z-50 px-4 py-4" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Paso {currentStep} de {totalSteps}</span>
            <span className="font-bold" style={{ color: '#031e41' }}>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#e5e7eb' }}>
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: '#031e41' }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 pb-32">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      {/* Navigation Buttons */}
      {currentStep < 4 && (
        <div className="fixed bottom-0 left-0 right-0 p-4" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
          <div className="max-w-2xl mx-auto flex gap-4">
            <button
              onClick={handleBack}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all"
              style={{ backgroundColor: '#f3f4f6', border: '2px solid #031e41', color: '#031e41' }}
            >
              <ArrowLeft size={20} />
              {currentStep === 1 ? 'Volver al curso' : 'Atrás'}
            </button>
            
            {currentStep === 3 ? (
              <button
                onClick={handleConfirmEnrollment}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-white transition-all disabled:opacity-50"
                style={{ backgroundColor: '#031e41' }}
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar inscripción'}
                {!isSubmitting && <CheckCircle size={20} />}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentStep === 2 && !validateStep2()}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#031e41' }}
              >
                Continuar
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
