import { GitCompare, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function CompareBar() {
  const { selectedForCompare, clearCompareSelection, openCompareModal } = useApp();

  if (selectedForCompare.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-30 w-full max-w-md -translate-x-1/2 px-4 animate-slide-in-bottom">
      <div className="flex items-center justify-between gap-2 rounded-xl border border-steel-200 bg-white p-3 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100">
            <GitCompare className="h-4 w-4 text-primary-700" />
          </div>
          <div>
            <p className="text-xs font-semibold text-steel-900">
              {selectedForCompare.length} selected
            </p>
            <p className="text-[10px] text-steel-500">Max 3 for comparison</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={clearCompareSelection}
            className="rounded-lg p-1.5 text-steel-500 transition-colors hover:bg-steel-100"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            onClick={() => openCompareModal()}
            disabled={selectedForCompare.length < 2}
            className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GitCompare className="h-3.5 w-3.5" />
            Compare
          </button>
        </div>
      </div>
    </div>
  );
}

export function CompareBarClose() {
  const { closeCompareModal } = useApp();
  return (
    <button onClick={closeCompareModal} className="rounded-lg p-1.5 hover:bg-steel-100">
      <X className="h-5 w-5" />
    </button>
  );
}
