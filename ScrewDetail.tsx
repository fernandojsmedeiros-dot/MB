import { useState } from 'react';
import { X, Wrench, Ruler, Gauge, Calculator, Circle, Layers } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PROPERTY_CLASSES, getTorque, getClampLoad } from '@/data/screws';

export function ScrewDetail() {
  const { screwDetail, closeScrewDetail } = useApp();
  const [selectedClass, setSelectedClass] = useState('');

  if (!screwDetail) return null;

  const screw = screwDetail;
  const activeClass = selectedClass || screw.classes[0] || '';
  const classData = PROPERTY_CLASSES[activeClass];
  const torque = getTorque(screw, activeClass);
  const clampLoad = getClampLoad(screw, activeClass);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={closeScrewDetail} />

      <div className="relative flex max-h-[88vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-2xl animate-slide-in-bottom sm:rounded-2xl">
        <div className="flex justify-center pt-2">
          <div className="h-1 w-10 rounded-full bg-steel-200" />
        </div>

        <div className="bg-gradient-to-br from-slate-600 to-slate-800 mt-2 rounded-t-lg px-5 py-4 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="mt-0.5 truncate text-lg font-bold">{screw.label}</h2>
                <p className="text-xs text-white/80">
                  {screw.system === 'metric' ? 'ISO Metric Thread' : 'UNC Unified Thread'}
                </p>
              </div>
            </div>
            <button
              onClick={closeScrewDetail}
              className="flex-shrink-0 rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <p className="text-[10px] text-white/60">Pitch</p>
              <p className="mt-0.5 truncate text-xs font-semibold">{screw.pitch}</p>
            </div>
            <div className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <p className="text-[10px] text-white/60">Clearance Hole</p>
              <p className="mt-0.5 truncate text-xs font-semibold">{screw.clearanceHoleMm} mm</p>
            </div>
            <div className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <p className="text-[10px] text-white/60">Tap Drill</p>
              <p className="mt-0.5 truncate text-xs font-semibold">{screw.tapDrillMm} mm</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Static Properties */}
          <div className="mb-5">
            <div className="mb-2 flex items-center gap-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">
                Thread Geometry
              </h4>
              <div className="h-px flex-1 bg-steel-100" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <PropCard icon={Ruler} label="Pitch" value={screw.pitch} />
              <PropCard icon={Circle} label="Minor Diameter" value={`${screw.minorDiameterMm.toFixed(2)} mm`} />
              <PropCard icon={Layers} label="Tensile Stress Area" value={`${screw.tensileStressAreaMm2.toFixed(1)} mm²`} />
              <PropCard icon={Ruler} label="Clearance Hole" value={`${screw.clearanceHoleMm} mm`} />
              <PropCard icon={Ruler} label="Tap Drill" value={`${screw.tapDrillMm} mm`} />
              <PropCard icon={Gauge} label="System" value={screw.system === 'metric' ? 'ISO Metric' : 'UNC Inch'} />
            </div>
          </div>

          {/* Property Class Selector */}
          <div className="mb-5">
            <div className="mb-2 flex items-center gap-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">
                Property Class
              </h4>
              <div className="h-px flex-1 bg-steel-100" />
            </div>
            <div className="flex flex-wrap gap-2">
              {screw.classes.map((cls) => {
                const isActive = activeClass === cls;
                const data = PROPERTY_CLASSES[cls];
                return (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-slate-700 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {data?.label || cls}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Outputs */}
          <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">Calculated Values</h4>
            <div className="h-px flex-1 bg-steel-100" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-gradient-to-br from-slate-50 to-slate-100/50 p-4">
              <div className="flex items-center gap-2 text-slate-600">
                <Calculator className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Tightening Torque</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-700">
                {torque > 0 ? torque.toFixed(1) : '—'}
                <span className="ml-1 text-sm font-normal text-slate-400">Nm</span>
              </p>
              {classData && torque > 0 && (
                <p className="mt-1 text-xs text-slate-500">
                  75% of yield · μ = 0.2
                </p>
              )}
            </div>
            <div className="rounded-lg bg-gradient-to-br from-slate-50 to-slate-100/50 p-4">
              <div className="flex items-center gap-2 text-slate-600">
                <Gauge className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Clamp Load</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-700">
                {clampLoad > 0 ? clampLoad.toFixed(1) : '—'}
                <span className="ml-1 text-sm font-normal text-slate-400">kN</span>
              </p>
              {classData && clampLoad > 0 && (
                <p className="mt-1 text-xs text-slate-500">
                  Preload at 75% of yield
                </p>
              )}
            </div>
          </div>

          <p className="mt-3 font-mono text-[10px] text-slate-400">
            Torque = F × d × 0.2 · Clamp = 0.75 × σ_y × A_s
          </p>
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
