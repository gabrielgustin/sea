'use client';

import { useState } from 'react';
import { Menu, X, Home, BookOpen, Briefcase, Instagram, Youtube, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Inicio', href: '#' },
    { icon: BookOpen, label: 'Formaciones', href: '#formaciones' },
    { icon: Briefcase, label: 'Programas', href: '#programas' },
    { icon: Mail, label: 'Contacto', href: '#contacto' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
    { icon: Youtube, label: 'YouTube', href: 'https://youtube.com' },
  ];

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-0 top-0 z-40 p-3 md:p-4 hover:bg-muted transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-white border-r border-border z-35 flex flex-col items-center pt-20 pb-8 px-4 transition-transform duration-300 md:translate-x-0 md:border-l md:border-r-0 md:w-24 md:items-center',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'md:relative md:translate-x-0'
        )}
      >
        {/* Desktop Logo */}
        <div className="hidden md:flex flex-col items-center gap-4 py-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">EA</span>
          </div>
        </div>

        {/* Mobile Logo and Title */}
        <div className="md:hidden mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">EA</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">Extension Académica</h1>
              <p className="text-xs text-muted-foreground">Portal Universitario</p>
            </div>
          </div>
        </div>

        {/* Navigation Icons */}
        <nav className="flex flex-col gap-6 md:gap-8 w-full">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className="flex md:justify-center items-center gap-3 md:gap-0 px-4 py-3 md:py-4 rounded-lg hover:bg-muted transition-colors text-foreground hover:text-primary group"
                title={item.label}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setIsOpen(false);
                  }
                }}
              >
                <Icon size={24} className="flex-shrink-0" />
                <span className="md:hidden">{item.label}</span>
                <span className="hidden md:block absolute left-20 bg-foreground text-background px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {item.label}
                </span>
              </a>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="md:hidden my-8 w-full h-px bg-border" />

        {/* Auth Buttons Mobile */}
        <div className="md:hidden w-full flex flex-col gap-3">
          <button className="w-full px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium">
            Ingresar
          </button>
          <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
            Registrarse
          </button>
        </div>
      </aside>
    </>
  );
}
