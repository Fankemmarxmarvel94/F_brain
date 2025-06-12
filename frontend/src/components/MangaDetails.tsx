import React, { useState } from 'react';
import { X, Calendar, BookOpen, User as UserIcon, Globe, Heart, MessageSquare, ThumbsUp } from 'lucide-react';
import type { Manga, Review, User } from '../types';
import StarRating from './StarRating';

interface MangaDetailsProps {
  readonly manga: Manga;
  readonly reviews: readonly Review[];
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly currentUser: User | null;
  readonly onAddReview: (mangaId: string, rating: number, comment: string) => void;
  readonly onToggleFavorite: (mangaId: string) => void;
  readonly isFavorite: boolean;
}

export default function MangaDetails({ 
  manga, 
  reviews, 
  isOpen, 
  onClose, 
  currentUser, 
  onAddReview,
  onToggleFavorite,
  isFavorite 
}: MangaDetailsProps) {
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!isOpen) return null;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReviewComment.trim()) {
      onAddReview(manga.id, newReviewRating, newReviewComment);
      setNewReviewComment('');
      setNewReviewRating(5);
      setShowReviewForm(false);
    }
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-x-4 inset-y-4 md:inset-8 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Détails du manga</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column - Image & Basic Info */}
                <div className="space-y-6">
                  <div className="relative">
                    <img
                      src={manga.coverImage}
                      alt={manga.title}
                      className="w-full aspect-[3/4] object-cover rounded-xl shadow-lg"
                    />
                    {currentUser && (
                      <button
                        onClick={() => onToggleFavorite(manga.id)}
                        className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm transition-all duration-200 ${
                          isFavorite
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Note moyenne</span>
                      <div className="flex items-center gap-2">
                        <StarRating rating={manga.rating} readonly size="sm" />
                        <span className="text-sm font-bold text-gray-900">{manga.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Nombre d'avis</span>
                      <span className="text-sm font-bold text-gray-900">{manga.totalRatings.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Statut</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(manga.status)}`}>
                        {manga.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="md:col-span-2 space-y-6">
                  {/* Title & Basic Info */}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{manga.title}</h1>
                    {manga.titleJapanese && (
                      <p className="text-lg text-gray-600 mb-4">{manga.titleJapanese}</p>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Auteur</span>
                      </div>
                      <div className="font-medium text-gray-900">{manga.author}</div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Année</span>
                      </div>
                      <div className="font-medium text-gray-900">{manga.year}</div>
                      
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Chapitres</span>
                      </div>
                      <div className="font-medium text-gray-900">{manga.chapters}</div>
                      
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Éditeur</span>
                      </div>
                      <div className="font-medium text-gray-900">{manga.publisher}</div>
                    </div>
                  </div>

                  {/* Genres */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {manga.genres.map((genre) => (
                        <span
                          key={genre}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Synopsis */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Synopsis</h3>
                    <p className="text-gray-700 leading-relaxed">{manga.synopsis}</p>
                  </div>

                  {/* Reviews Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Avis ({reviews.length})
                      </h3>
                      {currentUser && (
                        <button
                          onClick={() => setShowReviewForm(!showReviewForm)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                        >
                          Ajouter un avis
                        </button>
                      )}
                    </div>

                    {/* Review Form */}
                    {showReviewForm && currentUser && (
                      <form onSubmit={handleSubmitReview} className="bg-gray-50 p-4 rounded-xl mb-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Votre note
                          </label>
                          <StarRating
                            rating={newReviewRating}
                            onRatingChange={setNewReviewRating}
                            size="lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Votre commentaire
                          </label>
                          <textarea
                            value={newReviewComment}
                            onChange={(e) => setNewReviewComment(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Partagez votre opinion sur ce manga..."
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                          >
                            Publier l'avis
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                          >
                            Annuler
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 p-4 rounded-xl">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{review.username}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <StarRating rating={review.rating} readonly size="sm" />
                                <span className="text-sm text-gray-500">
                                  {review.date.toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                            </div>
                            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                              <ThumbsUp className="h-4 w-4" />
                              {review.helpful}
                            </button>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}