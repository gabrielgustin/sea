'use client';

import { useState } from 'react';
import { Menu, X, Home, BookOpen, Instagram, Mail } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Inicio', href: '#' },
    { icon: BookOpen, label: 'Formaciones', href: '#formaciones' },
    { icon: Mail, label: 'Contacto', href: '#contacto' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
  ];

  return (
    <>
      {/* Desktop Sidebar - Fixed 10% width */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[10%] bg-white border border-black z-40 flex-col items-center pt-[85px] pb-[100px] px-3 gap-6">
        {/* Navigation Icons */}
        <nav className="flex flex-col gap-6 w-full flex-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className="flex justify-center items-center p-3 hover:bg-blue-50 transition-all duration-300 group relative hover:scale-110 active:scale-95"
                title={item.label}
              >
                <Icon size={24} className="transition-all duration-300" style={{ color: '#08207f' }} />
                <span className="absolute left-24 bg-black text-white px-3 py-2 rounded text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none font-medium">
                  {item.label}
                </span>
              </a>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed left-0 top-0 z-50 p-4 hover:bg-gray-100 border-r border-b border-black bg-white transition-colors duration-200"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} className="transition-all duration-300" style={{ color: '#08207f' }} /> : <Menu size={24} className="transition-all duration-300" style={{ color: '#08207f' }} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-black z-45 flex flex-col pt-20 pb-8 px-6 transition-all duration-300 md:hidden ${
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
                className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-all duration-200 text-foreground rounded group"
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} className="transition-all duration-300 group-hover:scale-110" style={{ color: '#08207f' }} />
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="w-full h-px bg-black mb-6" />
      </aside>
    </>
  );
}
