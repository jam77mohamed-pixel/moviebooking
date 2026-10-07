import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  Calendar, 
  Globe, 
  Play, 
  Bookmark, 
  Ticket,
  Film
} from 'lucide-react';
import { useMovies } from '../../context/MovieContext';

const MovieCard = ({ movie, viewMode = 'grid' }) => {
  const { isMovieInWatchlist, toggleWatchlist, openTrailer } = useMovies();
  const inWatchlist = isMovieInWatchlist(movie.id);

  if (viewMode === 'list') {
    return (
      <div className="group rounded-2xl bg-[#161710] border border-amber-900/40 hover:border-amber-500/50 p-4 transition-all shadow-lg hover:shadow-amber-950/20 flex flex-col sm:flex-row gap-5">
        {/* Poster */}
        <div className="relative w-full sm:w-40 sm:h-56 aspect-[2/3] sm:aspect-auto rounded-xl overflow-hidden bg-slate-900 shrink-0">
          <img
            src={movie.poster}
            alt={movie.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80";
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Watchlist button */}
          <button
            onClick={() => toggleWatchlist(movie)}
            className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md transition-colors cursor-pointer ${
              inWatchlist
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/40'
                : 'bg-black/60 text-slate-300 hover:text-white hover:bg-black/80'
            }`}
            title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {movie.certification || 'PG-13'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {movie.language}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span>{movie.rating} / 10</span>
                <span className="text-slate-400 font-normal">({movie.votes || '250K'})</span>
              </div>
            </div>

            <Link to={`/movies/${movie.id}`}>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                {movie.title}
              </h3>
            </Link>

            <div className="mt-1 mb-1.5">
              <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                🎬 {movie.fixedScreen || `Screen ${movie.screenNumber || movie.id}`}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1.5 mb-2.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{movie.duration}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{movie.releaseDate}</span>
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{movie.director || 'Filmmaker'}</span>
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
              {movie.description}
            </p>

            {/* Genre tags */}
            <div className="flex flex-wrap gap-1.5">
              {movie.genre?.map((g) => (
                <span
                  key={g}
                  className="px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-4 pt-3 border-t border-amber-950/60 flex items-center justify-between">
            <button
              onClick={() => openTrailer(movie)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>Watch Trailer</span>
            </button>

            <Link
              to={`/movies/${movie.id}`}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/30 transition-all cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Book Tickets</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Grid Layout
  return (
    <div className="group rounded-3xl bg-[#161710] border border-amber-900/40 hover:border-amber-500/50 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-amber-950/20">
      
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <img
          src={movie.poster}
          alt={movie.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80";
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/10">
            {movie.certification || 'PG-13'}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/90 text-slate-950 shadow-md">
            {movie.language}
          </span>
        </div>

        {/* Watchlist Button */}
        <button
          onClick={() => toggleWatchlist(movie)}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
            inWatchlist
              ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/40'
              : 'bg-black/60 text-slate-300 hover:text-white hover:bg-black/80'
          }`}
          title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          <Bookmark className="w-4 h-4 fill-current" />
        </button>

        {/* Floating Quick Trailer Button on Hover */}
        <button
          onClick={() => openTrailer(movie)}
          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl shadow-amber-500/50 hover:scale-110 cursor-pointer"
          title="Watch Trailer"
        >
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </button>

        {/* Bottom Banner Over Poster */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-amber-400 font-bold border border-amber-500/20">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{movie.rating}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-300 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{movie.duration}</span>
          </div>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Genre tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {movie.genre?.slice(0, 2).map((g) => (
              <span
                key={g}
                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300"
              >
                {g}
              </span>
            ))}
            {movie.genre?.length > 2 && (
              <span className="text-[10px] text-slate-400 self-center">
                +{movie.genre.length - 2}
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={`/movies/${movie.id}`}>
            <h3 className="font-bold text-white text-base leading-snug group-hover:text-amber-400 transition-colors line-clamp-1 mb-1">
              {movie.title}
            </h3>
          </Link>

          {/* Dedicated Fixed Screen Badge */}
          <div className="mb-2">
            <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 truncate max-w-full">
              🎬 {movie.fixedScreen || `Screen ${movie.screenNumber || movie.id}`}
            </span>
          </div>

          {/* Release Date */}
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-2">
            <Calendar className="w-3 h-3 text-amber-400" />
            <span>Released {movie.releaseDate}</span>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {movie.description}
          </p>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-amber-950/60 flex items-center justify-between gap-2">
          <button
            onClick={() => openTrailer(movie)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12130d] hover:bg-amber-950/40 text-slate-200 hover:text-white text-xs font-semibold border border-amber-900/40 transition-colors cursor-pointer"
          >
            <Play className="w-3 h-3 text-amber-400 fill-current" />
            <span>Trailer</span>
          </button>

          <Link
            to={`/movies/${movie.id}`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/30 transition-all cursor-pointer"
          >
            <Ticket className="w-3 h-3" />
            <span>Book Now</span>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default MovieCard;
