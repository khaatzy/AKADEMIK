'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AppHeader() {
  const pathname = usePathname();

  const getSectionTitle = () => {
    if (pathname.startsWith('/jadwal')) return 'Jadwal Dan Tugas';
    if (pathname.startsWith('/materi')) return 'Materi Dan Vault';
    if (pathname.startsWith('/tutor-ai')) return 'Tutor Ai';
    return 'Beranda';
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-2xl mx-auto h-16 px-margin flex items-center justify-between">
        <div className="flex items-center gap-space-sm min-w-0">
          <div className="h-8 w-8 relative flex-shrink-0">
            <Image
              alt="Studika Logo"
              src="https://lh3.googleusercontent.com/aida/AEtjO1Wu2Ehu1yczbpG4wqZuw18XPsVNgC9c1dRQtM-vXg3x1o6ALm2JFXBV4R3ue2-d-ZG-eZk1AamL_E1FJQGZlsHBMI4GaXt-o8e_FRmRTdJlJuQp2PFdZuc04AHui6WODHkTNTyl7qZCVxVhlp1Ly4imfjwcMTIY1lduBvrxmmTKYcq1OD2y78zIc7jiWj2oKQDKLFhkGbsCHVJ29k5G36jbuI7io5moy0378QlH2Yii-g"
              fill
              className="object-contain"
              sizes="32px"
              priority
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-primary font-headline-sm text-headline-sm truncate font-semibold leading-tight">
              Studika
            </span>
            <span className="text-on-surface-variant font-label-sm text-label-sm truncate leading-none">
              {getSectionTitle()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-space-sm flex-shrink-0">
          <button
            aria-label="Notifikasi"
            className="relative w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary ring-2 ring-surface"></span>
          </button>
          <Link
            className="flex items-center justify-center p-0.5 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
            href="/login"
            title="Profil Pengguna (Klik untuk ke Halaman Login)"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden relative border border-outline-variant/40">
              <Image
                alt="Profile Avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFmfrqNDI1DOmXj3RD7Wu5qoP6oSC6cpjtbS3bOatUagc_WjFL7pYpV3LnG8KjuKzCjkw9PVqPoxlY1PfNhInLW3yjh-iG6cdluD_TwKK6vsCAKkKtfxL-pBmN_ZiUOyu-jCKYSXBdi6gDEdtHaergCKP6A5uZJtk43dC4uolCU2M65C6v0VxfsEAgt6rrZnTvCtV8qCTCNkJhtn0Lmgmu48XisCFTwW1TftTycyOF"
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
