import { useState, useEffect } from 'react';
import { X, Circle, Square, RectangleHorizontal, Layers, Ruler, Weight, Gauge } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { categoryIconMap, categoryAccentGradients } from '@/config/categoryStyles';
import type { MaterialCategory, MaterialRecord } from '@/types';

const SHAPE_ICONS: Record<string, typeof Circle> = {
  Redondo: Circle,
  Quadrado: Square,
  Retangular: RectangleHorizontal,
};

const SHAPE_LABELS: Record<string, string> = {
  Redondo: 'Circular / Round',
  Quadrado: 'Square',
  Retangular: 'Rectangular',
};

// New schema columns
const THICKNESS_COL = 'Espessura_mm';
const WEIGHT_COL = 'Massa_Linear_kg_m';
const AREA_COL = 'Area_cm2';
const NORMA_COL = 'Norma';
const MATERIAL_COL = 'Material_Base';

// Round tube specific
const ROUND_INT_COL = 'Diametro_Int_mm';
const ROUND_EXT_COL = 'Diametro_Ext_mm';
const IX_COL = 'Inercia_Ix_cm4';
const WX_COL = 'Modulo_Wx_cm3';
const J_COL = 'Inercia_Polar_J_cm4';
const WT_COL = 'Modulo_Torcao_Wt_cm3';

// Square/Rectangular specific
const EXT_A_COL = 'Dimensao_Ext_A_mm';
const EXT_B_COL = 'Dimensao_Ext_B_mm';
const INT_A_COL = 'Dimensao_Int_A_mm';
const INT_B_COL = 'Dimensao_Int_B_mm';
const IY_COL = 'Inercia_Iy_cm4';
const WY_COL = 'Modulo_Wy_cm3';

interface MechProp {
  label: string;
  value: string;
  unit: string;
}

