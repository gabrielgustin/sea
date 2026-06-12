# 🎓 Resumen de Implementación - Colegio Savio

## ✨ Cambios Realizados

### 1. **Tabla `school_settings` en la Base de Datos**
   - **Archivo**: `lib/db/schema.ts`
   - **Cambio**: Agregada nueva tabla `school_settings` con campos:
     - `id`: Primary key
     - `schoolId`: Identificador de la escuela (villada/savio)
     - `key`: Nombre de la configuración
     - `value`: Valor de la configuración
     - `updatedAt`: Timestamp de la última actualización
   - **Index**: Índice en `schoolId` para queries rápidas
   - **Constraint**: Clave única en `(schoolId, key)` para evitar duplicados

### 2. **API `/api/settings` Actualizado**
   - **Archivo**: `app/api/settings/route.ts`
   - **Cambios**:
     - GET: Acepta parámetro `?schoolId=` (default: villada)
     - POST: Guarda configuraciones filtradas por schoolId
     - Usa `getPool(schoolId)` en lugar de `pool` genérico
     - Queries ahora incluyen `WHERE schoolId = $1`

### 3. **SiteSettingsContext Integrado con SchoolContext**
   - **Archivo**: `context/SiteSettingsContext.tsx`
   - **Cambios**:
     - Importa y usa `useSchool()` hook
     - Tiene defaults separados para Villada y Savio
     - `localStorage` ahora scoped por schoolId: `site_faqs_{schoolId}`
     - Fetch de settings incluye `?schoolId=` en la URL
     - Detecta automáticamente cambios de escuela y recarga settings

### 4. **Scripts de Migración**
   - **Archivo 1**: `migrations/001_add_school_settings.sql`
     - SQL para crear tabla `school_settings`
   - **Archivo 2**: `scripts/migrate-school-settings.mjs`
     - Script Node.js que ejecuta migración en ambas BDs
     - Ejecutable manualmente: `node scripts/migrate-school-settings.mjs`

### 5. **Documentación**
   - **Archivo**: `SETUP_SAVIO.md`
     - Guía completa de configuración
     - Instrucciones para crear BD de Savio en Neon
     - Troubleshooting y verificación

## 📊 Flujo de Datos

```
Browser (URL: /savio/courses)
    ↓
SchoolContext detects schoolId = "savio"
    ↓
SiteSettingsContext useEffect triggers
    ↓
Fetch /api/settings?schoolId=savio
    ↓
getPool("savio") → DATABASE_URL_SAVIO
    ↓
Query: SELECT * FROM school_settings WHERE schoolId='savio'
    ↓
Response con settings específicos de Savio
```

## 🔑 Datos por Defecto

### Villada
```typescript
instagramUrl: 'https://www.instagram.com/itsvillada/?hl=es'
whatsappNumber: '5493516307002'
email: 'formaciones@portalsea.com.ar'
address: 'Cno a La Calera km 7 1/2 Valle'
```

### Savio
```typescript
instagramUrl: 'https://www.instagram.com/colegio.savio'
whatsappNumber: '5491234567890'
email: 'contacto@colegiosavio.edu.ar'
address: 'Dirección del Colegio Savio'
```

*Estos datos son placeholders y deben actualizarse con la información real de Savio.*

## 🚀 Próximos Pasos

1. **Configurar DATABASE_URL_SAVIO**
   - Crear proyecto Neon para Savio
   - Agregar variable en Vercel

2. **Ejecutar Migración**
   ```bash
   node scripts/migrate-school-settings.mjs
   ```

3. **Actualizar Datos de Savio**
   - Modificar defaults en `context/SiteSettingsContext.tsx`
   - O usar la UI admin para guardar en BD

4. **Probar en Producción**
   - Verifica `/savio` y `/villada` funcionan independientemente
   - Cada escuela debe tener sus propios settings

## 🔒 Seguridad & Isolamiento

- ✅ Cada escuela usa su propia base de datos
- ✅ Configuraciones aisladas por `(schoolId, key)`
- ✅ No hay compartimiento de datos entre escuelas
- ✅ FAQs scoped localmente por escuela
- ⚠️ Considera agregar RLS (Row Level Security) en el futuro si agregas autenticación

## 📁 Archivos Modificados

| Archivo | Tipo | Cambios |
|---------|------|---------|
| `lib/db/schema.ts` | Modificado | +8 líneas (tabla schoolSettings) |
| `context/SiteSettingsContext.tsx` | Modificado | +40 líneas (integración SchoolContext) |
| `app/api/settings/route.ts` | Modificado | +18 líneas (soporte schoolId) |
| `migrations/001_add_school_settings.sql` | Nuevo | 15 líneas |
| `scripts/migrate-school-settings.mjs` | Nuevo | 62 líneas |
| `SETUP_SAVIO.md` | Nuevo | 143 líneas |

**Total**: 6 archivos, +286 líneas de código

## ✅ Verificación

Para verificar que todo está funcionando:

```bash
# 1. Ver logs del dev server
npm run dev

# 2. Verificar tabla en Villada
psql $DATABASE_URL -c "SELECT * FROM school_settings LIMIT 5;"

# 3. Verificar tabla en Savio (una vez configurada)
psql $DATABASE_URL_SAVIO -c "SELECT * FROM school_settings LIMIT 5;"

# 4. Probar endpoints
curl "http://localhost:3000/api/settings?schoolId=villada"
curl "http://localhost:3000/api/settings?schoolId=savio"
```

---

**Estado**: ✅ Implementación completada  
**Branch**: `savio-site-setup`  
**Fecha**: 2025-06-12
