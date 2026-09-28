type StatTileProps = {
  label: string;
  value: string | number;
  hint?: string;
};

export default function StatTile({ label, value, hint }: StatTileProps) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 truncate text-lg font-semibold text-ink">{value}</p>
      {hint && <p className="mt-0.5 truncate text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
