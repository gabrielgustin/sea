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
      router.push(`/cursos/${course.slug}`);
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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6" style={{ borderColor: '#00d4ff' }}>
          <span style={{ color: '#00d4ff' }}>&#10024;</span>
          <span className="text-sm font-medium" style={{ color: '#00d4ff' }}>INSCRIPCION</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Confirma tu <span style={{ color: '#00d4ff', fontStyle: 'italic' }}>Curso</span>
        </h1>
        <p className="text-gray-400">Estas por inscribirte en un excelente programa</p>
      </div>

      {/* Course Card */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a' }}>
        <div className="flex items-start gap-4 mb-6">
          <div className="text-4xl">&#128187;</div>
          <div>
            <span 
              className="inline-block px-3 py-1 rounded text-xs font-bold mb-2"
              style={{ backgroundColor: '#00d4ff', color: '#0a0a0a' }}
            >
              {course.level || 'PRINCIPIANTE'}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{course.title}</h2>
            <p className="text-gray-400 text-sm">{course.subtitle}</p>
          </div>
        </div>

        {/* Course Info Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl p-4" style={{ backgroundColor: '#0d0d1a', border: '1px solid #2a2a4a' }}>
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={16} style={{ color: '#00d4ff' }} />
              <span className="text-xs text-gray-400">Dia</span>
            </div>
            <p className="text-white font-semibold">{getDay()}</p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: '#0d0d1a', border: '1px solid #2a2a4a' }}>
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} style={{ color: '#00d4ff' }} />
              <span className="text-xs text-gray-400">Horario</span>
            </div>
            <p className="text-white font-semibold">{getTime()}</p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: '#0d0d1a', border: '1px solid #2a2a4a' }}>
            <div className="flex items-center gap-2 mb-1">
              <User size={16} style={{ color: '#00d4ff' }} />
              <span className="text-xs text-gray-400">Profesor</span>
            </div>
            <p className="text-white font-semibold text-sm">{course.teacher}</p>
          </div>
        </div>

        {/* Certificate Badge */}
        <div className="flex items-center gap-2">
          <CheckCircle size={18} style={{ color: '#00d4ff' }} />
          <span className="text-gray-400 text-sm">Certificado oficial por ITS Villada</span>
        </div>
      </div>
    </div>
  );

  // Paso 2: Datos del Estudiante
  const renderStep2 = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Datos del <span style={{ color: '#00d4ff', fontStyle: 'italic' }}>Estudiante</span>
        </h1>
        <p className="text-gray-400">Completa los datos del estudiante</p>
      </div>

      {/* Form */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a' }}>
        <div className="space-y-5">
          {/* Nombre Completo */}
          <div>
            <label className="flex items-center gap-2 text-white text-sm mb-2">
              <User size={16} style={{ color: '#00d4ff' }} />
              Nombre Completo *
            </label>
            <input
              type="text"
              value={studentData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Juan Perez"
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2"
              style={{ backgroundColor: '#0d0d1a', border: '1px solid #2a2a4a', focusRingColor: '#00d4ff' }}
            />
          </div>

          {/* DNI */}
          <div>
            <label className="flex items-center gap-2 text-white text-sm mb-2">
              <CreditCard size={16} style={{ color: '#00d4ff' }} />
              DNI *
            </label>
            <input
              type="text"
              value={studentData.dni}
              onChange={(e) => handleInputChange('dni', e.target.value)}
              placeholder="12345678"
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2"
              style={{ backgroundColor: '#0d0d1a', border: '1px solid #2a2a4a' }}
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-white text-sm mb-2">
              <Mail size={16} style={{ color: '#00d4ff' }} />
              Email *
            </label>
            <input
              type="email"
              value={studentData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="juan@ejemplo.com"
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2"
              style={{ backgroundColor: '#0d0d1a', border: '1px solid #2a2a4a' }}
            />
          </div>

          {/* Telefono */}
          <div>
            <label className="flex items-center gap-2 text-white text-sm mb-2">
              <Phone size={16} style={{ color: '#00d4ff' }} />
              Telefono *
            </label>
            <input
              type="tel"
              value={studentData.telefono}
              onChange={(e) => handleInputChange('telefono', e.target.value)}
              placeholder="+54 9 11 1234-5678"
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2"
              style={{ backgroundColor: '#0d0d1a', border: '1px solid #2a2a4a' }}
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
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Revisa tu <span style={{ color: '#00d4ff', fontStyle: 'italic' }}>Inscripcion</span>
        </h1>
        <p className="text-gray-400">Verifica que todos los datos sean correctos</p>
      </div>

      {/* Course Summary */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a' }}>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle size={20} style={{ color: '#00d4ff' }} />
          <h3 className="text-white font-bold">Curso Seleccionado</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-3xl">&#128187;</div>
          <div>
            <p className="text-white font-bold">{course.title}</p>
            <p className="text-gray-400 text-sm">{getDay()} - {getTime()}</p>
          </div>
        </div>
      </div>

      {/* Student Data Summary */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a' }}>
        <div className="flex items-center gap-2 mb-4">
          <User size={20} style={{ color: '#00d4ff' }} />
          <h3 className="text-white font-bold">Tus Datos</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Nombre:</span>
            <span className="text-white font-medium">{studentData.nombre}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">DNI:</span>
            <span className="text-white font-medium">{studentData.dni}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Email:</span>
            <span className="text-white font-medium">{studentData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Telefono:</span>
            <span className="text-white font-medium">{studentData.telefono}</span>
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
          style={{ backgroundColor: 'rgba(0, 212, 255, 0.1)', border: '2px solid #00d4ff' }}
        >
          <CheckCircle size={48} style={{ color: '#00d4ff' }} />
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Inscripcion <span style={{ color: '#00d4ff', fontStyle: 'italic' }}>Exitosa!</span>
        </h1>
        <p className="text-gray-400">Tu inscripcion ha sido registrada correctamente</p>
      </div>

      {/* WhatsApp Group Card */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a' }}>
        <div className="text-5xl mb-4">&#128172;</div>
        <h2 className="text-xl font-bold text-white mb-2">Sumate al grupo!</h2>
        <p className="text-gray-400 text-sm mb-6">
          Unite al grupo de WhatsApp del curso para recibir todas las novedades y comunicarte con tus companeros
        </p>
        
        {course.whatsappGroup ? (
          <a
            href={course.whatsappGroup}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
            style={{ backgroundColor: '#25D366' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Unirse al Grupo de WhatsApp
          </a>
        ) : (
          <p className="text-gray-500 text-sm">
            El link del grupo sera compartido proximamente
          </p>
        )}
      </div>

      {/* Back to Courses */}
      <button
        onClick={() => router.push('/cursos')}
        className="text-gray-400 hover:text-white transition-colors"
      >
        Volver a los cursos
      </button>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Progress Bar */}
      <div className="sticky top-0 z-50 px-4 py-4" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Paso {currentStep} de {totalSteps}</span>
            <span className="font-bold" style={{ color: '#00d4ff' }}>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#2a2a4a' }}>
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: '#00d4ff' }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      {/* Navigation Buttons */}
      {currentStep < 4 && (
        <div className="fixed bottom-0 left-0 right-0 p-4" style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid #2a2a4a' }}>
          <div className="max-w-2xl mx-auto flex gap-4">
            <button
              onClick={handleBack}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all"
              style={{ backgroundColor: 'transparent', border: '1px solid #2a2a4a', color: '#00d4ff' }}
            >
              <ArrowLeft size={20} />
              {currentStep === 1 ? 'Volver al curso' : 'Atras'}
            </button>
            
            {currentStep === 3 ? (
              <button
                onClick={handleConfirmEnrollment}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-black transition-all disabled:opacity-50"
                style={{ backgroundColor: '#00d4ff' }}
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar inscripcion'}
                {!isSubmitting && <CheckCircle size={20} />}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentStep === 2 && !validateStep2()}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#00d4ff' }}
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
