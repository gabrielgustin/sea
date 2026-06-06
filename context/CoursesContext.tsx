'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { coursesData } from '@/lib/coursesData';

// Versión de los datos — incrementar cuando se actualicen datos en coursesData.ts
const COURSES_DATA_VERSION = '2';

export interface CourseTeacher {
  name: string;
  photo: string;
  description: string;
  linkedin?: string;
  whatsapp?: string;
}

export interface Course {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  startDate: string;
  enrollmentDeadline?: string; // Fecha límite para inscripciones (formato: YYYY-MM-DD)
  modality: string;
  slug: string;
  description: string;
  schedule: string;
  location: string;
  teacher: string;
  teachers?: CourseTeacher[]; // Array de docentes con info detallada
  duration: string;
  price: string;
  requirements?: string; // Requisitos para inscribirse
  objective: string;
  modules: Array<{
    number: string;
    title: string;
    topics: string[];
  }>;
  methodology: string;
  finalProject: string;
  whatsappGroup?: string; // Link al grupo de WhatsApp del curso
  level?: string; // Nivel del curso (Principiante, Intermedio, Avanzado)
}

interface CoursesContextType {
  courses: Course[];
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: number, course: Partial<Course>) => void;
  deleteCourse: (id: number) => void;
  getCourseById: (id: number) => Course | undefined;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export function CoursesProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedVersion = localStorage.getItem('courses_data_version');
    const savedCourses = localStorage.getItem('courses');

    // Si la versión no coincide, resetear con los datos actualizados del código
    if (savedVersion !== COURSES_DATA_VERSION) {
      setCourses(coursesData);
      localStorage.setItem('courses', JSON.stringify(coursesData));
      localStorage.setItem('courses_data_version', COURSES_DATA_VERSION);
      return;
    }

    if (savedCourses) {
      try {
        setCourses(JSON.parse(savedCourses));
      } catch (error) {
        console.error('Error parsing courses from localStorage:', error);
        setCourses(coursesData);
      }
    } else {
      setCourses(coursesData);
      localStorage.setItem('courses', JSON.stringify(coursesData));
    }
  }, []);

  // Save to localStorage whenever courses change
  useEffect(() => {
    if (courses.length > 0) {
      localStorage.setItem('courses', JSON.stringify(courses));
    }
  }, [courses]);

  const addCourse = (course: Omit<Course, 'id'>) => {
    const newId = Math.max(...courses.map(c => c.id), 0) + 1;
    const newCourse: Course = { ...course, id: newId } as Course;
    setCourses([...courses, newCourse]);
  };

  const updateCourse = (id: number, updatedData: Partial<Course>) => {
    setCourses(courses.map(course =>
      course.id === id ? { ...course, ...updatedData } : course
    ));
  };

  const deleteCourse = (id: number) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const getCourseById = (id: number) => {
    return courses.find(course => course.id === id);
  };

  return (
    <CoursesContext.Provider value={{ courses, addCourse, updateCourse, deleteCourse, getCourseById }}>
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
