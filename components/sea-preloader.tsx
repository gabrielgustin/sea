"use client";

import React, { useEffect, useState } from "react";

interface SeaPreloaderProps {
  minimumLoadingTimeMs?: number; // Tiempo mínimo visible en milisegundos (2500ms recomendado)
}

export default function SeaPreloader({ minimumLoadingTimeMs = 2500 }: SeaPreloaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Bloquear el scroll del body mientras carga
    document.body.style.overflow = "hidden";

    const handleLoadingComplete = () => {
      // Desvanecer cargador
      setIsVisible(false);
      
      // Permitir el scroll nuevamente
      document.body.style.overflow = "";

      // Eliminar del DOM después de terminar la transición de desvanecimiento (800ms)
      const timeout = setTimeout(() => {
        setShouldRender(false);
      }, 800);

      return () => clearTimeout(timeout);
    };

    // Esperar a que la página cargue completa + un delay mínimo estético
    const loadTimer = setTimeout(() => {
      if (document.readyState === "complete") {
        handleLoadingComplete();
      } else {
        window.addEventListener("load", handleLoadingComplete);
      }
    }, minimumLoadingTimeMs);

    return () => {
      clearTimeout(loadTimer);
      window.removeEventListener("load", handleLoadingComplete);
      document.body.style.overflow = "";
    };
  }, [minimumLoadingTimeMs]);

  if (!shouldRender) return null;

  return (
    <div
      id="sea-preloader-wrapper"
      className={`fixed inset-0 flex items-center justify-center z-[99999] bg-[#090d16] transition-opacity duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
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

        /* 1. Dibujado de Órbitas */
        .sea-orbit {
          stroke-dasharray: 1200;
          stroke-dashoffset: 1200;
          animation: seaDrawStroke 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        @keyframes seaDrawStroke {
          to { stroke-dashoffset: 0; }
        }

        /* 2. Entrada y Brillo de Nodos */
        .sea-node {
          transform-origin: center;
          transform: scale(0);
          animation: seaPopNode 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .sea-node-1 { animation-delay: 0.1s; }
        .sea-node-2 { animation-delay: 0.3s; }
        .sea-node-3 { animation-delay: 0.45s; }

        @keyframes seaPopNode {
          0% { transform: scale(0); filter: drop-shadow(0 0 0px transparent); }
          80% { transform: scale(1.15); }
          100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5)); }
        }

        /* 3. Anillos de pulso concéntrico */
        .sea-pulse-ring {
          transform-origin: center;
          animation: seaRingExpand 2s ease-out infinite;
        }
        .sea-ring-1 { animation-delay: 0.3s; }
        .sea-ring-2 { animation-delay: 0.5s; }
        .sea-ring-3 { animation-delay: 0.7s; }

        @keyframes seaRingExpand {
          0% { transform: scale(0.6); opacity: 0.8; }
          50%, 100% { transform: scale(1.8); opacity: 0; }
        }

        /* 4. Entrada Desplazada hacia arriba de las Letras */
        .sea-letter {
          opacity: 0;
          transform: translateY(25px);
          animation: seaFadeUp 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .sea-letter-s { animation-delay: 0.4s; }
        .sea-letter-e { animation-delay: 0.5s; }
        .sea-letter-a { animation-delay: 0.6s; }

        @keyframes seaFadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* 5. Caída del Punto de la 'A' */
        .sea-dot {
          opacity: 0;
          transform: translateY(-80px);
          animation: seaDotDrop 1.4s cubic-bezier(0.25, 1.5, 0.5, 1) forwards;
          animation-delay: 0.7s;
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
          animation: seaDivider 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          animation-delay: 0.5s;
        }

        @keyframes seaDivider {
          to { transform: scaleX(1); }
        }
      `}} />

      {/* SVG del Logo de SEA */}
      <svg id="sea-preloader-svg" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
        <g>
          {/* Órbita Exterior: arco amplio que sube sobre el tope y desciende por la derecha */}
          <path 
            className="sea-orbit" 
            d="M 150,258 C 150,148 215,108 305,108 C 415,108 508,205 508,478" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="13" 
            strokeLinecap="round" 
          />
          {/* Órbita Interior: conecta el nodo izquierdo con el nodo medio */}
          <path 
            className="sea-orbit" 
            d="M 150,258 C 205,226 285,226 340,256" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="13" 
            strokeLinecap="round" 
          />
        </g>
        
        <g>
          {/* Nodos Orbitantes */}
          <g transform="translate(150, 258)">
            <circle className="sea-pulse-ring sea-ring-1" r="26" fill="#ffffff" opacity="0.3" />
            <circle className="sea-node sea-node-1" r="19" fill="#ffffff" />
          </g>
          <g transform="translate(305, 108)">
            <circle className="sea-pulse-ring sea-ring-2" r="26" fill="#ffffff" opacity="0.3" />
            <circle className="sea-node sea-node-2" r="19" fill="#ffffff" />
          </g>
          <g transform="translate(340, 256)">
            <circle className="sea-pulse-ring sea-ring-3" r="26" fill="#ffffff" opacity="0.3" />
            <circle className="sea-node sea-node-3" r="19" fill="#ffffff" />
          </g>
        </g>
        
        <g>
          {/* Siglas "SEA" en negrita sólida y uniforme */}
          <text 
            x="165" 
            y="445" 
            fontFamily="Montserrat, 'Geist', system-ui, -apple-system, sans-serif" 
            fontWeight="800" 
            fontSize="180" 
            fill="#ffffff" 
            textAnchor="middle" 
            className="sea-letter sea-letter-s select-none"
          >
            S
          </text>
          <text 
            x="280" 
            y="445" 
            fontFamily="Montserrat, 'Geist', system-ui, -apple-system, sans-serif" 
            fontWeight="800" 
            fontSize="180" 
            fill="#ffffff" 
            textAnchor="middle" 
            className="sea-letter sea-letter-e select-none"
          >
            E
          </text>
          <text 
            x="398" 
            y="445" 
            fontFamily="Montserrat, 'Geist', system-ui, -apple-system, sans-serif" 
            fontWeight="800" 
            fontSize="180" 
            fill="#ffffff" 
            textAnchor="middle" 
            className="sea-letter sea-letter-a select-none"
          >
            A
          </text>
          
          {/* Punto flotante dentro del contador de la 'A' */}
          <circle cx="398" cy="402" r="14" fill="#ffffff" className="sea-dot" />
          
          {/* Línea Organizadora Horizontal Inferior */}
          <line x1="95" y1="480" x2="470" y2="480" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" className="sea-divider" />
        </g>
      </svg>
    </div>
  );
}
