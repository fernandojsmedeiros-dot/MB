import { X, Crosshair, AlertCircle, BookOpen } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function GDTDetail() {
  const { gdtDetail, closeGdtDetail } = useApp();

  if (!gdtDetail) return null;

  const item = gdtDetail;
  const hasSymbol = item.symbolUnicode && item.symbolUnicode !== '-';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={closeGdtDetail} />

      <div className="relative flex max-h-[88vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-2xl animate-slide-in-bottom sm:rounded-2xl">
        <div className="flex justify-center pt-2">
          <div className="h-1 w-10 rounded-full bg-steel-200" />
        </div>

        {/* Header — matches ScrewDetail/DetailSlideOver pattern */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 mt-2 rounded-t-lg px-5 py-4 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <Crosshair className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-white/70">{item.category}</p>
                <h2 className="mt-0.5 truncate text-lg font-bold">{item.characteristic}</h2>
              </div>
            </div>
            <button
              onClick={closeGdtDetail}
              className="flex-shrink-0 rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Symbol + Datum badge row */}
          <div className="mt-4 flex items-center gap-3">
            {hasSymbol && (
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <span
                  className="text-5xl font-bold leading-none"
                  style={{ fontFamily: "'Segoe UI', 'Noto Sans', 'Arial Unicode MS', sans-serif" }}
                >
                  {item.symbolUnicode}
                </span>
              </div>
            )}
            {item.needsDatum && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-amber-900 shadow-sm">
                <AlertCircle className="h-3.5 w-3.5" />
                Datum Required
              </div>
            )}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Description */}
          <div className="mb-5">
            <div className="mb-2 flex items-center gap-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">
                Description
              </h4>
              <div className="h-px flex-1 bg-steel-100" />
            </div>
            <p className="text-sm leading-relaxed text-steel-700">
              {item.description}
            </p>
          </div>

          {/* Diagram */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-steel-500">
                Visual Diagram
              </h4>
              <div className="h-px flex-1 bg-steel-100" />
            </div>
            <div className="flex justify-center rounded-lg border border-steel-100 bg-gradient-to-b from-steel-50/50 to-white p-4">
              <img
                src={`/${item.imageFilename}`}
                alt={item.characteristic}
                className="h-auto max-w-full max-w-2xl rounded-lg border border-steel-200 object-contain shadow-md"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                  const parent = img.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="flex flex-col items-center gap-2 py-8 text-steel-400"><div class="flex h-10 w-10 items-center justify-center rounded-full bg-steel-100"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M4 4l16 16"/></svg></div><p class="text-xs">Diagram unavailable</p></div>';
                  }
                }}
              />
            </div>
          </div>

          <p className="mt-4 font-mono text-[10px] text-steel-400">
            Geometric Dimensioning & Tolerancing · Reference Guide
          </p>
        </div>
      </div>
    </div>
  );
}
