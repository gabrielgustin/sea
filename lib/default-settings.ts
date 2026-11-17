// Valores por defecto de un sitio nuevo. Cada cliente los reemplaza desde su panel (se guardan en su propia base).
export interface FAQ { id: number; question: string; answer: string; order: number }
export interface SiteSettings { instagramUrl: string; whatsappNumber: string; whatsappMessage: string; email: string; address: string }

export const defaultFAQs: FAQ[] = [
  {
    id: 1,
    question: '¿Cómo me inscribo a un curso?',
    answer: 'Para inscribirte, simplemente navega al curso de tu interés y haz clic en el botón "Inscribirme". Completa el formulario con tus datos y recibirás confirmación por email.',
    order: 1,
  },
  {
    id: 2,
    question: '¿Cuáles son las formas de pago?',
    answer: 'Aceptamos transferencias bancarias, Mercado Pago y pagos en efectivo en nuestra sede. Consulta con el equipo administrativo para planes de financiación.',
    order: 2,
  },
  {
    id: 3,
    question: '¿Otorgan certificados?',
    answer: 'Sí, todos nuestros cursos otorgan certificado oficial de la Secretaría de Extensión Académica del ITS Savio al completar satisfactoriamente el programa.',
    order: 3,
  },
  {
    id: 4,
    question: '¿Puedo tomar cursos si no soy estudiante del ITS Savio?',
    answer: 'Sí, nuestros cursos están abiertos a toda la comunidad. No es necesario ser estudiante del instituto para inscribirse.',
    order: 4,
  },
];

export const defaultSettings: SiteSettings = {
  instagramUrl: 'https://www.instagram.com/itssavio/?hl=es',
  whatsappNumber: '543513697444',
  whatsappMessage: 'Hola! Me interesa obtener más información sobre los cursos disponibles.',
  email: 'formaciones@portalsea.com.ar',
  address: 'Cno a La Calera km 7 1/2 Valle',
};

