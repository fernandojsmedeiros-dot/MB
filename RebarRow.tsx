import { ChevronRight, Cylinder } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { MaterialRecord } from '@/types';

interface RebarRowProps {
  material: MaterialRecord;
}

export function RebarRow({ material }: RebarRowProps) {
  const { openRebarDetail } = useApp();
  const data = material.data;
  const bitola = data['Bitola_mm'] || '-';
  const norma = data['Norma_Especificacao'] || '-';
  const peso = data['Peso_Teorico_kg_m'] || '-';
  const escoamento = data['Escoamento_MPa'] || '-';

  return (
    <div
      onClick={() => openRebarDetail(material)}
      className="group flex cursor-pointer items-center gap-3 border-b border-steel-100 px-4 py-3 transition-colors hover:bg-steel-50 active:bg-steel-50"
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-rose-50">
        <Cylinder className="h-4 w-4 text-rose-600" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-steel-900">
          Ø {bitola} mm
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-steel-500">
          <span className="truncate">{norma}</span>
          <span className="text-steel-300">·</span>
          <span className="truncate">{peso} kg/m</span>
          <span className="text-steel-300">·</span>
          <span className="truncate">Yield {escoamento} MPa</span>
        </div>
      </div>

      <ChevronRight className="h-4 w-4 flex-shrink-0 text-steel-300 transition-colors group-hover:text-steel-500" />
    </div>
  );
}
