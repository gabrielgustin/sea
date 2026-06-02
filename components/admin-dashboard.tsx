'use client';

import React, { useState } from 'react';
import { useCourses, Course } from '@/context/CoursesContext';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CourseForm from './course-form';
import CourseList from './course-list';
import CoursePreview from './course-preview';

export default function AdminDashboard() {
  const { courses, addCourse, updateCourse, deleteCourse } = useCourses();
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);
  const [view, setView] = useState<'list' | 'form' | 'preview'>('list');

  const handleAddNew = () => {
    setEditingCourse(null);
    setShowForm(true);
    setView('form');
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setShowForm(true);
    setView('form');
  };

  const handleDelete = (courseId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      deleteCourse(courseId);
    }
  };

  const handlePreview = (course: Course) => {
    setPreviewCourse(course);
    setView('preview');
  };

  const handleSave = (courseData: any) => {
    if (editingCourse) {
      updateCourse(editingCourse.id, courseData);
    } else {
      addCourse(courseData);
    }
    setView('list');
    setEditingCourse(null);
    setShowForm(false);
  };

  const handleCancel = () => {
    setView('list');
    setEditingCourse(null);
    setShowForm(false);
    setPreviewCourse(null);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold" style={{ color: '#08207f' }}>
              Panel de Administración
            </h1>
            <p className="text-gray-600 mt-2">Gestiona los cursos disponibles</p>
          </div>
          
          {view === 'list' && (
            <Button
              onClick={handleAddNew}
              className="flex items-center gap-2 text-white"
              style={{ backgroundColor: '#08207f' }}
            >
              <Plus size={20} />
              Nuevo Curso
            </Button>
          )}
        </div>

        {/* View Switcher */}
        {view === 'list' && (
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Total de cursos:</span>
              <span className="font-bold text-lg" style={{ color: '#08207f' }}>
                {courses.length}
              </span>
            </div>
          </div>
        )}

        {/* Main Content */}
        {view === 'list' && (
          <CourseList
            courses={courses}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPreview={handlePreview}
          />
        )}

        {view === 'form' && (
          <CourseForm
            course={editingCourse || undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        {view === 'preview' && previewCourse && (
          <CoursePreview
            course={previewCourse}
            onClose={handleCancel}
          />
        )}
      </div>
    </div>
  );
}
