import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    accessibility: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-orange-500">
      <main className="container mx-auto px-4 py-16 animate-fadeIn" role="main">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-8 text-center text-white animate-slideDown" tabIndex={0}>Fale Conosco</h1>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div 
              className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white"
              role="complementary"
              tabIndex={0}
            >
              <h2 className="text-2xl font-semibold mb-6">Informações de Contato</h2>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 mr-4" aria-hidden="true" />
                  <span>Rua da Educação, 123 - Cidade</span>
                </div>
                
                <div className="flex items-center">
                  <Phone className="w-6 h-6 mr-4" aria-hidden="true" />
                  <span>+55 (11) 1234-5678</span>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-6 h-6 mr-4" aria-hidden="true" />
                  <span>educacao@exemplo.com</span>
                </div>
              </div>
            </div>
            
            <form 
              onSubmit={handleSubmit} 
              className="bg-white/10 backdrop-blur-lg rounded-xl p-8"
              role="form"
              aria-label="Formulário de contato"
            >
              <div className="mb-6">
                <label htmlFor="name" className="block text-white mb-2">Nome</label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:border-white focus:ring-2 focus:ring-white"
                  placeholder="Nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  aria-required="true"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-white mb-2">Email</label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:border-white focus:ring-2 focus:ring-white"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  aria-required="true"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="accessibility" className="block text-white mb-2">Necessidades de Acessibilidade</label>
                <select
                  id="accessibility"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-black border border-white/30 focus:outline-none focus:border-white focus:ring-2 focus:ring-white"
                  value={formData.accessibility}
                  onChange={(e) => setFormData({...formData, accessibility: e.target.value})}
                >
                  <option value="">Selecione uma opção</option>
                  <option value="visual">Deficiência Visual</option>
                  <option value="hearing">Deficiência Auditiva</option>
                  <option value="mobility">Deficiência Motora</option>
                  <option value="cognitive">Deficiência Cognitiva</option>
                  <option value="other">Outra</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-white mb-2">Mensagem</label>
                <textarea
                  id="message"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-black placeholder-white/60 border border-white/30 focus:outline-none focus:border-white focus:ring-2 focus:ring-white h-32"
                  placeholder="Sua mensagem"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                  aria-required="true"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-white text-pink-500 py-3 rounded-lg font-semibold flex items-center justify-center hover:bg-pink-100 transition-colors focus:ring-2 focus:ring-white focus:outline-none"
                aria-label="Enviar mensagem"
              >
                <Send className="w-5 h-5 mr-2" aria-hidden="true" />
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}