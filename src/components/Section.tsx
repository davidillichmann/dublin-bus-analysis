import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function Section({ title, subtitle, children }: Props) {
  return (
    <div className="bg-slate-900 rounded-2xl pt-7 px-6 pb-5 border border-slate-800 mb-7">
      <h3 className="mt-0 mb-1 text-lg font-bold text-slate-100">{title}</h3>
      {subtitle && (
        <p className="mt-0 mb-5 text-sm text-slate-500 leading-relaxed">{subtitle}</p>
      )}
      {children}
    </div>
  );
}
