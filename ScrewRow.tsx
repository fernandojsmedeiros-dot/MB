import { ChevronRight, Wrench } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SCREW_SIZES } from '@/data/screws';
import type { ScrewSize } from '@/data/screws';

interface ScrewRowProps {
  screw: ScrewSize;
}

export function ScrewRow({ screw }: ScrewRowProps) {
  const { openScrewDetail } = useApp();
  const systemLabel = screw.system === 'metric' ? 'Metric' : 'UNC';

  return (
    <div
      onClick={() => openScrewDetail(screw)}
      className="group flex cursor-pointer items-center gap-3 border-b border-steel-100 px-4 py-3 transition-colors hover:bg-steel-50 active:bg-steel-50"
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50">
        <Wrench className="h-4 w-4 text-slate-600" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-steel-900">{screw.label}</p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-steel-500">
          <span className="truncate">Pitch {screw.pitch}</span>
          <span className="text-steel-300">·</span>
          <span className="truncate">{systemLabel}</span>
          <span className="text-steel-300">·</span>
          <span className="truncate">{screw.classes.length} classes</span>
        </div>
      </div>

      <ChevronRight className="h-4 w-4 flex-shrink-0 text-steel-300 transition-colors group-hover:text-steel-500" />
    </div>
  );
}

interface ScrewListProps {
  filter?: string;
}

export function ScrewList({ filter = '' }: ScrewListProps) {
  const filtered = filter
    ? SCREW_SIZES.filter((s) =>
        s.label.toLowerCase().includes(filter.toLowerCase()) ||
        s.id.toLowerCase().includes(filter.toLowerCase()) ||
        s.system.toLowerCase().includes(filter.toLowerCase())
      )
    : SCREW_SIZES;

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-steel-500">No thread sizes found.</p>
        <p className="mt-1 text-xs text-steel-400">Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-steel-100 bg-white">
      {filtered.map((screw) => (
        <ScrewRow key={screw.id} screw={screw} />
      ))}
    </div>
  );
}
