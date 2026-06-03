'use client';

import { useState } from 'react';
import { Menu, X, Home, BookOpen, Instagram, Mail, Settings, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import LoginModal from './login-modal';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [showLoginAnimation, setShowLoginAnimation] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const publicNavItems = [
    { icon: Home, label: 'Inicio', href: '/' },
    { icon: BookOpen, label: 'Formaciones', href: '/#formaciones' },
    { icon: Mail, label: 'Contacto', href: '/#contacto' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
  ];

  const handleLogout = () => {
    setShowLoginAnimation(false);
    logout();
  };

  const handleLoginSuccess = () => {
    setShowLoginAnimation(true);
    setTimeout(() => setShowLoginAnimation(false), 600);
  };

  return (
    <>
      {/* Desktop Sidebar - Fixed 10% width */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[10%] bg-white z-40 flex-col items-center pt-[85px] pb-[100px] px-3 gap-6" style={{ borderRight: '2px solid #031e41' }}>
        
        {/* Navigation Items - Top */}
        <nav className="flex flex-col gap-6 w-full">
          {publicNavItems.map((item, index) => {
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
                <Icon size={24} className="transition-all duration-300 group-hover:scale-110 relative z-10" style={{ color: '#031e41' }} />
                <span className="absolute left-24 bg-gradient-to-r text-white px-4 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none font-semibold shadow-blue-lg translate-x-2 group-hover:translate-x-0" style={{ backgroundImage: 'linear-gradient(135deg, #031e41 0%, #617587 100%)' }}>
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
                <Icon size={24} className="transition-all duration-300 group-hover:scale-110 relative z-10" style={{ color: '#031e41' }} />
                <span className="absolute left-24 bg-gradient-to-r text-white px-4 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none font-semibold shadow-blue-lg translate-x-2 group-hover:translate-x-0" style={{ backgroundImage: 'linear-gradient(135deg, #031e41 0%, #617587 100%)' }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Login/Logout Button - Close to Instagram */}
        <button
          onClick={isAuthenticated ? handleLogout : () => setLoginOpen(true)}
          className="flex justify-center items-center p-3 transition-all duration-300 group relative rounded-xl hover:bg-blue-50"
          style={{
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
          title={isAuthenticated ? "Cerrar sesión" : "Iniciar sesión"}
        >
          {isAuthenticated ? (
            <LogOut size={24} className="transition-all duration-300 group-hover:scale-110 relative z-10" style={{ color: '#031e41' }} />
          ) : (
            <LogIn size={24} className="transition-all duration-300 group-hover:scale-110 relative z-10" style={{ color: '#031e41' }} />
          )}
          <span className="absolute left-24 bg-gradient-to-r text-white px-4 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none font-semibold shadow-blue-lg translate-x-2 group-hover:translate-x-0" style={{ backgroundImage: 'linear-gradient(135deg, #031e41 0%, #617587 100%)' }}>
            {isAuthenticated ? "Cerrar sesión" : "Iniciar sesión"}
          </span>
        </button>

        {/* Spacer - Bottom filler */}
        <div className="flex-1" />

        {/* Admin Icon - Bottom (when authenticated) with animation */}
        {isAuthenticated && (
          <Link
            href="/admin"
            className={`flex justify-center items-center p-3 transition-all duration-300 group relative rounded-xl hover:bg-blue-50 ${showLoginAnimation ? 'animate-slide-down-bounce' : ''}`}
            style={{
              backgroundColor: 'transparent',
              cursor: 'pointer'
            }}
            title="Admin"
          >
            <Settings size={24} className="transition-all duration-300 group-hover:scale-110 relative z-10" style={{ color: '#031e41' }} />
            <span className="absolute left-24 bg-gradient-to-r text-white px-4 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none font-semibold shadow-blue-lg translate-x-2 group-hover:translate-x-0" style={{ backgroundImage: 'linear-gradient(135deg, #031e41 0%, #617587 100%)' }}>
              Admin
            </span>
          </Link>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Login/Logout Button - Bottom (hidden to preserve layout) */}
        <button
          onClick={isAuthenticated ? handleLogout : () => setLoginOpen(true)}
          className="flex justify-center items-center p-3 transition-all duration-300 group relative rounded-xl hover:bg-blue-50 invisible"
          style={{
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
          title={isAuthenticated ? "Cerrar sesión" : "Iniciar sesión"}
        >
          {isAuthenticated ? (
            <LogOut size={24} className="transition-all duration-300 group-hover:scale-110 relative z-10" style={{ color: '#031e41' }} />
          ) : (
            <LogIn size={24} className="transition-all duration-300 group-hover:scale-110 relative z-10" style={{ color: '#031e41' }} />
          )}
          <span className="absolute left-24 bg-gradient-to-r text-white px-4 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none font-semibold shadow-blue-lg translate-x-2 group-hover:translate-x-0" style={{ backgroundImage: 'linear-gradient(135deg, #031e41 0%, #617587 100%)' }}>
            {isAuthenticated ? "Cerrar sesión" : "Iniciar sesión"}
          </span>
        </button>
      </aside>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed left-0 top-0 z-50 p-4 hover:bg-gray-100 bg-white transition-colors duration-200"
        style={{ borderRight: '2px solid #031e41', borderBottom: '2px solid #031e41' }}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} className="transition-all duration-300" style={{ color: '#031e41' }} /> : <Menu size={24} className="transition-all duration-300" style={{ color: '#031e41' }} />}
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
        className={`fixed left-0 top-0 h-screen w-64 bg-white z-45 flex flex-col items-center justify-center pt-0 pb-0 px-6 transition-all duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ borderRight: '2px solid #031e41' }}
      >
        {/* All Navigation Items - Centered Container */}
        <div className="flex flex-col gap-8 items-center w-full h-full justify-center">
          {/* Navigation Links */}
          <nav className="flex flex-col gap-8 w-full items-center">
            {publicNavItems.map((item, index) => {
              const Icon = item.icon;
              const isExternal = item.href.startsWith('http');
              
              return isExternal ? (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-4 py-3 hover:bg-blue-50 transition-all duration-200 text-foreground rounded group"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={20} className="transition-all duration-300 group-hover:scale-110" style={{ color: '#031e41' }} />
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              ) : (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center justify-center gap-3 px-4 py-3 hover:bg-blue-50 transition-all duration-200 text-foreground rounded group"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={20} className="transition-all duration-300 group-hover:scale-110" style={{ color: '#031e41' }} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Login/Logout Button - Centered */}
          <button
            onClick={isAuthenticated ? handleLogout : () => setLoginOpen(true)}
            className="flex items-center justify-center gap-3 px-4 py-3 hover:bg-blue-50 transition-all duration-200 text-foreground rounded group"
          >
            {isAuthenticated ? (
              <LogOut size={20} className="transition-all duration-300 group-hover:scale-110" style={{ color: '#031e41' }} />
            ) : (
              <LogIn size={20} className="transition-all duration-300 group-hover:scale-110" style={{ color: '#031e41' }} />
            )}
            <span className="text-sm font-medium">{isAuthenticated ? 'Cerrar sesión' : 'Iniciar sesión'}</span>
          </button>

          {/* Admin Link - Centered */}
          {isAuthenticated && (
            <Link
              href="/admin"
              className={`flex items-center justify-center gap-3 px-4 py-3 hover:bg-blue-50 transition-all duration-200 text-foreground rounded group ${showLoginAnimation ? 'animate-slide-down-bounce' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <Settings size={20} className="transition-all duration-300 group-hover:scale-110" style={{ color: '#031e41' }} />
              <span className="text-sm font-medium">Admin</span>
            </Link>
          )}
        </div>
      </aside>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} onLoginSuccess={handleLoginSuccess} />
    </>
  );
}
