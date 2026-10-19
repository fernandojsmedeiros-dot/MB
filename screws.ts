export interface ScrewSize {
  id: string;
  label: string;
  system: 'metric' | 'inch';
  pitch: string;
  pitchMm: number;
  minorDiameterMm: number;
  tensileStressAreaMm2: number;
  clearanceHoleMm: string;
  tapDrillMm: string;
  classes: string[];
}

export interface PropertyClassData {
  label: string;
  proofStressMpa: number;
  tensileStrengthMpa: number;
  yieldStrengthMpa: number;
}

export const PROPERTY_CLASSES: Record<string, PropertyClassData> = {
  '8.8': { label: 'Class 8.8', proofStressMpa: 580, tensileStrengthMpa: 800, yieldStrengthMpa: 640 },
  '10.9': { label: 'Class 10.9', proofStressMpa: 830, tensileStrengthMpa: 1040, yieldStrengthMpa: 940 },
  '12.9': { label: 'Class 12.9', proofStressMpa: 970, tensileStrengthMpa: 1220, yieldStrengthMpa: 1100 },
  'Grade 5': { label: 'Grade 5', proofStressMpa: 380, tensileStrengthMpa: 830, yieldStrengthMpa: 640 },
  'Grade 8': { label: 'Grade 8', proofStressMpa: 650, tensileStrengthMpa: 1040, yieldStrengthMpa: 880 },
};

export const SCREW_SIZES: ScrewSize[] = [
  { id: 'M6', label: 'M6', system: 'metric', pitch: '1.0 mm', pitchMm: 1.0, minorDiameterMm: 4.917, tensileStressAreaMm2: 20.1, clearanceHoleMm: '6.6', tapDrillMm: '5.0', classes: ['8.8', '10.9', '12.9'] },
  { id: 'M8', label: 'M8', system: 'metric', pitch: '1.25 mm', pitchMm: 1.25, minorDiameterMm: 6.647, tensileStressAreaMm2: 36.6, clearanceHoleMm: '9.0', tapDrillMm: '6.8', classes: ['8.8', '10.9', '12.9'] },
  { id: 'M8x1', label: 'M8x1', system: 'metric', pitch: '1.0 mm (fine)', pitchMm: 1.0, minorDiameterMm: 6.917, tensileStressAreaMm2: 39.2, clearanceHoleMm: '9.0', tapDrillMm: '7.0', classes: ['8.8', '10.9', '12.9'] },
  { id: 'M10', label: 'M10', system: 'metric', pitch: '1.5 mm', pitchMm: 1.5, minorDiameterMm: 8.376, tensileStressAreaMm2: 58.0, clearanceHoleMm: '11.0', tapDrillMm: '8.5', classes: ['8.8', '10.9', '12.9'] },
  { id: 'M10x1.25', label: 'M10x1.25', system: 'metric', pitch: '1.25 mm (fine)', pitchMm: 1.25, minorDiameterMm: 8.647, tensileStressAreaMm2: 61.2, clearanceHoleMm: '11.0', tapDrillMm: '8.8', classes: ['8.8', '10.9', '12.9'] },
  { id: 'M12', label: 'M12', system: 'metric', pitch: '1.75 mm', pitchMm: 1.75, minorDiameterMm: 10.106, tensileStressAreaMm2: 84.3, clearanceHoleMm: '13.5', tapDrillMm: '10.2', classes: ['8.8', '10.9', '12.9'] },
  { id: 'M12x1.5', label: 'M12x1.5', system: 'metric', pitch: '1.5 mm (fine)', pitchMm: 1.5, minorDiameterMm: 10.376, tensileStressAreaMm2: 88.1, clearanceHoleMm: '13.5', tapDrillMm: '10.5', classes: ['8.8', '10.9', '12.9'] },
  { id: 'M14', label: 'M14', system: 'metric', pitch: '2.0 mm', pitchMm: 2.0, minorDiameterMm: 11.835, tensileStressAreaMm2: 115, clearanceHoleMm: '15.5', tapDrillMm: '12.0', classes: ['8.8', '10.9', '12.9'] },
  { id: 'M14x1.5', label: 'M14x1.5', system: 'metric', pitch: '1.5 mm (fine)', pitchMm: 1.5, minorDiameterMm: 12.376, tensileStressAreaMm2: 125, clearanceHoleMm: '15.5', tapDrillMm: '12.5', classes: ['8.8', '10.9', '12.9'] },
  { id: 'M16', label: 'M16', system: 'metric', pitch: '2.0 mm', pitchMm: 2.0, minorDiameterMm: 13.835, tensileStressAreaMm2: 157, clearanceHoleMm: '17.5', tapDrillMm: '14.0', classes: ['8.8', '10.9', '12.9'] },
  { id: 'M16x1.5', label: 'M16x1.5', system: 'metric', pitch: '1.5 mm (fine)', pitchMm: 1.5, minorDiameterMm: 14.376, tensileStressAreaMm2: 167, clearanceHoleMm: '17.5', tapDrillMm: '14.5', classes: ['8.8', '10.9', '12.9'] },
  { id: 'M18', label: 'M18', system: 'metric', pitch: '2.5 mm', pitchMm: 2.5, minorDiameterMm: 15.294, tensileStressAreaMm2: 192, clearanceHoleMm: '20.0', tapDrillMm: '15.5', classes: ['8.8', '10.9', '12.9'] },
  { id: 'M20', label: 'M20', system: 'metric', pitch: '2.5 mm', pitchMm: 2.5, minorDiameterMm: 17.294, tensileStressAreaMm2: 245, clearanceHoleMm: '22.0', tapDrillMm: '17.5', classes: ['8.8', '10.9', '12.9'] },
  { id: 'M22', label: 'M22', system: 'metric', pitch: '2.5 mm', pitchMm: 2.5, minorDiameterMm: 19.294, tensileStressAreaMm2: 303, clearanceHoleMm: '24.0', tapDrillMm: '19.5', classes: ['8.8', '10.9', '12.9'] },
  { id: 'M24', label: 'M24', system: 'metric', pitch: '3.0 mm', pitchMm: 3.0, minorDiameterMm: 20.752, tensileStressAreaMm2: 353, clearanceHoleMm: '26.0', tapDrillMm: '21.0', classes: ['8.8', '10.9', '12.9'] },
  { id: '1/4-20', label: '1/4"-20 UNC', system: 'inch', pitch: '20 TPI', pitchMm: 1.27, minorDiameterMm: 4.264, tensileStressAreaMm2: 24.3, clearanceHoleMm: '6.6 (17/64")', tapDrillMm: '5.1 (#7)', classes: ['Grade 5', 'Grade 8'] },
  { id: '5/16-18', label: '5/16"-18 UNC', system: 'inch', pitch: '18 TPI', pitchMm: 1.41, minorDiameterMm: 5.509, tensileStressAreaMm2: 37.0, clearanceHoleMm: '8.3 (21/64")', tapDrillMm: '6.6 (F)', classes: ['Grade 5', 'Grade 8'] },
  { id: '3/8-16', label: '3/8"-16 UNC', system: 'inch', pitch: '16 TPI', pitchMm: 1.59, minorDiameterMm: 6.773, tensileStressAreaMm2: 54.5, clearanceHoleMm: '9.9 (25/64")', tapDrillMm: '8.0 (Q)', classes: ['Grade 5', 'Grade 8'] },
  { id: '1/2-13', label: '1/2"-13 UNC', system: 'inch', pitch: '13 TPI', pitchMm: 1.95, minorDiameterMm: 9.271, tensileStressAreaMm2: 92.1, clearanceHoleMm: '13.5 (17/32")', tapDrillMm: '10.4 (21/64")', classes: ['Grade 5', 'Grade 8'] },
];

