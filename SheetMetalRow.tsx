import { ChevronRight, Layers } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { translateValue } from '@/utils/translateValue';
import type { MaterialRecord } from '@/types';

interface SheetMetalRowProps {
  material: MaterialRecord;
}

export function SheetMetalRow({ material }: SheetMetalRowProps) {
  const { openSheetMetalDetail } = useApp();
  const data = material.data;
  const gauge = data['Bitola_MSG'] || '-';
  const thicknessMm = data['Espessura_mm'] || '-';
  const category = translateValue(data['Categoria'] || '-');

  return (
    <div
      onClick={() => openSheetMetalDetail(material)}
      className="group flex cursor-pointer items-center gap-3 border-b border-steel-100 px-4 py-3 transition-colors hover:bg-steel-50 active:bg-steel-50"
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50">
        <Layers className="h-4 w-4 text-indigo-600" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-steel-900">
          Gauge {gauge} · {thicknessMm} mm
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-steel-500">
          <span className="truncate">{category}</span>
        </div>
      </div>

      <ChevronRight className="h-4 w-4 flex-shrink-0 text-steel-300 transition-colors group-hover:text-steel-500" />
    </div>
  );
}
