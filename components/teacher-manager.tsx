import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, Edit2, Plus, AlertCircle } from 'lucide-react'

interface Course {
  id: number
  title: string
  slug: string
}

interface Teacher {
  id: number
  name: string
  description: string | null
  image: string | null
  whatsapp: string | null
  linkedin: string | null
  courseId: number | null
  order: number
  active: boolean
}

export function TeacherManager() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    whatsapp: '',
    linkedin: '',
    courseId: '',
    order: 0,
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchTeachers()
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses')
      const data = await res.json()
      setCourses(data.courses || [])
    } catch (err) {
      console.error('Error al cargar cursos:', err)
    }
  }

  const fetchTeachers = async () => {
    try {
      const res = await fetch('/api/teachers')
      const data = await res.json()
      setTeachers(data.teachers || [])
    } catch (err) {
      setError('Error al cargar docentes')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('El nombre del docente es requerido')
      return
    }

    try {
      const method = editingId ? 'PUT' : 'POST'
      const payload = editingId 
        ? { id: editingId, ...formData, courseId: formData.courseId ? parseInt(formData.courseId) : null }
        : { ...formData, courseId: formData.courseId ? parseInt(formData.courseId) : null }

      const res = await fetch('/api/teachers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Error al guardar')

      setSuccess(editingId ? 'Docente actualizado' : 'Docente creado')
      setEditingId(null)
      setFormData({ name: '', description: '', image: '', whatsapp: '', linkedin: '', courseId: '', order: 0 })
      setError('')
      await fetchTeachers()
    } catch (err) {
      setError('Error al guardar docente')
      console.error(err)
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
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este docente?')) return

    try {
      const res = await fetch('/api/teachers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) throw new Error('Error al eliminar')

      setSuccess('Docente eliminado')
      setError('')
      await fetchTeachers()
    } catch (err) {
      setError('Error al eliminar docente')
      console.error(err)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ name: '', description: '', image: '', whatsapp: '', linkedin: '', courseId: '', order: 0 })
    setError('')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Docentes</h2>
        {editingId === null && (
          <Button onClick={() => setEditingId('new')} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> Agregar Docente
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700">
          {success}
        </div>
      )}

      {/* Formulario */}
      {editingId !== null && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-lg">
            {editingId === 'new' ? 'Nuevo Docente' : 'Editar Docente'}
          </h3>

          <div>
            <label className="block text-sm font-medium mb-1">Nombre *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Juan García"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción del docente, especialidades, experiencia, etc."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL de Imagen</label>
            <Input
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">WhatsApp (URL completa)</label>
            <Input
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="https://wa.me/5491234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn (URL completa)</label>
            <Input
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/juangarcia"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Curso Asignado</label>
            <select
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">-- Seleccionar curso --</option>
              {courses.map((course) => (
                <option key={course.id} value={String(course.id)}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Orden</label>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              Guardar
            </Button>
            <Button onClick={handleCancel} variant="outline">
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Lista de docentes */}
      {isLoading ? (
        <div className="text-center text-gray-500">Cargando docentes...</div>
      ) : teachers.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No hay docentes. ¡Crea uno!
        </div>
      ) : (
        <div className="grid gap-4">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{teacher.name}</h3>
                {teacher.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{teacher.description}</p>
                )}
                <div className="flex gap-3 mt-2">
                  {teacher.whatsapp && (
                    <a
                      href={teacher.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:underline"
                    >
                      WhatsApp
                    </a>
                  )}
                  {teacher.linkedin && (
                    <a
                      href={teacher.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(teacher)}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <Edit2 className="h-4 w-4" /> Editar
                </Button>
                <Button
                  onClick={() => handleDelete(teacher.id)}
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 flex items-center gap-1"
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
