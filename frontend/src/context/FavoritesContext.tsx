import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { FavoritesContextType } from '../types';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<number[]>([]);

  // Charger les favoris depuis localStorage au démarrage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('manga-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Sauvegarder les favoris dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('manga-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (mangaId: number) => {
    setFavorites(prev => [...prev, mangaId]);
  };

  const removeFromFavorites = (mangaId: number) => {
    setFavorites(prev => prev.filter(id => id !== mangaId));
  };

  const isFavorite = (mangaId: number): boolean => {
    return favorites.includes(mangaId);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};