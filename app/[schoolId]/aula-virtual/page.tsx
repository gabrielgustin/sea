'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSchool } from '@/context/SchoolContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BookOpen, LogOut } from 'lucide-react';

export default function AulaVirtualPage() {
  const { userRole, logout } = useAuth();
  const { schoolId } = useSchool();
  const router = useRouter();

  React.useEffect(() => {
    if (userRole !== 'student') {
      router.push(`/${schoolId}`);
    }
  }, [userRole, router, schoolId]);

  const handleLogout = () => {
    logout();
    router.push(`/${schoolId}`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#f5f7fa' }}>
      <div className="max-w-2xl w-full">
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <BookOpen size={48} style={{ color: '#031e41' }} />
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#031e41' }}>
            Aula Virtual
          </h1>
          <p className="text-gray-600">Bienvenido al aula virtual de estudiantes</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2" style={{ borderColor: '#031e41' }}>
          <div className="text-center space-y-6">
            <p className="text-lg text-gray-700">
              Accede a tus cursos, materiales y recursos educativos desde aquí.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#f0f4f8' }}>
                <div className="text-2xl font-bold mb-2" style={{ color: '#031e41' }}>0</div>
                <p className="text-sm text-gray-600">Cursos Activos</p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#f0f4f8' }}>
                <div className="text-2xl font-bold mb-2" style={{ color: '#031e41' }}>0</div>
                <p className="text-sm text-gray-600">Tareas Pendientes</p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#f0f4f8' }}>
                <div className="text-2xl font-bold mb-2" style={{ color: '#031e41' }}>0</div>
                <p className="text-sm text-gray-600">Mensajes</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 italic">
              Esta sección estará disponible próximamente con tus cursos y recursos.
            </p>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-lg transition-all hover:scale-105"
            style={{ backgroundColor: '#031e41' }}
          >
            <LogOut size={20} />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
