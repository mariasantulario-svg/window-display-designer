import React from "react";

interface GlassOverlayProps {
  festivityId: string;
  season: string;
  cleaningMode: boolean;
  onCleaningProgress: (value: number) => void;
}

export function GlassOverlay({
  festivityId,
  season,
  cleaningMode,
  onCleaningProgress,
}: GlassOverlayProps) {
  // Placeholder implementation so build succeeds.
  React.useEffect(() => {
    if (!cleaningMode) return;
    let frame = 0;
    const interval = window.setInterval(() => {
      frame += 10;
      const value = Math.min(100, frame);
      onCleaningProgress(value);
      if (value >= 100) {
        window.clearInterval(interval);
      }
    }, 300);
    return () => window.clearInterval(interval);
  }, [cleaningMode, festivityId, season, onCleaningProgress]);

  if (!cleaningMode) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[20]">
      <div className="w-full h-full bg-white/8 backdrop-blur-[1px]" />
    </div>
  );
}

