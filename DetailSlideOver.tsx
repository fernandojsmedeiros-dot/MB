import { X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getCategoryConfig } from '@/data/materials';
import { categoryIconMap, categoryAccentGradients } from '@/config/categoryStyles';
import { groupProperties } from '@/utils/propertyGroups';
import { getPolymerDisplayName } from '@/utils/polymerNames';
import { translateColumnLabel } from '@/utils/columnLabels';

const LONG_TEXT_THRESHOLD = 40;

export function DetailSlideOver() {
  const { detailMaterial, closeDetail } = useApp();

  if (!detailMaterial) return null;

  const config = getCategoryConfig(detailMaterial.category);
  const Icon = categoryIconMap[detailMaterial.category];

  // For polymers: show didactic name, with ASTM prefix when ASTM filter is active
  let displayName = detailMaterial.commercialName;
  if (detailMaterial.category === 'plastics') {
    displayName = getPolymerDisplayName(detailMaterial.data);
  }

  const excludedKeys = new Set([...config.standardColumns, config.nameColumn, 'ID']);
  const allEntries = Object.entries(detailMaterial.data).filter(
    ([key]) => !excludedKeys.has(key)
  );
  const propertyGroups = groupProperties(allEntries);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={closeDetail} />

      {/* Bottom sheet panel */}
      <div className="relative flex max-h-[85vh] w-full max-w-md flex-col rounded-t-2xl bg-white shadow-2xl animate-slide-in-bottom sm:rounded-2xl">
        {/* Drag handle */}
        <div className="flex justify-center pt-2">
          <div className="h-1 w-10 rounded-full bg-steel-200" />
        </div>

        {/* Header */}
        <div className={`bg-gradient-to-br ${categoryAccentGradients[detailMaterial.category]} mt-2 rounded-t-lg px-5 py-4 text-white`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs text-white/70">{detailMaterial.id}</p>
                <h2 className="mt-0.5 truncate text-lg font-bold">{displayName}</h2>
                <p className="text-xs text-white/80">{config.label}</p>
              </div>
            </div>
            <button
              onClick={closeDetail}
              className="flex-shrink-0 rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {config.standardColumns.map((col) => (
              <div key={col} className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
                <p className="text-[10px] text-white/60">{translateColumnLabel(col).split('(')[0].trim()}</p>
                <p className="mt-0.5 truncate text-xs font-semibold" title={detailMaterial.data[col]}>
                  {detailMaterial.data[col] || '-'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Full Specifications - scrollable, grouped by category */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-steel-400">
            Full Specifications
          </h3>
          <div className="space-y-5">
            {propertyGroups.map((group) => (
              <div key={group.label}>
                <div className="mb-2 flex items-center gap-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">
                    {group.label}
                  </h4>
                  <div className="h-px flex-1 bg-steel-100" />
                </div>
                <dl className="space-y-0 divide-y divide-steel-100">
                  {group.entries.map(([key, value]) => {
                    const isLongText = (value || '').length > LONG_TEXT_THRESHOLD;
                    return (
                      <div key={key} className="py-3">
                        <dt className="text-xs font-semibold text-steel-500">
                          {translateColumnLabel(key)}
                        </dt>
                        {isLongText ? (
                          <dd className="mt-1 text-sm leading-relaxed text-steel-800">
                            {value || '-'}
                          </dd>
                        ) : (
                          <dd className="mt-0.5 text-sm font-medium text-steel-900" title={value}>
                            {value || '-'}
                          </dd>
                        )}
                      </div>
                    );
                  })}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
