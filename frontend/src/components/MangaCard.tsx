import React, { useState } from 'react';
import { Star, Heart, BookOpen, Calendar, User, Eye } from 'lucide-react';
import type { Manga } from '../types';

interface MangaCardProps {
  manga: Manga;
  onView: (manga: Manga) => void;
  onToggleFavorite?: (mangaId: string) => void;
  isFavorite?: boolean;
  isLoggedIn: boolean;
}

export default function MangaCard({ manga, onView, onToggleFavorite, isFavorite, isLoggedIn }: MangaCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours':
        return 'bg-green-100 text-green-800';
      case 'Terminé':
        return 'bg-blue-100 text-blue-800';
      case 'Hiatus':
        return 'bg-yellow-100 text-yellow-800';
      case 'Annulé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={manga.coverImage}
          alt={manga.title}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={() => onView(manga)}
              className="w-full bg-white/90 backdrop-blur-sm text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-white transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Voir détails
            </button>
          </div>
        </div>

        {/* Favorite Button */}
        {isLoggedIn && onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(manga.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isFavorite
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(manga.status)}`}>
            {manga.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
          {manga.title}
        </h3>
        
        {manga.titleJapanese && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-1">{manga.titleJapanese}</p>
        )}

        <div className="flex items-center gap-2 mb-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600 line-clamp-1">{manga.author}</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{manga.year}</span>
          <BookOpen className="h-4 w-4 text-gray-400 ml-auto" />
          <span className="text-sm text-gray-600">{manga.chapters} ch.</span>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            {renderStars(manga.rating)}
            <span className="text-sm font-medium text-gray-700 ml-1">
              {manga.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            ({manga.totalRatings.toLocaleString()} avis)
          </span>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-3">
          {manga.genres.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
            >
              {genre}
            </span>
          ))}
          {manga.genres.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
              +{manga.genres.length - 3}
            </span>
          )}
        </div>

        {/* Synopsis Preview */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {manga.synopsis}
        </p>
      </div>
    </div>
  );
}