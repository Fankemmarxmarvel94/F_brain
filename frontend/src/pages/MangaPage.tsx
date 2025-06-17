import React, { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import MangaGrid from '../components/MangaGrid';
import { mangaData } from '../data/mangaData';

const MangaPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredManga = useMemo(() => {
    if (!searchTerm) return mangaData;
    
    return mangaData.filter(manga =>
      manga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manga.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manga.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Découvrez nos Manga
        </h2>
        <p className="text-gray-600 mb-6">
          Explorez notre collection de manga populaires et trouvez votre prochaine lecture
        </p>
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Rechercher par titre, auteur ou genre..."
        />
      </div>

      {/* Results Count */}
      {searchTerm && (
        <div className="text-sm text-gray-600">
          {filteredManga.length} résultat{filteredManga.length !== 1 ? 's' : ''} pour "{searchTerm}"
        </div>
      )}

      {/* Manga Grid */}
      <MangaGrid 
        manga={filteredManga}
        emptyMessage="Aucun manga ne correspond à votre recherche"
      />
    </div>
  );
};

export default MangaPage;