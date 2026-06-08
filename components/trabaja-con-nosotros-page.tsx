'use client';

import { useState } from 'react';
import { Mail, Phone, FileText, User } from 'lucide-react';
import { submitJobApplication } from '@/app/actions/job-applications';

export default function TrabajaConNosotrosPage() {
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

    try {
      // Split nombre into nombre + apellido (first word = nombre, rest = apellido)
      const parts = formData.nombre.trim().split(' ');
      const nombre = parts[0] ?? '';
      const apellido = parts.slice(1).join(' ') || '';

      await submitJobApplication({
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
    } finally {
      setLoading(false);
    }

    // Resetear después de 3 segundos
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
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section
        className="w-full pt-24 md:pt-16 pb-8 md:pb-16 md:min-h-[70vh] flex items-center justify-center px-4"
        style={{
          background: 'linear-gradient(135deg, #031e41 0%, #1a4d7a 100%)',
        }}
      >
        <div className="w-full text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Trabaja con Nosotros
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            Si eres graduado/a o estudiante avanzado/a y te interesa trabajar con nosotros en nuestros proyectos o dictando cursos, ¡completa tu aplicación aquí!
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-4">
        <div className="w-full max-w-2xl mx-auto">
          {submitted ? (
            <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4">✓</div>
              <h2 className="text-3xl font-bold text-green-700 mb-2">¡Aplicación Enviada!</h2>
              <p className="text-green-600 text-lg">
                Gracias por tu interés. Nos pondremos en contacto pronto.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#031e41' }}>
                  <User size={16} className="inline mr-2" />
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Tu nombre"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#031e41' }}>
                  <Mail size={16} className="inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#031e41' }}>
                  <Phone size={16} className="inline mr-2" />
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="+54 9 351 XXX XXXX"
                />
              </div>

              {/* Perfil */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#031e41' }}>
                  ¿Cuál es tu perfil? *
                </label>
                <textarea
                  name="perfil"
                  value={formData.perfil}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Cuéntanos sobre tu perfil:"
                />
              </div>

              {/* Experiencia */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#031e41' }}>
                  Experiencia Relevante *
                </label>
                <textarea
                  name="experiencia"
                  value={formData.experiencia}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Cuéntanos sobre tu experiencia en educación, trabajos anteriores o proyectos relevantes..."
                />
              </div>

              {/* CV */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#031e41' }}>
                  <FileText size={16} className="inline mr-2" />
                  Cargar CV (Opcional)
                </label>
                <input
                  type="file"
                  name="cv"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                {formData.cv && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {formData.cv.name}
                  </p>
                )}
              </div>

              {/* Mensaje */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#031e41' }}>
                  Mensaje Adicional
                </label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Cuéntanos algo más sobre ti o qué área te interesa..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-lg font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
                style={{ backgroundColor: '#031e41' }}
              >
                {loading ? 'Enviando...' : 'Enviar Aplicación'}
              </button>

              <p className="text-center text-sm text-gray-600">
                Los campos marcados con * son obligatorios
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
