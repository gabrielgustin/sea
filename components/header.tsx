'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-white fixed md:static top-0 left-0 right-0 z-30 md:z-auto" style={{ borderBottom: '2px solid #031e41' }}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Desktop Logo */}
          <Link href="/" className="hidden md:flex items-center cursor-pointer hover:opacity-80 transition-opacity">
            <Image 
              src="/logo-portal-sea.png" 
              alt="Portal SEA"
              width={200}
              height={100}
              className="h-16 w-auto object-contain"
              priority
            />
          </Link>

          {/* Center - Title and Logo for mobile */}
          <Link href="/" className="md:hidden flex-1 flex items-center justify-center gap-3 cursor-pointer hover:opacity-80 transition-opacity pl-12">
            <Image 
              src="/logo-sea.png" 
              alt="SEA Logo"
              width={40}
              height={40}
              className="h-10 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-wide" style={{ color: '#031e41' }}>Portal SEA</span>
              <span className="text-xs font-medium" style={{ color: '#617587' }}>Extension Académica</span>
            </div>
          </Link>

          {/* Right Side - Logos Desktop */}
          <div className="hidden md:flex items-center justify-end gap-1">
            <Image
              src="/logo-sea.png"
              alt="SEA Logo"
              width={100}
              height={100}
              className="h-16 w-auto object-contain"
            />
            <Image
              src="/logo-villada.png"
              alt="ITS Villada Logo"
              width={140}
              height={90}
              className="h-16 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
