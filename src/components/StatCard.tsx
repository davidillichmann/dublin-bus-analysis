interface Props {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}

export default function StatCard({ label, value, sub, color }: Props) {
  return (
    <div className="bg-slate-800 rounded-xl py-4 px-5 border border-slate-700 flex-1 basis-40">
      <div className="text-xs text-slate-500 uppercase tracking-widest mb-1.5 font-semibold">
        {label}
      </div>
      <div className="text-3xl font-extrabold font-mono" style={{ color: color ?? "#f1f5f9" }}>
        {value}
      </div>
      {sub && <div className="text-xs text-slate-600 mt-1">{sub}</div>}
    </div>
  );
}
