# Agregar Nuevos Cursos

## Método Rápido: Usar cURL

Para agregar un nuevo curso rápidamente, usa este comando cURL. Reemplaza los valores entre `[CORCHETES]` con tus datos:

```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "[slug-del-curso]",
    "title": "[Título del Curso]",
    "subtitle": "[Subtítulo corto]",
    "description": "[Descripción larga del curso]",
    "badge": "PRESENCIAL",
    "status": "open",
    "category": "general",
    "price": "[precio]",
    "duration": "[duración]",
    "startDate": "[YYYY-MM-DD]",
    "schedule": "[horario]",
    "location": "[ubicación]",
    "teacher": "[nombre docente]",
    "modality": "PRESENCIAL",
    "level": "PRINCIPIANTE",
    "objective": "[objetivo del curso]",
    "methodology": "[metodología]",
    "finalProject": "[proyecto final]",
    "requirements": "[requisitos]",
    "modules": [
      {
        "number": "01",
        "title": "[Nombre del módulo]",
        "topics": ["tema 1", "tema 2", "tema 3"]
      }
    ]
  }'
```

## Ejemplo Completo

```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "desarrollo-aplicaciones-python",
    "title": "Desarrollo de Aplicaciones con Python",
    "subtitle": "Forma a estudiantes en fundamentos de programación con Python",
    "description": "El programa de Desarrollo de Aplicaciones en Python con Tkinter está diseñado para introducir al estudiante en las bases de la programación estructurada...",
    "badge": "PRESENCIAL",
    "status": "open",
    "category": "programming",
    "price": "$35.000/mes",
    "duration": "24 clases",
    "startDate": "2026-06-01",
    "schedule": "Lunes: 16:30 a 18:00",
    "location": "ITS Villada, Valle Escondido",
    "teacher": "Gabriel Muñoz",
    "modality": "PRESENCIAL",
    "level": "PRINCIPIANTE",
    "objective": "Formar a los estudiantes en los fundamentos de la programación...",
    "methodology": "Clases prácticas basadas en resolución de problemas reales...",
    "finalProject": "Desarrollo de una aplicación funcional con interfaz gráfica",
    "requirements": "Edad mínima: 15 años",
    "modules": [
      {
        "number": "01",
        "title": "Fundamentos de Programación",
        "topics": ["Concepto de algoritmo", "Tipos de datos y sintaxis", "Operadores lógicos y aritméticos"]
      },
      {
        "number": "02",
        "title": "Estructuras Condicionales",
        "topics": ["Estructura de algoritmos", "Expresiones y proposiciones lógicas", "Operadores relacionales y lógicos"]
      }
    ]
  }'
```

## Campos Disponibles

| Campo | Tipo | Requerido | Ejemplo |
|-------|------|-----------|---------|
| `slug` | string | Sí | `desarrollo-aplicaciones-python` |
| `title` | string | Sí | `Desarrollo de Aplicaciones con Python` |
| `subtitle` | string | No | `Forma a estudiantes en programación` |
| `description` | string | No | `Descripción larga del curso...` |
| `badge` | string | No | `PRESENCIAL`, `ONLINE` |
| `status` | string | No | `open`, `closed` |
| `category` | string | No | `programming`, `design`, `business` |
| `price` | string | No | `$35.000/mes` |
| `duration` | string | No | `24 clases` |
| `startDate` | string (YYYY-MM-DD) | No | `2026-06-01` |
| `schedule` | string | No | `Lunes: 16:30 a 18:00` |
| `location` | string | No | `ITS Villada, Valle Escondido` |
| `teacher` | string | No | `Gabriel Muñoz` |
| `modality` | string | No | `PRESENCIAL`, `ONLINE` |
| `level` | string | No | `PRINCIPIANTE`, `INTERMEDIO`, `AVANZADO` |
| `objective` | string | No | `Formar estudiantes en...` |
| `methodology` | string | No | `Clases prácticas basadas en...` |
| `finalProject` | string | No | `Desarrollo de una aplicación...` |
| `requirements` | string | No | `Edad mínima: 15 años` |
| `maxStudents` | number | No | `20` |
| `modules` | array | No | (ver ejemplo abajo) |

## Estructura de Módulos

Cada módulo debe tener esta estructura:

```json
{
  "number": "01",
  "title": "Nombre del módulo",
  "topics": ["tema 1", "tema 2", "tema 3"]
}
```

Puedes agregar múltiples módulos en el array `modules`.

## Editar un Curso Existente

Para actualizar un curso ya creado, usa `PUT` en lugar de `POST`:

```bash
curl -X PUT http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "id": "desarrollo-aplicaciones-python",
    "title": "Nuevo título",
    "price": "$40.000/mes"
  }'
```

Solo necesitas incluir el campo `id` y los campos que deseas actualizar. Los demás campos se mantienen igual.

## Ver Todos los Cursos

```bash
curl http://localhost:3000/api/courses | jq .
```

## Ver un Curso Específico

```bash
curl http://localhost:3000/api/courses?id=desarrollo-aplicaciones-python | jq .
```

## Panel de Administración

También puedes acceder al panel de administración en:
**http://localhost:3000/admin**

Usuario: `admin`
Contraseña: `Admin2024!`
