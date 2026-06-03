'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Users, Shield } from 'lucide-react';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess?: () => void;
}

export default function LoginModal({ open, onOpenChange, onLoginSuccess }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, selectedRole, setSelectedRole } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    const success = login(username, password);
    if (success) {
      setUsername('');
      setPassword('');
      onLoginSuccess?.();
      
      // Redirigir según el rol
      if (selectedRole === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/aula-virtual';
      }
      onOpenChange(false);
    } else {
      const credentialHint = selectedRole === 'admin' 
        ? 'admin / admin' 
        : 'alumno / alumno';
      setError(`Credenciales incorrectas. Intenta con: ${credentialHint}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Iniciar Sesión</DialogTitle>
          <DialogDescription>
            Selecciona tu tipo de cuenta e ingresa tus credenciales
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Role Selector Toggle */}
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedRole('admin')}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                selectedRole === 'admin'
                  ? 'border-blue-900 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              style={{
                borderColor: selectedRole === 'admin' ? '#031e41' : undefined,
                backgroundColor: selectedRole === 'admin' ? 'rgba(3, 30, 65, 0.05)' : undefined,
              }}
            >
              <Shield size={20} style={{ color: '#031e41' }} />
              <span className="font-semibold" style={{ color: '#031e41' }}>Administrador</span>
            </button>

            <button
              onClick={() => setSelectedRole('student')}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                selectedRole === 'student'
                  ? 'border-blue-900 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              style={{
                borderColor: selectedRole === 'student' ? '#031e41' : undefined,
                backgroundColor: selectedRole === 'student' ? 'rgba(3, 30, 65, 0.05)' : undefined,
              }}
            >
              <Users size={20} style={{ color: '#031e41' }} />
              <span className="font-semibold" style={{ color: '#031e41' }}>Alumno</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder={selectedRole === 'admin' ? 'admin' : 'alumno'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="transition-smooth"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="transition-smooth"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 text-white"
                style={{ backgroundColor: '#031e41' }}
              >
                Ingresar
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
