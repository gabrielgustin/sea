export const coursesData = [
  {
    id: 1,
    title: 'Desarrollo de Aplicaciones',
    subtitle: 'Forma a estudiantes en fundamentos de programación con Python',
    image: '/course-app-development.jpg',
    badge: 'EDUCACIÓN PRESENCIAL',
    startDate: 'Lun 1/06/2026',
    enrollmentDeadline: '2026-06-30',
    modality: 'Presencial',
    slug: 'desarrollo-de-aplicaciones',
    description: 'El programa de Desarrollo de Aplicaciones en Python con Tkinter está diseñado para introducir al estudiante en las bases de la programación estructurada y la creación de software con entorno visual. A través de un enfoque metodológico, el alumno transitará desde la conceptualización lógica de un algoritmo hasta el despliegue de aplicaciones de escritorio funcionales e interactivas, utilizando el lenguaje de programación más demandado del mercado actual.',
    schedule: 'Lunes: 16:30 a 18:00',
    location: 'ITS Villada, Valle Escondido',
    teacher: 'Gabriel Muñoz',
    teachers: [
      {
        name: 'Gabriel Muñoz',
        photo: '/teachers/gabriel-munoz.jpg',
        description: '',
        linkedin: 'https://www.linkedin.com/in/gabiagustin'
      }
    ],
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
    whatsappGroup: 'https://chat.whatsapp.com/JG0bwECRN9lIysJUhQ59ro',
    level: 'PRINCIPIANTE',
  },
  {
    id: 2,
    title: 'Desarrollo de Videojuegos',
    subtitle: 'Desarrolla videojuegos completos con herramientas modernas',
    image: '/course-game-development.jpg',
    badge: 'EDUCACIÓN PRESENCIAL',
    startDate: 'Jue 15/07/2026',
    enrollmentDeadline: '2026-07-08',
    modality: 'Presencial',
    slug: 'desarrollo-de-videojuegos',
    description: 'El curso de Diseño y Desarrollo de Videojuegos ofrece una formación integral en las dinámicas fundamentales de la industria del entretenimiento digital. Utilizando Unity, el motor de desarrollo líder del mercado profesional a nivel global, los estudiantes aprenderán a estructurar las reglas, mecánicas y estéticas que componen un videojuego. El programa guía al alumno desde la conceptualización de ideas hasta la programación e implementación de entornos interactivos utilizando estándares profesionales.',
    schedule: 'Jueves: 16:30 a 18:00',
    location: 'ITS Villada, Valle Escondido',
    teacher: 'Jose Verino',
    teachers: [
      {
        name: 'Jose Verino',
        photo: '/teachers/jose-verino.jpg',
        description: '',
        linkedin: 'https://www.linkedin.com/in/jos%C3%A9-verino-3385b0212/'
      }
    ],
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
    whatsappGroup: '',
    level: 'PRINCIPIANTE',
  },
  {
    id: 3,
    title: 'Diseño e Impresión 3D',
    subtitle: 'Capacita en diseño 3D y fabricación mediante impresión 3D',
    image: '/course-3d-design.jpg',
    badge: 'EDUCACIÓN PRESENCIAL',
    startDate: 'Mar 3/06/2026',
    enrollmentDeadline: '2026-05-27',
    modality: 'Presencial',
    slug: 'diseno-impresion-3d',
    description: 'El curso de Diseño e Impresión 3D capacita al estudiante en las tecnologías de fabricación aditiva, un pilar fundamental de la industria 4.0. A lo largo del programa, se profundiza en todo el flujo de trabajo digital: desde la concepción geométrica de una pieza en un software de modelado paramétrico hasta su materialización física mediante la calibración precisa de maquinaria de impresión.',
    schedule: 'Martes: 16:30 a 18:00',
    location: 'ITS Villada, Valle Escondido',
    teacher: 'Santiago Henderson',
    teachers: [
      {
        name: 'Santiago Henderson',
        photo: '/teachers/santiago-henderson.jpg',
        description: '',
        linkedin: 'https://linkedin.com/in/santiago-henderson-779777180'
      }
    ],
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
    whatsappGroup: '',
    level: 'PRINCIPIANTE',
  },
  {
    id: 4,
    title: 'Mecánica de Motores',
    subtitle: 'Brindar conocimientos técnicos sobre funcionamiento de motores',
    image: '/course-automotive.jpg',
    badge: 'EDUCACIÓN PRESENCIAL',
    startDate: 'Mar 3/06/2026',
    enrollmentDeadline: '2026-05-27',
    modality: 'Presencial',
    slug: 'mecanica-de-motores',
    description: 'El trayecto formativo en Mecánica Automotriz brinda los conocimientos teóricos y prácticos indispensables para comprender el funcionamiento integral de los vehículos modernos. El programa aborda de manera rigurosa desde los principios termodinámicos de los motores de combustión interna hasta el diagnóstico técnico y la reparación de los sistemas de seguridad y transmisión automotriz.',
    schedule: 'Martes: 16:30 a 18:00',
    location: 'ITS Villada, Valle Escondido',
    teacher: 'Kevin Altamirano',
    teachers: [
      {
        name: 'Kevin Altamirano',
        photo: '/teachers/kevin-altamirano.jpg',
        description: '',
        linkedin: ''
      }
    ],
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
    whatsappGroup: '',
    level: 'PRINCIPIANTE',
  },
];
