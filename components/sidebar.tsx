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
      {/* Hamburger Button - Desktop positioned */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-0 top-0 z-50 p-4 md:hidden hover:bg-gray-100 border-r border-b border-black bg-white"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} className="text-black" /> : <Menu size={24} className="text-black" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          'hidden md:flex fixed left-0 top-0 h-screen w-24 bg-white border-r-2 border-black z-35 flex-col items-center py-8 px-3 gap-8'
        )}
      >
        {/* Desktop Logo Mini */}
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">EA</span>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-black" />

        {/* Navigation Icons */}
        <nav className="flex flex-col gap-6 w-full">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className="flex justify-center items-center p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-primary group relative"
                title={item.label}
              >
                <Icon size={20} className="flex-shrink-0 text-black" />
                <span className="absolute left-20 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {item.label}
                </span>
              </a>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="w-full h-px bg-black mt-auto" />
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-white border-r-2 border-black z-45 flex flex-col items-start pt-16 pb-8 px-6 transition-transform duration-300 md:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile Logo and Title */}
        <div className="mb-8 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">EA</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">Extension Académica</h1>
              <p className="text-xs text-muted-foreground">Portal Universitario</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-black mb-6" />

        {/* Navigation */}
        <nav className="flex flex-col gap-4 w-full mb-8">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-foreground hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} className="text-black" />
                <span className="text-sm">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="w-full h-px bg-black mb-6" />

        {/* Auth Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button className="w-full px-4 py-2 border-2 border-black text-black rounded-lg hover:bg-gray-100 transition-colors font-medium">
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
