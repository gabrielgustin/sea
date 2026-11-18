'use client';

// Kit visual del panel y del login: misma identidad que el sitio público (azul marino, bordes marcados,
// sombras sólidas, color de cada escuela en --accent). Todo el panel arma sus pantallas con estas piezas,
// así un cambio de estilo se hace en un solo lugar.
import * as React from 'react';
import { Loader2, CircleAlert, CircleCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brandVars } from '@/lib/brand';
import { display } from '@/lib/fonts';

export const DISPLAY = '[font-family:var(--font-display)]';

// Aplica la tipografía y el color de la escuela. Hace falta en lo que se dibuja fuera del sitio
// (ventanas flotantes, que van al final del <body>) y en las páginas del panel.
export function themeProps(config: { accent?: string }) {
  return { className: display.variable, style: brandVars(config) };
}

type Variant = 'primary' | 'dark' | 'secondary' | 'danger' | 'ghost';
const VARIANTS: Record<Variant, string> = {
  primary: 'border-[#031e41] bg-[var(--accent,#FFC531)] text-[var(--accent-ink,#031e41)] shadow-[3px_3px_0_#031e41] hover:-translate-y-px hover:shadow-[4px_4px_0_#031e41] active:translate-y-0 active:shadow-none',
  dark: 'border-[#031e41] bg-[#031e41] text-white hover:bg-[#0b2d5a]',
  secondary: 'border-[#031e41] bg-white text-[#031e41] hover:bg-[#EAF2FB]',
  danger: 'border-[#b42318] bg-white text-[#b42318] hover:bg-[#fef3f2]',
  ghost: 'border-transparent bg-transparent text-[#031e41] hover:bg-[#031e41]/[0.06]',
};

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'md' | 'lg'; loading?: boolean }
>(function Button({ variant = 'secondary', size = 'md', loading, disabled, className, children, ...props }, ref) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full border-2 font-bold transition disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:translate-y-0',
        'focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#3D6BFF]',
        size === 'lg' ? 'px-6 py-3.5 text-base' : 'px-4 py-2 text-sm',
        VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 size={18} className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
});

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-xl border-2 border-[#031e41]/20 bg-white px-4 py-3 text-base text-[#031e41] transition placeholder:text-[#031e41]/35',
        'focus:border-[#031e41] focus:outline-none focus:ring-4 focus:ring-[var(--accent,#FFC531)]/40',
        'aria-[invalid=true]:border-[#b42318]',
        className,
      )}
      {...props}
    />
  );
});

// Etiqueta + control + ayuda o error. El control recibe el id por `htmlFor`.
export function Field({ label, htmlFor, hint, error, children, className }: {
  label: string; htmlFor: string; hint?: string; error?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-[#031e41]">{label}</label>
      {children}
      {error ? <p className="text-sm text-[#b42318]">{error}</p> : hint ? <p className="text-sm text-[#031e41]/55">{hint}</p> : null}
    </div>
  );
}

// Aviso dentro de un formulario: error o confirmación. role=alert para que lo lean los lectores de pantalla.
export function Notice({ tone = 'error', children }: { tone?: 'error' | 'success'; children: React.ReactNode }) {
  const Icon = tone === 'error' ? CircleAlert : CircleCheck;
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cn(
      'flex items-start gap-2.5 rounded-xl border-2 px-4 py-3 text-sm font-medium',
      tone === 'error' ? 'border-[#b42318]/30 bg-[#fef3f2] text-[#b42318]' : 'border-[#12a37a]/30 bg-[#ecfdf5] text-[#0b6b50]',
    )}>
      <Icon size={18} className="mt-px shrink-0" aria-hidden />
      <span>{children}</span>
    </div>
  );
}

// Contenedor de cada bloque del panel.
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-[22px] border-2 border-[#031e41] bg-white shadow-[4px_4px_0_#031e41]', className)} {...props} />;
}
