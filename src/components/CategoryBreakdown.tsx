import type { Route } from "../types";
import { CATEGORIES, categoryName } from "../categories";

interface Props {
  data: Route[];
  expanded: string | null;
  setExpanded: (cat: string | null) => void;
}

export default function CategoryBreakdown({ data, expanded, setExpanded }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {CATEGORIES.map(category => {
        const routes = data
          .filter(route => categoryName(route.time) === category.name)
          .sort((a, b) => (b.punctuality ?? 0) - (a.punctuality ?? 0));
        const avg  = routes.length ? routes.reduce((acc, route) => acc + (route.punctuality ?? 0), 0) / routes.length : 0;
        const open = expanded === category.name;

        return (
          <div
            key={category.name}
            className="bg-slate-800 rounded-xl border transition-colors duration-200"
            style={{ borderColor: open ? `${category.color}66` : "#334155" }}
          >
            <div
              onClick={() => setExpanded(open ? null : category.name)}
              className="py-4 px-5 cursor-pointer flex items-center justify-between select-none"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: category.color, boxShadow: `0 0 10px ${category.color}55` }}
                />
                <div>
                  <span className="font-bold text-slate-100 text-base">{category.name}</span>
                  <span className="text-slate-500 text-sm ml-2.5">{category.range}</span>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="text-right">
                  <div className="text-xl font-extrabold font-mono" style={{ color: category.color }}>
                    {avg.toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-500">{routes.length} routes</div>
                </div>
                <span
                  className="text-slate-500 text-xl transition-transform duration-200"
                  style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                >▾</span>
              </div>
            </div>

            {open && (
              <div className="pb-4 px-5 border-t border-slate-700">
                <div
                  className="grid gap-2 mt-3.5"
                  style={{ gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))" }}
                >
                  {routes.map(route => {
                    const isTop = route.rank !== null;
                    const pct   = route.punctuality ?? 0;
                    return (
                      <div
                        key={route.route}
                        className="bg-slate-900 rounded-lg py-2.5 px-3.5 flex justify-between items-center border"
                        style={{ borderColor: isTop ? "#fbbf2433" : "#1e293b" }}
                      >
                        <div>
                          <span
                            className="font-bold text-sm font-mono"
                            style={{ color: isTop ? "#fbbf24" : "#f1f5f9" }}
                          >
                            {route.route}
                          </span>
                          {isTop && (
                            <span className="text-xs text-amber-400 ml-1.5 align-super">TOP10</span>
                          )}
                        </div>
                        <div className="text-right">
                          <div
                            className="font-bold text-sm font-mono"
                            style={{ color: pct >= 75 ? "#4ade80" : pct >= 65 ? "#fbbf24" : "#f87171" }}
                          >
                            {route.punctuality?.toFixed(1) ?? "N/A"}%
                          </div>
                          <div className="text-xs text-slate-500">{route.stops} stops, {route.time} min, {route.km} km</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
