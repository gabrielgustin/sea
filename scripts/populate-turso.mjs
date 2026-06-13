import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function seedData() {
  try {
    console.log('[v0] Starting to seed Turso data...')

    // Carousel slides
    console.log('[v0] Adding carousel slides...')
    await client.execute(`
      INSERT OR IGNORE INTO carousel_slides (id, title, subtitle, image, badge, ctaText, "order", active) VALUES
      ('slide-001', 'Diseño e Impresión 3D', 'Crea tus propios modelos', '/images/carousel-3d.jpg', 'NUEVO', 'Ver más', 0, 1),
      ('slide-002', 'Formaciones Profesionales', 'Prepárate para el futuro', '/images/carousel-formaciones.jpg', 'DISPONIBLE', 'Explorar', 1, 1),
      ('slide-003', 'Centro de Innovación', 'Tecnología y aprendizaje', '/images/carousel-centro.jpg', 'DESTACADO', 'Conocer más', 2, 1)
    `)

    // Courses
    console.log('[v0] Adding courses...')
    await client.execute(`
      INSERT OR IGNORE INTO courses (id, title, subtitle, description, badge, status, category, price, duration, schedule, location, teacher, modality, slug, level, showOnHome) VALUES
      ('diseno-3d', 'Diseño e Impresión 3D', 'Crea y materializa tus ideas', 'Curso completo de diseño e impresión 3D. Aprenderás a usar software de modelado, preparación de archivos y técnicas de impresión.', 'PRESENCIAL', 'ACTIVE', 'Tecnología', '$3.500/mes', '8 semanas', 'Lunes y Miércoles 18:00 - 20:00', 'Centro de Innovación, ITS Villada', 'Ing. Carlos Martínez', 'PRESENCIAL', 'diseno-3d', 'PRINCIPIANTE', 1),
      ('python-aplicaciones', 'Desarrollo de Aplicaciones con Python', 'Aprende programación desde cero', 'Programa integral de Python orientado a la creación de aplicaciones de escritorio y web.', 'PRESENCIAL', 'ACTIVE', 'Programación', '$3.000/mes', '12 semanas', 'Martes y Jueves 19:00 - 20:30', 'Aula de Informática, ITS Villada', 'Lic. Gabriel Muñoz', 'PRESENCIAL', 'python-aplicaciones', 'PRINCIPIANTE', 1),
      ('electronica-arduino', 'Electrónica y Arduino', 'Proyectos electrónicos prácticos', 'Iniciación en electrónica analógica, digital y microcontroladores Arduino.', 'PRESENCIAL', 'ACTIVE', 'Electrónica', '$2.800/mes', '10 semanas', 'Viernes 17:00 - 19:00', 'Laboratorio de Electrónica, ITS Villada', 'Ing. Roberto López', 'PRESENCIAL', 'electronica-arduino', 'PRINCIPIANTE', 1),
      ('diseno-grafico', 'Diseño Gráfico Digital', 'Adobe Creative Suite', 'Domina las herramientas profesionales de diseño gráfico. Photoshop, Illustrator e InDesign para proyectos reales.', 'PRESENCIAL', 'ACTIVE', 'Diseño', '$3.200/mes', '10 semanas', 'Lunes y Viernes 19:00 - 20:30', 'Sala de Diseño, ITS Villada', 'Lic. Ana Pérez', 'PRESENCIAL', 'diseno-grafico', 'PRINCIPIANTE', 0)
    `)

    // Teachers
    console.log('[v0] Adding teachers...')
    await client.execute(`
      INSERT OR IGNORE INTO teachers (id, name, description, courseId, "order", active) VALUES
      ('teacher-001', 'Ing. Carlos Martínez', '15 años en impresión 3D', 'diseno-3d', 0, 1),
      ('teacher-002', 'Lic. Gabriel Muñoz', 'Desarrollador senior de software', 'python-aplicaciones', 0, 1),
      ('teacher-003', 'Ing. Roberto López', 'Especialista en IoT y automatización', 'electronica-arduino', 0, 1),
      ('teacher-004', 'Lic. Ana Pérez', 'Diseñadora gráfica profesional', 'diseno-grafico', 0, 1)
    `)

    console.log('[v0] ✅ Data seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('[v0] Error seeding data:', error)
    process.exit(1)
  }
}

seedData()
