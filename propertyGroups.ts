export interface PropertyGroup {
  label: string;
  entries: [string, string][];
}

const GROUP_RULES: { label: string; keywords: string[] }[] = [
  {
    label: 'Mechanical Properties',
    keywords: ['escoamento', 'ruptura', 'alongamento', 'dureza', 'módulo', 'modulo', 'resistência', 'resistencia', 'estricção', 'estriccao', 'poisson', 'fadiga', 'tenacidade', 'fluência', 'fluencia', 'creep', 'curvas', 'temperabilidade', 'tensile', 'elastic', 'modulus', 'izod', 'impact', 'hdt', 'viscoelastic'],
  },
  {
    label: 'Physical Properties',
    keywords: ['densidade', 'condutividade', 'térmico', 'termica', 'termico', 'calor', 'expansão', 'expansao', 'temperaturas', 'críticas', 'criticas', 'density'],
  },
  {
    label: 'Chemical Properties',
    keywords: ['composição', 'composicao', 'carbono', 'química', 'quimica'],
  },
  {
    label: 'General Info & Applications',
    keywords: ['aplicação', 'aplicacao', 'características', 'caracteristicas', 'uso', 'soldabilidade', 'usinabilidade', 'process', 'molding', 'shrinkage', 'cost'],
  },
];

function matchGroup(key: string): number {
  const lower = key.toLowerCase();
  for (let i = 0; i < GROUP_RULES.length; i++) {
    if (GROUP_RULES[i].keywords.some((kw) => lower.includes(kw))) return i;
  }
  return -1;
}

export function groupProperties(entries: [string, string][]): PropertyGroup[] {
  const groups: PropertyGroup[] = GROUP_RULES.map((rule) => ({
    label: rule.label,
    entries: [],
  }));
  const ungrouped: [string, string][] = [];

  for (const entry of entries) {
    const idx = matchGroup(entry[0]);
    if (idx >= 0) {
      groups[idx].entries.push(entry);
    } else {
      ungrouped.push(entry);
    }
  }

  const result = groups.filter((g) => g.entries.length > 0);
  if (ungrouped.length > 0) {
    result.push({ label: 'Other', entries: ungrouped });
  }
  return result;
}
