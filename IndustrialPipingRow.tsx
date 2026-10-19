import { ChevronRight, Fuel } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { translateValue } from '@/utils/translateValue';
import type { MaterialRecord } from '@/types';

interface IndustrialPipingRowProps {
  material: MaterialRecord;
}

export function IndustrialPipingRow({ material }: IndustrialPipingRowProps) {
  const { openPipingDetail } = useApp();
  const data = material.data;
  const nps = data['Bitola_pol'] || '-';
  const schedule = translateValue(data['Classe_Schedule'] || '-');
  const od = data['Diametro_Ext_mm'] || '-';
  const norma = data['Norma'] || '-';

  return (
    <div
      onClick={() => openPipingDetail(material)}
      className="group flex cursor-pointer items-center gap-3 border-b border-steel-100 px-4 py-3 transition-colors hover:bg-steel-50 active:bg-steel-50"
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-orange-50">
        <Fuel className="h-4 w-4 text-orange-600" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-steel-900">
          NPS {nps} · Sch {schedule}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-steel-500">
          <span className="truncate">OD {od} mm</span>
          <span className="text-steel-300">·</span>
          <span className="truncate">{norma}</span>
        </div>
      </div>

      <ChevronRight className="h-4 w-4 flex-shrink-0 text-steel-300 transition-colors group-hover:text-steel-500" />
    </div>
  );
}
