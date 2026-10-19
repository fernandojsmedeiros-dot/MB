import { useState } from 'react';
import {
  X,
  Hexagon,
  Ruler,
  Weight,
  Calculator,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { categoryIconMap, categoryAccentGradients } from '@/config/categoryStyles';

const PRESET_LENGTHS = [6, 12];

export function StructuralTubeDetail() {
  const { structuralTubeDetail, closeStructuralTubeDetail } = useApp();
  const [length, setLength] = useState('');

  if (!structuralTubeDetail) return null;

  const data = structuralTubeDetail.data;
  const Icon = categoryIconMap['structural-tubes'];
  const odMm = parseFloat((data['Diametro_Externo_mm'] || '0').replace(',', '.')) || 0;
  const idMm = parseFloat((data['Diametro_Interno_mm'] || '0').replace(',', '.')) || 0;
  const thicknessMm = parseFloat((data['Espessura_mm'] || '0').replace(',', '.')) || 0;
  const weightPerM = parseFloat((data['Peso_kg_m'] || '0').replace(',', '.')) || 0;
  const norma = data['Norma'] || '-';

  const lengthNum = parseFloat(length) || 0;
  const totalWeight = lengthNum * weightPerM;
  const metersPerTon = weightPerM > 0 ? 1000 / weightPerM : 0;
  const hasInput = lengthNum > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={closeStructuralTubeDetail} />

      <div className="relative flex max-h-[88vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-2xl animate-slide-in-bottom sm:rounded-2xl">
        {/* Drag handle */}
        <div className="flex justify-center pt-2">
          <div className="h-1 w-10 rounded-full bg-steel-200" />
        </div>

        {/* Header */}
        <div className={`bg-gradient-to-br ${categoryAccentGradients['structural-tubes']} mt-2 rounded-t-lg px-5 py-4 text-white`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs text-white/70">{structuralTubeDetail.id}</p>
                <h2 className="mt-0.5 truncate text-lg font-bold">
                  OD {odMm} mm × Wall {thicknessMm} mm
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <span>{norma}</span>
                </div>
              </div>
            </div>
            <button
              onClick={closeStructuralTubeDetail}
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
              <PropCard icon={Weight} label="Linear Weight" value={weightPerM > 0 ? `${weightPerM} kg/m` : '-'} />
              <PropCard icon={Hexagon} label="Standard" value={norma} />
              <PropCard icon={Calculator} label="Meters / Ton" value={metersPerTon > 0 ? metersPerTon.toFixed(1) : '-'} unit="m/t" />
            </div>
          </div>

          {/* Structural Bar Calculator */}
          <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">Structural Bar Calculator</h4>
            <div className="h-px flex-1 bg-steel-100" />
          </div>
          <div className="space-y-3">
            {/* Visual diagram */}
            <div className="flex items-center justify-center rounded-lg border border-steel-100 bg-steel-50/50 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-10 items-center justify-center rounded-full border-2 border-teal-300 bg-teal-50/40">
                  <Hexagon className="h-4 w-4 text-teal-400" />
                </div>
                <div className="flex items-center">
                  <div className="relative flex h-8 w-28 items-center justify-center rounded-sm border-2 border-dashed border-teal-300 bg-teal-50/40">
                    <span className="text-[9px] font-bold text-teal-400">L (m)</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-teal-300" />
                </div>
              </div>
            </div>

            {/* Preset length buttons */}
            <div className="flex gap-2">
              {PRESET_LENGTHS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setLength(String(preset))}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                    length === String(preset)
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                  }`}
                >
                  {preset} m
                </button>
              ))}
              <button
                onClick={() => setLength('')}
                className="flex-1 rounded-lg bg-steel-100 px-3 py-2 text-xs font-semibold text-steel-500 transition-all hover:bg-steel-200"
              >
                Custom
              </button>
            </div>

            {/* Input */}
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-steel-500">
                <Ruler className="h-3 w-3" />
                Bar Length — meters
              </label>
              <input
                type="number"
                step="0.1"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="e.g. 6 or 12"
                className="w-full rounded-lg border border-steel-200 bg-white py-2.5 px-3 text-sm text-steel-900 placeholder-steel-400 transition-colors focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-100"
              />
            </div>

            {/* Outputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-gradient-to-br from-teal-50 to-teal-100/50 p-4">
                <div className="flex items-center gap-2 text-teal-600">
                  <Weight className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Total Bar Weight</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-teal-700">
                  {hasInput ? totalWeight.toFixed(2) : '—'}
                  <span className="ml-1 text-sm font-normal text-teal-400">kg</span>
                </p>
                {hasInput && (
                  <p className="mt-1 text-xs text-teal-500">
                    {lengthNum} m × {weightPerM} kg/m
                  </p>
                )}
              </div>
              <div className="rounded-lg bg-gradient-to-br from-teal-50 to-teal-100/50 p-4">
                <div className="flex items-center gap-2 text-teal-600">
                  <Calculator className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Meters per Ton</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-teal-700">
                  {metersPerTon > 0 ? metersPerTon.toFixed(1) : '—'}
                  <span className="ml-1 text-sm font-normal text-teal-400">m/t</span>
                </p>
                <p className="mt-1 text-xs text-teal-500">
                  1000 ÷ {weightPerM} kg/m
                </p>
              </div>
            </div>

            <p className="font-mono text-[10px] text-teal-400">
              Weight = L × kg/m · Meters/Ton = 1000 ÷ kg/m
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
  unit,
}: {
  icon: typeof Ruler;
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="rounded-lg border border-steel-100 bg-steel-50/50 px-3 py-2.5">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-steel-400" />
        <p className="text-[10px] font-medium text-steel-500">{label}</p>
      </div>
      <p className="mt-1 text-sm font-bold text-steel-900">
        {value}
        {unit && <span className="ml-1 text-[10px] font-normal text-steel-400">{unit}</span>}
      </p>
    </div>
  );
}
