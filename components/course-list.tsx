'use client';

import React from 'react';
import { Course } from '@/context/CoursesContext';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Eye } from 'lucide-react';
import Image from 'next/image';

interface CourseListProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (courseId: number) => void;
  onPreview: (course: Course) => void;
}

export default function CourseList({
  courses,
  onEdit,
  onDelete,
  onPreview,
}: CourseListProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
      {courses.map((course) => (
        <div
          key={course.id}
          className="border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-white"
        >
          {/* Course Image */}
          <div className="relative h-40 bg-gray-200 overflow-hidden group">
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-bold" style={{ backgroundColor: '#031e41' }}>
              {course.badge}
            </div>
          </div>

          {/* Course Info */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{course.title}</h3>
              <p className="text-sm text-gray-600">{course.subtitle}</p>
            </div>

            {/* Course Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>
                <span className="font-semibold">Inicia:</span> {course.startDate}
              </div>
              <div>
                <span className="font-semibold">Duración:</span> {course.duration}
              </div>
              <div>
                <span className="font-semibold">Lugar:</span> {course.location}
              </div>
              <div>
                <span className="font-semibold">Precio:</span> {course.price}
              </div>
            </div>

            {/* Module Count */}
            <div className="text-xs text-gray-500">
              <span className="font-semibold">{course.modules.length}</span> módulos
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <Button
                onClick={() => onPreview(course)}
                size="sm"
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                <span>Ver</span>
              </Button>
              <Button
                onClick={() => onEdit(course)}
                size="sm"
                className="flex-1 flex items-center justify-center gap-2 text-white"
                style={{ backgroundColor: '#031e41' }}
              >
                <Edit2 size={16} />
                <span>Editar</span>
              </Button>
              <Button
                onClick={() => onDelete(course.id)}
                size="sm"
                variant="ghost"
                className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 size={16} />
                <span>Eliminar</span>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
