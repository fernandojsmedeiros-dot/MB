import { useState, useMemo } from 'react';
import { X, SprayCan, Cog, AlertTriangle, Layers, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getMaterialsByCategory } from '@/data/materials';
import { translateValue } from '@/utils/translateValue';
import type { MaterialRecord } from '@/types';

const MAX_SALT_SPRAY = 1500;

function getSaltSprayColor(hours: number): string {
  if (hours <= 48) return 'from-red-500 to-orange-500';
  if (hours <= 240) return 'from-orange-500 to-amber-500';
  if (hours <= 500) return 'from-amber-500 to-yellow-500';
  if (hours <= 800) return 'from-yellow-500 to-lime-500';
  if (hours <= 1000) return 'from-lime-500 to-green-500';
  return 'from-green-500 to-emerald-600';
}

function getSaltSprayLabel(hours: number): string {
  if (hours <= 48) return 'Low';
  if (hours <= 240) return 'Fair';
  if (hours <= 500) return 'Good';
  if (hours <= 800) return 'Very Good';
  if (hours <= 1000) return 'Excellent';
  return 'Premium';
}

function baseMaterialColor(material: string): string {
  const lower = material.toLowerCase();
  if (lower.includes('alum')) return 'bg-sky-100 text-sky-700 border-sky-200';
  if (lower.includes('steel') || lower.includes('aço') || lower.includes('aco'))
    return 'bg-slate-100 text-slate-700 border-slate-200';
  return 'bg-steel-100 text-steel-700 border-steel-200';
}

export function SurfaceTreatmentDetail() {
  const { surfaceTreatmentDetail, closeSurfaceTreatmentDetail, openSurfaceTreatmentDetail } = useApp();
  const [current, setCurrent] = useState<MaterialRecord | null>(null);

  const item = current || surfaceTreatmentDetail;

  const similarTreatments = useMemo(() => {
    if (!item) return [];
    const all = getMaterialsByCategory('surface-treatments');
    const category = item.data['category'];
    return all
      .filter((t) => t.data['category'] === category && t.id !== item.id)
      .slice(0, 3);
  }, [item]);

  if (!item) return null;

  const rawName = item.data['name'] || item.commercialName;
  const name = translateValue(rawName);
  const category = item.data['category'] || '-';
  const baseMaterial = translateValue(item.data['base_material'] || '-');
  const processType = translateValue(item.data['process_type'] || '-');
  const prerequisites = translateValue(item.data['prerequisites'] || '-');
  const description = item.data['description'] || '-';
  const saltSprayHours = parseInt(item.data['salt_spray_hours'] || '0', 10) || 0;
  const sprayPercent = Math.min((saltSprayHours / MAX_SALT_SPRAY) * 100, 100);

  const handleSwap = (newItem: MaterialRecord) => {
    setCurrent(newItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={() => {
          setCurrent(null);
          closeSurfaceTreatmentDetail();
        }}
      />

      <div className="relative flex max-h-[88vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-2xl animate-slide-in-bottom sm:rounded-2xl">
        <div className="flex justify-center pt-2">
          <div className="h-1 w-10 rounded-full bg-steel-200" />
        </div>

        {/* Header */}
        <div className="bg-gradient-to-br from-lime-600 to-lime-800 mt-2 rounded-t-lg px-5 py-4 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <SprayCan className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="mt-0.5 truncate text-lg font-bold">{name}</h2>
                <span className="mt-0.5 inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-sm">
                  {category}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setCurrent(null);
                closeSurfaceTreatmentDetail();
              }}
              className="flex-shrink-0 rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Salt Spray Progress Bar */}
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">
                ASTM B117 Resistance
              </h4>
              <span className="text-xs font-bold text-steel-700">{saltSprayHours}h</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-steel-100">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${getSaltSprayColor(saltSprayHours)} transition-all duration-500`}
                style={{ width: `${sprayPercent}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-steel-400">
              <span>0h</span>
              <span className="font-semibold text-steel-600">{getSaltSprayLabel(saltSprayHours)}</span>
              <span>1500h+</span>
            </div>
          </div>

          {/* Engineering Info Grid */}
          <div className="mb-5 space-y-3">
            <div className="mb-1 flex items-center gap-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">
                Engineering Info
              </h4>
              <div className="h-px flex-1 bg-steel-100" />
            </div>

            {/* Base Material */}
            <div className="flex items-center gap-3 rounded-lg border border-steel-100 bg-steel-50/50 px-3 py-2.5">
              <Layers className="h-4 w-4 flex-shrink-0 text-steel-400" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium text-steel-500">Base Material</p>
                <span
                  className={`mt-1 inline-block rounded-md border px-2.5 py-0.5 text-xs font-bold ${baseMaterialColor(baseMaterial)}`}
                >
                  {baseMaterial}
                </span>
              </div>
            </div>

            {/* Process Type */}
            <div className="flex items-center gap-3 rounded-lg border border-steel-100 bg-steel-50/50 px-3 py-2.5">
              <Cog className="h-4 w-4 flex-shrink-0 text-steel-400" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium text-steel-500">Process</p>
                <p className="mt-0.5 text-sm font-medium text-steel-900">{processType}</p>
              </div>
            </div>

            {/* Prerequisites */}
            <div className="flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50/50 px-3 py-2.5">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-500" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium text-amber-600">Prerequisites</p>
                <p className="mt-0.5 text-sm font-medium text-steel-900">{prerequisites}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-5">
            <div className="mb-2 flex items-center gap-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">
                Technical Description
              </h4>
              <div className="h-px flex-1 bg-steel-100" />
            </div>
            <p className="text-sm leading-relaxed text-steel-700">{description}</p>
          </div>

          {/* Similar Alternatives */}
          {similarTreatments.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">
                  Similar Alternatives
                </h4>
                <div className="h-px flex-1 bg-steel-100" />
              </div>
              <div className="flex flex-wrap gap-2">
                {similarTreatments.map((alt) => {
                  const altName = translateValue(alt.data['name'] || alt.commercialName);
                  const altHours = parseInt(alt.data['salt_spray_hours'] || '0', 10) || 0;
                  const isActive = item.id === alt.id;
                  return (
                    <button
                      key={alt.id}
                      onClick={() => handleSwap(alt)}
                      disabled={isActive}
                      className={`group flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                        isActive
                          ? 'border-lime-300 bg-lime-50 text-lime-700'
                          : 'border-steel-200 bg-white text-steel-600 hover:border-lime-300 hover:bg-lime-50 hover:text-lime-700'
                      }`}
                    >
                      <span className="truncate max-w-[140px]">{altName}</span>
                      <span className="text-[10px] text-steel-400 group-hover:text-lime-500">
                        {altHours}h
                      </span>
                      {!isActive && (
                        <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <p className="mt-4 font-mono text-[10px] text-steel-400">
            Surface Treatment · ASTM B117 Salt Spray Test
          </p>
        </div>
      </div>
    </div>
  );
}
