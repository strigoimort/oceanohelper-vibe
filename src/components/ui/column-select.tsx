type ColumnSelectProps = {
  label: string;
  headers: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  allowEmpty?: boolean;
};

export default function ColumnSelect({
  label,
  headers,
  value,
  onChange,
  allowEmpty,
}: ColumnSelectProps) {
  return (
    <label className="block text-xs font-medium text-slate-500">
      {label}
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-accent focus:outline-none"
      >
        {allowEmpty && <option value="">— None —</option>}
        {!allowEmpty && !value && <option value="">Select column…</option>}
        {headers.map((header) => (
          <option key={header} value={header}>
            {header}
          </option>
        ))}
      </select>
    </label>
  );
}
