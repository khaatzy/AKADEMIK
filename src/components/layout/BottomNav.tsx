'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Beranda',
      href: '/beranda',
      icon: 'home',
      isActive: pathname === '/beranda' || pathname === '/',
    },
    {
      label: 'Jadwal',
      href: '/jadwal',
      icon: 'event_note',
      isActive: pathname.startsWith('/jadwal'),
    },
    {
      label: 'Vault',
      href: '/materi',
      icon: 'folder_open',
      isActive: pathname.startsWith('/materi'),
    },
    {
      label: 'Tutor AI',
      href: '/tutor-ai',
      icon: 'neurology',
      isActive: pathname.startsWith('/tutor-ai'),
    },
    {
      label: 'Akun',
      href: '/login',
      icon: 'person',
      isActive: pathname.startsWith('/login'),
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/85 backdrop-blur-xl shadow-[0_-2px_12px_rgba(184,110,89,0.06)] border-t border-outline-variant/30">
      <div className="max-w-2xl mx-auto flex items-center justify-around h-16 px-space-xs">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.isActive ? 'page' : undefined}
            className={`flex flex-col items-center justify-center min-w-[56px] h-12 transition-all gap-0.5 ${
              item.isActive
                ? 'text-primary font-bold scale-105'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            <span className="font-label-sm text-label-sm tracking-tight">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
