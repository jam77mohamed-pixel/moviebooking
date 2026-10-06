import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Play, Star, ChevronRight, Ticket } from 'lucide-react';
import { useMovies } from '../../context/MovieContext';

const UpcomingMoviesRow = ({ movies = [] }) => {
  const { openTrailer } = useMovies();

  return (
    <div className="rounded-3xl bg-[#161710] border border-amber-900/40 shadow-xl p-5 sm:p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-white">Upcoming Blockbusters</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-950/70 text-amber-300 border border-amber-900/50">
              Advance Booking
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Highly anticipated theatrical releases coming soon to multiplex screens
          </p>
        </div>

        <Link
          to="/movies"
          className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
        >
          <span>View All</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid of Upcoming Movies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="group relative rounded-2xl bg-[#12130d] border border-amber-900/40 hover:border-amber-700/60 overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 shadow-md hover:shadow-amber-950/30"
          >
            {/* Poster Thumbnail */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-800">
              <img
                src={movie.backdrop || movie.poster}
                alt={movie.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&q=80";
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              
              {/* Rating badge */}
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-amber-400 text-[11px] font-bold">
                <Star className="w-3 h-3 fill-current" />
                <span>{movie.rating}</span>
              </div>

              {/* Play Trailer Floating Trigger */}
              <button
                onClick={() => openTrailer(movie)}
                className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-amber-500/40 hover:scale-110 cursor-pointer"
                title="Play Trailer"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-3.5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-white text-sm truncate group-hover:text-amber-400 transition-colors">
                  {movie.title}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>{movie.releaseDate}</span>
                  <span>•</span>
                  <span>{movie.language}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 pt-3 border-t border-amber-950/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => openTrailer(movie)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 text-amber-400 fill-current" />
                  <span>Trailer</span>
                </button>

                <Link
                  to={`/movies/${movie.id}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-[11px] font-bold transition-colors"
                >
                  <Ticket className="w-3 h-3" />
                  <span>Details</span>
                </Link>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default UpcomingMoviesRow;
