'use client';

import Image from 'next/image';
import { Calendar, Clock, MapPin, DollarSign } from 'lucide-react';

export default function CourseDetailClient({ course }: { course: any }) {
  return (
    <div className="w-full">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b-2 shadow-blue-sm" style={{ borderColor: '#08207f' }}>
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="px-3 py-1 rounded-full text-white font-bold text-xs md:text-sm"
                style={{ backgroundColor: '#00a8cc' }}
              >
                {course.badge}
              </div>
              <h1 className="text-lg md:text-2xl font-bold text-gray-900 hidden sm:block">{course.title}</h1>
            </div>
            <div className="text-sm font-semibold" style={{ color: '#08207f' }}>
              {course.startDate}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Image */}
      <section className="relative w-full h-96 md:h-[500px] overflow-hidden">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover"
          priority
        />
        
        {/* Overlay with Badge */}
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-start px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto w-full">
            <div 
              className="inline-block px-6 py-3 rounded-full text-white font-bold text-sm md:text-base mb-6"
              style={{ backgroundColor: '#00a8cc' }}
            >
              {course.badge}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
              {course.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ color: '#08207f' }}>
                Sobre este curso
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {course.objective}
              </p>
            </div>

            {/* Program */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8" style={{ color: '#08207f' }}>
                Contenidos del Curso
              </h2>
              <div className="space-y-6">
                {course.modules && course.modules.map((module: any, index: number) => (
                  <div key={index} className="bg-white border-l-4 p-6 rounded-lg" style={{ borderColor: '#00a8cc' }}>
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg"
                        style={{ backgroundColor: '#08207f' }}
                      >
                        {module.number}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">{module.title}</h3>
                        <ul className="space-y-2">
                          {module.topics && module.topics.map((topic: string, topicIndex: number) => (
                            <li key={topicIndex} className="flex items-start gap-2 text-gray-600">
                              <span className="text-gray-400 mt-1">•</span>
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

            {/* Methodology */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ color: '#08207f' }}>
                Metodología
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {course.methodology}
              </p>
            </div>

            {/* Final Project */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ color: '#08207f' }}>
                Proyecto Final
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {course.finalProject}
              </p>
            </div>

            {/* Instructor */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ color: '#08207f' }}>
                Instructor
              </h2>
              <div className="border-2 rounded-2xl p-6" style={{ borderColor: '#08207f' }}>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.teacher}</h3>
                <p className="text-gray-600">Profesional especializado con amplia experiencia en el sector</p>
              </div>
            </div>
          </div>

          {/* Right Column - Info Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl p-8 border-2 space-y-6" style={{ borderColor: '#08207f' }}>
              {/* Start Date */}
              <div className="pb-6 border-b-2" style={{ borderColor: '#e5e5e5' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={20} style={{ color: '#08207f' }} />
                  <span className="text-sm font-semibold text-gray-600">Inicia</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{course.startDate}</p>
              </div>

              {/* Schedule */}
              <div className="pb-6 border-b-2" style={{ borderColor: '#e5e5e5' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={20} style={{ color: '#08207f' }} />
                  <span className="text-sm font-semibold text-gray-600">Horario</span>
                </div>
                <p className="text-gray-900">{course.schedule}</p>
              </div>

              {/* Location */}
              <div className="pb-6 border-b-2" style={{ borderColor: '#e5e5e5' }}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={20} style={{ color: '#08207f' }} />
                  <span className="text-sm font-semibold text-gray-600">Lugar</span>
                </div>
                <p className="text-gray-900">{course.location}</p>
              </div>

              {/* Duration */}
              <div className="pb-6 border-b-2" style={{ borderColor: '#e5e5e5' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={20} style={{ color: '#08207f' }} />
                  <span className="text-sm font-semibold text-gray-600">Duración</span>
                </div>
                <p className="text-gray-900">{course.duration}</p>
              </div>

              {/* Price */}
              <div className="pb-8 border-b-2" style={{ borderColor: '#e5e5e5' }}>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={20} style={{ color: '#08207f' }} />
                  <span className="text-sm font-semibold text-gray-600">Inversión</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#08207f' }}>{course.price}</p>
              </div>

              {/* Registration Button */}
              <button 
                className="w-full py-3 rounded-lg font-bold text-white transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                style={{ backgroundColor: '#08207f' }}
              >
                Solicitar Inscripción
              </button>
            </div>

            {/* Contact Section */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ color: '#08207f' }}>
                ¿Más información?
              </h3>
              <div className="bg-white rounded-2xl p-6 border-2 space-y-4" style={{ borderColor: '#e5e5e5' }}>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Teléfono</p>
                  <p className="text-lg font-bold text-gray-900">+54 (0) 351 5986016</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Email</p>
                  <p className="text-lg font-bold text-gray-900">contacto@extension.edu.ar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
