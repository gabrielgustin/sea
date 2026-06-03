import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const sheets = google.sheets('v4');

// Inicializar autenticación
function getAuthClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

  if (!email || !privateKey || !spreadsheetId) {
    throw new Error('Missing Google Sheets credentials');
  }

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return { auth, spreadsheetId };
}

// GET: Obtener todos los estudiantes
export async function GET() {
  try {
    const { auth, spreadsheetId } = getAuthClient();

    // Primero obtener las propiedades del spreadsheet para conocer los sheet names
    const spreadsheetInfo = await sheets.spreadsheets.get({
      auth,
      spreadsheetId,
    });

    const sheetName = spreadsheetInfo.data.sheets?.[0]?.properties?.title || 'Sheet1';
    console.log('[v0] Sheet name:', sheetName);

    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${sheetName}!A:J`, // Usar el nombre del primer sheet
    });

    const rows = response.data.values || [];
    
    // Headers están en la primera fila
    const headers = rows[0] || [];
    const students = rows.slice(1).map((row) => ({
      fecha: row[0] || '',
      curso: row[1] || '', // Cambiar de row[0] a row[1] para obtener el curso real
      nombre: row[2] || '',
      dni: row[3] || '', // Cambiar de row[1] a row[3]
      email: row[4] || '', // Cambiar de row[3] a row[4]
      telefono: row[5] || '', // Cambiar de row[4] a row[5]
      estado: row[6] || '', // Cambiar de row[5] a row[6]
      junio: row[7] || '',
      julio: row[8] || '',
      agosto: row[9] || '',
    }));

    return NextResponse.json({ students, headers });
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

    const { auth, spreadsheetId } = getAuthClient();

    // Obtener el nombre del sheet
    const spreadsheetInfo = await sheets.spreadsheets.get({
      auth,
      spreadsheetId,
    });
    const sheetName = spreadsheetInfo.data.sheets?.[0]?.properties?.title || 'Sheet1';

    // Obtener todos los datos primero
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${sheetName}!A:J`,
    });

    const rows = response.data.values || [];
    const rowIndex = studentIndex + 2; // +1 por header, +1 por índice 0

    // Preparar los valores actualizados
    const values = [
      [
        updatedData.fecha || rows[rowIndex]?.[0] || '',
        updatedData.curso || rows[rowIndex]?.[1] || '',
        updatedData.nombre || rows[rowIndex]?.[2] || '',
        updatedData.dni || rows[rowIndex]?.[3] || '',
        updatedData.email || rows[rowIndex]?.[4] || '',
        updatedData.telefono || rows[rowIndex]?.[5] || '',
        updatedData.estado || rows[rowIndex]?.[6] || '',
        updatedData.junio || rows[rowIndex]?.[7] || '',
        updatedData.julio || rows[rowIndex]?.[8] || '',
        updatedData.agosto || rows[rowIndex]?.[9] || '',
      ],
    ];

    // Actualizar la fila
    const range = `${sheetName}!A${rowIndex}:J${rowIndex}`;
    await sheets.spreadsheets.values.update({
      auth,
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

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

    const { auth, spreadsheetId } = getAuthClient();

    // Obtener el nombre del sheet
    const spreadsheetInfo = await sheets.spreadsheets.get({
      auth,
      spreadsheetId,
    });
    const sheetName = spreadsheetInfo.data.sheets?.[0]?.properties?.title || 'Sheet1';

    // Obtener los datos actuales para saber en qué fila insertar
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${sheetName}!A:J`,
    });

    const rows = response.data.values || [];
    const nextRowIndex = rows.length + 1; // Siguiente fila disponible

    // Preparar los valores del nuevo estudiante
    const values = [
      [
        newStudent.fecha || new Date().toLocaleDateString('es-ES'),
        newStudent.curso || '',
        newStudent.nombre || '',
        newStudent.dni || '',
        newStudent.email || '',
        newStudent.telefono || '',
        newStudent.estado || '',
        newStudent.junio || '',
        newStudent.julio || '',
        newStudent.agosto || '',
      ],
    ];

    // Insertar la nueva fila
    const range = `${sheetName}!A${nextRowIndex}:J${nextRowIndex}`;
    await sheets.spreadsheets.values.update({
      auth,
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

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

    const { auth, spreadsheetId } = getAuthClient();

    // Obtener el nombre del sheet y su ID
    const spreadsheetInfo = await sheets.spreadsheets.get({
      auth,
      spreadsheetId,
    });
    const sheet = spreadsheetInfo.data.sheets?.[0];
    const sheetName = sheet?.properties?.title || 'Sheet1';
    const sheetId = sheet?.properties?.sheetId || 0;

    // La fila a eliminar es studentIndex + 2 (por el header)
    const rowIndex = studentIndex + 1; // 0-based index, row 2 es índice 1

    // Usar batchUpdate para eliminar la fila
    await sheets.spreadsheets.batchUpdate({
      auth,
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: 'ROWS',
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });

    return NextResponse.json({ success: true, message: 'Student deleted' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { error: 'Failed to delete student', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
