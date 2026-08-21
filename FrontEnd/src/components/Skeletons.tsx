import React from 'react';

export const StatCardSkeleton: React.FC = () => (
  <div className="glass-card p-6 rounded-xl border border-slate-800 space-y-4">
    <div className="flex items-center justify-between">
      <div className="h-3 w-28 rounded skeleton-shimmer"></div>
      <div className="w-10 h-10 rounded-xl skeleton-shimmer"></div>
    </div>
    <div className="space-y-2">
      <div className="h-8 w-24 rounded skeleton-shimmer"></div>
      <div className="h-3 w-36 rounded skeleton-shimmer"></div>
    </div>
  </div>
);

export const TableSkeleton: React.FC = () => (
  <div className="space-y-4 p-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-slate-800/50">
        <div className="flex items-center gap-3 w-1/4">
          <div className="w-10 h-10 rounded-xl skeleton-shimmer shrink-0"></div>
          <div className="space-y-2 w-full">
            <div className="h-4 w-32 rounded skeleton-shimmer"></div>
            <div className="h-3 w-44 rounded skeleton-shimmer"></div>
          </div>
        </div>
        <div className="h-4 w-24 rounded skeleton-shimmer"></div>
        <div className="h-4 w-28 rounded skeleton-shimmer"></div>
        <div className="h-4 w-20 rounded skeleton-shimmer"></div>
        <div className="h-6 w-16 rounded-full skeleton-shimmer"></div>
        <div className="h-8 w-20 rounded-lg skeleton-shimmer"></div>
      </div>
    ))}
  </div>
);
