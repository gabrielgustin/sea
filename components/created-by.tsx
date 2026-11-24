
// Firma "Desarrollado por Autogestiva" de los pies de página (sobre fondo oscuro: el logo se muestra en blanco).
export function CreatedBy() {
  return (
    <a href="https://www.autogestiva.com.ar" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-sm text-white/60 transition hover:text-white" aria-label="Desarrollado por Autogestiva">
      <span>Desarrollado por</span>
      <svg viewBox="0 0 40 42" className="h-[1.3em] w-auto" role="img" aria-label="Autogestiva"><path d="M0 40 L15.5 0 H24.5 L40 40 H30.5 L20 13 L9.5 40 Z" fill="currentColor" /><path transform="translate(-4.4 -6) scale(1.2)" d="M19 22 V37.5 l3.9-3.7 2.9 6 2.8-1.4-2.9-5.9 h5.3z" fill="#f97316" /></svg>
    </a>
  );
}
