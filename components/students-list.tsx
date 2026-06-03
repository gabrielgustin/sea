'use client';

import { useState, useEffect } from 'react';
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
import { Loader2, Save, X, Plus, Trash2 } from 'lucide-react';

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

  useEffect(() => {
    fetchStudents();
  }, []);

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
              <TableHead style={{ color: '#031e41' }}>Teléfono</TableHead>
              <TableHead style={{ color: '#031e41' }}>Estado</TableHead>
              <TableHead style={{ color: '#031e41' }}>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, index) => (
              <TableRow key={index}>
                <TableCell>
                  {editingIndex === index ? (
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
                  {editingIndex === index ? (
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
                  {editingIndex === index ? (
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

                <TableCell>
                  {editingIndex === index ? (
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
                  {editingIndex === index ? (
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
                    {editingIndex === index ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleSave(index)}
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
                          onClick={() => handleEdit(index, student)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteStudent(index)}
                          disabled={deletingIndex === index}
                          className="text-red-600 hover:text-red-700"
                        >
                          {deletingIndex === index ? (
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
            ))}
          </TableBody>
        </Table>
      </div>

      {students.length === 0 && !showAddForm && (
        <div className="text-center p-8 text-gray-500">
          No hay estudiantes registrados
        </div>
      )}
    </div>
  );
}
