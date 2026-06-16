'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

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
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export function CoursesProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Derive schoolId from the URL path
  const segments = pathname.split('/').filter(Boolean);
  const schoolId = (segments[0] === 'savio' || segments[0] === 'villada') ? segments[0] : 'savio';

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/courses?schoolId=${schoolId}`);
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

  useEffect(() => {
    fetchCourses();
  }, [schoolId]);

  const addCourse = async (course: Omit<Course, 'id'>) => {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...course, schoolId }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to add course');
    }
    await fetchCourses();
  };

  const updateCourse = async (id: string, updatedData: Partial<Course>) => {
    const res = await fetch('/api/courses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updatedData, schoolId }),
    });
    const resData = await res.json();
    if (!res.ok) {
      console.error('[v0] updateCourse error detail:', resData);
      throw new Error((resData.detail || resData.error) || 'Failed to update course');
    }
    await fetchCourses();
  };

  const deleteCourse = async (id: string) => {
    const res = await fetch('/api/courses', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, schoolId }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to delete course');
    }
    await fetchCourses();
  };

  const getCourseById = (id: string) => {
    return courses.find(course => course.id === id);
  };

  return (
    <CoursesContext.Provider value={{ courses, loading, schoolId, addCourse, updateCourse, deleteCourse, getCourseById, refreshCourses: fetchCourses }}>
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
