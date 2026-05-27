import Image from 'next/image';

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-black fixed md:static top-0 left-0 right-0 z-30 md:z-auto">
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
            <h1 className="font-bold text-base text-foreground truncate">Extension Académica</h1>
          </div>

          {/* Right Side - Auth Buttons & Logo Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-black text-black rounded hover:bg-gray-100 transition-colors font-medium text-sm whitespace-nowrap">
                Ingresar
              </button>
              <button className="px-4 py-2 text-white rounded hover:opacity-90 transition-opacity font-medium text-sm whitespace-nowrap" style={{ backgroundColor: '#28235c' }}>
                Registrarse
              </button>
            </div>
            <Image
              src="/logo-boutique.png"
              alt="ITS Boutique Logo"
              width={100}
              height={60}
              className="h-12 w-auto object-contain ml-4"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
