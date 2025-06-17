import React, { useState } from 'react';
import { X, User, Lock, Loader2, Eye, EyeOff, Mail, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, isLoading } = useAuth();

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Le nom d\'utilisateur est requis');
      return false;
    }

    if (!isLogin && !formData.email.trim()) {
      setError('L\'email est requis');
      return false;
    }

    if (!isLogin && formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Format d\'email invalide');
      return false;
    }

    if (!formData.password.trim()) {
      setError('Le mot de passe est requis');
      return false;
    }

    if (!isLogin && formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    if (isLogin) {
      const success = await login(formData.username, formData.password);
      if (success) {
        setSuccess('Connexion réussie !');
        setTimeout(() => {
          onClose();
          resetForm();
        }, 1000);
      } else {
        setError('Identifiants incorrects');
      }
    } else {
      // Simulation d'inscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      setTimeout(() => {
        setIsLogin(true);
        setFormData(prev => ({ ...prev, email: '', confirmPassword: '' }));
        setSuccess('');
      }, 2000);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
    setIsLogin(true);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData(prev => ({
      ...prev,
      email: '',
      confirmPassword: ''
    }));
  };

  const handleDemoLogin = (username: string, password: string) => {
    setFormData(prev => ({ ...prev, username, password }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isLogin ? 'Connexion' : 'Inscription'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mode Switch */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center ${
                isLogin
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Connexion
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center ${
                !isLogin
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Inscription
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Entrez votre nom d'utilisateur"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email (inscription seulement) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Entrez votre email"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={isLogin ? "Entrez votre mot de passe" : "Créez un mot de passe (min. 6 caractères)"}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (inscription seulement) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Confirmez votre mot de passe"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
                <X className="h-4 w-4 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center">
                <div className="h-4 w-4 mr-2 flex-shrink-0 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                </div>
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isLogin ? 'Connexion...' : 'Création du compte...'}</span>
                </>
              ) : (
                <span>{isLogin ? 'Se connecter' : 'Créer le compte'}</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center space-y-3">
            <button
              onClick={switchMode}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isLogin 
                ? "Pas encore de compte ? Créer un compte" 
                : "Déjà un compte ? Se connecter"
              }
            </button>
            
            {isLogin && (
              <div className="border-t pt-3">
                <p className="text-xs text-gray-500 mb-2">Comptes de démonstration :</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin', 'admin123')}
                    className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('user', 'user123')}
                    className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                  >
                    Utilisateur
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;