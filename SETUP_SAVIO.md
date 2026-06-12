# 🏫 Colegio Savio - Setup Guide

## Overview
El sistema ahora está configurado para soportar múltiples escuelas:
- **Villada** - ITS Villada (producción existente)
- **Savio** - Colegio Savio (nueva escuela)

Cada escuela tiene su propia base de datos y configuraciones independientes.

## 🚀 Configuración para Colegio Savio

### 1. Crear base de datos Neon para Savio
1. Ir a [Neon Console](https://console.neon.tech)
2. Crear un nuevo proyecto (ej: "savio")
3. Crear una base de datos (ej: "savio_db")
4. Copiar la connection string

### 2. Configurar variables de ambiente
En tu proyecto Vercel o `.env.local`, agregar:

```env
DATABASE_URL_SAVIO=postgresql://user:password@host/savio_db
```

### 3. Ejecutar migración
Ejecuta el script de migración para crear la tabla en Savio:

```bash
node scripts/migrate-school-settings.mjs
```

Esto creará la tabla `school_settings` en ambas bases de datos.

### 4. Configurar datos de Savio
Los datos por defecto de Savio están en `context/SiteSettingsContext.tsx`:

```typescript
const defaultSettingsSavio: SiteSettings = {
  instagramUrl: 'https://www.instagram.com/colegio.savio',
  whatsappNumber: '5491234567890',
  whatsappMessage: 'Hola! Me interesa obtener más información sobre los cursos del Colegio Savio.',
  email: 'contacto@colegiosavio.edu.ar',
  address: 'Dirección del Colegio Savio',
};
```

Actualiza estos valores con la información real de Savio.

## 📍 Estructura de rutas

El sistema detecta la escuela automáticamente desde la URL:

- **Villada**: `domain.com/villada/...`
- **Savio**: `domain.com/savio/...`

El componente `SchoolProvider` (en `context/SchoolContext.tsx`) detecta el `schoolId` y automáticamente:
1. Carga la base de datos correcta
2. Carga los settings específicos de esa escuela
3. Carga los FAQs guardados localmente para esa escuela

## 🔧 API de Settings

El endpoint `/api/settings` ahora acepta un parámetro `schoolId`:

```typescript
// GET - obtener settings de una escuela
GET /api/settings?schoolId=savio

// POST - guardar settings de una escuela
POST /api/settings?schoolId=savio
Body: { instagramUrl: "...", whatsappNumber: "...", ... }
```

Si no se proporciona `schoolId`, por defecto usa `villada`.

## 📊 Base de datos

Nueva tabla `school_settings`:

```sql
CREATE TABLE school_settings (
  id SERIAL PRIMARY KEY,
  schoolId TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(schoolId, key)
);
```

Cada configuración se identifica por `(schoolId, key)` única.

## 🔄 Migración de datos (opcional)

Si quieres copiar configuraciones de Villada a Savio:

```bash
# 1. Exportar settings de Villada desde la UI admin
# 2. Luego cambiar a /savio/admin/settings
# 3. Importar los settings en Savio
```

O usar SQL directamente:

```sql
INSERT INTO school_settings (schoolId, key, value)
SELECT 'savio', key, value FROM school_settings 
WHERE schoolId = 'villada';
```

## ✅ Verificación

Para verificar que todo funciona:

1. Navega a `domain.com/villada` - debe cargar los settings de Villada
2. Navega a `domain.com/savio` - debe cargar los settings de Savio
3. Cambia un setting en cada escuela y verifica que sean independientes
4. Abre DevTools → Network y verifica que las calls a `/api/settings` incluyan el parámetro `?schoolId=...`

## 🆘 Troubleshooting

### "DATABASE_URL_SAVIO not found"
- Asegurate de haber agregado la variable de ambiente en Vercel
- Espera a que el deployment complete para que los cambios tomen efecto

### "Schema mismatch"
- Ejecuta `node scripts/migrate-school-settings.mjs` nuevamente
- Verifica que `school_settings` exista en ambas BDs:
  ```sql
  SELECT * FROM information_schema.tables WHERE table_name='school_settings';
  ```

### Configuraciones compartidas entre escuelas
- Verifica que el URL incluya el schoolId (ej: `/savio/admin/settings`)
- En el componente, verifica que `useSchool()` esté disponible dentro de `SchoolProvider`
- Revisa los logs del navegador para ver el `schoolId` detectado

## 📝 Notas

- Cada escuela tiene FAQs separados guardados en localStorage bajo `site_faqs_{schoolId}`
- Los settings de cada escuela se sincronizan con su base de datos correspondiente
- El sistema es completamente agnóstico - fácilmente puedes agregar más escuelas en el futuro
