import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Film, 
  MapPin, 
  Clock, 
  Calendar, 
  Ticket, 
  Check, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  RefreshCw,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { toast } from 'react-toastify';
import { movieService } from '../api/movieApi';
import { MOCK_MOVIES, MOCK_THEATRES } from '../api/mockData';

// Seat Layout Configuration
const SEAT_ROWS = [
  { row: 'A', tier: 'Executive Recliner', price: 24 },
  { row: 'B', tier: 'Executive Recliner', price: 24 },
  { row: 'C', tier: 'Prime Gold', price: 19 },
  { row: 'D', tier: 'Prime Gold', price: 19 },
  { row: 'E', tier: 'Prime Gold', price: 19 },
  { row: 'F', tier: 'Prime Gold', price: 19 },
  { row: 'G', tier: 'Classic Silver', price: 15 },
  { row: 'H', tier: 'Classic Silver', price: 15 }
];

const SEAT_COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MAX_SEATS_LIMIT = 6;
const DATES = ['Today', 'Tomorrow', 'This Weekend', 'Monday'];

// Cinema Armchair Seat component matching Screen 2 Reference
const CinemaArmchair = ({ state = 'available', seatNumber = '' }) => {
  if (state === 'reserved') {
    return (
      <div className="flex flex-col items-center justify-center transition-all">
        {/* Curved Backrest */}
        <div className="w-5 h-2.5 sm:w-6 sm:h-3 rounded-t-md bg-[#dc2626] border border-red-700 shadow-sm" />
        {/* Cushion Base & Armrests */}
        <div className="w-6 h-3 sm:w-7 sm:h-3.5 rounded-b-md bg-[#dc2626] border-x-2 border-b border-red-700 flex items-center justify-center">
          <span className="text-[9px] font-bold text-white/90">✕</span>
        </div>
      </div>
    );
  }

  if (state === 'selected') {
    return (
      <div className="flex flex-col items-center justify-center scale-110 transition-transform">
        {/* Curved Backrest */}
        <div className="w-5 h-2.5 sm:w-6 sm:h-3 rounded-t-md bg-[#22c55e] border border-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
        {/* Cushion Base & Armrests */}
        <div className="w-6 h-3 sm:w-7 sm:h-3.5 rounded-b-md bg-[#22c55e] border-x-2 border-b border-emerald-400 flex items-center justify-center">
          <span className="text-[9px] font-black text-white">✓</span>
        </div>
      </div>
    );
  }

  // Available (White/Silver cushion)
  return (
    <div className="flex flex-col items-center justify-center transition-transform group-hover/seat:scale-105">
      {/* Curved Backrest */}
      <div className="w-5 h-2.5 sm:w-6 sm:h-3 rounded-t-md bg-white border border-slate-300 shadow-sm" />
      {/* Cushion Base & Armrests */}
      <div className="w-6 h-3 sm:w-7 sm:h-3.5 rounded-b-md bg-white border-x-2 border-b border-slate-300 flex items-center justify-center">
        <span className="text-[8px] font-bold text-slate-800">{seatNumber}</span>
      </div>
    </div>
  );
};

const SeatSelectionPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Selected show parameters from URL query or sensible defaults
  const initialMovieId = Number(searchParams.get('movieId')) || 1;
  const initialTheatreId = searchParams.get('theatreId') || 'th-1';
  const initialTime = searchParams.get('time') || '06:45 PM';
  const initialFormat = searchParams.get('format') || 'IMAX 70MM';

  const [selectedMovie, setSelectedMovie] = useState(
    MOCK_MOVIES.find((m) => m.id === initialMovieId) || MOCK_MOVIES[0]
  );
  const [selectedTheatre, setSelectedTheatre] = useState(
    MOCK_THEATRES.find((t) => t.id === initialTheatreId) || MOCK_THEATRES[0]
  );
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [selectedFormat, setSelectedFormat] = useState(initialFormat);

  // Seat Selection State
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(true);

  // Fetch already booked seats for this specific screening (Prevents Duplicate Bookings)
  const fetchBooked = async () => {
    setLoadingSeats(true);
    try {
      const booked = await movieService.getBookedSeats({
        theatreId: selectedTheatre.id,
        movieId: selectedMovie.id,
        showtime: selectedTime,
        date: selectedDate
      });
      setBookedSeats(booked);
      // Remove any previously selected seats that might be booked in this slot
      setSelectedSeats((prev) => prev.filter((s) => !booked.includes(s.id)));
    } catch (err) {
      console.error('Failed to load booked seats', err);
    } finally {
      setLoadingSeats(false);
    }
  };

  useEffect(() => {
    fetchBooked();
  }, [selectedTheatre.id, selectedMovie.id, selectedTime, selectedDate]);

  // Handle Seat Toggle
  const handleSeatClick = (seatId, seatPrice, tier) => {
    if (bookedSeats.includes(seatId)) {
      toast.warn(`Seat ${seatId} is already booked for this show.`);
      return;
    }

    if (selectedSeats.some((s) => s.id === seatId)) {
      // Deselect
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seatId));
    } else {
      // Check maximum seat limit
      if (selectedSeats.length >= MAX_SEATS_LIMIT) {
        toast.info(`You can select a maximum of ${MAX_SEATS_LIMIT} seats per booking.`);
        return;
      }
      setSelectedSeats((prev) => [...prev, { id: seatId, price: seatPrice, tier }]);
    }
  };

  // Price Calculations
  const seatSubtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = selectedSeats.length > 0 ? selectedSeats.length * 1.50 : 0;
  const taxes = selectedSeats.length > 0 ? (seatSubtotal * 0.08) : 0;
  const grandTotal = seatSubtotal + convenienceFee + taxes;

  const handleProceedToBooking = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least 1 seat before proceeding.');
      return;
    }

    // Pass data into Module 6 Booking Confirmation
    const bookingPayload = {
      movieId: selectedMovie.id,
      movieTitle: selectedMovie.title,
      poster: selectedMovie.poster,
      theatreId: selectedTheatre.id,
      theatreName: selectedTheatre.name,
      theatreAddress: selectedTheatre.address,
      date: selectedDate,
      showtime: selectedTime,
      format: selectedFormat,
      selectedSeats: selectedSeats.map((s) => s.id),
      seatTiers: [...new Set(selectedSeats.map((s) => s.tier))].join(', '),
      seatCount: selectedSeats.length,
      seatSubtotal: Number(seatSubtotal.toFixed(2)),
      convenienceFee: Number(convenienceFee.toFixed(2)),
      taxes: Number(taxes.toFixed(2)),
      grandTotal: Number(grandTotal.toFixed(2))
    };

    // Save temporary booking session in both sessionStorage and localStorage
    sessionStorage.setItem('cinepass_pending_booking', JSON.stringify(bookingPayload));
    localStorage.setItem('cinepass_pending_booking', JSON.stringify(bookingPayload));
    navigate('/booking/confirmation');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Breadcrumb & Screening Selector Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Left: Movie & Venue Details */}
        <div className="flex items-center gap-3.5">
          <Link
            to="/theatres"
            className="p-2 rounded-xl bg-[#12130d] border border-amber-900/40 text-slate-400 hover:text-white transition-colors"
            title="Back to Theatres"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <img
            src={selectedMovie.poster}
            alt={selectedMovie.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80";
            }}
            className="w-12 h-16 rounded-lg object-cover ring-1 ring-amber-900/40 shrink-0"
          />

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white truncate max-w-[240px] sm:max-w-md">
                {selectedMovie.title}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {selectedFormat}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{selectedTheatre.name} • {selectedTheatre.city}</span>
            </p>
          </div>
        </div>

        {/* Right: Date & Show Time Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Picker */}
          <div className="flex items-center bg-[#12130d] rounded-xl p-1 border border-amber-900/40">
            {DATES.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedDate === d
                    ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Time Picker */}
          <div className="flex items-center bg-[#12130d] rounded-xl p-1 border border-amber-900/40">
            {['11:00 AM', '02:30 PM', '06:45 PM', '10:15 PM'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedTime === t
                    ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Main Seat Selection Arena */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Left Column (2 Cols): Interactive Seat Layout Grid */}
        <div className="xl:col-span-2 p-6 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-2xl flex flex-col items-center">
          
          {/* Cinema Screen Curved Projection Banner Matching Reference Screen 2 */}
          <div className="w-full max-w-md mx-auto mb-10 text-center">
            <div className="relative flex flex-col items-center">
              {/* Arched glowing golden line */}
              <div className="w-56 sm:w-72 h-8 border-t-[3px] border-amber-400/90 rounded-t-[120px] shadow-[0_-8px_25px_rgba(245,158,11,0.6)]" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300 -mt-2">
                The Screen
              </span>
            </div>
          </div>

          {/* Seat State Legend (Matching Reference Screen 2: White=Available, Red=Reserved, Green=Selected) */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-xs font-semibold">
            <div className="flex items-center gap-2 text-slate-200">
              <span className="w-3.5 h-3.5 rounded-full bg-white border border-slate-300 shadow-sm" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <span className="w-3.5 h-3.5 rounded-full bg-[#dc2626] border border-red-700 shadow-sm" />
              <span>Reserved</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <span className="w-3.5 h-3.5 rounded-full bg-[#22c55e] border border-emerald-400 shadow-sm" />
              <span>Selected ({selectedSeats.length})</span>
            </div>
          </div>

          {/* Seat Matrix Grid */}
          <div className="w-full overflow-x-auto pb-4 flex justify-center scrollbar-none">
            <div className="min-w-[480px] space-y-3">
              {SEAT_ROWS.map(({ row, tier, price }) => {
                return (
                  <div key={row} className="flex items-center justify-center gap-2">
                    {/* Row Label */}
                    <span className="w-6 text-center text-xs font-bold text-slate-400">
                      {row}
                    </span>

                    {/* Left Seats (1 - 4) */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {SEAT_COLS.slice(0, 4).map((col) => {
                        const seatId = `${row}${col}`;
                        const isBooked = bookedSeats.includes(seatId);
                        const isSelected = selectedSeats.some((s) => s.id === seatId);
                        const seatState = isBooked ? 'reserved' : isSelected ? 'selected' : 'available';

                        return (
                          <button
                            key={seatId}
                            type="button"
                            disabled={isBooked}
                            onClick={() => handleSeatClick(seatId, price, tier)}
                            className={`p-1 rounded-lg flex items-center justify-center transition-all group/seat ${
                              isBooked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:scale-110'
                            }`}
                            title={`Seat ${seatId} (${tier}) - $${price} • ${seatState.toUpperCase()}`}
                          >
                            <CinemaArmchair state={seatState} seatNumber={col} />
                          </button>
                        );
                      })}
                    </div>

                    {/* Center Aisle Spacer */}
                    <div className="w-4 sm:w-6" />

                    {/* Middle Seats (5 - 8) */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {SEAT_COLS.slice(4, 8).map((col) => {
                        const seatId = `${row}${col}`;
                        const isBooked = bookedSeats.includes(seatId);
                        const isSelected = selectedSeats.some((s) => s.id === seatId);
                        const seatState = isBooked ? 'reserved' : isSelected ? 'selected' : 'available';

                        return (
                          <button
                            key={seatId}
                            type="button"
                            disabled={isBooked}
                            onClick={() => handleSeatClick(seatId, price, tier)}
                            className={`p-1 rounded-lg flex items-center justify-center transition-all group/seat ${
                              isBooked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:scale-110'
                            }`}
                            title={`Seat ${seatId} (${tier}) - $${price} • ${seatState.toUpperCase()}`}
                          >
                            <CinemaArmchair state={seatState} seatNumber={col} />
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Aisle Spacer */}
                    <div className="w-4 sm:w-6" />

                    {/* Right Seats (9 - 12) */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {SEAT_COLS.slice(8, 12).map((col) => {
                        const seatId = `${row}${col}`;
                        const isBooked = bookedSeats.includes(seatId);
                        const isSelected = selectedSeats.some((s) => s.id === seatId);
                        const seatState = isBooked ? 'reserved' : isSelected ? 'selected' : 'available';

                        return (
                          <button
                            key={seatId}
                            type="button"
                            disabled={isBooked}
                            onClick={() => handleSeatClick(seatId, price, tier)}
                            className={`p-1 rounded-lg flex items-center justify-center transition-all group/seat ${
                              isBooked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:scale-110'
                            }`}
                            title={`Seat ${seatId} (${tier}) - $${price} • ${seatState.toUpperCase()}`}
                          >
                            <CinemaArmchair state={seatState} seatNumber={col} />
                          </button>
                        );
                      })}
                    </div>

                    {/* Tier Price Label on Right */}
                    <span className="w-12 text-left text-[11px] font-semibold text-slate-400 pl-2">
                      ${price}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tier Guide Footer */}
          <div className="mt-6 pt-4 border-t border-amber-900/30 w-full flex flex-wrap items-center justify-around text-xs text-slate-400 gap-2">
            <div>
              <span className="font-bold text-amber-400">Row A-B:</span> Executive Recliner ($24)
            </div>
            <div>
              <span className="font-bold text-amber-500">Row C-F:</span> Prime Gold ($19)
            </div>
            <div>
              <span className="font-bold text-slate-300">Row G-H:</span> Classic Silver ($15)
            </div>
          </div>

          {/* Bottom Docked Booking Bar Matching Reference Screen 2 */}
          <div className="w-full mt-6 p-4 sm:p-5 rounded-2xl bg-[#12130d] border border-amber-900/40 shadow-2xl flex items-center justify-between gap-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-semibold">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{selectedDate}, 2024 • {selectedTime}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 font-semibold">
                <Ticket className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {selectedSeats.length > 0
                    ? `${selectedSeats.map(s => s.id).join(', ')} (${selectedSeats.length} Seats)`
                    : 'Choose your seats above'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <span>Total: ${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Circular Golden "Buy" Button */}
            <button
              type="button"
              disabled={selectedSeats.length === 0}
              onClick={handleProceedToBooking}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full font-black text-sm sm:text-base flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-xl ${
                selectedSeats.length > 0
                  ? 'bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 shadow-amber-500/40 hover:scale-105 active:scale-95 ring-4 ring-amber-500/20'
                  : 'bg-[#12130d] text-slate-600 cursor-not-allowed border border-amber-900/30'
              }`}
            >
              Buy
            </button>
          </div>

        </div>

        {/* Right Column (1 Col): Seat Selection Summary & Price Calculation */}
        <div className="p-6 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-amber-900/30">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Ticket className="w-4 h-4 text-amber-400" />
              <span>Seat Selection Summary</span>
            </h3>
            {selectedSeats.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedSeats([])}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Selected Seat Tags */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Selected Seats ({selectedSeats.length}/{MAX_SEATS_LIMIT}):</span>
              <span className="text-[11px] font-medium text-amber-400">Max 6 per booking</span>
            </div>

            {selectedSeats.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#12130d] border border-amber-900/30 text-center text-xs text-slate-400">
                Click any available seat from the layout to select.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <div
                    key={seat.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12130d] border border-amber-900/40 text-xs font-bold text-amber-300"
                  >
                    <span>{seat.id}</span>
                    <span className="text-[10px] text-slate-400">(${seat.price})</span>
                    <button
                      type="button"
                      onClick={() => setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id))}
                      className="ml-1 text-slate-400 hover:text-amber-400 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Calculation Breakdown */}
          <div className="space-y-2.5 pt-4 border-t border-amber-900/30 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Tickets Subtotal:</span>
              <span className="font-semibold text-white">${seatSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Convenience Fee ($1.50/seat):</span>
              <span className="font-semibold text-white">${convenienceFee.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Estimated State Taxes (8%):</span>
              <span className="font-semibold text-white">${taxes.toFixed(2)}</span>
            </div>
            
            <div className="pt-3 border-t border-amber-900/30 flex items-center justify-between text-sm font-extrabold text-white">
              <span>Total Ticket Price:</span>
              <span className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Duplicate Prevention Notice */}
          <div className="p-3 rounded-xl bg-[#12130d] border border-amber-900/30 flex items-start gap-2.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Your selected seats will be immediately locked and validated in real time to prevent duplicate bookings.
            </span>
          </div>

          {/* Action Button */}
          <button
            type="button"
            disabled={selectedSeats.length === 0}
            onClick={handleProceedToBooking}
            className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedSeats.length > 0
                ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black shadow-xl shadow-amber-500/30 hover:scale-[1.02]'
                : 'bg-[#12130d] text-slate-600 cursor-not-allowed border border-amber-900/30'
            }`}
          >
            <span>Proceed to Booking Confirmation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

export default SeatSelectionPage;
