import { useState } from "react";
import { festivities, type Festivity, type DecorativeElement, getUnlockStatus } from "@/lib/festivities";
import { loadProgress, saveProgress, getFestivityProgress, updateFestivityProgress, type GameProgress, type PlacedElement, type FixedItemPosition, type FurniturePosition, MAX_ELEMENT_COPIES, countElementInDisplay, DEFAULT_LIGHTS, LIGHT_COLOR_OPTIONS, getFixedItemPositions, getFurniturePositions } from "@/lib/progress";
import { WindowDisplay } from "@/components/WindowDisplay";
import { ElementPanel } from "@/components/ElementPanel";
import { QuizModal } from "@/components/QuizModal";
import { FestivalSelector } from "@/components/FestivalSelector";
import { OnboardingCarousel } from "@/components/OnboardingCarousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Paintbrush, RotateCcw, Lightbulb, Lock, ChevronUp, ChevronDown, X } from "lucide-react";

const BG_PRESETS = [
  "#FFF9F0", "#FFFFFF", "#F0F4FF", "#FFF0F5", "#F0FFF4",
  "#FFFBEB", "#F5F0FF", "#FFF1F0", "#F0FDFA", "#1a1a2e",
  "#2d2d44", "#1e3a5f", "#3b1f2b", "#1b2d1b",
];

export default function Home() {
  const [progress, setProgress] = useState<GameProgress>(() => loadProgress());
  const [selectedFestivity, setSelectedFestivity] = useState<Festivity>(festivities[0]);
  const [quizOpen, setQuizOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
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
    <div className="flex flex-col h-screen bg-background font-sans text-foreground">
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-card flex-wrap" data-testid="top-bar">
        <FestivalSelector
          selectedId={selectedFestivity.id}
          onSelect={setSelectedFestivity}
          progress={progress}
        />

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <Badge variant="secondary" data-testid="text-score">
            Best: {bestScore}/{selectedFestivity.quiz.length}
          </Badge>
          <Badge variant="outline">
            {placedElements.length} placed
          </Badge>
          {!festivityProgress.quizCompleted ? (
            <Button
              size="sm"
              onClick={() => setQuizOpen(true)}
              data-testid="button-take-quiz"
            >
              Take Quiz!
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setQuizOpen(true)}
              data-testid="button-retake-quiz"
            >
              Retake Quiz
            </Button>
          )}
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center overflow-auto relative">
        <div className="w-full h-full flex items-center justify-center" style={{ padding: "12px 16px" }}>
          <div className="w-full" style={{ maxWidth: "calc(100vw - 32px)" }}>
            <div className="px-8 pt-12 pb-4">
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
        </div>

        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="fixed left-1/2 -translate-x-1/2 z-40 bg-card border border-b-0 border-border rounded-t-md px-4 py-1.5 shadow-md transition-all flex items-center gap-1.5"
          style={{ bottom: drawerOpen ? "280px" : "0px", transition: "bottom 0.3s ease" }}
          data-testid="button-toggle-drawer"
        >
          {drawerOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          <span className="text-xs font-bold uppercase tracking-wide">Decorations</span>
        </button>

        {drawerOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-30"
            onClick={() => setDrawerOpen(false)}
            data-testid="drawer-overlay"
          />
        )}

        <div
          className="fixed bottom-0 left-0 w-full bg-card border-t border-border z-40 shadow-xl"
          style={{
            height: "280px",
            transform: drawerOpen ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.3s ease",
          }}
          data-testid="decorations-drawer"
        >
          <div className="h-full flex">
            <div className="flex-1 border-r border-border overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-3 py-2 border-b gap-2">
                <h3 className="font-bold text-xs text-foreground uppercase tracking-wide">Decorations</h3>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setDrawerOpen(false)}
                  data-testid="button-close-drawer"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1 p-2">
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
            </div>

            <div className="w-56 flex-shrink-0 overflow-y-auto p-3 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                  <h3 className="text-[10px] font-bold text-foreground uppercase tracking-wide flex items-center gap-1">
                    <Lightbulb size={10} />
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
                    <Lock size={10} /> Score {unlockStatus.nextLightAt} to unlock
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
                    Score {unlockStatus.nextLightAt} for more
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                  <h3 className="text-[10px] font-bold text-foreground uppercase tracking-wide flex items-center gap-1">
                    <Paintbrush size={10} />
                    Background ({availableBgColors.length}/{allBgColors.length})
                  </h3>
                  {canvasBgColor !== "#FFF9F0" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleBgColorChange("#FFF9F0")}
                      data-testid="button-reset-bg"
                    >
                      <RotateCcw size={10} />
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1" data-testid="bg-color-picker">
                  {allBgColors.map((c, i) => {
                    const isLocked = i >= unlockStatus.unlockedBgColors;
                    return (
                      <button
                        key={c}
                        onClick={() => isLocked ? handleLockedAction() : handleBgColorChange(c)}
                        className={`w-5 h-5 rounded-md border-2 relative ${
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
                          <Lock size={8} className="absolute inset-0 m-auto text-foreground/50" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {unlockStatus.nextBgAt !== null && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Score {unlockStatus.nextBgAt} for more colours
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <QuizModal
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        questions={selectedFestivity.quiz}
        festivityName={selectedFestivity.name}
        onComplete={handleQuizComplete}
        bestScore={bestScore}
        festivity={selectedFestivity}
      />

      <OnboardingCarousel />
    </div>
  );
}
