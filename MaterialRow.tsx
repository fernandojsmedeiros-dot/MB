import { Check, ChevronRight, GitCompare } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getCategoryConfig } from '@/data/materials';
import { getPolymerDisplayName } from '@/utils/polymerNames';
import { translateColumnLabel } from '@/utils/columnLabels';
import type { MaterialRecord } from '@/types';

const STANDARD_COLUMN_PREFIXES: Record<string, string[]> = {
  'SAE/AISI': ['SAE/AISI'],
  'DIN/EN': ['DIN/EN'],
  'JIS': ['JIS'],
  'ISO': ['ISO'],
  'ASTM': ['ASTM'],
  'GB': ['GB'],
  'AFNOR': ['AFNOR'],
};

// Preferred cross-reference order when a specific standard is active.
const CROSS_REF_ORDER = ['SAE/AISI', 'DIN/EN', 'JIS', 'ISO', 'ASTM', 'GB', 'AFNOR'];

function findStandardColumn(data: Record<string, string>, filter: string): string | null {
  const prefixes = STANDARD_COLUMN_PREFIXES[filter];
  if (!prefixes) return null;
  const keys = Object.keys(data);
  for (const prefix of prefixes) {
    const col = keys.find((k) => k.toUpperCase().startsWith(prefix.toUpperCase()));
    if (col) return col;
  }
  return null;
}

function shortLabel(colName: string): string {
  return colName.split('(')[0].trim();
}

function getStandardValue(data: Record<string, string>, filter: string): { label: string; value: string } | null {
  const col = findStandardColumn(data, filter);
  if (!col) return null;
  const val = data[col] || '-';
  if (val.trim() === '' || val.trim() === '-') return null;
  return { label: shortLabel(col), value: val };
}

interface MaterialRowProps {
  material: MaterialRecord;
}

export function MaterialRow({ material }: MaterialRowProps) {
  const { selectedForCompare, toggleCompareSelection, openDetail, openSimilares, activeStandard } = useApp();
  const config = getCategoryConfig(material.category);
  const isSelected = selectedForCompare.includes(material.id);
  const canSelectMore = selectedForCompare.length < 3;

  const isMaterialsCategory = config.module === 'materials';
  const hasActiveStandard = isMaterialsCategory && activeStandard !== 'All';

  // Determine main title and cross-reference sub-label
  let mainTitle: string;
  let crossRefLabel: string | null = null;
  let crossRefValue: string | null = null;

  const isPolymers = material.category === 'plastics';

  if (isPolymers) {
    mainTitle = getPolymerDisplayName(material.data);

    const processo = material.data['main_process'] || '';
    if (processo && processo !== '-') {
      crossRefLabel = 'Process';
      crossRefValue = processo;
    }
  } else if (isMaterialsCategory) {
    if (hasActiveStandard) {
      // Active standard drives the main title
      const active = getStandardValue(material.data, activeStandard);
      mainTitle = active ? active.value : '-';

      // Cross-reference: pick the first available standard that isn't the active one
      for (const std of CROSS_REF_ORDER) {
        if (std === activeStandard) continue;
        const ref = getStandardValue(material.data, std);
        if (ref) {
          crossRefLabel = ref.label;
          crossRefValue = ref.value;
          break;
        }
      }
    } else {
      // 'All' tab: use SAE/AISI as default with explicit prefix
      const defaultStd = getStandardValue(material.data, 'SAE/AISI');
      if (defaultStd) {
        mainTitle = `${defaultStd.label}: ${defaultStd.value}`;
      } else {
        mainTitle = material.commercialName;
      }
      // Cross-reference: DIN/EN
      const ref = getStandardValue(material.data, 'DIN/EN');
      if (ref) {
        crossRefLabel = ref.label;
        crossRefValue = ref.value;
      }
    }
  } else {
    // Non-materials modules: use commercial name as title, standard columns as sub-labels
    mainTitle = material.commercialName;
    const secCol = config.standardColumns[1];
    const secVal = material.data[secCol] || '-';
    if (secVal !== '-') {
      crossRefLabel = shortLabel(translateColumnLabel(secCol));
      crossRefValue = secVal;
    }
  }

  return (
    <div
      onClick={() => openDetail(material)}
      className={`group flex items-center gap-3 border-b border-steel-100 px-4 py-3 transition-colors cursor-pointer active:bg-steel-50 ${
        isSelected ? 'bg-primary-50/60' : 'hover:bg-steel-50'
      }`}
    >
      {/* Compare checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (canSelectMore || isSelected) toggleCompareSelection(material.id);
        }}
        disabled={!canSelectMore && !isSelected}
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition-all ${
          isSelected
            ? 'border-primary-500 bg-primary-500 text-white'
            : 'border-steel-300 bg-white'
        } ${!canSelectMore && !isSelected ? 'opacity-40' : ''}`}
        aria-label="Toggle compare"
      >
        {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
      </button>

      {/* Main content: dynamic title + cross-reference */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-steel-900" title={mainTitle}>
          {mainTitle}
        </p>
        {crossRefLabel && crossRefValue && (
          <div className="mt-0.5 flex items-center gap-2 text-xs text-steel-500">
            <span className="truncate" title={crossRefValue}>
              Eqv: <span className="font-medium text-steel-600">{crossRefLabel} {crossRefValue}</span>
            </span>
          </div>
        )}
      </div>

      {/* Similares button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          openSimilares(material);
        }}
        className="flex flex-shrink-0 items-center gap-1 rounded-full border border-steel-200 px-2 py-1 text-[11px] font-medium text-steel-500 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600"
      >
        <GitCompare className="h-3 w-3" />
        <span className="hidden xs:inline sm:inline">Similar</span>
      </button>

      {/* Arrow to open detail */}
      <ChevronRight className="h-4 w-4 flex-shrink-0 text-steel-300 transition-colors group-hover:text-steel-500" />
    </div>
  );
}
