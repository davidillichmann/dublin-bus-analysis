import {useCallback, useState} from "react";
import {CartesianGrid, ComposedChart, Label, ResponsiveContainer, Scatter, Tooltip, XAxis, YAxis,} from "recharts";

import ROUTES_DATA from "../data/routes.json";
import type {Route} from "../types";
import {CATEGORIES, CATEGORY_MAP, categoryName} from "../categories";
import {linearRegression} from "../utils/stats.ts";

import StatCard from "./StatCard.tsx";
import Section from "./Section.tsx";
import MethodNote from "./MethodNote.tsx";
import CategoryBreakdown from "./CategoryBreakdown.tsx";
import DiscussionSection from "./DiscussionSection.tsx";
import ChartLegend from "./charts/ChartLegend.tsx";
import type {RouteDotProps} from "./charts/RouteDot.tsx";
import RouteDot from "./charts/RouteDot.tsx";
import RouteTooltip from "./charts/RouteTooltip.tsx";
import {regressionLine} from "./charts/RegressionLine.tsx";
import {HoverHint} from "./charts/HoverHint.tsx";
import { HelpCircle } from "lucide-react";

const ROUTES = ROUTES_DATA as Route[];

type ScatterShapeProps = Pick<RouteDotProps, "cx" | "cy" | "payload">;

