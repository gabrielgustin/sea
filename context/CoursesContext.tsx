'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { coursesData } from '@/lib/coursesData';

export interface Course {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  startDate: string;
  modality: string;
  slug: string;
  description: string;
  schedule: string;
  location: string;
  teacher: string;
  duration: string;
  price: string;
  objective: string;
  modules: Array<{
    number: string;
    title: string;
    topics: string[];
  }>;
  methodology: string;
  finalProject: string;
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
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) {
      try {
        setCourses(JSON.parse(savedCourses));
      } catch (error) {
        console.log('[v0] Error parsing courses from localStorage:', error);
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
