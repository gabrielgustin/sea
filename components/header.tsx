'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LogIn, LogOut } from 'lucide-react';
import LoginModal from './login-modal';

export default function Header() {
  const [loginOpen, setLoginOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      <header className="w-full bg-white fixed md:static top-0 left-0 right-0 z-30 md:z-auto" style={{ borderBottom: '2px solid #08207f' }}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Desktop Logo */}
            <Link href="/" className="hidden md:flex items-center cursor-pointer hover:opacity-80 transition-opacity">
              <Image 
                src="/logo-portal-left.png" 
                alt="Portal SEA"
                width={160}
                height={100}
                className="h-16 w-auto object-contain"
                priority
              />
            </Link>

            {/* Center - Title for mobile */}
            <Link href="/" className="md:hidden flex-1 text-center cursor-pointer hover:opacity-80 transition-opacity">
              <h1 className="font-bold text-base text-foreground truncate">Extension Académica</h1>
            </Link>

            {/* Right Side - Logos Desktop + Login */}
            <div className="hidden md:flex items-center justify-end gap-4">
              <Image
                src="/logo-sea-bracket.png"
                alt="SEA Logo"
                width={80}
                height={80}
                className="h-14 w-auto object-contain"
              />
              <Image
                src="/logo-villada.png"
                alt="ITS Villada Logo"
                width={140}
                height={90}
                className="h-16 w-auto object-contain"
              />
              
              {/* Login/Logout Button */}
              <button
                onClick={isAuthenticated ? logout : () => setLoginOpen(true)}
                className="p-2 rounded-full transition-all duration-300 hover:bg-blue-50"
                title={isAuthenticated ? "Cerrar sesión" : "Iniciar sesión"}
              >
                {isAuthenticated ? (
                  <LogOut size={24} style={{ color: '#08207f' }} />
                ) : (
                  <LogIn size={24} style={{ color: '#08207f' }} />
                )}
              </button>
            </div>

            {/* Mobile Login Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={isAuthenticated ? logout : () => setLoginOpen(true)}
                className="p-2 rounded-full transition-all duration-300 hover:bg-blue-50"
              >
                {isAuthenticated ? (
                  <LogOut size={20} style={{ color: '#08207f' }} />
                ) : (
                  <LogIn size={20} style={{ color: '#08207f' }} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
