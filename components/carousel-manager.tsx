'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Edit2, Upload, X, AlertCircle, ImageIcon, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import { useSchool } from '@/context/SchoolContext'

interface Slide {
  id: string
  title: string
  description: string
  image: string
  ctaLink: string
  active: boolean
  order: number
}

const EMPTY_FORM = {
  title: '',
  description: '',
  image: '',
  ctaLink: '',
  active: true,
  order: 0,
}

export function CarouselManager() {
  const { schoolId } = useSchool()
  const [slides, setSlides] = useState<Slide[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | 'new' | null>(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (schoolId) fetchSlides()
  }, [schoolId])

  const fetchSlides = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/carousel?schoolId=${schoolId}`)
      const data = await res.json()
      const sorted = (data.slides || []).sort((a: Slide, b: Slide) => a.order - b.order)
      setSlides(sorted)
    } catch {
      setError('Error al cargar los slides')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen (JPG, PNG, WEBP, etc.)')
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('La imagen no debe superar los 8MB')
      return
    }

    // Preview inmediato
    const localUrl = URL.createObjectURL(file)
    setImagePreview(localUrl)
    setError('')

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', `carousel/${schoolId}`)
      const res = await fetch('/api/upload-image', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || 'Error al subir')
      setFormData(prev => ({ ...prev, image: data.url }))
      setImagePreview(data.url)
    } catch (err: any) {
      setError(err.message || 'Error al subir la imagen')
      setImagePreview(formData.image || '')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview('')
    setFormData(prev => ({ ...prev, image: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const openNew = () => {
    setEditingId('new')
    setFormData({ ...EMPTY_FORM, order: slides.length })
    setImagePreview('')
    setError('')
    setSuccess('')
  }

  const openEdit = (slide: Slide) => {
    setEditingId(slide.id)
    setFormData({
      title: slide.title,
      description: slide.description || '',
      image: slide.image || '',
      ctaLink: slide.ctaLink || '',
      active: slide.active,
      order: slide.order,
    })
    setImagePreview(slide.image || '')
    setError('')
    setSuccess('')
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData(EMPTY_FORM)
    setImagePreview('')
    setError('')
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError('El título es requerido')
      return
    }
    if (uploading) {
      setError('Espera a que termine de subir la imagen')
      return
    }

    setSaving(true)
    setError('')
    try {
      const isNew = editingId === 'new'
      const payload = {
        ...formData,
        schoolId,
        ...(isNew ? { id: `slide_${Date.now()}` } : { id: editingId }),
      }
      const res = await fetch('/api/carousel', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Error al guardar')
      setSuccess(isNew ? 'Slide creado correctamente' : 'Slide actualizado correctamente')
      setEditingId(null)
      setFormData(EMPTY_FORM)
      setImagePreview('')
      await fetchSlides()
    } catch (err: any) {
      setError(err.message || 'Error al guardar el slide')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este slide del carrusel?')) return
    try {
      const res = await fetch('/api/carousel', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, schoolId }),
      })
      if (!res.ok) throw new Error()
      setSuccess('Slide eliminado')
      await fetchSlides()
    } catch {
      setError('Error al eliminar el slide')
    }
  }

  const handleToggleActive = async (slide: Slide) => {
    try {
      await fetch('/api/carousel', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: slide.id, schoolId, active: !slide.active }),
      })
      await fetchSlides()
    } catch {
      setError('Error al actualizar el slide')
    }
  }

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const newSlides = [...slides]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newSlides.length) return
    ;[newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]]

    // Update orders
    const updates = newSlides.map((s, i) => ({ id: s.id, order: i }))
    setSlides(newSlides.map((s, i) => ({ ...s, order: i })))

    try {
      await Promise.all(
        updates.map(u =>
          fetch('/api/carousel', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: u.id, schoolId, order: u.order }),
          })
        )
      )
    } catch {
      await fetchSlides()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#031e41' }}>Carrusel de Imágenes</h2>
          <p className="text-sm text-gray-500 mt-1">{slides.length} slide{slides.length !== 1 ? 's' : ''} en total</p>
        </div>
        {editingId === null && (
          <Button onClick={openNew} className="bg-blue-900 hover:bg-blue-800 text-white">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Slide
          </Button>
        )}
      </div>

      {/* Alertas */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
          <button onClick={() => setError('')} className="ml-auto"><X className="h-4 w-4" /></button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm flex justify-between">
          {success}
          <button onClick={() => setSuccess('')}><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Formulario */}
      {editingId !== null && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-lg" style={{ color: '#031e41' }}>
            {editingId === 'new' ? 'Nuevo Slide' : 'Editar Slide'}
          </h3>

          {/* Upload de imagen */}
          <div>
            <label className="block text-sm font-medium mb-2">Imagen del slide</label>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Preview */}
              <div
                className="relative w-full sm:w-48 h-28 rounded-lg overflow-hidden border-2 border-dashed flex items-center justify-center bg-gray-50 flex-shrink-0 cursor-pointer group"
                style={{ borderColor: imagePreview ? '#031e41' : '#d1d5db' }}
                onClick={() => !uploading && fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="text-center p-3">
                    <ImageIcon className="h-8 w-8 text-gray-300 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Click para subir imagen</p>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#031e41', borderTopColor: 'transparent' }} />
                  </div>
                )}
              </div>

              {/* Controles */}
              <div className="flex flex-col gap-2 justify-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? 'Subiendo...' : 'Seleccionar imagen'}
                </Button>
                {imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" /> Quitar imagen
                  </Button>
                )}
                <p className="text-xs text-gray-400">JPG, PNG, WEBP. Max 8MB.</p>
              </div>
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium mb-1">Título <span className="text-red-500">*</span></label>
            <Input
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ej: Bienvenidos al Portal SEA"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <Textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descripción breve del slide..."
              rows={3}
            />
          </div>

          {/* Link CTA */}
          <div>
            <label className="block text-sm font-medium mb-1">Enlace (CTA) <span className="text-gray-400 font-normal">— opcional</span></label>
            <Input
              value={formData.ctaLink}
              onChange={e => setFormData(prev => ({ ...prev, ctaLink: e.target.value }))}
              placeholder="https://... o /ruta-interna"
            />
          </div>

          {/* Activo */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Visible en el carrusel</label>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, active: !prev.active }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.active ? 'bg-blue-900' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.active ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm text-gray-500">{formData.active ? 'Activo' : 'Oculto'}</span>
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <Button onClick={handleSave} disabled={saving || uploading} className="bg-green-700 hover:bg-green-800 text-white">
              {saving ? 'Guardando...' : 'Guardar slide'}
            </Button>
            <Button onClick={handleCancel} variant="outline">Cancelar</Button>
          </div>
        </div>
      )}

      {/* Lista de slides */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Cargando slides...</div>
      ) : slides.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
          <ImageIcon className="h-12 w-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No hay slides en el carrusel</p>
          <p className="text-sm text-gray-400 mt-1">Crea el primero con el botón de arriba</p>
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`border rounded-xl overflow-hidden flex items-center gap-0 bg-white transition-all ${!slide.active ? 'opacity-60' : ''} hover:shadow-sm`}
              style={{ borderColor: slide.active ? '#9cbadb' : '#e5e7eb' }}
            >
              {/* Imagen miniatura */}
              <div className="w-24 h-16 flex-shrink-0 bg-gray-100 overflow-hidden relative">
                {slide.image ? (
                  <Image src={slide.image} alt={slide.title} fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="flex-1 min-w-0 px-4 py-3">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 truncate">{slide.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${slide.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {slide.active ? 'Activo' : 'Oculto'}
                  </span>
                </div>
                {slide.description && (
                  <p className="text-sm text-gray-500 mt-0.5 truncate">{slide.description}</p>
                )}
                {slide.ctaLink && (
                  <p className="text-xs text-blue-500 mt-0.5 truncate">{slide.ctaLink}</p>
                )}
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-1 pr-3 flex-shrink-0">
                {/* Reordenar */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => handleReorder(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleReorder(index, 'down')}
                    disabled={index === slides.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleToggleActive(slide)}
                  className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-50"
                  title={slide.active ? 'Ocultar' : 'Mostrar'}
                >
                  {slide.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>

                <button
                  onClick={() => openEdit(slide)}
                  className="p-2 text-gray-500 hover:text-blue-900 rounded-lg hover:bg-blue-50"
                >
                  <Edit2 className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleDelete(slide.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
