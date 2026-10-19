import { useMemo } from 'react';
import { X, GitCompare } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getMaterialById, getCategoryConfig } from '@/data/materials';
import { categoryIconMap, categoryBadgeColors } from '@/config/categoryStyles';
import { groupProperties } from '@/utils/propertyGroups';
import { getPolymerDisplayName } from '@/utils/polymerNames';
import { translateColumnLabel } from '@/utils/columnLabels';

export function CompareModal() {
  const { isCompareModalOpen, closeCompareModal, selectedForCompare, clearCompareSelection } = useApp();

  const materials = useMemo(
    () => selectedForCompare.map(getMaterialById).filter((m): m is NonNullable<typeof m> => m != null),
    [selectedForCompare]
  );

  const allKeys = useMemo(() => {
    const keySet = new Set<string>();
    materials.forEach((m) => Object.keys(m.data).forEach((k) => keySet.add(k)));
    return Array.from(keySet);
  }, [materials]);

  const groupedKeys = useMemo(() => {
    const entries: [string, string][] = allKeys.map((k) => [k, k]);
    return groupProperties(entries);
  }, [allKeys]);

  if (!isCompareModalOpen || materials.length === 0) return null;

  const configs = materials.map((m) => getCategoryConfig(m.category));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={closeCompareModal} />

      <div className="relative flex max-h-[85vh] w-full max-w-md flex-col rounded-t-2xl bg-white shadow-2xl animate-slide-in-bottom sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-steel-100 px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100">
              <GitCompare className="h-4 w-4 text-primary-700" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-steel-900">Compare</h2>
              <p className="text-[10px] text-steel-500">{materials.length} items</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={clearCompareSelection}
              className="rounded-lg px-2 py-1.5 text-xs font-medium text-steel-600 transition-colors hover:bg-steel-100"
            >
              Clear
            </button>
            <button
              onClick={closeCompareModal}
              className="rounded-lg p-1.5 text-steel-600 transition-colors hover:bg-steel-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body - scrollable comparison */}
        <div className="flex-1 overflow-auto">
          {/* Material headers - horizontal scroll on mobile */}
          <div className="sticky top-0 z-10 flex gap-2 border-b border-steel-100 bg-white p-3">
            {materials.map((m, idx) => {
              const Icon = categoryIconMap[m.category];
              return (
                <div key={m.id} className="min-w-[120px] flex-1 rounded-lg border border-steel-200 p-2">
                  <div className="flex items-center gap-1.5">
                    <div className={`flex h-6 w-6 items-center justify-center rounded border ${categoryBadgeColors[m.category]}`}>
                      <Icon className="h-3 w-3" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] text-steel-400">{m.id}</p>
                      <p className="truncate text-xs font-semibold text-steel-900" title={m.category === 'plastics' ? getPolymerDisplayName(m.data) : m.commercialName}>
                        {m.category === 'plastics' ? getPolymerDisplayName(m.data) : m.commercialName}
                      </p>
                    </div>
                  </div>
                  <p className="mt-1 text-[10px] text-steel-500">{configs[idx].label}</p>
                </div>
              );
            })}
          </div>

          {/* Property rows - grouped by category */}
          <div className="space-y-3">
            {groupedKeys.map((group) => (
              <div key={group.label}>
                <div className="sticky top-[64px] z-[5] flex items-center gap-2 bg-steel-50/95 px-3 py-1.5 backdrop-blur-sm">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-steel-500">
                    {group.label}
                  </h4>
                  <div className="h-px flex-1 bg-steel-200" />
                </div>
                <div className="divide-y divide-steel-50">
                  {group.entries.map(([key]) => {
                    const values = materials.map((m) => m?.data[key] || '-');
                    const allSame = values.every((v) => v === values[0]);
                    const hasDiff = !allSame && values.some((v) => v !== '-' && v !== values[0]);

                    return (
                      <div key={key} className="flex gap-2 px-3 py-2">
                        <div className="w-20 flex-shrink-0 text-[11px] font-medium text-steel-500">
                          {translateColumnLabel(key)}
                        </div>
                        <div className="flex flex-1 gap-2">
                          {materials.map((m, idx) => {
                            const value = m?.data[key] || '-';
                            const isDiff = hasDiff && value !== '-' && value !== values.find((v) => v !== '-')?.[0];
                            return (
                              <div
                                key={m?.id || idx}
                                className={`min-w-0 flex-1 text-[11px] ${
                                  isDiff ? 'font-semibold text-primary-700' : 'text-steel-800'
                                }`}
                              >
                                {value}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
