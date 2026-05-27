import Image from 'next/image';

export default function Header() {
  return (
    <header className="w-full bg-white border-b-2 border-black md:border-l-2">
      <div className="w-full px-4 sm:px-6 lg:px-8 pl-4 md:pl-28">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Desktop Logo - Only show on desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Image 
              src="/logo-seu.png" 
              alt="PORTAL SEU"
              width={200}
              height={80}
              className="h-16 w-auto object-contain"
              priority
            />
          </div>

          {/* Center - Title for mobile */}
          <div className="md:hidden flex-1 text-center">
            <h1 className="font-bold text-base text-foreground">Extension Académica</h1>
            <p className="text-xs text-muted-foreground">Portal Universitario</p>
          </div>

          {/* Right Side - Auth Buttons Desktop */}
          <div className="hidden md:flex items-center gap-4 ml-auto">
            <button className="px-4 py-2 border-2 border-black text-black rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm">
              Ingresar
            </button>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm">
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
