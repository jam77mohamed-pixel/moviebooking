import React from 'react';
import { 
  Search, 
  X, 
  Filter, 
  SlidersHorizontal, 
  ArrowUpDown, 
  LayoutGrid, 
  List, 
  RotateCcw,
  Star
} from 'lucide-react';
import { MOCK_GENRES, MOCK_LANGUAGES } from '../../api/mockData';

const RATING_OPTIONS = [
  { label: 'All Ratings', value: 0 },
  { label: '8.5+ ⭐ Blockbuster', value: 8.5 },
  { label: '8.0+ ⭐ Superhit', value: 8.0 },
  { label: '7.5+ ⭐ Certified Fresh', value: 7.5 },
  { label: '7.0+ ⭐ Good', value: 7.0 }
];

const SORT_OPTIONS = [
  { label: 'Release Date: Newest First', value: 'releaseDate_desc' },
  { label: 'Release Date: Oldest First', value: 'releaseDate_asc' },
  { label: 'Rating: High to Low', value: 'rating_desc' },
  { label: 'Rating: Low to High', value: 'rating_asc' },
  { label: 'Title: A to Z', value: 'title_asc' }
];

const MovieFilterBar = ({
  search,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  selectedLanguage,
  onLanguageChange,
  selectedRating,
  onRatingChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  hasActiveFilters
}) => {
  return (
    <div className="space-y-4 bg-[#161710] border border-amber-900/40 rounded-3xl p-5 shadow-xl">
      
      {/* Top Row: Search Input + Sorting + View Mode */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by movie title, synopsis, director, or keywords..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-[#12130d] text-sm text-slate-200 placeholder-slate-400 rounded-2xl border border-amber-900/40 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Language Selector */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="py-2.5 pl-3 pr-8 bg-[#12130d] text-xs font-semibold text-slate-200 rounded-2xl border border-amber-900/40 focus:border-amber-500 focus:outline-none cursor-pointer appearance-none"
            >
              <option value="All">All Languages</option>
              {MOCK_LANGUAGES.filter((l) => l !== 'All').map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              ▼
            </div>
          </div>

          {/* Rating Selector */}
          <div className="relative">
            <select
              value={selectedRating}
              onChange={(e) => onRatingChange(Number(e.target.value))}
              className="py-2.5 pl-3 pr-8 bg-[#12130d] text-xs font-semibold text-slate-200 rounded-2xl border border-amber-900/40 focus:border-amber-500 focus:outline-none cursor-pointer appearance-none"
            >
              {RATING_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              ▼
            </div>
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="py-2.5 pl-3 pr-8 bg-[#12130d] text-xs font-semibold text-slate-200 rounded-2xl border border-amber-900/40 focus:border-amber-500 focus:outline-none cursor-pointer appearance-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              ▼
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex p-1 rounded-2xl bg-[#12130d] border border-amber-900/40">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-black shadow-sm shadow-amber-500/30' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-black shadow-sm shadow-amber-500/30' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors cursor-pointer"
              title="Clear all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

        </div>

      </div>

      {/* Genre Chips Quick Selector */}
      <div className="pt-2 border-t border-amber-950/60 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span>Genres:</span>
        </span>

        {MOCK_GENRES.map((g) => {
          const isSelected = selectedGenre.toLowerCase() === g.toLowerCase();
          return (
            <button
              key={g}
              onClick={() => onGenreChange(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-bold shadow-md shadow-amber-500/30 scale-[1.02]'
                  : 'bg-[#12130d] hover:bg-amber-950/30 text-slate-300 border border-amber-900/40'
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>

    </div>
  );
};

export default MovieFilterBar;
