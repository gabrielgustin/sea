import { NextRequest, NextResponse } from 'next/server';

export interface CarouselSlide {
  id: string;
  title: string;
  description: string;
  startDate: string;
  duration: string;
  modality: string;
  image: string;
  redirectSlug: string;
}

// Almacenamiento simulado en memoria
let carouselSlides: CarouselSlide[] = [
  {
    id: '1',
    title: 'Introducción a la Robótica',
    description: 'Aprende los fundamentos de robótica y automatización',
    startDate: '27 de junio, 2026',
    duration: '40 horas (10 encuentros)',
    modality: 'Modalidad Presencial',
    image: '/carousel/robotics.png',
    redirectSlug: 'introduccion-robotica'
  },
  {
    id: '2',
    title: 'Desarrollo de Aplicaciones Web Modernas',
    description: 'Crea aplicaciones web profesionales con tecnología moderna',
    startDate: '4 de junio, 2026',
    duration: '6 meses',
    modality: 'Educación Presencial',
    image: '/carousel/web-development.png',
    redirectSlug: 'desarrollo-de-aplicaciones'
  },
  {
    id: '3',
    title: 'Diseño e Impresión 3D',
    description: 'Domina el diseño 3D y la impresión de modelos',
    startDate: '4 de junio, 2026',
    duration: '6 meses',
    modality: 'Educación Presencial',
    image: '/carousel/3d-design.png',
    redirectSlug: 'diseno-impresion-3d'
  },
  {
    id: '4',
    title: 'Desarrollo de Videojuegos',
    description: 'Crea videojuegos profesionales desde cero',
    startDate: '4 de junio, 2026',
    duration: '6 meses',
    modality: 'Educación Presencial',
    image: '/carousel/game-development.png',
    redirectSlug: 'desarrollo-de-videojuegos'
  }
];

// GET: Obtener todos los slides del carrusel
export async function GET() {
  try {
    return NextResponse.json({ slides: carouselSlides });
  } catch (error) {
    console.error('Error fetching carousel slides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch carousel slides' },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo slide
export async function POST(request: NextRequest) {
  try {
    const newSlide = await request.json();

    if (!newSlide.title || !newSlide.redirectSlug) {
      return NextResponse.json(
        { error: 'Title and redirectSlug are required' },
        { status: 400 }
      );
    }

    const slide: CarouselSlide = {
      id: String(Date.now()),
      title: newSlide.title,
      description: newSlide.description || '',
      startDate: newSlide.startDate || '',
      duration: newSlide.duration || '',
      modality: newSlide.modality || '',
      image: newSlide.image || '/carousel/placeholder.png',
      redirectSlug: newSlide.redirectSlug
    };

    carouselSlides.push(slide);
    return NextResponse.json({ success: true, slide });
  } catch (error) {
    console.error('Error creating carousel slide:', error);
    return NextResponse.json(
      { error: 'Failed to create carousel slide' },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un slide
export async function PUT(request: NextRequest) {
  try {
    const { id, ...updatedData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Slide ID is required' },
        { status: 400 }
      );
    }

    const slideIndex = carouselSlides.findIndex(slide => slide.id === id);
    
    if (slideIndex === -1) {
      return NextResponse.json(
        { error: 'Slide not found' },
        { status: 404 }
      );
    }

    carouselSlides[slideIndex] = {
      ...carouselSlides[slideIndex],
      ...updatedData
    };

    return NextResponse.json({ success: true, slide: carouselSlides[slideIndex] });
  } catch (error) {
    console.error('Error updating carousel slide:', error);
    return NextResponse.json(
      { error: 'Failed to update carousel slide' },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un slide
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Slide ID is required' },
        { status: 400 }
      );
    }

    const slideIndex = carouselSlides.findIndex(slide => slide.id === id);
    
    if (slideIndex === -1) {
      return NextResponse.json(
        { error: 'Slide not found' },
        { status: 404 }
      );
    }

    carouselSlides.splice(slideIndex, 1);
    return NextResponse.json({ success: true, message: 'Slide deleted' });
  } catch (error) {
    console.error('Error deleting carousel slide:', error);
    return NextResponse.json(
      { error: 'Failed to delete carousel slide' },
      { status: 500 }
    );
  }
}
