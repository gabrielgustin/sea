'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Plus, Trash2, Save, GripVertical, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  ctaText: string;
  ctaLink: string;
  order: number;
  active: number;
  schoolId: string;
}

const BLANK_SLIDE: Omit<CarouselSlide, 'id' | 'order' | 'active' | 'createdAt' | 'schoolId'> = {
  title: '',
  subtitle: '',
  image: '',
  badge: '',
  ctaText: '',
  ctaLink: '',
};

export default function CarouselManager() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const schoolId = (segments[0] === 'savio' || segments[0] === 'villada') ? segments[0] : 'savio';

  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [newSlide, setNewSlide] = useState({ ...BLANK_SLIDE });
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/carousel?schoolId=${schoolId}`);
      if (res.ok) {
        const data = await res.json();
        setSlides(Array.isArray(data) ? data : (data.slides ?? []));
      }
    } catch {
      setError('Error al cargar los slides.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, [schoolId]);

  const handleUpdate = async (slide: CarouselSlide) => {
    setSaving(slide.id);
    setError(null);
    try {
      const res = await fetch('/api/carousel', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...slide, schoolId }),
      });
      if (!res.ok) throw new Error('Error al guardar');
      await fetchSlides();
      showSuccess('Slide actualizado correctamente');
    } catch {
      setError('Error al guardar el slide.');
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar este slide?')) return;
    setDeleting(id);
    setError(null);
    try {
      const res = await fetch('/api/carousel', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, schoolId }),
      });
      if (!res.ok) throw new Error('Error al eliminar');
      await fetchSlides();
      showSuccess('Slide eliminado');
    } catch {
      setError('Error al eliminar el slide.');
    } finally {
      setDeleting(null);
    }
  };

  const handleAdd = async () => {
    if (!newSlide.title.trim()) {
      setError('El título es obligatorio.');
      return;
    }
    setSaving(-1);
    setError(null);
    try {
      const res = await fetch('/api/carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newSlide, schoolId, order: slides.length, active: 1 }),
      });
      if (!res.ok) throw new Error('Error al crear');
      setNewSlide({ ...BLANK_SLIDE });
      setAdding(false);
      await fetchSlides();
      showSuccess('Slide creado correctamente');
    } catch {
      setError('Error al crear el slide.');
    } finally {
      setSaving(null);
    }
  };

  const handleSlideChange = (id: number, field: keyof CarouselSlide, value: string | number) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const imageOptions = [
    { label: 'Impresión 3D', value: '/images/carousel-3d.jpg' },
    { label: 'Formaciones', value: '/images/carousel-formaciones.jpg' },
    { label: 'Centro', value: '/images/carousel-centro.jpg' },
    { label: 'URL personalizada', value: 'custom' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Feedback */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {successMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-green-700 text-sm">
          ✓ {successMsg}
        </div>
      )}

      {/* Existing slides */}
      {slides.length === 0 && !adding ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-6 rounded-full mb-4" style={{ backgroundColor: '#eaf0f8' }}>
            <ImageIcon size={40} style={{ color: '#031e41' }} />
          </div>
          <p className="text-gray-500">No hay slides. Agrega el primero.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, idx) => (
            <SlideCard
              key={slide.id}
              slide={slide}
              idx={idx}
              saving={saving === slide.id}
              deleting={deleting === slide.id}
              imageOptions={imageOptions}
              onChange={(field, value) => handleSlideChange(slide.id, field, value)}
              onSave={() => handleUpdate(slide)}
              onDelete={() => handleDelete(slide.id)}
            />
          ))}
        </div>
      )}

      {/* Add new slide form */}
      {adding ? (
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{ border: '2px dashed #031e41', backgroundColor: '#f8fafc' }}
        >
          <h3 className="font-bold text-base" style={{ color: '#031e41' }}>Nuevo Slide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Título *"
              value={newSlide.title}
              onChange={v => setNewSlide(s => ({ ...s, title: v }))}
              placeholder="Ej: Diseño e Impresión 3D"
            />
            <FormField
              label="Subtítulo"
              value={newSlide.subtitle}
              onChange={v => setNewSlide(s => ({ ...s, subtitle: v }))}
              placeholder="Ej: Aprende a modelar"
            />
            <div className="md:col-span-2">
              <ImageFieldNew
                value={newSlide.image}
                onChange={v => setNewSlide(s => ({ ...s, image: v }))}
                options={imageOptions}
              />
            </div>
            <FormField
              label="Badge"
              value={newSlide.badge}
              onChange={v => setNewSlide(s => ({ ...s, badge: v }))}
              placeholder="Ej: NUEVO"
            />
            <FormField
              label="Texto del botón"
              value={newSlide.ctaText}
              onChange={v => setNewSlide(s => ({ ...s, ctaText: v }))}
              placeholder="Ej: Ver más"
            />
            <FormField
              label="Link del botón"
              value={newSlide.ctaLink}
              onChange={v => setNewSlide(s => ({ ...s, ctaLink: v }))}
              placeholder="Ej: /villada/formaciones"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleAdd}
              disabled={saving === -1}
              className="text-white"
              style={{ backgroundColor: '#031e41' }}
            >
              {saving === -1 ? 'Guardando...' : 'Crear Slide'}
            </Button>
            <Button
              variant="outline"
              onClick={() => { setAdding(false); setNewSlide({ ...BLANK_SLIDE }); setError(null); }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 text-white"
          style={{ backgroundColor: '#031e41' }}
        >
          <Plus size={18} />
          Agregar Slide
        </Button>
      )}
    </div>
  );
}

/* ---- Sub-components ---- */

function FormField({
  label, value, onChange, placeholder, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
      />
    </div>
  );
}

function ImageFieldNew({
  value, onChange, options,
}: {
  value: string; onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  const isCustom = value && !options.some(o => o.value === value && o.value !== 'custom');
  const [custom, setCustom] = useState(isCustom ? value : '');
  const [mode, setMode] = useState<'preset' | 'custom'>(isCustom ? 'custom' : 'preset');

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">Imagen</label>
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setMode('preset')}
          className="text-xs px-3 py-1 rounded-full border transition-colors"
          style={mode === 'preset' ? { backgroundColor: '#031e41', color: 'white', borderColor: '#031e41' } : {}}
        >
          Imagen predefinida
        </button>
        <button
          type="button"
          onClick={() => setMode('custom')}
          className="text-xs px-3 py-1 rounded-full border transition-colors"
          style={mode === 'custom' ? { backgroundColor: '#031e41', color: 'white', borderColor: '#031e41' } : {}}
        >
          URL personalizada
        </button>
      </div>
      {mode === 'preset' ? (
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
        >
          <option value="">Sin imagen</option>
          {options.filter(o => o.value !== 'custom').map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={custom}
          onChange={e => { setCustom(e.target.value); onChange(e.target.value); }}
          placeholder="https://... o /images/..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
        />
      )}
    </div>
  );
}

function SlideCard({
  slide, idx, saving, deleting, imageOptions, onChange, onSave, onDelete,
}: {
  slide: CarouselSlide;
  idx: number;
  saving: boolean;
  deleting: boolean;
  imageOptions: { label: string; value: string }[];
  onChange: (field: keyof CarouselSlide, value: string | number) => void;
  onSave: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="rounded-2xl p-5 bg-white"
      style={{ border: '1.5px solid #e2e8f0' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GripVertical size={18} className="text-gray-400" />
          <span className="text-sm font-semibold" style={{ color: '#031e41' }}>
            Slide #{idx + 1}
          </span>
          <label className="flex items-center gap-1.5 text-xs text-gray-600 ml-3 cursor-pointer">
            <input
              type="checkbox"
              checked={slide.active === 1}
              onChange={e => onChange('active', e.target.checked ? 1 : 0)}
              className="rounded"
            />
            Activo
          </label>
        </div>
        <Button
          size="sm"
          variant="destructive"
          onClick={onDelete}
          disabled={deleting}
          className="flex items-center gap-1 text-xs"
        >
          <Trash2 size={13} />
          {deleting ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormField
          label="Título"
          value={slide.title}
          onChange={v => onChange('title', v)}
          placeholder="Título del slide"
        />
        <FormField
          label="Subtítulo"
          value={slide.subtitle}
          onChange={v => onChange('subtitle', v)}
          placeholder="Subtítulo"
        />
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Imagen</label>
          <select
            value={imageOptions.some(o => o.value === slide.image) ? slide.image : 'custom'}
            onChange={e => {
              if (e.target.value !== 'custom') onChange('image', e.target.value);
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none mb-1"
          >
            <option value="">Sin imagen</option>
            {imageOptions.filter(o => o.value !== 'custom').map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
            <option value="custom">URL personalizada</option>
          </select>
          {(!imageOptions.some(o => o.value === slide.image) || slide.image === '') && (
            <input
              type="text"
              value={slide.image}
              onChange={e => onChange('image', e.target.value)}
              placeholder="https://... o /images/..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
            />
          )}
        </div>
        <FormField
          label="Badge"
          value={slide.badge}
          onChange={v => onChange('badge', v)}
          placeholder="Ej: NUEVO"
        />
        <FormField
          label="Texto del botón CTA"
          value={slide.ctaText ?? ''}
          onChange={v => onChange('ctaText', v)}
          placeholder="Ej: Ver más"
        />
        <FormField
          label="Link del botón CTA"
          value={slide.ctaLink ?? ''}
          onChange={v => onChange('ctaLink', v)}
          placeholder="Ej: /villada/formaciones"
        />
        <FormField
          label="Orden"
          value={String(slide.order ?? idx)}
          onChange={v => onChange('order', Number(v))}
          type="number"
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 text-white"
          style={{ backgroundColor: '#031e41' }}
        >
          <Save size={16} />
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>
    </div>
  );
}
