import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, change, isPositive = true, icon: Icon, color = 'indigo', footnote }) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      border: 'border-indigo-500/20'
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      border: 'border-cyan-500/20'
    },
    amber: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/20'
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20'
    },
    blue: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/20'
    },
    red: {
      bg: 'bg-amber-500/15',
      text: 'text-amber-300',
      border: 'border-amber-500/30'
    },
    burgundy: {
      bg: 'bg-amber-500/15',
      text: 'text-amber-300',
      border: 'border-amber-500/30'
    }
  };

  const selected = colorMap[color] || colorMap.amber;

  return (
    <div className="p-5 rounded-2xl bg-[#161710] border border-amber-900/40 hover:border-amber-700/60 transition-all shadow-lg hover:shadow-amber-950/20 flex flex-col justify-between group">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl ${selected.bg} ${selected.text} ${selected.border} border flex items-center justify-center group-hover:scale-105 transition-transform shadow-md`}>
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPositive
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-xs font-medium text-slate-400">{title}</p>
        <h3 className="text-2xl font-black text-white tracking-tight mt-1">
          {value}
        </h3>
        {footnote && (
          <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
            {footnote}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
