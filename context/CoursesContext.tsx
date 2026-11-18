'use client';

import React, { createContext, useContext, useState } from 'react';

export interface CourseTeacher {
  name: string;
  photo: string;
  description: string;
  linkedin?: string;
  whatsapp?: string;
}

export interface Commission {
  id: string;
  name: string;       // e.g. "Lunes 18hs", "Miércoles 20hs"
  maxCapacity: number;
  whatsappLink?: string; // Link al grupo de WhatsApp de esta comisión
}

export interface Course {
  id: string;
  schoolId?: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  startDate: string;
  enrollmentDeadline?: string;
  modality: string;
  slug: string;
  description: string;
  schedule: string;
  location: string;
  teacher: string;
  teachers?: CourseTeacher[];
  duration: string;
  price: string;
  requirements?: string;
  objective: string;
  modules: Array<{
    number: string;
    title: string;
    topics: string[];
  }>;
  methodology: string;
  finalProject: string;
  whatsappGroup?: string;
  level?: string;
  showOnHome?: boolean;
  commissions?: Commission[];
}

interface CoursesContextType {
  courses: Course[];
  loading: boolean;
  schoolId: string;
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  getCourseById: (id: string) => Course | undefined;
  refreshCourses: () => Promise<void>;
  reorderCourses: (orderedIds: string[]) => Promise<void>;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export function CoursesProvider({ children, schoolId, initialCourses }: { children: React.ReactNode; schoolId: string; initialCourses: Course[] }) {
  // Los cursos llegan ya cargados desde el servidor; el fetch solo se usa para refrescar tras editar.
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [loading, setLoading] = useState(false);
  const api = `/api/${schoolId}/courses`;

  // quiet: refresco en segundo plano, sin mostrar "cargando" (después de guardar).
  const fetchCourses = async (quiet = false) => {
    try {
      if (!quiet) setLoading(true);
      const res = await fetch(api);
      if (res.ok) {
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : (data.courses ?? []));
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error('[v0] Error loading courses:', err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const addCourse = async (course: Omit<Course, 'id'>) => {
    const res = await fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to add course');
    }
    await fetchCourses(true); // el curso nuevo trae datos que arma el servidor (id, slug)
  };

  // Optimista: la lista se actualiza al instante y después se sincroniza con el servidor.
  const updateCourse = async (id: string, updatedData: Partial<Course>) => {
    setCourses(prev => prev.map(c => (c.id === id ? { ...c, ...updatedData } : c)));
    const res = await fetch(api, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updatedData }),
    });
    const resData = await res.json();
    if (!res.ok) {
      fetchCourses(true);
      throw new Error(resData.error || 'Failed to update course');
    }
    fetchCourses(true);
  };

  const deleteCourse = async (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    const res = await fetch(api, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      const error = await res.json();
      await fetchCourses(true); // vuelve a mostrar el curso si no se pudo borrar
      throw new Error(error.error || 'Failed to delete course');
    }
  };

  const getCourseById = (id: string) => {
    return courses.find(course => course.id === id);
  };

  const reorderCourses = async (orderedIds: string[]) => {
    // Optimistically reorder in state
    setCourses(prev => {
      const map = new Map(prev.map(c => [c.id, c]));
      return orderedIds.map(id => map.get(id)!).filter(Boolean);
    });
    const res = await fetch(`${api}/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedIds }),
    });
    if (!res.ok) {
      // Rollback on error
      await fetchCourses(true);
      throw new Error('Failed to reorder courses');
    }
  };

  return (
    <CoursesContext.Provider value={{ courses, loading, schoolId, addCourse, updateCourse, deleteCourse, getCourseById, refreshCourses: () => fetchCourses(), reorderCourses }}>
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CoursesContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CoursesProvider');
  }
  return context;
}
