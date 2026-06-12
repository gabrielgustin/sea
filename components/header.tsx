'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-white fixed md:static top-0 left-0 right-0 z-30 md:z-auto" style={{ borderBottom: '2px solid #031e41' }}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-28">
          {/* Desktop Logo - SEA */}
          <Link href="/savio" className="hidden md:flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <Image 
              src="/logo-sea.png" 
              alt="SEA Logo"
              width={110}
              height={110}
              className="h-20 w-auto object-contain"
              priority
            />
          </Link>

          {/* Mobile - Logo SEA Left */}
          <Link href="/savio" className="md:hidden flex items-center cursor-pointer hover:opacity-80 transition-opacity">
            <Image 
              src="/logo-sea.png" 
              alt="SEA Logo"
              width={48}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Mobile - Logo Savio Right */}
          <div className="md:hidden flex items-center justify-end">
            <Image 
              src="/logo-savio.png" 
              alt="Colegio Domingo Savio Logo"
              width={80}
              height={60}
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* Desktop - Right Side Logo */}
          <div className="hidden md:flex items-center justify-end gap-0">
            <Image
              src="/logo-savio.png"
              alt="Colegio Domingo Savio Logo"
              width={200}
              height={120}
              className="h-20 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
