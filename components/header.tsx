import Image from 'next/image';

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-black md:border-l border-black">
      <div className="w-full px-4 sm:px-6 lg:px-8 pl-4 md:pl-28">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Desktop Logo */}
          <div className="hidden md:flex items-center">
            <Image 
              src="/logo.png" 
              alt="Extension Académica"
              width={140}
              height={60}
              className="h-14 w-auto object-contain"
              priority
            />
          </div>

          {/* Center - Title for mobile */}
          <div className="md:hidden flex-1 text-center">
            <h1 className="font-bold text-base text-foreground">Extension Académica</h1>
          </div>

          {/* Right Side - Auth Buttons Desktop */}
          <div className="hidden md:flex items-center gap-4 ml-auto">
            <button className="px-4 py-2 border border-black text-black rounded hover:bg-gray-100 transition-colors font-medium text-sm">
              Ingresar
            </button>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors font-medium text-sm">
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
