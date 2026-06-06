'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Trash2, Edit2, Plus, Upload } from 'lucide-react';
import Image from 'next/image';

interface CarouselSlide {
  id: string;
  title: string;
  image: string;
  startDate: string;
  duration: string;
  modality: string;
  redirectSlug: string;
}

export default function CarouselManager() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<CarouselSlide>>({});

  // Cargar slides
  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/carousel');
      const data = await response.json();
      setSlides(data.slides || []);
    } catch (error) {
      console.error('Error fetching carousel slides:', error);
      alert('Error al cargar los slides');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.image) {
        alert('Por favor completa todos los campos requeridos');
        return;
      }

      if (editingId) {
        // Actualizar
        const response = await fetch('/api/carousel', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...formData })
        });

        if (!response.ok) throw new Error('Error al actualizar');
        alert('Slide actualizado correctamente');
      } else {
        // Crear
        const response = await fetch('/api/carousel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Error al crear');
        alert('Slide creado correctamente');
      }

      setFormData({});
      setEditingId(null);
      setShowForm(false);
      fetchSlides();
    } catch (error) {
      console.error('Error saving slide:', error);
      alert('Error al guardar el slide');
    }
  };

  const handleEdit = (slide: CarouselSlide) => {
    setFormData(slide);
    setEditingId(slide.id);
    setShowForm(true);
    setExpandedId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este slide?')) return;

    try {
      const response = await fetch('/api/carousel', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (!response.ok) throw new Error('Error al eliminar');
      alert('Slide eliminado correctamente');
      fetchSlides();
    } catch (error) {
      console.error('Error deleting slide:', error);
      alert('Error al eliminar el slide');
    }
  };

  const handleCancel = () => {
    setFormData({});
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Cargando carrusel...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header con botón agregar */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión del Carrusel</h2>
        <button
          onClick={() => {
            setFormData({});
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Agregar Slide
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Editar Slide' : 'Crear Nuevo Slide'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Título del slide"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Inicio
                </label>
                <input
                  type="text"
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 4 de junio, 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración
                </label>
                <input
                  type="text"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 6 meses"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modalidad
              </label>
              <input
                type="text"
                value={formData.modality || ''}
                onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Educación Presencial"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destino del link "Ver mas" <span className="text-gray-400 font-normal">(slug del curso)</span>
              </label>
              <input
                type="text"
                value={formData.redirectSlug || ''}
                onChange={(e) => setFormData({ ...formData, redirectSlug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: desarrollo-de-aplicaciones"
              />
              <p className="text-xs text-gray-400 mt-1">
                El link llevara a <code className="bg-gray-100 px-1 rounded">/cursos/[slug]</code>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen del Slide
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({ ...formData, image: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.image && (
                  <div className="mt-2 text-sm text-green-600">
                    ✓ Imagen seleccionada
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de slides */}
      <div className="space-y-3">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4 p-4">
              {/* Thumbnail */}
              <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Información */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {slide.title}
                </h3>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {slide.startDate}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {slide.duration}
                  </span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(slide)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={() => setExpandedId(expandedId === slide.id ? null : slide.id)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {expandedId === slide.id ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Detalles expandidos */}
            {expandedId === slide.id && (
              <div className="border-t border-gray-200 bg-gray-50 p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Modalidad</p>
                    <p className="font-medium text-gray-900">{slide.modality}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Destino "Ver mas"</p>
                    <p className="font-mono text-xs text-blue-600">/cursos/{slide.redirectSlug || <span className="text-gray-400 italic">no configurado</span>}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Imagen</p>
                    <p className="font-mono text-xs text-gray-600 break-all">{slide.image}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {slides.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay slides en el carrusel</p>
          <button
            onClick={() => {
              setFormData({});
              setEditingId(null);
              setShowForm(true);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Crear el primer slide
          </button>
        </div>
      )}
    </div>
  );
}
