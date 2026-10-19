import { useApp } from '@/context/AppContext';
import { navItems } from '@/config/navigation';
import { TopNav } from '@/components/layout/Sidebar';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { activeSection } = useApp();
  const currentNav = navItems.find((n) => n.id === activeSection);
  const isHome = activeSection === 'home';

  return (
    <div className="min-h-screen bg-steel-100 flex justify-center">
      <div className="relative flex w-full max-w-md flex-col bg-white shadow-2xl sm:my-4 sm:min-h-[calc(100vh-2rem)] sm:rounded-2xl sm:overflow-hidden min-h-screen">
        {/* Fixed top navigation */}
        <TopNav />

        {/* Module header — hidden on Home */}
        {!isHome && currentNav && (
          <header className="flex items-center gap-2 border-b border-steel-100 bg-white px-4 py-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary-500 to-primary-700">
              <span className="text-[9px] font-bold text-white">MB</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold leading-tight text-steel-900">{currentNav.label}</h2>
              <p className="truncate text-[10px] leading-tight text-steel-400">{currentNav.description}</p>
            </div>
            <span className="font-mono text-[10px] text-steel-300">v1.0</span>
          </header>
        )}

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto px-4 py-4">{children}</main>
      </div>
    </div>
  );
}
