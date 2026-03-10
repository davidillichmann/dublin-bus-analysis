export interface Category {
  name: string;
  color: string;
  range: string;
}

export const CATEGORIES: Category[] = [
  { name: "Short",     color: "#10b981", range: "Up to 40 min" },
  { name: "Medium",    color: "#eab308", range: "40 - 50 min" },
  { name: "Long",      color: "#f97316", range: "50 - 65 min" },
  { name: "Very Long", color: "#ef4444", range: "Over 65 min" },
];

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map(c => [c.name, c]),
);

export function categoryName(t: number): string {
  return t <= 40 ? "Short" : t <= 50 ? "Medium" : t <= 65 ? "Long" : "Very Long";
}
