import { Box, Cog, Building2, Wrench, Shield, Target, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { NavSection } from '@/types';
import type { LucideIcon } from 'lucide-react';

interface ModuleCard {
  id: NavSection;
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
}

const MODULE_CARDS: ModuleCard[] = [
  {
    id: 'materials',
    title: 'Materials',
    description: 'Engineering polymers, steels, and aluminum with full property data.',
    icon: Box,
    gradient: 'from-steel-500 to-steel-700',
    iconBg: 'bg-steel-100 text-steel-600',
  },
  {
    id: 'mechanical-standards',
    title: 'Mechanical',
    description: 'Tubing, piping, and structural profiles with dimensional specifications.',
    icon: Cog,
    gradient: 'from-cyan-500 to-cyan-700',
    iconBg: 'bg-cyan-100 text-cyan-600',
  },
  {
    id: 'standardized',
    title: 'Construction',
    description: 'Beams, channels, wide flange sections, and reinforcement bars.',
    icon: Building2,
    gradient: 'from-amber-500 to-amber-700',
    iconBg: 'bg-amber-100 text-amber-600',
  },
  {
    id: 'fasteners',
    title: 'Fasteners',
    description: 'Screw threads, torque data, tensile and shear strength, and tightening tools.',
    icon: Wrench,
    gradient: 'from-slate-500 to-slate-700',
    iconBg: 'bg-slate-100 text-slate-600',
  },
  {
    id: 'surface-treatment',
    title: 'Surface Treatments',
    description: 'Coatings, plating, and salt spray resistance data per ASTM B117.',
    icon: Shield,
    gradient: 'from-lime-500 to-lime-700',
    iconBg: 'bg-lime-100 text-lime-600',
  },
  {
    id: 'gdt-guide',
    title: 'GD&T',
    description: 'ASME Y14.5 geometric dimensioning and tolerancing reference guide.',
    icon: Target,
    gradient: 'from-purple-500 to-purple-700',
    iconBg: 'bg-purple-100 text-purple-600',
  },
];

export function HomeDashboard() {
  const { setActiveSection } = useApp();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-steel-700 via-steel-800 to-slate-900 px-6 py-8 text-white shadow-lg">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -left-4 h-24 w-24 rounded-full bg-white/5" />
        <div className="relative">
          <h1 className="text-2xl font-bold tracking-tight">MechBase</h1>
          <p className="mt-1 text-sm text-white/70">
            Advanced Engineering Reference &amp; Tooling Suite
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur-sm">
              ASME Y14.5
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur-sm">
              ASTM B117
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur-sm">
              ISO / DIN / SAE
            </span>
          </div>
        </div>
      </div>

      {/* Section title */}
      <div className="mt-6 mb-3 flex items-center gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-steel-500">
          Modules
        </h2>
        <div className="h-px flex-1 bg-steel-200" />
      </div>

      {/* Module Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MODULE_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              onClick={() => setActiveSection(card.id)}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-steel-200 bg-white p-5 text-left transition-all hover:border-steel-300 hover:shadow-md active:scale-[0.98]"
            >
              {/* Top gradient bar */}
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.gradient}`} />

              {/* Icon */}
              <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg} transition-transform group-hover:scale-110`}>
                <Icon className="h-6 w-6" strokeWidth={2} />
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-steel-900">{card.title}</h3>

              {/* Description */}
              <p className="mt-1 text-xs leading-relaxed text-steel-500">
                {card.description}
              </p>

              {/* Arrow indicator */}
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-steel-400 transition-colors group-hover:text-steel-700">
                <span>Open module</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="mt-6 text-center font-mono text-[10px] text-steel-400">
        MechBase v1.0 · Engineering Reference Database
      </p>
    </div>
  );
}
