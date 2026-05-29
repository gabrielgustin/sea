import Image from 'next/image';

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-black fixed md:static top-0 left-0 right-0 z-30 md:z-auto">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Desktop Logo */}
          <div className="hidden md:flex items-center">
            <Image 
              src="/logo-portal-left.png" 
              alt="Portal SEA"
              width={160}
              height={100}
              className="h-16 w-auto object-contain"
              priority
            />
          </div>

          {/* Center - Title for mobile */}
          <div className="md:hidden flex-1 text-center">
            <h1 className="font-bold text-base text-foreground truncate">Extension Académica</h1>
          </div>

          {/* Right Side - Logos Desktop */}
          <div className="hidden md:flex items-center justify-end gap-1">
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
          </div>
        </div>
      </div>
    </header>
  );
}
