'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Users, Award, Zap, TrendingUp, Building2, Lightbulb, Code } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCourses } from '@/context/CoursesContext';
import { useSchool } from '@/context/SchoolContext';

export default function FormacionesPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const { courses } = useCourses();
  const { schoolId } = useSchool();

  useEffect(() => {
    const section = processRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('step-visible');
          } else {
            entry.target.classList.remove('step-visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    const cards = section.querySelectorAll('[data-step-card]');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const whyUs = [
    {
      icon: Zap,
      title: 'Flexibilidad Total',
      description: 'Diseñamos programas adaptados a las necesidades específicas de tu institución, horarios y duración personalizada.',
    },
    {
      icon: Award,
      title: 'Certificaciones',
      description: 'Entregamos constancias de participación que respaldan el conocimiento adquirido y enriquecen el portfolio de cada estudiante.',
    },
    {
      icon: Users,
      title: 'Instructores Expertos',
      description: 'Profesionales con experiencia comprobada en sus áreas, comprometidos con la excelencia educativa.',
    },
  ];

  const services = [
    {
      id: 'instituciones',
      icon: Building2,
      title: 'Capacitaciones Institucionales',
      description: 'Programas diseñados exclusivamente para instituciones educativas como extensión académica de calidad.',
      features: ['Currículum personalizado', 'Validación institucional', 'Certificación oficial'],
    },
    {
      id: 'comunidad',
      icon: Users,
      title: 'Programas Comunitarios',
      description: 'Formaciones abiertas a la comunidad, generando impacto social y oportunidades para todos.',
      features: ['Acceso democrático', 'Precios accesibles', 'Impacto social'],
    },
    {
      id: 'tecnologia',
      icon: Code,
      title: 'Formaciones Tecnológicas',
      description: 'Capacitaciones en las últimas tecnologías: desarrollo web, robótica, IA y herramientas digitales.',
      features: ['Docentes especializados', 'Equipamiento moderno', 'Proyectos prácticos'],
    },
    {
      id: 'talleres',
      icon: Lightbulb,
      title: 'Formaciones de Oficio',
      description: 'Formaciones especializadas en oficios técnicos y prácticos que demanda el mercado laboral actual.',
      features: ['Aprendizaje práctico', 'Inserción laboral', 'Certificación profesional'],
    },
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Generación de Ingresos',
      description: 'Diversifica las fuentes de ingresos de tu institución con programas educativos de calidad.',
    },
    {
      icon: Users,
      title: 'Impacto Comunitario',
      description: 'Fortalece la relación con la comunidad y posiciona tu institución como referente educativo.',
    },
    {
      icon: Award,
      title: 'Reconocimiento Académico',
      description: 'Potencia la reputación de tu institución con certificaciones y programas innovadores.',
    },
  ];

  const steps = [
    { step: '01', title: 'Consulta Inicial', description: 'Conocemos tus necesidades específicas y objetivos institucionales.' },
    { step: '02', title: 'Diseño Personalizado', description: 'Creamos un programa adaptado a tu comunidad e institución.' },
    { step: '03', title: 'Ejecución', description: 'Implementamos el programa con docentes especializados y seguimiento continuo.' },
    { step: '04', title: 'Certificación', description: 'Emitimos certificados de reconocimiento validados.' },
  ];

  return (
    <div className="w-full bg-white">

      {/* Hero Section */}
      <section
        className="w-full pt-24 md:pt-16 pb-8 md:pb-16 md:min-h-[70vh] flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(135deg, #031e41 0%, #1a4d7a 100%)' }}
      >
        <div className="w-full text-center text-white max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Centro de Formacion
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Capacitaciones extracurriculares diseñadas como extensión académica para instituciones educativas
          </p>
          <Link
            href="#contacto"
            className="inline-block px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-sm md:text-base transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#9cbadb', color: '#031e41' }}
          >
            Solicitar Consulta Gratuita
          </Link>
        </div>
      </section>

      {/* Courses Grid — all available courses */}
      {courses.length > 0 && (
        <section className="py-12 md:py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#031e41' }}>
                Cursos Disponibles
              </h2>
              <p className="text-gray-600 text-base md:text-lg">
                Inscripciones abiertas
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/${schoolId}/cursos/${course.slug || course.id}`}
                  className="overflow-hidden rounded-2xl border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg bg-white group block"
                >
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div
                      className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-bold"
                      style={{ backgroundColor: '#031e41' }}
                    >
                      {course.badge}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-900 transition-colors leading-tight">
                      {course.title}
                    </h3>
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2">{course.subtitle}</p>
                    <div className="space-y-1">
                      {course.startDate && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="font-semibold">Inicia:</span>
                          <span>{course.startDate ? (() => { const [y,m,d] = course.startDate.split('-'); return d && m && y ? `${parseInt(d)}/${m}/${y}` : course.startDate; })() : ''}</span>
                        </div>
                      )}
                      {course.modality && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="font-semibold">Modalidad:</span>
                          <span>{course.modality}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Us */}
      <section className="py-8 md:py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12" style={{ color: '#031e41' }}>
            ¿Porque elegirnos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {whyUs.map((item, idx) => (
              <div key={idx} className="p-4 md:p-6 lg:p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <item.icon size={32} style={{ color: '#9cbadb', marginBottom: '1rem' }} />
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3" style={{ color: '#031e41' }}>
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="servicios" className="py-8 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-2 md:mb-4" style={{ color: '#031e41' }}>
            Nuestros Servicios
          </h2>
          <p className="text-center text-sm md:text-base text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto">
            Ofrecemos soluciones educativas integrales adaptadas a cada tipo de institución y comunidad
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="p-4 md:p-6 lg:p-8 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-all duration-300 cursor-pointer hover:shadow-lg"
                onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
              >
                <service.icon size={40} style={{ color: '#031e41', marginBottom: '1rem' }} />
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3" style={{ color: '#031e41' }}>
                  {service.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>
                {selectedService === service.id && (
                  <div className="pt-4 border-t border-gray-200">
                    <ul className="space-y-2 md:space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 md:gap-3">
                          <CheckCircle size={18} className="flex-shrink-0" style={{ color: '#9cbadb' }} />
                          <span className="text-sm md:text-base text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-8 md:py-16 px-4" style={{ background: 'linear-gradient(to right, #eff6ff, #ffffff)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12" style={{ color: '#031e41' }}>
            Beneficios para Instituciones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="p-4 md:p-6 lg:p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
                <benefit.icon size={36} style={{ color: '#9cbadb', marginBottom: '1rem' }} />
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3" style={{ color: '#031e41' }}>
                  {benefit.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-8 md:py-16 lg:py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4" style={{ color: '#031e41' }}>
              Cómo Funciona
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Un proceso simple y transparente para que tu institución reciba exactamente lo que necesita
            </p>
          </div>

          <div className="relative" ref={processRef}>
            {/* Connector line — desktop only */}
            <div
              className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-0.5"
              style={{ background: 'linear-gradient(to right, transparent, #9cbadb, transparent)', zIndex: 0 }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
              {steps.map((item, idx) => (
                <div
                  key={idx}
                  data-step-card
                  className="step-card flex flex-col items-center"
                  style={{ transitionDelay: `${idx * 120}ms` }}
                >
                  {/* Circle */}
                  <div className="relative mb-5 flex-shrink-0">
                    <div
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center font-bold text-xl md:text-2xl shadow-lg"
                      style={{ backgroundColor: '#031e41', color: '#ffffff' }}
                    >
                      {item.step}
                    </div>
                    <div
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white"
                      style={{ backgroundColor: '#9cbadb' }}
                    />
                  </div>

                  {/* Card */}
                  <div
                    className="w-full bg-white rounded-xl p-4 md:p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4"
                    style={{ borderTopColor: '#9cbadb' }}
                  >
                    <h3 className="text-base md:text-lg font-bold mb-2" style={{ color: '#031e41' }}>
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contacto"
        className="py-10 md:py-20 px-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #031e41 0%, #1a4d7a 100%)' }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full -ml-40 -mb-40 blur-3xl" />

        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight px-2">
            ¿Listo para transformar{' '}
            <br className="hidden md:block" />
            la educación en tu institución?
          </h2>

          <p className="text-sm md:text-base lg:text-lg text-blue-100 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
            Da el primer paso hacia una educación más completa y certificada. Nuestro equipo está listo para asesorarte sin compromiso.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Link
              href="https://wa.me/5493516307002?text=Hola!%20Me%20interesa%20conocer%20sobre%20Centro%20de%20Formaciones"
              target="_blank"
              className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-sm md:text-base transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#25D366', color: 'white' }}
            >
              <span>Contactar por WhatsApp</span>
            </Link>
            <a
              href="mailto:info@centroformaciones.com"
              className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-sm md:text-base transition-all duration-300 hover:bg-white/10 border-2 flex items-center justify-center gap-2"
              style={{ borderColor: 'rgba(156, 186, 219, 0.5)', color: 'white' }}
            >
              <span>Enviar Email</span>
            </a>
          </div>

          <p className="text-xs md:text-sm text-blue-100/70 mt-6 md:mt-8">
            Respuesta en menos de 24 horas
          </p>
        </div>
      </section>
    </div>
  );
}
