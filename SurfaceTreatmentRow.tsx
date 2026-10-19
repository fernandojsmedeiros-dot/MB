import { ChevronRight, SprayCan } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { translateValue } from '@/utils/translateValue';
import type { MaterialRecord } from '@/types';

interface SurfaceTreatmentRowProps {
  material: MaterialRecord;
}

export function SurfaceTreatmentRow({ material }: SurfaceTreatmentRowProps) {
  const { openSurfaceTreatmentDetail } = useApp();

  const name = translateValue(material.data['name'] || material.commercialName);
  const category = material.data['category'] || '-';
  const baseMaterial = translateValue(material.data['base_material'] || '-');
  const saltSprayHours = material.data['salt_spray_hours'] || '-';

  return (
    <div
      onClick={() => openSurfaceTreatmentDetail(material)}
      className="group flex cursor-pointer items-center gap-3 border-b border-steel-100 px-4 py-3 transition-colors hover:bg-steel-50 active:bg-steel-50"
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-lime-50">
        <SprayCan className="h-4 w-4 text-lime-600" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-steel-900">{name}</p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-steel-500">
          <span className="truncate">{category}</span>
          <span className="text-steel-300">·</span>
          <span className="truncate">{baseMaterial}</span>
          <span className="text-steel-300">·</span>
          <span className="font-medium text-steel-600">{saltSprayHours}h</span>
        </div>
      </div>

      <ChevronRight className="h-4 w-4 flex-shrink-0 text-steel-300 transition-colors group-hover:text-steel-500" />
    </div>
  );
}
