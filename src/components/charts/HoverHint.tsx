import { Pointer } from "lucide-react";

export function HoverHint() {
  return (
    <div className={`absolute top-8 right-10 flex items-center gap-1.5 text-xs text-slate-300 italic pointer-events-none select-none`}>
      <Pointer size={14} className="pointer-events-none select-none" />
      Hover a dot for route details
    </div>
  );
}
