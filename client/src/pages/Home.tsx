import { useState } from "react";
import { festivities, type Festivity, type DecorativeElement, getUnlockStatus } from "@/lib/festivities";
import { loadProgress, saveProgress, getFestivityProgress, updateFestivityProgress, type GameProgress, type PlacedElement, type FixedItemPosition, type FurniturePosition, MAX_ELEMENT_COPIES, countElementInDisplay, DEFAULT_LIGHTS, LIGHT_COLOR_OPTIONS, getFixedItemPositions, getFurniturePositions } from "@/lib/progress";
import { WindowDisplay } from "@/components/WindowDisplay";
import { ElementPanel } from "@/components/ElementPanel";
import { QuizModal } from "@/components/QuizModal";
import { FestivalSelector } from "@/components/FestivalSelector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Paintbrush, RotateCcw, Lightbulb, Lock } from "lucide-react";

const BG_PRESETS = [
  "#FFF9F0", "#FFFFFF", "#F0F4FF", "#FFF0F5", "#F0FFF4",
  "#FFFBEB", "#F5F0FF", "#FFF1F0", "#F0FDFA", "#1a1a2e",
  "#2d2d44", "#1e3a5f", "#3b1f2b", "#1b2d1b",
];

export default function Home() {
  const [progress, setProgress] = useState<GameProgress>(() => loadProgress());
  const [selectedFestivity, setSelectedFestivity] = useState<Festivity>(festivities[0]);
  const [quizOpen, setQuizOpen] = useState(false);
  const { toast } = useToast();

  const festivityProgress = getFestivityProgress(progress, selectedFestivity.id);
  const placedElements = festivityProgress.placedElements || [];
  const allElements = [...selectedFestivity.baseElements, ...selectedFestivity.lockedElements];
  const canvasBgColor = festivityProgress.bgColor || "#FFF9F0";
  const lightsOn = festivityProgress.lightsOn || [...DEFAULT_LIGHTS];
  const lightColor = festivityProgress.lightColor || "#FFD700";
  const fixedItems = getFixedItemPositions(festivityProgress);
  const furniturePositions = getFurniturePositions(festivityProgress);
  const shopName = progress.shopName ?? "";

  const bestScore = festivityProgress.quizScore;
  const unlockStatus = getUnlockStatus(selectedFestivity, bestScore);

  const allBgColors = [...BG_PRESETS, ...selectedFestivity.colorPalette.filter(c => !BG_PRESETS.includes(c))];
  const availableBgColors = allBgColors.slice(0, unlockStatus.unlockedBgColors);

  const handleShopNameChange = (name: string) => {
    const newProgress = { ...progress, shopName: name };
    saveProgress(newProgress);
    setProgress(newProgress);
  };

  const handleUpdateFixedItem = (id: string, updates: Partial<FixedItemPosition>) => {
    const updatedItems = fixedItems.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    const newProgress = updateFestivityProgress(progress, selectedFestivity.id, { fixedItemPositions: updatedItems });
    setProgress(newProgress);
  };

  const handleUpdateFurniture = (id: string, updates: Partial<FurniturePosition>) => {
    const updatedFurniture = furniturePositions.map(f =>
      f.id === id ? { ...f, ...updates } : f
    );
    const newProgress = updateFestivityProgress(progress, selectedFestivity.id, { furniturePositions: updatedFurniture });
    setProgress(newProgress);
  };

  const handleLockedAction = () => {
    toast({
      title: "Feature locked",
      description: "Answer quizzes to unlock more features!",
    });
  };

  const handleBgColorChange = (color: string) => {
    const newProgress = updateFestivityProgress(progress, selectedFestivity.id, { bgColor: color });
    setProgress(newProgress);
  };

  const handleLightColorChange = (color: string) => {
    const newProgress = updateFestivityProgress(progress, selectedFestivity.id, { lightColor: color });
    setProgress(newProgress);
  };

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

  const handleToggleLight = (index: number) => {
    if (index >= unlockStatus.unlockedLightsCount) {
      handleLockedAction();
      return;
    }
    const updated = [...lightsOn];
    updated[index] = !updated[index];
    const newProgress = updateFestivityProgress(progress, selectedFestivity.id, { lightsOn: updated });
    setProgress(newProgress);
  };

  const handleToggleAllLights = () => {
    const unlockedCount = unlockStatus.unlockedLightsCount;
    const unlockedLights = lightsOn.slice(0, unlockedCount);
    const allOn = unlockedLights.every(l => l);
    const updated = lightsOn.map((l, i) => i < unlockedCount ? !allOn : false);
    const newProgress = updateFestivityProgress(progress, selectedFestivity.id, { lightsOn: updated });
    setProgress(newProgress);
  };

  const handleQuizComplete = (score: number) => {
    const newBestScore = Math.max(festivityProgress.quizScore, score);
    const newUnlock = getUnlockStatus(selectedFestivity, newBestScore);
    const wasCompleted = festivityProgress.quizCompleted;
    const newProgress = updateFestivityProgress(progress, selectedFestivity.id, {
      quizCompleted: true,
      quizScore: newBestScore,
      unlockedElements: newUnlock.unlockedElements,
    });
    if (!wasCompleted) {
      newProgress.totalQuizzesCompleted = (newProgress.totalQuizzesCompleted || 0) + 1;
    }
    saveProgress(newProgress);
    setProgress(newProgress);
  };

  const allLightsOn = lightsOn.slice(0, unlockStatus.unlockedLightsCount).every(l => l);

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

      <main className="flex-1 flex flex-col p-6 items-center justify-center overflow-auto">
        <div className="w-full max-w-4xl">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <div>
              <h2 className="text-xl font-black text-foreground">{selectedFestivity.name}</h2>
              <p className="text-xs text-muted-foreground">{selectedFestivity.month}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" data-testid="text-score">
                Best: {bestScore}/{selectedFestivity.quiz.length}
              </Badge>
              <Badge variant="outline">
                {placedElements.length} elements placed
              </Badge>
            </div>
          </div>

          <div className="px-16 pt-20 pb-6">
            <WindowDisplay
              festivity={selectedFestivity}
              placedElements={placedElements}
              allElements={allElements}
              onRemoveElement={handleRemoveElement}
              onUpdateElement={handleUpdateElement}
              bgColor={canvasBgColor}
              lightsOn={lightsOn}
              onToggleLight={handleToggleLight}
              lightColor={lightColor}
              fixedItems={fixedItems}
              onUpdateFixedItem={handleUpdateFixedItem}
              shopName={shopName}
              onShopNameChange={handleShopNameChange}
              unlockedLightsCount={unlockStatus.unlockedLightsCount}
              furniturePositions={furniturePositions}
              onUpdateFurniture={handleUpdateFurniture}
              furnitureUnlocked={unlockStatus.furnitureUnlocked}
              onLockedAction={handleLockedAction}
            />
          </div>
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
            unlockedIds={unlockStatus.unlockedElements}
            onQuizOpen={() => setQuizOpen(true)}
            quizCompleted={festivityProgress.quizCompleted}
            onAddElement={handleAddElement}
            placedElements={placedElements}
          />
        </ScrollArea>

        <div className="border-t p-3 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-1">
                <Lightbulb size={12} />
                Lights ({unlockStatus.unlockedLightsCount}/10)
              </h3>
              {unlockStatus.unlockedLightsCount > 0 && (
                <Button
                  size="sm"
                  variant={allLightsOn ? "default" : "outline"}
                  onClick={handleToggleAllLights}
                  data-testid="button-toggle-all-lights"
                >
                  {allLightsOn ? "All Off" : "All On"}
                </Button>
              )}
            </div>
            {unlockStatus.unlockedLightsCount === 0 && (
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Lock size={10} /> Score {unlockStatus.nextLightAt} to unlock lights
              </p>
            )}
            {unlockStatus.unlockedLightsCount > 0 && (
              <div className="flex flex-wrap gap-1.5" data-testid="light-color-picker">
                {LIGHT_COLOR_OPTIONS.map((opt) => (
                  <button
                    key={opt.color}
                    onClick={() => handleLightColorChange(opt.color)}
                    className={`w-5 h-5 rounded-full border-2 transition-all ${
                      lightColor === opt.color ? "border-foreground ring-1 ring-foreground/30 scale-110" : "border-muted"
                    }`}
                    style={{ backgroundColor: opt.color }}
                    title={opt.name}
                    data-testid={`button-light-color-${opt.color.replace("#", "")}`}
                  />
                ))}
              </div>
            )}
            {unlockStatus.unlockedLightsCount > 0 && unlockStatus.nextLightAt !== null && (
              <p className="text-[10px] text-muted-foreground mt-1">
                Score {unlockStatus.nextLightAt} to unlock more lights
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-1">
                <Paintbrush size={12} />
                Background ({availableBgColors.length}/{allBgColors.length})
              </h3>
              {canvasBgColor !== "#FFF9F0" && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleBgColorChange("#FFF9F0")}
                  data-testid="button-reset-bg"
                >
                  <RotateCcw size={12} />
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5" data-testid="bg-color-picker">
              {allBgColors.map((c, i) => {
                const isLocked = i >= unlockStatus.unlockedBgColors;
                return (
                  <button
                    key={c}
                    onClick={() => isLocked ? handleLockedAction() : handleBgColorChange(c)}
                    className={`w-6 h-6 rounded-md border-2 relative ${
                      isLocked
                        ? "opacity-30 cursor-not-allowed border-muted"
                        : canvasBgColor === c
                          ? "border-blue-500 ring-1 ring-blue-300"
                          : "border-muted"
                    }`}
                    style={{ backgroundColor: c }}
                    disabled={isLocked}
                    data-testid={`button-bg-${c.replace("#", "")}`}
                  >
                    {isLocked && (
                      <Lock size={10} className="absolute inset-0 m-auto text-foreground/50" />
                    )}
                  </button>
                );
              })}
            </div>
            {unlockStatus.nextBgAt !== null && (
              <p className="text-[10px] text-muted-foreground mt-1">
                Score {unlockStatus.nextBgAt} to unlock more colours
              </p>
            )}
          </div>
        </div>
      </aside>

      <QuizModal
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        questions={selectedFestivity.quiz}
        festivityName={selectedFestivity.name}
        onComplete={handleQuizComplete}
        bestScore={bestScore}
        festivity={selectedFestivity}
      />
    </div>
  );
}
