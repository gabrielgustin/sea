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
    console.log('[v0] Rows fetched:', rows.length);
    
    // Headers están en la primera fila
    const headers = rows[0] || [];
    const students = rows.slice(1).map((row) => ({
      fecha: row[0] || '',
      curso: row[1] || '',
      nombre: row[2] || '',
      dni: row[3] || '',
      email: row[4] || '',
      telefono: row[5] || '',
      estado: row[6] || '',
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

    // Obtener todos los datos primero
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: 'Inscripciones!A:J',
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
    const range = `Inscripciones!A${rowIndex}:J${rowIndex}`;
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
      { error: 'Failed to update student' },
      { status: 500 }
    );
  }
}
