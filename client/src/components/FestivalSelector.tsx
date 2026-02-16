import { festivities, type Festivity } from "@/lib/festivities";
import type { GameProgress } from "@/lib/progress";
import { getFestivityProgress } from "@/lib/progress";
import { CheckCircle, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface FestivalSelectorProps {
  selectedId: string;
  onSelect: (festivity: Festivity) => void;
  progress: GameProgress;
}

export function FestivalSelector({ selectedId, onSelect, progress }: FestivalSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = festivities.find(f => f.id === selectedId) || festivities[0];
  const representativeImage = selected.baseElements[0]?.imagePath;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div ref={containerRef} className="relative" data-testid="festival-selector">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card hover-elevate transition-all"
        data-testid="festival-dropdown-trigger"
      >
        <img
          src={representativeImage}
          alt={selected.name}
          className="flex-shrink-0"
          style={{ width: 22, height: 22, objectFit: "contain" }}
          draggable={false}
        />
        <span className="text-sm font-bold truncate">{selected.name}</span>
        <span className="text-[10px] text-muted-foreground">{selected.month}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-md shadow-lg z-50 py-1 max-h-80 overflow-y-auto">
          {festivities.map((fest) => {
            const fp = getFestivityProgress(progress, fest.id);
            const isSelected = selectedId === fest.id;
            const img = fest.baseElements[0]?.imagePath;

            return (
              <button
                key={fest.id}
                onClick={() => {
                  onSelect(fest);
                  setOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 text-left transition-all w-full ${
                  isSelected
                    ? "bg-primary/10"
                    : "hover-elevate"
                }`}
                data-testid={`festival-${fest.id}`}
              >
                <img
                  src={img}
                  alt={fest.name}
                  className="flex-shrink-0"
                  style={{ width: 24, height: 24, objectFit: "contain" }}
                  draggable={false}
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold truncate">{fest.name}</span>
                  <span className="text-[10px] text-muted-foreground truncate">{fest.month}</span>
                </div>
                {fp.quizCompleted && (
                  <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
