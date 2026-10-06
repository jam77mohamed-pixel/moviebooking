import React from 'react';

export const MovieCardSkeleton = () => {
  return (
    <div className="bg-[#161710] rounded-2xl border border-amber-900/40 overflow-hidden animate-pulse flex flex-col h-full shadow-lg">
      {/* Poster Skeleton */}
      <div className="relative aspect-[2/3] w-full bg-slate-800">
        <div className="absolute top-3 right-3 w-12 h-6 rounded-md bg-slate-700/60" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="h-5 bg-slate-700/80 rounded w-4/5 mb-2" />
          <div className="flex gap-2 mb-3">
            <div className="h-4 bg-slate-800 rounded w-14" />
            <div className="h-4 bg-slate-800 rounded w-16" />
          </div>
          <div className="h-3 bg-slate-800/60 rounded w-full mb-1.5" />
          <div className="h-3 bg-slate-800/60 rounded w-3/4 mb-4" />
        </div>

        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
          <div className="h-4 bg-slate-800 rounded w-20" />
          <div className="h-8 bg-slate-700 rounded-lg w-24" />
        </div>
      </div>
    </div>
  );
};

export const DashboardStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-5 rounded-2xl bg-[#161710] border border-amber-900/40">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800" />
            <div className="w-16 h-5 rounded-full bg-slate-800" />
          </div>
          <div className="w-24 h-4 bg-slate-800 rounded mb-2" />
          <div className="w-32 h-8 bg-slate-700 rounded" />
        </div>
      ))}
    </div>
  );
};
