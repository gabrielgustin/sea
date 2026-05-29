import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer id="contacto" className="bg-white text-gray-900 py-12 px-4 sm:px-6 lg:px-8" style={{ borderTop: '2px solid #08207f' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: '#08207f' }}>Extension Académica</h3>
            <p className="text-gray-600 text-sm">
              Portal de extensión académica dedicado a formar profesionales con excelencia y compromiso social.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#08207f' }}>Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-blue-900 transition-colors" style={{ color: '#08207f' }}>Inicio</a></li>
              <li><a href="#programas" className="text-gray-600 hover:text-blue-900 transition-colors" style={{ color: '#08207f' }}>Programas</a></li>
              <li><a href="#noticias" className="text-gray-600 hover:text-blue-900 transition-colors" style={{ color: '#08207f' }}>Noticias</a></li>
              <li><a href="#formaciones" className="text-gray-600 hover:text-blue-900 transition-colors" style={{ color: '#08207f' }}>Formaciones</a></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#08207f' }}>Información</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#08207f' }} />
                <span className="text-gray-600">Planta Baja Edificio Central</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#08207f' }} />
                <span className="text-gray-600">+54 (0) 3514 480676</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#08207f' }} />
                <span className="text-gray-600">contacto@extension.edu.ar</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#08207f' }}>Síguenos</h4>
            <div className="flex gap-4">
              <a href="#" className="transition-colors" style={{ color: '#08207f' }} aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="transition-colors" style={{ color: '#08207f' }} aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="transition-colors" style={{ color: '#08207f' }} aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="transition-colors" style={{ color: '#08207f' }} aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="pt-8" style={{ borderTop: '1px solid #9cbadb' }}>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-600 text-center md:text-left">
              &copy; 2026 Extension Académica. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0 text-sm text-gray-600">
              <a href="#" className="hover:text-blue-900 transition-colors" style={{ color: '#08207f' }}>Privacidad</a>
              <a href="#" className="hover:text-blue-900 transition-colors" style={{ color: '#08207f' }}>Términos</a>
              <a href="#" className="hover:text-blue-900 transition-colors" style={{ color: '#08207f' }}>Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
