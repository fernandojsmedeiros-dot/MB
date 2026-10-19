import { useMemo, useState, useEffect } from 'react';
import { Search, FileX, Ruler, Star } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getMaterialsByCategory, getCategoryConfigsByModule, getCategoryConfig, groupTubulars } from '@/data/materials';
import { MaterialRow } from '@/components/materials/MaterialRow';
import { SheetMetalRow } from '@/components/materials/SheetMetalRow';
import { IndustrialPipingRow } from '@/components/materials/IndustrialPipingRow';
import { StructuralTubeRow } from '@/components/materials/StructuralTubeRow';
import { MechanicalTubeRow } from '@/components/materials/MechanicalTubeRow';
import { BeamChannelRow } from '@/components/materials/BeamChannelRow';
import { WideFlangeRow } from '@/components/materials/WideFlangeRow';
import { RebarRow } from '@/components/materials/RebarRow';
import { TubularGroupRow } from '@/components/materials/TubularGroupRow';
import { ScrewList } from '@/components/materials/ScrewRow';
import { TensileShearView } from '@/components/materials/TensileShearView';
import { TighteningToolsView } from '@/components/materials/TighteningToolsView';
import { SurfaceTreatmentRow } from '@/components/materials/SurfaceTreatmentRow';
import { SCREW_SIZES } from '@/data/screws';
import { categoryIconMap, categoryTabColors } from '@/config/categoryStyles';
import type { MaterialCategory, ModuleId, MaterialRecord, TubularGroup } from '@/types';

const STANDARD_FILTERS = ['All', 'SAE/AISI', 'DIN/EN', 'JIS', 'ISO', 'ASTM', 'GB', 'AFNOR'] as const;

const STANDARD_COLUMN_PREFIXES: Record<string, string[]> = {
  'SAE/AISI': ['SAE/AISI'],
  'DIN/EN': ['DIN/EN'],
  'JIS': ['JIS'],
  'ISO': ['ISO'],
  'ASTM': ['ASTM'],
  'GB': ['GB'],
  'AFNOR': ['AFNOR'],
};

const TUBULAR_CATEGORIES: MaterialCategory[] = [
  'circular-tubes',
  'square-tubes',
  'rectangular-tubes',
];;

// Priority thicknesses for the Blank Calculation "Common Thicknesses" group.
// Each entry is [target_mm, tolerance_mm].
const COMMON_THICKNESSES: [number, number][] = [
  [0.8, 0.05],
  [1.0, 0.05],
  [1.2, 0.1],
  [1.5, 0.1],
  [2.0, 0.05],
  [2.6, 0.1],
  [3.0, 0.05],
  [3.75, 0.1],
  [4.0, 0.1],
  [4.75, 0.15],
  [6.35, 0.1],
  [7.94, 0.1],
  [9.52, 0.1],
  [15.87, 0.15],
  [19.05, 0.15],
  [25.4, 0.15],
];

function getThicknessMm(material: MaterialRecord): number {
  const raw = material.data['Espessura_mm'];
  if (!raw || raw === '-') return -1;
  const num = parseFloat(raw.replace(',', '.'));
  return isNaN(num) ? -1 : num;
}

function isCommonThickness(thickness: number): boolean {
  if (thickness < 0) return false;
  return COMMON_THICKNESSES.some(([target, tol]) => Math.abs(thickness - target) <= tol);
}

function sortByThickness(a: MaterialRecord, b: MaterialRecord): number {
  return getThicknessMm(a) - getThicknessMm(b);
}

function findStandardColumn(data: Record<string, string>, prefixes: string[]): string | null {
  const keys = Object.keys(data);
  for (const prefix of prefixes) {
    const col = keys.find((k) => k.toUpperCase().startsWith(prefix.toUpperCase()));
    if (col) return col;
  }
  return null;
}

function hasValidStandardValue(material: MaterialRecord, filter: string): boolean {
  // Polymers no longer have a standard column to filter on
  if (material.category === 'plastics') {
    return true;
  }
  const prefixes = STANDARD_COLUMN_PREFIXES[filter];
  if (!prefixes) return true;
  const col = findStandardColumn(material.data, prefixes);
  if (!col) return false;
  const val = material.data[col];
  return !!val && val.trim() !== '' && val.trim() !== '-';
}

interface CatalogPageProps {
  module: ModuleId;
}

