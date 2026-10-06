import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Clapperboard, Armchair, Bookmark, ArrowRight } from 'lucide-react';

const QuickActionCards = () => {
  const actions = [
    {
      title: 'Browse Now Showing',
      desc: 'Explore movies with live filters, trailers & verified showtimes',
      link: '/movies',
      icon: Film,
      color: 'from-amber-600/25 to-yellow-800/10 text-amber-400 border-amber-500/30'
    },
    {
      title: 'Theatres & Screens',
      desc: 'Discover IMAX 70MM, 4DX, and Dolby Atmos multiplexes nearby',
      link: '/theatres',
      icon: Clapperboard,
      color: 'from-yellow-600/25 to-amber-800/10 text-yellow-400 border-yellow-500/30'
    },
    {
      title: 'Instant Seat Booking',
      desc: 'Pick your favourite recliner seats on the interactive screen map',
      link: '/seat-selection',
      icon: Armchair,
      color: 'from-amber-500/25 to-orange-800/10 text-amber-400 border-amber-500/30'
    },
    {
      title: 'Saved Watchlist',
      desc: 'Review movies bookmarked for upcoming weekend screenings',
      link: '/watchlist',
      icon: Bookmark,
      color: 'from-emerald-600/25 to-emerald-800/10 text-emerald-400 border-emerald-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((act, idx) => {
        const Icon = act.icon;
        return (
          <Link key={idx} to={act.link}>
            <div className="p-5 rounded-2xl bg-[#161710] border border-amber-900/40 hover:border-amber-700/60 transition-all shadow-lg hover:shadow-amber-950/20 flex flex-col justify-between h-full group cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${act.color} border flex items-center justify-center group-hover:scale-105 transition-transform shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  {act.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {act.desc}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default QuickActionCards;
