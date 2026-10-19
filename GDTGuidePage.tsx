import { useState, useMemo } from 'react';
import { Search, ChevronRight, Crosshair, AlertCircle, BookOpen } from 'lucide-react';
import { getGdtItemsByCategory, getGdtCategories } from '@/data/gdt';
import { useApp } from '@/context/AppContext';
import type { GDTItem } from '@/data/gdt';

export function GDTGuidePage() {
  const { openGdtDetail } = useApp();
  const categories = useMemo(() => getGdtCategories(), []);
  const itemsByCategory = useMemo(() => getGdtItemsByCategory(), []);
  const [search, setSearch] = useState('');

  const filteredCategories = useMemo(() => {
    if (!search) return categories;
    const q = search.toLowerCase();
    return categories.filter((cat) =>
      (itemsByCategory[cat] || []).some(
        (item) =>
          item.characteristic.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      )
    );
  }, [categories, itemsByCategory, search]);

  const totalCount = useMemo(
    () => Object.values(itemsByCategory).reduce((sum, items) => sum + items.length, 0),
    [itemsByCategory]
  );

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <Crosshair className="h-5 w-5 text-purple-600" />
        <h2 className="text-base font-bold text-steel-800">GD&T Guide</h2>
        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
          {totalCount} characteristics
        </span>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 py-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search GD&T characteristics..."
            className="w-full rounded-lg border border-steel-200 bg-white py-2 pl-9 pr-3 text-sm text-steel-900 placeholder-steel-400 transition-colors focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-100"
          />
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center gap-1.5 pb-2 text-xs text-steel-400">
        <Crosshair className="h-3 w-3" />
        <span>
          {filteredCategories.reduce(
            (sum, cat) => sum + (itemsByCategory[cat]?.length || 0),
            0
          )}{' '}
          results
        </span>
        {search && <span className="text-steel-500">· filtered: "{search}"</span>}
      </div>

      {/* Category groups with row lists */}
      {filteredCategories.length > 0 ? (
        <div className="space-y-4">
          {filteredCategories.map((category) => {
            const items = (itemsByCategory[category] || []).filter(
              (item) =>
                !search ||
                item.characteristic.toLowerCase().includes(search.toLowerCase()) ||
                item.description.toLowerCase().includes(search.toLowerCase())
            );
            if (items.length === 0) return null;
            return (
              <div key={category}>
                {/* Category divider */}
                <div className="mb-2 flex items-center gap-3">
                  <div className="h-px flex-1 bg-steel-200" />
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-steel-400">
                    {category}
                  </div>
                  <div className="h-px flex-1 bg-steel-200" />
                </div>
                {/* Row list — same container style as other modules */}
                <div className="overflow-hidden rounded-lg border border-steel-100 bg-white">
                  {items.map((item, idx) => (
                    <GDTRow
                      key={`${category}__${item.characteristic}__${idx}`}
                      item={item}
                      onClick={() => openGdtDetail(item)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-steel-100">
            <Crosshair className="h-7 w-7 text-steel-400" />
          </div>
          <h3 className="mt-3 text-base font-semibold text-steel-700">No characteristics found</h3>
          <p className="mt-1 text-xs text-steel-500">Try a different search.</p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="mt-3 rounded-lg bg-steel-100 px-3 py-1.5 text-xs font-medium text-steel-700 transition-colors hover:bg-steel-200"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function GDTRow({ item, onClick }: { item: GDTItem; onClick: () => void }) {
  const hasSymbol = item.symbolUnicode && item.symbolUnicode !== '-';

  return (
    <div
      onClick={onClick}
      className="group flex cursor-pointer items-center gap-3 border-b border-steel-100 px-4 py-3 transition-colors hover:bg-steel-50 active:bg-steel-50"
    >
      {/* Symbol badge — replaces the icon in MaterialRow/ScrewRow */}
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50">
        {hasSymbol ? (
          <span
            className="text-xl font-bold text-purple-700"
            style={{ fontFamily: "'Segoe UI', 'Noto Sans', 'Arial Unicode MS', sans-serif" }}
          >
            {item.symbolUnicode}
          </span>
        ) : (
          <BookOpen className="h-4 w-4 text-purple-600" />
        )}
      </div>

      {/* Title + subtitle */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-steel-900">{item.characteristic}</p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-steel-500">
          <span className="truncate">{item.category}</span>
          {item.needsDatum && (
            <>
              <span className="text-steel-300">·</span>
              <span className="inline-flex items-center gap-1 text-amber-600">
                <AlertCircle className="h-3 w-3" />
                Datum
              </span>
            </>
          )}
        </div>
      </div>

      {/* Chevron — same as MaterialRow/ScrewRow */}
      <ChevronRight className="h-4 w-4 flex-shrink-0 text-steel-300 transition-colors group-hover:text-steel-500" />
    </div>
  );
}
