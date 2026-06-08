"use client";

import React, { useEffect, useState } from "react";

interface SeaPreloaderProps {
  minimumLoadingTimeMs?: number; // Tiempo mínimo visible en milisegundos
}

export default function SeaPreloader({ minimumLoadingTimeMs = 1400 }: SeaPreloaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Verificar si el preloader ya se ha mostrado en esta sesión
    if (typeof window === 'undefined') return;

    const preloaderShown = sessionStorage.getItem('sea-preloader-shown') === 'true';
    
    if (preloaderShown) {
      // Si ya se mostró, no renderizar
      setShouldRender(false);
      setHasShown(true);
      return;
    }

    setHasShown(false);
  }, []);

  useEffect(() => {
    // Si ya se mostró el preloader o no debería renderizar, salir
    if (hasShown || !shouldRender) return;

    // Bloquear el scroll del body mientras carga
    document.body.style.overflow = "hidden";

    const handleLoadingComplete = () => {
      // Marcar que el preloader ya fue mostrado
      sessionStorage.setItem('sea-preloader-shown', 'true');
      
      // Desvanecer cargador
      setIsVisible(false);
      
      // Permitir el scroll nuevamente
      document.body.style.overflow = "";

      // Eliminar del DOM después de terminar la transición de desvanecimiento (500ms)
      const timeout = setTimeout(() => {
        setShouldRender(false);
      }, 500);

      return () => clearTimeout(timeout);
    };

    // Si el documento ya está completamente cargado, ejecutar inmediatamente
    if (document.readyState === "complete") {
      const timer = setTimeout(handleLoadingComplete, minimumLoadingTimeMs);
      return () => clearTimeout(timer);
    }

    // Si no, esperar al evento load
    const loadTimer = setTimeout(() => {
      window.addEventListener("load", handleLoadingComplete);
    }, minimumLoadingTimeMs);

    return () => {
      clearTimeout(loadTimer);
      window.removeEventListener("load", handleLoadingComplete);
      document.body.style.overflow = "";
    };
  }, [minimumLoadingTimeMs, hasShown, shouldRender]);

  if (!shouldRender) return null;

  return (
    <div
      id="sea-preloader-wrapper"
      className={`fixed inset-0 flex items-center justify-center z-[99999] bg-[#090d16] transition-opacity duration-[500ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Estilos CSS encapsulados de animación local */}
      <style dangerouslySetInnerHTML={{ __html: `
        #sea-preloader-svg {
          width: 100%;
          max-width: 320px;
          height: auto;
        }

        /* 1. Entrada Desplazada hacia arriba de las Letras */
        .sea-letter {
          opacity: 0;
          transform: translateY(25px);
          animation: seaFadeUp 0.7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .sea-letter-s { animation-delay: 0.15s; }
        .sea-letter-e { animation-delay: 0.25s; }
        .sea-letter-a { animation-delay: 0.35s; }

        @keyframes seaFadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* 5. Caída del Punto de la 'A' */
        .sea-dot {
          opacity: 0;
          transform: translateY(-80px);
          animation: seaDotDrop 0.8s cubic-bezier(0.25, 1.5, 0.5, 1) forwards;
          animation-delay: 0.4s;
        }

        @keyframes seaDotDrop {
          0% { opacity: 0; transform: translateY(-80px); }
          80% { transform: translateY(0); opacity: 1; }
          90% { transform: translateY(-4px); }
          100% { transform: translateY(0); opacity: 1; }
        }

        /* 6. Despliegue de la Línea Organizadora */
        .sea-divider {
          transform-origin: left;
          transform: scaleX(0);
          animation: seaDivider 0.7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          animation-delay: 0.25s;
        }

        @keyframes seaDivider {
          to { transform: scaleX(1); }
        }
      `}} />

      {/* SVG del Logo de SEA */}
      <svg id="sea-preloader-svg" viewBox="0 0 600 530" xmlns="http://www.w3.org/2000/svg">
        <g>
          {/* Siglas "SEA" */}
          <text 
            x="185" 
            y="340" 
            fontFamily="system-ui, -apple-system, sans-serif" 
            fontWeight="700" 
            fontSize="185" 
            fill="#ffffff" 
            textAnchor="middle" 
            className="sea-letter sea-letter-s select-none"
          >
            S
          </text>
          <text 
            x="300" 
            y="340" 
            fontFamily="system-ui, -apple-system, sans-serif" 
            fontWeight="700" 
            fontSize="185" 
            fill="#ffffff" 
            textAnchor="middle" 
            className="sea-letter sea-letter-e select-none"
          >
            E
          </text>

          {/* Polígono de la letra "A" */}
          <polygon 
            points="364,340 420,205 476,340 452,340 420,263 388,340" 
            fill="#ffffff" 
            className="sea-letter sea-letter-a" 
          />

          {/* Punto flotante interior de la 'A' */}
          <circle cx="420" cy="305" r="12" fill="#ffffff" className="sea-dot" />

          {/* Línea horizontal inferior */}
          <line x1="130" y1="370" x2="460" y2="370" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" className="sea-divider" />
        </g>
      </svg>
    </div>
  );
}
