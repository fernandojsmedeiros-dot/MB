import gdtCsv from '@/data/materials/gdt_database.csv?raw';

export interface GDTItem {
  category: string;
  characteristic: string;
  symbolUnicode: string;
  needsDatum: boolean;
  description: string;
  imageFilename: string;
}

const IMAGE_MAP: Record<string, string> = {
  'gdt_datum.jpg': 'What_is_a_Datum.png',
  'gdt_mmc.jpg': 'Maximum_Material_Condition_(MMC).png',
  'gdt_lmc.jpg': 'Least_Material_Condition_(LMC).png',
  'gdt_straightness.jpg': 'Straightness.png',
  'gdt_flatness.jpg': 'Flatness.png',
  'gdt_roundness.jpg': 'Roundness_(Circularity).png',
  'gdt_cylindricity.jpg': 'Cylindricity.png',
  'gdt_profile_line_form.jpg': 'Profile_of_a_Line.png',
  'gdt_profile_surface_form.jpg': 'Profile_of_a_Surface.png',
  'gdt_parallelism.jpg': 'Parallelism.png',
  'gdt_perpendicularity.jpg': 'Perpendicularity.png',
  'gdt_angularity.jpg': 'Angularity.png',
  'gdt_position.jpg': 'True_Position.png',
  'gdt_concentricity.jpg': 'Concentricity.png',
  'gdt_symmetry.jpg': 'Symmetry.png',
  'gdt_profile_line_loc.jpg': 'Profile_of_a_Line.png',
  'gdt_profile_surface_loc.jpg': 'Profile_of_a_Surface.png',
  'gdt_circular_runout.jpg': 'Circular_Runout.png',
  'gdt_total_runout.jpg': 'Total_Runout.png',
};

function parseCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseGdtCsv(): GDTItem[] {
  const lines = gdtCsv.trim().split('\n');
  if (lines.length < 2) return [];
  const delimiter = lines[0].includes(';') ? ';' : ',';
  const headers = parseCSVLine(lines[0], delimiter);
  const items: GDTItem[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCSVLine(line, delimiter);
    const record: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = values[j] || '';
    }
    const csvImage = record['image_filename'] || '';
    items.push({
      category: record['category'] || '',
      characteristic: record['characteristic'] || '',
      symbolUnicode: record['symbol_unicode'] || '',
      needsDatum: (record['needs_datum'] || '').trim().toLowerCase() === 'yes',
      description: record['description'] || '',
      imageFilename: IMAGE_MAP[csvImage] || csvImage,
    });
  }
  return items;
}

const ALL_ITEMS = parseGdtCsv();

export function getGdtItems(): GDTItem[] {
  return ALL_ITEMS;
}

export function getGdtCategories(): string[] {
  return [...new Set(ALL_ITEMS.map((item) => item.category))];
}

export function getGdtItemsByCategory(): Record<string, GDTItem[]> {
  const grouped: Record<string, GDTItem[]> = {};
  for (const item of ALL_ITEMS) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }
  return grouped;
}
