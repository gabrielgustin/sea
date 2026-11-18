'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Clock, Mail, MapPin, MessageCircle, Plus, Send } from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useSchool } from '@/context/SchoolContext';
import { submitContactMessage } from '@/app/actions/contact';

function whatsappHref(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function CtaBand() {
  const { settings } = useSiteSettings();
  const { schoolId, tenant } = useSchool();
  return (
    <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8 sm:pt-32">
      <div className="relative overflow-hidden rounded-[40px] border-2 border-[#031e41] bg-[var(--accent)] px-6 py-16 text-center text-[var(--accent-ink)] shadow-[8px_8px_0_#031e41] sm:px-12 sm:py-24">
        {/* Confeti de fondo */}
        {[['8%', '18%', '#FF6FA8', 14], ['88%', '22%', '#2FD3A0', 18], ['14%', '78%', '#fff', 10], ['80%', '80%', '#FF6FA8', 12], ['50%', '8%', '#fff', 8]].map(([l, t, c, sz]) => (
          <span key={`${l}${t}`} aria-hidden className="absolute rounded-full border-2 border-[#031e41]" style={{ left: l as string, top: t as string, background: c as string, width: sz as number, height: sz as number }} />
        ))}
        <h2 className="relative mx-auto max-w-3xl text-balance text-4xl font-extrabold leading-[1.02] tracking-tight [font-family:var(--font-display)] sm:text-6xl">
          Tu próxima habilidad empieza acá
        </h2>
        <p className="relative mx-auto mt-5 max-w-xl text-lg opacity-80">
          Todos nuestros cursos incluyen certificación oficial de {tenant.name}.
        </p>
        <div className="relative mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={`/${schoolId}/catalogo-formaciones`} className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#031e41] bg-[#031e41] px-7 py-4 font-bold text-white transition hover:-translate-y-0.5">
            Reservar mi lugar <ArrowRight size={17} />
          </Link>
          {settings.whatsappNumber && (
            <a href={whatsappHref(settings.whatsappNumber, settings.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#031e41] bg-white px-7 py-4 font-bold text-[#031e41] transition hover:-translate-y-0.5">
              <MessageCircle size={18} /> Consultar por WhatsApp
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  const { faqs, settings } = useSiteSettings();
  const [open, setOpen] = useState<number | null>(null);
  const list = [...faqs].sort((a, b) => a.order - b.order);
  if (list.length === 0) return null;
  return (
    <section className="mx-auto grid max-w-7xl gap-12 px-5 pt-24 sm:px-8 sm:pt-32 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
      <div className="lg:sticky lg:top-32 lg:self-start">
        <h2 className="text-4xl font-extrabold tracking-tight [font-family:var(--font-display)] sm:text-6xl">Preguntas frecuentes</h2>
        {settings.whatsappNumber && (
          <p className="mt-6 text-slate-500">
            ¿No encontrás tu respuesta?{' '}
            <a href={whatsappHref(settings.whatsappNumber, settings.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#031e41] underline decoration-[var(--accent)] decoration-4 underline-offset-4">
              Escribinos
            </a>
          </p>
        )}
      </div>
      <ul className="space-y-3">
        {list.map((f) => {
          const isOpen = open === f.id;
          return (
            <li key={f.id} className={`overflow-hidden rounded-3xl border-2 border-[#031e41] transition-colors duration-300 ${isOpen ? 'bg-[#FFF4D1]' : 'bg-white'}`}>
              <h3>
                <button
                  onClick={() => setOpen(isOpen ? null : f.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-lg font-semibold text-[#031e41]"
                >
                  {f.question}
                  <span className={`flex size-9 shrink-0 items-center justify-center rounded-full transition duration-300 ${isOpen ? 'rotate-45 bg-[#031e41] text-white' : 'bg-[var(--accent)] text-[var(--accent-ink)]'}`}>
                    <Plus size={18} strokeWidth={2.6} />
                  </span>
                </button>
              </h3>
              {/* grid-rows 0fr→1fr: abre y cierra con altura real, sin números mágicos */}
              <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 leading-relaxed text-slate-700">{f.answer}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const field =
  'peer w-full rounded-2xl border-2 border-[#031e41] bg-white px-4 pb-2.5 pt-6 text-slate-900 outline-none transition placeholder:text-transparent focus:shadow-[4px_4px_0_var(--accent)]';
const floating =
  'pointer-events-none absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#031e41]';

export function Contact() {
  const { settings } = useSiteSettings();
  const { schoolId, tenant } = useSchool();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await submitContactMessage(schoolId, { nombre: form.name, email: form.email, telefono: form.phone || undefined, mensaje: form.message });
      setForm({ name: '', email: '', phone: '', message: '' });
      setStatus('sent');
    } catch {
      setStatus('error'); // el formulario conserva lo escrito para reintentar
    }
  };

  const info = [
    settings.address && { icon: MapPin, label: 'Ubicación', value: `${tenant.name} · ${settings.address}` },
    settings.email && { icon: Mail, label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
    settings.whatsappNumber && { icon: MessageCircle, label: 'WhatsApp', value: `+${settings.whatsappNumber}`, href: whatsappHref(settings.whatsappNumber, settings.whatsappMessage) },
    { icon: Clock, label: 'Horarios', value: 'Lunes a viernes 8:30 a 18 · Sábados 9 a 13' },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <section id="contacto" className="mx-auto max-w-7xl px-5 pt-24 sm:px-8 sm:pt-32">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight [font-family:var(--font-display)] sm:text-6xl">Hablemos</h2>
          <p className="mt-4 max-w-md text-lg text-slate-600">Escribinos y te respondemos a la brevedad.</p>
          <ul className="mt-10 space-y-3">
            {info.map(({ icon: Icon, label, value, href }) => {
              const body = (
                <>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-[#031e41] bg-white transition group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-ink)]"><Icon size={19} /></span>
                  <span>
                    <span className="block text-sm text-slate-500">{label}</span>
                    <span className="block font-semibold">{value}</span>
                  </span>
                </>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="group flex items-center gap-4 rounded-2xl p-2 transition hover:bg-white">{body}</a>
                  ) : (
                    <div className="flex items-center gap-4 p-2">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-[32px] border-2 border-[#031e41] bg-[#EAF2FB] p-6 shadow-[8px_8px_0_#031e41] sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="relative block">
              <input name="name" value={form.name} onChange={set} required maxLength={120} placeholder="Nombre" className={field} />
              <span className={floating}>Nombre completo</span>
            </label>
            <label className="relative block">
              <input name="phone" value={form.phone} onChange={set} maxLength={40} placeholder="Teléfono" inputMode="tel" className={field} />
              <span className={floating}>Teléfono (opcional)</span>
            </label>
          </div>
          <label className="relative block">
            <input name="email" type="email" value={form.email} onChange={set} required maxLength={160} placeholder="Email" className={field} />
            <span className={floating}>Email</span>
          </label>
          <label className="relative block">
            <textarea name="message" value={form.message} onChange={set} required maxLength={2000} rows={5} placeholder="Mensaje" className={`${field} resize-none`} />
            <span className={floating}>¿En qué te podemos ayudar?</span>
          </label>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="group flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#031e41] bg-[var(--accent)] py-4 font-bold text-[var(--accent-ink)] shadow-[4px_4px_0_#031e41] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none disabled:opacity-60"
          >
            {status === 'sending' ? 'Enviando…' : status === 'sent' ? (<><Check size={18} /> ¡Mensaje enviado!</>) : (<>Enviar mensaje <Send size={16} className="transition group-hover:translate-x-1 group-hover:-translate-y-0.5" /></>)}
          </button>
          <p aria-live="polite" className="min-h-5 text-center text-sm">
            {status === 'sent' && <span className="text-emerald-700">Gracias por escribirnos. Te respondemos pronto.</span>}
            {status === 'error' && <span className="text-red-600">No pudimos enviar el mensaje. Probá de nuevo o escribinos por WhatsApp.</span>}
          </p>
        </form>
      </div>
    </section>
  );
}
