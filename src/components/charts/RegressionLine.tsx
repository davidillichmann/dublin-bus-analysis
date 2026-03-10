import { Line } from "recharts";
import type { Route } from "../../types";
import { linearRegression } from "../../utils/stats";

interface Props {
  data: Route[];
  xKey: string;
  yKey: string;
  xMin: number;
  xMax: number;
}

export function regressionLine({ data, xKey, yKey, xMin, xMax }: Props) {
  const { slope, intercept } = linearRegression(data, xKey, yKey);
  const points = [
    { [xKey]: xMin, [yKey]: slope * xMin + intercept },
    { [xKey]: xMax, [yKey]: slope * xMax + intercept },
  ];
  return (
    <Line
      data={points}
      dataKey={yKey}
      stroke="#ef4444"
      strokeWidth={2}
      strokeDasharray="8 4"
      dot={false}
      activeDot={false}
      legendType="none"
      isAnimationActive={false}
    />
  );
}
