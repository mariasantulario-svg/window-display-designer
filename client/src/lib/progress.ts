const STORAGE_KEY = "window-display-designer-progress";
const HINTS_KEY = "window-display-hints-dismissed";
const ONBOARDING_QUIZ_KEY = "onboarding_quiz_done";

const SELECT_SEASON_BANNER_KEY = "select_season_banner_dismissed";

export function getSelectSeasonBannerDismissed(): boolean {
  try {
    return localStorage.getItem(SELECT_SEASON_BANNER_KEY) === "true";
  } catch {}
  return false;
}

export function setSelectSeasonBannerDismissed(): void {
  try {
    localStorage.setItem(SELECT_SEASON_BANNER_KEY, "true");
  } catch (e) {
    console.warn("Failed to save select season banner state:", e);
  }
}

export function getOnboardingQuizDone(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_QUIZ_KEY) === "true";
  } catch {}
  return false;
}

export function setOnboardingQuizDone(): void {
  try {
    localStorage.setItem(ONBOARDING_QUIZ_KEY, "true");
  } catch (e) {
    console.warn("Failed to save onboarding quiz state:", e);
  }
}

export type HintId = "bg_colors" | "lights" | "elements_drag" | "furniture" | "shop_name";

export function getDismissedHints(): Set<HintId> {
  try {
    const stored = localStorage.getItem(HINTS_KEY);
    if (stored) return new Set(JSON.parse(stored));
  } catch {}
  return new Set();
}

export function dismissHint(hintId: HintId): void {
  const dismissed = getDismissedHints();
  dismissed.add(hintId);
  localStorage.setItem(HINTS_KEY, JSON.stringify([...dismissed]));
}

export function autoDetectDismissedHints(progress: GameProgress): void {
  const dismissed = getDismissedHints();
  let changed = false;

  for (const [, fp] of Object.entries(progress.festivities)) {
    if (fp.bgColor && fp.bgColor !== "#FFF9F0") {
      if (!dismissed.has("bg_colors")) { dismissed.add("bg_colors"); changed = true; }
    }
    if (fp.lightsOn && fp.lightsOn.some(l => l)) {
      if (!dismissed.has("lights")) { dismissed.add("lights"); changed = true; }
    }
    if (fp.placedElements && fp.placedElements.length > 0) {
      if (!dismissed.has("elements_drag")) { dismissed.add("elements_drag"); changed = true; }
    }
    if (fp.furniturePositions && fp.furniturePositions.length > 0) {
      if (!dismissed.has("furniture")) { dismissed.add("furniture"); changed = true; }
    }
  }
  if (progress.shopName && progress.shopName.length > 0) {
    if (!dismissed.has("shop_name")) { dismissed.add("shop_name"); changed = true; }
  }

  if (changed) {
    localStorage.setItem(HINTS_KEY, JSON.stringify([...dismissed]));
  }
}

export interface PlacedElement {
  elementId: string;
  x: number;
  y: number;
  scale: number;
  color?: string;
}

export interface FixedItemPosition {
  id: string;
  x: number;
  y: number;
  scale: number;
}

export interface FurniturePosition {
  id: string;
  x: number;
  y: number;
  scale: number;
}

export interface FestivityProgress {
  quizCompleted: boolean;
  quizScore: number;
  /** Best score per quiz block (e.g. "valentines_level1_block1" -> 5). Used to compute quizScore. */
  quizBlockScores?: Record<string, number>;
  unlockedElements: string[];
  placedElements: PlacedElement[];
  fixedItemPositions?: FixedItemPosition[];
  furniturePositions?: FurniturePosition[];
  bgColor?: string;
  lightsOn?: boolean[];
  lightColor?: string;
}

export interface Screenshot {
  id: string;
  festivityId: string;
  dataUrl: string;
  timestamp: number;
}

export interface GameProgress {
  festivities: Record<string, FestivityProgress>;
  totalQuizzesCompleted: number;
  shopName?: string;
}

const SCREENSHOTS_KEY = "window-display-screenshots";

export function loadScreenshots(): Screenshot[] {
  try {
    const stored = localStorage.getItem(SCREENSHOTS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

export function saveScreenshot(screenshot: Screenshot): Screenshot[] {
  const screenshots = loadScreenshots();
  screenshots.push(screenshot);
  try {
    localStorage.setItem(SCREENSHOTS_KEY, JSON.stringify(screenshots));
  } catch (e) {
    console.warn("Failed to save screenshot, storage may be full:", e);
  }
  return screenshots;
}

export function deleteScreenshot(id: string): Screenshot[] {
  const screenshots = loadScreenshots().filter(s => s.id !== id);
  localStorage.setItem(SCREENSHOTS_KEY, JSON.stringify(screenshots));
  return screenshots;
}

function getDefaultProgress(): GameProgress {
  return {
    festivities: {},
    totalQuizzesCompleted: 0,
  };
}

export function loadProgress(): GameProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("Failed to load progress:", e);
  }
  return getDefaultProgress();
}

export function saveProgress(progress: GameProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn("Failed to save progress:", e);
  }
}

export function getFestivityProgress(
  progress: GameProgress,
  festivityId: string
): FestivityProgress {
  return (
    progress.festivities[festivityId] || {
      quizCompleted: false,
      quizScore: 0,
      unlockedElements: [],
      placedElements: [],
      lightsOn: [...DEFAULT_LIGHTS],
      lightColor: "#FFD700",
    }
  );
}

export function updateFestivityProgress(
  progress: GameProgress,
  festivityId: string,
  update: Partial<FestivityProgress>
): GameProgress {
  const current = getFestivityProgress(progress, festivityId);
  const newProgress: GameProgress = {
    ...progress,
    festivities: {
      ...progress.festivities,
      [festivityId]: { ...current, ...update },
    },
  };
  saveProgress(newProgress);
  return newProgress;
}

