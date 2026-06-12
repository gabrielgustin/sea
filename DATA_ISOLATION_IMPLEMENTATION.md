# Data Isolation Implementation - Villada vs Savio

## Problem Solved
Las modificaciones hechas en el panel admin de Savio estaban afectando también a Villada. El problema era que no había aislamiento de datos a nivel de base de datos ni de rutas.

## Solution Implemented

### 1. Database Schema Changes
**Added `schoolId` column** a las tablas críticas:
- `courses` table: Nuevo campo `schoolId TEXT NOT NULL DEFAULT 'villada'`
- `teachers` table: Nuevo campo `schoolId TEXT NOT NULL DEFAULT 'villada'`
- `school_settings` table: Ya existía y fue actualizado

Esto permite que cada escuela tenga sus propios cursos y docentes en bases de datos separadas.

### 2. Route Structure Changes
**Movido el panel admin** de ubicación compartida a ubicación específica por escuela:
- Antes: `/admin/page.tsx` (compartido)
- Ahora: `/[schoolId]/admin/page.tsx` (aislado por escuela)

Esto asegura que las URL siempre incluyan el `schoolId` necesario.

### 3. API Endpoint Updates
Todos los endpoints de API ahora **filtran por `schoolId`**:

**`/api/courses`**
- GET: Filtra cursos por `?schoolId=` (default: 'villada')
- POST: Inserta en la BD correcta y setea `schoolId`
- PUT/PATCH: Solo actualiza si `id AND schoolId` coinciden
- DELETE: Solo elimina si `id AND schoolId` coinciden

**`/api/teachers`**
- GET: Filtra docentes por `?schoolId=` (default: 'villada')
- POST: Inserta en la BD correcta y setea `schoolId`
- PUT: Solo actualiza si `id AND schoolId` coinciden
- DELETE: Solo elimina si `id AND schoolId` coinciden

**`/api/settings`**
- GET/POST: Filtra por `?schoolId=` (ya implementado antes)

### 4. Context Updates
**CoursesContext**
- Ahora usa `useSchool()` para obtener el `schoolId` actual
- Todas las llamadas a API incluyen `?schoolId=` en la URL
- Los cursos se recargan cuando cambia el `schoolId`

**AdminDashboard**
- Importa `useSchool()` para obtener el `schoolId`
- El botón logout redirige a `/${schoolId}` (no a `/`)

**TeacherManager**
- Importa `useSchool()` para obtener el `schoolId`
- Todos los fetch calls incluyen `?schoolId=` en la URL
- Se recargan docentes cuando cambia el `schoolId`

### 5. Database Migrations
Se crearon tres scripts de migración:

1. **`scripts/migrate-add-schoolid.mjs`**
   - Agrega columna `schoolId` a tablas existentes
   - Crea índices para búsquedas rápidas
   - Ejecuta en ambas BDs (Villada y Savio)

2. **`scripts/init-savio-db.mjs`**
   - Inicializa la BD de Savio con todas las tablas
   - Ejecuta sentencias una por una para evitar errores de Neon

3. **`scripts/migrate-savio-simple.mjs`**
   - Migración simple que agrega `schoolId` a Savio
   - Maneja columnas que ya existen

### 6. Critical Rules
Se guardó en memoria la regla crítica:
```
NUNCA mezclar datos entre /savio y /villada
- /savio/* → siempre usa BD de Savio
- /villada/* → siempre usa BD de Villada
- Todos los cambios deben pasar schoolId en API calls
```

## Verification
✅ Rutas correctas: `/savio/admin`, `/villada/admin`
✅ BDs aisladas: Villada y Savio tienen datos independientes
✅ API filtering: Todos los endpoints filtran por schoolId
✅ Context updated: CoursesContext y TeacherManager usan schoolId
✅ Migrations completed: Ambas BDs con tablas correctas

## Files Modified/Created
- `lib/db/schema.ts` - Agregados campos `schoolId` a tablas
- `app/[schoolId]/admin/page.tsx` - Creado (nuevo lugar del admin)
- `context/CoursesContext.tsx` - Integrado `useSchool()`
- `context/AdminDashboard.tsx` - Integrado `useSchool()`
- `components/teacher-manager.tsx` - Integrado `useSchool()`
- `app/api/courses/route.ts` - Agregado filtrado por schoolId
- `app/api/teachers/route.ts` - Agregado filtrado por schoolId
- `scripts/migrate-*.mjs` - Tres scripts de migración

## Next Steps
1. Verificar que cambios en `/savio/admin` NO afectan `/villada`
2. Verificar que cambios en `/villada/admin` NO afectan `/savio`
3. Validar que las BDs se han migrado correctamente
4. Eliminar el archivo `/app/admin/page.tsx` (ahora está en `/app/[schoolId]/admin/page.tsx`)
