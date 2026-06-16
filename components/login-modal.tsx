'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Users, Shield } from 'lucide-react';
import { useParams } from 'next/navigation';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess?: () => void;
}

export default function LoginModal({ open, onOpenChange, onLoginSuccess }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const schoolId = typeof params?.schoolId === 'string' ? params.schoolId : 'savio';
  const { login, selectedRole, setSelectedRole } = useAuth();

  useEffect(() => {
    if (open) {
      setUsername('');
      setPassword('');
      setError('');
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      const result = await login(username, password, schoolId);

      if (result.success) {
        setUsername('');
        setPassword('');
        onLoginSuccess?.();
        onOpenChange(false);
        if (result.redirectUrl) {
          setTimeout(() => {
            window.location.href = result.redirectUrl!;
          }, 100);
        }
      } else {
        const hint = selectedRole === 'admin'
          ? `Intenta con usuario: ${schoolId} y contraseña: ${schoolId}`
          : 'Usuario y contraseña deben ser tu DNI';
        setError(result.error || `Credenciales incorrectas. ${hint}`);
      }
    } catch (err) {
      setError('Error al procesar el login. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold" style={{ color: '#031e41' }}>
            Iniciar Sesión
          </DialogTitle>
          <DialogDescription>
            Selecciona tu tipo de cuenta e ingresa tus credenciales
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Role Selector */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                selectedRole === 'student'
                  ? 'border-blue-900 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={selectedRole === 'student' ? { borderColor: '#031e41', backgroundColor: 'rgba(3,30,65,0.05)' } : {}}
            >
              <Users size={18} style={{ color: selectedRole === 'student' ? '#031e41' : '#9ca3af' }} />
              <span className="font-semibold text-sm" style={{ color: selectedRole === 'student' ? '#031e41' : '#6b7280' }}>
                Estudiante
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                selectedRole === 'admin'
                  ? 'border-blue-900 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={selectedRole === 'admin' ? { borderColor: '#031e41', backgroundColor: 'rgba(3,30,65,0.05)' } : {}}
            >
              <Shield size={18} style={{ color: selectedRole === 'admin' ? '#031e41' : '#9ca3af' }} />
              <span className="font-semibold text-sm" style={{ color: selectedRole === 'admin' ? '#031e41' : '#6b7280' }}>
                Administrador
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">
                {selectedRole === 'admin' ? 'Usuario' : 'DNI'}
              </Label>
              <Input
                id="username"
                type="text"
                placeholder={selectedRole === 'admin' ? schoolId : 'Tu DNI'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder={selectedRole === 'admin' ? '••••••••' : 'Tu DNI'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              {selectedRole === 'student' && (
                <p className="text-xs text-gray-500">
                  Para estudiantes: usuario y contraseña deben ser tu DNI
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 text-white"
                style={{ backgroundColor: '#031e41' }}
                disabled={loading}
              >
                {loading ? 'Validando...' : 'Ingresar'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
