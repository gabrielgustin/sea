'use client';

import { useState } from 'react';
import { Menu, X, Home, BookOpen, Instagram, Mail, Settings, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import LoginModal from './login-modal';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const navItems = [
    { icon: Home, label: 'Inicio', href: '/' },
    { icon: BookOpen, label: 'Formaciones', href: '/#formaciones' },
    { icon: Mail, label: 'Contacto', href: '/#contacto' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
    ...(isAuthenticated ? [{ icon: Settings, label: 'Admin', href: '/admin' }] : []),
  ];

  return (
    <>
      {/* Desktop Sidebar - Fixed 10% width */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[10%] bg-white z-40 flex-col items-center pt-[85px] pb-[100px] px-3 gap-6" style={{ borderRight: '2px solid #08207f' }}>
        {/* Navigation Icons */}
        <nav className="flex flex-col gap-6 w-full flex-1 justify-center">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isExternal = item.href.startsWith('http');
            
            return isExternal ? (
              <a
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center p-3 transition-all duration-300 group relative rounded-xl hover:bg-blue-50"
                style={{
                  backgroundColor: 'transparent',
                  cursor: 'pointer'
                }}
                title={item.label}
              >
                <Icon size={24} className="transition-all duration-300 group-hover:scale-110 relative z-10" style={{ color: '#08207f' }} />
                <span className="absolute left-24 bg-gradient-to-r text-white px-4 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none font-semibold shadow-blue-lg translate-x-2 group-hover:translate-x-0" style={{ backgroundImage: 'linear-gradient(135deg, #08207f 0%, #1a4d99 100%)' }}>
                  {item.label}
                </span>
              </a>
            ) : (
              <Link
                key={index}
                href={item.href}
                className="flex justify-center items-center p-3 transition-all duration-300 group relative rounded-xl hover:bg-blue-50"
                style={{
                  backgroundColor: 'transparent',
                  cursor: 'pointer'
                }}
                title={item.label}
              >
                <Icon size={24} className="transition-all duration-300 group-hover:scale-110 relative z-10" style={{ color: '#08207f' }} />
                <span className="absolute left-24 bg-gradient-to-r text-white px-4 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none font-semibold shadow-blue-lg translate-x-2 group-hover:translate-x-0" style={{ backgroundImage: 'linear-gradient(135deg, #08207f 0%, #1a4d99 100%)' }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Login/Logout Button */}
        <button
          onClick={isAuthenticated ? logout : () => setLoginOpen(true)}
          className="flex justify-center items-center p-3 transition-all duration-300 group relative rounded-xl hover:bg-blue-50"
          style={{
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
          title={isAuthenticated ? "Cerrar sesión" : "Iniciar sesión"}
        >
          {isAuthenticated ? (
            <LogOut size={24} className="transition-all duration-300 group-hover:scale-110 relative z-10" style={{ color: '#08207f' }} />
          ) : (
            <LogIn size={24} className="transition-all duration-300 group-hover:scale-110 relative z-10" style={{ color: '#08207f' }} />
          )}
          <span className="absolute left-24 bg-gradient-to-r text-white px-4 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none font-semibold shadow-blue-lg translate-x-2 group-hover:translate-x-0" style={{ backgroundImage: 'linear-gradient(135deg, #08207f 0%, #1a4d99 100%)' }}>
            {isAuthenticated ? "Cerrar sesión" : "Iniciar sesión"}
          </span>
        </button>
      </aside>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed left-0 top-0 z-50 p-4 hover:bg-gray-100 bg-white transition-colors duration-200"
        style={{ borderRight: '2px solid #08207f', borderBottom: '2px solid #08207f' }}
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
        className={`fixed left-0 top-0 h-screen w-64 bg-white z-45 flex flex-col pt-20 pb-8 px-6 transition-all duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ borderRight: '2px solid #08207f' }}
      >
        {/* Navigation */}
        <nav className="flex flex-col gap-3 w-full mb-8 flex-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isExternal = item.href.startsWith('http');
            
            return isExternal ? (
              <a
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-all duration-200 text-foreground rounded group"
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} className="transition-all duration-300 group-hover:scale-110" style={{ color: '#08207f' }} />
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            ) : (
              <Link
                key={index}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-all duration-200 text-foreground rounded group"
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} className="transition-all duration-300 group-hover:scale-110" style={{ color: '#08207f' }} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="w-full h-px mb-6" style={{ backgroundColor: '#9cbadb' }} />

        {/* Mobile Login/Logout Button */}
        <button
          onClick={isAuthenticated ? logout : () => setLoginOpen(true)}
          className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-all duration-200 text-foreground rounded group w-full"
        >
          {isAuthenticated ? (
            <LogOut size={20} className="transition-all duration-300 group-hover:scale-110" style={{ color: '#08207f' }} />
          ) : (
            <LogIn size={20} className="transition-all duration-300 group-hover:scale-110" style={{ color: '#08207f' }} />
          )}
          <span className="text-sm font-medium">{isAuthenticated ? "Cerrar sesión" : "Iniciar sesión"}</span>
        </button>
      </aside>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
