import { Atom, Cog, Package, Wrench, SprayCan, Crosshair, Home, type LucideIcon } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { navItems } from '@/config/navigation';
import type { NavSection } from '@/types';

const iconMap: Record<string, LucideIcon> = {
  Atom,
  Cog,
  Package,
  Wrench,
  SprayCan,
  Crosshair,
};

export function TopNav() {
  const { activeSection, setActiveSection } = useApp();

  return (
    <nav className="sticky top-0 z-50 flex flex-wrap items-stretch justify-between border-b border-steel-200 bg-white/95 backdrop-blur-sm">
      {/* Logo — far left, always returns to Home */}
      <button
        onClick={() => setActiveSection('home')}
        className="flex flex-shrink-0 items-center gap-2 border-r border-steel-100 px-3 py-2.5 transition-colors hover:bg-steel-50"
        aria-label="Go to Home Dashboard"
      >
        <img src="/logo.jpg" alt="MechBase" className="h-10 w-auto rounded-md object-contain" />
      </button>

      {/* Home button */}
      <button
        onClick={() => setActiveSection('home')}
        className={`flex flex-1 flex-col items-center gap-0.5 px-1 py-2.5 text-[10px] font-medium leading-tight transition-colors sm:flex-row sm:justify-center sm:gap-1.5 sm:px-3 sm:py-3 sm:text-xs ${
          activeSection === 'home'
            ? 'border-b-2 border-primary-600 text-primary-600'
            : 'text-steel-500 hover:text-steel-800'
        }`}
      >
        <Home className="h-4 w-4 flex-shrink-0" strokeWidth={activeSection === 'home' ? 2.5 : 2} />
        <span className="text-center sm:text-left">Home</span>
      </button>

      {/* Module nav buttons */}
      {navItems.map((item) => {
        const Icon = iconMap[item.icon] || Atom;
        const isActive = activeSection === item.id;
        const shortLabel = item.label.split(' ')[0];
        return (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id as NavSection)}
            className={`flex flex-1 flex-col items-center gap-0.5 px-1 py-2.5 text-[10px] font-medium leading-tight transition-colors sm:flex-row sm:justify-center sm:gap-1.5 sm:px-3 sm:py-3 sm:text-xs ${
              isActive
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-steel-500 hover:text-steel-800'
            }`}
          >
            <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-center sm:text-left">{shortLabel}</span>
          </button>
        );
      })}
    </nav>
  );
}
