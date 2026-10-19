import { ChevronRight, Hexagon } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { MaterialRecord } from '@/types';

interface StructuralTubeRowProps {
  material: MaterialRecord;
}

export function StructuralTubeRow({ material }: StructuralTubeRowProps) {
  const { openStructuralTubeDetail } = useApp();
  const data = material.data;
  const od = data['Diametro_Externo_mm'] || '-';
  const id = data['Diametro_Interno_mm'] || '-';
  const thickness = data['Espessura_mm'] || '-';
  const weight = data['Peso_kg_m'] || '-';
  const norma = data['Norma'] || '-';

  return (
    <div
      onClick={() => openStructuralTubeDetail(material)}
      className="group flex cursor-pointer items-center gap-3 border-b border-steel-100 px-4 py-3 transition-colors hover:bg-steel-50 active:bg-steel-50"
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-teal-50">
        <Hexagon className="h-4 w-4 text-teal-600" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-steel-900">
          OD {od} mm × Wall {thickness} mm
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-steel-500">
          <span className="truncate">ID {id} mm</span>
          <span className="text-steel-300">·</span>
          <span className="truncate">{weight} kg/m</span>
          <span className="text-steel-300">·</span>
          <span className="truncate">{norma}</span>
        </div>
      </div>

      <ChevronRight className="h-4 w-4 flex-shrink-0 text-steel-300 transition-colors group-hover:text-steel-500" />
    </div>
  );
}
