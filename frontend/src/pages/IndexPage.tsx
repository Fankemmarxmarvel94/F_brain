import React from 'react';
import Header from '../components/Header';
import MangaCard from '../components/MangaCard';
import FilterPanel from '../components/FilterPanel';
import MangaDetails from '../components/MangaDetails';
import LoginModal from '../components/LoginModal';
import type { Manga, User, Review, FilterOptions } from '../types';
import { mockMangas, mockUsers, mockReviews } from '../data/mockData';

// Interface pour l'état du composant IndexPage
interface IndexPageState {
  mangas: Manga[];
  filteredMangas: Manga[];
  users: User[];
  reviews: Review[];
  currentUser: User | null;
  searchQuery: string;
  showFilters: boolean;
  showDetails: boolean;
  selectedManga: Manga | null;
  showLogin: boolean;
  showFavorites: boolean;
  filters: FilterOptions;
}

class IndexPage extends React.Component<Record<string, never>, IndexPageState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      mangas: mockMangas,
      filteredMangas: mockMangas,
      users: mockUsers,
      reviews: mockReviews,
      currentUser: null,
      searchQuery: '',
      showFilters: false,
      showDetails: false,
      selectedManga: null,
      showLogin: false,
      showFavorites: false,
      filters: {
        genres: [],
        status: [],
        demographics: [],
        minRating: 0,
        yearRange: [1950, 2024],
        sortBy: 'popularity',
        sortOrder: 'desc'
      }
    };
  }

  componentDidMount() {
    this.applyFilters();
  }

  componentDidUpdate(prevProps: Record<string, never>, prevState: IndexPageState) {
    if (prevState.mangas !== this.state.mangas || 
        prevState.searchQuery !== this.state.searchQuery || 
        JSON.stringify(prevState.filters) !== JSON.stringify(this.state.filters)) {
      this.applyFilters();
    }
  }

  applyFilters = () => {
    const { mangas, searchQuery, filters } = this.state;
    const filtered = mangas.filter(manga => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!manga.title.toLowerCase().includes(query) && 
            !manga.author.toLowerCase().includes(query) &&
            !manga.genres.some(genre => genre.toLowerCase().includes(query))) {
          return false;
        }
      }

      // Genre filter
      if (filters.genres.length > 0) {
        if (!filters.genres.some(genre => manga.genres.includes(genre))) {
          return false;
        }
      }

      // Status filter
      if (filters.status.length > 0) {
        if (!filters.status.includes(manga.status)) {
          return false;
        }
      }

      // Demographics filter
      if (filters.demographics.length > 0) {
        if (!filters.demographics.includes(manga.demographics)) {
          return false;
        }
      }

      // Rating filter
      if (manga.rating < filters.minRating) {
        return false;
      }

      // Year filter
      if (manga.year < filters.yearRange[0] || manga.year > filters.yearRange[1]) {
        return false;
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'year':
          comparison = a.year - b.year;
          break;
        case 'popularity':
          comparison = a.totalRatings - b.totalRatings;
          break;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.setState({ filteredMangas: filtered });
  };

  handleViewManga = (manga: Manga) => {
    this.setState({ 
      selectedManga: manga,
      showDetails: true
    });
  };

  handleLogin = (username: string, email: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      favorites: [],
      readingList: [],
      joinedDate: new Date(),
      // Ajout d'une valeur par défaut pour l'avatar (optionnel)
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`
    };
    
    // Mise à jour de l'utilisateur dans la liste des utilisateurs
    this.setState(prevState => ({
      currentUser: newUser,
      users: [...prevState.users, newUser],
      showLogin: false
    }));
  };

  handleToggleFavorite = (mangaId: string) => {
    const { currentUser } = this.state;
    if (!currentUser) return;
    
    const isFavorite = currentUser.favorites.includes(mangaId);
    const updatedFavorites = isFavorite 
      ? currentUser.favorites.filter(id => id !== mangaId)
      : [...currentUser.favorites, mangaId];
    
    this.setState({
      currentUser: {
        ...currentUser,
        favorites: updatedFavorites
      }
    });
  };

  handleAddReview = (mangaId: string, rating: number, comment: string) => {
    const { currentUser, reviews } = this.state;
    
    // Vérification de l'utilisateur connecté
    if (!currentUser) {
      this.setState({ showLogin: true });
      return;
    }

    // Création de la nouvelle critique
    const newReview: Review = {
      id: Date.now().toString(),
      mangaId,
      userId: currentUser.id,
      username: currentUser.username,
      rating,
      comment,
      date: new Date(),
      helpful: 0
    };

    // Mise à jour de la liste des critiques
    const updatedReviews = [...reviews, newReview];
    
    // Mise à jour de l'état avec les nouvelles critiques
    this.setState({ reviews: updatedReviews }, () => {
      // Mise à jour de la note moyenne du manga après la mise à jour de l'état
      const manga = this.state.mangas.find(m => m.id === mangaId);
      if (manga) {
        const mangaReviews = this.state.reviews.filter(r => r.mangaId === mangaId);
        const totalRating = mangaReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = mangaReviews.length > 0 ? totalRating / mangaReviews.length : 0;
        
        // Arrondir à 1 décimale
        const roundedRating = Math.round(avgRating * 10) / 10;
        
        // Mise à jour de la liste des mangas avec la nouvelle note
        const updatedMangas = this.state.mangas.map(m => 
          m.id === mangaId 
            ? { 
                ...m, 
                rating: roundedRating, 
                totalRatings: mangaReviews.length 
              }
            : m
        );
        
        this.setState({ mangas: updatedMangas });
      }
    });
  };

  // Fonction utilitaire pour formater le texte affiché sous le titre
  private getSubtitleText = (isFavoriteView: boolean, count: number): string => {
    if (isFavoriteView) {
      return `${count} manga${count > 1 ? 's' : ''} dans vos favoris`;
    }
    return `Découvrez ${count} manga${count > 1 ? 's' : ''} incroyable${count > 1 ? 's' : ''}`;
  };

  render() {
    const { 
      filteredMangas, 
      currentUser, 
      searchQuery, 
      showFilters, 
      showDetails, 
      selectedManga, 
      showLogin, 
      showFavorites,
      filters,
      reviews
    } = this.state;
    
    // Calcul des mangas à afficher (filtrage des favoris si nécessaire)
    const displayedMangas = showFavorites && currentUser 
      ? filteredMangas.filter(manga => currentUser.favorites.includes(manga.id))
      : filteredMangas;

    // Récupération des critiques pour le manga sélectionné
    const currentMangaReviews = selectedManga 
      ? reviews.filter(review => review.mangaId === selectedManga.id)
      : [];
      
    // Vérification si aucun résultat n'est trouvé
    const noResults = displayedMangas.length === 0;
    // Vérification si des filtres sont actifs
    const hasActiveFilters = filters.genres.length > 0 || 
                            filters.status.length > 0 || 
                            filters.demographics.length > 0 || 
                            filters.minRating > 0 || 
                            searchQuery;

    return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onSearch={(query) => {
          this.setState({ searchQuery: query });
        }}
        onShowFilters={() => this.setState({ showFilters: true })}
        currentUser={currentUser}
        onLogin={() => this.setState({ showLogin: true })}
        onShowFavorites={() => this.setState(prev => ({
          showFavorites: !prev.showFavorites,
          // Réinitialiser la recherche si on affiche les favoris
          searchQuery: !prev.showFavorites ? '' : prev.searchQuery
        }))}
      />  

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {showFavorites ? 'Mes Favoris' : 'Catalogue Manga'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {this.getSubtitleText(showFavorites, displayedMangas.length)}
                </p>
              </div>
              {showFavorites && (
                <button
                  onClick={() => this.setState({ showFavorites: false })}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Voir tout le catalogue
                </button>
              )}
            </div>

            {/* Affichage des filtres actifs */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    Recherche: "{searchQuery}"
                  </span>
                )}
                {filters.genres.map(genre => (
                  <span key={genre} className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    {genre}
                  </span>
                ))}
                {filters.status.map(status => (
                  <span key={status} className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {status}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Manga Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedMangas.map((manga) => {
            // Vérifier si le manga est dans les favoris de l'utilisateur
            const isMangaFavorite = currentUser 
              ? currentUser.favorites.includes(manga.id)
              : false;
              
            return (
              <MangaCard
                key={manga.id}
                manga={manga}
                onView={this.handleViewManga}
                onToggleFavorite={currentUser ? this.handleToggleFavorite : undefined}
                isFavorite={isMangaFavorite}
                isLoggedIn={!!currentUser}
              />
            );
          })}
        </div>

          {/* Empty State */}
        {noResults && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg 
                className="w-16 h-16 mx-auto" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 11.172A7.98 7.98 0 0112 9c-2.34 0-4.29 1.009-5.824 2.562" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {showFavorites 
                ? 'Aucun favori trouvé' 
                : hasActiveFilters 
                  ? 'Aucun résultat pour votre recherche' 
                  : 'Aucun manga disponible'}
            </h3>
            <p className="text-gray-600 mb-4">
              {showFavorites 
                ? 'Ajoutez des mangas à vos favoris pour les retrouver ici.'
                : hasActiveFilters
                  ? 'Essayez d\'ajuster vos critères de recherche ou de filtres.'
                  : 'Aucun manga n\'est disponible pour le moment.'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  this.setState({
                    searchQuery: '',
                    filters: {
                      genres: [],
                      status: [],
                      demographics: [],
                      minRating: 0,
                      yearRange: [1950, 2024],
                      sortBy: 'popularity',
                      sortOrder: 'desc'
                    },
                    showFavorites: false
                  });
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}  
        </main>

        {/* Modal de filtrage */}
        <FilterPanel
          isOpen={showFilters}
          onClose={() => this.setState({ showFilters: false })}
          filters={filters}
          onFiltersChange={(newFilters) => {
            this.setState({ 
              filters: newFilters,
              // Réinitialiser l'affichage des favoris lors de l'application de nouveaux filtres
              showFavorites: false
            });
          }}
        />

        {selectedManga && (
          <MangaDetails
            manga={selectedManga}
            reviews={currentMangaReviews}
            isOpen={showDetails}
            onClose={() => this.setState({ showDetails: false })}
            currentUser={currentUser}
            onAddReview={this.handleAddReview}
            onToggleFavorite={this.handleToggleFavorite}
            isFavorite={currentUser?.favorites.includes(selectedManga.id) || false}
          />
        )}

        {/* Modal de connexion */}
        <LoginModal
          isOpen={showLogin}
          onClose={() => this.setState({ showLogin: false })}
          onLogin={this.handleLogin}
        />
      </div>
    );
  }
}

export default IndexPage;