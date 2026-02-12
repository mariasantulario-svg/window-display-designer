import { useState, useCallback } from "react";
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { festivities, type Festivity, type DecorativeElement } from "@/lib/festivities";
import {
  loadProgress,
  saveProgress,
  getFestivityProgress,
  updateFestivityProgress,
  type GameProgress,
  type PlacedElement,
} from "@/lib/progress";
import { WindowDisplay } from "@/components/WindowDisplay";
import { ElementPanel } from "@/components/ElementPanel";
import { QuizModal } from "@/components/QuizModal";
import { FestivalSelector } from "@/components/FestivalSelector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, RotateCcw, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [progress, setProgress] = useState<GameProgress>(() => loadProgress());
  const [selectedFestivity, setSelectedFestivity] = useState<Festivity>(festivities[0]);
  const [quizOpen, setQuizOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const { toast } = useToast();

  const festivityProgress = getFestivityProgress(progress, selectedFestivity.id);
  const placedElements = festivityProgress.placedElements || [];

  const allElements: DecorativeElement[] = [
    ...selectedFestivity.baseElements,
    ...selectedFestivity.lockedElements,
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || over.id !== "window-display") return;

      const element = active.data.current?.element as DecorativeElement | undefined;
      if (!element) return;

      const displayEl = document.querySelector('[data-testid="window-display-canvas"]');
      if (!displayEl) return;

      const rect = displayEl.getBoundingClientRect();

      const pointerEvent = event.activatorEvent as PointerEvent;
      const delta = event.delta;

      const absoluteX = pointerEvent.clientX + delta.x;
      const absoluteY = pointerEvent.clientY + delta.y;

      const relX = ((absoluteX - rect.left) / rect.width) * 100;
      const relY = ((absoluteY - rect.top) / rect.height) * 100;

      const clampedX = Math.max(5, Math.min(95, relX));
      const clampedY = Math.max(15, Math.min(75, relY));

      const newPlaced: PlacedElement = {
        elementId: element.id,
        x: clampedX,
        y: clampedY,
        scale: 1,
      };

      const updatedPlaced = [...placedElements, newPlaced];
      const newProgress = updateFestivityProgress(progress, selectedFestivity.id, {
        placedElements: updatedPlaced,
      });
      setProgress(newProgress);

      toast({
        title: `${element.name} added!`,
        description: `"${element.nameEs}" placed on the display`,
      });
    },
    [placedElements, progress, selectedFestivity.id, toast]
  );

  const handleRemoveElement = useCallback(
    (index: number) => {
      const updatedPlaced = placedElements.filter((_, i) => i !== index);
      const newProgress = updateFestivityProgress(progress, selectedFestivity.id, {
        placedElements: updatedPlaced,
      });
      setProgress(newProgress);
    },
    [placedElements, progress, selectedFestivity.id]
  );

  const handleClearAll = useCallback(() => {
    const newProgress = updateFestivityProgress(progress, selectedFestivity.id, {
      placedElements: [],
    });
    setProgress(newProgress);
    toast({
      title: "Display cleared",
      description: "All decorations have been removed",
    });
  }, [progress, selectedFestivity.id, toast]);

  const handleQuizComplete = useCallback(
    (score: number) => {
      const passed = score >= selectedFestivity.unlockThreshold;
      if (passed) {
        const unlockedIds = selectedFestivity.lockedElements.map((el) => el.id);
        const newProgress = updateFestivityProgress(progress, selectedFestivity.id, {
          quizCompleted: true,
          quizScore: score,
          unlockedElements: unlockedIds,
        });
        newProgress.totalQuizzesCompleted = Object.values(newProgress.festivities).filter(
          (fp) => fp.quizCompleted
        ).length;
        saveProgress(newProgress);
        setProgress(newProgress);
        toast({
          title: "Items Unlocked!",
          description: `You scored ${score}/${selectedFestivity.quiz.length}. New decorations available!`,
        });
      }
    },
    [progress, selectedFestivity, toast]
  );

  const handleSelectFestivity = useCallback((fest: Festivity) => {
    setSelectedFestivity(fest);
  }, []);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen bg-background" data-testid="home-page">
        <header className="flex items-center justify-between px-4 py-3 border-b flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <rect x="4" y="8" width="32" height="24" rx="3" fill="none" stroke="#333" strokeWidth="2.5" />
              <line x1="4" y1="20" x2="36" y2="20" stroke="#333" strokeWidth="1.5" />
              <line x1="20" y1="8" x2="20" y2="32" stroke="#333" strokeWidth="1.5" />
              <circle cx="12" cy="14" r="2" fill="#FF6B6B" />
              <circle cx="28" cy="14" r="2" fill="#4CAF50" />
              <rect x="10" y="22" width="8" height="6" rx="1" fill="#FFD700" stroke="#333" strokeWidth="1" />
              <rect x="24" y="23" width="6" height="5" rx="1" fill="#87CEEB" stroke="#333" strokeWidth="1" />
            </svg>
            <div>
              <h1 className="text-lg font-bold leading-tight" data-testid="text-app-title">Window Display Designer</h1>
              <p className="text-xs text-muted-foreground">FP Comercio - English Vocabulary</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" data-testid="text-score">
              {progress.totalQuizzesCompleted}/9 Quizzes Done
            </Badge>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowInfo(!showInfo)}
              data-testid="button-info"
            >
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {showInfo && (
          <div className="px-4 py-3 border-b bg-muted/50">
            <Card className="p-3">
              <p className="text-sm text-foreground leading-relaxed">
                <strong>How to play:</strong> Choose a festivity from the left panel, then drag decorative elements onto the window display.
                Complete vocabulary quizzes to unlock bonus decorations! Click on a placed element to remove it.
                Your progress is saved automatically.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                <strong>Como jugar:</strong> Elige una festividad del panel izquierdo, arrastra elementos decorativos al escaparate.
                Completa los quizzes de vocabulario para desbloquear mas decoraciones. Haz clic en un elemento colocado para quitarlo.
              </p>
            </Card>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-44 border-r bg-card/50 flex-shrink-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-2">
                <FestivalSelector
                  selectedId={selectedFestivity.id}
                  onSelect={handleSelectFestivity}
                  progress={progress}
                />
              </div>
            </ScrollArea>
          </aside>

          <main className="flex-1 overflow-auto p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold" data-testid="text-festivity-name">{selectedFestivity.name}</h2>
                <Badge variant="secondary" className="text-xs">
                  {placedElements.length} items placed
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleClearAll}
                  disabled={placedElements.length === 0}
                  data-testid="button-clear-display"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Clear
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newProgress = loadProgress();
                    setProgress(newProgress);
                  }}
                  data-testid="button-reload-progress"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  Reload
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">{selectedFestivity.description}</p>

            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-3xl">
                <WindowDisplay
                  festivity={selectedFestivity}
                  placedElements={placedElements}
                  allElements={allElements}
                  onRemoveElement={handleRemoveElement}
                />
              </div>
            </div>
          </main>

          <aside className="w-48 border-l bg-card/50 flex-shrink-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-3">
                <ElementPanel
                  baseElements={selectedFestivity.baseElements}
                  lockedElements={selectedFestivity.lockedElements}
                  unlockedIds={festivityProgress.unlockedElements || []}
                  onQuizOpen={() => setQuizOpen(true)}
                  quizCompleted={festivityProgress.quizCompleted}
                />
              </div>
            </ScrollArea>
          </aside>
        </div>

        <QuizModal
          open={quizOpen}
          onClose={() => setQuizOpen(false)}
          questions={selectedFestivity.quiz}
          festivityName={selectedFestivity.name}
          unlockThreshold={selectedFestivity.unlockThreshold}
          onComplete={handleQuizComplete}
        />
      </div>
    </DndContext>
  );
}
