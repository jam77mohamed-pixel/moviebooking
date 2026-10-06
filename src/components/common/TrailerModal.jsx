import React, { useEffect } from 'react';
import { X, Play, Ticket, Star, Calendar, Clock } from 'lucide-react';
import { useMovies } from '../../context/MovieContext';
import { useNavigate } from 'react-router-dom';

const TrailerModal = () => {
  const { trailerModal, closeTrailer } = useMovies();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeTrailer();
      }
    };
    if (trailerModal.isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [trailerModal.isOpen, closeTrailer]);

  if (!trailerModal.isOpen || !trailerModal.movie) return null;

  const { movie } = trailerModal;

  const handleBookNow = () => {
    closeTrailer();
    navigate(`/movies/${movie.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md transition-all animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#161710] border border-amber-900/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-950/60 bg-[#12130d]">
          <div className="flex items-center space-x-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400">
              <Play className="w-4 h-4 fill-current" />
            </span>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg leading-tight">
                {movie.title} - Official Trailer
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {movie.certification} • {movie.duration} • {movie.language}
              </p>
            </div>
          </div>
          <button
            onClick={closeTrailer}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Trailer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative w-full bg-black aspect-video flex items-center justify-center">
          {movie.trailerId ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${movie.trailerId}?autoplay=1&rel=0&modestbranding=1`}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8 bg-slate-900">
              <img
                src={movie.backdrop || movie.poster}
                alt={movie.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&q=80";
                }}
                className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-xs"
              />
              <div className="relative z-10 max-w-md">
                <Play className="w-16 h-16 text-amber-400 mx-auto mb-3" />
                <h4 className="text-xl font-bold text-white mb-2">Trailer Preview</h4>
                <p className="text-sm text-slate-300 mb-4">
                  Official high-definition trailer streaming preview for {movie.title}.
                </p>
                <button
                  onClick={handleBookNow}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-bold rounded-xl text-sm transition-all cursor-pointer shadow-md shadow-amber-500/30"
                >
                  View Movie Details
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Details & Actions */}
        <div className="p-4 sm:p-5 bg-[#12130d] border-t border-amber-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{movie.rating} / 10</span>
            </div>

            <div className="flex items-center space-x-1 text-slate-400 text-xs">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{movie.releaseDate}</span>
            </div>

            <div className="flex items-center space-x-1 text-slate-400 text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{movie.duration}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5">
              {movie.genre?.map((g, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={closeTrailer}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleBookNow}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Tickets</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
