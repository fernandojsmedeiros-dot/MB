import { ChevronRight, Grip } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { translateValue } from '@/utils/translateValue';
import type { MaterialRecord } from '@/types';

interface BeamChannelRowProps {
  material: MaterialRecord;
}

export function BeamChannelRow({ material }: BeamChannelRowProps) {
  const { openBeamChannelDetail } = useApp();
  const data = material.data;
  const tipo = translateValue(data['Tipo'] || '-');
  const medida = data['Medida_Nominal'] || '-';
  const altura = data['Altura_mm'] || '-';
  const largura = data['Largura_mm'] || '-';
  const peso = data['Peso_kg_m'] || '-';

  return (
    <div
      onClick={() => openBeamChannelDetail(material)}
      className="group flex cursor-pointer items-center gap-3 border-b border-steel-100 px-4 py-3 transition-colors hover:bg-steel-50 active:bg-steel-50"
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50">
        <Grip className="h-4 w-4 text-amber-600" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-steel-900">
          {tipo} {medida}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-steel-500">
          <span className="truncate">H {altura} mm</span>
          <span className="text-steel-300">·</span>
          <span className="truncate">W {largura} mm</span>
          <span className="text-steel-300">·</span>
          <span className="truncate">{peso} kg/m</span>
        </div>
      </div>

      <ChevronRight className="h-4 w-4 flex-shrink-0 text-steel-300 transition-colors group-hover:text-steel-500" />
    </div>
  );
}
