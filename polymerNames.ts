const POLYMER_CHEMICAL_NAMES: Record<string, string> = {
  'ABS': 'Acrylonitrile Butadiene Styrene',
  'PP': 'Polypropylene',
  'PE-HD': 'High-Density Polyethylene',
  'PE-LD': 'Low-Density Polyethylene',
  'PC': 'Polycarbonate',
  'POM': 'Polyacetal',
  'PA6': 'Polyamide 6',
  'PA66': 'Polyamide 66',
  'PVC-U': 'Unplasticized Polyvinyl Chloride',
  'PS': 'Polystyrene',
  'PET': 'Polyethylene Terephthalate',
  'PP GF20': '20% Short Glass Fiber',
  'PP LGF20': '20% Long Glass Fiber',
  'PA66 GF20': '20% Short Glass Fiber',
  'PA66 LGF20': '20% Long Glass Fiber',
};

export function getDidacticName(materialKey: string): string {
  const chemicalName = POLYMER_CHEMICAL_NAMES[materialKey];
  if (chemicalName) {
    return `${materialKey} (${chemicalName})`;
  }
  return materialKey;
}

export function getPolymerDisplayName(data: Record<string, string>): string {
  const materialName = data['material'] || '';
  return getDidacticName(materialName);
}
