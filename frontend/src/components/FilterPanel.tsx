import React, { useState } from 'react';
import { X, Filter, RotateCcw } from 'lucide-react';
import type { FilterOptions } from '../types';
// import { genresList, demographicsList, statusList } from '../data/mockData';

interface FilterPanelProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly filters: FilterOptions;
  readonly onFiltersChange: (filters: FilterOptions) => void;
}

export default function FilterPanel({ isOpen, onClose, filters, onFiltersChange }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters: FilterOptions = {
      genres: [],
      status: [],
      demographics: [],
      minRating: 0,
      yearRange: [1950, 2024],
      sortBy: 'popularity',
      sortOrder: 'desc'
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const toggleArrayFilter = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Genres */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Genres</h3>
            <div className="grid grid-cols-2 gap-2">
              {genresList.map((genre) => (
                <label key={genre} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.genres.includes(genre)}
                    onChange={() => setLocalFilters({
                      ...localFilters,
                      genres: toggleArrayFilter(localFilters.genres, genre)
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{genre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Statut</h3>
            <div className="space-y-2">
              {statusList.map((status) => (
                <label key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.status.includes(status)}
                    onChange={() => setLocalFilters({
                      ...localFilters,
                      status: toggleArrayFilter(localFilters.status, status)
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Demographics */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Démographie</h3>
            <div className="space-y-2">
              {demographicsList.map((demo) => (
                <label key={demo} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.demographics.includes(demo)}
                    onChange={() => setLocalFilters({
                      ...localFilters,
                      demographics: toggleArrayFilter(localFilters.demographics, demo)
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{demo}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Note minimum</h3>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={localFilters.minRating}
              onChange={(e) => setLocalFilters({
                ...localFilters,
                minRating: parseFloat(e.target.value)
              })}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>0</span>
              <span className="font-medium">{localFilters.minRating}</span>
              <span>5</span>
            </div>
          </div>

          {/* Year Range */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Année de publication</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">De</label>
                <input
                  type="number"
                  min="1950"
                  max="2024"
                  value={localFilters.yearRange[0]}
                  onChange={(e) => setLocalFilters({
                    ...localFilters,
                    yearRange: [parseInt(e.target.value), localFilters.yearRange[1]]
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">À</label>
                <input
                  type="number"
                  min="1950"
                  max="2024"
                  value={localFilters.yearRange[1]}
                  onChange={(e) => setLocalFilters({
                    ...localFilters,
                    yearRange: [localFilters.yearRange[0], parseInt(e.target.value)]
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Trier par</h3>
            <select
              value={localFilters.sortBy}
              onChange={(e) => setLocalFilters({
                ...localFilters,
                sortBy: e.target.value as FilterOptions['sortBy']
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="popularity">Popularité</option>
              <option value="rating">Note</option>
              <option value="year">Année</option>
              <option value="title">Titre</option>
            </select>
            <div className="mt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.sortOrder === 'asc'}
                  onChange={(e) => setLocalFilters({
                    ...localFilters,
                    sortOrder: e.target.checked ? 'asc' : 'desc'
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Ordre croissant</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 space-y-2">
          <button
            onClick={handleApplyFilters}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Appliquer les filtres
          </button>
          <button
            onClick={handleResetFilters}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
          >
            <RotateCcw className="h-4 w-4" />
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}