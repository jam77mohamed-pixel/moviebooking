import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clapperboard, 
  MapPin, 
  Search, 
  SlidersHorizontal, 
  Phone, 
  Tv, 
  Clock, 
  Star, 
  ChevronRight,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { movieService } from '../api/movieApi';
import { getMovieFixedScreen } from '../api/mockData';
import { useTheme } from '../context/ThemeContext';
import Pagination from '../components/movies/Pagination';
import EmptyState from '../components/common/EmptyState';

const CITIES = ['All', 'New York', 'Los Angeles', 'Chicago', 'San Francisco', 'Miami', 'London', 'Dallas'];

const TheatresPage = () => {
  const navigate = useNavigate();
  const { activeCity } = useTheme();
  const [theatres, setTheatres] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [city, setCity] = useState(activeCity || 'All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Sync when activeCity changes in header
  useEffect(() => {
    if (activeCity) {
      setCity(activeCity);
      setPage(1);
    }
  }, [activeCity]);

  const fetchTheatres = async () => {
    setLoading(true);
    try {
      const res = await movieService.getTheatres({
        city,
        search,
        page,
        limit: 4
      });
      setTheatres(res.theatres);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to load theatres', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheatres();
  }, [city, search, page]);

  const handleShowtimeClick = (theatre, show, time) => {
    // Navigate directly into Module 5 Seat Selection
    const query = new URLSearchParams({
      theatreId: theatre.id,
      theatreName: theatre.name,
      movieId: show.movieId,
      movieTitle: show.movieTitle,
      format: show.format,
      time: time,
      price: show.price || 18
    });
    navigate(`/seat-selection?${query.toString()}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-amber-950/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Theatres & Multiplex Venues
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {totalCount} Locations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Discover verified premium multiplex screens (IMAX 70MM, 4DX, Dolby Atmos) with instant real-time seat booking.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#161710] border border-amber-900/40 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Live Multiplex Seat Availability</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search multiplexes by name, location or screen format..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-[#12130d] text-sm text-slate-200 placeholder-slate-400 rounded-xl border border-amber-900/40 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
          />
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCity(c);
                setPage(1);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                city === c
                  ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/30 font-black scale-[1.02]'
                  : 'bg-[#12130d] text-slate-300 hover:text-white hover:bg-amber-950/30 border border-amber-900/40'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-72 rounded-2xl bg-slate-900/50 border border-slate-800/60 animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && theatres.length === 0 && (
        <EmptyState
          title="No Multiplex Theatres Found"
          message={`We couldn't locate any venues matching "${search || city}". Try searching by another city or format.`}
          onReset={() => {
            setSearch('');
            setCity('All');
            setPage(1);
          }}
        />
      )}

      {/* Theatres Listing Grid */}
      {!loading && theatres.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          {theatres.map((theatre) => (
            <div
              key={theatre.id}
              className="rounded-2xl bg-[#161710] border border-amber-900/40 hover:border-amber-500/50 transition-all shadow-xl hover:shadow-amber-950/20 overflow-hidden group flex flex-col lg:flex-row"
            >
              {/* Theatre Image & Quick Badges */}
              <div className="lg:w-72 h-52 lg:h-auto relative shrink-0 overflow-hidden bg-slate-950">
                <img
                  src={theatre.image}
                  alt={theatre.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80";
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161710] via-transparent to-black/40 lg:hidden" />
                
                {/* Rating Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-amber-900/40 text-xs font-bold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{theatre.rating}</span>
                </div>

                {/* City Tag */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/90 text-slate-950 text-[11px] font-bold shadow-md">
                  <MapPin className="w-3 h-3" />
                  <span>{theatre.city}</span>
                </div>
              </div>

              {/* Theatre Information & Screening Details */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                        {theatre.name}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{theatre.address}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-[#12130d] border border-amber-900/40 text-slate-300">
                        {theatre.screens} Screens
                      </span>
                      <a
                        href={`tel:${theatre.contact}`}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#12130d] hover:bg-amber-950/30 border border-amber-900/40 text-xs text-slate-400 hover:text-white transition-colors"
                      >
                        <Phone className="w-3 h-3 text-amber-400" />
                        <span>{theatre.contact}</span>
                      </a>
                    </div>
                  </div>

                  {/* Formats and Amenities */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    {theatre.formats.map((fmt) => (
                      <span
                        key={fmt}
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      >
                        {fmt}
                      </span>
                    ))}
                    {theatre.amenities && theatre.amenities.map((am) => (
                      <span
                        key={am}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800/60 text-slate-400 border border-slate-800"
                      >
                        {am}
                      </span>
                    ))}
                  </div>

                  {/* Available Shows & Clickable Timings */}
                  <div className="mt-5 pt-4 border-t border-amber-950/60 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Available Shows Today (Click showtime to select seats):</span>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {theatre.shows && theatre.shows.map((show, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-[#12130d] border border-amber-900/40 flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-bold text-white truncate">
                              {show.movieTitle}
                            </span>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0">
                              🎬 {getMovieFixedScreen(show.movieId)?.fixedScreen || `Screen ${show.movieId || 1}`}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {show.times.map((t, tIdx) => {
                              // Real-time status: e.g. alternate between Fast Filling and Available
                              const isFastFilling = tIdx % 2 === 1;
                              return (
                                <button
                                  key={t}
                                  onClick={() => handleShowtimeClick(theatre, show, t)}
                                  className="group/time px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-gradient-to-r hover:from-amber-600 hover:via-amber-500 hover:to-yellow-500 hover:text-slate-950 text-slate-200 border border-amber-900/40 hover:border-transparent transition-all cursor-pointer shadow-sm hover:scale-105 flex items-center gap-1.5"
                                  title={`Book seats for ${show.movieTitle} at ${t}`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${isFastFilling ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                                  <span>{t}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Instant Digital E-Ticket Generation</span>
                  </span>
                  <span className="font-semibold text-slate-300">
                    Admission from ${theatre.shows?.[0]?.price || 18}.00
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalCount={totalCount}
            limit={4}
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}

    </div>
  );
};

export default TheatresPage;
