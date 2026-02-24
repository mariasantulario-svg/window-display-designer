import type { DecorativeElement } from "@/lib/festivities";
import type { PlacedElement } from "@/lib/progress";
import { StickerIcon } from "./StickerIcon";
import { Lock } from "lucide-react";
import { MAX_ELEMENT_COPIES, countElementInDisplay } from "@/lib/progress";
import { Badge } from "@/components/ui/badge";

interface ElementItemProps {
  element: DecorativeElement;
  isUnlocked: boolean;
  copyCount: number;
  onAdd: () => void;
}

function ElementItem({ element, isUnlocked, copyCount, onAdd }: ElementItemProps) {
  const isAvailable = !element.locked || isUnlocked;
  const atLimit = copyCount >= MAX_ELEMENT_COPIES;

  return (
    <button
      onClick={isAvailable ? onAdd : undefined}
      disabled={!isAvailable}
      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all bg-card/40 ${
        isAvailable
          ? atLimit
            ? "opacity-60 cursor-default"
            : "cursor-pointer hover-elevate active-elevate-2"
          : "opacity-40 cursor-not-allowed grayscale"
      }`}
      data-testid={`element-${element.id}`}
    >
      <div className="relative">
        <StickerIcon imagePath={element.imagePath} name={element.name} size={60} />
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-xl">
            <Lock className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
      </div>
      <span className="text-[10px] text-center leading-tight max-w-[80px] font-medium" data-testid={`element-name-${element.id}`}>
        {element.name}
      </span>
      <div className="flex flex-col items-center gap-0.5">
        <div className="flex gap-0.5">
          {Array.from({ length: MAX_ELEMENT_COPIES }).map((_, index) => {
            const used = index < copyCount;
            return (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-full border ${
                  used ? "bg-primary/40 border-primary/70" : "bg-background border-border/60"
                }`}
              />
            );
          })}
        </div>
        {isAvailable && (
          <Badge variant="secondary" className="text-[8px] px-1 py-0 mt-0.5">
            {copyCount}/{MAX_ELEMENT_COPIES}
          </Badge>
        )}
      </div>
    </button>
  );
}

interface ElementPanelProps {
  baseElements: DecorativeElement[];
  lockedElements: DecorativeElement[];
  unlockedIds: string[];
  onQuizOpen: () => void;
  quizCompleted: boolean;
  onAddElement: (element: DecorativeElement) => void;
  placedElements: PlacedElement[];
}

export function ElementPanel({
  baseElements,
  lockedElements,
  unlockedIds,
  onQuizOpen,
  quizCompleted,
  onAddElement,
  placedElements,
}: ElementPanelProps) {
  return (
    <div className="flex flex-col gap-3" data-testid="element-panel">
      <div>
        <h3 className="text-xs font-bold mb-2 text-foreground uppercase tracking-wide">Base Items</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {baseElements.map((el) => (
            <ElementItem
              key={el.id}
              element={el}
              isUnlocked={true}
              copyCount={countElementInDisplay(placedElements, el.id)}
              onAdd={() => onAddElement(el)}
            />
          ))}
        </div>
      </div>

      <div className="border-t pt-3">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Bonus Items</h3>
          {!quizCompleted ? (
            <button
              onClick={onQuizOpen}
              className="text-[10px] px-2 py-1 rounded-md bg-primary text-primary-foreground font-bold"
              data-testid="button-take-quiz-panel"
            >
              Take Quiz!
            </button>
          ) : (
            <button
              onClick={onQuizOpen}
              className="text-[10px] px-2 py-1 rounded-md bg-secondary text-secondary-foreground font-bold"
              data-testid="button-retake-quiz"
            >
              Retake Quiz
            </button>
          )}
        </div>
        {quizCompleted && unlockedIds.length < lockedElements.length && (
          <p className="text-[10px] text-muted-foreground mb-2">
            Score higher to unlock more items!
          </p>
        )}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {lockedElements.map((el) => (
            <ElementItem
              key={el.id}
              element={el}
              isUnlocked={unlockedIds.includes(el.id)}
              copyCount={countElementInDisplay(placedElements, el.id)}
              onAdd={() => onAddElement(el)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
