import React from 'react';
import { Film, RefreshCw } from 'lucide-react';

const EmptyState = ({
  title = 'No Movies Found',
  description = 'We couldn\'t find any movies matching your current filters or search term.',
  onReset,
  resetLabel = 'Reset All Filters'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#161710] rounded-2xl border border-dashed border-amber-900/40">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400">
        <Film className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-sm font-medium transition-colors border border-slate-700"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{resetLabel}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
