'use client';

import React, { useState } from 'react';
import { useCourses, Course } from '@/context/CoursesContext';
import { Plus, Edit2, Trash2, Eye, EyeOff, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CourseForm from './course-form';
import CourseList from './course-list';
import CoursePreview from './course-preview';
import StudentsList from './students-list';

export default function AdminDashboard() {
  const { courses, addCourse, updateCourse, deleteCourse } = useCourses();
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);
  const [view, setView] = useState<'list' | 'form' | 'preview' | 'students'>('list');

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
            <h1 className="text-4xl font-bold" style={{ color: '#031e41' }}>
              {view === 'students' ? 'Gestionar Estudiantes' : 'Panel de Administración'}
            </h1>
            <p className="text-gray-600 mt-2">
              {view === 'students' 
                ? 'Visualiza y edita los datos de tus estudiantes' 
                : 'Gestiona los cursos disponibles'}
            </p>
          </div>
          
          {view === 'list' && (
            <Button
              onClick={handleAddNew}
              className="flex items-center gap-2 text-white"
              style={{ backgroundColor: '#031e41' }}
            >
              <Plus size={20} />
              Nuevo Curso
            </Button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 font-semibold transition-colors ${
              view === 'list' || view === 'form' || view === 'preview'
                ? 'text-blue-900 border-b-2' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={{
              borderBottomColor: view === 'list' || view === 'form' || view === 'preview' ? '#031e41' : 'transparent',
              color: view === 'list' || view === 'form' || view === 'preview' ? '#031e41' : '#666',
            }}
          >
            Cursos
          </button>
          <button
            onClick={() => setView('students')}
            className={`px-4 py-2 font-semibold transition-colors flex items-center gap-2 ${
              view === 'students'
                ? 'text-blue-900 border-b-2' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={{
              borderBottomColor: view === 'students' ? '#031e41' : 'transparent',
              color: view === 'students' ? '#031e41' : '#666',
            }}
          >
            <Users size={18} />
            Estudiantes
          </button>
        </div>

        {/* View Switcher */}
        {(view === 'list' || view === 'form' || view === 'preview') && (
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Total de cursos:</span>
              <span className="font-bold text-lg" style={{ color: '#031e41' }}>
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

        {view === 'students' && (
          <StudentsList />
        )}
      </div>
    </div>
  );
}
