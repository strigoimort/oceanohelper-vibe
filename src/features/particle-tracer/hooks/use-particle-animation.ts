import { useCallback, useEffect, useState } from "react";

import { DEFAULT_PLAYBACK_SPEED } from "../../../constants/particle-tracer";

// Real time (ms) between animation steps at 1x speed.
const FRAME_INTERVAL_MS = 500;

/** Drives playback (play/pause/stop/step/seek) across a timeline of timestamps. */
export function useParticleAnimation(timestamps: number[]) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_PLAYBACK_SPEED);
  // Stable fallback used only when no dataset has been imported yet.
  // Computed once via lazy initializer so it never triggers unstable
  // re-renders (Date.now() must never be called directly in render).
  const [fallbackTime] = useState(() => Date.now());

  const maxIndex = Math.max(timestamps.length - 1, 0);

  // Timelines can shrink (dataset removed/hidden) after `frameIndex` was
  // set to a higher value. Instead of correcting the state with a
  // setState-in-effect (which causes an extra cascading render), the
  // displayed index is simply clamped at render time.
  const clampedFrameIndex = Math.min(frameIndex, maxIndex);

  useEffect(() => {
    if (!isPlaying) return undefined;

    const intervalId = window.setInterval(() => {
      setFrameIndex((prev) => {
        const clampedPrev = Math.min(prev, maxIndex);
        if (clampedPrev >= maxIndex) {
          setIsPlaying(false);
          return clampedPrev;
        }
        return clampedPrev + 1;
      });
    }, FRAME_INTERVAL_MS / speed);

    return () => window.clearInterval(intervalId);
  }, [isPlaying, speed, maxIndex]);

  const play = useCallback(() => {
    if (maxIndex === 0) return;
    setFrameIndex((prev) => (prev >= maxIndex ? 0 : prev));
    setIsPlaying(true);
  }, [maxIndex]);

  const pause = useCallback(() => setIsPlaying(false), []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setFrameIndex(0);
  }, []);

  const stepForward = useCallback(() => {
    setIsPlaying(false);
    setFrameIndex((prev) => Math.min(prev + 1, maxIndex));
  }, [maxIndex]);

  const stepBackward = useCallback(() => {
    setIsPlaying(false);
    setFrameIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const seek = useCallback(
    (index: number) => {
      setIsPlaying(false);
      setFrameIndex(Math.min(Math.max(index, 0), maxIndex));
    },
    [maxIndex],
  );

  const currentTime = timestamps[clampedFrameIndex] ?? fallbackTime;

  return {
    frameIndex: clampedFrameIndex,
    maxIndex,
    currentTime,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause,
    stop,
    stepForward,
    stepBackward,
    seek,
  };
}
