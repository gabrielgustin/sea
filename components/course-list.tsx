'use client';

import React, { useState, useEffect } from 'react';
import { Course, useCourses } from '@/context/CoursesContext';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Eye, Home } from 'lucide-react';
import Image from 'next/image';

interface CourseListProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
  onPreview: (course: Course) => void;
}

export default function CourseList({
  courses,
  onEdit,
  onDelete,
  onPreview,
}: CourseListProps) {
  const { refreshCourses } = useCourses();

  // Sync homeStatus with courses prop whenever it changes
  const [homeStatus, setHomeStatus] = useState<Record<string, boolean>>(
    () => Object.fromEntries(courses.map((c) => [c.id, c.showOnHome ?? false]))
  );
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setHomeStatus(Object.fromEntries(courses.map((c) => [c.id, c.showOnHome ?? false])));
  }, [courses]);

  const handleToggleHome = async (courseId: string) => {
    const current = homeStatus[courseId] ?? false;
    const next = !current;
    // Optimistic update
    setHomeStatus((prev) => ({ ...prev, [courseId]: next }));
    setLoading((prev) => ({ ...prev, [courseId]: true }));
    try {
      const res = await fetch('/api/courses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: courseId, showOnHome: next }),
      });
      if (res.ok) {
        // Refresh context so the value is persisted globally
        await refreshCourses();
      } else {
        // Revert on failure
        setHomeStatus((prev) => ({ ...prev, [courseId]: current }));
      }
    } catch {
      // Revert on error
      setHomeStatus((prev) => ({ ...prev, [courseId]: current }));
    } finally {
      setLoading((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
      {courses.map((course) => {
        const isOnHome = homeStatus[course.id] ?? false;
        const isToggling = loading[course.id] ?? false;

        return (
          <div
            key={course.id}
            className="border-2 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-white"
            style={{ borderColor: isOnHome ? '#031e41' : '#e5e7eb' }}
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
              {/* Home badge */}
              {isOnHome && (
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1 bg-emerald-600">
                  <Home size={11} />
                  En Home
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{course.title}</h3>
                <p className="text-sm text-gray-600">{course.subtitle}</p>
              </div>

              {/* Course Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div><span className="font-semibold">Inicia:</span> {course.startDate}</div>
                <div><span className="font-semibold">Duración:</span> {course.duration}</div>
                <div><span className="font-semibold">Lugar:</span> {course.location}</div>
                <div><span className="font-semibold">Precio:</span> {course.price}</div>
              </div>

              <div className="text-xs text-gray-500">
                <span className="font-semibold">{course.modules.length}</span> módulos
              </div>

              {/* Show on Home toggle */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Home size={14} className={isOnHome ? 'text-emerald-600' : 'text-gray-400'} />
                  <span className="text-xs font-medium text-gray-700">Mostrar en Inicio</span>
                </div>
                <button
                  onClick={() => handleToggleHome(course.id)}
                  disabled={isToggling}
                  aria-label={isOnHome ? 'Quitar de inicio' : 'Mostrar en inicio'}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                    isOnHome ? 'bg-emerald-500' : 'bg-gray-300'
                  } ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                      isOnHome ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-gray-200">
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
        );
      })}
    </div>
  );
}
