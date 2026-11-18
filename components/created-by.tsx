import Image from 'next/image';

// Firma "Created by Autogestiva" de los pies de página (sobre fondo oscuro: el logo se muestra en blanco).
export function CreatedBy() {
  return (
    <a href="https://www.autogestiva.com.ar" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-sm text-white/60 transition hover:text-white" aria-label="Created by Autogestiva">
      <span>Created by</span>
      <Image src="/autogestiva.webp" alt="" width={120} height={42} className="h-11 w-auto opacity-80 brightness-0 invert transition group-hover:opacity-100" />
    </a>
  );
}
