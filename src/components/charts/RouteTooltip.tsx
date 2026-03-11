import type { Route } from "../../types";
import { CATEGORY_MAP, categoryName } from "../../categories";

interface RowProps {
  label: string;
  value: string | number;
  color?: string;
}

function Row({ label, value, color }: RowProps) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-400">{label}</span>
      <span className="font-bold" style={{ color: color ?? "#e2e8f0" }}>{value}</span>
    </div>
  );
}

interface TooltipProps {
  route: Route | null;
}

export default function RouteTooltip({ route }: TooltipProps) {
  if (!route) return null;
  const category = CATEGORY_MAP[categoryName(route.time)];
  const isTop    = route.rank !== null;

  return (
    <div
      className="text-slate-200 rounded-xl text-sm leading-[1.7] border border-slate-700 max-w-70 font-mono backdrop-blur"
      style={{
        background: "#0f172aee",
        padding: "14px 18px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="text-white py-0.5 px-2 rounded text-xs font-bold uppercase tracking-wider"
          style={{ background: category.color }}
        >{category.name}</span>
        <span className="text-xl font-extrabold text-white">Route {route.route}</span>
      </div>
      {isTop && (
        <div
          className="rounded py-0.5 px-2 text-xs text-amber-400 font-semibold mb-2"
          style={{ background: "#fbbf2418", border: "1px solid #fbbf2444" }}
        >
          Top #{route.rank} busiest route
        </div>
      )}
      <div className="border-t border-slate-700 pt-2">
        {route.punctuality != null && (
          <Row label="Punctuality" value={route.punctuality.toFixed(1) + "%"}
               color={route.punctuality >= 75 ? "#4ade80" : route.punctuality >= 65 ? "#fbbf24" : "#f87171"} />
        )}
        {route.ewt != null && (
          <Row label="Excess wait" value={route.ewt.toFixed(2) + " min"}
               color={route.ewt <= 1.2 ? "#4ade80" : route.ewt <= 2.0 ? "#fbbf24" : "#f87171"} />
        )}
        <Row label="Stops" value={route.stops} />
        <Row label="Running time" value={`${route.time} min`} color={category.color} />
        <Row label="Length" value={`${route.km} km`} />
      </div>
    </div>
  );
}
