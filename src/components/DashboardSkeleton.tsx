"use client";

import React from 'react';

export default function DashboardSkeleton() {
  return (
    <div 
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      aria-busy="true"
    >
      <span className="sr-only">Loading moments...</span>
      {[1, 2].map((i) => (
        <div 
          key={i}
          className="p-6.5 rounded-[32px] border border-zinc-200/80 bg-white h-[300px] flex flex-col justify-between relative overflow-hidden"
        >
          <div>
            {/* Occasion tag & views analytics */}
            <div className="flex items-center justify-between">
              {/* Occasion tag placeholder */}
              <div className="h-6 w-24 rounded-full dashboard-skeleton-shimmer" />
              {/* Views badge placeholder */}
              <div className="h-6 w-20 rounded-lg dashboard-skeleton-shimmer" />
            </div>

            {/* Title / Recipient Header */}
            <div className="h-7 w-3/4 mt-4 rounded-lg dashboard-skeleton-shimmer" />
            
            {/* Metadata rows */}
            <div className="flex flex-col gap-2 mt-2">
              <div className="h-4 w-1/2 rounded-md dashboard-skeleton-shimmer" />
              <div className="h-4 w-2/5 rounded-md dashboard-skeleton-shimmer" />
            </div>
          </div>

          {/* Slug display & lock tags */}
          <div className="flex flex-wrap gap-2 py-3.5 border-y border-zinc-100">
            {/* Slug /m/... placeholder */}
            <div className="h-6 w-32 rounded-lg dashboard-skeleton-shimmer" />
            {/* Theme badge placeholder */}
            <div className="h-6 w-20 rounded-lg dashboard-skeleton-shimmer" />
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              {/* Preview button placeholder */}
              <div className="h-9 w-20 rounded-xl dashboard-skeleton-shimmer" />
              {/* Copy Link button placeholder */}
              <div className="h-9 w-24 rounded-xl dashboard-skeleton-shimmer" />
            </div>

            {/* Delete button placeholder */}
            <div className="h-9 w-9 rounded-xl dashboard-skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
