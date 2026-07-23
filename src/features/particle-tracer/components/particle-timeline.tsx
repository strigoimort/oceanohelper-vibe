import { Pause, Play, SkipBack, SkipForward, Square } from "lucide-react";

import { PLAYBACK_SPEED_OPTIONS } from "../../../constants/particle-tracer";

type ParticleTimelineProps = {
  currentTime: number;
  frameIndex: number;
  maxIndex: number;
  isPlaying: boolean;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSeek: (index: number) => void;
  disabled: boolean;
  hasDatasets: boolean;
};

export default function ParticleTimeline({
  currentTime,
  frameIndex,
  maxIndex,
  isPlaying,
  speed,
  onSpeedChange,
  onPlay,
  onPause,
  onStop,
  onStepForward,
  onStepBackward,
  onSeek,
  disabled,
  hasDatasets,
}: ParticleTimelineProps) {
  const label = !hasDatasets
    ? "No dataset loaded"
    : disabled
      ? "Single time point — nothing to animate"
      : new Date(currentTime).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC",
          timeZoneName: "short",
        });

  return (
    <div className="flex h-full items-center gap-4 border-t border-slate-200 bg-white px-6">
      <div className="flex items-center gap-1">
        <button
          type="button"
          title="Previous frame"
          onClick={onStepBackward}
          disabled={disabled}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SkipBack size={16} />
        </button>

        <button
          type="button"
          title={isPlaying ? "Pause" : "Play"}
          onClick={isPlaying ? onPause : onPlay}
          disabled={disabled}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <button
          type="button"
          title="Stop"
          onClick={onStop}
          disabled={disabled}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Square size={16} />
        </button>

        <button
          type="button"
          title="Next frame"
          onClick={onStepForward}
          disabled={disabled}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SkipForward size={16} />
        </button>
      </div>

      <input
        type="range"
        min={0}
        max={maxIndex}
        value={frameIndex}
        disabled={disabled}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="h-1.5 flex-1 accent-sky-600 disabled:opacity-40"
      />

      <span className="w-56 shrink-0 text-right text-xs font-medium text-slate-600">
        {label}
      </span>

      <select
        value={speed}
        disabled={disabled}
        onChange={(e) => onSpeedChange(Number(e.target.value))}
        className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 disabled:opacity-40"
      >
        {PLAYBACK_SPEED_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}x
          </option>
        ))}
      </select>
    </div>
  );
}
