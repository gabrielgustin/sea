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
  const [loading, setLoading] = useState(false);
  const { login, selectedRole, setSelectedRole } = useAuth();

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
      const result = await login(username, password);
      
      if (result.success) {
        setUsername('');
        setPassword('');
        onLoginSuccess?.();
        
        // Redirigir según el resultado
        if (result.redirectUrl) {
          // Si es URL externa, usar window.location.href
          if (result.redirectUrl.startsWith('http')) {
            window.location.href = result.redirectUrl;
          } else {
            // Si es ruta interna, también usar window.location.href para mejor compatibilidad
            window.location.href = result.redirectUrl;
          }
        }
        onOpenChange(false);
      } else {
        const credentialHint = selectedRole === 'admin' 
          ? 'admin / admin' 
          : 'tu DNI (usuario y contraseña deben ser iguales)';
        setError(result.error || `Credenciales incorrectas. Intenta con: ${credentialHint}`);
      }
    } catch (err) {
      setError('Error al procesar el login. Intenta de nuevo.');
      console.error('[v0] Login error:', err);
    } finally {
      setLoading(false);
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
                placeholder={selectedRole === 'admin' ? 'admin' : 'Tu DNI'}
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
                placeholder={selectedRole === 'admin' ? '••••••••' : 'Tu DNI'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="transition-smooth"
              />
              {selectedRole === 'student' && (
                <p className="text-xs text-gray-500 mt-1">
                  Para alumnos: usuario y contraseña deben ser tu DNI
                </p>
              )}
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
