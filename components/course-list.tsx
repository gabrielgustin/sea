'use client';

import React, { useState } from 'react';
import { Course } from '@/context/CoursesContext';
import { Edit2, Trash2, Eye, CheckCircle, XCircle, Calendar, Clock, MapPin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface CourseListProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
  onPreview: (course: Course) => void;
}

export default function CourseList({ courses, onEdit, onDelete, onPreview }: CourseListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [search, setSearch] = useState('');

  const filtered = courses.filter(c => {
    const status = (c as any).status ?? 'ACTIVE';
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && status !== 'INACTIVE') ||
      (filter === 'inactive' && status === 'INACTIVE');
    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.subtitle ?? '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="p-6 rounded-full mb-6" style={{ backgroundColor: '#eaf0f8' }}>
          <Eye size={48} style={{ color: '#031e41' }} />
        </div>
        <h3 className="text-2xl font-bold mb-2" style={{ color: '#031e41' }}>
          No hay cursos todavía
        </h3>
        <p className="text-gray-500 max-w-sm">
          Agrega tu primer curso con el botón &quot;Nuevo Curso&quot; de arriba.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por título o subtítulo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-900"
        />
        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={
                filter === f
                  ? { backgroundColor: '#031e41', color: 'white' }
                  : { backgroundColor: '#f3f4f6', color: '#4b5563' }
              }
            >
              {f === 'all' ? 'Todos' : f === 'active' ? 'Activos' : 'Inactivos'}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {filtered.length} {filtered.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(course => {
          const status = (course as any).status ?? 'ACTIVE';
          const isActive = status !== 'INACTIVE';
          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg group"
              style={{ border: '1.5px solid #e2e8f0' }}
            >
              {/* Image */}
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                {course.image ? (
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: '#031e41' }}
                  >
                    <span className="text-white text-4xl font-bold opacity-20 select-none">
                      {course.title.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  {isActive ? (
                    <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
                      <CheckCircle size={12} /> Activo
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700">
                      <XCircle size={12} /> Inactivo
                    </span>
                  )}
                </div>
                {course.badge && (
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full text-white" style={{ backgroundColor: '#031e41' }}>
                      {course.badge}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-base leading-tight mb-1 line-clamp-2" style={{ color: '#031e41' }}>
                  {course.title}
                </h3>
                {course.subtitle && (
                  <p className="text-gray-500 text-xs mb-3 line-clamp-1">{course.subtitle}</p>
                )}

                <div className="grid grid-cols-2 gap-1.5 mb-4 mt-auto">
                  {course.price && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <DollarSign size={12} style={{ color: '#031e41' }} />
                      <span className="truncate">{course.price}</span>
                    </div>
                  )}
                  {course.duration && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Clock size={12} style={{ color: '#031e41' }} />
                      <span className="truncate">{course.duration}</span>
                    </div>
                  )}
                  {course.schedule && (
                    <div className="flex items-center gap-1 text-xs text-gray-600 col-span-2">
                      <Calendar size={12} style={{ color: '#031e41' }} />
                      <span className="truncate">{course.schedule}</span>
                    </div>
                  )}
                  {course.location && (
                    <div className="flex items-center gap-1 text-xs text-gray-600 col-span-2">
                      <MapPin size={12} style={{ color: '#031e41' }} />
                      <span className="truncate">{course.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onPreview(course)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs"
                  >
                    <Eye size={14} />
                    Ver
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onEdit(course)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs text-white"
                    style={{ backgroundColor: '#031e41' }}
                  >
                    <Edit2 size={14} />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(course.id)}
                    className="flex items-center justify-center gap-1 text-xs"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
