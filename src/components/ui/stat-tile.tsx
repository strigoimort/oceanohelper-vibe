import { cn } from "../../utils/class-names";

type StatTileProps = {
  label: string;
  value: string | number;
  hint?: string;
  active?: boolean;
};

export default function StatTile({
  label,
  value,
  hint,
  active = false,
}: StatTileProps) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-xl p-3",
        active ? "bg-accent-soft ring-1 ring-accent/30" : "bg-slate-50",
      )}
    >
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={cn(
          "mt-1 truncate text-lg font-semibold",
          active ? "text-accent" : "text-ink",
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-0.5 truncate text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
