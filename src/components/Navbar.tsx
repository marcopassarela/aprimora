import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, BookOpen, Phone } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  
  return (
    <nav 
      className="fixed top-0 left-0 right-0 bg-white/10 backdrop-blur-lg z-50" 
      role="navigation" 
      aria-label="Navegação principal"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="text-white font-bold text-xl flex items-center"
            aria-label="Ir para página inicial"
          >
            <GraduationCap className="w-6 h-6 mr-2" aria-hidden="true" />
            Educação para Todos
          </Link>
          
          <div className="flex space-x-8">
            <Link
              to="/"
              className={`text-white hover:text-pink-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-lg px-2 py-1 ${
                location.pathname === '/' ? 'border-b-2 border-white' : ''
              }`}
              aria-current={location.pathname === '/' ? 'page' : undefined}
            >
              Início
            </Link>
            <Link
              to="/about"
              className={`text-white hover:text-pink-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-lg px-2 py-1 ${
                location.pathname === '/about' ? 'border-b-2 border-white' : ''
              }`}
              aria-current={location.pathname === '/about' ? 'page' : undefined}
            >
              Sobre
            </Link>
            <Link
              to="/contact"
              className={`text-white hover:text-pink-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-lg px-2 py-1 ${
                location.pathname === '/contact' ? 'border-b-2 border-white' : ''
              }`}
              aria-current={location.pathname === '/contact' ? 'page' : undefined}
            >
              Contato
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}