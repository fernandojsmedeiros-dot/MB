import { useMemo } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { loadAllMaterials, getCategoryConfig } from '@/data/materials';
import { categoryBadgeColors } from '@/config/categoryStyles';
import { getPolymerDisplayName } from '@/utils/polymerNames';
import type { MaterialRecord } from '@/types';

const STANDARD_PREFIXES = ['SAE', 'DIN', 'JIS', 'ISO', 'ASTM', 'GB', 'AFNOR', 'UNS', 'W-Nr'];

function extractStandardCodes(value: string): string[] {
  if (!value || value === '-') return [];
  return value
    .split(/[/;,]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s !== '-');
}

function parseRangeMidpoint(value: string): number | null {
  if (!value || value === '-') return null;
  const cleaned = value.replace(',', '.');
  const rangeMatch = cleaned.match(/([\d.]+)\s*-\s*([\d.]+)/);
  if (rangeMatch) {
    const low = parseFloat(rangeMatch[1]);
    const high = parseFloat(rangeMatch[2]);
    if (!isNaN(low) && !isNaN(high)) return (low + high) / 2;
  }
  const singleMatch = cleaned.match(/([\d.]+)/);
  if (singleMatch) {
    const num = parseFloat(singleMatch[1]);
    if (!isNaN(num)) return num;
  }
  return null;
}

interface SimilarResult {
  material: MaterialRecord;
  score: number;
  matchedCodes: string[];
  modDiff?: number;
  tenDiff?: number;
}

export function SimilaresModal() {
  const { similaresMaterial, closeSimilares, openDetail } = useApp();
  const isPolymer = similaresMaterial?.category === 'plastics';

  const equivalents = useMemo<SimilarResult[]>(() => {
    if (!similaresMaterial) return [];
    const source = similaresMaterial;
    const config = getCategoryConfig(source.category);

    if (source.category === 'plastics') {
      const sourceModulus = parseRangeMidpoint(source.data['modulo_elasticidade_mpa'] || '');
      const sourceTensile = parseRangeMidpoint(source.data['resistencia_tracao_23c_mpa'] || '');
      if (sourceModulus === null || sourceTensile === null) return [];

      const allMaterials = loadAllMaterials().filter((m) => m.category === source.category && m.id !== source.id);

      const allModuli: number[] = [sourceModulus];
      const allTensiles: number[] = [sourceTensile];
      allMaterials.forEach((m) => {
        const mod = parseRangeMidpoint(m.data['modulo_elasticidade_mpa'] || '');
        const ten = parseRangeMidpoint(m.data['resistencia_tracao_23c_mpa'] || '');
        if (mod !== null) allModuli.push(mod);
        if (ten !== null) allTensiles.push(ten);
      });

      const modRange = Math.max(...allModuli) - Math.min(...allModuli);
      const tenRange = Math.max(...allTensiles) - Math.min(...allTensiles);

      return allMaterials
        .map((m): SimilarResult | null => {
          const mod = parseRangeMidpoint(m.data['modulo_elasticidade_mpa'] || '');
          const ten = parseRangeMidpoint(m.data['resistencia_tracao_23c_mpa'] || '');
          if (mod === null || ten === null) return null;

          const modDist = modRange > 0 ? Math.abs(mod - sourceModulus) / modRange : 0;
          const tenDist = tenRange > 0 ? Math.abs(ten - sourceTensile) / tenRange : 0;
          const similarity = 1 - (modDist + tenDist) / 2;

          return {
            material: m,
            score: Math.round(similarity * 100),
            matchedCodes: [],
            modDiff: Math.abs(mod - sourceModulus),
            tenDiff: Math.abs(ten - sourceTensile),
          };
        })
        .filter((r): r is SimilarResult => r !== null)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);
    }

    // Standard code-based similarity for other materials
    const sourceCodes = new Set<string>();
    STANDARD_PREFIXES.forEach((prefix) => {
      Object.entries(source.data).forEach(([key, value]) => {
        if (key.toUpperCase().includes(prefix) || key.toLowerCase().includes(prefix.toLowerCase())) {
          extractStandardCodes(value).forEach((c) => sourceCodes.add(c.toLowerCase()));
        }
      });
    });
    config.standardColumns.forEach((col) => {
      extractStandardCodes(source.data[col] || '').forEach((c) => sourceCodes.add(c.toLowerCase()));
    });

    if (sourceCodes.size === 0) return [];

    const allMaterials = loadAllMaterials().filter((m) => m.category === source.category && m.id !== source.id);

    return allMaterials
      .map((m): SimilarResult => {
        const matchCodes = new Set<string>();
        Object.entries(m.data).forEach(([key, value]) => {
          if (key !== 'ID') {
            extractStandardCodes(value).forEach((c) => {
              if (sourceCodes.has(c.toLowerCase())) matchCodes.add(c);
            });
          }
        });
        return { material: m, score: matchCodes.size, matchedCodes: Array.from(matchCodes) };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [similaresMaterial]);

  if (!similaresMaterial) return null;

  const config = getCategoryConfig(similaresMaterial.category);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={closeSimilares} />

      <div className="relative flex max-h-[80vh] w-full max-w-md flex-col rounded-t-2xl bg-white shadow-2xl animate-slide-in-bottom sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-steel-100 px-5 py-4">
          <div className="min-w-0">
            <p className="font-mono text-xs text-steel-400">{similaresMaterial.id}</p>
            <h2 className="truncate text-base font-bold text-steel-900">{isPolymer ? getPolymerDisplayName(similaresMaterial.data) : similaresMaterial.commercialName}</h2>
            <p className="text-xs text-steel-500">
              {isPolymer ? 'Similar materials by mechanical properties' : 'Cross-referenced equivalents'}
            </p>
          </div>
          <button
            onClick={closeSimilares}
            className="flex-shrink-0 rounded-lg p-2 text-steel-400 transition-colors hover:bg-steel-100 hover:text-steel-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {equivalents.length > 0 ? (
            <div className="divide-y divide-steel-100">
              {equivalents.map(({ material, matchedCodes, score, modDiff, tenDiff }) => (
                <button
                  key={material.id}
                  onClick={() => {
                    closeSimilares();
                    openDetail(material);
                  }}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-steel-50 active:bg-steel-100"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-[11px] font-medium text-steel-400">{material.id}</span>
                    <p className="truncate text-sm font-semibold text-steel-900">{isPolymer ? getPolymerDisplayName(material.data) : material.commercialName}</p>
                    {isPolymer ? (
                      <div className="mt-1 flex items-center gap-3 text-[10px] text-steel-500">
                        <span>ΔMod: {modDiff !== undefined ? modDiff.toFixed(0) : '-'} MPa</span>
                        <span>Δσ: {tenDiff !== undefined ? tenDiff.toFixed(1) : '-'} MPa</span>
                      </div>
                    ) : (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {matchedCodes.slice(0, 4).map((code) => (
                          <span
                            key={code}
                            className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${categoryBadgeColors[material.category]}`}
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-1">
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span className="text-[11px] font-medium text-emerald-600">
                      {isPolymer ? `${score}%` : score}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-steel-300" />
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-steel-500">No similar materials found.</p>
              <p className="mt-1 text-xs text-steel-400">
                {isPolymer
                  ? 'No materials with comparable mechanical properties found.'
                  : 'This entry has no overlapping standard codes with other records.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
