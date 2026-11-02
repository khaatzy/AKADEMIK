'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { completeProfileAction, getUserProfile } from '@/lib/actions/auth';

const EDUCATION_LEVELS = [
  { value: 'SD / Madrasah Ibtidaiyah', label: 'SD / MI (Sekolah Dasar)' },
  { value: 'SMP / MTs', label: 'SMP / MTs (Menengah Pertama)' },
  { value: 'SMA / SMK / MA', label: 'SMA / SMK / MA (Menengah Atas)' },
  { value: 'Perguruan Tinggi', label: 'Perguruan Tinggi (Diploma / Sarjana)' },
  { value: 'Umum / Pembelajar Mandiri', label: 'Umum / Pembelajar Mandiri' },
];

export default function CompleteProfilePage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [educationLevel, setEducationLevel] = useState('SMA / SMK / MA');
  const [institution, setInstitution] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const profile = await getUserProfile();
        if (profile) {
          if (profile.fullName && profile.fullName !== 'Pelajar Studika') {
            setFullName(profile.fullName);
          }
          if (profile.birthDate) {
            setBirthDate(profile.birthDate);
          }
          if (profile.educationLevel) {
            setEducationLevel(profile.educationLevel);
          }
          if (profile.institution && profile.institution !== 'Portal Belajar Studika') {
            setInstitution(profile.institution);
          }
          if (profile.email) {
            setUserEmail(profile.email);
          }
        }
      } catch (err) {
        console.warn('Load profile error:', err);
      } finally {
        setIsPageLoading(false);
      }
    }

    loadInitialData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('birthDate', birthDate);
    formData.append('educationLevel', educationLevel);
    formData.append('institution', institution);

    const res = await completeProfileAction(formData);
    setIsLoading(false);

    if (res?.error) {
      setErrorMessage(res.error);
    } else {
      router.push('/beranda');
    }
  };

  const handleSkip = () => {
    router.push('/beranda');
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-primary">
          <span className="animate-spin material-symbols-outlined text-[28px]">progress_activity</span>
          <span className="font-label-lg text-label-lg font-medium">Menyiapkan profil Anda...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-margin pt-safe pb-safe">
      <main className="w-full max-w-lg flex flex-col space-y-space-md">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-space-lg shadow-sm border border-outline-variant/30">
          <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-secondary-fixed/25 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col space-y-space-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 relative flex-shrink-0">
                  <Image
                    alt="Studika Logo"
                    src="/logo.svg"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain rounded-lg"
                    priority
                  />
                </div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                  Studika Profil Pelajar
                </span>
              </div>
              <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                Langkah Terakhir
              </span>
            </div>

            <h1 className="font-headline-lg text-headline-lg text-on-surface pt-2 font-semibold">
              Lengkapi Data Belajar Anda
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Selamat datang di Studika! Lengkapi identitas Anda agar tutor AI, vault materi, dan kalender belajar dapat disesuaikan secara personal.
            </p>
            {userEmail && (
              <div className="pt-1 flex items-center gap-1.5 text-secondary font-code-sm text-[12px]">
                <span className="material-symbols-outlined text-[16px]">account_circle</span>
                <span>Terhubung: <strong>{userEmail}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="rounded-xl bg-error-container/40 border border-error/30 p-space-md flex items-start gap-space-sm animate-in fade-in">
            <span className="material-symbols-outlined text-error text-[20px] flex-shrink-0 mt-0.5">
              error
            </span>
            <div className="flex-1">
              <p className="font-label-md text-label-md text-on-error-container font-semibold">
                Perhatian
              </p>
              <p className="font-body-sm text-body-sm text-on-error-container">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm border border-outline-variant/30 space-y-space-md">
          <form onSubmit={handleSubmit} className="space-y-space-md">
            {/* 1. Nama Lengkap */}
            <div className="space-y-space-xs">
              <label className="font-label-lg text-label-lg text-on-surface block" htmlFor="fullName">
                Nama Lengkap Pelajar <span className="text-primary">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-on-surface-variant material-symbols-outlined text-[20px] pointer-events-none">
                  person
                </span>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all"
                />
              </div>
            </div>

            {/* 2. Tanggal Lahir */}
            <div className="space-y-space-xs">
              <label className="font-label-lg text-label-lg text-on-surface block" htmlFor="birthDate">
                Tanggal Lahir <span className="text-primary">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-on-surface-variant material-symbols-outlined text-[20px] pointer-events-none">
                  calendar_today
                </span>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all"
                />
              </div>
              <p className="font-code-sm text-[11px] text-on-surface-variant">
                Digunakan untuk rekomendasi jadwal dan materi yang sesuai dengan kelompok usia belajar Anda.
              </p>
            </div>

            {/* 3. Jenjang Pendidikan */}
            <div className="space-y-space-xs">
              <label className="font-label-lg text-label-lg text-on-surface block" htmlFor="educationLevel">
                Jenjang Pendidikan <span className="text-primary">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-on-surface-variant material-symbols-outlined text-[20px] pointer-events-none">
                  school
                </span>
                <select
                  id="educationLevel"
                  name="educationLevel"
                  required
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all appearance-none cursor-pointer"
                >
                  {EDUCATION_LEVELS.map((lvl) => (
                    <option key={lvl.value} value={lvl.value}>
                      {lvl.label}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3.5 text-on-surface-variant material-symbols-outlined text-[20px] pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* 4. Asal Sekolah / Kampus / Institusi */}
            <div className="space-y-space-xs">
              <label className="font-label-lg text-label-lg text-on-surface block" htmlFor="institution">
                Asal Sekolah / Kampus / Lembaga <span className="text-primary">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-on-surface-variant material-symbols-outlined text-[20px] pointer-events-none">
                  domain
                </span>
                <input
                  id="institution"
                  name="institution"
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="Contoh: SMA Negeri 1 Jakarta atau Univ. Brawijaya"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-space-lg rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-md active:scale-[0.98] transition-all flex items-center justify-center space-x-space-xs hover:bg-primary-container disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin material-symbols-outlined text-[20px]">
                      progress_activity
                    </span>
                    <span>Menyimpan Profil...</span>
                  </>
                ) : (
                  <>
                    <span>Simpan &amp; Masuk ke Beranda</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSkip}
                className="w-full py-2.5 px-3 text-center text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors"
              >
                Isi nanti (Langsung ke Beranda)
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
