import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { MOCK_REVENUE_CHART } from '../../api/mockData';

const RevenueChart = () => {
  const [activeDay, setActiveDay] = useState(MOCK_REVENUE_CHART[5]); // Default Saturday

  const maxRevenue = Math.max(...MOCK_REVENUE_CHART.map((d) => d.revenue));
  const totalWeeklyRevenue = MOCK_REVENUE_CHART.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <div className="p-6 rounded-3xl bg-[#161710] border border-amber-900/40 shadow-xl flex flex-col justify-between">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-white">Revenue Summary</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              +18.4% this week
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Gross box-office receipts across all screens
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Weekly Total</span>
            <span className="text-lg font-black text-white">
              ${totalWeeklyRevenue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Bar Chart Visualization */}
      <div className="pt-2 pb-4">
        <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2">
          {MOCK_REVENUE_CHART.map((item) => {
            const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
            const isSelected = activeDay.day === item.day;

            return (
              <div
                key={item.day}
                onClick={() => setActiveDay(item)}
                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
              >
                {/* Value pill on hover or selection */}
                <div
                  className={`text-[10px] font-mono font-bold transition-all ${
                    isSelected
                      ? 'text-amber-400 opacity-100 -translate-y-0.5'
                      : 'text-slate-400 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  ${(item.revenue / 1000).toFixed(1)}k
                </div>

                {/* Bar */}
                <div className="w-full max-w-[40px] bg-slate-900/80 rounded-t-xl h-36 flex items-end p-1 transition-all group-hover:bg-slate-800/80">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-t from-amber-700 via-amber-500 to-yellow-400 shadow-lg shadow-amber-500/30'
                        : 'bg-gradient-to-t from-slate-800 to-slate-600 group-hover:from-amber-800 group-hover:to-amber-500'
                    }`}
                  />
                </div>

                {/* Day label */}
                <span
                  className={`text-xs font-semibold transition-colors ${
                    isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Stats & Breakdown */}
      <div className="p-3.5 rounded-2xl bg-[#12130d] border border-amber-900/40 flex flex-wrap items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs border border-amber-500/30">
            {activeDay.day}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-200">
                ${activeDay.revenue.toLocaleString()} Box Office
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                ({activeDay.bookings} Tickets Sold)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Peak demand period: 07:00 PM - 10:30 PM</p>
          </div>
        </div>

        {/* Format Breakdown */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-400 text-[11px]">IMAX 70mm (52%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-slate-400 text-[11px]">Dolby 3D (31%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            <span className="text-slate-400 text-[11px]">2D (17%)</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RevenueChart;
