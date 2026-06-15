'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const params = useParams();
  const schoolId = typeof params?.schoolId === 'string' ? params.schoolId : 'savio';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in - usando localStorage persistente en lugar de sessionStorage
    const isLoggedIn = localStorage.getItem('userAuth') === 'true' || sessionStorage.getItem('userAuth') === 'true';
    const userRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');

    console.log('[v0] Admin page auth check:', { isLoggedIn, userRole });

    if (!isLoggedIn || userRole !== 'admin') {
      console.log('[v0] Not authenticated, redirecting to home');
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

  const handleLogout = () => {
    sessionStorage.removeItem('userAuth');
    sessionStorage.removeItem('userRole');
    router.push(`/${schoolId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Panel Administrativo</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Bienvenido, Administrador</h2>
          
          <p className="text-gray-600 mb-8 text-lg">
            Has iniciado sesión exitosamente en el panel administrativo de <strong>{schoolId.charAt(0).toUpperCase() + schoolId.slice(1)}</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Cards */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Gestionar Cursos</h3>
              <p className="text-blue-700 mb-4">Añade, edita y elimina cursos de tu plataforma</p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Ir a Cursos
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
              <h3 className="text-xl font-semibold text-purple-900 mb-2">Carrusel</h3>
              <p className="text-purple-700 mb-4">Configura las imágenes del carrusel de inicio</p>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Gestionar Carrusel
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
              <h3 className="text-xl font-semibold text-green-900 mb-2">Configuración</h3>
              <p className="text-green-700 mb-4">Ajusta la información general del sitio</p>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Configurar
              </button>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
              <h3 className="text-xl font-semibold text-orange-900 mb-2">Estudiantes</h3>
              <p className="text-orange-700 mb-4">Visualiza y gestiona los datos de estudiantes</p>
              <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Ver Estudiantes
              </button>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6 border border-pink-200">
              <h3 className="text-xl font-semibold text-pink-900 mb-2">Docentes</h3>
              <p className="text-pink-700 mb-4">Gestiona los docentes y sus datos</p>
              <button className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                Gestionar Docentes
              </button>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 border border-indigo-200">
              <h3 className="text-xl font-semibold text-indigo-900 mb-2">FAQs</h3>
              <p className="text-indigo-700 mb-4">Actualiza las preguntas frecuentes</p>
              <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Gestionar FAQs
              </button>
            </div>
          </div>

          <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Información del Sistema</h3>
            <p className="text-blue-700">
              Escuela: <strong>{schoolId.toUpperCase()}</strong>
            </p>
            <p className="text-blue-700 mt-2">
              Estado: <strong className="text-green-600">Conectado y funcionando correctamente</strong>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
