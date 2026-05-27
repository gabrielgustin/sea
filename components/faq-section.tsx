'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    id: 1,
    question: '¿Cómo puedo inscribirme en los programas?',
    answer: 'Para inscribirte en cualquiera de nuestros programas, solo debes ingresar a tu cuenta o crear una nueva. Luego selecciona el programa de tu interés y completa el formulario de inscripción. Recibirás una confirmación por correo electrónico.',
  },
  {
    id: 2,
    question: '¿Qué requisitos necesito para acceder a las formaciones?',
    answer: 'Los requisitos varían según el programa. Generalmente necesitas tener educación secundaria completa y cumplir con los prerrequisitos específicos de cada formación. Consulta los detalles de cada programa para más información.',
  },
  {
    id: 3,
    question: '¿Ofrece certificados válidos los cursos?',
    answer: 'Sí, todos nuestros programas otorgan certificados válidos y reconocidos. Los certificados de diplomatura son de mayor reconocimiento que los cursos simples y pueden ser cargados en tu curriculum vitae.',
  },
  {
    id: 4,
    question: '¿Cuál es la duración de los programas?',
    answer: 'La duración varía según el programa. Las diplomaturas suelen tener una duración de 4-6 meses, mientras que los cursos pueden ser más cortos (2-3 meses). Consulta el programa específico para conocer su duración exacta.',
  },
  {
    id: 5,
    question: '¿Hay opciones de financiamiento?',
    answer: 'Sí, ofrecemos opciones de financiamiento flexible. Contáctanos para conocer los planes disponibles y las promociones vigentes. También ofrecemos descuentos para grupos.',
  },
  {
    id: 6,
    question: '¿Qué apoyo técnico recibo durante el programa?',
    answer: 'Contarás con acceso a plataforma educativa 24/7, docentes disponibles para consultas, foros de discusión con compañeros, y material complementario. Nuestro equipo técnico está disponible para resolver cualquier inconveniente.',
  },
];

export default function FAQSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 overflow-x-hidden">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Preguntas Frecuentes</h2>
          <p className="text-lg text-muted-foreground">
            Encontrá respuestas a las preguntas más comunes sobre nuestros programas
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item) => (
            <AccordionItem key={item.id} value={`faq-${item.id}`}>
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="text-base font-semibold text-foreground">
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
