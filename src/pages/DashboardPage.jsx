import React, { useState, useEffect } from 'react';
import { 
  Film, 
  Clapperboard, 
  Ticket, 
  Tv, 
  CalendarDays, 
  TrendingUp, 
  RefreshCw,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { movieService } from '../api/movieApi';
import StatCard from '../components/dashboard/StatCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import RecentBookingsTable from '../components/dashboard/RecentBookingsTable';
import QuickActionCards from '../components/dashboard/QuickActionCards';
import UpcomingMoviesRow from '../components/dashboard/UpcomingMoviesRow';
import { DashboardStatsSkeleton } from '../components/common/SkeletonCard';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await movieService.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#211d13] via-[#161710] to-[#262013] border border-amber-900/40 p-6 sm:p-8 overflow-hidden shadow-2xl shadow-black/60">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-600/15 via-yellow-600/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/40 text-amber-200 text-xs font-semibold mb-3">
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>Real-Time Cinema Box Office</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {currentUser?.name?.split(' ')[0] || 'Moviegoer'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Real-time multiplex ticketing overview, theatre showtimes, and box office metrics. 
              Today's bookings are pacing <span className="text-amber-400 font-semibold">+18.4% higher</span> than average.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161710] hover:bg-amber-950/40 text-slate-200 text-xs font-semibold border border-amber-900/40 hover:border-amber-700/60 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Stats</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Stat Cards */}
      {loading || !dashboardData ? (
        <DashboardStatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Movies"
            value={dashboardData.stats.totalMovies}
            change="+4 New"
            isPositive={true}
            icon={Film}
            color="red"
            footnote="16 Active in IMAX / 3D"
          />
          <StatCard
            title="Partner Theatres"
            value={dashboardData.stats.totalTheatres}
            change="+2 Added"
            isPositive={true}
            icon={Clapperboard}
            color="amber"
            footnote="Spread across 5 metro cities"
          />
          <StatCard
            title="Total Bookings"
            value={dashboardData.stats.totalBookings.toLocaleString()}
            change="+18.4%"
            isPositive={true}
            icon={Ticket}
            color="red"
            footnote="1,420 tickets confirmed this month"
          />
          <StatCard
            title="Available Shows"
            value={dashboardData.stats.availableShows}
            change={`${dashboardData.stats.todayBookings} Today`}
            isPositive={true}
            icon={Tv}
            color="emerald"
            footnote="Avg seat occupancy: 84.2%"
          />
        </div>
      )}

      {/* Quick Action Navigation Cards */}
      <QuickActionCards />

      {/* Revenue Summary Chart */}
      <RevenueChart />

      {/* Upcoming Movies Showcase */}
      {dashboardData?.featuredMovies && (
        <UpcomingMoviesRow movies={dashboardData.featuredMovies} />
      )}

      {/* Recent Bookings Table */}
      {dashboardData?.recentBookings && (
        <RecentBookingsTable bookings={dashboardData.recentBookings} />
      )}
    </div>
  );
};

export default DashboardPage;
