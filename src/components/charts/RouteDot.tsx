import type { Route } from "../../types";
import { CATEGORY_MAP, categoryName } from "../../categories";

export interface RouteDotProps {
  cx?: number;
  cy?: number;
  payload: Route;
  hovered: string | null;
  onHover: (route: string | null) => void;
}

export default function RouteDot({ cx, cy, payload, hovered, onHover }: RouteDotProps) {
  if (!cx || !cy) return null;
  const category  = CATEGORY_MAP[categoryName(payload.time)];
  const color     = category?.color ?? "#94a3b8";
  const show      = payload.label;
  const isHovered = hovered === payload.route;
  const isTop     = payload.rank !== null;
  const r         = isHovered ? 9 : (show ? 6.5 : 4.5);

  return (
    <g
      onMouseEnter={() => onHover(payload.route)}
      onMouseLeave={() => onHover(null)}
      className="cursor-pointer"
    >
      {isHovered && <circle cx={cx} cy={cy} r={r + 5} fill={color} opacity={0.12} />}
      <circle
        cx={cx} cy={cy} r={r}
        fill={color}
        stroke={isTop ? "#fbbf24" : "#0f172a"}
        strokeWidth={isTop ? 2.5 : 1}
        opacity={isHovered ? 1 : 0.82}
      />
      {(show || isHovered) && (
        <text
          x={cx} y={cy - r - 6}
          textAnchor="middle"
          fill={isTop ? "#fbbf24" : "#cbd5e1"}
          fontSize={isTop ? 12 : 10}
          fontWeight={isTop ? 800 : 600}
          fontFamily="'JetBrains Mono',monospace"
          style={{ textShadow: "0 1px 6px #000,0 0 3px #000" }}
        >
          {payload.route}
        </text>
      )}
    </g>
  );
}
