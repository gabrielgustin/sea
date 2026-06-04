'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CourseTeacher {
  name: string;
  photo: string;
  description: string;
  linkedin?: string;
  whatsapp?: string;
}

interface Course {
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
}

export default function CourseDetailClient({ course }: { course: Course }) {
  const router = useRouter();
  const [modulesExpanded, setModulesExpanded] = useState(false);
  const [interestForm, setInterestForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Verificar si el curso ya ha comenzado
  const hasCourseStarted = () => {
    if (!course.startDate) return false;
    // Parseando formato: "Mar 3/06/2026" o similar
    try {
      const datePart = course.startDate.split(' ').slice(1).join(' '); // "3/06/2026"
      const [day, month, year] = datePart.split('/');
      const courseStart = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today > courseStart;
    } catch {
      return false;
    }
  };

  const courseHasStarted = hasCourseStarted();

  const handleInterestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se enviaría el formulario a un backend
    console.log('Formulario de interés enviado:', interestForm);
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <div className="w-full">
      {/* Hero Section with Image */}
      <section className="relative w-full h-72 md:h-80 overflow-hidden">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover"
          priority
        />
        
        {/* Overlay with Badge */}
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-between px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <div 
              className="inline-block px-6 py-3 rounded-full text-white font-bold text-sm md:text-base"
              style={{ backgroundColor: '#031e41' }}
            >
              {course.badge}
            </div>
          </div>
          
          <div className="flex flex-col justify-end items-start">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
              {course.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ color: '#031e41' }}>
                Sobre este curso
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {course.description}
              </p>
            </div>

            {/* Program - Collapsible Content */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900" style={{ color: '#031e41' }}>
                  Contenidos
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModulesExpanded(!modulesExpanded)}
                  className="flex items-center gap-2 border-2 transition-all duration-300"
                  style={{ borderColor: '#031e41', color: '#031e41' }}
                >
                  {modulesExpanded ? (
                    <>
                      <span className="text-sm font-medium">Ocultar Unidades</span>
                      <ChevronUp size={18} />
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-medium">Ver Unidades ({course.modules?.length || 0})</span>
                      <ChevronDown size={18} />
                    </>
                  )}
                </Button>
              </div>

              {/* Collapsible Modules */}
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  modulesExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="space-y-4">
                  {course.modules && course.modules.map((module: any, index: number) => (
                    <div key={index} className="bg-white border-l-4 p-4 rounded-lg" style={{ borderColor: '#00a8cc' }}>
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs"
                          style={{ backgroundColor: '#031e41' }}
                        >
                          {module.number}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-gray-900 mb-2">{module.title}</h3>
                          <ul className="space-y-1">
                            {module.topics && module.topics.map((topic: string, topicIndex: number) => (
                              <li key={topicIndex} className="flex items-start gap-1 text-gray-600 text-xs">
                                <span className="text-gray-400 flex-shrink-0">•</span>
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

              {/* Preview when collapsed */}
              {!modulesExpanded && course.modules && course.modules.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600">
                    Este curso incluye <span className="font-bold" style={{ color: '#031e41' }}>{course.modules.length} unidades</span> de contenido. 
                    Haz clic en el botón de arriba para ver el programa completo.
                  </p>
                </div>
              )}
            </div>

            {/* Methodology & Final Project - Side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2" style={{ color: '#031e41' }}>
                  Metodología
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {course.methodology}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2" style={{ color: '#031e41' }}>
                  Proyecto Final
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {course.finalProject}
                </p>
              </div>
            </div>

            {/* Teachers Section */}
            {course.teachers && course.teachers.length > 0 && (
              <div className="mb-8">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-6" style={{ color: '#031e41' }}>
                    Docente/s:
                  </h2>
                  <div className="space-y-6">
                    {course.teachers.map((teacher, index) => (
                      <div key={index} className="relative flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-300">
                        {/* Teacher Photo */}
                        <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-3" style={{ borderColor: '#9cbadb' }}>
                          <Image
                            src={teacher.photo || '/placeholder-teacher.jpg'}
                            alt={teacher.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        {/* Teacher Info */}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">
                            {teacher.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {teacher.description}
                          </p>
                        </div>

                        {/* Social Links - Bottom Right Corner */}
                        <div className="absolute bottom-4 right-4 flex items-center gap-4">
                          {teacher.linkedin && (
                            <a
                              href={teacher.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="transition-all duration-300 hover:scale-125 hover:drop-shadow-lg transform"
                              title="Ver perfil de LinkedIn"
                            >
                              <Image
                                src="/linkedin.png"
                                alt="LinkedIn"
                                width={26}
                                height={26}
                              />
                            </a>
                          )}
                          {teacher.whatsapp && (
                            <a
                              href={`https://wa.me/${teacher.whatsapp}?text=${encodeURIComponent('Hola profe!')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="transition-all duration-300 hover:scale-125 hover:drop-shadow-lg transform"
                              title="Contactar por WhatsApp"
                            >
                              <Image
                                src="/whatsapp.png"
                                alt="WhatsApp"
                                width={26}
                                height={26}
                              />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Fallback: Show basic teacher info if no detailed teachers array */}
            {(!course.teachers || course.teachers.length === 0) && course.teacher && (
              <div className="mb-8">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-4" style={{ color: '#031e41' }}>
                    Docente/s:
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-gray-500">
                        {course.teacher.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {course.teacher}
                      </h3>
                      <p className="text-sm text-gray-600">Docente del curso</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Info Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl p-5 border-2 space-y-4" style={{ borderColor: '#031e41' }}>
              
              {/* Si el curso NO ha comenzado: mostrar información + botón Inscribirme */}
              {!courseHasStarted && (
                <>
                  {/* Start Date */}
                  <div className="pb-4 border-b" style={{ borderColor: '#e5e5e5' }}>
                    <p className="text-xs font-semibold text-gray-600 mb-1">Inicia</p>
                    <p className="text-sm font-bold text-gray-900">{course.startDate}</p>
                  </div>

                  {/* Schedule */}
                  <div className="pb-4 border-b" style={{ borderColor: '#e5e5e5' }}>
                    <p className="text-xs font-semibold text-gray-600 mb-1">Horario</p>
                    <p className="text-sm text-gray-900">{course.schedule}</p>
                  </div>

                  {/* Location */}
                  <div className="pb-4 border-b" style={{ borderColor: '#e5e5e5' }}>
                    <p className="text-xs font-semibold text-gray-600 mb-1">Lugar</p>
                    <p className="text-sm text-gray-900">{course.location}</p>
                  </div>

                  {/* Duration */}
                  <div className="pb-4 border-b" style={{ borderColor: '#e5e5e5' }}>
                    <p className="text-xs font-semibold text-gray-600 mb-1">Duración</p>
                    <p className="text-sm text-gray-900">{course.duration}</p>
                  </div>

                  {/* Price */}
                  <div className="pb-4 border-b" style={{ borderColor: '#e5e5e5' }}>
                    <p className="text-xs font-semibold text-gray-600 mb-1">Inversión</p>
                    <p className="text-lg font-bold" style={{ color: '#031e41' }}>{course.price}</p>
                  </div>

                  {/* Registration Button */}
                  <button 
                    onClick={() => router.push(`/inscripcion/${course.slug}`)}
                    className="w-full py-2 rounded-lg font-bold text-white text-sm transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                    style={{ backgroundColor: '#031e41' }}
                  >
                    Inscribirme
                  </button>

                  {/* Course Start Date Notice */}
                  {course.startDate && (
                    <div className="pt-2">
                      <p className="text-xs text-gray-500 text-center">
                        El curso comienza el {course.startDate}
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Si el curso YA ha comenzado: mostrar solo el formulario de interés */}
              {courseHasStarted && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#031e41' }}>
                      Me interesa esta formación:
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Dejanos tus datos y te contactaremos cuando se abra una nueva edición de esta formación con toda la información relacionada
                    </p>
                  </div>
                  
                  {formSubmitted ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <p className="text-green-700 font-medium">Gracias por tu interés. Te contactaremos pronto.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleInterestSubmit} className="space-y-3">
                      <Input
                        type="text"
                        placeholder="Nombre y Apellido"
                        value={interestForm.nombre}
                        onChange={(e) => setInterestForm({ ...interestForm, nombre: e.target.value })}
                        required
                        className="w-full border-gray-300 rounded-lg"
                      />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={interestForm.email}
                        onChange={(e) => setInterestForm({ ...interestForm, email: e.target.value })}
                        required
                        className="w-full border-gray-300 rounded-lg"
                      />
                      <Input
                        type="tel"
                        placeholder="Teléfono"
                        value={interestForm.telefono}
                        onChange={(e) => setInterestForm({ ...interestForm, telefono: e.target.value })}
                        required
                        className="w-full border-gray-300 rounded-lg"
                      />
                      <button 
                        type="submit"
                        className="w-full py-2 rounded-lg font-bold text-white text-sm transition-all duration-300 hover:shadow-lg"
                        style={{ backgroundColor: '#031e41' }}
                      >
                        Enviar
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
