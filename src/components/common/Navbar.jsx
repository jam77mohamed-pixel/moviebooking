import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Film, 
  Search, 
  Bell, 
  Bookmark, 
  User, 
  LogOut, 
  ChevronDown, 
  MapPin, 
  Menu, 
  X,
  Ticket,
  Award,
  Palette
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMovies } from '../../context/MovieContext';
import { useTheme, THEME_PRESETS } from '../../context/ThemeContext';

const NOTIFICATIONS = [
  {
    id: 1,
    title: 'Special Weekend Offer: 20% Off Tickets',
    desc: 'Use promo code CINEPASS20 for all weekend screenings.',
    time: '15m ago',
    unread: true
  },
  {
    id: 2,
    title: 'Advance Bookings Open',
    desc: 'Dune 2 IMAX 70MM tickets are now live in 3D & IMAX formats.',
    time: '2h ago',
    unread: true
  },
  {
    id: 3,
    title: 'E-Ticket Ready',
    desc: 'Your digital boarding pass with scannable QR is ready for download.',
    time: '1d ago',
    unread: false
  }
];

const CITIES = ['New York', 'Los Angeles', 'Chicago', 'San Francisco', 'Miami', 'London', 'Dallas'];

const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { currentUser, logout } = useAuth();
  const { watchlist } = useMovies();
  const { theme, setTheme, activeCity, setActiveCity } = useTheme();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const cityDropdownRef = useRef(null);
  const themeDropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target)) {
        setIsCityOpen(false);
      }
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target)) {
        setIsThemeOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentThemeObj = THEME_PRESETS.find(t => t.id === theme) || THEME_PRESETS[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0f100a]/95 backdrop-blur-md border-b border-amber-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleSidebar();
              }}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
                <Film className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-amber-400 transition-colors">
                    Cine<span className="text-amber-400">Pass</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    CINEMA
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase -mt-0.5">
                  Live Box Office
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search movies, genres, actors, directors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#161710] text-sm text-slate-200 placeholder-slate-400 rounded-xl border border-amber-900/40 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition-all"
                />
              </div>
            </form>
          </div>

          {/* Right: Theme Selector, Location Selector, Notifications, Watchlist, User Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Real-Time Theme Color Switcher */}
            <div className="relative" ref={themeDropdownRef}>
              <button
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
                title="Change Cinema Theme & Colors"
              >
                <span>{currentThemeObj.emoji}</span>
                <span className="hidden xl:inline text-[11px] font-semibold">{currentThemeObj.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isThemeOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-amber-950/60 text-[11px] font-bold text-amber-200/60 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-amber-400" />
                      <span>Select Cinema Theme</span>
                    </span>
                    <span className="text-[10px] text-amber-400 font-normal">Real-Time</span>
                  </div>
                  <div className="p-1.5 space-y-1">
                    {THEME_PRESETS.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTheme(t.id);
                          setIsThemeOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          theme === t.id
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'text-slate-300 hover:bg-amber-950/30 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{t.emoji}</span>
                          <div>
                            <p className="font-bold text-white text-xs">{t.name}</p>
                            <p className="text-[10px] text-slate-400 font-normal">{t.label}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.primaryColor }} />
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.secondaryColor }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* City Selector */}
            <div className="relative hidden sm:block" ref={cityDropdownRef}>
              <button
                onClick={() => setIsCityOpen(!isCityOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161710] border border-amber-900/40 text-xs font-medium text-slate-300 hover:text-white hover:border-amber-700/50 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeCity}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isCityOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#161710] border border-amber-900/40 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-amber-200/60 uppercase tracking-wider">
                    Select Cinema Metro
                  </div>
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setActiveCity(city);
                        setIsCityOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between cursor-pointer ${
                        activeCity === city
                          ? 'text-amber-400 bg-amber-500/15 font-bold'
                          : 'text-slate-300 hover:bg-amber-950/30 hover:text-white'
                      }`}
                    >
                      <span>{city}</span>
                      {activeCity === city && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Watchlist */}
            <Link
              to="/watchlist"
              className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#161710] transition-colors"
              title="My Watchlist"
            >
              <Bookmark className="w-5 h-5" />
              {watchlist.length > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-slate-950 bg-amber-400 rounded-full shadow-sm shadow-amber-500/50">
                  {watchlist.length}
                </span>
              )}
            </Link>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifDropdownRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#161710] transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#0d0e09]" />
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-amber-950/60 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Cinema Notifications</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                      2 New
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-amber-950/40">
                    {NOTIFICATIONS.map((n) => (
                      <div key={n.id} className="p-3.5 hover:bg-amber-950/20 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 rounded-xl bg-[#161710] border border-amber-900/40 hover:border-amber-700/50 transition-colors cursor-pointer"
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={currentUser?.name || 'User'}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";
                  }}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-amber-500/30"
                />
                <span className="hidden sm:block text-xs font-medium text-slate-200 max-w-[100px] truncate">
                  {currentUser?.name || 'Guest User'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 pr-1" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-2xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-amber-950/60">
                    <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-semibold">
                      <Award className="w-3 h-3 text-amber-400" />
                      <span>{currentUser?.role || 'Premiere Member'}</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-amber-950/20 hover:text-amber-200 transition-colors"
                    >
                      <Ticket className="w-4 h-4 text-amber-400" />
                      <span>My Dashboard</span>
                    </Link>
                    <Link
                      to="/movies"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-amber-950/20 hover:text-amber-200 transition-colors"
                    >
                      <Film className="w-4 h-4 text-amber-400" />
                      <span>Browse Movies</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-amber-950/60">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
