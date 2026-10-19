import { useState } from 'react';
import {
  X,
  Construction,
  Ruler,
  Weight,
  Calculator,
  TrendingDown,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { categoryIconMap, categoryAccentGradients } from '@/config/categoryStyles';

const PRESET_LENGTHS = [6, 12];

export function WideFlangeDetail() {
  const { wideFlangeDetail, closeWideFlangeDetail } = useApp();
  const [length, setLength] = useState('');
  const [span, setSpan] = useState('');
  const [load, setLoad] = useState('');

  if (!wideFlangeDetail) return null;

  const data = wideFlangeDetail.data;
  const Icon = categoryIconMap['wide-flange-h-columns'];
  const categoria = data['Categoria'] || '-';
  const bitola = data['Bitola'] || '-';
  const alturaMm = parseFloat((data['Altura_d_mm'] || '0').replace(',', '.')) || 0;
  const larguraMm = parseFloat((data['Largura_bf_mm'] || '0').replace(',', '.')) || 0;
  const twMm = parseFloat((data['Espessura_Alma_tw_mm'] || '0').replace(',', '.')) || 0;
  const tfMm = parseFloat((data['Espessura_Mesa_tf_mm'] || '0').replace(',', '.')) || 0;
  const areaCm2 = parseFloat((data['Area_cm2'] || '0').replace(',', '.')) || 0;
  const peso = parseFloat((data['Peso_kg_m'] || '0').replace(',', '.')) || 0;

  // Bar weight calc
  const lengthNum = parseFloat(length) || 0;
  const totalWeight = lengthNum * peso;
  const metersPerTon = peso > 0 ? 1000 / peso : 0;
  const hasInput = lengthNum > 0;

  // Deflection estimator: simply supported beam, central point load
  // δ = P × L³ / (48 × E × I)
  // E = 200,000 MPa (steel), I estimated from dimensions
  // I ≈ (bf × tf × (d - tf)²) / 2 + (tw × (d - 2×tf)³) / 12
  const E = 200000; // MPa
  const spanNum = parseFloat(span) || 0;
  const loadNum = parseFloat(load) || 0;
  const spanMm = spanNum * 1000;
  const loadN = loadNum * 1000; // kN to N
  // Simplified I calculation (cm^4 → mm^4: × 10000)
  const I_mm4 = alturaMm > 0 && larguraMm > 0
    ? (larguraMm * tfMm * Math.pow(alturaMm - tfMm, 2)) / 2 + (twMm * Math.pow(alturaMm - 2 * tfMm, 3)) / 12
    : 0;
  const I_cm4 = I_mm4 / 10000;
  const deflection = spanMm > 0 && loadN > 0 && I_mm4 > 0
    ? (loadN * Math.pow(spanMm, 3)) / (48 * E * I_mm4)
    : 0;
  const deflectionMm = deflection;
  const spanRatio = deflectionMm > 0 && spanMm > 0 ? spanMm / deflectionMm : 0;
  const hasDeflection = spanNum > 0 && loadNum > 0 && I_mm4 > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={closeWideFlangeDetail} />

      <div className="relative flex max-h-[88vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-2xl animate-slide-in-bottom sm:rounded-2xl">
        <div className="flex justify-center pt-2">
          <div className="h-1 w-10 rounded-full bg-steel-200" />
        </div>

        <div className={`bg-gradient-to-br ${categoryAccentGradients['wide-flange-h-columns']} mt-2 rounded-t-lg px-5 py-4 text-white`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs text-white/70">{wideFlangeDetail.id}</p>
                <h2 className="mt-0.5 truncate text-lg font-bold">{bitola}</h2>
                <p className="text-xs text-white/80">{categoria}</p>
              </div>
            </div>
            <button
              onClick={closeWideFlangeDetail}
              className="flex-shrink-0 rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <p className="text-[10px] text-white/60">Height (d)</p>
              <p className="mt-0.5 truncate text-xs font-semibold">{alturaMm > 0 ? `${alturaMm} mm` : '-'}</p>
            </div>
            <div className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <p className="text-[10px] text-white/60">Width (bf)</p>
              <p className="mt-0.5 truncate text-xs font-semibold">{larguraMm > 0 ? `${larguraMm} mm` : '-'}</p>
            </div>
            <div className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <p className="text-[10px] text-white/60">Linear Weight</p>
              <p className="mt-0.5 truncate text-xs font-semibold">{peso > 0 ? `${peso} kg/m` : '-'}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="mb-5">
            <div className="mb-2 flex items-center gap-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">
                Technical Properties
              </h4>
              <div className="h-px flex-1 bg-steel-100" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <PropCard icon={Ruler} label="Web Thickness (tw)" value={twMm > 0 ? `${twMm} mm` : '-'} />
              <PropCard icon={Ruler} label="Flange Thickness (tf)" value={tfMm > 0 ? `${tfMm} mm` : '-'} />
              <PropCard icon={Calculator} label="Section Area" value={areaCm2 > 0 ? `${areaCm2} cm²` : '-'} />
              <PropCard icon={Calculator} label="Moment of Inertia (I)" value={I_cm4 > 0 ? I_cm4.toFixed(1) : '-'} unit="cm⁴" />
              <PropCard icon={Weight} label="Linear Weight" value={peso > 0 ? `${peso} kg/m` : '-'} />
              <PropCard icon={Calculator} label="Meters / Ton" value={metersPerTon > 0 ? metersPerTon.toFixed(1) : '-'} unit="m/t" />
            </div>
          </div>

          {/* Bar Weight Calculator */}
          <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">Bar Length & Weight Calculator</h4>
            <div className="h-px flex-1 bg-steel-100" />
          </div>
          <div className="mb-5 space-y-3">
            <div className="flex gap-2">
              {PRESET_LENGTHS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setLength(String(preset))}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                    length === String(preset)
                      ? 'bg-slate-600 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
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
                className="w-full rounded-lg border border-steel-200 bg-white py-2.5 px-3 text-sm text-steel-900 placeholder-steel-400 transition-colors focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-gradient-to-br from-slate-50 to-slate-100/50 p-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <Weight className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Total Bar Weight</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-700">
                  {hasInput ? totalWeight.toFixed(2) : '—'}
                  <span className="ml-1 text-sm font-normal text-slate-400">kg</span>
                </p>
                {hasInput && (
                  <p className="mt-1 text-xs text-slate-500">
                    {lengthNum} m × {peso} kg/m
                  </p>
                )}
              </div>
              <div className="rounded-lg bg-gradient-to-br from-slate-50 to-slate-100/50 p-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calculator className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Meters per Ton</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-700">
                  {metersPerTon > 0 ? metersPerTon.toFixed(1) : '—'}
                  <span className="ml-1 text-sm font-normal text-slate-400">m/t</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  1000 ÷ {peso} kg/m
                </p>
              </div>
            </div>
          </div>
          </div>

          {/* Deflection Estimator */}
          <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">Deflection Estimator</h4>
            <div className="h-px flex-1 bg-steel-100" />
          </div>
          <p className="mb-3 text-[10px] text-steel-400">
            Simply supported beam, central point load. E = 200,000 MPa (steel).
          </p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-steel-500">
                  <Ruler className="h-3 w-3" />
                  Span — meters
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={span}
                  onChange={(e) => setSpan(e.target.value)}
                  placeholder="e.g. 4"
                  className="w-full rounded-lg border border-steel-200 bg-white py-2.5 px-3 text-sm text-steel-900 placeholder-steel-400 transition-colors focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-steel-500">
                  <Weight className="h-3 w-3" />
                  Point Load — kN
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={load}
                  onChange={(e) => setLoad(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full rounded-lg border border-steel-200 bg-white py-2.5 px-3 text-sm text-steel-900 placeholder-steel-400 transition-colors focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-100"
                />
              </div>
            </div>

            <div className="rounded-lg bg-gradient-to-br from-slate-50 to-slate-100/50 p-4">
              <div className="flex items-center gap-2 text-slate-600">
                <TrendingDown className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Max Deflection (δ)</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-slate-700">
                {hasDeflection ? deflectionMm.toFixed(2) : '—'}
                <span className="ml-1.5 text-lg font-normal text-slate-400">mm</span>
              </p>
              {hasDeflection && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-slate-500">
                    Span/Deflection ratio: L/{spanRatio.toFixed(0)}
                  </p>
                  <p className={`text-xs font-semibold ${
                    spanRatio >= 360 ? 'text-emerald-600' : spanRatio >= 240 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {spanRatio >= 360 ? '✓ Within aesthetic limits (L/360)' : spanRatio >= 240 ? '⚠ Within structural limits (L/240)' : '✕ Exceeds typical limits'}
                  </p>
                </div>
              )}
            </div>

            <p className="font-mono text-[10px] text-slate-400">
              δ = P × L³ / (48 × E × I) · I ≈ bf×tf×(d−tf)²/2 + tw×(d−2tf)³/12
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
