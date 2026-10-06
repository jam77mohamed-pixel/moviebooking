import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Ticket, 
  Film, 
  Clapperboard, 
  Armchair, 
  DollarSign, 
  Calendar, 
  Download, 
  FileText, 
  Sparkles as DummySparkles, // Not used
  CheckCircle2, 
  ChevronUp, 
  ArrowUpRight, 
  Percent, 
  Award, 
  MapPin, 
  Tv, 
  RefreshCw 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { movieService } from '../api/movieApi';

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeRange, setTimeRange] = useState('week'); // 'week' | 'month' | 'all'
  const [chartMetric, setChartMetric] = useState('revenue'); // 'revenue' | 'bookings'

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await movieService.getAnalyticsData();
      setAnalyticsData(data);
    } catch (err) {
      console.error('Failed to load analytics', err);
      toast.error('Unable to fetch analytics data.');
    } finally {
      setLoading(false);
    }
  };

  // CSV Report Generator
  const handleExportCSV = () => {
    if (!analyticsData) return;
    const rows = [
      ['Metric', 'Value'],
      ['Total Bookings', analyticsData.overview.totalBookings],
      ['Total Revenue ($)', analyticsData.overview.totalRevenue],
      ['Average Seat Occupancy', analyticsData.overview.occupancyRate],
      ['Average Ticket Price', analyticsData.overview.averageTicketPrice],
      ['Most Booked Movie', analyticsData.mostBookedMovie.title],
      ['Most Popular Theatre', analyticsData.mostPopularTheatre.name],
      [],
      ['Day', 'Bookings', 'Revenue ($)', 'Occupancy (%)'],
      ...analyticsData.dailyTrends.map(d => [d.day, d.bookings, d.revenue, `${d.occupancy}%`]),
      [],
      ['Movie Title', 'Revenue ($)', 'Market Share (%)', 'Tickets Sold'],
      ...analyticsData.revenueByMovie.map(m => [m.title, m.revenue, `${m.percentage}%`, m.bookings])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CinePass_BoxOffice_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Box Office CSV Report downloaded successfully.');
  };

  const handleExportPDF = () => {
    window.print();
  };

  if (loading || !analyticsData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Loading box office analytics & telemetry...</p>
      </div>
    );
  }

  const {
    overview,
    mostBookedMovie,
    mostPopularTheatre,
    formatOccupancy,
    dailyTrends,
    revenueByMovie,
    revenueByTier,
    theatreRankings
  } = analyticsData;

  const maxTrendValue = chartMetric === 'revenue' 
    ? Math.max(...dailyTrends.map(d => d.revenue))
    : Math.max(...dailyTrends.map(d => d.bookings));

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Page Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#211d13] via-[#161710] to-[#262013] border border-amber-900/40 p-6 sm:p-8 overflow-hidden shadow-2xl shadow-black/60">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-600/15 via-yellow-600/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/40 text-amber-200 text-xs font-semibold mb-3">
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Multiplex Business Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Reports & Box Office Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Consolidated box office performance, seat occupancy rates, theatre throughput, and real-time revenue distributions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Time Filter Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-[#0d0e09] border border-amber-900/40 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTimeRange('week')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === 'week'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                7 Days
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('month')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === 'month'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                30 Days
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === 'all'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Time
              </button>
            </div>

            {/* Export Actions */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#161710] hover:bg-[#202117] text-slate-200 text-xs font-semibold border border-amber-900/40 hover:border-amber-700/60 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 hover:brightness-110 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Bookings */}
        <div className="p-5 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Bookings</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {overview.totalBookings.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="inline-flex items-center text-emerald-400 font-bold gap-0.5">
              <ChevronUp className="w-3.5 h-3.5" />
              +18.4%
            </span>
            <span className="text-slate-400">{overview.todayBookings} confirmed today</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Gross Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            ${overview.totalRevenue.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="inline-flex items-center text-emerald-400 font-bold gap-0.5">
              <ChevronUp className="w-3.5 h-3.5" />
              +22.5%
            </span>
            <span className="text-slate-400">Avg ticket {overview.averageTicketPrice}</span>
          </div>
        </div>

        {/* Seat Occupancy Rate */}
        <div className="p-5 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Seat Occupancy Rate</span>
            <div className="w-9 h-9 rounded-xl bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
              <Armchair className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
            {overview.occupancyRate}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="inline-flex items-center text-emerald-400 font-bold gap-0.5">
              <ChevronUp className="w-3.5 h-3.5" />
              +5.2%
            </span>
            <span className="text-slate-400">Peak weekend: 96.1%</span>
          </div>
        </div>

        {/* Partner Multiplexes */}
        <div className="p-5 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Active Theatres & Shows</span>
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Clapperboard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {overview.activeTheatres} <span className="text-base text-slate-400 font-normal">Venues</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-amber-400 font-semibold">{overview.totalShowsToday} Shows Today</span>
            <span className="text-slate-400">24 Movies Live</span>
          </div>
        </div>

      </div>

      {/* Spotlight Duo: Most Booked Movie & Most Popular Theatre */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Most Booked Movie Card */}
        <div className="p-6 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Film className="w-3.5 h-3.5" />
                <span>Most Booked Movie</span>
              </div>
              <span className="text-xs font-bold text-amber-400">{mostBookedMovie.share} Box Office Share</span>
            </div>

            <div className="flex gap-4">
              <img
                src={mostBookedMovie.poster}
                alt={mostBookedMovie.title}
                className="w-24 h-36 rounded-xl object-cover ring-1 ring-amber-500/40 shadow-lg shrink-0"
              />
              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-white leading-tight">
                  {mostBookedMovie.title}
                </h3>
                <p className="text-xs text-amber-200/80 font-medium">
                  {mostBookedMovie.genre} • Dir. {mostBookedMovie.director}
                </p>
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#0d0e09] text-amber-400 font-bold border border-amber-900/60">
                    ★ {mostBookedMovie.rating} / 10
                  </span>
                  <span className="text-slate-400">IMAX 70MM Premiere</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-950/60 grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-[#0d0e09] border border-amber-900/30">
              <p className="text-[11px] text-slate-400">Tickets Sold</p>
              <p className="text-base font-black text-white mt-0.5">{mostBookedMovie.ticketsSold}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0d0e09] border border-amber-900/30">
              <p className="text-[11px] text-slate-400">Total Revenue</p>
              <p className="text-base font-black text-amber-400 mt-0.5">{mostBookedMovie.revenue}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0d0e09] border border-amber-900/30">
              <p className="text-[11px] text-slate-400">Occupancy</p>
              <p className="text-base font-black text-emerald-400 mt-0.5">{mostBookedMovie.occupancyRate}</p>
            </div>
          </div>
        </div>

        {/* Most Popular Theatre Card */}
        <div className="p-6 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 text-xs font-bold uppercase tracking-wider">
                <Clapperboard className="w-3.5 h-3.5" />
                <span>Top Grossing Multiplex</span>
              </div>
              <span className="text-xs font-bold text-emerald-400">{mostPopularTheatre.occupancyRate} Occupancy</span>
            </div>

            <div className="flex gap-4">
              <img
                src={mostPopularTheatre.image}
                alt={mostPopularTheatre.name}
                className="w-24 h-36 rounded-xl object-cover ring-1 ring-amber-500/40 shadow-lg shrink-0"
              />
              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-white leading-tight">
                  {mostPopularTheatre.name}
                </h3>
                <p className="text-xs text-amber-200/80 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  {mostPopularTheatre.city} • {mostPopularTheatre.screens} Screens
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {mostPopularTheatre.formats.map((fmt, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#0d0e09] text-slate-300 border border-amber-900/40">
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-950/60 grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-[#0d0e09] border border-amber-900/30">
              <p className="text-[11px] text-slate-400">Weekly Bookings</p>
              <p className="text-base font-black text-white mt-0.5">{mostPopularTheatre.weeklyBookings}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0d0e09] border border-amber-900/30">
              <p className="text-[11px] text-slate-400">Weekly Revenue</p>
              <p className="text-base font-black text-amber-400 mt-0.5">{mostPopularTheatre.weeklyRevenue}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0d0e09] border border-amber-900/30">
              <p className="text-[11px] text-slate-400">Seat Occupancy</p>
              <p className="text-base font-black text-emerald-400 mt-0.5">{mostPopularTheatre.occupancyRate}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Daily Booking Trends & Revenue Interactive Chart */}
      <div className="p-6 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-black text-white">Daily Booking & Revenue Trends</h2>
            <p className="text-xs text-slate-400 mt-0.5">Week-over-week traffic pattern across multiplex network</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setChartMetric('revenue')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartMetric === 'revenue'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-[#0d0e09] text-slate-400 border border-amber-900/40 hover:text-slate-200'
              }`}
            >
              Revenue ($)
            </button>
            <button
              type="button"
              onClick={() => setChartMetric('bookings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartMetric === 'bookings'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-[#0d0e09] text-slate-400 border border-amber-900/40 hover:text-slate-200'
              }`}
            >
              Ticket Count
            </button>
          </div>
        </div>

        {/* Visual Bar Chart Display */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-64 pt-6 pb-2 px-2 border-b border-amber-950/60">
          {dailyTrends.map((item, idx) => {
            const currentVal = chartMetric === 'revenue' ? item.revenue : item.bookings;
            const heightPercent = Math.round((currentVal / maxTrendValue) * 100);

            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                <div className="text-[11px] font-bold text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity mb-2">
                  {chartMetric === 'revenue' ? `$${item.revenue.toLocaleString()}` : item.bookings}
                </div>
                
                <div className="w-full max-w-[48px] bg-[#0d0e09] rounded-t-xl h-full flex items-end p-1 border border-amber-900/30">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-amber-700 via-amber-500 to-yellow-400 transition-all duration-500 group-hover:brightness-125 shadow-md shadow-amber-500/20"
                  />
                </div>

                <div className="mt-3 text-center">
                  <p className="text-xs font-bold text-slate-300">{item.day}</p>
                  <p className="text-[10px] text-slate-500">{item.occupancy}% Occ</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-400 px-2">
          <span>Highest peak: Saturday (570 Bookings / $11,400)</span>
          <span className="text-emerald-400 font-semibold">Weekend Surge: +68%</span>
        </div>
      </div>

      {/* Revenue Breakdown by Movie & Format Occupancy Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue by Movie */}
        <div className="p-6 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-xl">
          <h2 className="text-lg font-black text-white mb-1">Top Box Office Performers</h2>
          <p className="text-xs text-slate-400 mb-6">Revenue and ticket volume comparison by title</p>

          <div className="space-y-4">
            {revenueByMovie.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white truncate pr-2">{item.title}</span>
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-amber-400">${item.revenue.toLocaleString()}</span>
                    <span className="text-slate-400 text-[11px] ml-1.5">({item.percentage}%)</span>
                  </div>
                </div>

                <div className="w-full h-2.5 rounded-full bg-[#0d0e09] border border-amber-900/30 overflow-hidden">
                  <div
                    style={{ width: `${item.percentage * 2.5}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-600 to-yellow-500 transition-all duration-500"
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>{item.bookings} tickets booked</span>
                  <span>Avg price ${(item.revenue / item.bookings).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seat Occupancy by Format */}
        <div className="p-6 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-xl">
          <h2 className="text-lg font-black text-white mb-1">Seat Occupancy by Screen Format</h2>
          <p className="text-xs text-slate-400 mb-6">Auditorium filling rates across premium sound & projection classes</p>

          <div className="space-y-4">
            {formatOccupancy.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{item.format}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">{item.count}</span>
                    <span className="font-extrabold text-emerald-400">{item.rate}%</span>
                  </div>
                </div>

                <div className="w-full h-2.5 rounded-full bg-[#0d0e09] border border-amber-900/30 overflow-hidden">
                  <div
                    style={{ width: `${item.rate}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-700 via-amber-500 to-emerald-400 transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3.5 rounded-xl bg-[#0d0e09] border border-amber-900/40 flex items-center justify-between text-xs">
            <span className="text-slate-300">Auditorium Turnaround Time:</span>
            <span className="font-bold text-amber-300">22 Mins Between Shows</span>
          </div>
        </div>

      </div>

      {/* Theatre Rankings Table */}
      <div className="p-6 rounded-2xl bg-[#161710] border border-amber-900/40 shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg font-black text-white">Multiplex Network Performance Matrix</h2>
            <p className="text-xs text-slate-400 mt-0.5">Benchmarked capacity utilization and ticket receipts</p>
          </div>
          <span className="text-xs font-semibold text-amber-400">All 6 Metro Clusters Connected</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-amber-950/80 text-amber-200/60 font-semibold uppercase tracking-wider text-[11px]">
                <th className="pb-3 px-3">Theatre Venue</th>
                <th className="pb-3 px-3">Location</th>
                <th className="pb-3 px-3">Screens</th>
                <th className="pb-3 px-3">Seat Occupancy</th>
                <th className="pb-3 px-3">Weekly Gross</th>
                <th className="pb-3 px-3 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-950/40">
              {theatreRankings.map((th, idx) => (
                <tr key={idx} className="hover:bg-amber-950/20 transition-colors">
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center text-[10px] font-black border border-amber-500/20">
                      {idx + 1}
                    </span>
                    {th.name}
                  </td>
                  <td className="py-3 px-3 text-slate-300">{th.city}</td>
                  <td className="py-3 px-3 text-slate-400">{th.screens} Screens</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {th.occupancy}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-extrabold text-amber-400">{th.revenue}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-0.5 text-emerald-400 font-bold">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      {th.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AnalyticsPage;
