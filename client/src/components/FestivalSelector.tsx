import { festivities, type Festivity } from "@/lib/festivities";
import type { GameProgress } from "@/lib/progress";
import { getFestivityProgress } from "@/lib/progress";
import { StickerIcon, getFestivityIcon } from "./StickerIcon";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface FestivalSelectorProps {
  selectedId: string;
  onSelect: (festivity: Festivity) => void;
  progress: GameProgress;
}

export function FestivalSelector({ selectedId, onSelect, progress }: FestivalSelectorProps) {
  return (
    <div className="flex flex-col gap-1" data-testid="festival-selector">
      <h3 className="text-sm font-bold mb-1 text-foreground px-1">Festivities</h3>
      {festivities.map((fest) => {
        const fp = getFestivityProgress(progress, fest.id);
        const isSelected = selectedId === fest.id;
        const icon = getFestivityIcon(fest.id);

        return (
          <button
            key={fest.id}
            onClick={() => onSelect(fest)}
            className={`flex items-center gap-2 px-2 py-2 rounded-md text-left transition-all w-full ${
              isSelected
                ? "bg-primary/10 border border-primary/30"
                : "hover-elevate"
            }`}
            data-testid={`festival-${fest.id}`}
          >
            <StickerIcon iconName={icon} color={fest.color} size={28} />
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
      <div className="mt-2 px-1">
        <Badge variant="secondary" className="text-[10px]">
          {progress.totalQuizzesCompleted}/9 Quizzes
        </Badge>
      </div>
    </div>
  );
}
