import { useState, useMemo } from 'react';
import { ArrowUp, ArrowLeftRight, ArrowDownWideNarrow, Calculator, Gauge } from 'lucide-react';
import { SCREW_SIZES, PROPERTY_CLASSES, getMaxTensileLoad, getMaxShearLoad, getClampLoad } from '@/data/screws';

export function TensileShearView() {
  const [selectedSizeId, setSelectedSizeId] = useState(SCREW_SIZES[0].id);
  const [selectedClass, setSelectedClass] = useState('8.8');

  const screw = useMemo(
    () => SCREW_SIZES.find((s) => s.id === selectedSizeId) || SCREW_SIZES[0],
    [selectedSizeId]
  );

  const availableClasses = screw.classes;
  const activeClass = availableClasses.includes(selectedClass) ? selectedClass : availableClasses[0];

  const tensileLoad = getMaxTensileLoad(screw, activeClass);
  const shearLoad = getMaxShearLoad(screw, activeClass);
  const clampLoad = getClampLoad(screw, activeClass);
  const classData = PROPERTY_CLASSES[activeClass];

  return (
    <div className="space-y-4">
      {/* Engineering Diagram Image */}
      <div className="overflow-hidden rounded-lg border border-steel-100 bg-white">
        <div className="border-b border-steel-100 px-4 py-2.5">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">
            Force Diagram
          </h4>
        </div>
        <div className="flex items-center justify-center bg-gradient-to-b from-slate-50/50 to-white p-4">
          <img
            src="/image_bb8f1a.webp"
            alt="Engineering diagram of a bolted joint showing tensile load (red arrows), shear force (blue arrows), and clamp load (green arrows)"
            className="h-auto w-full max-w-sm rounded-lg object-contain"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-steel-500">
            <Calculator className="h-3 w-3" />
            Screw Size
          </label>
          <select
            value={selectedSizeId}
            onChange={(e) => setSelectedSizeId(e.target.value)}
            className="w-full rounded-lg border border-steel-200 bg-white py-2.5 px-3 text-sm text-steel-900 transition-colors focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-100"
          >
            {SCREW_SIZES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-steel-500">
            <Gauge className="h-3 w-3" />
            Property Class
          </label>
          <select
            value={activeClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full rounded-lg border border-steel-200 bg-white py-2.5 px-3 text-sm text-steel-900 transition-colors focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-100"
          >
            {availableClasses.map((cls) => (
              <option key={cls} value={cls}>
                {PROPERTY_CLASSES[cls]?.label || cls}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Static properties */}
      <div className="grid grid-cols-3 gap-2 rounded-lg border border-steel-100 bg-steel-50/50 p-3">
        <div>
          <p className="text-[10px] font-medium text-steel-500">Pitch</p>
          <p className="mt-0.5 text-xs font-bold text-steel-900">{screw.pitch}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-steel-500">Stress Area</p>
          <p className="mt-0.5 text-xs font-bold text-steel-900">{screw.tensileStressAreaMm2.toFixed(1)} mm²</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-steel-500">Tensile Strength</p>
          <p className="mt-0.5 text-xs font-bold text-steel-900">{classData?.tensileStrengthMpa} MPa</p>
        </div>
      </div>

      {/* Three Output Boxes matching the image arrows — Pro gated */}
      <div className="mb-4">
      <div className="mb-2 flex items-center gap-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">Load Calculations</h4>
        <div className="h-px flex-1 bg-steel-100" />
      </div>
        <div className="space-y-3">
          {/* Tensile Load - red arrows */}
          <div className="flex items-center gap-3 rounded-lg bg-gradient-to-br from-red-50 to-red-100/50 p-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-100">
              <ArrowUp className="h-5 w-5 text-red-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-red-600">
                <span className="text-[10px] font-bold uppercase tracking-wider">Tensile Load</span>
                <span className="text-[9px] text-red-400">red arrows</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-red-700">
                {tensileLoad > 0 ? tensileLoad.toFixed(1) : '—'}
                <span className="ml-1 text-sm font-normal text-red-400">kN</span>
              </p>
            </div>
            <p className="hidden text-right font-mono text-[10px] text-red-400 sm:block">
              σ_u × A_s
            </p>
          </div>

          {/* Shear Load - blue arrows */}
          <div className="flex items-center gap-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 p-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <ArrowLeftRight className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-blue-600">
                <span className="text-[10px] font-bold uppercase tracking-wider">Shear Load</span>
                <span className="text-[9px] text-blue-400">blue arrows</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-blue-700">
                {shearLoad > 0 ? shearLoad.toFixed(1) : '—'}
                <span className="ml-1 text-sm font-normal text-blue-400">kN</span>
              </p>
            </div>
            <p className="hidden text-right font-mono text-[10px] text-blue-400 sm:block">
              0.6 × Tensile
            </p>
          </div>

          {/* Clamp Load - green arrows */}
          <div className="flex items-center gap-3 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100">
              <ArrowDownWideNarrow className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-emerald-600">
                <span className="text-[10px] font-bold uppercase tracking-wider">Clamp Load</span>
                <span className="text-[9px] text-emerald-400">green arrows</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-emerald-700">
                {clampLoad > 0 ? clampLoad.toFixed(1) : '—'}
                <span className="ml-1 text-sm font-normal text-emerald-400">kN</span>
              </p>
            </div>
            <p className="hidden text-right font-mono text-[10px] text-emerald-400 sm:block">
              σ_proof × A_s
            </p>
          </div>
        </div>

        <p className="font-mono text-[10px] text-steel-400">
          Tensile = σ_u × A_s / 1000 · Shear = 0.6 × Tensile · Clamp = σ_proof × A_s / 1000
        </p>
      </div>
    </div>
  );
}
