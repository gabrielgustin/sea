'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Users, Award, Zap, TrendingUp, Building2, Lightbulb, Code } from 'lucide-react';
import { useState } from 'react';

export default function FormacionesPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="w-full h-[50vh] md:h-[60vh] flex items-center justify-center px-4 py-16 md:py-0"
        style={{
          background: 'linear-gradient(135deg, #031e41 0%, #1a4d7a 100%)'
        }}
      >
        <div className="w-full text-center text-white px-4">
          <div className="mb-6 inline-block px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(156, 186, 219, 0.2)' }}>
            <p className="text-sm font-semibold text-blue-200">Nuestro Servicio Principal</p>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight">
            Centro de Formacion
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 text-balance">
            Capacitaciones extracurriculares diseñadas como extensión académica para instituciones educativas
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="#contacto"
              className="px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#9cbadb', color: '#031e41' }}
            >
              Solicitar Consulta Gratuita
            </Link>
            <Link
              href="#servicios"
              className="px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 border-2 border-blue-200 hover:bg-white/10"
            >
              Conocer Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="w-full">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ color: '#031e41' }}>
            ¿Por qué elegir Centro de Formaciones?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Flexibilidad Total',
                description: 'Diseñamos programas adaptados a las necesidades específicas de tu institución, horarios y duración personalizada.'
              },
              {
                icon: Award,
                title: 'Certificaciones',
                description: 'Entregamos constancias de participación que respaldan el conocimiento adquirido y enriquecen el portfolio de cada estudiante.'
              },
              {
                icon: Users,
                title: 'Instructores Expertos',
                description: 'Profesionales con experiencia comprobada en sus áreas, comprometidos con la excelencia educativa.'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <item.icon size={40} style={{ color: '#9cbadb', marginBottom: '1rem' }} />
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#031e41' }}>
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="servicios" className="py-16 px-4">
        <div className="w-full">
          <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#031e41' }}>
            Nuestros Servicios
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Ofrecemos soluciones educativas integrales adaptadas a cada tipo de institución y comunidad
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                id: 'instituciones',
                icon: Building2,
                title: 'Capacitaciones Institucionales',
                description: 'Programas diseñados exclusivamente para instituciones educativas como extensión académica de calidad.',
                features: ['Currículum personalizado', 'Validación institucional', 'Certificación oficial']
              },
              {
                id: 'comunidad',
                icon: Users,
                title: 'Programas Comunitarios',
                description: 'Formaciones abiertas a la comunidad, generando impacto social y oportunidades para todos.',
                features: ['Acceso democrático', 'Precios accesibles', 'Impacto social']
              },
              {
                id: 'tecnologia',
                icon: Code,
                title: 'Formaciones Tecnológicas',
                description: 'Capacitaciones en las últimas tecnologías: desarrollo web, robótica, IA y herramientas digitales.',
                features: ['Docentes especializados', 'Equipamiento moderno', 'Proyectos prácticos']
              },
              {
                id: 'talleres',
                icon: Lightbulb,
                title: 'Talleres Especializados',
                description: 'Workshops cortos e intensivos en áreas específicas para desarrollo profesional rápido.',
                features: ['Formato intensivo', 'Contenido actual', 'Red de contactos']
              }
            ].map((service) => (
              <div
                key={service.id}
                className="p-8 border-2 border-gray-200 rounded-2xl hover:border-blue-300 transition-all duration-300 cursor-pointer hover:shadow-lg"
                onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
              >
                <service.icon size={48} style={{ color: '#031e41', marginBottom: '1rem' }} />
                <h3 className="text-2xl font-bold mb-3" style={{ color: '#031e41' }}>
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                {selectedService === service.id && (
                  <div className="pt-6 border-t border-gray-200">
                    <ul className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <CheckCircle size={20} style={{ color: '#9cbadb' }} />
                          <span className="text-gray-700">{feature}</span>
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

      {/* Benefits for Institutions */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-white">
        <div className="w-full">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ color: '#031e41' }}>
            Beneficios para Instituciones
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Generación de Ingresos',
                description: 'Diversifica las fuentes de ingresos de tu institución con programas educativos de calidad.',
                icon: TrendingUp
              },
              {
                title: 'Impacto Comunitario',
                description: 'Fortalece la relación con la comunidad y posiciona tu institución como referente educativo.',
                icon: Users
              },
              {
                title: 'Reconocimiento Académico',
                description: 'Potencia la reputación de tu institución con certificaciones y programas innovadores.',
                icon: Award
              }
            ].map((benefit, idx) => (
              <div key={idx} className="p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow">
                <benefit.icon size={40} style={{ color: '#9cbadb', marginBottom: '1rem' }} />
                <h3 className="text-2xl font-bold mb-3" style={{ color: '#031e41' }}>
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4" style={{ color: '#031e41' }}>
              Cómo Funciona
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Un proceso simple y transparente diseñado para asegurar que tu institución reciba exactamente lo que necesita
            </p>
          </div>

          {/* Timeline Container */}
          <div className="relative">
            {/* Connection line - Desktop only */}
            <div className="hidden lg:block absolute top-[100px] left-[5%] right-[5%] h-1" style={{
              background: 'linear-gradient(to right, transparent, #9cbadb, transparent)',
              zIndex: 0
            }}></div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-2 relative z-10">
              {[
                {
                  step: '01',
                  title: 'Consulta Inicial',
                  description: 'Conocemos tus necesidades específicas y objetivos institucionales'
                },
                {
                  step: '02',
                  title: 'Diseño Personalizado',
                  description: 'Creamos un programa adaptado a tu comunidad e institución'
                },
                {
                  step: '03',
                  title: 'Ejecución',
                  description: 'Implementamos el programa con docentes especializados y seguimiento continuo'
                },
                {
                  step: '04',
                  title: 'Certificación',
                  description: 'Emitimos certificados de reconocimiento validados'
                }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center h-full">
                  {/* Step Circle */}
                  <div className="mb-6 flex-shrink-0 relative">
                    <div
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center font-bold text-2xl md:text-3xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-110 flex-shrink-0"
                      style={{ 
                        backgroundColor: '#031e41',
                        color: '#ffffff'
                      }}
                    >
                      {item.step}
                    </div>
                    {/* Accent dot */}
                    <div 
                      className="absolute -bottom-2 -right-2 w-6 h-6 md:w-7 md:h-7 rounded-full border-4 border-white"
                      style={{ backgroundColor: '#9cbadb' }}
                    ></div>
                  </div>

                  {/* Card Container - Flex grow to fill available space */}
                  <div className="w-full px-2 sm:px-0 flex flex-col flex-grow">
                    <div 
                      className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 border-t-4 h-full flex flex-col justify-between"
                      style={{ borderTopColor: '#9cbadb' }}
                    >
                      <div>
                        <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4" style={{ color: '#031e41' }}>
                          {item.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contacto" className="py-16 md:py-24 px-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #031e41 0%, #1a4d7a 100%)'
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full -ml-40 -mb-40 blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          {/* Subtitle badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(156, 186, 219, 0.2)' }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#9cbadb' }}></span>
            <span className="text-sm font-semibold tracking-wide" style={{ color: '#9cbadb' }}>
              PRÓXIMO PASO
            </span>
          </div>

          {/* Main heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            ¿Listo para transformar <br className="hidden md:block" /> la educación en tu institución?
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Da el primer paso hacia una educación más completa y certificada. Nuestro equipo está listo para asesorarte sin compromiso.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
            <Link
              href="https://wa.me/5493516307002?text=Hola!%20Me%20interesa%20conocer%20sobre%20Centro%20de%20Formaciones"
              target="_blank"
              className="px-8 py-4 rounded-lg font-bold text-base md:text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-3 whitespace-nowrap"
              style={{ backgroundColor: '#25D366', color: 'white' }}
            >
              <span>💬</span>
              <span>Contactar por WhatsApp</span>
            </Link>
            <div className="hidden sm:block w-px h-8 bg-white/20"></div>
            <a
              href="mailto:info@centroformaciones.com"
              className="px-8 py-4 rounded-lg font-bold text-base md:text-lg transition-all duration-300 hover:bg-white/10 hover:shadow-lg border-2 flex items-center gap-3 whitespace-nowrap"
              style={{ borderColor: 'rgba(156, 186, 219, 0.5)', color: 'white' }}
            >
              <span>📧</span>
              <span>Enviar Email</span>
            </a>
          </div>

          {/* Footer note */}
          <p className="text-sm text-blue-100/70 mt-8">
            Respuesta en menos de 24 horas
          </p>
        </div>
      </section>
    </div>
  );
}
