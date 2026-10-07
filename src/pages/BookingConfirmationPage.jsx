import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Ticket, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  ArrowLeft, 
  ArrowRight,
  Printer, 
  Share2, 
  ShieldCheck, 
  AlertCircle,
  Film,
  QrCode,
  CreditCard,
  Wallet,
  Building2,
  Lock,
  Tag,
  Coffee,
  Download,
  Send,
  Check,
  Percent,
  Timer,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { movieService } from '../api/movieApi';
import { MOCK_MOVIES } from '../api/mockData';
import MobileTicketCard from '../components/common/MobileTicketCard';

// Concession snack add-ons available in real cinema multiplexes
const SNACK_OPTIONS = [
  {
    id: 'snack-1',
    name: 'Mega Tub Caramel Popcorn + 2 Large Sodas',
    category: 'Combo',
    price: 12.00,
    emoji: '🍿',
    desc: 'Warm fresh caramelized corn with choice of Pepsi/Coke'
  },
  {
    id: 'snack-2',
    name: 'Loaded Cheesy Jalapeno Nachos',
    category: 'Snack',
    price: 8.50,
    emoji: '🧀',
    desc: 'Crisp tortilla chips smothered in warm cheddar cheese & salsa'
  },
  {
    id: 'snack-3',
    name: 'Triple Chocolate Lava Cake Bowl',
    category: 'Dessert',
    price: 6.00,
    emoji: '🍫',
    desc: 'Oven-baked molten lava cake with dark cocoa fudge'
  }
];

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Retrieve pending booking data from session/local storage with high-fidelity fallback
  const [bookingData, setBookingData] = useState(() => {
    try {
      const stored = sessionStorage.getItem('cinepass_pending_booking') || localStorage.getItem('cinepass_pending_booking');
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback below
    }
    return {
      movieId: 1,
      movieTitle: 'Dune: Part Two',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      theatreId: 'th-1',
      theatreName: 'PVR Superplex IMAX',
      theatreAddress: 'Mall of the Emirates, Level 4',
      screenNumber: 1,
      screenName: 'Screen 1 - IMAX 70MM Dual Laser',
      fixedScreen: 'Screen 1 (IMAX 70MM)',
      date: 'Today',
      showtime: '06:45 PM',
      format: 'IMAX 70MM',
      selectedSeats: ['E3', 'E4'],
      seatTiers: 'Prime Gold',
      seatCount: 2,
      seatSubtotal: 38.00,
      convenienceFee: 3.00,
      taxes: 3.04,
      grandTotal: 44.04
    };
  });

  // State for Select Movie (Fixed Screen) Modal
  const [isSelectMovieModalOpen, setIsSelectMovieModalOpen] = useState(false);

  // Switch movie right here and update fixed screen while retaining current seats
  const handleSwitchMovieKeepSeats = (movie) => {
    const updated = {
      ...bookingData,
      movieId: movie.id,
      movieTitle: movie.title,
      poster: movie.poster,
      format: movie.formats?.[0] || bookingData.format,
      screenNumber: movie.screenNumber || movie.id,
      screenName: movie.screenName || `Screen ${movie.screenNumber || movie.id} - Premium Screen`,
      fixedScreen: movie.fixedScreen || `Screen ${movie.screenNumber || movie.id} (${movie.formats?.[0] || 'Standard'})`
    };
    setBookingData(updated);
    sessionStorage.setItem('cinepass_pending_booking', JSON.stringify(updated));
    localStorage.setItem('cinepass_pending_booking', JSON.stringify(updated));
    setIsSelectMovieModalOpen(false);
    toast.success(`Switched booking to "${movie.title}" on ${updated.fixedScreen}!`);
  };

  // Switch movie and jump to seat selection for that movie's dedicated fixed screen
  const handleSwitchMovieAndPickSeats = (movie) => {
    setIsSelectMovieModalOpen(false);
    navigate(`/seat-selection?movieId=${movie.id}&theatreId=${bookingData.theatreId}&format=${encodeURIComponent(movie.formats?.[0] || 'Standard')}&time=${encodeURIComponent(bookingData.showtime)}`);
  };

  // Current Checkout Step: 'details' -> 'payment' -> 'confirmed'
  const [checkoutStep, setCheckoutStep] = useState('details');

  // Customer Contact Details - MUST BE ENTERED MANUALLY (Zero in-built/prefilled text)
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Concessions Add-on state
  const [selectedSnacks, setSelectedSnacks] = useState({});

  // Promo Code Voucher state
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // 10-Minute Seat Hold Countdown Timer
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  // Payment Options & Details - MUST BE ENTERED MANUALLY (Zero in-built/prefilled text)
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi' | 'wallet' | 'netbanking'
  const [cardDetails, setCardDetails] = useState({
    holder: '',
    number: '',
    expiry: '',
    cvv: '',
    saveCard: false
  });
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  // Manual input formatting helpers for clean typing
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardDetails((prev) => ({ ...prev, number: formatted }));
  };

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setCardDetails((prev) => ({ ...prev, expiry: raw }));
  };

  const handleCvvChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardDetails((prev) => ({ ...prev, cvv: raw }));
  };

  // Payment Processing & Confirmation states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // 2. Countdown timer for seat hold
  useEffect(() => {
    if (isConfirmed || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isConfirmed, timeLeft]);

  // Format timer as MM:SS
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Snack Add/Remove handlers
  const handleUpdateSnack = (snackId, delta) => {
    setSelectedSnacks((prev) => {
      const current = prev[snackId] || 0;
      const updated = Math.max(0, current + delta);
      if (updated === 0) {
        const copy = { ...prev };
        delete copy[snackId];
        return copy;
      }
      return { ...prev, [snackId]: updated };
    });
  };

  // Calculate snacks total
  const snacksTotal = Object.entries(selectedSnacks).reduce((sum, [id, qty]) => {
    const snack = SNACK_OPTIONS.find((s) => s.id === id);
    return sum + (snack ? snack.price * qty : 0);
  }, 0);

  // Apply Promo Voucher
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (!code) {
      setPromoError('Please enter a voucher code');
      return;
    }

    if (code === 'CINEPASS20' || code === 'SAVE20') {
      const discount = Number(((bookingData.seatSubtotal + snacksTotal) * 0.20).toFixed(2));
      setAppliedPromo({ code, discount, label: '20% Cinema Pass Discount' });
      toast.success('Promo Code CINEPASS20 Applied! 20% discount granted.');
    } else if (code === 'FIRST10' || code === 'CINEMA10') {
      const discount = 10.00;
      setAppliedPromo({ code, discount, label: '$10 Moviegoer Credit' });
      toast.success('Promo Code FIRST10 Applied! $10 discount granted.');
    } else if (code === 'SNACKFREE') {
      const discount = Math.min(snacksTotal, 8.50);
      setAppliedPromo({ code, discount, label: 'Free Snack Voucher ($8.50)' });
      toast.success('Snack voucher applied! Enjoy complimentary refreshments.');
    } else {
      setPromoError('Invalid promo code. Try CINEPASS20 or FIRST10');
      toast.error('Invalid promo code');
    }
  };

  // Calculate Net Grand Total
  const discountAmount = appliedPromo ? appliedPromo.discount : 0;
  const taxableSubtotal = Math.max(0, (bookingData?.seatSubtotal || 0) + snacksTotal - discountAmount);
  const convenienceFee = bookingData?.convenienceFee || 0;
  const taxes = Number((taxableSubtotal * 0.08).toFixed(2));
  const finalGrandTotal = Number((taxableSubtotal + convenienceFee + taxes).toFixed(2));

  // Proceed from Contact/Add-ons to Payment step (Strict manual validation)
  const handleGoToPayment = (e) => {
    if (e) e.preventDefault();
    const nameTrimmed = customerName.trim();
    const emailTrimmed = customerEmail.trim();
    const phoneTrimmed = customerPhone.trim();

    if (!nameTrimmed) {
      toast.error('Please enter your full name manually to proceed.');
      return;
    }
    if (nameTrimmed.length < 2) {
      toast.error('Full name must be at least 2 characters long.');
      return;
    }
    if (!emailTrimmed) {
      toast.error('Please enter your email address manually for ticket delivery.');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailTrimmed)) {
      toast.error('Please enter a valid email address (e.g. name@example.com).');
      return;
    }
    if (!phoneTrimmed) {
      toast.error('Please enter your mobile phone number manually for SMS pass.');
      return;
    }
    const phoneDigits = phoneTrimmed.replace(/\D/g, '');
    if (phoneDigits.length < 7) {
      toast.error('Please enter a valid mobile number (at least 7 digits).');
      return;
    }

    setCheckoutStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Execute Final Payment & Ticket Issuance (Validates manual payment credentials)
  const handleExecutePayment = async () => {
    setErrorMsg('');

    // Strict manual entry verification based on payment method
    if (paymentMethod === 'card') {
      if (!cardDetails.holder.trim()) {
        toast.error('Please enter the cardholder name manually.');
        return;
      }
      const rawCardNum = cardDetails.number.replace(/\s+/g, '');
      if (!rawCardNum || rawCardNum.length < 13) {
        toast.error('Please enter a valid 16-digit card number manually.');
        return;
      }
      if (!cardDetails.expiry.trim() || cardDetails.expiry.trim().length < 4) {
        toast.error('Please enter card expiry date (MM/YY) manually.');
        return;
      }
      if (!cardDetails.cvv.trim() || cardDetails.cvv.trim().length < 3) {
        toast.error('Please enter the 3-digit CVV code manually.');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) {
        toast.error('Please enter your UPI ID manually (e.g. username@okhdfcbank).');
        return;
      }
    } else if (paymentMethod === 'netbanking') {
      if (!selectedBank) {
        toast.error('Please select your banking institution manually.');
        return;
      }
    }

    setIsProcessingPayment(true);

    try {
      // Realistic 3D-Secure banking handshake simulation
      setProcessingStage('Connecting to 256-Bit SSL Payment Gateway...');
      await new Promise((r) => setTimeout(r, 600));

      setProcessingStage('Verifying credentials with bank issuer & locking seats...');
      await new Promise((r) => setTimeout(r, 700));

      setProcessingStage('Payment authorized! Generating CinePass digital boarding pass...');
      await new Promise((r) => setTimeout(r, 600));

      // Build finalized booking payload
      const snacksSummary = Object.entries(selectedSnacks)
        .map(([id, qty]) => {
          const s = SNACK_OPTIONS.find((item) => item.id === id);
          return `${qty}x ${s?.name}`;
        })
        .join(', ');

      const cardLast4 = cardDetails.number.replace(/\s+/g, '').slice(-4) || '8821';
      const paymentSummary = paymentMethod === 'card'
        ? `Credit Card (Visa •••• ${cardLast4})`
        : paymentMethod === 'upi'
        ? `UPI (${upiId.trim()})`
        : paymentMethod === 'netbanking'
        ? `Net Banking (${selectedBank})`
        : `Digital Wallet`;

      const confirmed = await movieService.createBooking({
        ...bookingData,
        grandTotal: finalGrandTotal,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        paymentMethod: paymentSummary,
        transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
        authCode: `AUTH-${Math.floor(10000 + Math.random() * 90000)}`,
        concessions: snacksSummary || 'None',
        appliedPromo: appliedPromo?.code || 'None'
      });

      setConfirmedTicket(confirmed);
      setIsConfirmed(true);
      setCheckoutStep('confirmed');
      sessionStorage.removeItem('cinepass_pending_booking');
      localStorage.removeItem('cinepass_pending_booking');
      toast.success(`Payment Successful! Reservation Pass #${confirmed.bookingId} issued.`);
    } catch (err) {
      setErrorMsg(err.message || 'Payment transaction encountered an issue.');
      toast.error(err.message || 'Payment declined.');
      setCheckoutStep('payment');
    } finally {
      setIsProcessingPayment(false);
      setProcessingStage('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendSms = () => {
    toast.success(`Digital E-Ticket QR pass sent via SMS to ${customerPhone}`);
  };

  if (!bookingData) {
    return null;
  }

  // ==========================================
  // VIEW B: CONFIRMED REAL DIGITAL BOARDING PASS
  // ==========================================
  if (isConfirmed && confirmedTicket) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Success Alert Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-transparent border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">
                  Ticket Reservation Confirmed!
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                  Paid & Verified
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Confirmation sent to <strong className="text-amber-300">{confirmedTicket.customerEmail}</strong> • Transaction #{confirmedTicket.transactionId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#12130d] border border-amber-900/40 hover:border-amber-500/50 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print Pass</span>
            </button>
            <button
              type="button"
              onClick={handleSendSms}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-semibold text-amber-200 hover:text-white transition-colors cursor-pointer"
              title="Send entry pass to phone"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              <span>Send SMS</span>
            </button>
          </div>
        </div>

        {/* Mobile Ticket Showcase Matching Screen 3 Reference */}
        <div className="rounded-3xl bg-[#161710] border border-amber-900/40 shadow-2xl p-6 overflow-hidden">
          <div className="text-center mb-4">
            <h3 className="text-xl font-black text-white tracking-tight">Mobile Ticket</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Once you buy a movie ticket simply scan the barcode to access your movie at the cinema gate.
            </p>
          </div>

          <MobileTicketCard
            ticket={confirmedTicket}
            onDownload={handlePrint}
          />
        </div>

        {/* Detailed Cinema Booking Receipt & Itemized Details */}
        <div className="rounded-3xl bg-[#161710] border border-amber-900/40 shadow-2xl overflow-hidden relative">
          
          {/* Top Decorative Header */}
          <div className="p-6 bg-gradient-to-r from-[#211d13] via-[#161710] to-[#262013] border-b border-amber-900/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30">
                <Film className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
                  CinePass Digital Boarding Pass
                </span>
                <h3 className="text-xl font-extrabold text-white">
                  {confirmedTicket.movieTitle}
                </h3>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Booking Reference</span>
              <p className="text-xl font-black tracking-wider text-amber-400 font-mono">
                {confirmedTicket.bookingId}
              </p>
            </div>
          </div>

          {/* Ticket Body with Screening Details */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Poster Thumbnail */}
            <div className="flex justify-center md:justify-start">
              <img
                src={confirmedTicket.poster}
                alt={confirmedTicket.movieTitle}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80";
                }}
                className="w-32 h-44 rounded-2xl object-cover shadow-xl ring-1 ring-amber-900/40"
              />
            </div>

            {/* Screening Details */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Theatre Venue</span>
                  <p className="font-bold text-white text-sm mt-0.5">{confirmedTicket.theatreName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{confirmedTicket.theatreAddress}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Format & Fixed Screen</span>
                  <p className="font-bold text-amber-400 text-sm mt-0.5">{confirmedTicket.format}</p>
                  <p className="text-[11px] text-amber-300/80 font-mono font-medium">{confirmedTicket.screenName || confirmedTicket.fixedScreen || 'Screen 1 - IMAX 70MM Dual Laser'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Date & Time</span>
                  <p className="font-bold text-white text-sm mt-0.5">{confirmedTicket.date}</p>
                  <p className="text-xs text-amber-400 font-semibold">{confirmedTicket.showtime}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Reserved Seats ({confirmedTicket.seatCount})</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {confirmedTicket.selectedSeats.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold text-xs border border-amber-500/30">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Snacks included if any */}
              {confirmedTicket.concessions && confirmedTicket.concessions !== 'None' && (
                <div className="p-2.5 rounded-xl bg-[#12080d] border border-amber-900/30 text-xs">
                  <span className="text-slate-400 font-medium">Pre-Ordered Concessions: </span>
                  <strong className="text-amber-300">{confirmedTicket.concessions}</strong>
                </div>
              )}

              {/* Payment Receipt Strip */}
              <div className="pt-3 border-t border-amber-900/30 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Total Paid (All Inclusive):</span>
                  <p className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400">
                    ${confirmedTicket.grandTotal.toFixed(2)}
                  </p>
                  <span className="text-[10px] text-slate-400">{confirmedTicket.paymentMethod}</span>
                </div>

                {/* Scannable QR Code Entry Stamp */}
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white text-slate-950 shadow-md">
                  <QrCode className="w-8 h-8" />
                  <div className="text-[9px] font-mono leading-tight">
                    <p className="font-bold text-amber-900">SCAN AT GATE</p>
                    <p className="text-slate-700">{confirmedTicket.bookingId}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Barcode & Security Guard Ribbon */}
          <div className="bg-[#0f100a] px-6 py-3 border-t border-amber-900/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <span className="font-mono text-[11px] tracking-wider text-amber-200/50">||| | ||||| |||| | ||| ||||||| | |||| ||| CP-PASS-2026</span>
            <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Duplicate Booking Guard: Verified & Locked</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/30 transition-all text-center cursor-pointer"
          >
            View in Dashboard Bookings
          </Link>
          <Link
            to="/movies"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#12080d] border border-amber-900/40 hover:bg-[#1a1c12] text-slate-300 hover:text-white font-bold text-sm transition-all text-center cursor-pointer"
          >
            Browse More Movies
          </Link>
        </div>

      </div>
    );
  }

  // ==========================================
  // VIEW A: CHECKOUT FORM & PAYMENT GATEWAY
  // ==========================================
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Navigation & Stepper Header */}
      <div className="p-4 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to={`/seat-selection?movieId=${bookingData.movieId}&theatreId=${bookingData.theatreId}&time=${encodeURIComponent(bookingData.showtime)}`}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Seat Selection</span>
        </Link>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={() => setCheckoutStep('details')}
            className={`flex items-center gap-1.5 font-bold cursor-pointer ${checkoutStep === 'details' ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${checkoutStep === 'details' ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-black shadow-md shadow-amber-500/30' : 'bg-[#12130d] text-slate-400 border border-amber-900/40'}`}>1</span>
            <span>Contact & Add-ons</span>
          </button>
          <span className="text-amber-900/60">→</span>
          <button
            type="button"
            onClick={handleGoToPayment}
            className={`flex items-center gap-1.5 font-bold cursor-pointer ${checkoutStep === 'payment' ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${checkoutStep === 'payment' ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-black shadow-md shadow-amber-500/30' : 'bg-[#12130d] text-slate-400 border border-amber-900/40'}`}>2</span>
            <span>Secure Payment</span>
          </button>
        </div>

        {/* 10-Minute Seat Hold Countdown Timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
          <Timer className="w-3.5 h-3.5 text-amber-400" />
          <span>Seats Held: {formatTimer(timeLeft)}</span>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column (2 Cols): Checkout Steps */}
        <div className="lg:col-span-2 space-y-6">

          {/* STEP 1: CONTACT INFO & CONCESSIONS ADD-ONS */}
          {checkoutStep === 'details' && (
            <div className="space-y-6">

              {/* Active Movie & Dedicated Fixed Screen Banner with Switch Option */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#211d13] via-[#161710] to-[#262013] border border-amber-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={bookingData.poster}
                    alt={bookingData.movieTitle}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80";
                    }}
                    className="w-16 h-22 rounded-xl object-cover ring-1 ring-amber-500/40 shrink-0 shadow-md"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                        🎬 {bookingData.fixedScreen || 'Fixed Screen 1 (IMAX 70MM)'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {bookingData.format || 'Standard'}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-white">
                      {bookingData.movieTitle}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
                      <span>{bookingData.theatreName}</span>
                      <span>•</span>
                      <span>{bookingData.showtime}</span>
                      <span>•</span>
                      <span className="text-amber-300 font-semibold">{bookingData.selectedSeats?.length || 0} Seats ({bookingData.selectedSeats?.join(', ')})</span>
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-amber-900/30">
                  <span className="text-[10px] uppercase font-bold text-slate-400 hidden sm:block">
                    Change Screening?
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSelectMovieModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-md shadow-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Film className="w-3.5 h-3.5 text-slate-950" />
                    <span>Select Another Movie</span>
                  </button>
                </div>
              </div>

              {/* Customer Contact Information */}
              <div className="p-6 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-xl space-y-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-400" />
                    <span>Customer Contact Information</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Your digital e-tickets and SMS entry pass will be generated under these details.
                  </p>
                </div>

                <form onSubmit={handleGoToPayment} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your full name manually"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#12130d] text-sm text-slate-200 placeholder-slate-500 rounded-xl border border-amber-900/40 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email Address <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="Enter your email address manually"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#12130d] text-sm text-slate-200 placeholder-slate-500 rounded-xl border border-amber-900/40 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Mobile Phone (SMS Entry Pass) <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="Enter your mobile phone number manually"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#12130d] text-sm text-slate-200 placeholder-slate-500 rounded-xl border border-amber-900/40 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Cinema Snacks & Concessions Pre-order */}
              <div className="p-6 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-amber-400" />
                    <h3 className="text-base font-bold text-white">Pre-Order Cinema Refreshments</h3>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                    Skip Concession Lines
                  </span>
                </div>

                <div className="space-y-3">
                  {SNACK_OPTIONS.map((snack) => {
                    const count = selectedSnacks[snack.id] || 0;
                    return (
                      <div
                        key={snack.id}
                        className="p-3.5 rounded-xl bg-[#12130d] border border-amber-900/30 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{snack.emoji}</span>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-white">{snack.name}</h4>
                            <p className="text-[11px] text-slate-400">{snack.desc}</p>
                            <span className="text-xs font-bold text-amber-400 mt-0.5 block">
                              ${snack.price.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleUpdateSnack(snack.id, -1)}
                            disabled={count === 0}
                            className="w-7 h-7 rounded-lg bg-[#161710] border border-amber-900/40 hover:bg-[#202217] text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-5 text-center font-bold text-sm text-white">{count}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateSnack(snack.id, 1)}
                            className="w-7 h-7 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-sm cursor-pointer flex items-center justify-center shadow-md shadow-amber-500/30"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Proceed to Payment Action Button */}
              <button
                type="button"
                onClick={handleGoToPayment}
                className="w-full py-4 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black shadow-xl shadow-amber-500/30 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Confirm Details & Proceed to Payment (${finalGrandTotal.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

          {/* STEP 2: MULTI-OPTION REAL CINEMA PAYMENT GATEWAY */}
          {checkoutStep === 'payment' && (
            <div className="space-y-6">
              
              <div className="p-6 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-amber-900/30">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-400" />
                    <h2 className="text-base font-bold text-white">Select Payment Method</h2>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>256-Bit SSL Encrypted</span>
                  </span>
                </div>

                {/* 4 Payment Method Selection Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'card', label: 'Card Payment', icon: CreditCard },
                    { id: 'upi', label: 'UPI / QR Scan', icon: QrCode },
                    { id: 'wallet', label: 'Digital Wallet', icon: Wallet },
                    { id: 'netbanking', label: 'Net Banking', icon: Building2 }
                  ].map((tab) => {
                    const TabIcon = tab.icon;
                    const isSelected = paymentMethod === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setPaymentMethod(tab.id)}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-amber-600/25 to-yellow-600/25 border-amber-500 text-white shadow-lg shadow-amber-500/20'
                            : 'bg-[#12130d] border-amber-900/40 text-slate-400 hover:text-white hover:bg-[#1a1c12]'
                        }`}
                      >
                        <TabIcon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* TAB 1: CREDIT / DEBIT CARD GATEWAY */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">Enter Card Credentials</span>
                      <span className="text-[11px] text-amber-400/90 font-mono font-semibold">
                        Manual Entry Required
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Cardholder Name <span className="text-amber-400">*</span></label>
                      <input
                        type="text"
                        value={cardDetails.holder}
                        onChange={(e) => setCardDetails({ ...cardDetails, holder: e.target.value })}
                        placeholder="Enter full name on card manually"
                        className="w-full px-3.5 py-2.5 bg-[#12130d] text-sm text-slate-100 placeholder-slate-500 rounded-xl border border-amber-900/40 focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Card Number <span className="text-amber-400">*</span></label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          maxLength={19}
                          value={cardDetails.number}
                          onChange={handleCardNumberChange}
                          placeholder="Enter 16-digit card number manually"
                          className="w-full pl-10 pr-16 py-2.5 bg-[#12130d] text-sm text-slate-100 placeholder-slate-500 font-mono rounded-xl border border-amber-900/40 focus:border-amber-500 focus:outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase">
                          VISA / MC
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Expiry Date <span className="text-amber-400">*</span></label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardDetails.expiry}
                          onChange={handleExpiryChange}
                          placeholder="MM / YY"
                          className="w-full px-3.5 py-2.5 bg-[#12130d] text-sm text-slate-100 placeholder-slate-500 font-mono rounded-xl border border-amber-900/40 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">CVV / CVC <span className="text-amber-400">*</span></label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardDetails.cvv}
                          onChange={handleCvvChange}
                          placeholder="CVV"
                          className="w-full px-3.5 py-2.5 bg-[#12130d] text-sm text-slate-100 placeholder-slate-500 font-mono rounded-xl border border-amber-900/40 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: UPI / QR SCAN */}
                {paymentMethod === 'upi' && (
                  <div className="p-4 rounded-xl bg-[#12130d] border border-amber-900/40 text-center space-y-4">
                    <p className="text-xs text-slate-300">Scan QR Code using Google Pay, PhonePe, Paytm, or BHIM</p>
                    <div className="flex justify-center">
                      <div className="p-3 bg-white rounded-2xl shadow-xl flex flex-col items-center gap-1">
                        <QrCode className="w-36 h-36 text-slate-950" />
                        <span className="text-[10px] font-bold font-mono text-slate-800">CINEPASS-PAY-GATEWAY</span>
                      </div>
                    </div>
                    <div className="max-w-xs mx-auto">
                      <label className="block text-xs font-semibold text-slate-400 mb-1 text-left">Or enter UPI ID manually <span className="text-amber-400">*</span></label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="Enter UPI ID manually (e.g. username@okhdfcbank)"
                        className="w-full px-3 py-2 bg-[#161710] text-xs text-slate-200 placeholder-slate-500 rounded-lg border border-amber-900/40 font-mono focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: DIGITAL WALLETS */}
                {paymentMethod === 'wallet' && (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-slate-300 mb-2">Select your express digital wallet account:</p>
                    {['Apple Pay', 'Google Pay', 'PayPal Express', 'Amazon Pay'].map((w) => (
                      <label
                        key={w}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#12130d] border border-amber-900/40 hover:border-amber-500/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Wallet className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-bold text-white">{w}</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          1-Click Pay Ready
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {/* TAB 4: NET BANKING */}
                {paymentMethod === 'netbanking' && (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-slate-300 mb-2">Select your banking portal for secure redirect:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['Chase Bank', 'Bank of America', 'Wells Fargo', 'Citi Bank', 'HDFC Bank', 'ICICI Bank'].map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                            selectedBank === bank
                              ? 'bg-amber-600/25 border-amber-400 text-white shadow-sm shadow-amber-600/20'
                              : 'bg-[#12130d] border-amber-900/40 text-slate-400 hover:text-white'
                          }`}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Action Buttons: Back & Pay */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('details')}
                  className="px-5 py-3.5 rounded-xl bg-[#12130d] border border-amber-900/40 hover:bg-[#1a1c12] text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleExecutePayment}
                  className="flex-1 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black shadow-xl shadow-amber-500/30 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>Confirm & Generate E-Ticket (${finalGrandTotal.toFixed(2)})</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Right Column (1 Col): Order Review & Itemized Price */}
        <div className="p-6 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-amber-900/30">
            <Ticket className="w-4 h-4 text-amber-400" />
            <span>Cinema Booking Summary</span>
          </h3>

          <div className="flex items-center gap-3">
            <img
              src={bookingData.poster}
              alt={bookingData.movieTitle}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80";
              }}
              className="w-14 h-20 rounded-xl object-cover ring-1 ring-amber-900/40 shrink-0 shadow-md"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{bookingData.movieTitle}</h4>
              <p className="text-xs text-amber-400 font-semibold mt-0.5">{bookingData.format}</p>
              <div className="mt-1">
                <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 truncate max-w-full">
                  🎬 {bookingData.fixedScreen || 'Screen 1 (IMAX 70MM)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 truncate">{bookingData.theatreName}</p>
            </div>
          </div>

          {/* Select Movie & Screen Switcher Button */}
          <button
            type="button"
            onClick={() => setIsSelectMovieModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:border-amber-400"
          >
            <Film className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Another Movie & Screen</span>
          </button>

          {/* Booking Metadata */}
          <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-amber-900/30">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Fixed Screen:</span>
              <span className="font-semibold text-amber-300 font-mono text-[11px]">{bookingData.fixedScreen || 'Screen 1 (IMAX 70MM)'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Date:</span>
              <span className="font-semibold text-white">{bookingData.date}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Showtime:</span>
              <span className="font-semibold text-white">{bookingData.showtime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Seats ({bookingData.selectedSeats?.length || 0}):</span>
              <span className="font-bold text-amber-300">{bookingData.selectedSeats?.join(', ')}</span>
            </div>
          </div>

          {/* Promo Code Input Box */}
          <div className="pt-3 border-t border-amber-900/30 space-y-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Have a Promo Voucher?</span>
            </span>
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="e.g. CINEPASS20"
                className="flex-1 px-3 py-1.5 bg-[#12130d] border border-amber-900/40 rounded-lg text-xs text-white uppercase placeholder-slate-500 font-mono focus:border-amber-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs rounded-lg cursor-pointer transition-colors shadow-md shadow-amber-500/30"
              >
                Apply
              </button>
            </form>
            {appliedPromo && (
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                <span>✓ {appliedPromo.label}</span>
                <span className="font-bold font-mono">-${appliedPromo.discount.toFixed(2)}</span>
              </div>
            )}
            {promoError && (
              <p className="text-[11px] text-amber-400">{promoError}</p>
            )}
          </div>

          {/* Itemized Price Breakdown */}
          <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-amber-900/30">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Seats Subtotal:</span>
              <span className="font-semibold text-white">${bookingData.seatSubtotal.toFixed(2)}</span>
            </div>
            {snacksTotal > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Snacks & Concessions:</span>
                <span className="font-semibold text-amber-300">+${snacksTotal.toFixed(2)}</span>
              </div>
            )}
            {appliedPromo && (
              <div className="flex items-center justify-between text-emerald-400">
                <span>Promo Discount ({appliedPromo.code}):</span>
                <span className="font-bold">-${appliedPromo.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Convenience Fee:</span>
              <span className="font-semibold text-white">${bookingData.convenienceFee.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">State Taxes (8%):</span>
              <span className="font-semibold text-white">${taxes.toFixed(2)}</span>
            </div>

            <div className="pt-3 border-t border-amber-900/30 flex items-center justify-between text-sm font-extrabold text-white">
              <span>Grand Total:</span>
              <span className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400">
                ${finalGrandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Anti-Duplicate Guard Note */}
          <div className="p-3 rounded-xl bg-[#12130d] border border-amber-900/30 flex items-start gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Real-Time Duplicate Guard locks your chosen seats in the multiplex auditorium database to guarantee zero clashes.
            </span>
          </div>

        </div>

      </div>

      {/* Realistic Payment Processing Modal Overlay */}
      {isProcessingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="p-8 rounded-3xl bg-[#161710] border border-amber-500/30 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto" />
            <h3 className="text-base font-bold text-white">Processing Payment</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              {processingStage || 'Authorizing transaction...'}
            </p>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 font-semibold pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Official CinePass 256-Bit SSL Gateway</span>
            </div>
          </div>
        </div>
      )}

      {/* Select Movie & Fixed Screen Modal Dialog */}
      {isSelectMovieModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#161710] border border-amber-500/30 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#211d13] via-[#161710] to-[#262013] border-b border-amber-900/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30">
                  <Film className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">
                    Select Movie & Dedicated Fixed Screen
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Every title in the multiplex has a permanently allocated auditorium screen.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSelectMovieModalOpen(false)}
                className="w-9 h-9 rounded-full bg-[#12130d] border border-amber-900/40 hover:bg-[#1f2115] hover:border-amber-500/50 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 divide-y divide-amber-900/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_MOVIES.map((movie) => {
                  const isCurrent = bookingData.movieId === movie.id;
                  const screenLabel = movie.fixedScreen || `Screen ${movie.screenNumber || movie.id} (${movie.formats?.[0] || 'Standard'})`;

                  return (
                    <div
                      key={movie.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        isCurrent
                          ? 'bg-amber-600/15 border-amber-500/60 shadow-lg shadow-amber-600/10'
                          : 'bg-[#12130d] border-amber-900/30 hover:border-amber-500/40 hover:bg-[#1a1c12]'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80";
                          }}
                          className="w-16 h-24 rounded-xl object-cover ring-1 ring-amber-900/40 shrink-0 shadow-md"
                        />
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-600/20 to-yellow-600/20 text-amber-300 border border-amber-500/30 uppercase">
                              🎬 Screen {movie.screenNumber || movie.id}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                Current Selection
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-white truncate">
                            {movie.title}
                          </h4>
                          <p className="text-[11px] text-amber-300 font-mono font-semibold truncate">
                            {screenLabel}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <span>★ {movie.rating}</span>
                            <span>•</span>
                            <span>{movie.duration}</span>
                            <span>•</span>
                            <span className="truncate">{Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons for this Movie */}
                      <div className="pt-2 border-t border-amber-900/30 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleSwitchMovieKeepSeats(movie)}
                          disabled={isCurrent}
                          className={`w-full py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isCurrent
                              ? 'bg-amber-500/10 text-amber-400/50 cursor-not-allowed border border-amber-500/20'
                              : 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black shadow-md shadow-amber-500/20'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Keep My Seats</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSwitchMovieAndPickSeats(movie)}
                          className="w-full py-2 px-2.5 rounded-xl text-xs font-bold bg-[#12130d] hover:bg-[#1e2014] text-slate-200 hover:text-white border border-amber-900/40 hover:border-amber-500/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Ticket className="w-3.5 h-3.5 text-amber-400" />
                          <span>Pick Seats for Screen {movie.screenNumber || movie.id}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#12130d] border-t border-amber-900/40 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400 font-mono">
                12 Movies • 12 Dedicated Multiplex Screens
              </span>
              <button
                type="button"
                onClick={() => setIsSelectMovieModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#1e2014] hover:bg-[#282b1b] border border-amber-900/40 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default BookingConfirmationPage;
