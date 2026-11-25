// Firma "Desarrollado por Autogestiva" de los pies de página (sobre fondo oscuro): pastilla con flecha para invitar a visitar autogestiva.com.ar.
export function CreatedBy() {
  return (
    <a
      href="https://www.autogestiva.com.ar"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Desarrollado por Autogestiva (se abre en una pestaña nueva)"
      className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full border [border-color:color-mix(in_srgb,currentColor_30%,transparent)] px-4 py-2 text-[13px] font-medium leading-none opacity-90 transition hover:-translate-y-0.5 hover:border-orange-500 hover:opacity-100 text-white/70"
    >
      <span>Desarrollado por</span>
      <svg viewBox="0 0 40 42" className="h-[1.6em] w-auto" aria-hidden="true"><path d="M0 40 L15.5 0 H24.5 L40 40 H30.5 L20 13 L9.5 40 Z" fill="currentColor" /><path transform="translate(-4.4 -6) scale(1.2)" d="M19 22 V37.5 l3.9-3.7 2.9 6 2.8-1.4-2.9-5.9 h5.3z" fill="#f97316" /></svg>
      <svg viewBox="0 0 24 24" className="h-[0.95em] w-auto opacity-60 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-orange-500 group-hover:opacity-100" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
    </a>
  );
}
