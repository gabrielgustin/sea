'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookOpen, Users } from 'lucide-react';

interface RoleSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RoleSelectorModal({ open, onOpenChange }: RoleSelectorModalProps) {
  const router = useRouter();
  const { setUserRole } = useAuth();

  const handleSelectRole = (role: 'student' | 'admin') => {
    setUserRole(role);
    onOpenChange(false);
    
    // Redirect based on role
    if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/aula-virtual');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Selecciona tu rol</DialogTitle>
          <DialogDescription>
            ¿Cómo deseas acceder al sistema?
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-6">
          {/* Student Button */}
          <button
            onClick={() => handleSelectRole('student')}
            className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all hover:shadow-lg hover:scale-105"
            style={{
              borderColor: '#031e41',
              backgroundColor: '#f8fafb'
            }}
          >
            <BookOpen size={32} style={{ color: '#031e41' }} />
            <span className="font-semibold text-sm text-center" style={{ color: '#031e41' }}>
              Alumno
            </span>
            <span className="text-xs text-gray-600 text-center">
              Aula Virtual
            </span>
          </button>

          {/* Admin Button */}
          <button
            onClick={() => handleSelectRole('admin')}
            className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all hover:shadow-lg hover:scale-105"
            style={{
              borderColor: '#617587',
              backgroundColor: '#f8fafb'
            }}
          >
            <Users size={32} style={{ color: '#617587' }} />
            <span className="font-semibold text-sm text-center" style={{ color: '#617587' }}>
              Administrador
            </span>
            <span className="text-xs text-gray-600 text-center">
              Panel Admin
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
