import { NextRequest, NextResponse } from 'next/server';

// Almacenamiento simulado en memoria (en producción usar base de datos)
let students: any[] = [];

// GET: Obtener todos los estudiantes
export async function GET() {
  try {
    // Retornar los estudiantes almacenados en memoria
    return NextResponse.json({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un estudiante
export async function PUT(request: NextRequest) {
  try {
    const { studentIndex, updatedData } = await request.json();

    if (studentIndex === undefined) {
      return NextResponse.json(
        { error: 'Student index required' },
        { status: 400 }
      );
    }

    // Actualizar el estudiante
    if (students[studentIndex]) {
      students[studentIndex] = { ...students[studentIndex], ...updatedData };
    }

    return NextResponse.json({ success: true, message: 'Student updated' });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      { error: 'Failed to update student', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo estudiante
export async function POST(request: NextRequest) {
  try {
    const newStudent = await request.json();

    // Agregar fecha actual si no existe
    if (!newStudent.fecha) {
      newStudent.fecha = new Date().toLocaleDateString('es-ES');
    }

    // Agregar el nuevo estudiante
    students.push(newStudent);

    return NextResponse.json({ success: true, message: 'Student created' });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Failed to create student', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un estudiante
export async function DELETE(request: NextRequest) {
  try {
    const { studentIndex } = await request.json();

    if (studentIndex === undefined) {
      return NextResponse.json(
        { error: 'Student index required' },
        { status: 400 }
      );
    }

    // Eliminar el estudiante
    students.splice(studentIndex, 1);

    return NextResponse.json({ success: true, message: 'Student deleted' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { error: 'Failed to delete student', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
