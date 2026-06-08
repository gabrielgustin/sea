'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CourseTeacher {
  name: string;
  photo: string;
  description: string;
  linkedin?: string;
  whatsapp?: string;
}

export interface Course {
  id: string;
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
}

interface CoursesContextType {
  courses: Course[];
  loading: boolean;
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  getCourseById: (id: string) => Course | undefined;
  refreshCourses: () => Promise<void>;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export function CoursesProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses ?? []);
      }
    } catch (err) {
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const addCourse = async (course: Omit<Course, 'id'>) => {
    await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    });
    await fetchCourses();
  };

  const updateCourse = async (id: string, updatedData: Partial<Course>) => {
    console.log('[v0] updateCourse called with id:', id)
    console.log('[v0] updateCourse data:', updatedData)
    const res = await fetch('/api/courses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updatedData }),
    })
    const resData = await res.json()
    console.log('[v0] updateCourse response:', resData, 'status:', res.status)
    if (!res.ok) {
      throw new Error(resData.error || 'Failed to update course')
    }
    await fetchCourses();
  };

  const deleteCourse = async (id: string) => {
    await fetch('/api/courses', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await fetchCourses();
  };

  const getCourseById = (id: string) => {
    return courses.find(course => course.id === id);
  };

  return (
    <CoursesContext.Provider value={{ courses, loading, addCourse, updateCourse, deleteCourse, getCourseById, refreshCourses: fetchCourses }}>
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
