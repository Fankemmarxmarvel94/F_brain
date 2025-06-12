// Types principaux pour l'application Manga Catalog

export interface Manga {
    id: number;
    title: string;
    author: string;
    genre: string[];
    status: MangaStatus;
    chapters: number;
    image: string;
    description: string;
    rating: number;
    totalRatings: number;
    year: number;
}

export type MangaStatus = 'En cours' | 'Terminé' | 'Hiatus';

export interface Comment {
    id: number;
    text: string;
    rating: number;
    user: string;
    date: string;
    avatar?: string;
}

export interface UserRatings {
    [mangaId: number]: number;
}

export interface Comments {
    [mangaId: number]: Comment[];
}

export interface FilterState {
    genres: string[];
    status: MangaStatus[];
    minRating: number;
}

export interface AppStats {
    totalMangas: number;
    averageRating: string;
    userRatingsCount: number;
    totalComments: number;
}

// Props pour les composants
export interface StarRatingProps {
    rating: number;
    onRate?: (rating: number) => void;
    readonly?: boolean;
    size?: string;
    showText?: boolean;
}

export interface FilterPanelProps {
    isOpen: boolean;
    onClose: () => void;
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

export interface CommentsSectionProps {
    mangaId: number;
    comments: Comments;
    onAddComment: (mangaId: number, comment: Comment) => void;
}

export interface MangaCardProps {
    manga: Manga;
    onRate: (mangaId: number, rating: number) => void;
    userRatings: UserRatings;
    onToggleDetails: (mangaId: number) => void;
    expandedCard: number | null;
}

// Types utilitaires
export type SortOption = 'title' | 'rating' | 'year' | 'chapters';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
    option: SortOption;
    direction: SortDirection;
}

// Types pour l'environnement
export interface EnvConfig {
    VITE_APP_TITLE: string;
    VITE_APP_DESCRIPTION: string;
    VITE_API_BASE_URL?: string;
    VITE_ENABLE_DARK_MODE: string;
    VITE_ENABLE_COMMENTS: string;
    VITE_DEBUG_MODE: string;
}

// Types pour les hooks
export interface UseLocalStorageReturn<T> {
    value: T;
    setValue: (value: T | ((prev: T) => T)) => void;
    removeValue: () => void;
}

export interface UseDebounceReturn<T> {
    debouncedValue: T;
    isDebouncing: boolean;
}

// Types pour les événements
export interface SearchEvent {
    type: 'search';
    query: string;
    timestamp: number;
}

export interface RatingEvent {
    type: 'rating';
    mangaId: number;
    rating: number;
    timestamp: number;
}

export interface CommentEvent {
    type: 'comment';
    mangaId: number;
    comment: Comment;
    timestamp: number;
}

export type AnalyticsEvent = SearchEvent | RatingEvent | CommentEvent;

// Constants typés
export const MANGA_STATUSES: readonly MangaStatus[] = ['En cours', 'Terminé', 'Hiatus'] as const;

export const GENRES: readonly string[] = [
    'Action', 'Aventure', 'Comédie', 'Drame', 'Fantastique',
    'Horreur', 'Romance', 'Shonen', 'Seinen', 'Super-héros',
    'Surnaturel', 'Thriller'
] as const;

export const SORT_OPTIONS: readonly SortOption[] = ['title', 'rating', 'year', 'chapters'] as const;

// Type guards
export const isMangaStatus = (status: string): status is MangaStatus => {
    return MANGA_STATUSES.includes(status as MangaStatus);
};

export const isValidRating = (rating: number): boolean => {
    return rating >= 1 && rating <= 5 && Number.isInteger(rating);
};

export const isValidManga = (manga: any): manga is Manga => {
    return (
        typeof manga === 'object' &&
        typeof manga.id === 'number' &&
        typeof manga.title === 'string' &&
        typeof manga.author === 'string' &&
        Array.isArray(manga.genre) &&
        isMangaStatus(manga.status) &&
        typeof manga.chapters === 'number' &&
        typeof manga.image === 'string' &&
        typeof manga.description === 'string' &&
        typeof manga.rating === 'number' &&
        typeof manga.totalRatings === 'number' &&
        typeof manga.year === 'number'
    );
};