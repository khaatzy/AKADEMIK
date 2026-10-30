'use client';

import React from 'react';

export default function AuthErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-margin text-center gap-4 bg-surface">
      <div className="w-14 h-14 rounded-full bg-error-container text-error flex items-center justify-center">
        <span className="material-symbols-outlined text-[32px]">lock_reset</span>
      </div>
      <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
        Gagal Memuat Halaman Masuk
      </h2>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
        {error.message || 'Silakan muat ulang halaman untuk mencoba masuk kembali.'}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md shadow-sm hover:bg-primary-container transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  );
}
