import { ChevronsRight } from "lucide-react";

export function SwipeHint() {
  return (
    <div className="md:hidden absolute top-8 left-24 flex items-center gap-1 text-xs text-slate-300 italic pointer-events-none select-none mb-2">
      Swipe right to see full chart
      <ChevronsRight size={12} />
    </div>
  );
}
