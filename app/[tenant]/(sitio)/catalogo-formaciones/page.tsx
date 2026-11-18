import FormacionesCatalog from '@/components/formaciones-catalog';

export const metadata = {
  title: 'Catálogo de formaciones',
  description: 'Explorá todos nuestros cursos y programas de formación disponibles.',
};

export default function CatalogoFormacionesRoute() {
  return <FormacionesCatalog />;
}
