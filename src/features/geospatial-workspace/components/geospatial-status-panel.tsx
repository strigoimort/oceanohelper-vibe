const statusItems = [
  { label: "Latitude", value: "00.0000" },
  { label: "Longitude", value: "000.0000" },
  { label: "Zoom", value: "2" },
];

export default function GeospatialStatusPanel() {
  return (
    <div className="flex h-full items-center justify-between overflow-x-autoscrolls">
      {statusItems.map((item) => (
        <div key={item.label} className="flex flex-col">
          <span className="text-md  text-slate-400">{item.label}</span>
          <span className="mt-1 font-semibold text-slate-900">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
