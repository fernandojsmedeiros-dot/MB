import { useState } from 'react';
import {
  X,
  Square,
  ScrollText,
  Ruler,
  Weight,
  Calculator,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { categoryIconMap, categoryAccentGradients } from '@/config/categoryStyles';
import { translateValue } from '@/utils/translateValue';

type CalcMode = 'blank' | 'slitter';

export function SheetMetalDetail() {
  const { sheetMetalDetail, closeSheetMetalDetail } = useApp();
  const [mode, setMode] = useState<CalcMode>('blank');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [slitWidth, setSlitWidth] = useState('');

  if (!sheetMetalDetail) return null;

  const data = sheetMetalDetail.data;
  const Icon = categoryIconMap['sheet-metals'];
  const gauge = data['Bitola_MSG'] || '-';
  const thicknessMm = parseFloat((data['Espessura_mm'] || '0').replace(',', '.')) || 0;
  const thicknessIn = data['Espessura_pol'] || '-';
  const weightPerM2 = parseFloat((data['Peso_kg_m2'] || '0').replace(',', '.')) || 0;
  const category = translateValue(data['Categoria'] || '-');
  const norma = data['Norma'] || '-';
  const application = translateValue(data['Aplicacao_Tipica'] || '-');

  // Blank calculator: Weight = (X/1000) * (Y/1000) * Peso_kg_m2
  const widthNum = parseFloat(width) || 0;
  const lengthNum = parseFloat(length) || 0;
  const blankWeight = (widthNum / 1000) * (lengthNum / 1000) * weightPerM2;
  const blankArea = (widthNum / 1000) * (lengthNum / 1000);

  // Slitter calculator: Linear Weight = (Width/1000) * Peso_kg_m2
  const slitNum = parseFloat(slitWidth) || 0;
  const linearWeight = (slitNum / 1000) * weightPerM2;

  const hasBlankInput = widthNum > 0 && lengthNum > 0;
  const hasSlitInput = slitNum > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={closeSheetMetalDetail} />

      <div className="relative flex max-h-[88vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-2xl animate-slide-in-bottom sm:rounded-2xl">
        {/* Drag handle */}
        <div className="flex justify-center pt-2">
          <div className="h-1 w-10 rounded-full bg-steel-200" />
        </div>

        {/* Header */}
        <div className={`bg-gradient-to-br ${categoryAccentGradients['sheet-metals']} mt-2 rounded-t-lg px-5 py-4 text-white`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs text-white/70">{sheetMetalDetail.id}</p>
                <h2 className="mt-0.5 truncate text-lg font-bold">Gauge {gauge}</h2>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <span>{category}</span>
                  <span className="text-white/50">·</span>
                  <span>{norma}</span>
                </div>
              </div>
            </div>
            <button
              onClick={closeSheetMetalDetail}
              className="flex-shrink-0 rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick properties */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <p className="text-[10px] text-white/60">Thickness</p>
              <p className="mt-0.5 truncate text-xs font-semibold">{thicknessMm > 0 ? `${thicknessMm} mm` : '-'}</p>
            </div>
            <div className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <p className="text-[10px] text-white/60">Thickness (in)</p>
              <p className="mt-0.5 truncate text-xs font-semibold">{thicknessIn}</p>
            </div>
            <div className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <p className="text-[10px] text-white/60">Weight (kg/m²)</p>
              <p className="mt-0.5 truncate text-xs font-semibold">{weightPerM2 > 0 ? weightPerM2.toFixed(2) : '-'}</p>
            </div>
          </div>
        </div>

        {/* Body: scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Material properties */}
          <div className="mb-5">
            <div className="mb-2 flex items-center gap-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">
                Material Properties
              </h4>
              <div className="h-px flex-1 bg-steel-100" />
            </div>
            <dl className="divide-y divide-steel-100">
              <div className="py-2.5">
                <dt className="text-xs font-semibold text-steel-500">Typical Application</dt>
                <dd className="mt-0.5 text-sm font-medium text-steel-900">{application}</dd>
              </div>
            </dl>
          </div>

          {/* Calculation mode tabs */}
          <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">Calculators</h4>
            <div className="h-px flex-1 bg-steel-100" />
          </div>
          <div className="mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setMode('blank')}
                className={`flex flex-1 items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${
                  mode === 'blank'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                <Square className="h-4 w-4" />
                Blank Calculator
              </button>
              <button
                onClick={() => setMode('slitter')}
                className={`flex flex-1 items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${
                  mode === 'slitter'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                <ScrollText className="h-4 w-4" />
                Slitter Calculator
              </button>
            </div>
          </div>

          {/* Calculator content */}
          {mode === 'blank' ? (
            <div className="space-y-3">
              {/* Visual diagram */}
              <div className="flex items-center justify-center rounded-lg border border-steel-100 bg-steel-50/50 py-4">
                <div className="relative">
                  <div className="flex h-24 w-32 items-center justify-center rounded-md border-2 border-dashed border-indigo-300 bg-indigo-50/40">
                    <span className="text-[10px] font-bold text-indigo-400">SHEET</span>
                  </div>
                  {/* Width arrows */}
                  <div className="absolute -top-4 left-0 right-0 flex items-center justify-center">
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600">
                      <ArrowRight className="h-3 w-3 rotate-180" />
                      <span>X (Width)</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                  {/* Length arrows */}
                  <div className="absolute -right-12 top-0 bottom-0 flex items-center">
                    <div className="flex flex-col items-center gap-1 text-[10px] font-semibold text-indigo-600">
                      <ArrowRight className="h-3 w-3 -rotate-90" />
                      <span>Y</span>
                      <ArrowRight className="h-3 w-3 rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-steel-500">
                    <Ruler className="h-3 w-3" />
                    Width (X) — mm
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="e.g. 1000"
                    className="w-full rounded-lg border border-steel-200 bg-white py-2.5 px-3 text-sm text-steel-900 placeholder-steel-400 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-steel-500">
                    <Ruler className="h-3 w-3 rotate-90" />
                    Length (Y) — mm
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder="e.g. 2000"
                    className="w-full rounded-lg border border-steel-200 bg-white py-2.5 px-3 text-sm text-steel-900 placeholder-steel-400 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Output */}
              <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-4">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Weight className="h-4 w-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total Piece Weight</span>
                </div>
                <p className="mt-2 text-3xl font-bold text-indigo-700">
                  {hasBlankInput ? blankWeight.toFixed(3) : '—'}
                  <span className="ml-1.5 text-lg font-normal text-indigo-400">kg</span>
                </p>
                {hasBlankInput && (
                  <p className="mt-1 text-xs text-indigo-500">
                    Area: {blankArea.toFixed(4)} m² · {(weightPerM2 || 0).toFixed(2)} kg/m²
                  </p>
                )}
                <p className="mt-2 font-mono text-[10px] text-indigo-400">
                  W = (X/1000) × (Y/1000) × {weightPerM2.toFixed(2)}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Visual diagram */}
              <div className="flex items-center justify-center rounded-lg border border-steel-100 bg-steel-50/50 py-4">
                <div className="flex items-center gap-3">
                  {/* Coil representation */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-indigo-300 bg-indigo-50/40">
                    <div className="h-5 w-5 rounded-full border-2 border-indigo-300" />
                  </div>
                  {/* Strip unwinding */}
                  <div className="flex items-center">
                    <div className="h-8 w-28 rounded-sm border-2 border-dashed border-indigo-300 bg-indigo-50/40">
                      <div className="flex h-full items-center justify-center text-[9px] font-bold text-indigo-400">
                        STRIP
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-indigo-300" />
                  </div>
                </div>
              </div>

              {/* Input */}
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-steel-500">
                  <Ruler className="h-3 w-3" />
                  Slitter Width — mm
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={slitWidth}
                  onChange={(e) => setSlitWidth(e.target.value)}
                  placeholder="e.g. 125"
                  className="w-full rounded-lg border border-steel-200 bg-white py-2.5 px-3 text-sm text-steel-900 placeholder-steel-400 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-100"
                />
              </div>

              {/* Output */}
              <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-4">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Calculator className="h-4 w-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Linear Weight</span>
                </div>
                <p className="mt-2 text-3xl font-bold text-indigo-700">
                  {hasSlitInput ? linearWeight.toFixed(3) : '—'}
                  <span className="ml-1.5 text-lg font-normal text-indigo-400">kg/m</span>
                </p>
                {hasSlitInput && (
                  <p className="mt-1 text-xs text-indigo-500">
                    Strip width: {slitNum} mm · {(weightPerM2 || 0).toFixed(2)} kg/m²
                  </p>
                )}
                <p className="mt-2 font-mono text-[10px] text-indigo-400">
                  LW = (Width/1000) × {weightPerM2.toFixed(2)}
                </p>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
