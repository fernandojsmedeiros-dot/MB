import { useState } from 'react';
import {
  X,
  Cylinder,
  Ruler,
  Weight,
  Calculator,
  Layers,
  Gauge,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { categoryIconMap, categoryAccentGradients } from '@/config/categoryStyles';

export function RebarDetail() {
  const { rebarDetail, closeRebarDetail } = useApp();
  const [quantity, setQuantity] = useState('');
  const [barLength, setBarLength] = useState('');

  if (!rebarDetail) return null;

  const data = rebarDetail.data;
  const Icon = categoryIconMap['rebars'];
  const bitola = data['Bitola_mm'] || '-';
  const norma = data['Norma_Especificacao'] || '-';
  const escoamento = data['Escoamento_MPa'] || '-';
  const resistencia = data['Resistencia_MPa'] || '-';
  const relacao = data['Relacao_Elastica'] || '-';
  const alongamento = data['Alongamento_pct'] || '-';
  const pino = data['Pino_Dobramento'] || '-';
  const soldabilidade = data['Soldabilidade'] || '-';
  const peso = parseFloat((data['Peso_Teorico_kg_m'] || '0').replace(',', '.')) || 0;

  // Batch weight calculator
  const qtyNum = parseInt(quantity) || 0;
  const lenNum = parseFloat(barLength) || 0;
  const totalLinearMeters = qtyNum * lenNum;
  const batchWeight = totalLinearMeters * peso;
  const hasInput = qtyNum > 0 && lenNum > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={closeRebarDetail} />

      <div className="relative flex max-h-[88vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-2xl animate-slide-in-bottom sm:rounded-2xl">
        <div className="flex justify-center pt-2">
          <div className="h-1 w-10 rounded-full bg-steel-200" />
        </div>

        <div className={`bg-gradient-to-br ${categoryAccentGradients['rebars']} mt-2 rounded-t-lg px-5 py-4 text-white`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs text-white/70">{rebarDetail.id}</p>
                <h2 className="mt-0.5 truncate text-lg font-bold">
                  Ø {bitola} mm
                </h2>
                <p className="text-xs text-white/80">{norma}</p>
              </div>
            </div>
            <button
              onClick={closeRebarDetail}
              className="flex-shrink-0 rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <p className="text-[10px] text-white/60">Yield Strength</p>
              <p className="mt-0.5 truncate text-xs font-semibold">{escoamento} MPa</p>
            </div>
            <div className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <p className="text-[10px] text-white/60">Tensile Strength</p>
              <p className="mt-0.5 truncate text-xs font-semibold">{resistencia} MPa</p>
            </div>
            <div className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <p className="text-[10px] text-white/60">Linear Weight</p>
              <p className="mt-0.5 truncate text-xs font-semibold">{peso > 0 ? `${peso} kg/m` : '-'}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Technical Properties */}
          <div className="mb-5">
            <div className="mb-2 flex items-center gap-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">
                Technical Properties
              </h4>
              <div className="h-px flex-1 bg-steel-100" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <PropCard icon={Gauge} label="Yield Strength (fy)" value={`${escoamento} MPa`} />
              <PropCard icon={Gauge} label="Tensile Strength (fu)" value={`${resistencia} MPa`} />
              <PropCard icon={Calculator} label="Yield/Tensile Ratio" value={relacao} />
              <PropCard icon={Layers} label="Elongation" value={`${alongamento}%`} />
              <PropCard icon={Ruler} label="Bending Pin Diameter" value={pino} />
              <PropCard icon={Weight} label="Linear Weight" value={peso > 0 ? `${peso} kg/m` : '-'} />
            </div>
            <div className="mt-2 rounded-lg border border-steel-100 bg-steel-50/50 px-3 py-2.5">
              <div className="flex items-center gap-1.5">
                <Cylinder className="h-3 w-3 text-steel-400" />
                <p className="text-[10px] font-medium text-steel-500">Weldability</p>
              </div>
              <p className="mt-1 text-sm font-bold text-steel-900">{soldabilidade}</p>
            </div>
          </div>

          {/* Batch Weight Calculator */}
          <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">Rebar Batch Weight Calculator</h4>
            <div className="h-px flex-1 bg-steel-100" />
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-steel-500">
                  <Layers className="h-3 w-3" />
                  Quantity — bars
                </label>
                <input
                  type="number"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full rounded-lg border border-steel-200 bg-white py-2.5 px-3 text-sm text-steel-900 placeholder-steel-400 transition-colors focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-100"
                />
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-steel-500">
                  <Ruler className="h-3 w-3" />
                  Bar Length — m
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={barLength}
                  onChange={(e) => setBarLength(e.target.value)}
                  placeholder="e.g. 12"
                  className="w-full rounded-lg border border-steel-200 bg-white py-2.5 px-3 text-sm text-steel-900 placeholder-steel-400 transition-colors focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-100"
                />
              </div>
            </div>

            {/* Quick preset for common bar counts */}
            <div className="flex gap-2">
              {[25, 50, 100].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setQuantity(String(preset))}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                    quantity === String(preset)
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  {preset} bars
                </button>
              ))}
            </div>

            {/* Outputs */}
            <div className="rounded-lg bg-gradient-to-br from-rose-50 to-rose-100/50 p-4">
              <div className="flex items-center gap-2 text-rose-600">
                <Weight className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Bundle Weight</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-rose-700">
                {hasInput ? batchWeight.toFixed(2) : '—'}
                <span className="ml-1.5 text-lg font-normal text-rose-400">kg</span>
              </p>
              {hasInput && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs text-rose-500">
                    <span>Total Linear Meters</span>
                    <span className="font-bold">{totalLinearMeters.toFixed(1)} m</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-rose-500">
                    <span>Calculation</span>
                    <span className="font-mono">{qtyNum} × {lenNum} m × {peso} kg/m</span>
                  </div>
                </div>
              )}
            </div>

            {hasInput && batchWeight > 0 && (
              <div className="rounded-lg border border-rose-100 bg-rose-50/30 px-4 py-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-steel-500">Weight per Bar</span>
                  <span className="font-bold text-rose-700">{(lenNum * peso).toFixed(2)} kg</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-steel-500">Tons (metric)</span>
                  <span className="font-bold text-rose-700">{(batchWeight / 1000).toFixed(3)} t</span>
                </div>
              </div>
            )}

            <p className="font-mono text-[10px] text-rose-400">
              Weight = Qty × Length × kg/m
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
