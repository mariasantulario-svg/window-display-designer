import { useState } from "react";
import { festivities, type Festivity, type DecorativeElement, getUnlockedElementsByScore } from "@/lib/festivities";
import { loadProgress, saveProgress, getFestivityProgress, updateFestivityProgress, type GameProgress, type PlacedElement, MAX_ELEMENT_COPIES, countElementInDisplay } from "@/lib/progress";
import { WindowDisplay } from "@/components/WindowDisplay";
import { ElementPanel } from "@/components/ElementPanel";
import { QuizModal } from "@/components/QuizModal";
import { FestivalSelector } from "@/components/FestivalSelector";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [progress, setProgress] = useState<GameProgress>(() => loadProgress());
  const [selectedFestivity, setSelectedFestivity] = useState<Festivity>(festivities[0]);
  const [quizOpen, setQuizOpen] = useState(false);
  const { toast } = useToast();

  const festivityProgress = getFestivityProgress(progress, selectedFestivity.id);
  const placedElements = festivityProgress.placedElements || [];
  const allElements = [...selectedFestivity.baseElements, ...selectedFestivity.lockedElements];

  const handleAddElement = (element: DecorativeElement) => {
    const count = countElementInDisplay(placedElements, element.id);
    if (count >= MAX_ELEMENT_COPIES) {
      toast({
        title: "Limit reached",
        description: `You can only place ${MAX_ELEMENT_COPIES} copies of "${element.name}".`,
        variant: "destructive",
      });
      return;
    }

    const offsetX = (count * 5) % 20;
    const offsetY = (count * 7) % 20;
    const newPlaced: PlacedElement = {
      elementId: element.id,
      x: 30 + offsetX,
      y: 30 + offsetY,
      scale: 1,
    };
    const updated = [...placedElements, newPlaced];
    const newProgress = updateFestivityProgress(progress, selectedFestivity.id, { placedElements: updated });
    setProgress(newProgress);
  };

  const handleUpdateElement = (index: number, updates: Partial<PlacedElement>) => {
    const updated = [...placedElements];
    updated[index] = { ...updated[index], ...updates };
    const newProgress = updateFestivityProgress(progress, selectedFestivity.id, { placedElements: updated });
    setProgress(newProgress);
  };

  const handleRemoveElement = (index: number) => {
    const updated = placedElements.filter((_, i) => i !== index);
    const newProgress = updateFestivityProgress(progress, selectedFestivity.id, { placedElements: updated });
    setProgress(newProgress);
  };

  const handleQuizComplete = (score: number) => {
    const bestScore = Math.max(festivityProgress.quizScore, score);
    const unlockedIds = getUnlockedElementsByScore(selectedFestivity, bestScore, selectedFestivity.quiz.length);
    const mergedUnlocked = Array.from(new Set([...(festivityProgress.unlockedElements || []), ...unlockedIds]));
    const wasCompleted = festivityProgress.quizCompleted;
    const newProgress = updateFestivityProgress(progress, selectedFestivity.id, {
      quizCompleted: true,
      quizScore: bestScore,
      unlockedElements: mergedUnlocked,
    });
    if (!wasCompleted) {
      newProgress.totalQuizzesCompleted = (newProgress.totalQuizzesCompleted || 0) + 1;
    }
    saveProgress(newProgress);
    setProgress(newProgress);

    if (mergedUnlocked.length > 0) {
      toast({
        title: `${mergedUnlocked.length} bonus items available!`,
        description: bestScore === selectedFestivity.quiz.length
          ? "Perfect score! All bonus items are now available."
          : "Get a higher score to unlock more items.",
      });
    }
  };

  return (
    <div className="flex h-screen bg-background font-sans text-foreground">
      <aside className="w-56 bg-card border-r flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-lg font-black text-foreground leading-none" data-testid="text-app-title">SHOP WINDOW</h1>
          <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">Visual Merchandising</p>
        </div>
        <ScrollArea className="flex-1 p-3">
          <FestivalSelector
            selectedId={selectedFestivity.id}
            onSelect={setSelectedFestivity}
            progress={progress}
          />
        </ScrollArea>
      </aside>

      <main className="flex-1 flex flex-col p-6 items-center justify-center overflow-hidden">
        <div className="w-full max-w-4xl">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <div>
              <h2 className="text-xl font-black text-foreground">{selectedFestivity.name}</h2>
              <p className="text-xs text-muted-foreground">{selectedFestivity.month}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" data-testid="text-score">
                Quiz: {festivityProgress.quizScore}/{selectedFestivity.quiz.length}
              </Badge>
              <Badge variant="outline">
                {placedElements.length} elements placed
              </Badge>
            </div>
          </div>

          <WindowDisplay
            festivity={selectedFestivity}
            placedElements={placedElements}
            allElements={allElements}
            onRemoveElement={handleRemoveElement}
            onUpdateElement={handleUpdateElement}
          />
        </div>
      </main>

      <aside className="w-64 bg-card border-l flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-bold text-sm text-foreground">DECORATIONS</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">Click to add (max {MAX_ELEMENT_COPIES} each)</p>
        </div>
        <ScrollArea className="flex-1 p-3">
          <ElementPanel
            baseElements={selectedFestivity.baseElements}
            lockedElements={selectedFestivity.lockedElements}
            unlockedIds={festivityProgress.unlockedElements || []}
            onQuizOpen={() => setQuizOpen(true)}
            quizCompleted={festivityProgress.quizCompleted}
            onAddElement={handleAddElement}
            placedElements={placedElements}
          />
        </ScrollArea>
      </aside>

      <QuizModal
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        questions={selectedFestivity.quiz}
        festivityName={selectedFestivity.name}
        unlockThreshold={selectedFestivity.unlockThreshold}
        onComplete={handleQuizComplete}
      />
    </div>
  );
}
