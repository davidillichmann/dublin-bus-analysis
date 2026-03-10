import type { Route } from "../types";

export interface LinearRegressionResult {
  slope: number;
  intercept: number;
  r: number;
}

// Linear regression: returns slope, intercept, and Pearson r for xKey vs yKey across data
export function linearRegression(data: Route[], xKey: string, yKey: string): LinearRegressionResult {
  const n = data.length;
  if (n < 2) return { slope: 0, intercept: 0, r: 0 };
  const get = (d: Route, k: string): number => (d as unknown as Record<string, number>)[k] ?? 0;
  const sx  = data.reduce((acc, d) => acc + get(d, xKey), 0);
  const sy  = data.reduce((acc, d) => acc + get(d, yKey), 0);
  const sxx = data.reduce((acc, d) => acc + get(d, xKey) * get(d, xKey), 0);
  const syy = data.reduce((acc, d) => acc + get(d, yKey) * get(d, yKey), 0);
  const sxy = data.reduce((acc, d) => acc + get(d, xKey) * get(d, yKey), 0);
  const slope     = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const intercept = (sy - slope * sx) / n;
  const r         = (n * sxy - sx * sy) / Math.sqrt((n * sxx - sx * sx) * (n * syy - sy * sy));
  return { slope, intercept, r };
}
