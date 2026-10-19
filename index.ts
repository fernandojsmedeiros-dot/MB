export type MaterialCategory =
  | 'steels'
  | 'aluminum'
  | 'plastics'
  | 'circular-tubes'
  | 'square-tubes'
  | 'rectangular-tubes'
  | 'structural-tubes'
  | 'industrial-piping'
  | 'mechanical-tubes'
  | 'sheet-metals'
  | 'beams-channels'
  | 'wide-flange-h-columns'
  | 'rebars'
  | 'torque-preload'
  | 'tensile-shear'
  | 'tools'
  | 'surface-treatments'
  | 'standard-tolerances'
  | 'gdnt';

export type ModuleId = 'materials' | 'mechanical-standards' | 'standardized' | 'fasteners' | 'surface-treatment' | 'gdnt';

export interface MaterialRecord {
  id: string;
  category: MaterialCategory;
  module: ModuleId;
  data: Record<string, string>;
  /** Display name derived from the most recognizable standard column */
  commercialName: string;
  /** Primary standard (SAE/AISI or equivalent) */
  primaryStandard: string;
  /** Secondary standard (DIN/EN or equivalent) */
  secondaryStandard: string;
}

/** A group of tubular records sharing the same shape + external dimension */
export interface TubularGroup {
  /** Composite key: `${shape}__${externalDimension}` */
  key: string;
  /** Profile shape, e.g. "Redondo", "Quadrado", "Retangular" */
  shape: string;
  /** External dimension label, e.g. "1/4" (6.35 mm)" */
  externalDimension: string;
  /** All material records in this group (one per wall thickness) */
  items: MaterialRecord[];
}

export interface NumericFilterConfig {
  /** Column key to filter on */
  column: string;
  /** Human-readable label for the filter input */
  label: string;
  /** Unit suffix shown in the placeholder (e.g. "mm") */
  unit: string;
}

export interface CategoryConfig {
  id: MaterialCategory;
  module: ModuleId;
  label: string;
  description: string;
  csvFile: string;
  icon: string;
  accentColor: string;
  /** Columns to show prominently on the card front */
  cardColumns: string[];
  /** Columns that are the "main standards" shown on card front */
  standardColumns: string[];
  /** The column used as the commercial name */
  nameColumn: string;
  /** Optional numeric filter for dimension-based search */
  numericFilter?: NumericFilterConfig;
}

export type NavSection =
  | 'home'
  | 'materials'
  | 'mechanical-standards'
  | 'standardized'
  | 'fasteners'
  | 'surface-treatment'
  | 'gdt-guide';

export interface NavItem {
  id: NavSection;
  label: string;
  icon: string;
  description: string;
}
