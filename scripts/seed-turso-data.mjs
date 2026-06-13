#!/usr/bin/env node

import { createClient } from '@libsql/client'
import { nanoid } from 'nanoid'

const connectionUrl = process.env.TURSO_CONNECTION_URL
const authToken = process.env.TURSO_AUTH_TOKEN

if (!connectionUrl || !authToken) {
  console.error('[v0] Error: Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN')
  process.exit(1)
}

const db = createClient({
  url: connectionUrl,
  authToken: authToken,
})

async function seedData() {
  try {
    console.log('[v0] Seeding Turso database with Villada courses and carousel...\n')

    // Carousel slides
    const carouselSlides = [
      {
        id: nanoid(),
        title: 'Diseño e Impresión 3D',
        subtitle: 'Crea tus propios modelos',
        image: '/images/carousel-3d.jpg',
        badge: 'NUEVO',
        ctaText: 'Ver más',
        ctaLink: '/villada/cursos/diseno-3d',
        order: 0,
        active: 1,
      },
      {
        id: nanoid(),
        title: 'Formaciones Profesionales',
        subtitle: 'Prepárate para el futuro',
        image: '/images/carousel-formaciones.jpg',
        badge: 'DISPONIBLE',
        ctaText: 'Explorar',
        ctaLink: '/villada/catalogo-formaciones',
        order: 1,
        active: 1,
      },
      {
        id: nanoid(),
        title: 'Centro de Innovación',
        subtitle: 'Tecnología y aprendizaje',
        image: '/images/carousel-centro.jpg',
        badge: 'DESTACADO',
        ctaText: 'Conocer más',
        ctaLink: '/villada/centro-innovacion',
        order: 2,
        active: 1,
      },
    ]

    // Courses
    const courses = [
      {
        id: 'diseno-3d',
        title: 'Diseño e Impresión 3D',
        subtitle: 'Crea y materializa tus ideas',
        description: 'Curso completo de diseño e impresión 3D. Aprenderás a usar software de modelado, preparación de archivos y técnicas de impresión. Ideal para estudiantes, emprendedores y profesionales que quieran incursionar en esta tecnología.',
        badge: 'PRESENCIAL',
        status: 'ACTIVE',
        category: 'Tecnología',
        image: '/images/courses/3d-design.jpg',
        price: '$3.500/mes',
        duration: '8 semanas',
        startDate: '2024-07-01',
        enrollmentDeadline: '2024-06-30',
        schedule: 'Lunes y Miércoles 18:00 - 20:00',
        location: 'Centro de Innovación, ITS Villada',
        teacher: 'Ing. Carlos Martínez',
        modality: 'PRESENCIAL',
        slug: 'diseno-3d',
        level: 'PRINCIPIANTE',
        objective: 'Capacitar a los estudiantes en el diseño digital y fabricación aditiva, permitiéndoles crear prototipos funcionales y productos innovadores.',
        methodology: 'Clases teóricas combinadas con prácticas hands-on. Trabajo en proyectos reales.',
        finalProject: 'Diseño e impresión de un proyecto personal completo',
        requirements: 'Nociones básicas de computación. Edad mínima: 16 años',
        maxStudents: 15,
        modules: JSON.stringify([
          { number: '01', title: 'Introducción a la Impresión 3D', topics: ['Tecnologías de impresión', 'Materiales y filamentos', 'Calibración de máquinas'] },
          { number: '02', title: 'Modelado 3D con Fusion 360', topics: ['Interfaz y herramientas', 'Creación de sketches', 'Extrusiones y operaciones booleanas'] },
          { number: '03', title: 'Preparación para Impresión', topics: ['Slicing y configuración', 'Soportes y relleno', 'Optimización de tiempo y material'] },
          { number: '04', title: 'Post-procesamiento y Acabados', topics: ['Limpieza de piezas', 'Pintado y teñido', 'Ensamblaje y acabados profesionales'] },
        ]),
        showOnHome: 1,
      },
      {
        id: 'python-aplicaciones',
        title: 'Desarrollo de Aplicaciones con Python',
        subtitle: 'Aprende programación desde cero',
        description: 'Programa integral de Python orientado a la creación de aplicaciones de escritorio y web. Desde conceptos fundamentales hasta proyectos complejos.',
        badge: 'PRESENCIAL',
        status: 'ACTIVE',
        category: 'Programación',
        image: '/images/courses/python.jpg',
        price: '$3.000/mes',
        duration: '12 semanas',
        startDate: '2024-07-15',
        enrollmentDeadline: '2024-07-14',
        schedule: 'Martes y Jueves 19:00 - 20:30',
        location: 'Aula de Informática, ITS Villada',
        teacher: 'Lic. Gabriel Muñoz',
        modality: 'PRESENCIAL',
        slug: 'python-aplicaciones',
        level: 'PRINCIPIANTE',
        objective: 'Formar profesionales capacitados en desarrollo de software con Python, capaces de crear aplicaciones funcionales y escalables.',
        methodology: 'Metodología activa basada en proyectos. Resolución de problemas del mundo real.',
        finalProject: 'Aplicación funcional con interfaz gráfica',
        requirements: 'Edad mínima: 15 años. Conocimientos básicos de computación.',
        maxStudents: 20,
        modules: JSON.stringify([
          { number: '01', title: 'Fundamentos de Programación', topics: ['Tipos de datos', 'Variables y operadores', 'Estructuras de control'] },
          { number: '02', title: 'Funciones y Módulos', topics: ['Definición de funciones', 'Parámetros y retorno', 'Importación de módulos'] },
          { number: '03', title: 'Programación Orientada a Objetos', topics: ['Clases y objetos', 'Herencia y polimorfismo', 'Encapsulación'] },
          { number: '04', title: 'Interfaz Gráfica con Tkinter', topics: ['Widgets básicos', 'Layouts y eventos', 'Aplicación final'] },
        ]),
        showOnHome: 1,
      },
      {
        id: 'electronica-arduino',
        title: 'Electrónica y Arduino',
        subtitle: 'Proyectos electrónicos prácticos',
        description: 'Iniciación en electrónica analógica, digital y microcontroladores Arduino. Crea proyectos interactivos desde lo más simple hasta soluciones automatizadas.',
        badge: 'PRESENCIAL',
        status: 'ACTIVE',
        category: 'Electrónica',
        image: '/images/courses/arduino.jpg',
        price: '$2.800/mes',
        duration: '10 semanas',
        startDate: '2024-08-01',
        enrollmentDeadline: '2024-07-31',
        schedule: 'Viernes 17:00 - 19:00',
        location: 'Laboratorio de Electrónica, ITS Villada',
        teacher: 'Ing. Roberto López',
        modality: 'PRESENCIAL',
        slug: 'electronica-arduino',
        level: 'PRINCIPIANTE',
        objective: 'Capacitar en electrónica básica y programación de microcontroladores para crear prototipos funcionales.',
        methodology: 'Enfoque práctico con kits Arduino. Proyectos progresivos del simple al complejo.',
        finalProject: 'Proyecto Arduino autónomo',
        requirements: 'Edad mínima: 14 años. Sin requisitos previos.',
        maxStudents: 12,
        modules: JSON.stringify([
          { number: '01', title: 'Conceptos Básicos de Electrónica', topics: ['Voltaje, corriente y resistencia', 'Ley de Ohm', 'Circuitos en serie y paralelo'] },
          { number: '02', title: 'Arduino: Primeros Pasos', topics: ['Placa Arduino', 'IDE de programación', 'LEDs y botones'] },
          { number: '03', title: 'Sensores y Actuadores', topics: ['Sensores analógicos', 'Motores', 'Displays LCD'] },
          { number: '04', title: 'Proyectos Integrados', topics: ['Sistemas automatizados', 'IoT básico', 'Proyectos finales'] },
        ]),
        showOnHome: 1,
      },
      {
        id: 'diseno-grafico',
        title: 'Diseño Gráfico Digital',
        subtitle: 'Adobe Creative Suite',
        description: 'Domina las herramientas profesionales de diseño gráfico. Photoshop, Illustrator e InDesign para proyectos reales.',
        badge: 'PRESENCIAL',
        status: 'ACTIVE',
        category: 'Diseño',
        image: '/images/courses/design.jpg',
        price: '$3.200/mes',
        duration: '10 semanas',
        startDate: '2024-08-15',
        enrollmentDeadline: '2024-08-14',
        schedule: 'Lunes y Viernes 19:00 - 20:30',
        location: 'Sala de Diseño, ITS Villada',
        teacher: 'Lic. Ana Pérez',
        modality: 'PRESENCIAL',
        slug: 'diseno-grafico',
        level: 'PRINCIPIANTE',
        objective: 'Formar diseñadores gráficos competentes en software profesional, capaces de crear contenido visual de calidad.',
        methodology: 'Proyecto-based learning. Trabajos reales desde la primera clase.',
        finalProject: 'Portafolio de diseño profesional',
        requirements: 'Conocimientos básicos de computadora. Edad mínima: 16 años.',
        maxStudents: 18,
        modules: JSON.stringify([
          { number: '01', title: 'Adobe Photoshop Essentials', topics: ['Interfaz y herramientas', 'Capas', 'Selecciones y máscaras'] },
          { number: '02', title: 'Adobe Illustrator', topics: ['Dibujo vectorial', 'Herramientas de pluma', 'Tipografía'] },
          { number: '03', title: 'Maquetación con InDesign', topics: ['Documentos y mesas de trabajo', 'Tipografía avanzada', 'Exportación'] },
          { number: '04', title: 'Proyectos Profesionales', topics: ['Identidad corporativa', 'Publicidades', 'Portfolios digitales'] },
        ]),
        showOnHome: 0,
      },
    ]

    // Teachers
    const teachers = [
      { id: nanoid(), name: 'Ing. Carlos Martínez', description: '15 años en impresión 3D', image: '/images/teachers/carlos.jpg', courseId: 'diseno-3d', order: 0, active: 1 },
      { id: nanoid(), name: 'Lic. Gabriel Muñoz', description: 'Desarrollador senior de software', image: '/images/teachers/gabriel.jpg', courseId: 'python-aplicaciones', order: 0, active: 1 },
      { id: nanoid(), name: 'Ing. Roberto López', description: 'Especialista en IoT y automatización', image: '/images/teachers/roberto.jpg', courseId: 'electronica-arduino', order: 0, active: 1 },
      { id: nanoid(), name: 'Lic. Ana Pérez', description: 'Diseñadora gráfica profesional', image: '/images/teachers/ana.jpg', courseId: 'diseno-grafico', order: 0, active: 1 },
    ]

    // Insert carousel slides
    console.log('[v0] Adding carousel slides...')
    for (const slide of carouselSlides) {
      await db.execute(
        `INSERT OR IGNORE INTO carousel_slides (id, title, subtitle, image, badge, ctaText, ctaLink, \`order\`, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [slide.id, slide.title, slide.subtitle, slide.image, slide.badge, slide.ctaText, slide.ctaLink, slide.order, slide.active]
      )
    }
    console.log(`[v0] ✅ Added ${carouselSlides.length} carousel slides`)

    // Insert courses
    console.log('[v0] Adding courses...')
    for (const course of courses) {
      await db.execute(
        `INSERT OR IGNORE INTO courses (id, title, subtitle, description, badge, status, category, image, price, duration, startDate, enrollmentDeadline, schedule, location, teacher, modality, slug, level, objective, methodology, finalProject, requirements, maxStudents, modules, showOnHome) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          course.id, course.title, course.subtitle, course.description, course.badge, course.status, course.category, course.image, course.price, course.duration, course.startDate, course.enrollmentDeadline, course.schedule, course.location, course.teacher, course.modality, course.slug, course.level, course.objective, course.methodology, course.finalProject, course.requirements, course.maxStudents, course.modules, course.showOnHome,
        ]
      )
    }
    console.log(`[v0] ✅ Added ${courses.length} courses`)

    // Insert teachers
    console.log('[v0] Adding teachers...')
    for (const teacher of teachers) {
      await db.execute(
        `INSERT OR IGNORE INTO teachers (id, name, description, image, courseId, \`order\`, active) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [teacher.id, teacher.name, teacher.description, teacher.image, teacher.courseId, teacher.order, teacher.active]
      )
    }
    console.log(`[v0] ✅ Added ${teachers.length} teachers`)

    // Verify data
    console.log('\n[v0] Verification:')
    const carouselCount = await db.execute(`SELECT COUNT(*) as count FROM carousel_slides WHERE active = 1`)
    console.log(`  - Active carousel slides: ${carouselCount.rows[0].count}`)

    const courseCount = await db.execute(`SELECT COUNT(*) as count FROM courses`)
    console.log(`  - Total courses: ${courseCount.rows[0].count}`)

    const teacherCount = await db.execute(`SELECT COUNT(*) as count FROM teachers`)
    console.log(`  - Total teachers: ${teacherCount.rows[0].count}`)

    console.log('\n[v0] ✅ Database seeding complete!')
  } catch (error) {
    console.error('[v0] Error:', error.message)
    process.exit(1)
  }
}

seedData()
