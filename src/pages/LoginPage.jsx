import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Film, 
  ShieldCheck, 
  Ticket, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Clock, 
  Tv, 
  ArrowRight,
  Flame,
  Clapperboard,
  QrCode
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';

const NOW_SHOWING_MOVIES = [
  {
    id: 1,
    title: "Dune: Part Two",
    format: "IMAX 70MM",
    rating: 8.6,
    language: "English",
    showtimes: ["05:15 PM", "08:45 PM"],
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80"
  },
  {
    id: 2,
    title: "Oppenheimer",
    format: "70MM Dolby",
    rating: 8.9,
    language: "English",
    showtimes: ["03:00 PM", "07:00 PM"],
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80"
  },
  {
    id: 4,
    title: "Deadpool & Wolverine",
    format: "4DX 3D",
    rating: 8.0,
    language: "English",
    showtimes: ["06:15 PM", "09:30 PM"],
    poster: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&q=80"
  },
  {
    id: 3,
    title: "Spider-Man: Across Spider-Verse",
    format: "Dolby Atmos",
    rating: 8.7,
    language: "English",
    showtimes: ["04:30 PM", "07:45 PM"],
    poster: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&q=80"
  }
];

const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('New York');

  useEffect(() => {
    if (isAuthenticated) {
      const origin = location.state?.from?.pathname || '/dashboard';
      navigate(origin, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleAuthSuccess = () => {
    const origin = location.state?.from?.pathname || '/dashboard';
    navigate(origin, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0d0e09] text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-amber-500 selection:text-slate-950 font-sans">
      
      {/* 1. Ambient Lighting (Dark Bronze Charcoal & Warm Amber Gold) */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[450px] bg-gradient-to-b from-amber-600/15 via-yellow-600/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 w-[550px] h-[450px] bg-gradient-to-b from-amber-500/10 via-amber-700/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-72 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />

      {/* 2. Top Cinema Booking App Header */}
      <header className="relative z-20 w-full border-b border-amber-950/60 bg-[#0f100a]/95 backdrop-blur-md py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30">
              <Film className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Cine<span className="text-amber-400">Pass</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  Ticketing
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 block -mt-0.5">
                Online Movie Ticket Booking
              </span>
            </div>
          </div>

          {/* Booking City Selector & Live Stats */}
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161710] border border-amber-900/40 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>City: </span>
              <strong className="text-white">{selectedCity}</strong>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Box Office Open</span>
            </div>
          </div>

        </div>
      </header>

      {/* 3. Main Stage: Booking App Layout */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Side: Cinema Showcase & Booking Steps (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Booking App Headline */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
                <Ticket className="w-3.5 h-3.5" />
                <span>Instant Movie Ticket Reservation</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Your Seats Are Waiting at The Big Screen.
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">
                Sign in to book confirmed tickets, pick recliner seats in real-time, and get your digital QR boarding pass instantly on mobile.
              </p>
            </div>

            {/* 4-Step Booking Journey */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#161710] border border-amber-900/40">
              {[
                { step: "01", title: "Sign In", desc: "Access account" },
                { step: "02", title: "Pick Movie", desc: "18+ Shows Today" },
                { step: "03", title: "Select Seats", desc: "Live 2D layout" },
                { step: "04", title: "E-Ticket", desc: "Instant gate QR" }
              ].map((s, idx) => (
                <div key={idx} className="space-y-0.5">
                  <span className="text-[10px] font-mono font-bold text-amber-400 block">{s.step}</span>
                  <p className="text-xs font-bold text-slate-200">{s.title}</p>
                  <p className="text-[10px] text-slate-400">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Now Showing in Multiplexes Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Now Showing in Multiplexes</span>
                </span>
                <span className="text-xs text-amber-400 font-semibold">18 Partner Theatres</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {NOW_SHOWING_MOVIES.map((movie) => (
                  <div
                    key={movie.id}
                    className="p-2.5 rounded-xl bg-[#161710] border border-amber-900/40 hover:border-amber-500/50 transition-all flex flex-col justify-between group"
                  >
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-slate-800 mb-2">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-bold text-amber-400 flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>{movie.rating}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                        {movie.title}
                      </h4>
                      <p className="text-[10px] text-slate-400">{movie.format}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Booking Counter Proof */}
            <div className="flex items-center justify-between pt-2 border-t border-amber-950/60 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                <span><strong className="text-slate-200">14,850+ tickets</strong> booked today</span>
              </div>
              <div className="flex items-center gap-1 text-slate-300">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                <span>4.9 / 5 Customer Rating</span>
              </div>
            </div>

          </div>

          {/* Right Side: The Single Main Login Console (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-[#161710] backdrop-blur-xl border border-amber-900/40 shadow-2xl p-6 sm:p-8 overflow-hidden">
              
              {/* Ticket Top Ribbon */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-amber-950/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base leading-tight">
                      {isRegisterMode ? 'New Customer Registration' : 'Moviegoer Sign In'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isRegisterMode ? 'Create account to book tickets' : 'Enter details to reserve tickets'}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold uppercase">
                  Admission
                </span>
              </div>

              {/* Single Main Form: Sign In or Register */}
              {!isRegisterMode ? (
                <LoginForm
                  onForgotPassword={() => setIsForgotOpen(true)}
                  onSuccess={handleAuthSuccess}
                  onSwitchToRegister={() => setIsRegisterMode(true)}
                />
              ) : (
                <RegisterForm
                  onSuccess={handleAuthSuccess}
                  onSwitchToLogin={() => setIsRegisterMode(false)}
                />
              )}

              {/* Security Badge */}
              <div className="mt-6 pt-4 border-t border-amber-950/60 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Official CinePass Booking Gateway • 256-Bit SSL</span>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* 4. Bottom Footer */}
      <footer className="relative z-20 py-3 text-center text-xs text-slate-400 border-t border-amber-950/60 bg-[#0f100a]/70 backdrop-blur-md">
        <span>© 2026 CinePass Movie Ticket Booking Platform • All Rights Reserved</span>
      </footer>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        onSwitchToLogin={() => {
          setIsForgotOpen(false);
          setIsRegisterMode(false);
        }}
      />

    </div>
  );
};

export default LoginPage;
