import { useState } from 'react';
import {
  X,
  Cylinder,
  Ruler,
  Weight,
  Calculator,
  Scissors,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { categoryIconMap, categoryAccentGradients } from '@/config/categoryStyles';

const PRESET_LENGTHS = [3, 6];

export function MechanicalTubeDetail() {
  const { mechanicalTubeDetail, closeMechanicalTubeDetail } = useApp();
  const [stockLength, setStockLength] = useState('');
  const [partLength, setPartLength] = useState('');

  if (!mechanicalTubeDetail) return null;

  const data = mechanicalTubeDetail.data;
  const Icon = categoryIconMap['mechanical-tubes'];
  const odMm = parseFloat((data['Diametro_Externo_mm'] || '0').replace(',', '.')) || 0;
  const idMm = parseFloat((data['Diametro_Interno_mm'] || '0').replace(',', '.')) || 0;
  const thicknessMm = parseFloat((data['Espessura_mm'] || '0').replace(',', '.')) || 0;
  const weightPerM = parseFloat((data['Peso_kg_m'] || '0').replace(',', '.')) || 0;
  const tolerOd = data['Tolerancia_OD_mm'] || '-';
  const tolerId = data['Tolerancia_ID_mm'] || '-';
  const finish = data['Acabamento'] || '-';
  const norma = data['Norma'] || '-';

  // Machining stock calculator
  const stockNum = parseFloat(stockLength) || 0;
  const partNum = parseFloat(partLength) || 0;
  const totalStockWeight = stockNum * weightPerM;
  const partsPerBar = partNum > 0 ? Math.floor(stockNum / partNum) : 0;
  const remainingLength = partNum > 0 ? stockNum - partsPerBar * partNum : 0;
  const partWeight = partNum * weightPerM;
  const hasStock = stockNum > 0;
  const hasPart = partNum > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={closeMechanicalTubeDetail} />

      <div className="relative flex max-h-[88vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-2xl animate-slide-in-bottom sm:rounded-2xl">
        {/* Drag handle */}
        <div className="flex justify-center pt-2">
          <div className="h-1 w-10 rounded-full bg-steel-200" />
        </div>

        {/* Header */}
        <div className={`bg-gradient-to-br ${categoryAccentGradients['mechanical-tubes']} mt-2 rounded-t-lg px-5 py-4 text-white`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs text-white/70">{mechanicalTubeDetail.id}</p>
                <h2 className="mt-0.5 truncate text-lg font-bold">
                  OD {odMm} mm × Wall {thicknessMm} mm
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <span>{finish}</span>
                  <span className="text-white/50">·</span>
                  <span>{norma}</span>
                </div>
              </div>
            </div>
            <button
              onClick={closeMechanicalTubeDetail}
              className="flex-shrink-0 rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick properties */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <p className="text-[10px] text-white/60">Outer Dia.</p>
              <p className="mt-0.5 truncate text-xs font-semibold">{odMm > 0 ? `${odMm} mm` : '-'}</p>
            </div>
            <div className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <p className="text-[10px] text-white/60">Inner Dia.</p>
              <p className="mt-0.5 truncate text-xs font-semibold">{idMm > 0 ? `${idMm} mm` : '-'}</p>
            </div>
            <div className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <p className="text-[10px] text-white/60">Linear Weight</p>
              <p className="mt-0.5 truncate text-xs font-semibold">{weightPerM > 0 ? `${weightPerM} kg/m` : '-'}</p>
            </div>
          </div>
        </div>

        {/* Body: scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Technical properties */}
          <div className="mb-5">
            <div className="mb-2 flex items-center gap-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">
                Technical Properties
              </h4>
              <div className="h-px flex-1 bg-steel-100" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <PropCard icon={Ruler} label="Wall Thickness" value={thicknessMm > 0 ? `${thicknessMm} mm` : '-'} />
              <PropCard icon={Cylinder} label="Finish" value={finish} />
              <PropCard icon={Ruler} label="OD Tolerance" value={tolerOd} />
              <PropCard icon={Ruler} label="ID Tolerance" value={tolerId} />
            </div>
          </div>

          {/* Machining Stock Calculator */}
          <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">Machining Stock Calculator</h4>
            <div className="h-px flex-1 bg-steel-100" />
          </div>
          <div className="space-y-3">
            {/* Visual diagram */}
            <div className="flex items-center justify-center rounded-lg border border-steel-100 bg-steel-50/50 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-10 items-center justify-center rounded-full border-2 border-stone-300 bg-stone-50/40">
                  <Cylinder className="h-4 w-4 text-stone-400" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="relative flex h-8 w-20 items-center justify-center rounded-sm border-2 border-dashed border-stone-300 bg-stone-50/40">
                    <span className="text-[9px] font-bold text-stone-400">Stock</span>
                  </div>
                  <Scissors className="h-3.5 w-3.5 text-stone-400" />
                  <div className="flex h-6 w-8 items-center justify-center rounded-sm border-2 border-stone-300 bg-stone-50/40">
                    <span className="text-[8px] font-bold text-stone-400">Part</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-stone-300" />
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-steel-500">
                  <Ruler className="h-3 w-3" />
                  Stock Bar Length — m
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={stockLength}
                  onChange={(e) => setStockLength(e.target.value)}
                  placeholder="e.g. 3 or 6"
                  className="w-full rounded-lg border border-steel-200 bg-white py-2.5 px-3 text-sm text-steel-900 placeholder-steel-400 transition-colors focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-100"
                />
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-steel-500">
                  <Scissors className="h-3 w-3" />
                  Part Length — m
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={partLength}
                  onChange={(e) => setPartLength(e.target.value)}
                  placeholder="e.g. 0.05"
                  className="w-full rounded-lg border border-steel-200 bg-white py-2.5 px-3 text-sm text-steel-900 placeholder-steel-400 transition-colors focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-100"
                />
              </div>
            </div>

            {/* Preset buttons */}
            <div className="flex gap-2">
              {PRESET_LENGTHS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setStockLength(String(preset))}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                    stockLength === String(preset)
                      ? 'bg-stone-600 text-white shadow-sm'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {preset} m stock
                </button>
              ))}
            </div>

            {/* Outputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-gradient-to-br from-stone-50 to-stone-100/50 p-4">
                <div className="flex items-center gap-2 text-stone-600">
                  <Weight className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Stock Bar Weight</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-stone-700">
                  {hasStock ? totalStockWeight.toFixed(2) : '—'}
                  <span className="ml-1 text-sm font-normal text-stone-400">kg</span>
                </p>
                {hasStock && (
                  <p className="mt-1 text-xs text-stone-500">
                    {stockNum} m × {weightPerM} kg/m
                  </p>
                )}
              </div>
              <div className="rounded-lg bg-gradient-to-br from-stone-50 to-stone-100/50 p-4">
                <div className="flex items-center gap-2 text-stone-600">
                  <Scissors className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Parts per Bar</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-stone-700">
                  {hasPart && hasStock ? partsPerBar : '—'}
                  <span className="ml-1 text-sm font-normal text-stone-400">pcs</span>
                </p>
                {hasPart && hasStock && (
                  <p className="mt-1 text-xs text-stone-500">
                    Remainder: {remainingLength.toFixed(3)} m
                  </p>
                )}
              </div>
            </div>

            {hasPart && hasStock && partsPerBar > 0 && (
              <div className="rounded-lg border border-stone-100 bg-stone-50/30 px-4 py-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-steel-500">Part Weight</span>
                  <span className="font-bold text-stone-700">{partWeight.toFixed(3)} kg</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-steel-500">Total Parts Weight</span>
                  <span className="font-bold text-stone-700">{(partWeight * partsPerBar).toFixed(2)} kg</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-steel-500">Material Yield</span>
                  <span className="font-bold text-stone-600">{((partWeight * partsPerBar / totalStockWeight) * 100).toFixed(1)}%</span>
                </div>
              </div>
            )}

            <p className="font-mono text-[10px] text-stone-400">
              Parts = floor(Stock / Part) · Yield = (Parts × Part Wt) / Stock Wt
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Ruler;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-steel-100 bg-steel-50/50 px-3 py-2.5">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-steel-400" />
        <p className="text-[10px] font-medium text-steel-500">{label}</p>
      </div>
      <p className="mt-1 text-sm font-bold text-steel-900">{value}</p>
    </div>
  );
}
