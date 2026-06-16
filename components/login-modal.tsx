'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
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
      // Always default to admin since student login is hidden
      setSelectedRole('admin');
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
          setError(result.error || 'Credenciales incorrectas. Verifica usuario y contraseña.');
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
          {/* Admin-only indicator */}
          <div className="flex items-center gap-2 p-3 rounded-lg border-2" style={{ borderColor: '#031e41', backgroundColor: 'rgba(3,30,65,0.05)' }}>
            <Shield size={18} style={{ color: '#031e41' }} />
            <span className="font-semibold text-sm" style={{ color: '#031e41' }}>
              Acceso Administrador
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder={schoolId}
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
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
