'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Save, X, Plus, Trash2, Filter } from 'lucide-react';
import { calculateAgeFromDNI, getStudentStatsByNacimiento } from '@/lib/dniUtils';

interface Student {
  fecha: string;
  curso: string;
  nombre: string;
  dni: string;
  email: string;
  telefono: string;
  estado: string;
  junio: string;
  julio: string;
  agosto: string;
}

export default function StudentsList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedStudent, setEditedStudent] = useState<Student | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    nombre: '',
    email: '',
    dni: '',
    telefono: '',
    estado: '',
  });
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [showStats, setShowStats] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  // Obtener cursos únicos
  const uniqueCourses = useMemo(() => {
    return Array.from(new Set(students.map(s => s.curso).filter(Boolean)));
  }, [students]);

  // Filtrar estudiantes por curso
  const filteredStudents = useMemo(() => {
    if (!selectedCourse) return students;
    return students.filter(s => s.curso === selectedCourse);
  }, [students, selectedCourse]);

  // Estadísticas por curso
  const courseStats = useMemo(() => {
    const stats: { [course: string]: { total: number; ages: { [ageRange: string]: number } } } = {};
    
    uniqueCourses.forEach(course => {
      const courseStudents = students.filter(s => s.curso === course);
      const ageStats = getStudentStatsByNacimiento(courseStudents);
      stats[course] = {
        total: courseStudents.length,
        ages: ageStats.byAge
      };
    });
    
    return stats;
  }, [students, uniqueCourses]);

  // Estadísticas generales
  const generalStats = useMemo(() => {
    return getStudentStatsByNacimiento(students);
  }, [students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/students');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Error fetching students');
      }
      
      setStudents(data.students || []);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('Error fetching students:', error);
      setError(`Error al cargar estudiantes: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index: number, student: Student) => {
    setEditingIndex(index);
    setEditedStudent({ ...student });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedStudent(null);
  };

  const handleSave = async (index: number) => {
    if (!editedStudent) return;

    try {
      setSaving(true);
      const response = await fetch('/api/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentIndex: index,
          updatedData: editedStudent,
        }),
      });

      if (response.ok) {
        setMessage('Estudiante actualizado correctamente');
        setEditingIndex(null);
        setEditedStudent(null);
        
        setStudents((prev) =>
          prev.map((student, i) =>
            i === index ? editedStudent : student
          )
        );
        
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving student:', error);
      setMessage('Error al guardar cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleAddStudent = async () => {
    if (!newStudent.nombre || !newStudent.email) {
      setError('Por favor completa Nombre y Email');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });

      if (response.ok) {
        setMessage('Estudiante agregado correctamente');
        setNewStudent({
          nombre: '',
          email: '',
          dni: '',
          telefono: '',
          estado: '',
        });
        setShowAddForm(false);
        setError('');
        
        // Recargar los estudiantes
        await fetchStudents();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Error al agregar estudiante');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      setError('Error al agregar estudiante');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStudent = async (index: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      return;
    }

    try {
      setDeletingIndex(index);
      const response = await fetch('/api/students', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentIndex: index }),
      });

      if (response.ok) {
        setMessage('Estudiante eliminado correctamente');
        setStudents((prev) => prev.filter((_, i) => i !== index));
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Error al eliminar estudiante');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      setError('Error al eliminar estudiante');
    } finally {
      setDeletingIndex(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin mr-2" size={20} />
        <span>Cargando estudiantes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {message && (
        <div className={`p-3 rounded-lg ${
          message.includes('Error') 
            ? 'bg-red-50 text-red-700' 
            : 'bg-green-50 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* Panel de Filtros y Estadísticas */}
      <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2" style={{ color: '#031e41' }}>
            <Filter size={18} />
            Filtros y Estadísticas
          </h3>
          <button 
            onClick={() => setShowStats(!showStats)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showStats ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>

        {showStats && (
          <>
            {/* Estadísticas Generales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-600">Total de Inscritos</p>
                <p className="text-2xl font-bold" style={{ color: '#031e41' }}>{students.length}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-600">Cursos Activos</p>
                <p className="text-2xl font-bold" style={{ color: '#031e41' }}>{uniqueCourses.length}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-600">Edad Promedio</p>
                <p className="text-2xl font-bold" style={{ color: '#031e41' }}>
                  {filteredStudents.length > 0
                    ? Math.round(
                        filteredStudents.reduce((sum, s) => {
                          const age = calculateAgeFromDNI(s.dni);
                          return sum + (age || 0);
                        }, 0) / filteredStudents.filter(s => calculateAgeFromDNI(s.dni)).length
                      )
                    : '-'
                  }
                </p>
              </div>
            </div>

            {/* Filtro por Curso */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Filtrar por Curso:</label>
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => setSelectedCourse('')}
                  variant={selectedCourse === '' ? 'default' : 'outline'}
                  size="sm"
                  style={selectedCourse === '' ? { backgroundColor: '#031e41' } : {}}
                  className={selectedCourse === '' ? 'text-white' : ''}
                >
                  Todos ({students.length})
                </Button>
                {uniqueCourses.map(course => (
                  <Button
                    key={course}
                    onClick={() => setSelectedCourse(course)}
                    variant={selectedCourse === course ? 'default' : 'outline'}
                    size="sm"
                    style={selectedCourse === course ? { backgroundColor: '#031e41' } : {}}
                    className={selectedCourse === course ? 'text-white' : ''}
                  >
                    {course} ({courseStats[course]?.total || 0})
                  </Button>
                ))}
              </div>
            </div>

            {/* Desglose por Rango de Edad */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              {Object.entries(filteredStudents.length > 0 ? getStudentStatsByNacimiento(filteredStudents).byAge : generalStats.byAge).map(([ageRange, count]) => (
                <div key={ageRange} className="bg-white p-2 rounded border text-center text-sm">
                  <p className="text-gray-600">{ageRange}</p>
                  <p className="font-bold" style={{ color: '#031e41' }}>{count}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Botón Agregar Estudiante */}
      <div className="flex gap-2">
        {!showAddForm && (
          <Button
            onClick={() => setShowAddForm(true)}
            className="text-white flex items-center gap-2"
            style={{ backgroundColor: '#031e41' }}
          >
            <Plus size={18} />
            Agregar Estudiante
          </Button>
        )}
      </div>

      {/* Formulario Agregar Estudiante */}
      {showAddForm && (
        <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
          <h3 className="font-semibold" style={{ color: '#031e41' }}>Agregar Nuevo Estudiante</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Nombre *</label>
              <Input
                value={newStudent.nombre || ''}
                onChange={(e) => setNewStudent({ ...newStudent, nombre: e.target.value })}
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email *</label>
              <Input
                value={newStudent.email || ''}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">DNI</label>
              <Input
                value={newStudent.dni || ''}
                onChange={(e) => setNewStudent({ ...newStudent, dni: e.target.value })}
                placeholder="DNI"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Teléfono</label>
              <Input
                value={newStudent.telefono || ''}
                onChange={(e) => setNewStudent({ ...newStudent, telefono: e.target.value })}
                placeholder="Teléfono"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-3">
            <Button
              onClick={handleAddStudent}
              disabled={saving}
              className="text-white flex items-center gap-2"
              style={{ backgroundColor: '#031e41' }}
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
              Guardar
            </Button>
            <Button
              onClick={() => {
                setShowAddForm(false);
                setError('');
              }}
              variant="outline"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Tabla de Estudiantes */}
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: '#f5f5f5' }}>
              <TableHead style={{ color: '#031e41' }}>Nombre</TableHead>
              <TableHead style={{ color: '#031e41' }}>Email</TableHead>
              <TableHead style={{ color: '#031e41' }}>DNI</TableHead>
              <TableHead style={{ color: '#031e41' }}>Edad</TableHead>
              <TableHead style={{ color: '#031e41' }}>Teléfono</TableHead>
              <TableHead style={{ color: '#031e41' }}>Estado</TableHead>
              <TableHead style={{ color: '#031e41' }}>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student, index) => {
              const studentIndexInOriginal = students.indexOf(student);
              return (
                <TableRow key={index}>
                  <TableCell>
                    {editingIndex === studentIndexInOriginal ? (
                      <Input
                        value={editedStudent?.nombre || ''}
                        onChange={(e) =>
                          setEditedStudent({
                            ...editedStudent!,
                            nombre: e.target.value,
                          })
                        }
                        className="w-full"
                      />
                    ) : (
                      student.nombre
                    )}
                  </TableCell>

                  <TableCell>
                    {editingIndex === studentIndexInOriginal ? (
                      <Input
                        value={editedStudent?.email || ''}
                        onChange={(e) =>
                          setEditedStudent({
                            ...editedStudent!,
                            email: e.target.value,
                          })
                        }
                        className="w-full"
                      />
                    ) : (
                      student.email
                    )}
                  </TableCell>

                  <TableCell>
                    {editingIndex === studentIndexInOriginal ? (
                      <Input
                        value={editedStudent?.dni || ''}
                        onChange={(e) =>
                          setEditedStudent({
                            ...editedStudent!,
                            dni: e.target.value,
                          })
                        }
                        className="w-full"
                      />
                    ) : (
                      student.dni
                    )}
                  </TableCell>

                  <TableCell className="font-medium" style={{ color: '#031e41' }}>
                    {calculateAgeFromDNI(student.dni) !== null
                      ? `${calculateAgeFromDNI(student.dni)} años`
                      : '-'
                    }
                  </TableCell>

                  <TableCell>
                    {editingIndex === studentIndexInOriginal ? (
                      <Input
                        value={editedStudent?.telefono || ''}
                        onChange={(e) =>
                          setEditedStudent({
                            ...editedStudent!,
                            telefono: e.target.value,
                          })
                        }
                        className="w-full"
                      />
                    ) : (
                      student.telefono
                    )}
                  </TableCell>

                  <TableCell>
                    {editingIndex === studentIndexInOriginal ? (
                      <Input
                        value={editedStudent?.estado || ''}
                        onChange={(e) =>
                          setEditedStudent({
                            ...editedStudent!,
                            estado: e.target.value,
                          })
                        }
                        className="w-full"
                      />
                    ) : (
                      student.estado
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      {editingIndex === studentIndexInOriginal ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleSave(studentIndexInOriginal)}
                            disabled={saving}
                            style={{ backgroundColor: '#031e41' }}
                            className="text-white"
                          >
                            {saving ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <>
                                <Save size={16} className="mr-1" />
                                Guardar
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancel}
                          >
                            <X size={16} />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(studentIndexInOriginal, student)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteStudent(studentIndexInOriginal)}
                            disabled={deletingIndex === studentIndexInOriginal}
                            className="text-red-600 hover:text-red-700"
                          >
                            {deletingIndex === studentIndexInOriginal ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {filteredStudents.length === 0 && !showAddForm && (
        <div className="text-center p-8 text-gray-500">
          {selectedCourse ? `No hay estudiantes en ${selectedCourse}` : 'No hay estudiantes registrados'}
        </div>
      )}
    </div>
  );
}
