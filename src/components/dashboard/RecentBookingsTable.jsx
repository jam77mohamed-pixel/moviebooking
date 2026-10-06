import React, { useState } from 'react';
import { Ticket, Eye, CheckCircle2, Clock, XCircle, QrCode, X, Calendar, MapPin, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import MobileTicketCard from '../common/MobileTicketCard';

const RecentBookingsTable = ({ bookings = [] }) => {
  const [selectedTicket, setSelectedTicket] = useState(null);

  const getStatusBadge = (status) => {
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

  const handleDownloadTicket = () => {
    if (!selectedTicket) return;
    toast.success(`E-Ticket #${selectedTicket.id} saved to your device!`);
  };

  return (
    <>
      <div className="rounded-3xl bg-[#161710] border border-amber-900/40 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-amber-950/60 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-white">Recent Ticket Bookings</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time customer transactions & seat reservations
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Showing {bookings?.length || 0} reservations
          </span>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#12130d] border-b border-amber-950/60 text-amber-200/60 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Movie & Poster</th>
                <th className="py-3.5 px-4">Cinema / Theatre</th>
                <th className="py-3.5 px-4">Showtime</th>
                <th className="py-3.5 px-4">Seats</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">E-Ticket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-950/40 text-slate-300">
              {bookings?.map((booking, idx) => {
                const movieName = booking.movie || booking.movieTitle || 'Untitled Feature';
                const customerName = booking.customer || booking.customerName || 'Guest User';
                const theatreName = booking.theatre || booking.theatreName || 'Multiplex Screen';
                const showTime = booking.showTime || booking.showtime || '07:00 PM';
                const seatsList = booking.seats || booking.selectedSeats || [];
                const amountFormatted = booking.amount || (booking.grandTotal ? `$${Number(booking.grandTotal).toFixed(2)}` : '$0.00');

                return (
                  <tr key={`${booking.id || 'booking'}_${idx}`} className="hover:bg-amber-950/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-amber-400/90">
                      {booking.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={booking.poster}
                          alt={movieName}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80";
                          }}
                          className="w-8 h-12 object-cover rounded-md shadow shrink-0 ring-1 ring-amber-950"
                        />
                        <div>
                          <p className="font-bold text-white text-xs sm:text-sm hover:text-amber-400 transition-colors">
                            {movieName}
                          </p>
                          <p className="text-[11px] text-slate-400">{customerName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-300">
                      {theatreName}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400 whitespace-nowrap">
                      {showTime}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {seatsList.map((seat) => (
                          <span
                            key={seat}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-950/50 text-amber-300 border border-amber-900/50"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {amountFormatted}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedTicket({
                          ...booking,
                          movie: movieName,
                          customer: customerName,
                          theatre: theatreName,
                          showTime: showTime,
                          seats: seatsList,
                          amount: amountFormatted
                        })}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12130d] hover:bg-amber-950/40 text-slate-200 hover:text-white text-xs font-medium border border-amber-900/40 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Interactive Mobile E-Ticket Modal (Matches Reference Design Screen 3) */}
      {selectedTicket ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-[#161710] border border-amber-500/30 rounded-3xl shadow-2xl p-5 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between pb-2.5 border-b border-amber-950/60 mb-2">
              <div>
                <h3 className="font-extrabold text-white text-sm">Mobile Ticket</h3>
                <p className="text-[10px] text-slate-400">
                  Scan the barcode at the theatre gate to access your seats.
                </p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded-lg bg-[#12130d] border border-amber-900/40 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <MobileTicketCard
              ticket={selectedTicket}
              onDownload={handleDownloadTicket}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default RecentBookingsTable;
