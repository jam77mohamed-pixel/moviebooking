import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MovieContext = createContext(null);

const STORAGE_KEY_WATCHLIST = 'cinepass_watchlist';

export const MovieProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WATCHLIST);
      return saved ? JSON.parse(saved) : [1, 2]; // Dune 2 & Oppenheimer by default
    } catch {
      return [1, 2];
    }
  });

  const [trailerModal, setTrailerModal] = useState({
    isOpen: false,
    movie: null
  });

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WATCHLIST, JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (movie) => {
    if (!movie) return;
    const exists = watchlist.includes(movie.id);
    if (exists) {
      setWatchlist((prev) => prev.filter((id) => id !== movie.id));
      toast.info(`Removed "${movie.title}" from your Watchlist`);
    } else {
      setWatchlist((prev) => [...prev, movie.id]);
      toast.success(`Added "${movie.title}" to your Watchlist!`);
    }
  };

  const isMovieInWatchlist = (movieId) => watchlist.includes(movieId);

  const openTrailer = (movie) => {
    if (!movie) return;
    setTrailerModal({ isOpen: true, movie });
  };

  const closeTrailer = () => {
    setTrailerModal({ isOpen: false, movie: null });
  };

  return (
    <MovieContext.Provider
      value={{
        watchlist,
        toggleWatchlist,
        isMovieInWatchlist,
        trailerModal,
        openTrailer,
        closeTrailer
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};
