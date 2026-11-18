'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LockKeyhole, X } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useAuth } from '@/context/AuthContext';
import { useSchool } from '@/context/SchoolContext';
import { Button, DISPLAY, Field, Input, Notice, themeProps } from '@/components/admin/ui';
import { cn } from '@/lib/utils';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess?: () => void;
}

const pegboard = { backgroundImage: 'radial-gradient(rgb(3 30 65 / .16) 1.4px, transparent 1.6px)', backgroundSize: '22px 22px' };

// Acceso de administradores de la escuela, con la misma identidad que el sitio.
export default function LoginModal({ open, onOpenChange, onLoginSuccess }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { tenant } = useSchool();
  const router = useRouter();
  const theme = themeProps(tenant.config);

  useEffect(() => {
    if (open) { setUsername(''); setPassword(''); setError(''); setShowPass(false); }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) return setError('Completá usuario y contraseña.');
    setLoading(true);
    try {
      const result = await login(username.trim(), password);
      if (!result.success) return setError(result.error || 'Usuario o contraseña incorrectos.');
      onLoginSuccess?.();
      if (result.redirectUrl?.startsWith('/')) router.push(result.redirectUrl);
      else if (result.redirectUrl) window.location.href = result.redirectUrl;
      onOpenChange(false);
    } catch {
      setError('No pudimos conectarnos. Probá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[80] bg-[#031e41]/55 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          {...theme}
          className={cn(
            theme.className,
            'fixed left-1/2 top-1/2 z-[81] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] border-2 border-[#031e41] bg-white text-[#031e41] shadow-[8px_8px_0_#031e41] duration-200',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          )}
        >
          {/* Cabecera con el color de la escuela y sus logos */}
          <div className="relative border-b-2 border-[#031e41] bg-[var(--accent)] px-6 pb-6 pt-5" style={pegboard}>
            <div className="flex items-center gap-2">
              <span className="flex size-12 items-center justify-center rounded-2xl border-2 border-[#031e41] bg-white p-1">
                <Image src="/logo-sea.svg" alt="SEA" width={40} height={40} className="size-10" />
              </span>
              <span className="flex h-12 items-center rounded-2xl border-2 border-[#031e41] bg-white px-3">
                <Image src={tenant.config.logo} alt={tenant.config.logoAlt} width={90} height={36} className="h-8 w-auto object-contain" />
              </span>
            </div>
            <DialogPrimitive.Title className={`mt-5 text-[1.9rem] font-extrabold leading-none tracking-[-0.03em] text-[var(--accent-ink)] ${DISPLAY}`}>
              Panel de la escuela
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="mt-2 text-[15px] text-[var(--accent-ink)]/80">
              Ingresá para gestionar los cursos y el sitio de {tenant.name}.
            </DialogPrimitive.Description>
            <DialogPrimitive.Close
              aria-label="Cerrar"
              className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border-2 border-[#031e41] bg-white transition hover:bg-[#EAF2FB] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#3D6BFF]"
            >
              <X size={18} />
            </DialogPrimitive.Close>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4 px-6 pb-6 pt-5">
            <Field label="Usuario" htmlFor="login-user">
              <Input id="login-user" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoCapitalize="none" spellCheck={false} aria-invalid={!!error || undefined} />
            </Field>
            <Field label="Contraseña" htmlFor="login-pass">
              <div className="relative">
                <Input id="login-pass" type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className="pr-12" aria-invalid={!!error || undefined} />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  aria-pressed={showPass}
                  className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#031e41]/60 transition hover:bg-[#031e41]/[0.06] hover:text-[#031e41]"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>

            {error && <Notice>{error}</Notice>}

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              {!loading && <LockKeyhole size={18} aria-hidden />}
              {loading ? 'Ingresando…' : 'Ingresar al panel'}
            </Button>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
