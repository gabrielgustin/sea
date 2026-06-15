import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { nanoid } from 'nanoid'

export async function POST() {
  try {
    console.log('[v0] Seeding database with Savio data...')

    // Carousel slides
    const carouselSlides = [
      {
        title: 'Diseño e Impresión 3D',
        subtitle: 'Crea tus propios modelos',
        image: '/images/carousel-3d.jpg',
        badge: 'NUEVO',
        ctaText: 'Ver más',
        order: 0,
      },
      {
        title: 'Formaciones Profesionales',
        subtitle: 'Prepárate para el futuro',
        image: '/images/carousel-formaciones.jpg',
        badge: 'DISPONIBLE',
        ctaText: 'Explorar',
        order: 1,
      },
      {
        title: 'Centro de Innovación',
        subtitle: 'Tecnología y aprendizaje',
        image: '/images/carousel-centro.jpg',
        badge: 'DESTACADO',
        ctaText: 'Conocer más',
        order: 2,
      },
    ]

    // Insert carousel slides
    for (const slide of carouselSlides) {
      await pool.query(
        `INSERT OR IGNORE INTO carousel_slides (id, title, subtitle, image, badge, ctaText, \`order\`, active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
        [nanoid(), slide.title, slide.subtitle, slide.image, slide.badge, slide.ctaText, slide.order]
      )
    }

    // Courses
    const courses = [
      {
        id: 'diseno-3d',
        title: 'Diseño e Impresión 3D',
        subtitle: 'Crea y materializa tus ideas',
        description: 'Curso completo de diseño e impresión 3D. Aprenderás a usar software de modelado, preparación de archivos y técnicas de impresión.',
        badge: 'PRESENCIAL',
        price: '$3.500/mes',
        duration: '8 semanas',
        schedule: 'Lunes y Miércoles 18:00 - 20:00',
        location: 'Centro de Innovación, ITS Savio',
        teacher: 'Ing. Carlos Martínez',
      },
      {
        id: 'python-aplicaciones',
        title: 'Desarrollo de Aplicaciones con Python',
        subtitle: 'Aprende programación desde cero',
        description: 'Programa integral de Python orientado a la creación de aplicaciones de escritorio y web.',
        badge: 'PRESENCIAL',
        price: '$3.000/mes',
        duration: '12 semanas',
        schedule: 'Martes y Jueves 19:00 - 20:30',
        location: 'Aula de Informática, ITS Savio',
        teacher: 'Lic. Gabriel Muñoz',
      },
      {
        id: 'electronica-arduino',
        title: 'Electrónica y Arduino',
        subtitle: 'Proyectos electrónicos prácticos',
        description: 'Iniciación en electrónica analógica, digital y microcontroladores Arduino.',
        badge: 'PRESENCIAL',
        price: '$2.800/mes',
        duration: '10 semanas',
        schedule: 'Viernes 17:00 - 19:00',
        location: 'Laboratorio de Electrónica, ITS Savio',
        teacher: 'Ing. Roberto López',
      },
    ]

    // Insert courses
    for (const course of courses) {
      await pool.query(
        `INSERT OR IGNORE INTO courses (id, title, subtitle, description, badge, price, duration, schedule, location, teacher, slug, level, status, showOnHome) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PRINCIPIANTE', 'ACTIVE', 1)`,
        [course.id, course.title, course.subtitle, course.description, course.badge, course.price, course.duration, course.schedule, course.location, course.teacher, course.id]
      )
    }

    return NextResponse.json({ success: true, message: 'Data seeded successfully' })
  } catch (error) {
    console.error('[v0] Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed data', details: error.message }, { status: 500 })
  }
}
