import React from 'react';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center">
      <AppHeader />
      <main className="w-full max-w-2xl min-h-screen flex flex-col pt-16 pb-24 px-0 bg-surface">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
