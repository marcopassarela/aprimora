import React from 'react';
import { Home as HomeIcon, GraduationCap, BookOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <main className="container mx-auto px-4 py-16 animate-fadeIn" role="main">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-8 animate-slideDown" tabIndex={0}>
            Educação para Todos
          </h1>
          <p className="text-xl mb-12 animate-slideUp" tabIndex={0}>
            Promovendo educação inclusiva e de qualidade para um futuro melhor
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div 
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300"
              role="article"
              tabIndex={0}
            >
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-white" aria-hidden="true" />
              <h2 className="text-xl font-semibold mb-2">Educação Inclusiva</h2>
              <p className="text-gray-200">Garantindo acesso à educação para todos</p>
            </div>
            
            <div 
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300"
              role="article"
              tabIndex={0}
            >
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-white" aria-hidden="true" />
              <h2 className="text-xl font-semibold mb-2">Recursos Educacionais</h2>
              <p className="text-gray-200">Materiais acessíveis e adaptados</p>
            </div>
            
            <div 
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300"
              role="article"
              tabIndex={0}
            >
              <Users className="w-12 h-12 mx-auto mb-4 text-white" aria-hidden="true" />
              <h2 className="text-xl font-semibold mb-2">Comunidade</h2>
              <p className="text-gray-200">Aprendizagem colaborativa e inclusiva</p>
            </div>
          </div>
          
          <div className="mt-12 space-x-4">
            <Link 
              to="/about"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-gray-100 transition"
            >
              Saiba mais
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
