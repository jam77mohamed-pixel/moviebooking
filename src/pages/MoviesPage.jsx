import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { 
  Film, 
  AlertCircle, 
  RefreshCw, 
  Bookmark, 
  SlidersHorizontal 
} from 'lucide-react';
import { movieService } from '../api/movieApi';
import MovieCard from '../components/movies/MovieCard';
import MovieFilterBar from '../components/movies/MovieFilterBar';
import Pagination from '../components/movies/Pagination';
import EmptyState from '../components/common/EmptyState';
import { MovieCardSkeleton } from '../components/common/SkeletonCard';
import { useMovies } from '../context/MovieContext';

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { watchlist } = useMovies();

  // Filter & Search states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [genre, setGenre] = useState(searchParams.get('genre') || 'All');
  const [language, setLanguage] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('releaseDate_desc');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Data states
  const [movies, setMovies] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sourceName, setSourceName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isWatchlistView = location.pathname === '/watchlist' || searchParams.get('view') === 'watchlist';

  // Sync search URL query param
  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null && q !== search) {
      setSearch(q);
      setPage(1);
    }
  }, [searchParams]);

  // Fetch movies whenever filters change
  const fetchMoviesList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await movieService.getMovies({
        search,
        genre,
        language,
        minRating,
        sortBy,
        page,
        limit: viewMode === 'list' ? 6 : 8
      });

      let results = response.movies;
      let count = response.totalCount;

      // Filter by watchlist if watchlist view is active
      if (isWatchlistView) {
        results = results.filter((m) => watchlist.includes(m.id));
        count = results.length;
      }

      setMovies(results);
      setTotalCount(count);
      setTotalPages(Math.max(1, Math.ceil(count / (viewMode === 'list' ? 6 : 8))));
      setSourceName(response.source);
    } catch (err) {
      setError(err.message || 'Failed to load movies. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoviesList();
  }, [search, genre, language, minRating, sortBy, page, viewMode, isWatchlistView]);

  const handleResetFilters = () => {
    setSearch('');
    setGenre('All');
    setLanguage('All');
    setMinRating(0);
    setSortBy('releaseDate_desc');
    setPage(1);
    setSearchParams({});
  };

  const hasActiveFilters =
    Boolean(search) ||
    genre !== 'All' ||
    language !== 'All' ||
    minRating > 0 ||
    sortBy !== 'releaseDate_desc' ||
    isWatchlistView;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isWatchlistView ? 'My Saved Watchlist' : 'Theatrical Movie Listing'}
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {totalCount} Movies
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isWatchlistView
              ? 'Movies you have bookmarked for future theatrical screenings.'
              : 'Browse currently screening blockbusters, check verified showtimes, and book tickets.'}
          </p>
        </div>

        {/* Live Cinema Catalog Status */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#161710] border border-amber-900/40 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-medium">
              Cinema Feed: <strong className="text-amber-400">{totalCount} Movies Available</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <MovieFilterBar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        selectedGenre={genre}
        onGenreChange={(val) => {
          setGenre(val);
          setPage(1);
        }}
        selectedLanguage={language}
        onLanguageChange={(val) => {
          setLanguage(val);
          setPage(1);
        }}
        selectedRating={minRating}
        onRatingChange={(val) => {
          setMinRating(val);
          setPage(1);
        }}
        sortBy={sortBy}
        onSortChange={(val) => {
          setSortBy(val);
          setPage(1);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Active Filters Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Applied Filters:</span>
          {search && (
            <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-200 flex items-center gap-1 border border-slate-700">
              Keyword: "{search}"
            </span>
          )}
          {genre !== 'All' && (
            <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Genre: {genre}
            </span>
          )}
          {language !== 'All' && (
            <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Language: {language}
            </span>
          )}
          {minRating > 0 && (
            <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Rating: {minRating}+
            </span>
          )}
          {isWatchlistView && (
            <span className="px-2.5 py-1 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Watchlist Filter
            </span>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button
            onClick={fetchMoviesList}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 text-xs font-bold hover:brightness-110 transition-colors shrink-0 shadow-md shadow-amber-500/30"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Movie Grid or List */}
      {loading ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {Array.from({ length: viewMode === 'list' ? 4 : 8 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <EmptyState
          title={isWatchlistView ? 'Your Watchlist is Empty' : 'No Movies Found'}
          description={
            isWatchlistView
              ? 'Click the bookmark icon on any movie card to add movies to your personal watchlist.'
              : 'No movies match your current search terms or filters. Try adjusting your selections or resetting filters.'
          }
          onReset={handleResetFilters}
          resetLabel="Clear Filters & Show All Movies"
        />
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} viewMode={viewMode} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && movies.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalCount={totalCount}
          limit={viewMode === 'list' ? 6 : 8}
          onPageChange={(newPage) => {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
};

export default MoviesPage;
