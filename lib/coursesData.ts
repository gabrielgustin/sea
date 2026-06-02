export const coursesData = [
  {
    id: 1,
    title: 'Desarrollo de Aplicaciones',
    subtitle: 'Forma a estudiantes en fundamentos de programación con Python',
    image: '/course-app-development.jpg',
    badge: 'EDUCACIÓN PRESENCIAL',
    startDate: 'Lun 1/06/2026',
    modality: 'Presencial',
    slug: 'desarrollo-de-aplicaciones',
    description: '¡Domina Python y dale vida a tus ideas con Interfaces Gráficas! 💻✨\n\nTodo gran software empieza por la lógica, pero triunfa por su diseño. En este curso intensivo aprenderás los fundamentos de programación en Python y darás el salto clave: crear aplicaciones visuales con Tkinter.\n\n🧠 Desarrolla tu lógica con algoritmos, ciclos y funciones.\n🎨 Diseña ventanas, botones y widgets interactivos.\n🛠️ Pasa de la teoría a la acción creando software real.\n\nDiseñado para principiantes que buscan resultados visibles desde la primera semana. ¡Los cupos son limitados, asegura tu lugar y empieza a programar ya!',
    schedule: 'Lunes: 16:30 a 18:00',
    location: 'ITS Villada, Valle Escondido',
    teacher: 'Gabriel Muñoz',
    duration: '6 meses',
    price: '$35.000/mes',
    objective: 'Formar a los estudiantes en los fundamentos de la programación, desarrollando habilidades para crear aplicaciones funcionales utilizando Python, incluyendo interfaces gráficas.',
    modules: [
      {
        number: '01',
        title: 'Fundamentos de Programación',
        topics: ['Concepto de algoritmo', 'Tipos de datos y sintaxis', 'Operadores lógicos y aritméticos']
      },
      {
        number: '02',
        title: 'Estructuras Condicionales',
        topics: ['Estructura de algoritmos', 'Expresiones y proposiciones lógicas', 'Operadores relacionales y lógicos']
      },
      {
        number: '03',
        title: 'Estructuras Repetitivas',
        topics: ['Control de flujo', 'Ciclos', 'Variables contadoras y acumuladoras']
      },
      {
        number: '04',
        title: 'Funciones',
        topics: ['Sintaxis de funciones', 'Funciones con y sin retorno', 'Modularización del código']
      },
      {
        number: '05',
        title: 'Interfaces Gráficas con Tkinter',
        topics: ['Introducción a interfaces gráficas', 'Ventanas y widgets básicos', 'Botones, etiquetas y entradas', 'Diseño de aplicaciones simples con interfaz']
      }
    ],
    methodology: 'Clases prácticas basadas en resolución de problemas reales, más de 20 ejercicios prácticos por unidad, trabajo práctico integrador por módulo',
    finalProject: 'Desarrollo de una aplicación funcional con interfaz gráfica',
  },
  {
    id: 2,
    title: 'Desarrollo de Videojuegos',
    subtitle: 'Desarrolla videojuegos completos con herramientas modernas',
    image: '/course-game-development.jpg',
    badge: 'EDUCACIÓN PRESENCIAL',
    startDate: 'Jue 4/06/2026',
    modality: 'Presencial',
    slug: 'desarrollo-de-videojuegos',
    description: '¿Listo para crear tu primer videojuego? Del diseño a la pantalla en un solo curso 🚀👾\n\nPasar de la idea al juego es más fácil de lo que crees. En este curso intensivo te convertirás en desarrollador de videojuegos paso a paso:\n\n🧠 Diseña la lógica: Entiende las reglas, objetivos y cómo piensa un creador de juegos.\n🕹️ Dale vida al personaje: Domina movimientos, escenas y mecánicas de juego (vidas, puntos y colisiones).\n🎨 Suma estilo: Agrega menús, interfaces, música y animaciones que atrapen al jugador.\n🏆 Tu Proyecto Final: Diseña y exporta un videojuego 100% tuyo desde cero.',
    schedule: 'Jueves: 16:30 a 18:00',
    location: 'ITS Villada, Valle Escondido',
    teacher: 'Gabriel Muñoz',
    duration: '6 meses',
    price: '$35.000/mes',
    objective: 'Que los alumnos desarrollen videojuegos completos mientras adquieren habilidades de lógica y pensamiento computacional utilizando herramientas modernas.',
    modules: [
      {
        number: '01',
        title: 'Lógica y diseño de juegos',
        topics: ['Cómo funcionan los videojuegos', 'Objetivos y reglas', 'Introducción al pensamiento computacional']
      },
      {
        number: '02',
        title: 'Primeros juegos',
        topics: ['Uso de herramientas (GDevelop)', 'Escenas y objetos', 'Movimiento de personajes']
      },
      {
        number: '03',
        title: 'Mecánicas de juego',
        topics: ['Sistema de puntaje', 'Vidas y condiciones de derrota', 'Colisiones', 'Eventos y lógica de juego']
      },
      {
        number: '04',
        title: 'Mejora y personalización',
        topics: ['Animaciones', 'Sonidos', 'Interfaces (menú, inicio, game over)', 'Diseño visual']
      },
      {
        number: '05',
        title: 'Proyecto Final',
        topics: ['Desarrollo de videojuego completo', 'Personalización total', 'Presentación final']
      }
    ],
    methodology: 'Clases prácticas basadas en proyectos, resolución de desafíos progresivos, trabajo práctico integrador',
    finalProject: 'Desarrollo de un videojuego funcional e interactivo',
  },
  {
    id: 3,
    title: 'Diseño e Impresión 3D',
    subtitle: 'Capacita en diseño 3D y fabricación mediante impresión 3D',
    image: '/course-3d-design.jpg',
    badge: 'EDUCACIÓN PRESENCIAL',
    startDate: 'Mar 3/06/2026',
    modality: 'Presencial',
    slug: 'diseno-impresion-3d',
    description: 'Capacitar a los estudiantes en el diseño de modelos tridimensionales y su fabricación mediante impresión 3D.',
    schedule: 'Martes: 16:30 a 18:00',
    location: 'ITS Villada, Valle Escondido',
    teacher: 'Santiago Henderson',
    duration: '6 meses',
    price: '$35.000/mes',
    objective: 'Capacitar a los estudiantes en el diseño de modelos tridimensionales y su fabricación mediante impresión 3D.',
    modules: [
      {
        number: '01',
        title: 'Introducción a la Impresión 3D',
        topics: ['Qué es la impresión 3D', 'Tipos de impresoras', 'Partes de una impresora 3D', 'Flujo de trabajo']
      },
      {
        number: '02',
        title: 'Herramientas de Diseño',
        topics: ['Introducción a Autodesk Fusion 360', 'Interfaz y navegación', 'Operaciones básicas', 'Modificadores iniciales']
      },
      {
        number: '03',
        title: 'Modelado para Impresión',
        topics: ['Modelado básico', 'Modificadores avanzados', 'Sketches (bocetos)', 'Diseño orientado a fabricación']
      },
      {
        number: '04',
        title: 'Preparación de Impresión',
        topics: ['Uso de Ultimaker Cura', 'Configuración de perfiles', 'Preparación de archivos', 'Ajustes de calidad']
      },
      {
        number: '05',
        title: 'Producción y Optimización',
        topics: ['Puesta a punto', 'Mantenimiento', 'Problemas habituales', 'Comunidad Maker']
      }
    ],
    methodology: 'Metodología teórico-práctica orientada a recorrer el proceso completo: diseño, preparación e impresión de piezas. Aprendizaje basado en proyectos reales',
    finalProject: 'Diseño y fabricación de un producto funcional en 3D',
  },
  {
    id: 4,
    title: 'Mecánica de Motores',
    subtitle: 'Brindar conocimientos técnicos sobre funcionamiento de motores',
    image: '/course-automotive.jpg',
    badge: 'EDUCACIÓN PRESENCIAL',
    startDate: 'Mar 3/06/2026',
    modality: 'Presencial',
    slug: 'mecanica-de-motores',
    description: 'Brindar conocimientos técnicos sobre el funcionamiento, mantenimiento y reparación de motores y sistemas automotrices.',
    schedule: 'Martes: 16:30 a 18:00',
    location: 'ITS Villada, Valle Escondido',
    teacher: 'Kevin Altamirano',
    duration: '6 meses',
    price: '$35.000/mes',
    objective: 'Brindar conocimientos técnicos sobre el funcionamiento, mantenimiento y reparación de motores y sistemas automotrices.',
    modules: [
      {
        number: '01',
        title: 'Principios del Motor',
        topics: ['Partes constitutivas', 'Ciclo Otto y Diesel', 'Evolución de los motores']
      },
      {
        number: '02',
        title: 'Sistemas del Motor',
        topics: ['Admisión', 'Escape', 'Encendido', 'Lubricación y refrigeración', 'Sistema de combustible']
      },
      {
        number: '03',
        title: 'Sistemas del Vehículo',
        topics: ['Frenos', 'Dirección', 'Suspensión', 'Transmisión']
      },
      {
        number: '04',
        title: 'Mantenimiento',
        topics: ['Diagnóstico de fallas', 'Cambio de fluidos', 'Verificación del tren delantero', 'Sistema de distribución']
      },
      {
        number: '05',
        title: 'Reparación de Motores',
        topics: ['Armado y desarmado', 'Metrología', 'Verificaciones previas a la puesta en marcha']
      }
    ],
    methodology: 'Metodología teórico-práctica con comprensión de sistemas automotrices y resolución de problemas mecánicos reales',
    finalProject: 'Diagnóstico y simulación de reparación de un motor',
  },
];