export default function App() {
  const [hoveredRoute,     setHoveredRoute]     = useState<string | null>(null);
  const hoveredData = ROUTES.find(r => r.route === hoveredRoute) ?? null;
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set(CATEGORIES.map(c => c.name)),
  );

  const toggleCategory = (name: string) => setActiveCategories(prev => {
    const next = new Set(prev);
    if (next.has(name)) { if (next.size > 1) next.delete(name); }
    else next.add(name);
    return next;
  });

  const lowFrequencyRoutes  = ROUTES.filter(route => route.freq === "low"  && route.punctuality != null);
  const highFrequencyRoutes = ROUTES.filter(route => route.freq === "high" && route.ewt        != null);
  const regularRoutes       = lowFrequencyRoutes.filter(route => route.type !== "express");

  const stopsRegression = linearRegression(regularRoutes,       "stops", "punctuality");
  const timeRegression  = linearRegression(regularRoutes,       "time",  "punctuality");
  const ewtRegression   = linearRegression(highFrequencyRoutes, "stops", "ewt");

  const filteredRoutes            = lowFrequencyRoutes.filter(route => activeCategories.has(categoryName(route.time)));
  const shortRoutes               = regularRoutes.filter(route => route.time <= 40);
  const longRoutes                = regularRoutes.filter(route => route.time >= 65);
  const shortRoutesAvgPunctuality = shortRoutes.reduce((acc, route) => acc + (route.punctuality ?? 0), 0) / (shortRoutes.length || 1);
  const longRoutesAvgPunctuality  = longRoutes.reduce((acc, route) => acc + (route.punctuality ?? 0), 0) / (longRoutes.length || 1);

  const dotShape = useCallback(
    (props: unknown) => { const p = props as ScatterShapeProps; return <RouteDot cx={p.cx} cy={p.cy} payload={p.payload} hovered={hoveredRoute} onHover={setHoveredRoute} />; },
    [hoveredRoute],
  );

  const expressRoutes = ROUTES.filter(route => route.type === "express" && route.punctuality != null);
  const expressAvg    = (expressRoutes.reduce((acc, route) => acc + (route.punctuality ?? 0), 0) / expressRoutes.length).toFixed(1);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans py-9 px-5 pb-20">
      <div className="max-w-250 mx-auto">

        {/* Header */}
        <div className="text-xs text-slate-600 uppercase tracking-widest mb-2.5">Data Analysis</div>
        <h1 className="text-4xl font-extrabold mt-0 mb-3 text-slate-50 leading-[1.15]">
          The Longer the Route, the Later the Bus
        </h1>
        <p className="text-base text-slate-400 mt-0 mb-5 leading-relaxed">
          An analysis of {ROUTES.length} Dublin Bus routes using official NTA performance data (Q3 2023 to Q2 2025).
          Some routes have since been replaced under BusConnects, but the data captures the network as it operated during the reporting period.
        </p>

        {/* Hypothesis */}
        <div
          className="bg-blue-950 rounded-xl py-5 px-6 mb-7 gap-4"
          style={{ border: "1px solid #1e3a5f" }}
        >
          <div className="flex items-center gap-2 text-base font-bold text-blue-200 mb-1.5">
            <HelpCircle size={17} />
            Hypothesis
          </div>
          <p className="m-0 text-sm text-blue-300 leading-[1.7]">
            Routes with more stops and longer running times accumulate delay at every stop, resulting in significantly
            worse punctuality.
            In 2017, the NTA hired{" "}
            <a href="https://jarrettwalker.com/dublin-area-bus-network-redesign/" target="_blank" rel="noopener" style={{ color: "#60a5fa", textDecoration: "none", borderBottom: "1px dotted #60a5fa" }}>Jarrett Walker + Associates</a>
            {" "}to redesign Dublin's bus network around long cross-city "spine" routes, betting that high frequency and planned{" "}
            <a href="https://busconnects.ie/cities/dublin/new-dublin-area-bus-network/" target="_blank" rel="noopener" style={{ color: "#60a5fa", textDecoration: "none", borderBottom: "1px dotted #60a5fa" }}>bus priority lanes</a>
            {" "}would offset any reliability cost. The bus lanes are{" "}
            <a href="https://en.wikipedia.org/wiki/BusConnects" target="_blank" rel="noopener" style={{ color: "#60a5fa", textDecoration: "none", borderBottom: "1px dotted #60a5fa" }}>years behind schedule</a>
            {" "}and the new routes are already experiencing punctuality problems. Does the data support the long-route approach?
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-3 flex-wrap mb-7">
          <StatCard label="Correlation (r)"  value={timeRegression.r.toFixed(2)}                                    sub="Running time vs punctuality"                       color="#ef4444" />
          <StatCard label="Short routes"     value={shortRoutesAvgPunctuality.toFixed(1) + "%"}                     sub={`${shortRoutes.length} routes, 40 min or less`}        color="#4ade80" />
          <StatCard label="Long routes"      value={longRoutesAvgPunctuality.toFixed(1) + "%"}                      sub={`${longRoutes.length} routes, 65 min or more`}           color="#f87171" />
          <StatCard label="Gap"              value={(shortRoutesAvgPunctuality - longRoutesAvgPunctuality).toFixed(1) + "pp"} sub="Percentage point difference"              color="#fbbf24" />
        </div>

        <MethodNote />

        {/* Category filter */}
        <div className="bg-slate-900 rounded-xl py-4 px-5 border border-slate-800 mb-4">
          <div className="text-xs text-slate-400 mb-2.5">
            Routes are grouped into four categories based on <strong className="text-slate-200">quartiles of scheduled running time</strong> across the dataset (Q1 = 40 min, median = 50 min, Q3 = 65 min):
          </div>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(category => (
              <span key={category.name} className="flex items-center gap-1.5 text-sm">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: category.color }} />
                <span className="font-bold" style={{ color: category.color }}>{category.name}</span>
                <span className="text-slate-500">{category.range}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 md:gap-2 mb-7 items-center">
          <span className="text-xs text-slate-600 mr-1">Filter:</span>
          {CATEGORIES.map(category => {
            const active = activeCategories.has(category.name);
            return (
              <button key={category.name} onClick={() => toggleCategory(category.name)} style={{
                background: active ? category.color + "1a" : "transparent",
                border: `1px solid ${active ? category.color : "#334155"}`,
                color: active ? category.color : "#64748b",
                borderRadius: 6, padding: "5px 14px",
                cursor: "pointer", transition: "all .15s",
              }} className="text-xs font-semibold">{category.name}</button>
            );
          })}
        </div>

        {/* Charts */}
        <Section
          title="1. Stop Count vs Punctuality"
          subtitle={`Low frequency routes. r = ${stopsRegression.r.toFixed(3)}. Every 10 extra stops costs ~${Math.abs(stopsRegression.slope * 10).toFixed(1)} percentage points.`}
        >
          <ChartLegend />
          <div className="relative">
            <HoverHint />
            <ResponsiveContainer width="100%" height={560}>
              <ComposedChart margin={{ top: 24, right: 28, bottom: 48, left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="stops" type="number" stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 12 }} domain={[10, 68]}>
                  <Label value="Number of Stops" position="bottom" offset={28} style={{ fill: "#64748b", fontSize: 13 }} />
                </XAxis>
                <YAxis dataKey="punctuality" type="number" stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 12 }} domain={[48, 95]}>
                  <Label value="Punctuality (%)" angle={-90} position="insideLeft" offset={8} style={{ fill: "#64748b", fontSize: 13 }} />
                </YAxis>
                <Tooltip content={() => <RouteTooltip route={hoveredData} />} offset={20} cursor={false} />
                {regressionLine({ data: regularRoutes, xKey: "stops", yKey: "punctuality", xMin: 14, xMax: 66 })}
                {CATEGORIES.map(category => {
                  const routesInCategory = filteredRoutes.filter(route => categoryName(route.time) === category.name);
                  return routesInCategory.length ? <Scatter key={category.name} data={routesInCategory} fill={category.color} shape={dotShape} /> : null;
                })}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section
          title="2. Running Time vs Punctuality"
          subtitle={`Strongest correlation: r = ${timeRegression.r.toFixed(3)}. Every 10 extra minutes costs ~${Math.abs(timeRegression.slope * 10).toFixed(1)}pp. Express routes excluded from regression.`}
        >
          <ChartLegend />
          <div className="relative">
            <HoverHint />
            <ResponsiveContainer width="100%" height={560}>
              <ComposedChart margin={{ top: 24, right: 28, bottom: 48, left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" type="number" stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 12 }} domain={[20, 88]}>
                  <Label value="Scheduled Running Time (min)" position="bottom" offset={28} style={{ fill: "#64748b", fontSize: 13 }} />
                </XAxis>
                <YAxis dataKey="punctuality" type="number" stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 12 }} domain={[48, 95]}>
                  <Label value="Punctuality (%)" angle={-90} position="insideLeft" offset={8} style={{ fill: "#64748b", fontSize: 13 }} />
                </YAxis>
                <Tooltip content={() => <RouteTooltip route={hoveredData} />} offset={20} cursor={false} />
                {regressionLine({ data: regularRoutes, xKey: "time", yKey: "punctuality", xMin: 22, xMax: 80 })}
                {CATEGORIES.map(category => {
                  const routesInCategory = filteredRoutes.filter(route => categoryName(route.time) === category.name);
                  return routesInCategory.length ? <Scatter key={category.name} data={routesInCategory} fill={category.color} shape={dotShape} /> : null;
                })}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section
          title="3. Stop Count vs Excess Wait Time (High Frequency Routes)"
          subtitle={`These 16 routes run every 12 min or better. Punctuality = extra minutes you wait beyond schedule. r = ${ewtRegression.r.toFixed(3)}. All are in the top ridership tier.`}
        >
          <ChartLegend />
          <div className="relative">
            <HoverHint />
            <ResponsiveContainer width="100%" height={500}>
              <ComposedChart margin={{ top: 24, right: 28, bottom: 48, left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="stops" type="number" stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 12 }} domain={[24, 70]}>
                  <Label value="Number of Stops" position="bottom" offset={28} style={{ fill: "#64748b", fontSize: 13 }} />
                </XAxis>
                <YAxis dataKey="ewt" type="number" stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 12 }} domain={[0.4, 3.0]}>
                  <Label value="Excess Wait Time (min)" angle={-90} position="insideLeft" offset={8} style={{ fill: "#64748b", fontSize: 13 }} />
                </YAxis>
                <Tooltip content={() => <RouteTooltip route={hoveredData} />} offset={20} cursor={false} />
                {regressionLine({ data: highFrequencyRoutes, xKey: "stops", yKey: "ewt", xMin: 26, xMax: 68 })}
                <Scatter data={highFrequencyRoutes} fill={CATEGORY_MAP["Long"].color} shape={dotShape} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section
          title="4. Punctuality by Route Duration Category"
          subtitle="Routes grouped by quartiles of scheduled running time (Q1 = 40 min, median = 50 min, Q3 = 65 min). Click any category to expand. Regular (non-express) low frequency routes only."
        >
          <CategoryBreakdown data={regularRoutes} expanded={expandedCategory} setExpanded={setExpandedCategory} />
        </Section>

        {/* Context */}
        <div className="bg-slate-900 rounded-2xl p-7 border border-slate-800 mt-2">
          <h3 className="mt-0 mb-4.5 text-xl font-extrabold text-slate-50">Context: The BusConnects Trade-off</h3>
          <p className="mt-0 mb-4 text-sm text-slate-400 leading-7">
            The BusConnects redesign deliberately built the new network around long cross-city spine routes (C-spine, E-spine, F-spine). The{" "}
            <a href="https://humantransit.org/dublinbus" target="_blank" rel="noopener" style={{ color: "#60a5fa", textDecoration: "none", borderBottom: "1px dotted #60a5fa" }}>design rationale</a>
            {" "}was to simplify the network into a legible grid, increase frequency, and create cross-city connectivity. The accepted trade-off: longer routes would be less reliable, but planned{" "}
            <a href="https://busconnects.ie/cities/dublin/new-dublin-area-bus-network/" target="_blank" rel="noopener" style={{ color: "#60a5fa", textDecoration: "none", borderBottom: "1px dotted #60a5fa" }}>Core Bus Corridors</a>
            {" "}with dedicated bus lanes would fix that.
          </p>
          <p className="mt-0 mb-4 text-sm text-slate-400 leading-7">
            The bus corridors are years behind schedule, with construction only just beginning on the first one. Meanwhile, the{" "}
            <a href="https://www.rte.ie/news/ireland/2026/0208/1557367-busconnects-dublin/" target="_blank" rel="noopener" style={{ color: "#60a5fa", textDecoration: "none", borderBottom: "1px dotted #60a5fa" }}>Phase 7 F-spine launch in October 2025</a>
            {" "}was met with protests over severe delays. By February 2026, the{" "}
            <a href="https://www.nationaltransport.ie/news/busconnects-phase-7-amendments-to-take-effect-from-8-february/" target="_blank" rel="noopener" style={{ color: "#60a5fa", textDecoration: "none", borderBottom: "1px dotted #60a5fa" }}>NTA had to amend routes 23, 24 and 80</a>
            , acknowledging reliability issues from traffic congestion on new city centre alignments. Even the NTA's own{" "}
            <a href="https://busconnects.ie/wp-content/uploads/2022/02/fullreport_appendix.pdf" target="_blank" rel="noopener" style={{ color: "#60a5fa", textDecoration: "none", borderBottom: "1px dotted #60a5fa" }}>2019 revised proposal</a>
            {" "}had already recognised that long distance "limited the cross-city potential" of the D-spine and split it into a separate route.
          </p>
          <p className="m-0 text-sm text-slate-400 leading-7">
            Cross-city routes work well for transport modes with their own infrastructure.{" "}
            <a href="https://socio.health/urbanization-and-urban-development-challenges/urban-mass-transit-choosing-right-mode/" target="_blank" rel="noopener" style={{ color: "#60a5fa", textDecoration: "none", borderBottom: "1px dotted #60a5fa" }}>Metro and rail systems operate independently of street congestion</a>.{" "}
            <a href="https://bathtrams.uk/4-why-trams-are-essential-to-improve-city-productivity/" target="_blank" rel="noopener" style={{ color: "#60a5fa", textDecoration: "none", borderBottom: "1px dotted #60a5fa" }}>Trams with dedicated lanes maintain consistent schedules</a>
            {" "}through signal pre-emption. Buses sharing road space with general traffic have limited access to these protections. Some routes benefit from signal priority, but across the network most buses are exposed to every red light, double-parked car, and traffic incident. Running a cross-city operating model on a mode without consistent dedicated infrastructure is a structural mismatch.
          </p>
        </div>

        {/* Conclusions */}
        <div
          className="rounded-2xl p-7 border border-slate-700 mt-5"
          style={{ background: "linear-gradient(135deg,#1e293b,#0f172a)" }}
        >
          <h3 className="mt-0 mb-4.5 text-xl font-extrabold text-slate-50">Conclusions</h3>
          <p className="mt-0 mb-4 text-sm text-slate-400 leading-7">
            <strong style={{ color: "#f87171" }}>The long-route model is not delivering reliable service.</strong> The correlation between route duration and poor punctuality (r = {timeRegression.r.toFixed(2)}) is strong, consistent, and holds across every part of the dataset. Short routes (40 min or less) average {shortRoutesAvgPunctuality.toFixed(1)}% punctuality. Long routes (65 min or more) average {longRoutesAvgPunctuality.toFixed(1)}%. That is an {(shortRoutesAvgPunctuality - longRoutesAvgPunctuality).toFixed(1)} percentage point gap.
          </p>
          <p className="mt-0 mb-4 text-sm text-slate-400 leading-7">
            <strong className="text-slate-200">Stops, not distance, are the primary driver.</strong> Express routes cover 18–28 km but average{" "}
            <strong style={{ color: "#4ade80" }}>{expressAvg}%</strong> punctuality by skipping most stops. Every stop introduces compounding variability through dwell time, traffic signals, and the constant decelerate-stop-accelerate cycle. On routes like the C4, stops are packed every 350m (below{" "}
            <a href="https://humantransit.org/2010/11/san-francisco-a-rational-stop-spacing-plan.html" target="_blank" rel="noopener" style={{ color: "#60a5fa", textDecoration: "none", borderBottom: "1px dotted #60a5fa" }}>the 400m standard</a>
            ), meaning the bus never reaches a continuous cruising speed.
          </p>
          <p className="mt-0 mb-4 text-sm text-slate-400 leading-7">
            <strong className="text-slate-200">Long routes are structurally fragile.</strong> A single disruption cascades across the entire line. Every passenger suffers, not just those near the problem. Shorter routes with good interchange points contain disruptions to one segment. The rest of the network keeps running, and passengers can reroute at the transfer.
          </p>
          <p className="m-0 text-sm text-slate-400 leading-7">
            <strong className="text-slate-200">A network of shorter routes could push the whole system closer to 80%+ punctuality.</strong> The data shows that reliability does not degrade gradually: it holds reasonably well up to about 40 minutes, then drops sharply. A network designed primarily around routes of 30 minutes or less, with well-timed interchange points, would keep most routes in the high-reliability zone. The same buses, drivers, and budget could deliver a fundamentally more dependable service.
          </p>
        </div>

        <DiscussionSection />

        {/* Disclaimer */}
        <div className="bg-slate-900 rounded-xl py-5 px-6 border border-slate-800 mt-5">
          <h4 className="mt-0 mb-2.5 text-base font-bold text-slate-100">Disclaimer</h4>
          <p className="mt-0 mb-2.5 text-sm text-slate-400 leading-relaxed">
            This analysis was created by{" "}
            <a href="https://illi.ie" target="_blank" rel="noopener" style={{ color: "#60a5fa", textDecoration: "none", borderBottom: "1px dotted #60a5fa" }}>David Illichmann</a>
            {" "}with the assistance of AI tools (Claude by Anthropic). While the punctuality data comes from official NTA sources, the route characteristics (stop counts, running times, distances) represent current schedules and may not perfectly match all periods in the reporting window (Q3 2023 to Q2 2025), as BusConnects was actively changing routes during this time. The analysis may contain errors introduced during AI-assisted data processing. All claims should be verified against primary sources before citing.
          </p>
          <p className="mt-0 mb-2.5 text-sm text-slate-400 leading-relaxed">
            I am not a transport planner or public transit expert. I come from the Czech Republic, where I have used well-functioning bus networks in multiple cities, and the issues highlighted here are the most obvious things I notice as a Dublin Bus passenger. This is not an academic paper. It is a data-driven observation intended as a conversation starter for passengers and decision-makers alike.
          </p>
          <p className="m-0 text-sm text-slate-400 leading-relaxed">
            If you work in transport planning, have corrections, or want to collaborate on a more rigorous follow-up, I would welcome the conversation.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-9 pt-5 border-t border-slate-800 text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-500">Data sources:</strong>{" "}
          <a href="https://www.nationaltransport.ie/publications/dublin-bus-quarterly-and-annual-performance-report/" target="_blank" rel="noopener" className="text-slate-600 underline">NTA Performance Reports</a>
          {" "}Q3 2023 to Q2 2025 | Route characteristics from{" "}
          <a href="https://developer.nationaltransport.ie/" target="_blank" rel="noopener" className="text-slate-600 underline">NTA GTFS static schedules</a>
          {" "}and{" "}
          <a href="https://bustimes.org/operators/dublin-bus" target="_blank" rel="noopener" className="text-slate-600 underline">bustimes.org</a>
          {" "}| Ridership from{" "}
          <a href="https://www.tapatalk.com/groups/irishtransport/dublin-bus-top-10-busiest-routes-jan-feb-2024-t20965.html" target="_blank" rel="noopener" className="text-slate-600 underline">NTA top 10 busiest routes</a>
          {" "}(Jan/Feb 2024) | Punctuality = % of departures within -1 to +5:59 min of schedule | EWT = average extra minutes waiting beyond scheduled headway | Route lengths (km) are approximate
        </div>

      </div>
    </div>
  );
}
