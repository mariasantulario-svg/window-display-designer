import { useState, useEffect, useRef, useCallback } from "react";
import { festivities, type Festivity, type DecorativeElement, getUnlockStatus, GRAMMAR_QUIZ_TOTAL } from "@/lib/festivities";
import { loadProgress, saveProgress, getFestivityProgress, updateFestivityProgress, recordQuizBlockScore, type GameProgress, type PlacedElement, type FixedItemPosition, type FurniturePosition, MAX_ELEMENT_COPIES, countElementInDisplay, DEFAULT_LIGHTS, LIGHT_COLOR_OPTIONS, getFixedItemPositions, getFurniturePositions, autoDetectDismissedHints, dismissHint, saveScreenshot, loadScreenshots, deleteScreenshot, getOnboardingQuizDone, setOnboardingQuizDone, getDismissedHints, getSelectSeasonBannerDismissed, type Screenshot } from "@/lib/progress";
import { WindowDisplay } from "@/components/WindowDisplay";
import { ElementPanel } from "@/components/ElementPanel";
import { QuizModal as GrammarQuizModal } from "@/components/quiz/QuizModal";
import { FestivalSelector } from "@/components/FestivalSelector";
import { OnboardingCarousel } from "@/components/OnboardingCarousel";
import { OnboardingQuizOverlay } from "@/components/OnboardingQuizOverlay";
import { ShopNameBanner } from "@/components/ShopNameBanner";
import { SelectSeasonBanner } from "@/components/SelectSeasonBanner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Paintbrush, RotateCcw, Lightbulb, Lock, ChevronUp, ChevronDown, X, Camera, Image, Trash2, Share2, ShoppingBag, Coins } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import html2canvas from "html2canvas";
import { StickerIcon } from "@/components/StickerIcon";

const BG_PRESETS = [
  "#FFF9F0", "#FFFFFF", "#F0F4FF", "#FFF0F5", "#F0FFF4",
  "#FFFBEB", "#F5F0FF", "#FFF1F0", "#F0FDFA", "#1a1a2e",
  "#2d2d44", "#1e3a5f", "#3b1f2b", "#1b2d1b",
];

