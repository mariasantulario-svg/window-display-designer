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
  const [localProgress, setLocalProgress] = React.useState(0);
  const scrubbingRef = React.useRef(false);
  const squeegeeCursor =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18'><rect x='1' y='11' width='16' height='4' fill='%23007acc' rx='1' ry='1'/><rect x='7' y='1' width='4' height='10' fill='%23ffffff' stroke='%23007acc' stroke-width='1.2'/></svg>\") 8 16, crosshair";

  React.useEffect(() => {
    if (!cleaningMode) {
      setLocalProgress(0);
      onCleaningProgress(0);
    }
  }, [cleaningMode, festivityId, season, onCleaningProgress]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cleaningMode) return;
    scrubbingRef.current = true;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cleaningMode) return;
    scrubbingRef.current = false;
    (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cleaningMode || !scrubbingRef.current) return;
    // Increase progress a bit on each scrub movement.
    setLocalProgress((prev) => {
      const next = Math.min(100, prev + 3);
      onCleaningProgress(next);
      return next;
    });
  };

  return (
    <div
      className="absolute inset-0 z-[20]"
      style={{
        pointerEvents: cleaningMode ? "auto" : "none",
        cursor: cleaningMode ? squeegeeCursor : "default",
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      {/* Light dirt speckles that fade as cleaning progresses */}
      <svg
        className="w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ opacity: cleaningMode ? 1 - localProgress / 100 : 1 }}
      >
        <defs>
          <pattern id="glass-dirt" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="3" r="0.35" fill="rgba(120,120,120,0.12)" />
            <circle cx="7" cy="6" r="0.25" fill="rgba(80,80,80,0.10)" />
            <circle cx="5" cy="1" r="0.2" fill="rgba(150,150,150,0.08)" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="url(#glass-dirt)" />
      </svg>
    </div>
  );
}

