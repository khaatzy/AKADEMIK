import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col w-full px-margin py-space-xl gap-space-lg animate-pulse">
      <div className="h-28 bg-surface-container-high rounded-xl w-full"></div>
      <div className="grid grid-cols-3 gap-2.5">
        <div className="h-20 bg-surface-container rounded-xl"></div>
        <div className="h-20 bg-surface-container rounded-xl"></div>
        <div className="h-20 bg-surface-container rounded-xl"></div>
      </div>
      <div className="h-36 bg-surface-container-high rounded-xl w-full"></div>
      <div className="space-y-3">
        <div className="h-16 bg-surface-container rounded-xl w-full"></div>
        <div className="h-16 bg-surface-container rounded-xl w-full"></div>
      </div>
    </div>
  );
}
