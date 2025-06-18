import React from 'react';
import MangaGrid from '../components/MangaGrid';
import { useFavorites } from '../context/FavoritesContext';
import { mangaData } from '../data/mangaData';

const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();

  const favoriteManga = mangaData.filter(manga => 
    favorites.includes(manga.id)
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Mes Favoris
        </h2>
        <p className="text-gray-600 mb-6">
          Retrouvez tous vos manga préférés en un seul endroit
        </p>
      </div>

      {/* Favorites Count */}
      {favoriteManga.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">
            💖 Vous avez {favoriteManga.length} manga{favoriteManga.length !== 1 ? 's' : ''} en favoris
          </p>
        </div>
      )}

      {/* Favorites Grid */}
      <MangaGrid 
        manga={favoriteManga}
        emptyMessage="Aucun manga en favoris"
      />
    </div>
  );
};

export default FavoritesPage;