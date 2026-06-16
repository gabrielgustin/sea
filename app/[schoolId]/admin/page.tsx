'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, Component } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminDashboard from '@/components/admin-dashboard';

class ErrorBoundary extends Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-bold text-red-600 mb-4">Error al cargar el panel</h2>
            <pre className="text-sm text-gray-700 bg-gray-100 p-4 rounded overflow-auto max-h-64">
              {(this.state.error as Error).message}
              {'\n'}
              {(this.state.error as Error).stack}
            </pre>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-lg">
              Recargar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <AdminDashboard />
      </div>
    </ErrorBoundary>
  );
}
