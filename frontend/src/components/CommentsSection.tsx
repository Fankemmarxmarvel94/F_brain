import React, { useState, useCallback, useMemo } from 'react';
import { MessageCircle, User, Send, ThumbsUp, Flag, Trash2 } from 'lucide-react';
import StarRating from './StarRating';
import type { CommentsSectionProps, MangaComment } from '../types';

const CommentsSection: React.FC<CommentsSectionProps> = ({ 
  mangaId, 
  comments, 
  onAddComment 
}) => {
  const [newComment, setNewComment] = useState<string>('');
  const [newRating, setNewRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showAllComments, setShowAllComments] = useState<boolean>(false);

  const mangaComments = useMemo(() => comments[mangaId] || [], [comments, mangaId]);
  
  const displayedComments = useMemo(() => {
    return showAllComments ? mangaComments : mangaComments.slice(0, 3);
  }, [mangaComments, showAllComments]);

  const commentStats = useMemo(() => {
    const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    mangaComments.forEach(comment => {
      const rating = Math.floor(comment.rating);
      if (rating >= 1 && rating <= 5) {
        stats[rating as keyof typeof stats]++;
      }
    });
    return stats;
  }, [mangaComments]);

  const averageRating = useMemo(() => {
    if (mangaComments.length === 0) return 0;
    const sum = mangaComments.reduce((acc, comment) => acc + comment.rating, 0);
    return sum / mangaComments.length;
  }, [mangaComments]);

  const handleSubmit = useCallback(async () => {
    if (newComment.trim() && !isSubmitting && newComment.length <= 500) {
      setIsSubmitting(true);
      
      try {
        // Simulation d'un délai d'envoi
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const comment: Omit<MangaComment, 'id'> = {
          text: newComment.trim(),
          rating: newRating,
          user: 'Utilisateur Actuel',
          date: new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        };
        
        onAddComment(mangaId, comment as MangaComment);
        setNewComment('');
        setNewRating(5);
      } catch (error) {
        console.error('Erreur lors de l\'envoi du commentaire:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [newComment, newRating, isSubmitting, mangaId, onAddComment]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setNewComment(value);
    }
  }, []);

  const toggleShowAllComments = useCallback(() => {
    setShowAllComments(prev => !prev);
  }, []);

  const isSubmitDisabled = !newComment.trim() || isSubmitting || newComment.length > 500;

  return (
    <div className="pt-8 mt-8 border-t border-gray-200">
      {/* Header avec statistiques */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center text-xl font-bold text-gray-800">
          <MessageCircle className="w-6 h-6 mr-3 text-blue-600" />
          Avis et Commentaires
          <span className="px-3 py-1 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
            {mangaComments.length}
          </span>
        </h3>
        
        {mangaComments.length > 0 && (
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <StarRating rating={averageRating} readonly size="w-4 h-4" showText={false} />
              <span className="font-medium">{averageRating.toFixed(1)}</span>
            </div>
            <span>Moyenne des avis</span>
          </div>
        )}
      </div>
      
      {/* Formulaire d'ajout de commentaire */}
      <div className="p-6 mb-8 border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
        <h4 className="mb-4 font-semibold text-gray-800">Partagez votre avis</h4>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Votre note
          </label>
          <StarRating 
            rating={newRating} 
            onRate={setNewRating} 
            size="w-6 h-6" 
            showText={false}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="comment-text" className="sr-only">
            Votre commentaire
          </label>
          <textarea
            id="comment-text"
            value={newComment}
            onChange={handleTextChange}
            onKeyDown={handleKeyPress}
            placeholder="Que pensez-vous de ce manga ? Partagez votre opinion... (Ctrl+Entrée pour publier)"
            className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[120px]"
            rows={4}
            disabled={isSubmitting}
            maxLength={500}
            aria-describedby="char-count"
          />
        </div>

        <div className="flex items-center justify-between">
          <span 
            id="char-count"
            className={`text-sm ${newComment.length > 450 ? 'text-red-500' : 'text-gray-500'}`}
          >
            {newComment.length}/500 caractères
          </span>
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="flex items-center px-6 py-2 space-x-2 text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Publier le commentaire"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                <span>Publication...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Publier</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Liste des commentaires */}
      <div className="space-y-6">
        {mangaComments.length === 0 ? (
          <div className="py-12 text-center rounded-lg bg-gray-50">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium text-gray-500">Aucun commentaire pour le moment</p>
            <p className="mt-1 text-sm text-gray-400">Soyez le premier à partager votre avis !</p>
          </div>
        ) : (
          <>
            {displayedComments.map((comment, index) => (
              <article 
                key={comment.id} 
                className="p-6 transition-shadow duration-200 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800">{comment.user}</h5>
                      <p className="text-sm text-gray-500">{comment.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StarRating 
                      rating={comment.rating} 
                      readonly 
                      size="w-4 h-4" 
                      showText={false}
                    />
                    <span className="text-sm font-medium text-gray-600">
                      {comment.rating}/5
                    </span>
                  </div>
                </div>
                
                <p className="mb-4 leading-relaxed text-gray-700">{comment.text}</p>
                
                {/* Actions sur le commentaire */}
                <div className="flex items-center pt-4 space-x-4 border-t border-gray-100">
                  <button 
                    className="flex items-center space-x-1 text-sm text-gray-500 transition-colors duration-200 hover:text-blue-600"
                    aria-label="Marquer comme utile"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Utile</span>
                  </button>
                  <button 
                    className="flex items-center space-x-1 text-sm text-gray-500 transition-colors duration-200 hover:text-red-600"
                    aria-label="Signaler le commentaire"
                  >
                    <Flag className="w-4 h-4" />
                    <span>Signaler</span>
                  </button>
                </div>
              </article>
            ))}

            {/* Bouton pour voir plus/moins de commentaires */}
            {mangaComments.length > 3 && (
              <div className="text-center">
                <button
                  onClick={toggleShowAllComments}
                  className="px-6 py-2 font-medium text-blue-600 transition-colors duration-200 rounded-lg hover:text-blue-700 hover:bg-blue-50"
                >
                  {showAllComments 
                    ? `Masquer ${mangaComments.length - 3} commentaire${mangaComments.length - 3 > 1 ? 's' : ''}`
                    : `Voir ${mangaComments.length - 3} commentaire${mangaComments.length - 3 > 1 ? 's' : ''} de plus`
                  }
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Statistiques des commentaires */}
      {mangaComments.length > 0 && (
        <div className="p-6 mt-8 bg-gray-50 rounded-xl">
          <h4 className="mb-4 font-semibold text-gray-800">Répartition des notes</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = commentStats[rating as keyof typeof commentStats];
              const percentage = mangaComments.length > 0 ? (count / mangaComments.length) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center w-12 space-x-1">
                    <span className="text-sm font-medium">{rating}</span>
                    <span className="text-yellow-400">★</span>
                  </div>
                  <div className="flex-1 h-2 overflow-hidden bg-gray-200 rounded-full">
                    <div 
                      className="h-full transition-all duration-500 ease-out bg-yellow-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-sm text-right text-gray-600">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(CommentsSection);