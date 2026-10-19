import { useState, useMemo } from 'react';
import { Settings, Wrench, Hexagon, Key, CircleDot } from 'lucide-react';
import { getMaterialsByCategory } from '@/data/materials';
import type { MaterialRecord } from '@/types';

interface ToolData {
  material: string;
  sistema: string;
  soquete: string;
  clearenceSoquete: string;
  chaveBoca: string;
  chaveAllen: string;
  chaveTorx: string;
}

function extractToolData(record: MaterialRecord): ToolData {
  const d = record.data;
  return {
    material: d['material_ou_bitola'] || '-',
    sistema: d['sistema'] || '-',
    soquete: d['chave_soquete_mm'] || '-',
    clearenceSoquete: d['clearence_soquete_ext_mm'] || '-',
    chaveBoca: d['chave_boca_mm'] || '-',
    chaveAllen: d['chave_allen_mm'] || '-',
    chaveTorx: d['chave_torx'] || '-',
  };
}

export function TighteningToolsView() {
  const tools = useMemo(() => getMaterialsByCategory('tools'), []);
  const toolDataList = useMemo(() => tools.map(extractToolData), [tools]);

  const threadSizes = useMemo(
    () => toolDataList.map((t) => t.material).filter((m) => m && m !== '-'),
    [toolDataList]
  );

  const [selectedThread, setSelectedThread] = useState(threadSizes[0] || '');

  const currentThread = selectedThread || threadSizes[0] || '';
  const selectedTool = toolDataList.find((t) => t.material === currentThread) || toolDataList[0];

  if (!selectedTool) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Settings className="h-8 w-8 text-steel-300" />
        <p className="mt-3 text-sm text-steel-500">No tool data available.</p>
      </div>
    );
  }

  const cards = [
    {
      icon: Hexagon,
      title: 'Hex Socket',
      values: [
        { label: 'Socket Size', value: selectedTool.soquete, unit: 'mm' },
        { label: 'Outer Clearance', value: selectedTool.clearenceSoquete, unit: 'mm' },
      ],
      color: 'violet',
    },
    {
      icon: Wrench,
      title: 'Open-End / Combination Spanner',
      values: [
        { label: 'Spanner Size', value: selectedTool.chaveBoca, unit: 'mm' },
      ],
      color: 'blue',
    },
    {
      icon: Key,
      title: 'Allen Key / Hex Drive',
      values: [
        { label: 'Allen Key Size', value: selectedTool.chaveAllen, unit: 'mm' },
      ],
      color: 'amber',
    },
    {
      icon: CircleDot,
      title: 'Torx / Internal Star Drive',
      values: [
        { label: 'Torx Size', value: selectedTool.chaveTorx, unit: '' },
      ],
      color: 'emerald',
    },
  ];

  const colorClasses: Record<string, { bg: string; icon: string; text: string }> = {
    violet: { bg: 'from-violet-50 to-violet-100/50', icon: 'bg-violet-100 text-violet-600', text: 'text-violet-700' },
    blue: { bg: 'from-blue-50 to-blue-100/50', icon: 'bg-blue-100 text-blue-600', text: 'text-blue-700' },
    amber: { bg: 'from-amber-50 to-amber-100/50', icon: 'bg-amber-100 text-amber-600', text: 'text-amber-700' },
    emerald: { bg: 'from-emerald-50 to-emerald-100/50', icon: 'bg-emerald-100 text-emerald-600', text: 'text-emerald-700' },
  };

  return (
    <div className="space-y-4">
      {/* Thread Selector */}
      <div>
        <label className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-steel-500">
          <Settings className="h-3 w-3" />
          Select Fastener Thread
        </label>
        <select
          value={currentThread}
          onChange={(e) => setSelectedThread(e.target.value)}
          className="w-full rounded-lg border border-steel-200 bg-white py-2.5 px-3 text-sm text-steel-900 transition-colors focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-100"
        >
          {threadSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* System badge */}
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-steel-100 px-3 py-1 text-[11px] font-medium text-steel-600">
          {selectedTool.sistema}
        </span>
      </div>

      {/* 2x2 Card Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          const colors = colorClasses[card.color];
          return (
            <div
              key={card.title}
              className={`rounded-lg bg-gradient-to-br ${colors.bg} p-4 transition-all`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${colors.icon}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-steel-600">
                  {card.title}
                </h4>
              </div>

              <div className="mt-3 space-y-2">
                {card.values.map((val) => (
                  <div key={val.label} className="flex items-baseline justify-between">
                    <span className="text-[11px] font-medium text-steel-500">{val.label}</span>
                    <span className={`text-lg font-bold ${colors.text}`}>
                      {val.value}
                      {val.unit && val.value !== '-' && (
                        <span className="ml-1 text-xs font-normal text-steel-400">{val.unit}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="font-mono text-[10px] text-steel-400">
        Tool specifications per ISO / DIN / ASME standards for the selected thread size.
      </p>
    </div>
  );
}
