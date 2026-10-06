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
  Timer
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { movieService } from '../api/movieApi';
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

  // Current Checkout Step: 'details' -> 'payment' -> 'confirmed'
  const [checkoutStep, setCheckoutStep] = useState('details');

  // Customer Contact Details
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Malik S');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'malik@cinema.com');
  const [customerPhone, setCustomerPhone] = useState('+1 (555) 234-5678');

  // Concessions Add-on state
  const [selectedSnacks, setSelectedSnacks] = useState({});

  // Promo Code Voucher state
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // 10-Minute Seat Hold Countdown Timer
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  // Payment Options & Details
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi' | 'wallet' | 'netbanking'
  const [cardDetails, setCardDetails] = useState({
    holder: currentUser?.name || 'Malik S',
    number: '4532 •••• •••• 8821',
    expiry: '12/28',
    cvv: '842',
    saveCard: true
  });
  const [upiId, setUpiId] = useState('malik@okaxis');
  const [selectedBank, setSelectedBank] = useState('Chase Bank');

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

  // Proceed from Contact/Add-ons to Payment step
  const handleGoToPayment = (e) => {
    if (e) e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) {
      toast.error('Please provide valid customer name and email.');
      return;
    }
    setCheckoutStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Execute Final Payment & Ticket Issuance
  const handleExecutePayment = async () => {
    setIsProcessingPayment(true);
    setErrorMsg('');

    try {
      // Realistic 3D-Secure banking handshake simulation
      setProcessingStage('Connecting to 256-Bit SSL Payment Gateway...');
      await new Promise((r) => setTimeout(r, 600));

      setProcessingStage('Verifying with bank issuer & locking auditorium seats...');
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

      const confirmed = await movieService.createBooking({
        ...bookingData,
        grandTotal: finalGrandTotal,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        paymentMethod: paymentMethod === 'card' ? `Credit Card (Visa •••• ${cardDetails.number.slice(-4)})` : paymentMethod.toUpperCase(),
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
                  <span className="text-slate-400 font-medium">Format & Screen</span>
                  <p className="font-bold text-amber-400 text-sm mt-0.5">{confirmedTicket.format}</p>
                  <p className="text-[11px] text-slate-400">Auditorium Screen 4</p>
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
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#12130d] text-sm text-slate-200 rounded-xl border border-amber-900/40 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="e.g. malik@cinema.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#12130d] text-sm text-slate-200 rounded-xl border border-amber-900/40 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Mobile Phone (SMS Entry Pass)
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="e.g. +1 (555) 019-2831"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#12130d] text-sm text-slate-200 rounded-xl border border-amber-900/40 focus:border-amber-500 focus:outline-none"
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
                      <button
                        type="button"
                        onClick={() => setCardDetails({
                          holder: 'Malik S',
                          number: '4532 •••• •••• 8821',
                          expiry: '12/28',
                          cvv: '842',
                          saveCard: true
                        })}
                        className="text-[11px] font-mono text-amber-400 hover:text-amber-300 cursor-pointer"
                      >
                        Auto-fill Demo Card
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardDetails.holder}
                        onChange={(e) => setCardDetails({ ...cardDetails, holder: e.target.value })}
                        placeholder="Name on card"
                        className="w-full px-3.5 py-2.5 bg-[#12130d] text-sm text-slate-100 rounded-xl border border-amber-900/40 focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Card Number</label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          placeholder="4532 •••• •••• 8821"
                          className="w-full pl-10 pr-16 py-2.5 bg-[#12130d] text-sm text-slate-100 font-mono rounded-xl border border-amber-900/40 focus:border-amber-500 focus:outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase">
                          VISA
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          placeholder="MM/YY"
                          className="w-full px-3.5 py-2.5 bg-[#12130d] text-sm text-slate-100 font-mono rounded-xl border border-amber-900/40 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">CVV / CVC</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          placeholder="•••"
                          className="w-full px-3.5 py-2.5 bg-[#12130d] text-sm text-slate-100 font-mono rounded-xl border border-amber-900/40 focus:border-amber-500 focus:outline-none"
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
                      <label className="block text-xs font-semibold text-slate-400 mb-1 text-left">Or enter UPI ID</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@okhdfcbank"
                        className="w-full px-3 py-2 bg-[#161710] text-xs text-slate-200 rounded-lg border border-amber-900/40 font-mono"
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
            <div>
              <h4 className="text-sm font-bold text-white">{bookingData.movieTitle}</h4>
              <p className="text-xs text-amber-400 font-semibold mt-0.5">{bookingData.format}</p>
              <p className="text-[11px] text-slate-400 mt-1">{bookingData.theatreName}</p>
            </div>
          </div>

          {/* Booking Metadata */}
          <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-amber-900/30">
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

    </div>
  );
};

export default BookingConfirmationPage;
