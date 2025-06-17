import React from 'react';
import type { Manga } from '../types';
import MangaCard from './MangaCard';

interface MangaGridProps {
  manga: Manga[];
  emptyMessage?: string;
}

const MangaGrid: React.FC<MangaGridProps> = ({ 
  manga, 
  emptyMessage = "Aucun manga trouvé" 
}) => {
  if (manga.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">📚</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-500">
          {emptyMessage.includes('favoris') 
            ? "Ajoutez des manga à vos favoris en cliquant sur le cœur"
            : "Essayez de rechercher autre chose"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {manga.map((mangaItem) => (
        <MangaCard key={mangaItem.id} manga={mangaItem} />
      ))}
    </div>
  );
};

export default MangaGrid;