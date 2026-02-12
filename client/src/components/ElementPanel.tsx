import { useDraggable } from "@dnd-kit/core";
import type { DecorativeElement } from "@/lib/festivities";
import { DoodleIcon } from "./DoodleSvgs";
import { Lock } from "lucide-react";

interface DraggableItemProps {
  element: DecorativeElement;
  isUnlocked: boolean;
}

function DraggableItem({ element, isUnlocked }: DraggableItemProps) {
  const isAvailable = !element.locked || isUnlocked;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: element.id,
    disabled: !isAvailable,
    data: { element },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 1000 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...(isAvailable ? { ...listeners, ...attributes } : {})}
      className={`flex flex-col items-center gap-1 p-2 rounded-md transition-all ${
        isAvailable
          ? "cursor-grab active:cursor-grabbing hover-elevate"
          : "opacity-50 cursor-not-allowed"
      } ${isDragging ? "opacity-60" : ""}`}
      style={style}
      data-testid={`element-${element.id}`}
    >
      <div className="relative">
        <DoodleIcon icon={element.svgIcon} color={element.color} size={44} />
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-md">
            <Lock className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
      </div>
      <span className="text-xs text-center leading-tight max-w-[70px] truncate" data-testid={`element-name-${element.id}`}>
        {element.name}
      </span>
    </div>
  );
}

interface ElementPanelProps {
  baseElements: DecorativeElement[];
  lockedElements: DecorativeElement[];
  unlockedIds: string[];
  onQuizOpen: () => void;
  quizCompleted: boolean;
}

export function ElementPanel({
  baseElements,
  lockedElements,
  unlockedIds,
  onQuizOpen,
  quizCompleted,
}: ElementPanelProps) {
  return (
    <div className="flex flex-col gap-3" data-testid="element-panel">
      <div>
        <h3 className="text-sm font-bold mb-2 text-foreground">Decorations</h3>
        <div className="grid grid-cols-2 gap-1">
          {baseElements.map((el) => (
            <DraggableItem key={el.id} element={el} isUnlocked={true} />
          ))}
        </div>
      </div>

      <div className="border-t pt-3">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
          <h3 className="text-sm font-bold text-foreground">Bonus Items</h3>
          {!quizCompleted && (
            <button
              onClick={onQuizOpen}
              className="text-xs px-2 py-1 rounded-md bg-primary text-primary-foreground hover-elevate active-elevate-2 font-bold"
              data-testid="button-take-quiz"
            >
              Take Quiz!
            </button>
          )}
        </div>
        {quizCompleted && (
          <p className="text-xs text-muted-foreground mb-2">
            Quiz completed! All items unlocked.
          </p>
        )}
        <div className="grid grid-cols-2 gap-1">
          {lockedElements.map((el) => (
            <DraggableItem
              key={el.id}
              element={el}
              isUnlocked={unlockedIds.includes(el.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
