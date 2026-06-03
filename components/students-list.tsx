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
import { Loader2, Save, X } from 'lucide-react';

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
        
        // Actualizar la lista
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

      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: '#f5f5f5' }}>
              <TableHead style={{ color: '#031e41' }}>Nombre</TableHead>
              <TableHead style={{ color: '#031e41' }}>Email</TableHead>
              <TableHead style={{ color: '#031e41' }}>DNI</TableHead>
              <TableHead style={{ color: '#031e41' }}>Curso</TableHead>
              <TableHead style={{ color: '#031e41' }}>Teléfono</TableHead>
              <TableHead style={{ color: '#031e41' }}>Estado</TableHead>
              <TableHead style={{ color: '#031e41' }}>Junio</TableHead>
              <TableHead style={{ color: '#031e41' }}>Julio</TableHead>
              <TableHead style={{ color: '#031e41' }}>Agosto</TableHead>
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
                      value={editedStudent?.curso || ''}
                      onChange={(e) =>
                        setEditedStudent({
                          ...editedStudent!,
                          curso: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                  ) : (
                    student.curso
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
                  {editingIndex === index ? (
                    <Input
                      value={editedStudent?.junio || ''}
                      onChange={(e) =>
                        setEditedStudent({
                          ...editedStudent!,
                          junio: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                  ) : (
                    student.junio
                  )}
                </TableCell>

                <TableCell>
                  {editingIndex === index ? (
                    <Input
                      value={editedStudent?.julio || ''}
                      onChange={(e) =>
                        setEditedStudent({
                          ...editedStudent!,
                          julio: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                  ) : (
                    student.julio
                  )}
                </TableCell>

                <TableCell>
                  {editingIndex === index ? (
                    <Input
                      value={editedStudent?.agosto || ''}
                      onChange={(e) =>
                        setEditedStudent({
                          ...editedStudent!,
                          agosto: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                  ) : (
                    student.agosto
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(index, student)}
                      >
                        Editar
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {students.length === 0 && (
        <div className="text-center p-8 text-gray-500">
          No hay estudiantes registrados
        </div>
      )}
    </div>
  );
}
