'use client';

import Image from 'next/image';
import { Calendar, Clock, MapPin, DollarSign } from 'lucide-react';

export default function CourseDetailClient({ course }: { course: any }) {
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
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ color: '#08207f' }}>
                Sobre este curso
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {course.description}
              </p>
            </div>

            {/* Program - Compact Grid */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ color: '#08207f' }}>
                Contenidos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.modules && course.modules.map((module: any, index: number) => (
                  <div key={index} className="bg-white border-l-4 p-4 rounded-lg" style={{ borderColor: '#00a8cc' }}>
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs"
                        style={{ backgroundColor: '#08207f' }}
                      >
                        {module.number}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-900 mb-2">{module.title}</h3>
                        <ul className="space-y-1">
                          {module.topics && module.topics.slice(0, 2).map((topic: string, topicIndex: number) => (
                            <li key={topicIndex} className="flex items-start gap-1 text-gray-600 text-xs">
                              <span className="text-gray-400 flex-shrink-0">•</span>
                              <span>{topic}</span>
                            </li>
                          ))}
                          {module.topics && module.topics.length > 2 && (
                            <li className="text-gray-500 text-xs italic">+ {module.topics.length - 2} más</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Methodology & Final Project - Side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2" style={{ color: '#08207f' }}>
                  Metodología
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {course.methodology}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2" style={{ color: '#08207f' }}>
                  Proyecto Final
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {course.finalProject}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Info Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl p-5 border-2 space-y-4" style={{ borderColor: '#08207f' }}>
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
                <p className="text-lg font-bold" style={{ color: '#08207f' }}>{course.price}</p>
              </div>

              {/* Registration Button */}
              <button 
                className="w-full py-2 rounded-lg font-bold text-white text-sm transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                style={{ backgroundColor: '#08207f' }}
              >
                Solicitar Inscripción
              </button>

              {/* Contact Info */}
              <div className="pt-4 border-t" style={{ borderColor: '#e5e5e5' }}>
                <p className="text-xs font-semibold text-gray-600 mb-3">Información</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600">Teléfono</p>
                    <p className="text-xs font-bold text-gray-900">+54 (0) 351 5986016</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-xs font-bold text-gray-900">contacto@extension.edu.ar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
