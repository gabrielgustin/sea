/**
 * Calcula la edad aproximada basada en el DNI argentino
 * Los primeros 6 dígitos del DNI contienen la fecha de nacimiento en formato YYMMDD
 */
export function calculateAgeFromDNI(dni: string): number | null {
  if (!dni) return null;
  
  // Remover espacios y caracteres especiales, mantener solo dígitos
  const cleanDNI = dni.replace(/\D/g, '');
  
  if (cleanDNI.length < 6) return null;
  
  try {
    // Extraer los primeros 6 dígitos (YYMMDD)
    const dateStr = cleanDNI.substring(0, 6);
    const year = parseInt(dateStr.substring(0, 2), 10);
    const month = parseInt(dateStr.substring(2, 4), 10);
    const day = parseInt(dateStr.substring(4, 6), 10);
    
    // Validar mes y día
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return null;
    }
    
    // Convertir año de 2 dígitos a 4 dígitos
    // Si el año es menor a 30, asumimos 20XX (nacidos después de 2000)
    // Si es 30 o mayor, asumimos 19XX (nacidos antes de 2000)
    const fullYear = year < 30 ? 2000 + year : 1900 + year;
    
    // Crear fecha de nacimiento
    const birthDate = new Date(fullYear, month - 1, day);
    
    // Validar que la fecha sea válida
    if (isNaN(birthDate.getTime())) {
      return null;
    }
    
    // Calcular edad
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Ajustar si el cumpleaños aún no ha ocurrido este año
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error('[v0] Error calculating age from DNI:', error);
    return null;
  }
}

/**
 * Obtiene estadísticas de estudiantes agrupados por curso
 */
export function getStudentStatsByNacimiento(students: any[]): {
  total: number;
  byAge: { [ageRange: string]: number };
} {
  const stats = {
    total: students.length,
    byAge: {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '+55': 0,
      'unknown': 0,
    }
  };
  
  students.forEach(student => {
    const age = calculateAgeFromDNI(student.dni);
    if (age === null) {
      stats.byAge['unknown']++;
    } else if (age <= 25) {
      stats.byAge['18-25']++;
    } else if (age <= 35) {
      stats.byAge['26-35']++;
    } else if (age <= 45) {
      stats.byAge['36-45']++;
    } else if (age <= 55) {
      stats.byAge['46-55']++;
    } else {
      stats.byAge['+55']++;
    }
  });
  
  return stats;
}
