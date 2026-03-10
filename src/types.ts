export interface Route {
  route: string;
  punctuality: number | null;
  ewt: number | null;
  stops: number;
  time: number;
  km: number;
  type: "radial" | "cross_city" | "suburban" | "local" | "orbital" | "express";
  freq: "high" | "low";
  rank: number | null;
  label: boolean;
}
