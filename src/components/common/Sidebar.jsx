import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Film, 
  Clapperboard, 
  Armchair, 
  Bookmark, 
  LogOut, 
  Award, 
  ShieldCheck, 
  X,
  Flame,
  Ticket,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMovies } from '../../context/MovieContext';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { path: '/movies', label: 'Movie Listing', icon: Film, badge: 'Now Showing' },
  { path: '/theatres', label: 'Theatres & Screens', icon: Clapperboard, badge: '6 Venues' },
  { path: '/seat-selection', label: 'Seat Selection', icon: Armchair, badge: 'Interactive' },
  { path: '/bookings', label: 'Booking History', icon: Ticket, badge: 'Tickets' },
  { path: '/analytics', label: 'Reports & Analytics', icon: BarChart3, badge: 'Insights' },
  { path: '/watchlist', label: 'My Watchlist', icon: Bookmark, badge: null }
];

const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser, logout } = useAuth();
  const { watchlist } = useMovies();
  const location = useLocation();

  // Strict single-active item resolution to guarantee only ONE item is highlighted
  const isItemActive = (targetPath) => {
    const isWatchlist = location.pathname === '/watchlist' || location.search.includes('view=watchlist');
    
    if (targetPath === '/watchlist') {
      return isWatchlist;
    }
    if (targetPath === '/movies') {
      return !isWatchlist && (location.pathname === '/movies' || location.pathname.startsWith('/movies/'));
    }
    if (targetPath === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    if (targetPath === '/theatres') {
      return location.pathname === '/theatres' || location.pathname.startsWith('/theatres/');
    }
    if (targetPath === '/seat-selection') {
      return location.pathname === '/seat-selection' || location.pathname.startsWith('/booking/');
    }
    if (targetPath === '/bookings') {
      return location.pathname === '/bookings';
    }
    if (targetPath === '/analytics') {
      return location.pathname === '/analytics';
    }
    return location.pathname === targetPath;
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 lg:top-24 bottom-0 left-0 w-64 bg-[#0f100a] border-r border-amber-950/60 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl shadow-black/80' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header with Brand & Close Button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-amber-950/60 bg-[#0d0e09]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/30">
              <Film className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">
              Cine<span className="text-amber-400">Pass</span>
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
            aria-label="Close sidebar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="py-5 px-3 space-y-1.5 overflow-y-auto flex-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-amber-200/50 mb-2">
            Main Navigation
          </p>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.path);
            const badgeValue = item.path === '/watchlist' && watchlist.length > 0 
              ? `${watchlist.length} Saved` 
              : item.badge;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/30 ring-1 ring-amber-400/50 scale-[1.01]'
                    : 'text-slate-400 hover:text-amber-100 hover:bg-[#161710]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? 'text-slate-950' : 'text-slate-400 group-hover:text-amber-400'}`} />
                  <span>{item.label}</span>
                </div>
                {badgeValue && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                    active 
                      ? 'bg-slate-950/25 text-slate-950 shadow-sm' 
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}>
                    {badgeValue}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Membership Benefit Box */}
          <div className="pt-4 px-1">
            <div className="p-3.5 rounded-xl bg-[#161710] border border-amber-900/40 text-left shadow-lg">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-xs font-bold text-amber-300">
                  CinePass Premiere Club
                </p>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Earn 2x reward points on all online cinema ticket reservations and concession combos.
              </p>
              <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>Active Member Perks</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Card & Logout Bottom Section */}
        <div className="p-3 border-t border-amber-950/60 bg-[#0d0e09]">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#161710] border border-amber-900/40">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={currentUser?.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";
                  }}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-amber-500/30"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0d0e09]" />
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200 truncate">{currentUser?.name}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Verified User</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              title="Logout session"
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
