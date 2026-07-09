const sections = [
  {
    title: "Layers",
    items: ["Base layer", "No active overlays"],
  },
  {
    title: "Measurements",
    items: ["Distance — None", "Area — None"],
  },
  {
    title: "Coordinates",
    items: ["Latitude — 00.0000", "Longitude — 000.0000"],
  },
  {
    title: "Selected object",
    items: ["None selected", "No object details"],
  },
  {
    title: "Import",
    items: ["No dataset loaded", "Supported: CSV, XLSX"],
  },
];

export default function GeospatialPropertiesPanel() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-slate-100 pb-3">
        <h1 className=" text-lg font-semibold text-slate-900">
          Workspace details
        </h1>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        {sections.map((section) => (
          <section
            key={section.title}
            className="flex min-h-0 flex-1 flex-col justify-center gap-1"
          >
            <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {section.title}
            </h2>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <p key={item} className="truncate text-sm text-slate-700">
                  {item}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
