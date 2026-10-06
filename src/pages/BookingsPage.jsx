import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Eye, 
  Ban, 
  Download, 
  Printer, 
  Film,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { toast } from 'react-toastify';
import { movieService } from '../api/movieApi';
import MobileTicketCard from '../components/common/MobileTicketCard';
import EmptyState from '../components/common/EmptyState';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');
  
  // Modal states
  const [activeTicket, setActiveTicket] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);

  // Load bookings on mount
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    const list = movieService.getUserBookings();
    setBookings(list);
  };

  // Extract unique movies for filter dropdown
  const uniqueMovies = ['All', ...new Set(bookings.map((b) => b.movie || b.movieTitle).filter(Boolean))];

  // Filtering
  const filteredBookings = bookings.filter((b) => {
    const title = (b.movie || b.movieTitle || '').toLowerCase();
    const id = (b.id || b.bookingId || '').toLowerCase();
    const theatre = (b.theatre || b.theatreName || '').toLowerCase();
    const query = searchTerm.toLowerCase();

    const matchesSearch = !searchTerm || title.includes(query) || id.includes(query) || theatre.includes(query);
    const matchesMovie = selectedMovie === 'All' || (b.movie || b.movieTitle) === selectedMovie;
    const matchesStatus = selectedStatus === 'All' || (b.status || 'Confirmed') === selectedStatus;
    const matchesDate = !selectedDate || (b.date && b.date.includes(selectedDate)) || (b.createdAt && b.createdAt.includes(selectedDate));

    return matchesSearch && matchesMovie && matchesStatus && matchesDate;
  });

  // Handle Cancel Booking
  const handleConfirmCancel = () => {
    if (!cancelModalBooking) return;
    const bId = cancelModalBooking.id || cancelModalBooking.bookingId;
    const updated = movieService.cancelBooking(bId);
    setBookings(updated);
    toast.success(`Booking #${bId} has been successfully cancelled. Refund initiated.`);
    setCancelModalBooking(null);
  };

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmed</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-amber-950/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Booking History & E-Tickets
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              {filteredBookings.length} Total Passes
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your past and upcoming cinema reservations, download digital passes, or inspect verified barcodes.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#161710] border border-amber-900/40 text-xs text-slate-300">
          <Ticket className="w-4 h-4 text-amber-400" />
          <span>Verified Digital Box Office</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-lg space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Movie, ID, or Theatre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#12130d] text-xs text-slate-200 placeholder-slate-400 rounded-xl border border-amber-900/40 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Filter by Movie */}
          <div className="relative">
            <Film className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
            <select
              value={selectedMovie}
              onChange={(e) => setSelectedMovie(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-[#12130d] text-xs text-slate-200 rounded-xl border border-amber-900/40 focus:border-amber-500 focus:outline-none cursor-pointer appearance-none"
            >
              <option value="All" className="bg-[#12130d]">All Movies</option>
              {uniqueMovies.filter((m) => m !== 'All').map((m) => (
                <option key={m} value={m} className="bg-[#12130d]">
                  {m}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Filter by Status */}
          <div className="relative">
            <SlidersHorizontal className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-[#12130d] text-xs text-slate-200 rounded-xl border border-amber-900/40 focus:border-amber-500 focus:outline-none cursor-pointer appearance-none"
            >
              <option value="All" className="bg-[#12130d]">All Statuses</option>
              <option value="Confirmed" className="bg-[#12130d]">Confirmed</option>
              <option value="Completed" className="bg-[#12130d]">Completed</option>
              <option value="Cancelled" className="bg-[#12130d]">Cancelled</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Filter by Date */}
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#12130d] text-xs text-slate-200 rounded-xl border border-amber-900/40 focus:border-amber-500 focus:outline-none cursor-pointer"
            />
          </div>

        </div>

        {/* Clear Filters Helper */}
        {(searchTerm || selectedMovie !== 'All' || selectedStatus !== 'All' || selectedDate) && (
          <div className="flex items-center justify-between pt-2 border-t border-amber-900/30 text-xs">
            <span className="text-slate-400">Filters active</span>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedMovie('All');
                setSelectedStatus('All');
                setSelectedDate('');
              }}
              className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          title="No Cinema Bookings Found"
          message="No reservations match your current search or filter criteria."
          onReset={() => {
            setSearchTerm('');
            setSelectedMovie('All');
            setSelectedStatus('All');
            setSelectedDate('');
          }}
        />
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const bId = b.id || b.bookingId;
            const title = b.movie || b.movieTitle;
            const theatre = b.theatre || b.theatreName;
            const time = b.showTime || b.showtime;
            const seats = Array.isArray(b.seats) ? b.seats : Array.isArray(b.selectedSeats) ? b.selectedSeats : [];
            const isCancelled = b.status === 'Cancelled';

            return (
              <div
                key={bId}
                className="p-5 sm:p-6 rounded-2xl bg-[#161710] border border-amber-900/40 hover:border-amber-500/40 transition-all shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 group"
              >
                {/* Left: Poster + Details */}
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <img
                    src={b.poster || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80'}
                    alt={title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80";
                    }}
                    className="w-16 h-22 rounded-xl object-cover shrink-0 ring-1 ring-amber-900/40 shadow-md group-hover:scale-105 transition-transform"
                  />

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-white text-base truncate">
                        {title}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#12130d] text-amber-300 border border-amber-900/40">
                        {bId}
                      </span>
                      {renderStatusBadge(b.status || 'Confirmed')}
                    </div>

                    <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{theatre}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>{b.date || 'Today'}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{time}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Seats: <strong className="text-amber-300">{seats.join(', ') || 'General Admission'}</strong></span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Price & Action Buttons */}
                <div className="flex items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-amber-900/30">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Amount</span>
                    <span className="text-lg font-black text-amber-400 font-mono">
                      {b.amount || `$${Number(b.grandTotal || 0).toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View E-Ticket Button */}
                    <button
                      type="button"
                      onClick={() => setActiveTicket(b)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-md shadow-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-950" />
                      <span>View Ticket</span>
                    </button>

                    {/* Cancel Booking Button (UI) */}
                    {!isCancelled && (
                      <button
                        type="button"
                        onClick={() => setCancelModalBooking(b)}
                        className="p-2 rounded-xl bg-[#12130d] hover:bg-red-500/10 border border-amber-900/40 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Cancel Booking"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* View E-Ticket Modal Matching Screen 3 Reference */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-[#161710] border border-amber-900/40 rounded-3xl shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/30 mb-2">
              <div>
                <h3 className="font-bold text-white text-base">Mobile E-Ticket</h3>
                <p className="text-[11px] text-slate-400">Scan barcode at cinema entrance</p>
              </div>
              <button
                onClick={() => setActiveTicket(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <MobileTicketCard
              ticket={activeTicket}
              onDownload={() => {
                toast.success(`E-Ticket ${activeTicket.id || activeTicket.bookingId} downloaded!`);
              }}
            />
          </div>
        </div>
      )}

      {/* Cancel Booking Confirmation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-[#161710] border border-amber-900/40 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Confirm Ticket Cancellation</h3>
                <p className="text-xs text-slate-400">
                  Pass #{cancelModalBooking.id || cancelModalBooking.bookingId}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to cancel your reservation for{' '}
              <strong className="text-white">{cancelModalBooking.movie || cancelModalBooking.movieTitle}</strong>?{' '}
              Your seats will be released back to the multiplex seating layout, and your payment will be refunded according to cinema terms.
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="flex-1 py-2.5 rounded-xl border border-amber-900/40 text-slate-300 hover:text-white hover:bg-[#12130d] text-xs font-semibold cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BookingsPage;
