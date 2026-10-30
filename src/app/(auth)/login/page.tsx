'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Email validation and domain detection
  const normalizedEmail = email.trim().toLowerCase();
  const hasEduDomain =
    normalizedEmail.includes('.ac.id') ||
    normalizedEmail.includes('.edu') ||
    normalizedEmail.includes('.sch.id');
  const isValidBasicEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

  let emailBadgeText = 'Format .ac.id / .edu';
  let emailBadgeClass =
    'font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant transition-colors duration-200';
  let isEmailValid = false;

  if (hasEduDomain && isValidBasicEmail) {
    emailBadgeText = 'Domain Institusi Resmi';
    emailBadgeClass =
      'font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold transition-colors duration-200';
    isEmailValid = true;
  } else if (isValidBasicEmail) {
    emailBadgeText = 'Email Standar';
    emailBadgeClass =
      'font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant transition-colors duration-200';
    isEmailValid = true;
  }

  // Password strength calculation
  let pwdScore = 0;
  if (password.length >= 8) pwdScore++;
  if (/[A-Z]/.test(password)) pwdScore++;
  if (/[0-9]/.test(password)) pwdScore++;
  if (/[^A-Za-z0-9]/.test(password)) pwdScore++;

  let pwdMeterWidth = '0%';
  let pwdMeterClass = 'h-full bg-outline transition-all duration-300';
  let pwdStrengthText = 'Kekuatan: -';
  let pwdStrengthClass = 'font-code-sm text-code-sm text-outline';

  if (password.length > 0) {
    if (pwdScore <= 1) {
      pwdMeterWidth = '25%';
      pwdMeterClass = 'h-full bg-error transition-all duration-300';
      pwdStrengthText = 'Kekuatan: Rentan';
      pwdStrengthClass = 'font-code-sm text-code-sm text-error';
    } else if (pwdScore <= 2) {
      pwdMeterWidth = '55%';
      pwdMeterClass = 'h-full bg-primary-container transition-all duration-300';
      pwdStrengthText = 'Kekuatan: Cukup';
      pwdStrengthClass = 'font-code-sm text-code-sm text-primary';
    } else {
      pwdMeterWidth = '100%';
      pwdMeterClass = 'h-full bg-secondary transition-all duration-300';
      pwdStrengthText = 'Kekuatan: Terproteksi';
      pwdStrengthClass = 'font-code-sm text-code-sm text-secondary font-bold';
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulated fast auth flow as specified in Issue #1
    setTimeout(() => {
      setIsLoading(false);
      router.push('/beranda');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-margin pt-safe pb-safe">
      <main className="w-full max-w-md flex flex-col space-y-space-lg">
        {/* Welcoming Branding & Academic Focus Card */}
        <div className="relative overflow-hidden rounded-xl bg-surface-container-low p-space-lg shadow-sm">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-secondary-fixed/20 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col space-y-space-xs">
            <div className="flex items-center space-x-space-xs">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary">
                <span className="material-symbols-outlined text-[18px]">school</span>
              </span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                Portal Akademik
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface pt-space-xs font-semibold">
              Selamat Datang di Studika
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Ruang belajar terpadu dengan asisten AI etis, proteksi privasi riset, dan pendamping disiplin harian Anda.
            </p>
          </div>
        </div>

        {/* Main Login Form Container */}
        <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm space-y-space-lg">
          <form onSubmit={handleLogin} className="space-y-space-lg">
            {/* Email Field */}
            <div className="space-y-space-xs">
              <div className="flex items-center justify-between">
                <label
                  className="font-label-lg text-label-lg text-on-surface"
                  htmlFor="student-email"
                >
                  Email Siswa / Institusi
                </label>
                <span className={emailBadgeClass}>{emailBadgeText}</span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-space-md text-on-surface-variant material-symbols-outlined text-[20px] pointer-events-none">
                  mail
                </span>
                <input
                  id="student-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@kampus.ac.id"
                  type="email"
                  required
                  className="w-full pl-11 pr-10 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all"
                />
                <span
                  className={`absolute right-space-md material-symbols-outlined text-[20px] transition-opacity duration-200 ${
                    isEmailValid
                      ? hasEduDomain
                        ? 'text-secondary opacity-100'
                        : 'text-outline opacity-100'
                      : 'opacity-0'
                  }`}
                >
                  check_circle
                </span>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-space-xs">
              <div className="flex items-center justify-between">
                <label
                  className="font-label-lg text-label-lg text-on-surface"
                  htmlFor="student-pwd"
                >
                  Kata Sandi Akun
                </label>
                <span className={pwdStrengthClass}>{pwdStrengthText}</span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-space-md text-on-surface-variant material-symbols-outlined text-[20px] pointer-events-none">
                  lock
                </span>
                <input
                  id="student-pwd"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-11 pr-11 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all"
                />
                <button
                  type="button"
                  aria-label="Lihat password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-space-sm p-1.5 rounded-full text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[20px] block">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>

              {/* Password Strength Meter */}
              <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-1.5 flex">
                <div
                  style={{ width: pwdMeterWidth }}
                  className={pwdMeterClass}
                ></div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-space-xs">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 rounded-DEFAULT bg-surface-container-high peer-checked:bg-primary flex items-center justify-center text-on-primary transition-colors">
                  <span
                    className={`material-symbols-outlined text-[16px] font-bold transition-transform ${
                      rememberMe ? 'scale-100' : 'scale-0'
                    }`}
                  >
                    check
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Ingat Saya
                </span>
              </label>
              <button
                type="button"
                className="font-label-md text-label-md text-primary hover:underline focus:outline-none"
              >
                Lupa Password?
              </button>
            </div>

            {/* CTA Primary Submit Button */}
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
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Akun Belajar</span>
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>

          {/* SSO Alternative Divider */}
          <div className="relative flex items-center justify-center py-space-xs">
            <div className="w-full h-px bg-surface-container-high"></div>
            <span className="absolute bg-surface-container-lowest px-3 font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Atau Masuk Melalui
            </span>
          </div>

          {/* Academic SSO Provider Button */}
          <button
            onClick={() => router.push('/beranda')}
            type="button"
            className="w-full py-3 px-space-md rounded-xl bg-surface-container-low text-on-surface font-label-lg text-label-lg flex items-center justify-center space-x-space-sm hover:bg-surface-container transition-all active:scale-[0.99]"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span className="truncate">Akun Sekolah / Google Education</span>
          </button>
        </div>

        {/* Security & Privacy Protection Guarantee */}
        <div className="rounded-xl bg-surface-container p-space-md flex items-start space-x-space-sm">
          <div className="p-2 rounded-lg bg-surface-container-lowest text-secondary shrink-0 shadow-sm">
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
          </div>
          <div className="flex flex-col space-y-0.5">
            <div className="flex items-center space-x-1.5">
              <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                Perlindungan Akademik ISO/IEC 27001
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Catatan, draf skripsi, dan ringkasan AI Anda terenkripsi end-to-end tanpa digunakan untuk pelatihan model publik.
            </p>
          </div>
        </div>

        {/* Register Link Footer */}
        <div className="text-center pt-space-xs pb-space-lg">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Belum punya akun pelajar?{' '}
            <button
              onClick={() => alert('Fitur pendaftaran akun institusi segera hadir.')}
              className="font-label-lg text-label-lg text-primary hover:underline ml-1 font-semibold"
            >
              Daftar gratis sekarang
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
