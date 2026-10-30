'use client';

import React from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-margin text-center gap-4">
      <div className="w-14 h-14 rounded-full bg-error-container text-error flex items-center justify-center">
        <span className="material-symbols-outlined text-[32px]">error</span>
      </div>
      <div className="flex flex-col gap-1 max-w-sm">
        <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
          Terjadi Gangguan
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {error.message || 'Halaman gagal dimuat. Silakan coba lagi.'}
        </p>
      </div>
      <button
        type="button"
        onClick={() => reset()}
        className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md shadow-sm hover:bg-primary-container transition-colors"
      >
        Muat Ulang Halaman
      </button>
    </div>
  );
}
