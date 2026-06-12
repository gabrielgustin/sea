'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCourses, Course } from '@/context/CoursesContext';
import { useAuth } from '@/context/AuthContext';
import { useSchool } from '@/context/SchoolContext';
import { Plus, Edit2, Trash2, Eye, EyeOff, Users, Sliders, HelpCircle, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CourseForm from './course-form';
import CourseList from './course-list';
import CoursePreview from './course-preview';
import StudentsList from './students-list';
import CarouselManager from './carousel-manager';
import FAQManager from './faq-manager';
import SettingsManager from './settings-manager';
import { TeacherManager } from './teacher-manager';

export default function AdminDashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const { schoolId } = useSchool();
  const { courses, addCourse, updateCourse, deleteCourse } = useCourses();
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);
  const [view, setView] = useState<'list' | 'form' | 'preview' | 'students' | 'carousel' | 'faq' | 'settings' | 'teachers'>('list');

  const handleLogout = () => {
    logout();
    router.push(`/${schoolId}`);
  };

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

  const handleDelete = (courseId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      deleteCourse(courseId);
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const handlePreview = (course: Course) => {
    setPreviewCourse(course);
    setView('preview');
  };

  const handleSave = async (courseData: any) => {
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, courseData);
      } else {
        await addCourse(courseData);
      }
      // Forzar recarga de la página para refrescar los datos
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      console.error('[v0] handleSave error:', err);
      alert('Error al guardar el curso: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    }
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
              {view === 'carousel' ? 'Gestionar Carrusel' : view === 'students' ? 'Gestionar Estudiantes' : view === 'faq' ? 'Preguntas Frecuentes' : view === 'settings' ? 'Configuracion' : view === 'teachers' ? 'Gestión de Docentes' : 'Panel de Administracion'}
            </h1>
            <p className="text-gray-600 mt-2">
              {view === 'carousel' 
                ? 'Configura las imagenes y contenido del carrusel de inicio'
                : view === 'students' 
                ? 'Visualiza y edita los datos de tus estudiantes'
                : view === 'faq'
                ? 'Gestiona las preguntas frecuentes del sitio'
                : view === 'settings'
                ? 'Configura enlaces y datos de contacto'
                : view === 'teachers'
                ? 'Añade, edita y elimina docentes de SEA'
                : 'Gestiona los cursos disponibles'}
            </p>
          </div>
          
          <div className="flex gap-3 flex-wrap">
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
            
            <Button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              <LogOut size={20} />
              Cerrar Sesión
            </Button>
          </div>
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
            onClick={() => setView('carousel')}
            className={`px-4 py-2 font-semibold transition-colors flex items-center gap-2 ${
              view === 'carousel'
                ? 'text-blue-900 border-b-2' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={{
              borderBottomColor: view === 'carousel' ? '#031e41' : 'transparent',
              color: view === 'carousel' ? '#031e41' : '#666',
            }}
          >
            <Sliders size={18} />
            Carrusel
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
          <button
            onClick={() => setView('faq')}
            className={`px-4 py-2 font-semibold transition-colors flex items-center gap-2 ${
              view === 'faq'
                ? 'text-blue-900 border-b-2' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={{
              borderBottomColor: view === 'faq' ? '#031e41' : 'transparent',
              color: view === 'faq' ? '#031e41' : '#666',
            }}
          >
            <HelpCircle size={18} />
            FAQ
          </button>
          <button
            onClick={() => setView('settings')}
            className={`px-4 py-2 font-semibold transition-colors flex items-center gap-2 ${
              view === 'settings'
                ? 'text-blue-900 border-b-2' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={{
              borderBottomColor: view === 'settings' ? '#031e41' : 'transparent',
              color: view === 'settings' ? '#031e41' : '#666',
            }}
          >
            <Settings size={18} />
            Configuracion
          </button>
          <button
            onClick={() => setView('teachers')}
            className={`px-4 py-2 font-semibold transition-colors flex items-center gap-2 ${
              view === 'teachers'
                ? 'text-blue-900 border-b-2' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={{
              borderBottomColor: view === 'teachers' ? '#031e41' : 'transparent',
              color: view === 'teachers' ? '#031e41' : '#666',
            }}
          >
            <Users size={18} />
            Docentes
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

        {view === 'carousel' && (
          <CarouselManager />
        )}

        {view === 'faq' && (
          <FAQManager />
        )}

        {view === 'settings' && (
          <SettingsManager />
        )}

        {view === 'teachers' && (
          <TeacherManager />
        )}
      </div>
    </div>
  );
}
