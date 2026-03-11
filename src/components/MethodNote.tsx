import { useState } from "react";
import {ChevronDown, Ruler} from "lucide-react";

export default function MethodNote() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 mb-7 overflow-hidden">
      <div
        onClick={() => setOpen(!open)}
        className="py-3.5 px-5 cursor-pointer flex flex-col md:flex-row md:justify-between gap-0.5 select-none"
      >
        <div className="font-bold text-slate-100 text-md flex items-center gap-1.5 mb-2 md:m-0"><Ruler size={18} /> How to read these charts</div>
        <div className="flex items-center">
          <span className="text-sm text-slate-500">Methodology and data sources</span>
          <ChevronDown
            size={13}
            className="text-slate-500 transition-transform duration-200 ml-2"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </div>
      </div>

      {open && (
        <div className="px-5 pb-5 border-t border-slate-800">
          <div
            className="grid gap-4 mt-4"
            style={{ gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}
          >
            <div className="bg-slate-800 rounded-lg p-4">
              <h4 className="mt-0 mb-2 text-md text-slate-100 font-bold">What is r (correlation)?</h4>
              <p className="m-0 text-sm text-slate-200 leading-relaxed">
                The Pearson correlation coefficient (r) measures how strongly two variables are linearly related,
                on a scale from -1 to +1. A value of -1 means a perfect inverse relationship (as one goes up,
                the other goes down consistently). Zero means no relationship. The closer to -1 or +1, the
                tighter the data clusters around the trend line.{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Pearson_correlation_coefficient"
                  target="_blank"
                  rel="noopener"
                  style={{ color: "#60a5fa", textDecoration: "none", borderBottom: "1px dotted #60a5fa" }}
                >
                  Learn more about correlation
                </a>
              </p>
              <div className="mt-2.5 flex gap-2 flex-wrap">
                {([ ["0.10", "Small", "#94a3b8"], ["0.30", "Medium", "#fbbf24"], ["0.50+", "Large", "#ef4444"] ] as const).map(([v, l, c]) => (
                  <span
                    key={v}
                    className="text-xs py-0.5 px-2 rounded font-mono"
                    style={{ border: `1px solid ${c}44`, color: c }}
                  >
                    |r| = {v}: {l}
                  </span>
                ))}
              </div>
              <p className="mt-2 mb-0 text-xs text-slate-400 leading-relaxed">
                Thresholds from Cohen, J. (1988). Statistical Power Analysis for the Behavioral Sciences.
                The red regression line in each chart is fitted to regular (non-express) low frequency routes only.
                Express routes are shown but excluded from the trend, as they behave differently (few stops, long distance).
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-4">
              <h4 className="mt-0 mb-2 text-md text-slate-100 font-bold">How is punctuality measured?</h4>
              <p className="m-0 text-sm text-slate-400 leading-relaxed">
                <strong className="text-slate-200">Low frequency routes</strong> (running less than 5x per hour):
                punctuality is the percentage of departures that leave between 1 minute early and 5 minutes 59 seconds
                late compared to the schedule. A bus departing 6+ minutes late counts as not on time.
              </p>
              <p className="mt-2 mb-0 text-sm text-slate-400 leading-relaxed">
                <strong className="text-slate-200">High frequency routes</strong> (every 12 min or better):
                Excess Wait Time (EWT) measures the extra minutes you wait beyond what the schedule would predict.
                If buses ran perfectly to schedule, EWT would be 0. An EWT of 2.0 means you wait on average 2 extra minutes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