/** Record a quiz block result and update quizScore (sum of best score per block). */
export function recordQuizBlockScore(
  progress: GameProgress,
  festivityId: string,
  level: number,
  block: number,
  score: number
): GameProgress {
  const blockId = `${festivityId.replace(/-/g, "_")}_level${level}_block${block}`;
  const current = getFestivityProgress(progress, festivityId);
  const blockScores = { ...(current.quizBlockScores || {}) };
  const prev = blockScores[blockId] ?? 0;
  blockScores[blockId] = Math.max(prev, score);
  const quizScore = Object.values(blockScores).reduce((a, b) => a + b, 0);
  return updateFestivityProgress(progress, festivityId, {
    quizBlockScores: blockScores,
    quizScore,
    quizCompleted: quizScore >= 1,
  });
}

export function resetProgress(): GameProgress {
  const fresh = getDefaultProgress();
  saveProgress(fresh);
  return fresh;
}

export const MAX_ELEMENT_COPIES = 5;

export function countElementInDisplay(placedElements: PlacedElement[], elementId: string): number {
  return placedElements.filter(p => p.elementId === elementId).length;
}

export const DEFAULT_LIGHTS: boolean[] = Array(10).fill(false);

export const LIGHT_COLOR_OPTIONS = [
  { color: "#FFD700", name: "Warm Gold" },
  { color: "#FFFFFF", name: "White" },
  { color: "#FF6B6B", name: "Red" },
  { color: "#4ECDC4", name: "Teal" },
  { color: "#A78BFA", name: "Purple" },
  { color: "#60A5FA", name: "Blue" },
  { color: "#F472B6", name: "Pink" },
  { color: "#34D399", name: "Green" },
  { color: "#FBBF24", name: "Amber" },
  { color: "#FB923C", name: "Orange" },
];

export type Season = "spring" | "summer" | "autumn" | "winter";

export const FESTIVITY_SEASON_MAP: Record<string, Season> = {
  valentines: "winter",
  easter: "spring",
  "spring-sale": "spring",
  "mothers-day": "spring",
  "summer-sale": "summer",
  "back-to-school": "autumn",
  halloween: "autumn",
  "black-friday": "autumn",
  christmas: "winter",
};

export function getSeasonTreePath(festivityId: string): string {
  const season = FESTIVITY_SEASON_MAP[festivityId] || "spring";
  return `/kawaii/tree-${season}.png`;
}

export interface FixedItemDef {
  id: string;
  name: string;
  defaultX: number;
  defaultY: number;
  defaultScale: number;
}

export const FIXED_ITEMS: FixedItemDef[] = [
  { id: "books-row", name: "Book Row", defaultX: 15, defaultY: 70, defaultScale: 1 },
  { id: "dictionary", name: "Dictionary", defaultX: 40, defaultY: 50, defaultScale: 1 },
  { id: "notebook", name: "Notebook", defaultX: 60, defaultY: 85, defaultScale: 1 },
  { id: "globe", name: "Globe", defaultX: 80, defaultY: 75, defaultScale: 1 },
  { id: "pencil-cup", name: "Pencil Cup", defaultX: 50, defaultY: 90, defaultScale: 1 },
  { id: "book-stack", name: "Book Stack", defaultX: 30, defaultY: 85, defaultScale: 1 },
];

export interface FurnitureDef {
  id: string;
  name: string;
  defaultX: number;
  defaultY: number;
  defaultScale: number;
  type: "floor" | "wall";
}

export const FURNITURE_PIECES: FurnitureDef[] = [
  { id: "bookcase-left", name: "Left Bookcase", defaultX: 18, defaultY: 75, defaultScale: 0.55, type: "floor" },
  { id: "pedestal", name: "Display Table", defaultX: 48, defaultY: 88, defaultScale: 0.6, type: "floor" },
  { id: "bookcase-right", name: "Right Shelf", defaultX: 78, defaultY: 72, defaultScale: 0.5, type: "floor" },
  { id: "shelf-1", name: "Wall Shelf 1", defaultX: 18, defaultY: 25, defaultScale: 0.65, type: "wall" },
  { id: "shelf-2", name: "Wall Shelf 2", defaultX: 45, defaultY: 20, defaultScale: 0.65, type: "wall" },
  { id: "shelf-3", name: "Wall Shelf 3", defaultX: 74, defaultY: 25, defaultScale: 0.65, type: "wall" },
  { id: "shelf-4", name: "Wall Shelf 4", defaultX: 20, defaultY: 45, defaultScale: 0.65, type: "wall" },
  { id: "shelf-5", name: "Wall Shelf 5", defaultX: 82, defaultY: 43, defaultScale: 0.6, type: "wall" },
  { id: "shelf-6", name: "Wall Shelf 6", defaultX: 53, defaultY: 42, defaultScale: 0.65, type: "wall" },
];

export function getFurniturePositions(festivityProgress: FestivityProgress): FurniturePosition[] {
  const saved = festivityProgress.furniturePositions || [];
  return FURNITURE_PIECES.map(piece => {
    const existing = saved.find(s => s.id === piece.id);
    if (existing) return { ...existing, scale: existing.scale ?? piece.defaultScale };
    return { id: piece.id, x: piece.defaultX, y: piece.defaultY, scale: piece.defaultScale };
  });
}

export function getFixedItemPositions(festivityProgress: FestivityProgress): FixedItemPosition[] {
  const saved = festivityProgress.fixedItemPositions || [];
  return FIXED_ITEMS.map(item => {
    const existing = saved.find(s => s.id === item.id);
    if (existing) return existing;
    return { id: item.id, x: item.defaultX, y: item.defaultY, scale: item.defaultScale };
  });
}
