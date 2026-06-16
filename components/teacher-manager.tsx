'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, Edit2, Plus, AlertCircle, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { useSchool } from '@/context/SchoolContext'

interface Course {
  id: string
  title: string
  slug: string
}

interface Teacher {
  id: string
  name: string
  description: string | null
  image: string | null
  whatsapp: string | null
  linkedin: string | null
  courseId: string | null
  order: number
  active: boolean
}

const EMPTY_FORM = {
  name: '',
  description: '',
  image: '',
  whatsapp: '',
  linkedin: '',
  courseId: '',
  order: 0,
}

export function TeacherManager() {
  const { schoolId } = useSchool()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | 'new' | null>(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (schoolId) {
      fetchTeachers()
      fetchCourses()
    }
  }, [schoolId])

  const fetchCourses = async () => {
    try {
      const res = await fetch(`/api/courses?schoolId=${schoolId}`)
      const data = await res.json()
      setCourses(Array.isArray(data) ? data : (data.courses || []))
    } catch (err) {
      console.error('Error al cargar cursos:', err)
    }
  }

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`/api/teachers?schoolId=${schoolId}`)
      const data = await res.json()
      setTeachers(data.teachers || [])
    } catch (err) {
      setError('Error al cargar docentes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview local inmediato
    const localUrl = URL.createObjectURL(file)
    setImagePreview(localUrl)

    // Subir a Vercel Blob
    setIsUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'teachers')
      const res = await fetch('/api/upload-image', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || 'Error al subir imagen')
      setFormData(prev => ({ ...prev, image: data.url }))
      setImagePreview(data.url)
    } catch (err: any) {
      setError(err.message || 'Error al subir la imagen')
      setImagePreview(formData.image || '')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview('')
    setFormData(prev => ({ ...prev, image: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('El nombre del docente es requerido')
      return
    }
    if (isUploading) {
      setError('Espera a que termine de subir la imagen')
      return
    }

    setIsSaving(true)
    setError('')
    try {
      const method = editingId === 'new' ? 'POST' : 'PUT'
      const payload = {
        ...(editingId !== 'new' && { id: String(editingId) }),
        ...formData,
        schoolId,
        courseId: formData.courseId || null,
      }

      const res = await fetch('/api/teachers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Error al guardar')

      setSuccess(editingId !== 'new' ? 'Docente actualizado correctamente' : 'Docente creado correctamente')
      setEditingId(null)
      setFormData(EMPTY_FORM)
      setImagePreview('')
      await fetchTeachers()
    } catch (err) {
      setError('Error al guardar docente')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (teacher: Teacher) => {
    setEditingId(teacher.id)
    setFormData({
      name: teacher.name,
      description: teacher.description || '',
      image: teacher.image || '',
      whatsapp: teacher.whatsapp || '',
      linkedin: teacher.linkedin || '',
      courseId: teacher.courseId ? String(teacher.courseId) : '',
      order: teacher.order,
    })
    setImagePreview(teacher.image || '')
    setError('')
    setSuccess('')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este docente?')) return
    try {
      const res = await fetch('/api/teachers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, schoolId }),
      })
      if (!res.ok) throw new Error()
      setSuccess('Docente eliminado')
      await fetchTeachers()
    } catch {
      setError('Error al eliminar docente')
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData(EMPTY_FORM)
    setImagePreview('')
    setError('')
  }

  const getCourseName = (courseId: string | null) => {
    if (!courseId) return null
    return courses.find(c => String(c.id) === String(courseId))?.title || null
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold" style={{ color: '#031e41' }}>Gestión de Docentes</h2>
        {editingId === null && (
          <Button
            onClick={() => { setEditingId('new'); setSuccess('') }}
            className="bg-blue-900 hover:bg-blue-800 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> Agregar Docente
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm">
          {success}
        </div>
      )}

      {/* Formulario */}
      {editingId !== null && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-5">
          <h3 className="font-bold text-lg" style={{ color: '#031e41' }}>
            {editingId === 'new' ? 'Nuevo Docente' : 'Editar Docente'}
          </h3>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium mb-2">Foto del docente</label>
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div
                className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0 flex items-center justify-center bg-gray-100"
                style={{ borderColor: imagePreview ? '#031e41' : '#d1d5db' }}
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                ) : (
                  <span className="text-gray-400 text-xs text-center px-2">Sin foto</span>
                )}
              </div>

              {/* Botones de upload */}
              <div className="flex flex-col gap-2">
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
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {isUploading ? 'Subiendo...' : 'Subir imagen'}
                </Button>
                {imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200"
                  >
                    <X className="h-4 w-4" /> Quitar foto
                  </Button>
                )}
                <p className="text-xs text-gray-500">JPG, PNG, WEBP. Max 4MB.</p>
              </div>
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium mb-1">Nombre *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ej: Juan García"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Especialidades, experiencia, formación académica..."
              rows={3}
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium mb-1">WhatsApp <span className="text-gray-400 font-normal">(opcional)</span></label>
            <Input
              value={formData.whatsapp}
              onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
              placeholder="https://wa.me/5491134567890"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn <span className="text-gray-400 font-normal">(opcional)</span></label>
            <Input
              value={formData.linkedin}
              onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
              placeholder="https://linkedin.com/in/juangarcia"
            />
          </div>

          {/* Curso asignado */}
          <div>
            <label className="block text-sm font-medium mb-1">Curso Asignado</label>
            <select
              value={formData.courseId}
              onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            >
              <option value="">-- Sin curso asignado --</option>
              {courses.map((course) => (
                <option key={course.id} value={String(course.id)}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-1">
            <Button
              onClick={handleSave}
              disabled={isSaving || isUploading}
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button onClick={handleCancel} variant="outline">
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Lista de docentes */}
      {isLoading ? (
        <div className="text-center text-gray-500 py-8">Cargando docentes...</div>
      ) : teachers.length === 0 ? (
        <div className="text-center text-gray-400 py-12 border border-dashed border-gray-200 rounded-xl">
          No hay docentes. ¡Crea uno con el botón de arriba!
        </div>
      ) : (
        <div className="grid gap-4">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="border border-gray-200 rounded-xl p-4 flex items-center gap-4 bg-white hover:shadow-sm transition-shadow"
            >
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2" style={{ borderColor: '#9cbadb' }}>
                {teacher.image ? (
                  <Image
                    src={teacher.image}
                    alt={teacher.name}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                    {teacher.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{teacher.name}</p>
                {teacher.description && (
                  <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{teacher.description}</p>
                )}
                {getCourseName(teacher.courseId) && (
                  <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    {getCourseName(teacher.courseId)}
                  </span>
                )}
                <div className="flex gap-3 mt-1">
                  {teacher.whatsapp && (
                    <span className="text-xs text-green-600">WhatsApp</span>
                  )}
                  {teacher.linkedin && (
                    <span className="text-xs text-blue-600">LinkedIn</span>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 flex-shrink-0">
                <Button onClick={() => handleEdit(teacher)} size="sm" variant="outline" className="flex items-center gap-1">
                  <Edit2 className="h-4 w-4" /> Editar
                </Button>
                <Button
                  onClick={() => handleDelete(teacher.id)}
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:border-red-300 flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" /> Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
