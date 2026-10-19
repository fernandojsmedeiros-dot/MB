/**
 * Maps Portuguese CSV column headers to English display labels.
 * Used wherever raw column keys are rendered to the user.
 */
const COLUMN_LABELS: Record<string, string> = {
  // --- Steels / Aluminum ---
  'SAE/AISI (EUA)': 'SAE/AISI (USA)',
  'JIS (Japão)': 'JIS (Japan)',
  'ASTM (EUA)': 'ASTM (USA)',
  'Condição / Tratamento Térmico': 'Condition / Heat Treatment',
  'Composição Química Nominal': 'Nominal Chemical Composition',
  'Densidade': 'Density',
  'Condutividade Térmica': 'Thermal Conductivity',
  'Calor Específico': 'Specific Heat',
  'Coeficiente de Expansão': 'Thermal Expansion Coefficient',
  'Temperaturas Críticas': 'Critical Temperatures',
  'Usinabilidade': 'Machinability',
  'Soldabilidade': 'Weldability',
  'Temperabilidade': 'Hardenability',
  'Limite de Escoamento': 'Yield Strength',
  'Limite de Resistência': 'Ultimate Tensile Strength',
  'Alongamento na Ruptura': 'Elongation at Break',
  'Estricção da Seção': 'Reduction of Area',
  'Módulo de Elasticidade': 'Modulus of Elasticity',
  'Módulo de Cisalhamento': 'Shear Modulus',
  'Dureza': 'Hardness',
  'Limite de Fadiga': 'Fatigue Limit',
  'Limite de Fadiga Real': 'Fatigue Limit',
  'Tenacidade à Fratura': 'Fracture Toughness',
  'Dados de Fluência': 'Creep Data',
  'Curvas': 'Curves',
  'Carbono Equivalente': 'Carbon Equivalent',
  'Coeficiente de Poisson': "Poisson's Ratio",
  'Estricção na Seção': 'Reduction of Area',
  'Japão': 'Japan',
  'França': 'France',

  // --- Sheet Metals (shared label) ---
  'Aplicacao_Tipica': 'Typical Application',

  // --- Plastics ---
  'main_process': 'Main Process',
  'density_g_cm3': 'Density (g/cm³)',
  'elastic_modulus_mpa': 'Elastic Modulus (MPa)',
  'tensile_strength_23c_mpa': 'Tensile Strength 23°C (MPa)',
  'tensile_strength_60c_mpa': 'Tensile Strength 60°C (MPa)',
  'tensile_strength_0c_mpa': 'Tensile Strength 0°C (MPa)',
  'izod_impact_j_m': 'Izod Impact (J/m)',
  'hdt_0_45mpa_c': 'HDT 0.45 MPa (°C)',
  'molding_shrinkage_perc': 'Molding Shrinkage (%)',
  'cost_indicator': 'Cost Index',
  'viscoelastic_behavior_creep': 'Viscoelastic Creep Behavior',

  // --- Structural / Industrial / Mechanical Tubes ---
  'Diametro_Externo_mm': 'External Diameter (mm)',
  'Diametro_Ext_mm': 'External Diameter (mm)',
  'Diametro_Interno_mm': 'Internal Diameter (mm)',
  'Diametro_Int_mm': 'Internal Diameter (mm)',
  'Espessura_mm': 'Wall Thickness (mm)',
  'Peso_kg_m': 'Weight (kg/m)',
  'Peso_kg_m2': 'Weight (kg/m²)',
  'Peso_Teorico_kg_m': 'Theoretical Weight (kg/m)',
  'Norma': 'Standard',
  'Norma_Especificacao': 'Standard Specification',
  'Acabamento': 'Finish',
  'Formato': 'Shape',
  'Tipo de Tubo': 'Tube Type',
  'Dimensao_Comercial': 'Commercial Dimension',
  'Designação Comercial': 'Commercial Designation',
  'Dimensão Comercial': 'Commercial Dimension',
  'Dimensão Externa (mm)': 'External Dimension (mm)',

  // --- Sheet Metals ---
  'Bitola_MSG': 'Gauge (MSG)',
  'Bitola_pol': 'Gauge (in)',
  'Bitola_mm': 'Diameter (mm)',
  'Bitola': 'Gauge',
  'Categoria': 'Category',

  // --- Beams / Wide Flange / Rebars ---
  'Medida_Nominal': 'Nominal Size',
  'Tipo': 'Type',
  'Altura_mm': 'Height (mm)',
  'Altura_d_mm': 'Height d (mm)',
  'Largura_mm': 'Width (mm)',
  'Largura_bf_mm': 'Width bf (mm)',
  'Escoamento_MPa': 'Yield Strength (MPa)',
  'Resistencia_MPa': 'Tensile Strength (MPa)',

  // --- Screws / Torque ---
  'Diâmetro Nominal': 'Nominal Diameter',
  'Classe / Grau': 'Class / Grade',
  'Passo / Rosca': 'Thread Pitch',
  'Nom-Aço': 'Nominal — Steel',
  'Nom-Alum': 'Nominal — Aluminum',
  'Carga de Tração (kN)': 'Tensile Load (kN)',
  'Carga de Cisalhamento (kN)': 'Shear Load (kN)',

  // --- Standard Tolerances ---
  'Processo de Fabricação': 'Manufacturing Process',
  'Faixa de Dimensão (Cotas)': 'Dimension Range',
  'Tolerância Típica para Distâncias (Lineares)': 'Typical Linear Tolerance',
  'Tolerância Típica para Diâmetros / Furos': 'Typical Tolerance for Diameters / Holes',

  // --- GD&T ---
  'Controle Geométrico': 'Geometric Control',
  'Modificadores Comuns': 'Common Modifiers',
  'Aplicação Prática Típica': 'Typical Practical Application',

  // --- Surface Treatments (old CSV keys, in case they appear) ---
  'tratamento': 'Treatment',
  'variacoes (nome comercial)': 'Commercial Variations',
  'resistencia em horas ao salt spray': 'Salt Spray Resistance (hours)',
  'tipo de processo': 'Process Type',
  'aplicavel a...': 'Applicable To',
};

/**
 * Convert a Portuguese column key into an English display label.
 * Tries exact, case-insensitive, and prefix (before brackets/parens) matches.
 * Falls back to the stripped key if no mapping exists.
 */
export function translateColumnLabel(key: string): string {
  const mapped = COLUMN_LABELS[key];
  if (mapped) return mapped;

  // Try case-insensitive exact match
  const lower = key.toLowerCase();
  for (const [pt, en] of Object.entries(COLUMN_LABELS)) {
    if (pt.toLowerCase() === lower) return en;
  }

  // Try matching the prefix before ( or [ — handles headers like
  // "Limite de Escoamento (Sy / Re) [MPa]" → "Limite de Escoamento"
  const prefix = key.split(/[([\]]/)[0].trim();
  if (prefix && prefix !== key) {
    const prefixMapped = COLUMN_LABELS[prefix];
    if (prefixMapped) return prefixMapped;
    const prefixLower = prefix.toLowerCase();
    for (const [pt, en] of Object.entries(COLUMN_LABELS)) {
      if (pt.toLowerCase() === prefixLower) return en;
    }
  }

  // Fallback: strip parenthetical/bracket suffix for readability
  return prefix || key;
}
