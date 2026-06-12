'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSchool } from './SchoolContext';

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
  showOnHome?: boolean;
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
  const { schoolId, isReady } = useSchool();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    if (!isReady) return;
    
    try {
      setLoading(true);
      const res = await fetch(`/api/courses?schoolId=${schoolId}`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses ?? []);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error('Error loading courses:', err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [schoolId, isReady]);

  const addCourse = async (course: Omit<Course, 'id'>) => {
    const res = await fetch(`/api/courses?schoolId=${schoolId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to add course');
    }
    await fetchCourses();
  };

  const updateCourse = async (id: string, updatedData: Partial<Course>) => {
    const res = await fetch(`/api/courses?schoolId=${schoolId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updatedData }),
    })
    const resData = await res.json()
    if (!res.ok) {
      throw new Error(resData.error || 'Failed to update course')
    }
    await fetchCourses();
  };

  const deleteCourse = async (id: string) => {
    const res = await fetch(`/api/courses?schoolId=${schoolId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
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
