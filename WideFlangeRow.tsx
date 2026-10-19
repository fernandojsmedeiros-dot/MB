import { ChevronRight, Construction } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { MaterialRecord } from '@/types';

interface WideFlangeRowProps {
  material: MaterialRecord;
}

export function WideFlangeRow({ material }: WideFlangeRowProps) {
  const { openWideFlangeDetail } = useApp();
  const data = material.data;
  const categoria = data['Categoria'] || '-';
  const bitola = data['Bitola'] || '-';
  const altura = data['Altura_d_mm'] || '-';
  const largura = data['Largura_bf_mm'] || '-';
  const peso = data['Peso_kg_m'] || '-';

  return (
    <div
      onClick={() => openWideFlangeDetail(material)}
      className="group flex cursor-pointer items-center gap-3 border-b border-steel-100 px-4 py-3 transition-colors hover:bg-steel-50 active:bg-steel-50"
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50">
        <Construction className="h-4 w-4 text-slate-600" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-steel-900">
          {bitola}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-steel-500">
          <span className="truncate">{categoria}</span>
          <span className="text-steel-300">·</span>
          <span className="truncate">d {altura} mm</span>
          <span className="text-steel-300">·</span>
          <span className="truncate">{peso} kg/m</span>
        </div>
      </div>

      <ChevronRight className="h-4 w-4 flex-shrink-0 text-steel-300 transition-colors group-hover:text-steel-500" />
    </div>
  );
}
