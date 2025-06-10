import React, { useState } from 'react';
import { X, User, Mail, Lock } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, email: string) => void;
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, email);
    onClose();
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute max-w-md mx-auto overflow-hidden transform -translate-y-1/2 bg-white shadow-2xl inset-x-4 top-1/2 rounded-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {isRegistering ? 'Créer un compte' : 'Connexion'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Nom d'utilisateur
            </label>
            <div className="relative">
              <User className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Votre nom d'utilisateur"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Votre mot de passe"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 font-medium text-white transition-all duration-200 rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:shadow-lg"
          >
            {isRegistering ? 'Créer le compte' : 'Se connecter'}
          </button>

          <div className="pt-4 text-center">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              {isRegistering 
                ? 'Déjà un compte ? Se connecter' 
                : 'Pas encore de compte ? S\'inscrire'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}