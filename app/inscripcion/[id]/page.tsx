import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InscripcionRedirect({ params }: PageProps) {
  const { id } = await params;
  redirect(`/savio/inscripcion/${id}`);
}
