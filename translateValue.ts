/**
 * Case-insensitive, whitespace-trimming translation of raw CSV cell values
 * (Portuguese) into display English. Used for data fields that are rendered
 * directly to the user — treatment names, base materials, categories, etc.
 * The underlying CSV files are never modified.
 */

const VALUE_MAP: Record<string, string> = {
  // --- General terms / categories ---
  'leve': 'Light',
  'média': 'Medium',
  'pesada': 'Heavy',
  'aço': 'Steel',
  'aco': 'Steel',
  'alumínio': 'Aluminum',
  'aluminio': 'Aluminum',
  'aço / alumínio': 'Steel / Aluminum',
  'aco / aluminio': 'Steel / Aluminum',
  'perfis formados': 'Formed Profiles',
  'viga i': 'I-Beam',
  'viga u': 'U-Beam',
  'base_material': 'Base Material',
  'prerequisites': 'Prerequisites',

  // --- Sheet Metal categories ---
  'fina a frio': 'Cold Rolled',
  'fina a quente': 'Hot Rolled',
  'galvalume': 'Galvalume',
  'zincada (galv.)': 'Galvanized',

  // --- Sheet Metal applications ---
  'ambientes corrosivos': 'Corrosive Environments',
  'autopeças leves': 'Light Auto Parts',
  'autopecas leves': 'Light Auto Parts',
  'calhas e rufos': 'Gutters and Flashings',
  'chassis e bases': 'Chassis and Bases',
  'coberturas e telhas': 'Roofing and Tiles',
  'construção civil': 'Civil Construction',
  'construcao civil': 'Civil Construction',
  'duto de ventilação': 'Ventilation Ducts',
  'duto de ventilacao': 'Ventilation Ducts',
  'estrutura pesada': 'Heavy Structure',
  'estruturas e caldeiraria': 'Structures and Boilermaking',
  'estruturas e perfis': 'Structures and Profiles',
  'estruturas leves': 'Light Structures',
  'painéis e gabinetes': 'Panels and Enclosures',
  'paineis e gabinetes': 'Panels and Enclosures',
  'placas de base': 'Base Plates',
  'placas de base e conexões': 'Base Plates and Connections',
  'placas de base e conexoes': 'Base Plates and Connections',
  'placas grossas e estruturais': 'Thick and Structural Plates',
  'uso geral / estampagem': 'General Use / Stamping',
  'uso geral / estampagem leve': 'General Use / Light Stamping',

};

// Pre-compute lowercased keys for case-insensitive lookup
const LOWER_MAP: Record<string, string> = {};
for (const [pt, en] of Object.entries(VALUE_MAP)) {
  LOWER_MAP[pt.toLowerCase().trim()] = en;
}

/**
 * Translate a raw CSV cell value to English display text.
 * Case-insensitive and whitespace-trimming. Returns the original
 * value unchanged if no mapping exists (so unmapped data still shows).
 */
export function translateValue(value: string): string {
  if (!value) return value;
  const key = value.toLowerCase().trim();
  return LOWER_MAP[key] ?? value;
}


