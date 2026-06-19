'use client';

import React from 'react';
import { Course } from '@/context/CoursesContext';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Image from 'next/image';

interface CoursePreviewProps {
  course: Course;
  onClose: () => void;
}

export default function CoursePreview({ course, onClose }: CoursePreviewProps) {
  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Header with Close Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold" style={{ color: '#031e41' }}>
          Vista Previa del Curso
        </h1>
        <Button
          onClick={onClose}
          variant="outline"
          size="lg"
          className="flex items-center gap-2"
        >
          <X size={20} /> Cerrar
        </Button>
      </div>

      {/* Course Preview */}
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-80 bg-gray-200 overflow-hidden">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute top-4 right-4 px-4 py-2 rounded-full text-white font-bold" style={{ backgroundColor: '#031e41' }}>
            {course.badge}
          </div>
        </div>

        {/* Course Content */}
        <div className="p-8 space-y-8">
          {/* Title Section */}
          <div>
            <h2 className="text-4xl font-bold mb-2" style={{ color: '#031e41' }}>
              {course.title}
            </h2>
            <p className="text-lg text-gray-600">{course.subtitle}</p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Inicia</p>
              <p className="font-bold" style={{ color: '#031e41' }}>
                {course.startDate ? (() => { const [y,m,d] = course.startDate.split('-'); return d && m && y ? `${parseInt(d)}/${m}/${y}` : course.startDate; })() : ''}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Duración</p>
              <p className="font-bold" style={{ color: '#031e41' }}>{course.duration}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Precio</p>
              <p className="font-bold" style={{ color: '#031e41' }}>{course.price}</p>
            </div>
          </div>

          {/* Description Section */}
          <div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: '#031e41' }}>
              Sobre este curso
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {course.description}
            </p>
          </div>

          {/* Location & Teacher */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Lugar</h4>
              <p className="text-gray-600">{course.location}</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Profesor/a</h4>
              <p className="text-gray-600">{course.teacher}</p>
            </div>
          </div>

          {/* Objective */}
          <div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: '#031e41' }}>
              Objetivo
            </h3>
            <p className="text-gray-700">{course.objective}</p>
          </div>

          {/* Modules */}
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#031e41' }}>
              Contenidos
            </h3>
            <div className="space-y-4">
              {course.modules.map((module, index) => (
                <div key={index} className="border-l-4 border-gray-300 pl-4 py-2" style={{ borderColor: '#00a8cc' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: '#031e41' }}
                    >
                      {module.number}
                    </div>
                    <h4 className="font-bold text-gray-900">{module.title}</h4>
                  </div>
                  <ul className="space-y-1 ml-11">
                    {module.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="text-gray-600 text-sm flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Methodology & Final Project */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#031e41' }}>
                Metodología
              </h3>
              <p className="text-gray-700">{course.methodology}</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#031e41' }}>
                Proyecto Final
              </h3>
              <p className="text-gray-700">{course.finalProject}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <div className="flex justify-center">
        <Button
          onClick={onClose}
          className="text-white"
          style={{ backgroundColor: '#031e41' }}
        >
          Cerrar Vista Previa
        </Button>
      </div>
    </div>
  );
}
