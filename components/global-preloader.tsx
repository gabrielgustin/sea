'use client';

import { useLoading } from '@/context/LoadingContext';

export default function GlobalPreloader() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-background">
      {/* Spinner animado */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        </div>
        <p className="text-sm text-muted-foreground">Cargando...</p>
      </div>
    </div>
  );
}
