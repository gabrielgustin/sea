'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Eye, EyeOff, Plus, BookOpen, Clock, MapPin, DollarSign, GripVertical } from 'lucide-react'
import Image from 'next/image'
import { useCourses } from '@/context/CoursesContext'

interface CourseListProps {
  onEdit: (course: any) => void
  onNew: () => void
}

// --- Sortable row ---
function SortableCourseRow({
  course,
  onEdit,
  onDelete,
  onToggle,
  deletingId,
  togglingId,
}: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: course.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-xl overflow-hidden bg-white hover:shadow-md transition-all flex flex-col sm:flex-row ${!course.showOnHome ? 'opacity-60' : ''}`}
      {...(course.status === 'INACTIVE' ? {} : {})}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="hidden sm:flex items-center px-3 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors border-r border-gray-100 bg-gray-50 flex-shrink-0"
        title="Arrastrar para reordenar"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="w-full sm:w-36 h-32 sm:h-auto flex-shrink-0 relative bg-gray-100 overflow-hidden">
        {course.image ? (
          <Image src={course.image} alt={course.title} fill className="object-cover" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-gray-200" />
          </div>
        )}
        {course.level && (
          <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded bg-white/90 text-gray-700">
            {course.level}
          </span>
        )}
      </div>

      <div className="flex-1 p-4 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <h3 className="font-bold text-gray-900 text-lg leading-tight">{course.title}</h3>
          {course.showOnHome
            ? <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">Visible</span>
            : <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">Oculto</span>
          }
          {course.badge && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
              {course.badge}
            </span>
          )}
        </div>
        {course.subtitle && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{course.subtitle}</p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
          {course.schedule && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5" /> {course.schedule}
            </span>
          )}
          {course.modality && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3.5 w-3.5" /> {course.modality}
            </span>
          )}
          {course.price && (
            <span className="flex items-center gap-1 text-xs font-semibold text-green-700">
              <DollarSign className="h-3.5 w-3.5" /> {course.price}
            </span>
          )}
        </div>
        {course.description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{course.description}</p>
        )}
      </div>

      <div className="flex sm:flex-col items-center justify-end gap-2 p-3 border-t sm:border-t-0 sm:border-l border-gray-100 flex-shrink-0">
        <Button onClick={() => onEdit(course)} size="sm" variant="outline" className="flex items-center gap-1.5">
          <Pencil className="h-3.5 w-3.5" /> Editar
        </Button>
        <Button
          onClick={() => onToggle(course)}
          disabled={togglingId === course.id}
          size="sm"
          variant="outline"
          className={`flex items-center gap-1.5 ${course.showOnHome ? 'text-amber-600 border-amber-200 hover:bg-amber-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
        >
          {togglingId === course.id ? (
            <span className="text-xs">...</span>
          ) : course.showOnHome ? (
            <><EyeOff className="h-3.5 w-3.5" /> Ocultar</>
          ) : (
            <><Eye className="h-3.5 w-3.5" /> Mostrar</>
          )}
        </Button>
        <Button
          onClick={() => onDelete(course.id, course.title)}
          disabled={deletingId === course.id}
          size="sm"
          variant="outline"
          className="flex items-center gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          {deletingId === course.id ? '...' : 'Eliminar'}
        </Button>
      </div>
    </div>
  )
}

// --- Main component ---
export function CourseList({ onEdit, onNew }: CourseListProps) {
  const { courses, deleteCourse, updateCourse, reorderCourses, loading } = useCourses()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = courses.findIndex(c => c.id === active.id)
    const newIndex = courses.findIndex(c => c.id === over.id)
    const newOrder = arrayMove(courses, oldIndex, newIndex)

    setSavingOrder(true)
    try {
      await reorderCourses(newOrder.map(c => c.id))
    } finally {
      setSavingOrder(false)
    }
  }

  const handleDelete = async (courseId: string, title: string) => {
    if (!confirm(`¿Eliminar el curso "${title}"? Esta acción no se puede deshacer.`)) return
    setDeletingId(courseId)
    try {
      await deleteCourse(courseId)
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleStatus = async (course: any) => {
    setTogglingId(course.id)
    try {
      await updateCourse(course.id, { showOnHome: !course.showOnHome })
    } finally {
      setTogglingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: '#031e41', borderTopColor: 'transparent' }} />
          <p>Cargando cursos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#031e41' }}>Gestión de Cursos</h2>
          <p className="text-sm text-gray-500 mt-1">
            {courses.length} curso{courses.length !== 1 ? 's' : ''} encontrado{courses.length !== 1 ? 's' : ''}
            {savingOrder && <span className="ml-2 text-blue-500">Guardando orden...</span>}
          </p>
        </div>
        <Button onClick={onNew} className="text-white" style={{ backgroundColor: '#031e41' }}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Curso
        </Button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
          <BookOpen className="h-12 w-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No hay cursos todavía</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">Crea tu primer curso con el botón de arriba</p>
          <Button onClick={onNew} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" /> Crear primer curso
          </Button>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <GripVertical className="h-3.5 w-3.5" />
            Arrastrá las filas para cambiar el orden de los cursos
          </p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={courses.map(c => c.id)} strategy={verticalListSortingStrategy}>
              <div className="grid gap-4">
                {courses.map((course) => (
                  <SortableCourseRow
                    key={course.id}
                    course={course}
                    onEdit={onEdit}
                    onDelete={handleDelete}
                    onToggle={handleToggleStatus}
                    deletingId={deletingId}
                    togglingId={togglingId}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  )
}
