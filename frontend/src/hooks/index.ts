import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  UseLocalStorageReturn,
  UseDebounceReturn,
  Manga,
  FilterState,
  UserRatings,
  Comments,
  AppStats,
  MangaComment
} from '../types';

// Hook pour localStorage avec type safety
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setStoredValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // Obtenir la valeur actuelle pour les fonctions de mise à jour
      setValue(currentValue => {
        const valueToStore = typeof value === 'function'
          ? (value as (prev: T) => T)(currentValue)
          : value;

        // Sauvegarder dans localStorage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));

        return valueToStore;
      });
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return { value, setValue: setStoredValue, removeValue };
}

// Hook pour debounce
export function useDebounce<T>(value: T, delay: number): UseDebounceReturn<T> {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);

  useEffect(() => {
    setIsDebouncing(true);
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return { debouncedValue, isDebouncing };
}

// Hook pour la gestion des filtres de mangas
export function useMangaFilters(mangas: Manga[]) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>({
    genres: [],
    status: [],
    minRating: 0
  });

  const { debouncedValue: debouncedSearchTerm } = useDebounce(searchTerm, 300);

  const filteredMangas = useMemo(() => {
    return mangas.filter(manga => {
      const matchesSearch = debouncedSearchTerm === '' ||
        manga.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        manga.author.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        manga.genre.some(g => g.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));

      const matchesGenre = filters.genres.length === 0 ||
        filters.genres.some(genre => manga.genre.includes(genre));

      const matchesStatus = filters.status.length === 0 ||
        filters.status.includes(manga.status);

      const matchesRating = manga.rating >= filters.minRating;

      return matchesSearch && matchesGenre && matchesStatus && matchesRating;
    });
  }, [mangas, debouncedSearchTerm, filters]);

  const clearFilters = useCallback(() => {
    setFilters({ genres: [], status: [], minRating: 0 });
    setSearchTerm('');
  }, []);

  const hasActiveFilters = useMemo(() => {
    return filters.genres.length > 0 ||
      filters.status.length > 0 ||
      filters.minRating > 0 ||
      searchTerm.length > 0;
  }, [filters, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    filteredMangas,
    clearFilters,
    hasActiveFilters
  };
}

// Hook pour la gestion des notes utilisateur
export function useUserRatings() {
  const { value: userRatings, setValue: setUserRatings } = useLocalStorage<UserRatings>(
    'manga-user-ratings',
    {}
  );

  const handleRate = useCallback((mangaId: number, rating: number) => {
    if (rating < 1 || rating > 5) {
      console.error('Rating must be between 1 and 5');
      return;
    }

    setUserRatings(prev => ({
      ...prev,
      [mangaId]: rating
    }));
  }, [setUserRatings]);

  const getRating = useCallback((mangaId: number): number => {
    return userRatings[mangaId] || 0;
  }, [userRatings]);

  const removeRating = useCallback((mangaId: number) => {
    setUserRatings(prev => {
      const { [mangaId]: removed, ...rest } = prev;
      return rest;
    });
  }, [setUserRatings]);

  return {
    userRatings,
    handleRate,
    getRating,
    removeRating
  };
}

// Hook pour la gestion des commentaires
export function useComments() {
  const { value: comments, setValue: setComments } = useLocalStorage<Comments>(
    'manga-comments',
    {}
  );

  const addComment = useCallback((mangaId: number, commentData: Omit<MangaComment, 'id'>) => {
    const newComment: MangaComment = {
      ...commentData,
      id: Date.now(),
      date: new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    setComments(prev => ({
      ...prev,
      [mangaId]: [...(prev[mangaId] || []), newComment]
    }));
  }, [setComments]);

  const getComments = useCallback((mangaId: number): MangaComment[] => {
    return comments[mangaId] || [];
  }, [comments]);

  const removeComment = useCallback((mangaId: number, commentId: number) => {
    setComments(prev => ({
      ...prev,
      [mangaId]: (prev[mangaId] || []).filter(comment => comment.id !== commentId)
    }));
  }, [setComments]);

  const getCommentCount = useCallback((mangaId: number): number => {
    return (comments[mangaId] || []).length;
  }, [comments]);

  const getTotalCommentCount = useCallback((): number => {
    return Object.values(comments).reduce((total, mangaComments) => total + mangaComments.length, 0);
  }, [comments]);

  return {
    comments,
    addComment,
    getComments,
    removeComment,
    getCommentCount,
    getTotalCommentCount
  };
}

// Hook pour les statistiques de l'application
export function useAppStats(mangas: Manga[], userRatings: UserRatings, comments: Comments): AppStats {
  return useMemo(() => {
    const totalMangas = mangas.length;
    const averageRating = totalMangas > 0
      ? (mangas.reduce((sum, manga) => sum + manga.rating, 0) / totalMangas).toFixed(1)
      : '0.0';
    const userRatingsCount = Object.keys(userRatings).length;
    const totalComments = Object.values(comments).reduce((sum, mangaComments) => sum + mangaComments.length, 0);

    return {
      totalMangas,
      averageRating,
      userRatingsCount,
      totalComments
    };
  }, [mangas, userRatings, comments]);
}

// Hook pour la gestion des cartes expandues
export function useExpandedCard() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const toggleDetails = useCallback((mangaId: number) => {
    setExpandedCard(prev => prev === mangaId ? null : mangaId);
  }, []);

  const closeDetails = useCallback(() => {
    setExpandedCard(null);
  }, []);

  const isExpanded = useCallback((mangaId: number): boolean => {
    return expandedCard === mangaId;
  }, [expandedCard]);

  return {
    expandedCard,
    toggleDetails,
    closeDetails,
    isExpanded
  };
}

// Hook pour les interactions clavier
export function useKeyboardShortcuts(callbacks: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const ctrlKey = event.ctrlKey || event.metaKey;
      const shortcutKey = ctrlKey ? `ctrl+${key}` : key;

      if (callbacks[shortcutKey]) {
        event.preventDefault();
        callbacks[shortcutKey]();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callbacks]);
}

// Hook pour la détection de mode sombre
export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dark-mode');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('dark-mode', JSON.stringify(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggle = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  return { isDark, toggle };
}