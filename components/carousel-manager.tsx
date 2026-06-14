'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Trash2, Edit2, Plus, Upload } from 'lucide-react';
import Image from 'next/image';

interface CarouselSlide {
  id: number;
  title: string;
  image: string;
  subtitle?: string;
  badge?: string;
  ctaText?: string;
  ctaLink?: string;
  order?: number;
  active?: boolean;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  startDate?: string;
  duration?: string;
  modality?: string;
  image?: string;
}

export default function CarouselManager() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<CarouselSlide>>({});

  // Cargar slides y cursos
  useEffect(() => {
    fetchSlides();
    fetchCourses();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/carousel');
      const data = await response.json();
      setSlides(data.slides || []);
    } catch (error) {
      console.error('Error fetching carousel slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.image) {
        alert('Por favor completa los campos requeridos: Título e Imagen');
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
      } else {
        // Crear
        const response = await fetch('/api/carousel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Error al crear');
      }

      setFormData({});
      setEditingId(null);
      setShowForm(false);
      fetchSlides();
    } catch (error) {
      console.error('Error saving slide:', error);
    }
  };

  const handleEdit = (slide: CarouselSlide) => {
    setFormData(slide);
    setEditingId(slide.id);
    setShowForm(true);
    setExpandedId(null);
    // Auto-scroll hacia arriba al formulario
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este slide?')) return;

    try {
      const response = await fetch('/api/carousel', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (!response.ok) throw new Error('Error al eliminar');
      fetchSlides();
    } catch (error) {
      console.error('Error deleting slide:', error);
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtítulo (Información del curso)
              </label>
              <textarea
                value={formData.subtitle || ''}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Fecha de Inicio: 4 de junio, 2026\nDuración: 6 meses\nModalidad: Educación Presencial"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Etiqueta (Badge)
              </label>
              <input
                type="text"
                value={formData.badge || ''}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: PRESENCIAL, ONLINE"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texto del botón CTA
                </label>
                <input
                  type="text"
                  value={formData.ctaText || ''}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Ver más"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link CTA (Seleccionar Curso)
                </label>
                <select
                  value={formData.ctaLink || ''}
                  onChange={(e) => {
                    const selectedLink = e.target.value;
                    const selectedCourse = courses.find(c => `/savio/cursos/${c.slug}` === selectedLink);
                    if (selectedCourse) {
                      // Auto-rellenar campos desde el curso seleccionado
                      const subtitle = [
                        selectedCourse.startDate ? `Fecha de Inicio: ${selectedCourse.startDate}` : '',
                        selectedCourse.duration ? `Duración: ${selectedCourse.duration}` : '',
                        selectedCourse.modality ? `Modalidad: ${selectedCourse.modality}` : '',
                      ].filter(Boolean).join('\n');
                      setFormData({
                        ...formData,
                        ctaLink: selectedLink,
                        title: formData.title || selectedCourse.title,
                        subtitle: formData.subtitle || subtitle,
                        image: formData.image || selectedCourse.image || '',
                        ctaText: formData.ctaText || 'Ver mas',
                      });
                    } else {
                      setFormData({ ...formData, ctaLink: selectedLink });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Seleccionar un curso --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={`/savio/cursos/${course.slug}`}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Orden
              </label>
              <input
                type="number"
                value={formData.order || 0}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
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
              <h3 className="font-semibold text-gray-900 text-lg mb-3">
                {slide.title}
              </h3>
              
              {slide.subtitle && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  {(() => {
                    const lines = slide.subtitle.split('\n').filter(line => line.trim());
                    
                    // Extraer modalidad, inicio y duración si existen
                    let modalidad = '';
                    let inicio = '';
                    let duracion = '';
                    
                    lines.forEach(line => {
                      if (line.includes('Modalidad:')) modalidad = line.replace('Modalidad:', '').trim();
                      if (line.includes('Fecha de Inicio:')) inicio = line.replace('Fecha de Inicio:', '').trim();
                      if (line.includes('Duración:')) duracion = line.replace('Duración:', '').trim();
                    });
                    
                    // Si tenemos los tres datos, mostrarlos en formato horizontal
                    if (modalidad && inicio && duracion) {
                      return (
                        <div className="flex gap-8 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Modalidad</p>
                            <p className="text-gray-900 font-medium">{modalidad}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Inicia</p>
                            <p className="text-gray-900 font-medium">{inicio}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Duración</p>
                            <p className="text-gray-900 font-medium">{duracion}</p>
                          </div>
                        </div>
                      );
                    }
                    
                    // Si no, mostrar como antes
                    return (
                      <div className="space-y-1">
                        {lines.map((line, idx) => (
                          <div key={idx} className="text-sm text-gray-600">
                            {line}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {slide.badge && (
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {slide.badge}
                  </span>
                )}
                {slide.order !== undefined && (
                  <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    Orden: {slide.order}
                  </span>
                )}
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
                <div className="grid grid-cols-1 gap-4 text-sm">
                  {slide.ctaText && (
                    <div>
                      <p className="text-gray-600">Texto del botón</p>
                      <p className="font-medium text-gray-900">{slide.ctaText}</p>
                    </div>
                  )}
                  {slide.ctaLink && (
                    <div>
                      <p className="text-gray-600">Link de destino</p>
                      <p className="font-mono text-xs text-blue-600">{slide.ctaLink}</p>
                    </div>
                  )}
                  {slide.image && (
                    <div>
                      <p className="text-gray-600">Imagen</p>
                      <p className="font-mono text-xs text-gray-600 break-all">
                        {slide.image.substring(0, 50)}...
                      </p>
                    </div>
                  )}
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
