export interface Manga {
  id: string;
  title: string;
  titleJapanese?: string;
  author: string;
  artist?: string;
  genres: string[];
  status: 'En cours' | 'Terminé' | 'Hiatus' | 'Annulé';
  volumes: number;
  chapters: number;
  year: number;
  synopsis: string;
  coverImage: string;
  rating: number;
  totalRatings: number;
  demographics: 'Shōnen' | 'Shōjo' | 'Seinen' | 'Josei' | 'Kodomo';
  publisher: string;
  serialization?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  favorites: string[];
  readingList: string[];
  joinedDate: Date;
}

export interface Review {
  id: string;
  mangaId: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
}

export interface FilterOptions {
  genres: string[];
  status: string[];
  demographics: string[];
  minRating: number;
  yearRange: [number, number];
  sortBy: 'title' | 'rating' | 'year' | 'popularity';
  sortOrder: 'asc' | 'desc';
}