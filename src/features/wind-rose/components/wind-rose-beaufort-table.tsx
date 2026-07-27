import { BEAUFORT_SCALE } from "../../../constants/wind-rose";

type WindRoseBeaufortTableProps = {
  mode: "wind" | "wave";
};

export default function WindRoseBeaufortTable({
  mode,
}: WindRoseBeaufortTableProps) {
  if (mode !== "wind") return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">
        Beaufort Scale reference
      </h3>
      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Range (m/s)</th>
            </tr>
          </thead>
          <tbody>
            {BEAUFORT_SCALE.map((entry) => (
              <tr key={entry.number} className="border-t border-slate-100">
                <td className="px-3 py-2 font-medium text-slate-900">
                  {entry.number}
                </td>
                <td className="px-3 py-2">{entry.label}</td>
                <td className="px-3 py-2">
                  {entry.maxSpeed === Number.POSITIVE_INFINITY
                    ? `≥ ${entry.minSpeed}`
                    : `${entry.minSpeed}–${entry.maxSpeed}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
