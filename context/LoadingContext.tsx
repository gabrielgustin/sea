'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCourses } from './CoursesContext';

interface LoadingContextType {
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { loading: coursesLoading } = useCourses();

  useEffect(() => {
    // La página termina de cargar cuando los cursos están listos
    setIsLoading(coursesLoading);
  }, [coursesLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