export function CatalogPage({ module }: CatalogPageProps) {
  const { activeCategory, setActiveCategory, activeStandard, setActiveStandard } = useApp();
  const [localSearch, setLocalSearch] = useState('');
  const [numericFilterValue, setNumericFilterValue] = useState('');
  const [processFilter, setProcessFilter] = useState('All');

  const configs = useMemo(() => getCategoryConfigsByModule(module), [module]);
  const moduleCategories = configs.map((c) => c.id) as MaterialCategory[];

  useEffect(() => {
    if (!moduleCategories.includes(activeCategory)) {
      setActiveCategory(moduleCategories[0]);
    }
  }, [moduleCategories, activeCategory, setActiveCategory]);

  useEffect(() => {
    setLocalSearch('');
    setNumericFilterValue('');
    setProcessFilter('All');
    setActiveStandard('All');
  }, [activeCategory, setActiveStandard]);

  const activeConfig = getCategoryConfig(activeCategory);
  const allMaterials = useMemo(() => getMaterialsByCategory(activeCategory), [activeCategory]);

  const tabCounts = useMemo(() => {
    const counts: Partial<Record<MaterialCategory, number>> = {};
    moduleCategories.forEach((cat) => {
      if (cat === 'torque-preload') {
        counts[cat] = SCREW_SIZES.length;
      } else if (cat === 'tensile-shear') {
        counts[cat] = SCREW_SIZES.length;
      } else {
        counts[cat] = getMaterialsByCategory(cat).length;
      }
    });
    return counts;
  }, [moduleCategories]);

  const isMaterialsModule = module === 'materials';
  const showStandardBar = isMaterialsModule && activeConfig.module === 'materials';
  const isPolymersCategory = activeCategory === 'plastics';
  const isSheetMetalCategory = activeCategory === 'sheet-metals';
  const isPipingCategory = activeCategory === 'industrial-piping';
  const isStructuralCategory = activeCategory === 'structural-tubes';
  const isMechanicalTubeCategory = activeCategory === 'mechanical-tubes';
  const isBeamChannelCategory = activeCategory === 'beams-channels';
  const isWideFlangeCategory = activeCategory === 'wide-flange-h-columns';
  const isRebarCategory = activeCategory === 'rebars';
  const isScrewCategory = activeCategory === 'torque-preload';
  const isTensileShearCategory = activeCategory === 'tensile-shear';
  const isToolsCategory = activeCategory === 'tools';
  const isSurfaceTreatmentCategory = activeCategory === 'surface-treatments';
  const isTubularCategory = TUBULAR_CATEGORIES.includes(activeCategory);

  const effectiveSearch = localSearch.toLowerCase();
  const filteredMaterials = useMemo(() => {
    let result: MaterialRecord[] = allMaterials;

    if (effectiveSearch) {
      result = result.filter((m) =>
        Object.values(m.data).some((v) => v.toLowerCase().includes(effectiveSearch))
      );
    }

    if (showStandardBar && activeStandard !== 'All') {
      result = result.filter((m) => hasValidStandardValue(m, activeStandard));
    }

    if (activeConfig.numericFilter && numericFilterValue.trim()) {
      const target = parseFloat(numericFilterValue.trim());
      if (!isNaN(target)) {
        const filterCol = activeConfig.numericFilter.column;
        result = result.filter((m) => {
          const raw = m.data[filterCol];
          if (!raw || raw === '-') return false;
          const num = parseFloat(raw.replace(',', '.'));
          if (isNaN(num)) return false;
          return Math.abs(num - target) <= 0.5;
        });
      }
    }

    // Process filter for polymers
    if (isPolymersCategory && processFilter !== 'All') {
      result = result.filter((m) => {
        const proc = m.data['main_process'] || '';
        return proc.toLowerCase().includes(processFilter.toLowerCase());
      });
    }

    return result;
  }, [allMaterials, effectiveSearch, activeConfig, numericFilterValue, showStandardBar, activeStandard, isPolymersCategory, processFilter]);

  const ActiveIcon = categoryIconMap[activeCategory];

  const filteredTubularGroups = useMemo<TubularGroup[]>(() => {
    if (!isTubularCategory) return [];
    return groupTubulars(filteredMaterials);
  }, [filteredMaterials, isTubularCategory]);

  const resultCount = isTubularCategory ? filteredTubularGroups.length : isTensileShearCategory ? SCREW_SIZES.length : isScrewCategory ? (localSearch ? SCREW_SIZES.filter(s => s.label.toLowerCase().includes(localSearch.toLowerCase())).length : SCREW_SIZES.length) : isToolsCategory ? allMaterials.length : filteredMaterials.length;

  // Split sheet-metals into Common and Special thickness groups
  const sheetMetalGroups = useMemo(() => {
    if (!isSheetMetalCategory) return { common: [], special: [] };
    const common: MaterialRecord[] = [];
    const special: MaterialRecord[] = [];
    for (const m of filteredMaterials) {
      const t = getThicknessMm(m);
      if (isCommonThickness(t)) common.push(m);
      else special.push(m);
    }
    common.sort(sortByThickness);
    special.sort(sortByThickness);
    return { common, special };
  }, [filteredMaterials, isSheetMetalCategory]);

  const renderMaterialRow = (material: MaterialRecord) =>
    isSheetMetalCategory ? (
      <SheetMetalRow key={material.id} material={material} />
    ) : isPipingCategory ? (
      <IndustrialPipingRow key={material.id} material={material} />
    ) : isStructuralCategory ? (
      <StructuralTubeRow key={material.id} material={material} />
    ) : isMechanicalTubeCategory ? (
      <MechanicalTubeRow key={material.id} material={material} />
    ) : isBeamChannelCategory ? (
      <BeamChannelRow key={material.id} material={material} />
    ) : isWideFlangeCategory ? (
      <WideFlangeRow key={material.id} material={material} />
    ) : isRebarCategory ? (
      <RebarRow key={material.id} material={material} />
    ) : isSurfaceTreatmentCategory ? (
      <SurfaceTreatmentRow key={material.id} material={material} />
    ) : (
      <MaterialRow key={material.id} material={material} />
    );

  return (
    <div className="flex flex-col">
      {/* Category Tabs - horizontally scrollable */}
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
        {configs.map((config) => {
          const Icon = categoryIconMap[config.id];
          const colors = categoryTabColors[config.id];
          const isActive = activeCategory === config.id;
          const count = tabCounts[config.id] ?? 0;

          return (
            <button
              key={config.id}
              onClick={() => setActiveCategory(config.id)}
              className={`flex flex-shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                isActive ? colors.active : colors.inactive
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {config.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  isActive ? 'bg-white/20' : colors.icon
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tensile & Shear and Tightening Tools: full custom views */}
      {isTensileShearCategory ? (
        <TensileShearView />
      ) : isToolsCategory ? (
        <TighteningToolsView />
      ) : (
      <>
      {/* Standards Filter Bar - only for Module 1 materials */}
      {showStandardBar && (
        <div className="flex flex-wrap gap-1.5 border-b border-steel-100 pb-2 pt-1">
          {STANDARD_FILTERS.map((std) => {
            const isActive = activeStandard === std;
            return (
              <button
                key={std}
                onClick={() => setActiveStandard(std)}
                className={`rounded-full px-3 py-1 text-[11px] font-medium transition-all ${
                  isActive
                    ? 'bg-steel-800 text-white'
                    : 'bg-steel-100 text-steel-500 hover:bg-steel-200'
                }`}
              >
                {std}
              </button>
            );
          })}
        </div>
      )}

      {/* Search Bar + Optional Numeric Filter + Process Filter */}
      <div className="flex items-center gap-2 py-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder={`Search ${activeConfig.label}...`}
            className="w-full rounded-lg border border-steel-200 bg-white py-2 pl-9 pr-3 text-sm text-steel-900 placeholder-steel-400 transition-colors focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-100"
          />
        </div>

        {isPolymersCategory && (
          <select
            value={processFilter}
            onChange={(e) => setProcessFilter(e.target.value)}
            className="flex-shrink-0 rounded-lg border border-steel-200 bg-white py-2 px-3 text-sm text-steel-700 transition-colors focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-100"
          >
            <option value="All">All Processes</option>
            <option value="Injection">Injection</option>
            <option value="Extrusion">Extrusion</option>
            <option value="Blow">Blow Molding</option>
            <option value="Thermoforming">Thermoforming</option>
          </select>
        )}

        {activeConfig.numericFilter && (
          <div className="relative w-32 flex-shrink-0">
            <Ruler className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-steel-400" />
            <input
              type="number"
              step="0.01"
              value={numericFilterValue}
              onChange={(e) => setNumericFilterValue(e.target.value)}
              placeholder={activeConfig.numericFilter.unit}
              className="w-full rounded-lg border border-steel-200 bg-white py-2 pl-8 pr-2 text-sm text-steel-900 placeholder-steel-400 transition-colors focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-100"
            />
          </div>
        )}
      </div>

      {/* Result count */}
      <div className="flex items-center gap-1.5 pb-2 text-xs text-steel-400">
        <ActiveIcon className="h-3 w-3" />
        <span>{resultCount} results</span>
        {activeStandard !== 'All' && showStandardBar && (
          <span className="text-steel-500">· filtered: {activeStandard}</span>
        )}
      </div>

      {/* Compact List */}
      {isTubularCategory ? (
        filteredTubularGroups.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-steel-100 bg-white">
            {filteredTubularGroups.map((group) => (
              <TubularGroupRow key={group.key} group={group} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-steel-100">
              <FileX className="h-7 w-7 text-steel-400" />
            </div>
            <h3 className="mt-3 text-base font-semibold text-steel-700">No tubes found</h3>
            <p className="mt-1 text-xs text-steel-500">Try a different search or clear the filter.</p>
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="mt-3 rounded-lg bg-steel-100 px-3 py-1.5 text-xs font-medium text-steel-700 transition-colors hover:bg-steel-200"
              >
                Clear filters
              </button>
            )}
          </div>
        )
      ) : isScrewCategory ? (
        <ScrewList filter={localSearch} />
      ) : filteredMaterials.length > 0 ? (
        isSheetMetalCategory ? (
          <div className="space-y-3">
            {/* Common Thicknesses */}
            <div className="overflow-hidden rounded-lg border border-steel-100 bg-white">
              {sheetMetalGroups.common.map((material) => (
                <SheetMetalRow key={material.id} material={material} />
              ))}
            </div>

            {/* Special Thicknesses divider */}
            {sheetMetalGroups.special.length > 0 && (
              <>
                <div className="flex items-center gap-3 py-1">
                  <div className="h-px flex-1 bg-steel-200" />
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-steel-400">
                    <Star className="h-3 w-3" />
                    Special Thicknesses
                  </div>
                  <div className="h-px flex-1 bg-steel-200" />
                </div>
                <div className="overflow-hidden rounded-lg border border-steel-100 bg-white">
                  {sheetMetalGroups.special.map((material) => (
                    <SheetMetalRow key={material.id} material={material} />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : isPipingCategory ? (
          <div className="overflow-hidden rounded-lg border border-steel-100 bg-white">
            {filteredMaterials.map((material) => (
              <IndustrialPipingRow key={material.id} material={material} />
            ))}
          </div>
        ) : isStructuralCategory ? (
          <div className="overflow-hidden rounded-lg border border-steel-100 bg-white">
            {filteredMaterials.map((material) => (
              <StructuralTubeRow key={material.id} material={material} />
            ))}
          </div>
        ) : isMechanicalTubeCategory ? (
          <div className="overflow-hidden rounded-lg border border-steel-100 bg-white">
            {filteredMaterials.map((material) => (
              <MechanicalTubeRow key={material.id} material={material} />
            ))}
          </div>
        ) : isBeamChannelCategory ? (
          <div className="overflow-hidden rounded-lg border border-steel-100 bg-white">
            {filteredMaterials.map((material) => (
              <BeamChannelRow key={material.id} material={material} />
            ))}
          </div>
        ) : isWideFlangeCategory ? (
          <div className="overflow-hidden rounded-lg border border-steel-100 bg-white">
            {filteredMaterials.map((material) => (
              <WideFlangeRow key={material.id} material={material} />
            ))}
          </div>
        ) : isRebarCategory ? (
          <div className="overflow-hidden rounded-lg border border-steel-100 bg-white">
            {filteredMaterials.map((material) => (
              <RebarRow key={material.id} material={material} />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-steel-100 bg-white">
            {filteredMaterials.map((material) => (
              <MaterialRow key={material.id} material={material} />
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-steel-100">
            <FileX className="h-7 w-7 text-steel-400" />
          </div>
          <h3 className="mt-3 text-base font-semibold text-steel-700">No materials found</h3>
          <p className="mt-1 text-xs text-steel-500">Try a different search or clear the filter.</p>
          {(localSearch || numericFilterValue || activeStandard !== 'All' || (isPolymersCategory && processFilter !== 'All')) && (
            <button
              onClick={() => {
                setLocalSearch('');
                setNumericFilterValue('');
                setProcessFilter('All');
                setActiveStandard('All');
              }}
              className="mt-3 rounded-lg bg-steel-100 px-3 py-1.5 text-xs font-medium text-steel-700 transition-colors hover:bg-steel-200"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
      </>
      )}
    </div>
  );
}
