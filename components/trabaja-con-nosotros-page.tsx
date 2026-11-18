'use client';

import { useState } from 'react';
import { Mail, Phone, FileText, User } from 'lucide-react';
import { useSchool } from '@/context/SchoolContext';
import { submitJobApplication } from '@/app/actions/job-applications';

export default function TrabajaConNosotrosPage() {
  const { schoolId } = useSchool();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    perfil: '',
    experiencia: '',
    cv: null as File | null,
    mensaje: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, cv: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFailed(false);

    try {
      // Split nombre into nombre + apellido (first word = nombre, rest = apellido)
      const parts = formData.nombre.trim().split(' ');
      const nombre = parts[0] ?? '';
      const apellido = parts.slice(1).join(' ') || '';

      await submitJobApplication(schoolId, {
        nombre,
        apellido,
        email: formData.email,
        telefono: formData.telefono || undefined,
        especialidad: formData.perfil || undefined,
        experiencia: formData.experiencia || undefined,
        motivacion: formData.mensaje || undefined,
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting job application:', err);
      setFailed(true); // conserva lo escrito para reintentar
      return;
    } finally {
      setLoading(false);
    }

    // Resetear después de 3 segundos (solo si se envió)
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        perfil: '',
        experiencia: '',
        cv: null,
        mensaje: '',
      });
    }, 3000);
  };

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative -mt-[76px] overflow-hidden bg-[#EAF2FB] px-5 pb-40 pt-36 sm:px-8 sm:pt-44" style={{ backgroundImage: 'radial-gradient(rgb(3 30 65 / .14) 1.4px, transparent 1.6px)', backgroundSize: '26px 26px' }}>
        <div className="mx-auto max-w-4xl text-center">
          <p className="rise inline-flex items-center gap-2 rounded-full border-2 border-[#031e41] bg-white px-4 py-2 text-sm font-semibold"><span className="size-2.5 rounded-full bg-[var(--accent)] ring-2 ring-[#031e41]" /> Búsqueda abierta</p>
          <h1 className="rise mt-6 text-balance text-[clamp(3rem,8vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.04em] [font-family:var(--font-display)]" style={{ animationDelay: '.08s' }}>
            Trabajá con nosotros
          </h1>
          <p className="rise mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-[#031e41]/75" style={{ animationDelay: '.14s' }}>
            Si sos graduado/a o estudiante avanzado/a y te interesa sumarte a nuestros proyectos o dictar cursos, completá tu postulación.
          </p>
        </div>
      </section>

      {/* Formulario: tarjeta que sube sobre el héroe */}
      <section className="relative z-10 -mt-28 px-4">
        <div className="mx-auto w-full max-w-2xl rounded-[32px] border-2 border-[#031e41] bg-white p-6 shadow-[8px_8px_0_#031e41] sm:p-10">
          {submitted ? (
            <div className="py-10 text-center">
              <span className="mx-auto flex size-16 items-center justify-center rounded-full border-2 border-[#031e41] bg-[#2FD3A0] text-3xl font-bold">✓</span>
              <h2 className="mt-5 text-3xl font-extrabold [font-family:var(--font-display)]">¡Postulación enviada!</h2>
              <p className="mt-2 text-lg text-slate-600">
                Gracias por tu interés. Nos pondremos en contacto pronto.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre */}
              <div>
                <label className="mb-2 block font-semibold">
                  <User size={16} className="inline mr-2" />
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border-2 border-[#031e41] bg-white px-4 py-3 outline-none transition focus:shadow-[4px_4px_0_var(--accent)]"
                  placeholder="Tu nombre"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block font-semibold">
                  <Mail size={16} className="inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border-2 border-[#031e41] bg-white px-4 py-3 outline-none transition focus:shadow-[4px_4px_0_var(--accent)]"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="mb-2 block font-semibold">
                  <Phone size={16} className="inline mr-2" />
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border-2 border-[#031e41] bg-white px-4 py-3 outline-none transition focus:shadow-[4px_4px_0_var(--accent)]"
                  placeholder="+54 9 351 XXX XXXX"
                />
              </div>

              {/* Perfil */}
              <div>
                <label className="mb-2 block font-semibold">
                  ¿Cuál es tu perfil? *
                </label>
                <textarea
                  name="perfil"
                  value={formData.perfil}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full rounded-2xl border-2 border-[#031e41] bg-white px-4 py-3 outline-none transition focus:shadow-[4px_4px_0_var(--accent)]"
                  placeholder="Contanos sobre tu perfil"
                />
              </div>

              {/* Experiencia */}
              <div>
                <label className="mb-2 block font-semibold">
                  Experiencia relevante *
                </label>
                <textarea
                  name="experiencia"
                  value={formData.experiencia}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full rounded-2xl border-2 border-[#031e41] bg-white px-4 py-3 outline-none transition focus:shadow-[4px_4px_0_var(--accent)]"
                  placeholder="Contanos sobre tu experiencia en educación, trabajos anteriores o proyectos relevantes..."
                />
              </div>

              {/* CV */}
              <div>
                <label className="mb-2 block font-semibold">
                  <FileText size={16} className="inline mr-2" />
                  Cargar CV (opcional)
                </label>
                <input
                  type="file"
                  name="cv"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="w-full rounded-2xl border-2 border-[#031e41] bg-white px-4 py-3 outline-none transition focus:shadow-[4px_4px_0_var(--accent)]"
                />
                {formData.cv && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {formData.cv.name}
                  </p>
                )}
              </div>

              {/* Mensaje */}
              <div>
                <label className="mb-2 block font-semibold">
                  Mensaje adicional
                </label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-2xl border-2 border-[#031e41] bg-white px-4 py-3 outline-none transition focus:shadow-[4px_4px_0_var(--accent)]"
                  placeholder="Contanos algo más sobre vos o qué área te interesa..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full border-2 border-[#031e41] bg-[var(--accent)] px-6 py-4 font-bold text-[var(--accent-ink)] shadow-[4px_4px_0_#031e41] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none disabled:opacity-50"
              >
                {loading ? 'Enviando…' : 'Enviar postulación'}
              </button>

              <p aria-live="polite" className="text-center text-sm text-gray-600">
                {failed ? <span className="font-semibold text-red-600">No pudimos enviar tu postulación. Revisá tu conexión y probá de nuevo.</span> : 'Los campos marcados con * son obligatorios'}
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
