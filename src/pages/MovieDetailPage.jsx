import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Calendar, 
  Globe, 
  Play, 
  Bookmark, 
  Ticket, 
  Share2, 
  CheckCircle2, 
  Users,
  MapPin,
  Clapperboard,
  Tv
} from 'lucide-react';
import { movieService } from '../api/movieApi';
import { useMovies } from '../context/MovieContext';
import { toast } from 'react-toastify';

// Stepped Date & Time Schedule matching Screen 1 Reference Model
const STEPPED_SCHEDULE = [
  { day: 'Thu', date: '21', time: '16:00', label: '04:00 PM' },
  { day: 'Fri', date: '21', time: '17:00', label: '05:00 PM' },
  { day: 'Sat', date: '21', time: '18:00', label: '06:00 PM', isElevated: true },
  { day: 'Sun', date: '21', time: '19:00', label: '07:00 PM' },
  { day: 'Mon', date: '21', time: '20:00', label: '08:00 PM' }
];

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isMovieInWatchlist, toggleWatchlist, openTrailer } = useMovies();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('IMAX 70MM');
  const [selectedTime, setSelectedTime] = useState('06:00 PM');
  const [selectedTheatre, setSelectedTheatre] = useState('PVR Superplex IMAX, Times Square');
  const [selectedScheduleIndex, setSelectedScheduleIndex] = useState(2);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(2);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await movieService.getMovieById(id);
        setMovie(data);
        if (data.formats?.length) setSelectedFormat(data.formats[0]);
        if (data.showtimes?.length) setSelectedTime(data.showtimes[0]);
      } catch (err) {
        setError(err.message || 'Movie not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 space-y-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-8 bg-slate-800 rounded w-36 mb-4" />
        <div className="h-96 bg-slate-800/80 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 bg-slate-800 rounded-2xl" />
          <div className="h-48 bg-slate-800 rounded-2xl" />
          <div className="h-48 bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="p-12 text-center max-w-lg mx-auto bg-[#161710] rounded-3xl border border-amber-900/40 my-10">
        <Clapperboard className="w-12 h-12 text-amber-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Movie Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">{error || 'Unable to retrieve movie details.'}</p>
        <Link
          to="/movies"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/30"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Catalogue</span>
        </Link>
      </div>
    );
  }

  const inWatchlist = isMovieInWatchlist(movie.id);
  const totalPrice = ((movie.basePrice || 16.50) * ticketQuantity).toFixed(2);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Movie link copied to clipboard!');
    }
  };

  const handleConfirmBooking = () => {
    setIsBookingModalOpen(false);
    toast.success(`Booking Confirmed! ${ticketQuantity} tickets reserved for ${movie.title} at ${selectedTime}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-12">
      
      {/* Back button */}
      <div>
        <Link
          to="/movies"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movies</span>
        </Link>
      </div>

      {/* Hero Backdrop Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-900/40 shadow-2xl bg-slate-950">
        
        {/* Backdrop Image */}
        <div className="relative h-72 sm:h-96 lg:h-[460px] w-full">
          <img
            src={movie.backdrop || movie.poster}
            alt={movie.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&q=80";
            }}
            className="w-full h-full object-cover object-top opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e09] via-[#0d0e09]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0e09] via-[#0d0e09]/80 to-transparent" />
        </div>

        {/* Floating Content Over Backdrop */}
        <div className="absolute inset-0 p-6 sm:p-8 lg:p-10 flex flex-col justify-end">
          <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start md:items-end">
            
            {/* Poster Thumbnail */}
            <div className="relative w-32 sm:w-44 lg:w-56 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-2xl shrink-0 group">
              <img
                src={movie.poster}
                alt={movie.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80";
                }}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => openTrailer(movie)}
                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-amber-500/50 hover:scale-110 cursor-pointer"
                title="Watch Trailer"
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </button>
            </div>

            {/* Title & Metadata */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500/90 text-slate-950 shadow">
                  {movie.certification || 'PG-13'}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {movie.language}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-gradient-to-r from-amber-600/30 to-yellow-600/30 text-amber-300 border border-amber-500/40">
                  🎬 {movie.fixedScreen || `Screen ${movie.screenNumber || movie.id}`}
                </span>
                {movie.formats?.map((fmt) => (
                  <span
                    key={fmt}
                    className="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  >
                    {fmt}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="text-xs sm:text-sm font-medium italic text-slate-300">
                  "{movie.tagline}"
                </p>
              )}

              {/* Meta stats */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-300 pt-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-white text-base">{movie.rating}</span>
                  <span className="text-slate-400 font-normal">/ 10 ({movie.votes || '300K'} votes)</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{movie.duration}</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>{movie.releaseDate}</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span>Dir. {movie.director}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => openTrailer(movie)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Watch Trailer</span>
                </button>

                <button
                  onClick={() => toggleWatchlist(movie)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                    inWatchlist
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-[#161710] border-amber-900/40 text-slate-200 hover:bg-amber-950/30'
                  }`}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                  <span>{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl bg-[#161710] border border-amber-900/40 text-slate-300 hover:text-white transition-colors"
                  title="Share Movie Link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Main Grid: Synopsis & Cast (Left 8 Cols) + Booking & Showtimes (Right 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Synopsis, Cast, Specifications */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Storyline / Synopsis */}
          <div className="p-6 rounded-3xl bg-[#161710] border border-amber-900/40 shadow-xl space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clapperboard className="w-5 h-5 text-amber-400" />
              <span>Synopsis & Storyline</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {isDescriptionExpanded
                ? movie.description
                : (movie.description?.length > 150 ? movie.description.slice(0, 150) + '...' : movie.description)}
              {movie.description?.length > 150 && (
                <button
                  type="button"
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="ml-2 font-bold text-amber-400 hover:text-amber-300 cursor-pointer text-xs"
                >
                  {isDescriptionExpanded ? 'Read Less' : 'Read More...'}
                </button>
              )}
            </p>

            <div className="pt-3 flex flex-wrap gap-2">
              {movie.genre?.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#12130d] text-slate-200 border border-amber-900/30"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Lead Cast & Crew */}
          <div className="p-6 rounded-3xl bg-[#161710] border border-amber-900/40 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>Top Billed Cast</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {movie.cast?.map((actor, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[#12130d] border border-amber-900/30 text-center flex flex-col items-center">
                  <img
                    src={actor.avatar}
                    alt={actor.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80";
                    }}
                    className="w-16 h-16 rounded-full object-cover mb-2 ring-2 ring-amber-900/40"
                  />
                  <h4 className="text-xs font-bold text-white line-clamp-1">{actor.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{actor.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="p-6 rounded-3xl bg-[#161710] border border-amber-900/40 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4">Cinema Presentation Specs</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-[#12130d] border border-amber-900/30">
                <span className="text-slate-400 block mb-1">Aspect Ratio</span>
                <span className="font-bold text-white">1.90:1 (IMAX Expanded)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#12130d] border border-amber-900/30">
                <span className="text-slate-400 block mb-1">Sound Mix</span>
                <span className="font-bold text-white">Dolby Atmos / 12-Track</span>
              </div>
              <div className="p-3 rounded-xl bg-[#12130d] border border-amber-900/30">
                <span className="text-slate-400 block mb-1">Color Grading</span>
                <span className="font-bold text-white">Dolby Vision HDR</span>
              </div>
              <div className="p-3 rounded-xl bg-[#12130d] border border-amber-900/30">
                <span className="text-slate-400 block mb-1">Base Ticket</span>
                <span className="font-bold text-emerald-400">${movie.basePrice || 16.50}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Ticket Reservation & Showtimes */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-[#161710] border border-amber-900/40 shadow-2xl sticky top-24 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/30">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Ticket className="w-5 h-5 text-amber-400" />
                <span>Book Tickets</span>
              </h3>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Selling Fast
              </span>
            </div>

            {/* Dedicated Multiplex Auditorium Screen */}
            <div className="p-3.5 rounded-2xl bg-[#12130d] border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Dedicated Multiplex Screen</span>
                <span className="text-xs font-mono font-bold text-amber-300">
                  🎬 {movie.fixedScreen || `Screen ${movie.screenNumber || movie.id}`}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                FIXED SCREEN
              </span>
            </div>

            {/* Select Cinema Format */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Experience Format
              </label>
              <div className="flex flex-wrap gap-2">
                {(movie.formats || ['IMAX 70MM', 'Dolby Cinema', 'RealD 3D']).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedFormat === fmt
                        ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                        : 'bg-[#12130d] text-slate-300 border border-amber-900/40 hover:bg-[#1a1c12]'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Theatre */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Partner Cinema
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#12130d] border border-amber-900/40 text-xs text-slate-200">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <select
                  value={selectedTheatre}
                  onChange={(e) => setSelectedTheatre(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-xs text-slate-200 cursor-pointer"
                >
                  <option value="PVR Superplex IMAX, Times Square" className="bg-[#12130d]">
                    PVR Superplex IMAX, Times Square
                  </option>
                  <option value="AMC Empire Grand, Hollywood Blvd" className="bg-[#12130d]">
                    AMC Empire Grand, Hollywood Blvd
                  </option>
                  <option value="Cinepolis Premiere Multiplex, Downtown" className="bg-[#12130d]">
                    Cinepolis Premiere Multiplex, Downtown
                  </option>
                </select>
              </div>
            </div>

            {/* Stepped Date & Time Schedule Matching Screen 1 Reference Model */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                  Select Date and Time
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {STEPPED_SCHEDULE[selectedScheduleIndex]?.label}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 items-end pt-2">
                {STEPPED_SCHEDULE.map((item, idx) => {
                  const isSelected = selectedScheduleIndex === idx;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5">
                      {/* Stepped Day & Date Card */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedScheduleIndex(idx);
                          setSelectedTime(item.label);
                        }}
                        className={`w-full py-2.5 px-1 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/40 -translate-y-2 ring-2 ring-amber-300'
                            : 'bg-[#12130d] border border-amber-900/40 text-slate-300 hover:border-amber-500/40 hover:text-white'
                        }`}
                      >
                        <span className={`text-[10px] uppercase font-bold ${isSelected ? 'text-slate-950' : 'text-slate-400'}`}>
                          {item.day}
                        </span>
                        <span className={`text-base font-black ${isSelected ? 'text-slate-950' : 'text-white'}`}>
                          {item.date}
                        </span>
                      </button>

                      {/* Lower Showtime Pill */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedScheduleIndex(idx);
                          setSelectedTime(item.label);
                        }}
                        className={`w-full py-1 px-0.5 rounded-xl text-[10px] font-mono font-bold transition-all text-center cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 shadow-md ring-1 ring-amber-300'
                            : 'bg-[#12130d] text-slate-400 border border-amber-900/40 hover:text-slate-200'
                        }`}
                      >
                        {item.time}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ticket Counter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Number of Tickets
                </label>
                <span className="text-xs text-slate-400 font-mono">Max 6 per booking</span>
              </div>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => setTicketQuantity(num)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      ticketQuantity === num
                        ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                        : 'bg-[#12130d] text-slate-400 hover:text-white border border-amber-900/40'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-3.5 rounded-2xl bg-[#12130d] border border-amber-900/40 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Base Price ({ticketQuantity}x)</span>
                <span>${(movie.basePrice * ticketQuantity).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Convenience Fee</span>
                <span className="text-emerald-400 font-medium">FREE (Member Benefit)</span>
              </div>
              <div className="pt-2 border-t border-amber-900/30 flex justify-between font-bold text-white text-sm">
                <span>Total Amount</span>
                <span className="text-amber-400">${totalPrice}</span>
              </div>
            </div>

            {/* Screen 1 Reference: Reservation Button */}
            <button
              onClick={() => {
                const activeSlot = STEPPED_SCHEDULE[selectedScheduleIndex];
                const query = new URLSearchParams({
                  movieId: movie.id,
                  movieTitle: movie.title,
                  theatreId: 'th-1',
                  time: activeSlot ? activeSlot.label : selectedTime,
                  format: selectedFormat
                });
                navigate(`/seat-selection?${query.toString()}`);
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] border border-amber-400/80 active:scale-95"
            >
              <Ticket className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>Reservation</span>
            </button>

          </div>
        </div>

      </div>

      {/* Fast Checkout Confirmation Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-[#161710] border border-amber-900/40 rounded-3xl shadow-2xl p-6 overflow-hidden space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/30">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Booking Confirmation</h3>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#12130d] border border-amber-900/40 flex gap-3">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80";
                  }}
                  className="w-14 h-20 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">{movie.title}</h4>
                  <p className="text-slate-400">{selectedFormat} • {movie.language}</p>
                  <p className="text-amber-400 font-semibold mt-1">{selectedTheatre}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="p-2.5 rounded-xl bg-[#12130d] border border-amber-900/30">
                  <span className="text-[10px] text-slate-400 block">Showtime</span>
                  <span className="font-bold text-white">{selectedTime}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#12130d] border border-amber-900/30">
                  <span className="text-[10px] text-slate-400 block">Seats</span>
                  <span className="font-bold text-amber-400">{ticketQuantity} Recliner Seats</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Instant QR ticket will be sent to your email & SMS.</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-amber-900/40 text-slate-300 font-medium text-xs hover:bg-[#12130d]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30"
              >
                Confirm (${totalPrice})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MovieDetailPage;
