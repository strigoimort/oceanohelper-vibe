import { useState } from "react";
import { Compass } from "lucide-react";

export type ForecastSettings = {
  enabled: boolean;
  durationHours: number;
  intervalHours: number;
};

type ParticleForecastPanelProps = {
  settings: ForecastSettings;
  onChange: (settings: ForecastSettings) => void;
};

export default function ParticleForecastPanel({
  settings,
  onChange,
}: ParticleForecastPanelProps) {
  const [durationInput, setDurationInput] = useState(
    String(settings.durationHours),
  );

  const [intervalInput, setIntervalInput] = useState(
    String(settings.intervalHours),
  );

  return (
    <section className="border-t border-slate-100 pt-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          <Compass size={12} /> Forecast
        </h2>

        <button
          type="button"
          onClick={() => onChange({ ...settings, enabled: !settings.enabled })}
          className={`relative h-7 w-12 rounded-full transition-all duration-200 ease-in-out ${
            settings.enabled ? "bg-green-500" : "bg-[#e5e5ea]"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-all duration-200 ease-in-out ${
              settings.enabled ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>

      <p className="mt-1 text-xs text-slate-500">
        Projects the future position based on the last speed and direction of
        each particle (dead reckoning). Particles without speed/direction data
        will not be projected.
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <label className="block text-xs font-medium text-slate-500">
          Duration (hours)
          <input
            type="number"
            min={1}
            max={240}
            value={durationInput}
            disabled={!settings.enabled}
            onChange={(e) => {
              setDurationInput(e.target.value);
            }}
            onBlur={() => {
              let value = Number(durationInput);

              if (durationInput === "" || Number.isNaN(value)) {
                value = 24;
              }

              value = Math.min(240, Math.max(1, value));

              setDurationInput(String(value));
              onChange({
                ...settings,
                durationHours: value,
              });
            }}
            className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-800 focus:border-sky-500 focus:outline-none disabled:opacity-40"
          />
        </label>

        <label className="block text-xs font-medium text-slate-500">
          Interval (hours)
          <input
            type="number"
            min={1}
            max={48}
            value={intervalInput}
            disabled={!settings.enabled}
            onChange={(e) => {
              setIntervalInput(e.target.value);
            }}
            onBlur={() => {
              let value = Number(intervalInput);

              if (intervalInput === "" || Number.isNaN(value)) {
                value = 3;
              }

              value = Math.min(48, Math.max(1, value));

              setIntervalInput(String(value));
              onChange({
                ...settings,
                intervalHours: value,
              });
            }}
            className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-800 focus:border-sky-500 focus:outline-none disabled:opacity-40"
          />
        </label>
      </div>
    </section>
  );
}
