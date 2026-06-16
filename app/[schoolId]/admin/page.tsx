'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminDashboard from '@/components/admin-dashboard';

export default function AdminPage() {
  const router = useRouter();
  const params = useParams();
  const schoolId = typeof params?.schoolId === 'string' ? params.schoolId : 'savio';
  const { isAuthenticated, userRole, hydrated } = useAuth();

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated || userRole !== 'admin') {
      router.push(`/${schoolId}`);
    }
  }, [isAuthenticated, userRole, hydrated, router, schoolId]);

  // Mientras no se ha hidratado el contexto, mostrar loading
  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#031e41', borderTopColor: 'transparent' }} />
          <p className="text-gray-600">Cargando panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || userRole !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboard />
    </div>
  );
}
