import React, { useState } from 'react';
import { Search, User, Menu, X, BookOpen, Star, Heart } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  onShowFilters: () => void;
  currentUser: any;
  onLogin: () => void;
  onShowFavorites: () => void;
}

export default function Header({ onSearch, onShowFilters, currentUser, onLogin, onShowFavorites }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 border-b shadow-sm bg-white/80 backdrop-blur-md border-gray-200/20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              MangaCatalog
            </h1>
          </div>

          {/* Desktop Search */}
          <div className="flex-1 hidden max-w-md mx-8 md:flex">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher un manga..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-4 md:flex">
            <button
              onClick={onShowFilters}
              className="px-4 py-2 font-medium text-gray-700 transition-all duration-200 rounded-lg hover:text-blue-600 hover:bg-blue-50"
            >
              Filtres
            </button>
            
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onShowFavorites}
                  className="p-2 text-gray-700 transition-all duration-200 rounded-lg hover:text-red-600 hover:bg-red-50"
                  title="Mes favoris"
                >
                  <Heart className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 px-3 py-2 text-white rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{currentUser.username}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="px-4 py-2 font-medium text-white transition-all duration-200 rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:shadow-lg"
              >
                Connexion
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 rounded-lg hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-4 md:hidden">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Rechercher un manga..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            </div>
          </form>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="pb-4 md:hidden">
            <div className="space-y-2">
              <button
                onClick={() => {
                  onShowFilters();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-gray-700 transition-all duration-200 rounded-lg hover:text-blue-600 hover:bg-blue-50"
              >
                Filtres
              </button>
              
              {currentUser ? (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      onShowFavorites();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full gap-2 px-4 py-2 text-left text-gray-700 transition-all duration-200 rounded-lg hover:text-red-600 hover:bg-red-50"
                  >
                    <Heart className="w-4 h-4" />
                    Mes favoris
                  </button>
                  <div className="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                    <User className="w-4 h-4" />
                    <span>{currentUser.username}</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Connexion
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}