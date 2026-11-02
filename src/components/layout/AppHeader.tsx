'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction, getUserProfile, UserProfileData } from '@/lib/actions/auth';

export function AppHeader() {
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profile, setProfile] = useState<UserProfileData | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getUserProfile();
        if (data) {
          setProfile(data);
        }
      } catch (err) {
        console.warn('Failed to load profile in header:', err);
      }
    }
    fetchProfile();
  }, []);

  const getSectionTitle = () => {
    if (pathname.startsWith('/jadwal')) return 'Jadwal Dan Tugas';
    if (pathname.startsWith('/materi')) return 'Materi Dan Vault';
    if (pathname.startsWith('/tutor-ai')) return 'Tutor Ai';
    if (pathname.startsWith('/lengkapi-profil')) return 'Profil Pelajar';
    return 'Beranda';
  };

  const handleLogout = async () => {
    await logoutAction();
  };

  const userInitial = profile?.fullName
    ? profile.fullName.trim().charAt(0).toUpperCase()
    : 'S';

  return (
    <header className="fixed top-0 inset-x-0 z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-2xl mx-auto h-16 px-margin flex items-center justify-between">
        <Link href="/beranda" className="flex items-center gap-space-sm min-w-0 hover:opacity-90 transition-opacity">
          <div className="h-8 w-8 relative flex-shrink-0">
            <Image
              alt="Studika Logo"
              src="/logo.svg"
              width={32}
              height={32}
              className="w-8 h-8 object-contain rounded-xl"
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
        </Link>

        <div className="relative flex items-center gap-space-sm flex-shrink-0">
          <button
            aria-label="Notifikasi"
            className="relative w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary ring-2 ring-surface"></span>
          </button>

          {/* User Profile Avatar with Interactive Dropdown */}
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center justify-center p-0.5 rounded-full hover:ring-2 hover:ring-primary/20 transition-all focus:outline-none"
            title="Menu Akun & Profil"
            type="button"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden relative border border-outline-variant/40 bg-secondary-fixed flex items-center justify-center text-secondary font-bold text-sm select-none">
              <span>{userInitial}</span>
            </div>
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute top-12 right-0 w-64 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 p-space-md z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="pb-3 border-b border-surface-container-high">
                <p className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                  {profile?.fullName || 'Pelajar Studika'}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  {profile?.institution || 'Portal Belajar Siswa'}
                </p>
                <span className="inline-block mt-1 font-label-sm text-label-sm text-secondary bg-secondary-fixed/50 px-2 py-0.5 rounded-full font-medium">
                  {profile?.educationLevel || 'Pelajar Aktif'}
                </span>
              </div>

              <div className="py-2 space-y-1">
                <Link
                  href="/lengkapi-profil"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-on-surface hover:bg-surface-container font-body-sm text-body-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    manage_accounts
                  </span>
                  <span>Ubah Data Profil</span>
                </Link>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-on-surface font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    verified_user
                  </span>
                  <span>Sesi Terautentikasi</span>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-container-high">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-error-container/40 text-error font-label-md text-label-md hover:bg-error-container transition-colors font-medium"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span>Keluar dari Sesi</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
