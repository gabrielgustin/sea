# Extension Académica - Portal Universitario

Un portal educativo moderno y profesional construido con Next.js 16, React 19, Tailwind CSS y TypeScript.

## 🎯 Características

### Secciones Principales
- **Header Responsivo**: Navegación principal con menú móvil
- **Hero Carousel**: Carrusel interactivo con 3 slides
- **Programas**: Muestra de 4 programas académicos principales
- **Noticias**: Últimas novedades con categorías
- **Formaciones**: Catálogo de diplomaduras y cursos con información de fechas
- **FAQ**: Preguntas frecuentes con acordeón expandible
- **Contacto**: Formulario de contacto y información ubicación
- **Footer**: Enlaces rápidos y redes sociales

### Funcionalidades
- ✅ Diseño completamente responsivo (mobile-first)
- ✅ Tema de colores profesional (azul y blanco)
- ✅ Navegación suave entre secciones
- ✅ Carrusel de imágenes con navegación automática
- ✅ Formulario de contacto funcional
- ✅ Componentes reutilizables
- ✅ Accesibilidad mejorada
- ✅ Animaciones y transiciones suaves

## 🚀 Instalación y Uso

### Requisitos
- Node.js 18+
- pnpm (o npm/yarn)

### Instalación
```bash
# Clonar el proyecto
git clone [URL_DEL_PROYECTO]
cd extension-academica

# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev
```

Abre http://localhost:3000 en tu navegador.

### Build para Producción
```bash
pnpm build
pnpm start
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx          # Layout raíz
│   ├── page.tsx            # Página principal
│   └── globals.css         # Estilos globales y tema
├── components/
│   ├── header.tsx          # Header con navegación
│   ├── hero-carousel.tsx   # Carrusel principal
│   ├── programs-section.tsx # Sección de programas
│   ├── news-section.tsx    # Sección de noticias
│   ├── formations-section.tsx # Sección de formaciones
│   ├── faq-section.tsx     # Preguntas frecuentes
│   ├── contact-section.tsx # Formulario de contacto
│   ├── footer.tsx          # Footer
│   └── ui/                 # Componentes UI reutilizables
└── lib/
    └── utils.ts            # Utilidades (cn, etc)
```

## 🎨 Personalización

### Cambiar Colores
Edita `/app/globals.css` en la sección `:root`:

```css
:root {
  --primary: oklch(0.45 0.22 264);        /* Color primario (azul) */
  --accent: oklch(0.6 0.15 264);          /* Color de acento */
  --background: oklch(0.99 0 0);          /* Fondo */
  --foreground: oklch(0.2 0 0);           /* Texto */
  /* ... otros colores */
}
```

### Modificar Contenido

#### Programas
Edita `components/programs-section.tsx`:
```typescript
const programs = [
  {
    id: 1,
    title: 'Tu Programa',
    description: 'Descripción...',
    icon: IconComponent,
    color: 'from-color-400 to-color-600',
  },
  // ...
];
```

#### Noticias
Edita `components/news-section.tsx`:
```typescript
const news = [
  {
    id: 1,
    title: 'Tu Noticia',
    description: '...',
    category: 'Categoría',
    date: 'DD/MM/YYYY',
    image: 'gradient-css',
  },
  // ...
];
```

#### Formaciones
Edita `components/formations-section.tsx`:
```typescript
const formations = [
  {
    id: 1,
    title: 'Tu Formación',
    type: 'Diplomatura',
    modality: 'Online',
    startDate: 'Inicia...',
    image: 'gradient-css',
  },
  // ...
];
```

#### FAQ
Edita `components/faq-section.tsx`:
```typescript
const faqItems = [
  {
    id: 1,
    question: '¿Tu pregunta?',
    answer: 'Tu respuesta...',
  },
  // ...
];
```

#### Información de Contacto
Edita `components/footer.tsx` y `components/contact-section.tsx` con:
- Dirección
- Teléfono
- Email
- Horarios

### Cambiar Logo
En `components/header.tsx`:
```typescript
<div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
  <span className="text-white font-bold text-lg">TU_LOGO</span>
</div>
```

## 🔧 Tecnologías Utilizadas

- **Next.js 16**: Framework React con SSR
- **React 19**: Librería UI
- **Tailwind CSS**: Estilos y diseño
- **TypeScript**: Tipado estático
- **Lucide React**: Iconos
- **shadcn/ui**: Componentes UI accesibles

## 📱 Responsividad

El portal es completamente responsivo:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## ♿ Accesibilidad

- Etiquetas ARIA correctas
- Navegación por teclado
- Textos alt en imágenes
- Contraste de colores adecuado
- Semántica HTML5

## 🔐 Seguridad

El formulario de contacto es funcional pero actualmente no envía emails. Para implementar envíos:

```typescript
// Agregar en app/api/contact/route.ts
export async function POST(req: Request) {
  const data = await req.json();
  // Aquí ir email con tu servicio preferido
}
```

## 📈 Mejoras Futuras Sugeridas

- [ ] Conectar base de datos para cursos dinámicos
- [ ] Sistema de autenticación de usuarios
- [ ] Panel de administración
- [ ] Sistema de comentarios/reviews
- [ ] Blog con artículos
- [ ] Integración con email (Sendgrid, Resend)
- [ ] Analytics
- [ ] SEO mejorado

## 📝 Licencia

Este proyecto está disponible bajo licencia MIT.

## 💬 Soporte

Para consultas o sugerencias, contacta a través del formulario de contacto en el sitio.

---

**Versión**: 1.0.0
**Última actualización**: Mayo 2026
