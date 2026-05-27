'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">EA</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">Extension Académica</h1>
              <p className="text-xs text-muted-foreground">Portal Universitario</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors">Inicio</a>
            <a href="#programas" className="text-foreground hover:text-primary transition-colors">Programas</a>
            <a href="#noticias" className="text-foreground hover:text-primary transition-colors">Noticias</a>
            <a href="#formaciones" className="text-foreground hover:text-primary transition-colors">Formaciones</a>
            <a href="#contacto" className="text-foreground hover:text-primary transition-colors">Contacto</a>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline">Ingresar</Button>
            <Button>Registrarse</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-4">
            <a href="#" className="text-foreground hover:text-primary transition-colors">Inicio</a>
            <a href="#programas" className="text-foreground hover:text-primary transition-colors">Programas</a>
            <a href="#noticias" className="text-foreground hover:text-primary transition-colors">Noticias</a>
            <a href="#formaciones" className="text-foreground hover:text-primary transition-colors">Formaciones</a>
            <a href="#contacto" className="text-foreground hover:text-primary transition-colors">Contacto</a>
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <Button variant="outline" className="w-full">Ingresar</Button>
              <Button className="w-full">Registrarse</Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
