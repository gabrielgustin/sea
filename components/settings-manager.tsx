'use client';

import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { Save, Instagram, MessageCircle, Mail, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SettingsManager() {
  const { settings, updateSettings } = useSiteSettings();
  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold" style={{ color: '#031e41' }}>
          Configuracion del Sitio
        </h2>
        <p className="text-gray-600">
          Administra los enlaces y datos de contacto que se muestran en la web
        </p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          Configuracion guardada exitosamente
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Redes Sociales */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#031e41' }}>
            <Instagram size={20} />
            Redes Sociales
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                URL de Instagram
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="https://www.instagram.com/tu_cuenta/"
                />
                <a
                  href={formData.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center"
                >
                  <ExternalLink size={20} />
                </a>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Este enlace se usa en el boton de Instagram del sidebar
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#031e41' }}>
            <MessageCircle size={20} />
            WhatsApp
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Numero de WhatsApp (sin espacios ni guiones)
              </label>
              <input
                type="text"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="5493516307002"
              />
              <p className="text-sm text-gray-500 mt-1">
                Formato: codigo de pais + numero (ej: 5493516307002)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Mensaje predeterminado de WhatsApp
              </label>
              <textarea
                name="whatsappMessage"
                value={formData.whatsappMessage}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Hola! Me interesa obtener más información..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Este mensaje se precompletara cuando los usuarios hagan clic en el boton de WhatsApp
              </p>
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#031e41' }}>
            <Mail size={20} />
            Datos de Contacto
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email de contacto
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="contacto@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <MapPin size={16} />
                Direccion
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Av. Ejemplo 1234, Ciudad"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="flex items-center gap-2 text-white px-8"
            style={{ backgroundColor: '#031e41' }}
          >
            <Save size={20} />
            Guardar Configuracion
          </Button>
        </div>
      </form>
    </div>
  );
}