export default function Home() {
  const [progress, setProgress] = useState<GameProgress>(() => loadProgress());
  const [selectedFestivity, setSelectedFestivity] = useState<Festivity>(festivities[0]);
  const [quizOpen, setQuizOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [shopOpen, setShopOpen] = useState(false);
  const [screenshots, setScreenshots] = useState<Screenshot[]>(() => loadScreenshots());
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [showOnboardingQuiz, setShowOnboardingQuiz] = useState(() => !getOnboardingQuizDone());
  const [showShopNameBanner, setShowShopNameBanner] = useState(
    () => getOnboardingQuizDone() && !getDismissedHints().has("shop_name"),
  );
  const [showSelectSeasonBanner, setShowSelectSeasonBanner] = useState(false);
  const escaparateRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [coins, setCoins] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("window-display-coins");
      if (stored !== null) {
        const parsed = Number(stored);
        if (!Number.isNaN(parsed)) {
          setCoins(parsed);
          return;
        }
      }
    } catch {
      // ignore, fallback below
    }
    // Fallback inicial: si en el progreso hubiera ya monedas guardadas.
    const initial = (progress as any).coins ?? 0;
    if (typeof initial === "number" && !Number.isNaN(initial)) {
      setCoins(initial);
    }
  }, []);

  useEffect(() => {
    autoDetectDismissedHints(progress);
  }, []);

  const isFullyUnlocked = useCallback((status: ReturnType<typeof getUnlockStatus>) => {
    return status.nextElementAt === null && status.nextLightAt === null && status.nextBgAt === null && status.nextFurnitureAt === null;
  }, []);

  const handleScreenshot = useCallback(async () => {
    if (!escaparateRef.current || capturing) return;
    setCapturing(true);
    try {
      const canvas = await html2canvas(escaparateRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const dataUrl = canvas.toDataURL("image/png", 0.8);
      const screenshot: Screenshot = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        festivityId: selectedFestivity.id,
        dataUrl,
        timestamp: Date.now(),
      };
      const updated = saveScreenshot(screenshot);
      setScreenshots(updated);
      toast({ title: "Screenshot saved!", description: "Check your gallery to view it." });
    } catch {
      toast({ title: "Screenshot failed", description: "Could not capture the display.", variant: "destructive" });
    } finally {
      setCapturing(false);
    }
  }, [selectedFestivity.id, capturing, toast]);

  const handleShareLink = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(
      () => toast({ title: "Link copiado", description: "El enlace se ha copiado al portapapeles. Compártelo para que otros abran la app." }),
      () => toast({ title: "No se pudo copiar", description: "Copia la URL manualmente desde la barra del navegador.", variant: "destructive" })
    );
  }, [toast]);

  const handleDeleteScreenshot = useCallback((id: string) => {
    const updated = deleteScreenshot(id);
    setScreenshots(updated);
  }, []);

  const festivityProgress = getFestivityProgress(progress, selectedFestivity.id);
  const placedElements = festivityProgress.placedElements || [];
  const allElements = [
    ...selectedFestivity.baseElements,
    ...selectedFestivity.lockedElements,
    ...selectedFestivity.shopOnlyElements,
  ];
  const canvasBgColor = festivityProgress.bgColor || "#FFF9F0";
  const lightsOn = festivityProgress.lightsOn || [...DEFAULT_LIGHTS];
  const lightColor = festivityProgress.lightColor || "#FFD700";
  const fixedItems = getFixedItemPositions(festivityProgress);
  const furniturePositions = getFurniturePositions(festivityProgress);
  const shopName = progress.shopName ?? "";
  const purchasedElementIds = progress.purchasedElementIds ?? [];

  const bestScore = festivityProgress.quizScore;
  const unlockStatus = getUnlockStatus(selectedFestivity, bestScore);
  const unlockedIdsForPanel = Array.from(new Set([...unlockStatus.unlockedElements, ...purchasedElementIds]));
  const bonusElementsForPanel = [
    ...selectedFestivity.lockedElements,
    ...selectedFestivity.shopOnlyElements,
  ];

  const allBgColors = [...BG_PRESETS, ...selectedFestivity.colorPalette.filter(c => !BG_PRESETS.includes(c))];
  const availableBgColors = allBgColors.slice(0, unlockStatus.unlockedBgColors);

  const handleShopNameChange = (name: string) => {
    const newProgress = { ...progress, shopName: name };
    saveProgress(newProgress);
    setProgress(newProgress);
    dismissHint("shop_name");
    setShowShopNameBanner(false);
    if (!getSelectSeasonBannerDismissed()) {
      setShowSelectSeasonBanner(true);
    }
  };

  const handleOnboardingComplete = () => {
    setOnboardingQuizDone();
    setShowOnboardingQuiz(false);
    setShowShopNameBanner(true);
    try {
      localStorage.setItem("onboarding_completed", "true");
    } catch {}
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

  const handleEarnCoins = useCallback((earned: number) => {
    if (!earned || earned <= 0) return;
    setCoins((prev) => {
      const next = prev + earned;
      try {
        localStorage.setItem("window-display-coins", String(next));
      } catch {}
      return next;
    });
    toast({ title: `+${earned} coins`, description: "Customer satisfied!" });
  }, [toast]);

  const SHOP_PRICE = 20;
  const handleBuyElement = useCallback((elementId: string) => {
    if (purchasedElementIds.includes(elementId)) return;
    setCoins((prev) => {
      if (prev < SHOP_PRICE) {
        toast({
          title: "Not enough coins",
          description: `You need ${SHOP_PRICE - prev} more coins.`,
          variant: "destructive",
        });
        return prev;
      }
      const remaining = prev - SHOP_PRICE;
      try {
        localStorage.setItem("window-display-coins", String(remaining));
      } catch {}

      const newProgress: GameProgress = {
        ...progress,
        purchasedElementIds: [...purchasedElementIds, elementId],
      };
      saveProgress(newProgress);
      setProgress(newProgress);
      toast({ title: "Purchased!", description: "The item is now available in Decorations." });

      return remaining;
    });
  }, [progress, purchasedElementIds, toast]);

  const handleBgColorChange = (color: string) => {
    const newProgress = updateFestivityProgress(progress, selectedFestivity.id, { bgColor: color });
    setProgress(newProgress);
    dismissHint("bg_colors");
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

  const allLightsOn = lightsOn.slice(0, unlockStatus.unlockedLightsCount).every(l => l);

  const totalAnswered = festivities.reduce((sum, fest) => {
    const fp = getFestivityProgress(progress, fest.id);
    return sum + (fp.quizScore || 0);
  }, 0);

  const totalQuestions = festivities.reduce((sum, fest) => sum + fest.quiz.length, 0);
  const overallProgress = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;

  const handleSelectFestivity = (fest: Festivity) => {
    setSelectedFestivity(fest);
    setDrawerOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-background font-sans text-foreground">
      {showOnboardingQuiz ? (
        <>
          <div className="flex-1 flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center" style={{ padding: "12px 24px" }}>
              <div className="w-full max-w-4xl">
                <div ref={escaparateRef} className="pl-28 pr-28 pt-44 pb-4 pointer-events-none select-none overflow-visible">
                  <div className="relative">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-lg z-10" />
                    <WindowDisplay
                      festivity={selectedFestivity}
                      placedElements={placedElements}
                      allElements={allElements}
                      onRemoveElement={() => {}}
                      onUpdateElement={() => {}}
                      bgColor={canvasBgColor}
                      lightsOn={lightsOn}
                      onToggleLight={() => {}}
                      lightColor={lightColor}
                      fixedItems={fixedItems}
                      onUpdateFixedItem={() => {}}
                      shopName={shopName}
                      onShopNameChange={() => {}}
                      unlockedLightsCount={0}
                      furniturePositions={furniturePositions}
                      onUpdateFurniture={() => {}}
                      furnitureUnlocked={false}
                      onLockedAction={() => {}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <OnboardingQuizOverlay onComplete={handleOnboardingComplete} />
        </>
      ) : (
        <>
      <div className="px-3 py-2 border-b bg-card space-y-2" data-testid="top-bar">
        <div className="flex items-center gap-2 flex-wrap">
          <div id="season-selector" data-testid="season-selector-wrap">
            <FestivalSelector
            selectedId={selectedFestivity.id}
            onSelect={handleSelectFestivity}
            progress={progress}
          />
          </div>

          <div className="flex items-center gap-2 ml-auto flex-wrap">
            <Badge variant="secondary" data-testid="text-score">
              Best: {bestScore}/{GRAMMAR_QUIZ_TOTAL}
            </Badge>
            <Badge variant="outline">
              {placedElements.length} placed
            </Badge>
            <Badge variant="outline" data-testid="text-coins">
              <Coins className="w-3.5 h-3.5 mr-1" />
              {coins} coins
            </Badge>
          </div>

          {!festivityProgress.quizCompleted ? (
            <Button
              onClick={() => setQuizOpen(true)}
              className="bg-amber-500 text-white border-amber-600"
              data-testid="button-take-quiz"
            >
              Take Quiz!
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setQuizOpen(true)}
              data-testid="button-retake-quiz"
            >
              Retake Quiz
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareLink}
            title="Copiar enlace para compartir la app"
            data-testid="button-share-link"
          >
            <Share2 className="w-4 h-4 mr-1.5" />
            Compartir
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShopOpen(true)}
            title="Abrir la tienda para comprar decoraciones con monedas"
            data-testid="button-open-shop"
          >
            <ShoppingBag className="w-4 h-4 mr-1.5" />
            Shop
          </Button>
        </div>

        <div className="flex flex-col gap-1" data-testid="overall-progress">
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span className="font-semibold uppercase tracking-wide">Overall Progress</span>
            <span className="font-medium">
              {totalAnswered}/{totalQuestions} questions · {overallProgress}%
            </span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center overflow-auto relative min-w-0">
        <div className="w-full max-w-5xl min-w-0 h-full flex items-center justify-center overflow-visible px-2 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6">
          <div className="w-full max-w-3xl overflow-visible min-w-0 mx-auto" style={{ width: "100%" }}>
            <div
              ref={escaparateRef}
              className="w-full overflow-visible pt-10 pb-2 sm:pl-10 sm:pr-10 sm:pt-16 md:pl-16 md:pr-16 md:pt-24 md:pb-4"
              style={{
                maxWidth: "100%",
                maxHeight: "72vh",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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
                onEarnCoins={handleEarnCoins}
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
                  lockedElements={bonusElementsForPanel}
                  unlockedIds={unlockedIdsForPanel}
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
        {isFullyUnlocked(unlockStatus) && (
          <div
            className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 rounded-lg px-4 py-2 shadow-lg flex items-center gap-3"
            style={{ fontFamily: "'Architects Daughter', cursive" }}
            data-testid="screenshot-banner"
          >
            <span className="text-sm text-amber-800 font-bold">All features unlocked!</span>
            <Button
              size="sm"
              onClick={handleScreenshot}
              disabled={capturing}
              data-testid="button-take-screenshot"
            >
              <Camera className="w-4 h-4 mr-1.5" />
              {capturing ? "Capturing..." : "Screenshot"}
            </Button>
            {screenshots.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setGalleryOpen(true)}
                data-testid="button-open-gallery"
              >
                <Image className="w-4 h-4 mr-1.5" />
                Gallery ({screenshots.length})
              </Button>
            )}
          </div>
        )}
      </main>

      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden" aria-describedby={undefined}>
          <DialogTitle className="text-lg font-bold" style={{ fontFamily: "'Architects Daughter', cursive" }}>
            My Window Displays
          </DialogTitle>
          <ScrollArea className="max-h-[60vh]">
            {screenshots.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No screenshots yet. Capture your first window display!</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 p-1">
                {screenshots.map((shot) => {
                  const fest = festivities.find(f => f.id === shot.festivityId);
                  return (
                    <div key={shot.id} className="relative group border border-border rounded-md overflow-hidden">
                      <img src={shot.dataUrl} alt={`${fest?.name || "Window"} display`} className="w-full h-auto" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-2 py-1 flex items-center justify-between gap-2">
                        <span className="truncate">{fest?.name || "Unknown"} - {new Date(shot.timestamp).toLocaleDateString()}</span>
                        <button
                          onClick={() => handleDeleteScreenshot(shot.id)}
                          className="text-red-300 hover:text-red-100 flex-shrink-0"
                          data-testid={`button-delete-screenshot-${shot.id}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={shopOpen} onOpenChange={setShopOpen}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-hidden" aria-describedby={undefined}>
          <DialogTitle className="text-lg font-bold flex items-center justify-between gap-3" style={{ fontFamily: "'Architects Daughter', cursive" }}>
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Coin Shop
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold">
              <Coins className="w-4 h-4" />
              {coins}
            </span>
          </DialogTitle>
          <ScrollArea className="max-h-[60vh] pr-2">
            <div className="grid grid-cols-1 gap-2">
              {selectedFestivity.shopOnlyElements.map((el) => {
                const unlockedByQuiz = unlockStatus.unlockedElements.includes(el.id);
                const purchased = purchasedElementIds.includes(el.id);
                const canBuy = !unlockedByQuiz && !purchased;
                return (
                  <div key={el.id} className="flex items-center justify-between gap-3 border border-border rounded-md p-2 bg-background">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-12 h-12 flex items-center justify-center rounded-md bg-muted/40 border border-border">
                        <StickerIcon imagePath={el.imagePath} name={el.name} size={40} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm truncate">{el.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Price: {SHOP_PRICE} coins
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {unlockedByQuiz ? (
                        <Badge variant="secondary">Unlocked</Badge>
                      ) : purchased ? (
                        <Badge>Bought</Badge>
                      ) : (
                        <Button size="sm" onClick={() => handleBuyElement(el.id)} disabled={!canBuy}>
                          Buy
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <GrammarQuizModal
        key={quizOpen ? `quiz-${selectedFestivity.id}` : "quiz-closed"}
        isOpen={quizOpen}
        onClose={() => setQuizOpen(false)}
        festivityId={selectedFestivity.id}
        onQuizBlockComplete={({ festivityId: fid, level: lvl, block: blk, score: sc }) => {
          const newProgress = recordQuizBlockScore(progress, fid, lvl, blk, sc);
          setProgress(newProgress);
        }}
      />

      <OnboardingCarousel />
        </>
      )}

      {showShopNameBanner && (
        <ShopNameBanner onDismiss={() => setShowShopNameBanner(false)} />
      )}
      {showSelectSeasonBanner && (
        <SelectSeasonBanner onDismiss={() => setShowSelectSeasonBanner(false)} />
      )}
    </div>
  );
}
