'use client';

import { useState } from 'react';
import { Menu, X, Home, BookOpen, Briefcase, Instagram, Youtube, Mail } from 'lucide-react';

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
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-24 bg-white border-r border-black z-40 flex-col items-center py-6 px-3 gap-6">
        {/* Navigation Icons */}
        <nav className="flex flex-col gap-6 w-full flex-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className="flex justify-center items-center p-3 hover:bg-gray-100 transition-colors group relative"
                title={item.label}
              >
                <Icon size={24} className="text-black" />
                <span className="absolute left-24 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {item.label}
                </span>
              </a>
            );
          })}
        </nav>

        {/* Bottom Divider */}
        <div className="w-full h-px bg-black" />
      </aside>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed left-0 top-0 z-50 p-4 hover:bg-gray-100 border-r border-b border-black bg-white"
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

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-black z-45 flex flex-col pt-20 pb-8 px-6 transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation */}
        <nav className="flex flex-col gap-3 w-full mb-8 flex-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors text-foreground"
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
        <div className="flex flex-col gap-3">
          <button className="px-4 py-2 border border-black text-black rounded hover:bg-gray-100 transition-colors font-medium text-sm">
            Ingresar
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors font-medium text-sm">
            Registrarse
          </button>
        </div>
      </aside>
    </>
  );
}
