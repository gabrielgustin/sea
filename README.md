# Portal SEA — multi‑cliente

Un solo sitio y un solo dominio. Cada cliente vive en `/<slug>` (por ejemplo `/savio`, `/villada`) con su
propia información y **su propia base de datos** en Turso.

## Cómo funciona

```
/savio ──┐                       ┌─ base de control (tabla `tenants`: slug, marca, URL+token de su base)
/villada ┼─► [tenant]/layout ───►│
/xxxxx  ─┘     (servidor)        └─ base del cliente  ──► cursos, docentes, slides, ajustes,
                                                          inscripciones, alumnos, admins, mensajes
```

- `lib/tenants/` — registro de clientes, conexión a la base de cada uno y migraciones del esquema.
- `lib/data/` — consultas (cursos, docentes, carrusel, ajustes, inscripciones). Reciben la base del cliente; nunca filtran por `schoolId`.
- `lib/auth/` — sesión en cookie `httpOnly` firmada, **una por cliente**; `route()` protege las rutas de API.
- `app/[tenant]/…` — páginas renderizadas en el servidor con los datos ya cargados.
- `app/api/[tenant]/…` — API. Escritura y datos personales: solo administrador de ese cliente.

## Sumar un cliente nuevo

```bash
pnpm tenant create xxxxx --name "Nombre de la institución" --logo /logo-xxxxx.png --logo-alt "Logo" \
  --admin-email admin --admin-password '<clave>' --provision
```

`--provision` crea la base en Turso (necesita `TURSO_ORG` y `TURSO_API_TOKEN`); sin eso usar `--db-url`/`--db-token`.
El sitio responde en `/xxxxx` de inmediato, sin tocar código ni redeploy.

Otros comandos: `pnpm tenant migrate --all` (aplica migraciones nuevas a todas las bases), `pnpm tenant list`,
`pnpm tenant set-admin <slug> <email> <clave>`.

## Cambiar el esquema

Agregar una migración **al final** de `MIGRATIONS` en `lib/tenants/schema.ts` y correr `pnpm tenant migrate --all`.
Nunca editar una migración ya aplicada.

## Migrar los datos de la base única antigua

```bash
LEGACY_DB_URL=... LEGACY_DB_TOKEN=... pnpm tenant:import savio            # ensayo, no escribe
LEGACY_DB_URL=... LEGACY_DB_TOKEN=... pnpm tenant:import savio --apply    # copia de verdad
```

No toca la base antigua. Los mensajes de contacto/formularios eran compartidos: usar `--include-shared` en un solo cliente.

## Desarrollo local

Copiar `.env.example` a `.env.local`. Para no tocar producción, usar bases de archivo
(`CONTROL_DB_URL=file:.data/control.db` y `--db-url file:.data/savio.db`). Luego `pnpm dev`.
