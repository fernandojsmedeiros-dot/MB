import { ChevronRight, Layers, Circle, Square, RectangleHorizontal } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { TubularGroup } from '@/types';

const SHAPE_ICONS: Record<string, typeof Circle> = {
  Redondo: Circle,
  Quadrado: Square,
  Retangular: RectangleHorizontal,
};

const SHAPE_LABELS: Record<string, string> = {
  Redondo: 'Circular / Round',
  Quadrado: 'Square',
  Retangular: 'Rectangular',
};

interface TubularGroupRowProps {
  group: TubularGroup;
}

export function TubularGroupRow({ group }: TubularGroupRowProps) {
  const { openTubularGroup } = useApp();
  const ShapeIcon = SHAPE_ICONS[group.shape] || Layers;
  const shapeLabel = SHAPE_LABELS[group.shape] || group.shape;
  const thicknessCount = group.items.length;

  return (
    <div
      onClick={() => openTubularGroup(group)}
      className="group flex cursor-pointer items-center gap-3 border-b border-steel-100 px-4 py-3 transition-colors hover:bg-steel-50 active:bg-steel-50"
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-50">
        <ShapeIcon className="h-4 w-4 text-cyan-600" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-steel-900" title={group.externalDimension}>
          {group.externalDimension}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-steel-500">
          <span className="truncate">{shapeLabel}</span>
          <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold text-cyan-700">
            {thicknessCount} {thicknessCount === 1 ? 'thickness' : 'thicknesses'}
          </span>
        </div>
      </div>

      <ChevronRight className="h-4 w-4 flex-shrink-0 text-steel-300 transition-colors group-hover:text-steel-500" />
    </div>
  );
}