export function TubularGroupDetail() {
  const { tubularGroupDetail, closeTubularGroup } = useApp();
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    setSelectedIdx(0);
  }, [tubularGroupDetail]);

  if (!tubularGroupDetail) return null;

  const group = tubularGroupDetail;
  const tubeCategory: MaterialCategory = group.items[0]?.category || 'circular-tubes';
  const Icon = categoryIconMap[tubeCategory];
  const ShapeIcon = SHAPE_ICONS[group.shape] || Layers;
  const shapeLabel = SHAPE_LABELS[group.shape] || group.shape;

  const isRound = group.shape === 'Redondo';
  const selectedItem: MaterialRecord = group.items[selectedIdx] || group.items[0];
  const data = selectedItem.data;

  const thickness = data[THICKNESS_COL] || '-';
  const weight = data[WEIGHT_COL] || '-';
  const area = data[AREA_COL] || '-';
  const norma = data[NORMA_COL] || '-';
  const material = data[MATERIAL_COL] || '-';

  // Build mechanical properties based on shape
  const mechProps: MechProp[] = isRound
    ? [
        { label: 'Ix (Inertia)', value: data[IX_COL] || '-', unit: 'cm⁴' },
        { label: 'Wx (Section Modulus)', value: data[WX_COL] || '-', unit: 'cm³' },
        { label: 'J (Polar Inertia)', value: data[J_COL] || '-', unit: 'cm⁴' },
        { label: 'Wt (Torsion Modulus)', value: data[WT_COL] || '-', unit: 'cm³' },
      ]
    : [
        { label: 'Ix (Inertia X)', value: data[IX_COL] || '-', unit: 'cm⁴' },
        { label: 'Iy (Inertia Y)', value: data[IY_COL] || '-', unit: 'cm⁴' },
        { label: 'Wx (Section Mod. X)', value: data[WX_COL] || '-', unit: 'cm³' },
        { label: 'Wy (Section Mod. Y)', value: data[WY_COL] || '-', unit: 'cm³' },
      ];

  // Dimension display
  const extDim = isRound
    ? `${data[ROUND_EXT_COL] || '-'} mm OD`
    : `${data[EXT_A_COL] || '-'} × ${data[EXT_B_COL] || '-'} mm`;
  const intDim = isRound
    ? `${data[ROUND_INT_COL] || '-'} mm ID`
    : `${data[INT_A_COL] || '-'} × ${data[INT_B_COL] || '-'} mm ID`;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={closeTubularGroup} />

      <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-2xl animate-slide-in-bottom sm:rounded-2xl">
        {/* Drag handle */}
        <div className="flex justify-center pt-2">
          <div className="h-1 w-10 rounded-full bg-steel-200" />
        </div>

        {/* Header */}
        <div className={`bg-gradient-to-br ${categoryAccentGradients[tubeCategory]} mt-2 rounded-t-lg px-5 py-4 text-white`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="mt-0.5 truncate text-lg font-bold">{group.externalDimension}</h2>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <ShapeIcon className="h-3 w-3" />
                  <span>{shapeLabel}</span>
                  <span className="text-white/50">·</span>
                  <span>{group.items.length} {group.items.length === 1 ? 'thickness' : 'thicknesses'}</span>
                </div>
              </div>
            </div>
            <button
              onClick={closeTubularGroup}
              className="flex-shrink-0 rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick general properties */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <p className="text-[10px] text-white/60">External Dimension</p>
              <p className="mt-0.5 truncate text-xs font-semibold" title={extDim}>{extDim}</p>
            </div>
            <div className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <p className="text-[10px] text-white/60">Standard / Material</p>
              <p className="mt-0.5 truncate text-xs font-semibold" title={`${norma} · ${material}`}>{norma}</p>
            </div>
          </div>
        </div>

        {/* Body: interactive thickness selector + properties */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Thickness pills */}
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-steel-400">
            Select Wall Thickness
          </h3>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {group.items.map((item, idx) => {
              const isActive = idx === selectedIdx;
              const t = item.data[THICKNESS_COL] || '-';
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedIdx(idx)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-steel-100 text-steel-600 hover:bg-cyan-50 hover:text-cyan-700'
                  }`}
                >
                  {t} mm
                </button>
              );
            })}
          </div>

          {/* Selected thickness properties */}
          <div className="space-y-4">
            {/* Physical properties */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">
                  Physical Properties
                </h4>
                <div className="h-px flex-1 bg-steel-100" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <PropCard icon={Ruler} label="Wall Thickness" value={thickness} unit="mm" />
                <PropCard icon={Weight} label="Linear Mass" value={weight} unit="kg/m" />
                <PropCard icon={Gauge} label="Cross-section Area" value={area} unit="cm²" />
                <PropCard icon={Ruler} label="Internal Dimension" value={intDim} unit="" />
              </div>
            </div>

            {/* Mechanical properties */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">
                  Mechanical Properties
                </h4>
                <div className="h-px flex-1 bg-steel-100" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {mechProps.map((prop) => (
                  <PropCard key={prop.label} label={prop.label} value={prop.value} unit={prop.unit} />
                ))}
              </div>
            </div>

            {/* Material info */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">
                  Material Info
                </h4>
                <div className="h-px flex-1 bg-steel-100" />
              </div>
              <dl className="space-y-0 divide-y divide-steel-100">
                <div className="py-2.5">
                  <dt className="text-xs font-semibold text-steel-500">Standard</dt>
                  <dd className="mt-0.5 text-sm font-medium text-steel-900">{norma}</dd>
                </div>
                <div className="py-2.5">
                  <dt className="text-xs font-semibold text-steel-500">Base Material</dt>
                  <dd className="mt-0.5 text-sm font-medium text-steel-900">{material}</dd>
                </div>
              </dl>
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
  icon?: typeof Ruler;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-lg border border-steel-100 bg-steel-50/50 px-3 py-2.5">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="h-3 w-3 text-steel-400" />}
        <p className="text-[10px] font-medium text-steel-500">{label}</p>
      </div>
      <p className="mt-1 text-sm font-bold text-steel-900">
        {value}
        {unit && <span className="ml-1 text-[10px] font-normal text-steel-400">{unit}</span>}
      </p>
    </div>
  );
}
