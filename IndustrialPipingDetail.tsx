import { useState } from 'react';
import {
  X,
  Fuel,
  Gauge,
  Ruler,
  Weight,
  Droplets,
  Waves,
  Calculator,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { categoryIconMap, categoryAccentGradients } from '@/config/categoryStyles';
import { translateValue } from '@/utils/translateValue';

type CalcMode = 'flow' | 'volume';

export function IndustrialPipingDetail() {
  const { pipingDetail, closePipingDetail } = useApp();
  const [mode, setMode] = useState<CalcMode>('flow');
  const [flowRate, setFlowRate] = useState('');
  const [flowUnit, setFlowUnit] = useState<'m3h' | 'lmin'>('m3h');
  const [lineLength, setLineLength] = useState('');

  if (!pipingDetail) return null;

  const data = pipingDetail.data;
  const Icon = categoryIconMap['industrial-piping'];
  const nps = data['Bitola_pol'] || '-';
  const schedule = translateValue(data['Classe_Schedule'] || '-');
  const norma = data['Norma'] || '-';
  const odMm = parseFloat((data['Diametro_Ext_mm'] || '0').replace(',', '.')) || 0;
  const thicknessMm = parseFloat((data['Espessura_mm'] || '0').replace(',', '.')) || 0;
  const idMm = parseFloat((data['Diametro_Int_mm'] || '0').replace(',', '.')) || 0;
  const internalAreaCm2 = parseFloat((data['Area_Interna_cm2'] || '0').replace(',', '.')) || 0;
  const weightBlack = parseFloat((data['Peso_Preto_kg_m'] || '0').replace(',', '.')) || 0;
  const weightGalv = parseFloat((data['Peso_Galv_kg_m'] || '0').replace(',', '.')) || 0;

  // Internal area in m² for velocity calculation
  const internalAreaM2 = internalAreaCm2 / 10000;

  // Flow & Velocity: Q in m³/s, v = Q / A
  const flowNum = parseFloat(flowRate) || 0;
  const flowM3h = flowUnit === 'm3h' ? flowNum : flowNum / 1000 * 60;
  const flowM3s = flowM3h / 3600;
  const velocity = internalAreaM2 > 0 ? flowM3s / internalAreaM2 : 0;
  const hasFlowInput = flowNum > 0;

  // Line Volume & Weight
  const lengthNum = parseFloat(lineLength) || 0;
  const dryWeightBlack = lengthNum * weightBlack;
  const dryWeightGalv = lengthNum * weightGalv;
  const internalVolumeLiters = (internalAreaM2 * lengthNum) * 1000;
  const hasLengthInput = lengthNum > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={closePipingDetail} />

      <div className="relative flex max-h-[88vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-2xl animate-slide-in-bottom sm:rounded-2xl">
        {/* Drag handle */}
        <div className="flex justify-center pt-2">
          <div className="h-1 w-10 rounded-full bg-steel-200" />
        </div>

        {/* Header */}
        <div className={`bg-gradient-to-br ${categoryAccentGradients['industrial-piping']} mt-2 rounded-t-lg px-5 py-4 text-white`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <Fuel className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs text-white/70">{pipingDetail.id}</p>
                <h2 className="mt-0.5 truncate text-lg font-bold">NPS {nps} · Sch {schedule}</h2>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <span>{norma}</span>
                </div>
              </div>
            </div>
            <button
              onClick={closePipingDetail}
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
              <p className="text-[10px] text-white/60">Wall Thickness</p>
              <p className="mt-0.5 truncate text-xs font-semibold">{thicknessMm > 0 ? `${thicknessMm} mm` : '-'}</p>
            </div>
            <div className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <p className="text-[10px] text-white/60">Inner Dia.</p>
              <p className="mt-0.5 truncate text-xs font-semibold">{idMm > 0 ? `${idMm} mm` : '-'}</p>
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
              <PropCard icon={Gauge} label="Internal Area" value={internalAreaCm2 > 0 ? internalAreaCm2.toFixed(2) : '-'} unit="cm²" />
              <PropCard icon={Weight} label="Weight (Black)" value={weightBlack > 0 ? weightBlack.toFixed(2) : '-'} unit="kg/m" />
              <PropCard icon={Weight} label="Weight (Galv.)" value={weightGalv > 0 ? weightGalv.toFixed(2) : '-'} unit="kg/m" />
              <PropCard icon={Ruler} label="Standard" value={norma} unit="" />
            </div>
          </div>

          {/* Calculation mode tabs */}
          <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">Engineering Calculators</h4>
            <div className="h-px flex-1 bg-steel-100" />
          </div>
          <div className="mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setMode('flow')}
                className={`flex flex-1 items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${
                  mode === 'flow'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                }`}
              >
                <Waves className="h-4 w-4" />
                Flow & Velocity
              </button>
              <button
                onClick={() => setMode('volume')}
                className={`flex flex-1 items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${
                  mode === 'volume'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                }`}
              >
                <Droplets className="h-4 w-4" />
                Volume & Weight
              </button>
            </div>
          </div>

          {/* Calculator content */}
          {mode === 'flow' ? (
            <div className="space-y-3">
              {/* Visual diagram */}
              <div className="flex items-center justify-center rounded-lg border border-steel-100 bg-steel-50/50 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-20 items-center justify-center rounded-full border-2 border-orange-300 bg-orange-50/40">
                    <ArrowRight className="h-4 w-4 text-orange-400" />
                  </div>
                  <span className="text-[10px] font-bold text-orange-500">FLOW →</span>
                </div>
              </div>

              {/* Input with unit toggle */}
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-steel-500">
                  <Waves className="h-3 w-3" />
                  Fluid Flow Rate
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={flowRate}
                    onChange={(e) => setFlowRate(e.target.value)}
                    placeholder="e.g. 10"
                    className="w-full rounded-lg border border-steel-200 bg-white py-2.5 px-3 text-sm text-steel-900 placeholder-steel-400 transition-colors focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-100"
                  />
                  <div className="flex flex-shrink-0 overflow-hidden rounded-lg border border-steel-200">
                    <button
                      onClick={() => setFlowUnit('m3h')}
                      className={`px-3 text-xs font-semibold transition-colors ${
                        flowUnit === 'm3h' ? 'bg-orange-600 text-white' : 'bg-white text-steel-500 hover:bg-steel-50'
                      }`}
                    >
                      m³/h
                    </button>
                    <button
                      onClick={() => setFlowUnit('lmin')}
                      className={`px-3 text-xs font-semibold transition-colors ${
                        flowUnit === 'lmin' ? 'bg-orange-600 text-white' : 'bg-white text-steel-500 hover:bg-steel-50'
                      }`}
                    >
                      L/min
                    </button>
                  </div>
                </div>
              </div>

              {/* Output */}
              <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100/50 p-4">
                <div className="flex items-center gap-2 text-orange-600">
                  <Calculator className="h-4 w-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Fluid Velocity</span>
                </div>
                <p className="mt-2 text-3xl font-bold text-orange-700">
                  {hasFlowInput ? velocity.toFixed(2) : '—'}
                  <span className="ml-1.5 text-lg font-normal text-orange-400">m/s</span>
                </p>
                {hasFlowInput && (
                  <p className="mt-1 text-xs text-orange-500">
                    Flow: {flowM3h.toFixed(2)} m³/h · Area: {internalAreaCm2.toFixed(2)} cm²
                  </p>
                )}
                <p className="mt-2 font-mono text-[10px] text-orange-400">
                  v = Q / A = ({flowM3h.toFixed(2)} / 3600) / {(internalAreaM2).toFixed(6)}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Visual diagram */}
              <div className="flex items-center justify-center rounded-lg border border-steel-100 bg-steel-50/50 py-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex h-8 w-28 items-center justify-center rounded-sm border-2 border-orange-300 bg-orange-50/40">
                    <span className="text-[9px] font-bold text-orange-400">L (m)</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-orange-300" />
                </div>
              </div>

              {/* Input */}
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-steel-500">
                  <Ruler className="h-3 w-3" />
                  Total Line Length — meters
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={lineLength}
                  onChange={(e) => setLineLength(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full rounded-lg border border-steel-200 bg-white py-2.5 px-3 text-sm text-steel-900 placeholder-steel-400 transition-colors focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-100"
                />
              </div>

              {/* Outputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100/50 p-4">
                  <div className="flex items-center gap-2 text-orange-600">
                    <Weight className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Dry Weight (Black)</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-orange-700">
                    {hasLengthInput ? dryWeightBlack.toFixed(2) : '—'}
                    <span className="ml-1 text-sm font-normal text-orange-400">kg</span>
                  </p>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100/50 p-4">
                  <div className="flex items-center gap-2 text-orange-600">
                    <Droplets className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Internal Volume</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-orange-700">
                    {hasLengthInput ? internalVolumeLiters.toFixed(1) : '—'}
                    <span className="ml-1 text-sm font-normal text-orange-400">L</span>
                  </p>
                </div>
              </div>

              {hasLengthInput && (
                <div className="rounded-lg border border-orange-100 bg-orange-50/30 px-4 py-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-steel-500">Galvanized Weight</span>
                    <span className="font-bold text-orange-700">{dryWeightGalv.toFixed(2)} kg</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-steel-500">Weight Difference</span>
                    <span className="font-bold text-orange-600">{(dryWeightGalv - dryWeightBlack).toFixed(2)} kg</span>
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-orange-400">
                    W = L × kg/m · V = A × L × 1000
                  </p>
                </div>
              )}
            </div>
          )}
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
  unit: string;
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
