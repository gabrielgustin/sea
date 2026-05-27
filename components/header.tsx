export default function Header() {
  return (
    <header className="w-full bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pl-20 md:pl-32">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">EA</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">Extension Académica</h1>
              <p className="text-xs text-muted-foreground">Portal Universitario</p>
            </div>
          </div>

          {/* Right Side - Auth Buttons Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <button className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium text-sm">
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
