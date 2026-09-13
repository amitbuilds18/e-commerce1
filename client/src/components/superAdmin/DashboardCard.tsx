import type { ReactNode } from "react";

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: string;
  color?: string;
  gradient?: string;
};

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  gradient = "from-purple-600 to-indigo-600",
}: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition duration-200 relative overflow-hidden group">
      {/* Subtle top gradient bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradient}`}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            {value}
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>

        {icon && (
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${gradient} text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition duration-200 shrink-0`}
          >
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs">
          <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
            {trend}
          </span>
          <span className="text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  );
}