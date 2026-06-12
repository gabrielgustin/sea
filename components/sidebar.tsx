'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Menu, Home, BookOpen, LogOut, LogIn } from 'lucide-react';
import Link from 'next/link';
import LoginModal from './login-modal';

const SIDEBAR_ITEMS = [
  { icon: Home, label: 'Home', href: '/villada' },
  { icon: BookOpen, label: 'Formaciones', href: '/villada/catalogo-formaciones' },
];

export default function Sidebar() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const handleAuthIconClick = () => {
    if (isAuthenticated) {
      router.push('/villada/admin');
    } else {
      setLoginOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <>
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />

      <div className="hidden md:fixed md:left-0 md:top-0 md:bottom-0 md:w-[10%] md:bg-white md:border-r md:border-gray-200 md:flex md:flex-col md:items-center md:pt-6 md:pb-6 md:gap-8 z-40">
        <div className="flex flex-col gap-6 flex-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex justify-center hover:opacity-70 transition-opacity">
                <Icon size={28} className="text-gray-800" />
              </Link>
            );
          })}
        </div>

        <button
          onClick={handleAuthIconClick}
          className="flex justify-center hover:opacity-70 transition-opacity"
          title={isAuthenticated ? 'Admin' : 'Iniciar Sesión'}
        >
          {isAuthenticated ? <LogOut size={28} className="text-gray-800" /> : <LogIn size={28} className="text-gray-800" />}
        </button>
      </div>

      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-gray-100">
          <Menu size={24} />
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)}>
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white flex flex-col p-6 gap-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsOpen(false)} className="self-end">
              ✕
            </button>
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <hr className="my-2" />
            {isAuthenticated ? (
              <>
                <Link
                  href="/villada/admin"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <LogOut size={20} />
                  <span>Admin</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 text-red-600 text-left">
                  <LogOut size={20} />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <button onClick={() => setLoginOpen(true)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">
                <LogIn size={20} />
                <span>Iniciar Sesión</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
