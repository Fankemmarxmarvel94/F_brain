interface Manga {
  id: number;
  title: string;
  author: string;
  genre: string[];
  status: 'En cours' | 'Terminé' | 'En pause';
  rating: number;
  chapters: number;
  description: string;
  coverImage: string;
  year: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface FavoritesContextType {
  favorites: number[];
  addToFavorites: (mangaId: number) => void;
  removeFromFavorites: (mangaId: number) => void;
  isFavorite: (mangaId: number) => boolean;
}

export type { Manga };