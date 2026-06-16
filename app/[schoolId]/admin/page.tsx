'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const router = useRouter();
  const params = useParams();
  const schoolId = typeof params?.schoolId === 'string' ? params.schoolId : 'savio';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticación desde localStorage
    const isLoggedIn = localStorage.getItem('userAuth') === 'true';
    const userRole = localStorage.getItem('userRole');

    console.log('[v0] Admin page auth:', { isLoggedIn, userRole });

    if (!isLoggedIn || userRole !== 'admin') {
      router.push(`/${schoolId}`);
      return;
    }

    setIsAuthenticated(true);
    setLoading(false);
  }, [schoolId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-700 text-xl">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Panel Administrativo</h1>
          <button
            onClick={() => {
              localStorage.removeItem('userAuth');
              localStorage.removeItem('userRole');
              router.push(`/${schoolId}`);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Bienvenido, Administrador</h2>
          
          <p className="text-gray-600 mb-8 text-lg">
            Has iniciado sesión exitosamente en el panel administrativo de <strong>{schoolId.charAt(0).toUpperCase() + schoolId.slice(1)}</strong>.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Panel Administrativo Funcional</h3>
            <p className="text-blue-700 mb-4">
              El panel administrativo está en construcción. Por el momento, tienes acceso autenticado a esta sección.
            </p>
            <ul className="list-disc pl-5 text-blue-700 space-y-2">
              <li>Gestionar Cursos</li>
              <li>Administrar Carrusel</li>
              <li>Gestionar Estudiantes</li>
              <li>Gestionar Docentes</li>
              <li>Administrar FAQs</li>
              <li>Configuración del Sitio</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
