import React from 'react';
import { GraduationCap, Target, Award, BookOpen, Users, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500">
      <main className="container mx-auto px-4 py-16 animate-fadeIn" role="main">
        <div className="max-w-4xl mx-auto text-white">
          <h1 className="text-5xl font-bold mb-8 text-center animate-slideDown" tabIndex={0}>Nossa Missão Educacional</h1>
          
          <div className="mb-12">
            <img 
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80" 
              alt="Estudantes diversos em ambiente educacional inclusivo" 
              className="w-full h-64 object-cover rounded-xl mb-8"
            />
            
            <p className="text-lg mb-6 animate-slideUp" tabIndex={0}>
              Comprometidos com o Objetivo de Desenvolvimento Sustentável 4 (ODS4) da ONU, 
              trabalhamos para garantir educação inclusiva, equitativa e de qualidade, promovendo 
              oportunidades de aprendizagem ao longo da vida para todos.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div 
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300"
              role="article"
              tabIndex={0}
            >
              <GraduationCap className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-center">Educação Inclusiva</h3>
              <p className="text-gray-200 text-center">Garantindo acesso universal à educação de qualidade</p>
            </div>
            
            <div 
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300"
              role="article"
              tabIndex={0}
            >
              <Globe className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-center">Alcance Global</h3>
              <p className="text-gray-200 text-center">Impactando vidas através da educação em todo o mundo</p>
            </div>
            
            <div 
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300"
              role="article"
              tabIndex={0}
            >
              <BookOpen className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-center">Recursos Adaptados</h3>
              <p className="text-gray-200 text-center">Materiais educacionais acessíveis para todos</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}