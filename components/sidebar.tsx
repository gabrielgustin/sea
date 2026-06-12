'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Home, BookOpen, Instagram, Mail, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import Link from 'next/link';
import LoginModal from './login-modal';

export default function Sidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [showLoginAnimation, setShowLoginAnimation] = useState(false);
  const [showAuthIconAnimation, setShowAuthIconAnimation] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { settings } = useSiteSettings();

  const publicNavItems = [
    { icon: Home, label: 'Inicio', href: '/' },
    { icon: BookOpen, label: 'Formaciones', href: '/villada/catalogo-formaciones' },
    { icon: Mail, label: 'Contacto', href: '#contacto', scroll: true },
    { icon: Instagram, label: 'Instagram', href: settings.instagramUrl },
  ];

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.querySelector('#contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    setShowLoginAnimation(false);
    setShowAuthIconAnimation(true);
    setTimeout(() => {
      setShowAuthIconAnimation(false);
      logout();
    }, 400);
  };

  useEffect(() => {
    if (isAuthenticated) {
      setShowAuthIconAnimation(true);
      setTimeout(() => setShowAuthIconAnimation(false), 400);
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setShowLoginAnimation(true);
    setTimeout(() => setShowLoginAnimation(false), 600);
  };

  const handleAuthIconClick = () => {
    if (isAuthenticated) {
      router.push('/villada/admin');
    } else {
      setLoginOpen(true);
    }
  };

  // Icon size for consistency
  const iconSize = 28;

  return (
    <>
      {/* Desktop Sidebar - Responsive, centered, professional */}
      <aside 
        className="hidden md:flex fixed left-0 top-0 h-screen w-[10%] bg-white z-40 flex-col items-center justify-center px-3" 
        style={{ borderRight: '2px solid #031e41' }}
      >
        <nav className="flex flex-col items-center gap-10">
          {/* Navigation Items */}
          {publicNavItems.map((item, index) => {
            const Icon = item.icon;
            const isExternal = item.href.startsWith('http');
            const isScroll = (item as any).scroll;
            
            if (isExternal) {
              return (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center p-3 transition-all duration-300 group relative rounded-xl hover:bg-blue-50"
                  title={item.label}
                >
                  <Icon size={iconSize} className="transition-all duration-300 group-hover:scale-110" style={{ color: '#031e41' }} />
                  <span className="absolute left-16 bg-gradient-to-r text-white px-4 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none font-semibold translate-x-2 group-hover:translate-x-0" style={{ backgroundImage: 'linear-gradient(135deg, #031e41 0%, #617587 100%)' }}>
                    {item.label}
                  </span>
                </a>
              );
            }
            
            if (isScroll) {
              return (
                <button
                  key={index}
                  onClick={handleContactClick}
                  className="flex justify-center items-center p-3 transition-all duration-300 group relative rounded-xl hover:bg-blue-50"
                  title={item.label}
                >
                  <Icon size={iconSize} className="transition-all duration-300 group-hover:scale-110" style={{ color: '#031e41' }} />
                  <span className="absolute left-16 bg-gradient-to-r text-white px-4 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none font-semibold translate-x-2 group-hover:translate-x-0" style={{ backgroundImage: 'linear-gradient(135deg, #031e41 0%, #617587 100%)' }}>
                    {item.label}
                  </span>
                </button>
              );
            }
            
            return (
              <Link
                key={index}
                href={item.href}
                className="flex justify-center items-center p-3 transition-all duration-300 group relative rounded-xl hover:bg-blue-50"
                title={item.label}
              >
                <Icon size={iconSize} className="transition-all duration-300 group-hover:scale-110" style={{ color: '#031e41' }} />
                <span className="absolute left-16 bg-gradient-to-r text-white px-4 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none font-semibold translate-x-2 group-hover:translate-x-0" style={{ backgroundImage: 'linear-gradient(135deg, #031e41 0%, #617587 100%)' }}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Login/Admin Button */}
          <button
            onClick={handleAuthIconClick}
            className="flex justify-center items-center p-3 transition-all duration-300 group relative rounded-xl hover:bg-blue-50"
            title={isAuthenticated ? "Panel de Administración" : "Iniciar sesión"}
          >
            {isAuthenticated ? (
              <LogOut size={iconSize} className="transition-all duration-300 group-hover:scale-110" style={{ color: '#031e41' }} />
            ) : (
              <LogIn size={iconSize} className="transition-all duration-300 group-hover:scale-110" style={{ color: '#031e41' }} />
            )}
            <span className="absolute left-16 bg-gradient-to-r text-white px-4 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none font-semibold translate-x-2 group-hover:translate-x-0" style={{ backgroundImage: 'linear-gradient(135deg, #031e41 0%, #617587 100%)' }}>
              {isAuthenticated ? "Panel de Admin" : "Iniciar sesión"}
            </span>
          </button>

        </nav>
      </aside>

      {/* Mobile Hamburger Button - Hidden */}
      {/* Hamburger menu hidden for improved mobile UX */}

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white z-45 flex flex-col items-center transition-all duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ borderRight: '2px solid #031e41' }}
      >
        <nav className="flex flex-col items-center gap-10 w-full">
          {/* Navigation Items */}
          {publicNavItems.map((item, index) => {
            const Icon = item.icon;
            const isExternal = item.href.startsWith('http');
            const isScroll = (item as any).scroll;
            
            if (isExternal) {
              return (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-all duration-200 rounded group"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={iconSize} className="transition-all duration-300 group-hover:scale-110" style={{ color: '#031e41' }} />
                  <span className="text-sm font-medium" style={{ color: '#031e41' }}>{item.label}</span>
                </a>
              );
            }
            
            if (isScroll) {
              return (
                <button
                  key={index}
                  onClick={(e) => {
                    handleContactClick(e);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-all duration-200 rounded group w-full"
                >
                  <Icon size={iconSize} className="transition-all duration-300 group-hover:scale-110" style={{ color: '#031e41' }} />
                  <span className="text-sm font-medium" style={{ color: '#031e41' }}>{item.label}</span>
                </button>
              );
            }
            
            return (
              <Link
                key={index}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-all duration-200 rounded group"
                onClick={() => setIsOpen(false)}
              >
                <Icon size={iconSize} className="transition-all duration-300 group-hover:scale-110" style={{ color: '#031e41' }} />
                <span className="text-sm font-medium" style={{ color: '#031e41' }}>{item.label}</span>
              </Link>
            );
          })}

          {/* Login/Admin Button */}
          <button
            onClick={handleAuthIconClick}
            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-all duration-200 rounded group w-full"
          >
            {isAuthenticated ? (
              <LogOut size={iconSize} className="transition-all duration-300 group-hover:scale-110" style={{ color: '#031e41' }} />
            ) : (
              <LogIn size={iconSize} className="transition-all duration-300 group-hover:scale-110" style={{ color: '#031e41' }} />
            )}
            <span className="text-sm font-medium" style={{ color: '#031e41' }}>
              {isAuthenticated ? "Panel de Admin" : "Iniciar sesión"}
            </span>
          </button>
        </nav>
      </aside>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} onLoginSuccess={handleLoginSuccess} />
    </>
  );
}
