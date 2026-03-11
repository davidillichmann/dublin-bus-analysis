import { CATEGORIES } from "../../categories";

export default function ChartLegend({ showTop10 = true }: { showTop10?: boolean}) {
  return (
    <div className="flex flex-wrap gap-3 items-center mb-3 text-xs text-slate-400">
      {CATEGORIES.map(category => (
        <span key={category.name} className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: category.color }} />
          {category.name} ({category.range})
        </span>
      ))}
    {showTop10 && (
        <span className="flex items-center gap-1 text-amber-400">
        <span className="w-2 h-2 rounded-full inline-block bg-amber-400 border border-amber-400" />
        Top 10 busiest
        </span>
    )}
    </div>
  );
}