export function getClampLoad(screw: ScrewSize, classKey: string): number {
  const cls = PROPERTY_CLASSES[classKey];
  if (!cls) return 0;
  return (cls.proofStressMpa * screw.tensileStressAreaMm2) / 1000;
}

export function getTighteningTorque(screw: ScrewSize, classKey: string): number {
  const clampLoad = getClampLoad(screw, classKey);
  if (clampLoad <= 0) return 0;
  const nominalDiameterMm = parseFloat(screw.id.match(/^M(\d+)/)?.[1] || '0');
  const torqueFactor = 0.2;
  return clampLoad * nominalDiameterMm * torqueFactor;
}

export function getMaxTensileLoad(screw: ScrewSize, classKey: string): number {
  const cls = PROPERTY_CLASSES[classKey];
  if (!cls) return 0;
  return (cls.tensileStrengthMpa * screw.tensileStressAreaMm2) / 1000;
}

export function getMaxShearLoad(screw: ScrewSize, classKey: string): number {
  const tensile = getMaxTensileLoad(screw, classKey);
  return tensile * 0.6;
}

export function getInchNominalDiameterMm(screw: ScrewSize): number {
  const map: Record<string, number> = {
    '1/4-20': 6.35,
    '5/16-18': 7.94,
    '3/8-16': 9.53,
    '1/2-13': 12.7,
  };
  return map[screw.id] || 0;
}

export function getInchTighteningTorque(screw: ScrewSize, classKey: string): number {
  const clampLoad = getClampLoad(screw, classKey);
  const diameterMm = getInchNominalDiameterMm(screw);
  if (clampLoad <= 0 || diameterMm <= 0) return 0;
  return clampLoad * diameterMm * 0.2;
}

export function getTorque(screw: ScrewSize, classKey: string): number {
  if (screw.system === 'inch') {
    return getInchTighteningTorque(screw, classKey);
  }
  return getTighteningTorque(screw, classKey);
}
