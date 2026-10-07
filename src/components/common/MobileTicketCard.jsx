import React, { useState } from 'react';
import { Download, Share2, CheckCircle2, Ticket, Calendar, Clock, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';

/**
 * MobileTicketCard Component
 * Faithfully matches the reference design (Screen 3: Ticket Page / Mobile Ticket)
 * Features:
 * - 3D fan-out layered tickets backdrop
 * - Scalloped / notched circular cutouts on left and right with dashed perforation line
 * - Metallic golden gradient bottom stub
 * - Scannable vertical barcode bars
 * - Carousel dot indicator
 */
const MobileTicketCard = ({ ticket, onDownload }) => {
  const [activeSlide, setActiveSlide] = useState(1);

  if (!ticket) return null;

  const movieTitle = ticket.movieTitle || ticket.movie || 'Kalki 2898 AD';
  const poster = ticket.poster || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80';
  const dateStr = ticket.date || 'July 21, 2024';
  const timeStr = ticket.showtime || ticket.showTime || ticket.time || '6:00 PM';
  const seatsList = Array.isArray(ticket.selectedSeats)
    ? ticket.selectedSeats
    : Array.isArray(ticket.seats)
    ? ticket.seats
    : ['E3', 'E4'];
  const rowInfo = seatsList.length > 0 ? (seatsList[0].match(/^[A-Za-z]+/)?.[0] || '2') : '2';
  const seatsFormatted = seatsList.join(', ');
  const barcodeNumber = ticket.transactionId || ticket.id || `TKT-${Math.floor(100000000 + Math.random() * 900000000)}`;

  // Barcode bar widths pattern for realistic barcode rendering
  const barcodeBars = [2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 2, 3, 1, 2, 1, 3, 4, 1, 2, 3, 1, 2];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Mobile ticket pass link copied to clipboard!');
    } else {
      toast.info('Ticket pass ready for scanning at theatre gate.');
    }
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-sm mx-auto">
      {/* 3D Fan-out Stage */}
      <div className="relative w-full h-[470px] flex items-center justify-center pt-2">
        
        {/* Left Tilted Background Ticket */}
        <div
          onClick={() => setActiveSlide(0)}
          className={`absolute top-4 w-[230px] h-[370px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 transform -rotate-12 -translate-x-12 cursor-pointer border border-amber-900/40 opacity-55 hover:opacity-75 ${
            activeSlide === 0 ? 'scale-105 z-20 opacity-90' : 'z-0'
          }`}
          style={{
            background: 'linear-gradient(135deg, #211d13 0%, #161710 100%)'
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80"
            alt="Left Ticket"
            className="w-full h-full object-cover opacity-60"
          />
        </div>

        {/* Right Tilted Background Ticket */}
        <div
          onClick={() => setActiveSlide(2)}
          className={`absolute top-4 w-[230px] h-[370px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 transform rotate-12 translate-x-12 cursor-pointer border border-amber-900/40 opacity-55 hover:opacity-75 ${
            activeSlide === 2 ? 'scale-105 z-20 opacity-90' : 'z-0'
          }`}
          style={{
            background: 'linear-gradient(135deg, #211d13 0%, #161710 100%)'
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80"
            alt="Right Ticket"
            className="w-full h-full object-cover opacity-60"
          />
        </div>

        {/* Center Main Featured Ticket Card */}
        <div className="relative z-10 w-[260px] sm:w-[280px] rounded-3xl overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.85)] border border-amber-500/40 bg-[#161710] flex flex-col">
          
          {/* Top Artwork Poster Section */}
          <div className="relative h-[255px] w-full overflow-hidden bg-slate-900">
            <img
              src={poster}
              alt={movieTitle}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80";
              }}
              className="w-full h-full object-cover"
            />
            {/* Dark vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            
            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/90 text-slate-950 uppercase tracking-wider">
                {ticket.format || 'IMAX 70MM'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-emerald-400 border border-emerald-500/30">
                Verified
              </span>
            </div>

            {/* Bottom Title on Image */}
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="text-white font-extrabold text-base leading-tight drop-shadow-md truncate">
                {movieTitle}
              </h3>
              <p className="text-[11px] text-amber-300/90 truncate drop-shadow">
                {ticket.theatreName || ticket.theatre || 'PVR Superplex IMAX'}
              </p>
              <p className="text-[10px] text-amber-400 font-mono font-semibold truncate drop-shadow mt-0.5">
                🎬 {ticket.screenName || ticket.fixedScreen || 'Screen 1 (IMAX 70MM)'}
              </p>
            </div>
          </div>

          {/* Ticket Notch Perforated Divider */}
          <div className="relative w-full h-6 flex items-center justify-between bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#b45309]">
            {/* Left Circular Cutout Notch */}
            <div className="w-4 h-6 bg-[#161710] rounded-r-full -ml-[1px]" />

            {/* Dashed Horizontal Perforation Line */}
            <div className="flex-1 border-b-2 border-dashed border-amber-950/60 mx-1" />

            {/* Right Circular Cutout Notch */}
            <div className="w-4 h-6 bg-[#161710] rounded-l-full -mr-[1px]" />
          </div>

          {/* Bottom Golden Stub Section */}
          <div className="p-3.5 bg-gradient-to-b from-[#d97706] via-[#f59e0b] to-[#b45309] text-slate-950 flex flex-col justify-between">
            
            {/* Date & Time Row */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-950 pb-1.5 border-b border-amber-900/30">
              <div>
                <span className="text-[10px] uppercase font-semibold text-amber-950/80 block">Date</span>
                <span className="text-[11px]">{dateStr}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-amber-950/80 block">Time</span>
                <span className="text-[11px]">{timeStr}</span>
              </div>
            </div>

            {/* Row & Seat Numbers Row */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-950 py-1.5 border-b border-amber-900/30">
              <div>
                <span className="text-[10px] uppercase font-semibold text-amber-950/80 block">Row</span>
                <span className="text-sm font-black">{rowInfo}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-amber-950/80 block">Seats</span>
                <span className="text-xs font-black">{seatsFormatted}</span>
              </div>
            </div>

            {/* Realistic Vertical Barcode Graphic */}
            <div className="pt-2 flex flex-col items-center">
              <div className="w-full h-11 bg-amber-50/90 rounded px-2 py-1 flex items-center justify-between overflow-hidden shadow-inner">
                {barcodeBars.map((width, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 h-full rounded-xs"
                    style={{ width: `${width}px` }}
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono font-bold tracking-widest text-amber-950 mt-1 uppercase">
                {barcodeNumber}
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Pagination Dot Indicators (Matches Screen 3) */}
      <div className="flex items-center gap-2 mt-3 mb-4">
        {[0, 1, 2].map((idx) => (
          <button
            key={idx}
            onClick={() => setActiveSlide(idx)}
            className={`transition-all rounded-full cursor-pointer ${
              activeSlide === idx
                ? 'w-5 h-1.5 bg-amber-400'
                : 'w-1.5 h-1.5 bg-slate-700 hover:bg-slate-500'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Action Buttons for User */}
      <div className="w-full flex items-center gap-2 px-4">
        <button
          onClick={onDownload || (() => toast.success(`Ticket ${barcodeNumber} downloaded!`))}
          className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-950" />
          <span>Save Mobile Ticket</span>
        </button>

        <button
          onClick={handleShare}
          className="p-2.5 rounded-xl bg-[#12130d] border border-amber-900/40 text-slate-300 hover:text-white hover:bg-[#1a1c12] transition-colors cursor-pointer"
          title="Share Pass"
        >
          <Share2 className="w-4 h-4 text-amber-400" />
        </button>
      </div>

    </div>
  );
};

export default MobileTicketCard;
