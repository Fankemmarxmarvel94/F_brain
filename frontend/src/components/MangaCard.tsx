import React from 'react';
import { Heart, Star, Calendar, BookOpen, User } from 'lucide-react';
import type { Manga } from '../types/index';
import { useFavorites } from '../context/FavoritesContext';

interface MangaCardProps {
  manga: Manga;
}

const MangaCard: React.FC<MangaCardProps> = ({ manga }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const isInFavorites = isFavorite(manga.id);

  const handleFavoriteClick = () => {
    if (isInFavorites) {
      removeFromFavorites(manga.id);
    } else {
      addToFavorites(manga.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours':
        return 'bg-green-100 text-green-800';
      case 'Terminé':
        return 'bg-blue-100 text-blue-800';
      case 'En pause':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={manga.coverImage}
          alt={manga.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isInFavorites
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart
              className={`h-4 w-4 ${isInFavorites ? 'fill-current' : ''}`}
            />
          </button>
        </div>
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(manga.status)}`}>
            {manga.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
            {manga.title}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <User className="h-3 w-3 mr-1" />
            <span>{manga.author}</span>
          </div>
        </div>

        {/* Rating and Year */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">{manga.rating}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>{manga.year}</span>
          </div>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-3">
          {manga.genre.slice(0, 3).map((genre, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs"
            >
              {genre}
            </span>
          ))}
          {manga.genre.length > 3 && (
            <span className="text-xs text-gray-500">+{manga.genre.length - 3}</span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
          {manga.description}
        </p>

        {/* Chapters */}
        <div className="flex items-center text-sm text-gray-500">
          <BookOpen className="h-3 w-3 mr-1" />
          <span>{manga.chapters} chapitres</span>
        </div>
      </div>
    </div>
  );
};

export default MangaCard;