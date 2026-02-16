const STORAGE_KEY = "window-display-designer-progress";

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

export interface FestivityProgress {
  quizCompleted: boolean;
  quizScore: number;
  unlockedElements: string[];
  placedElements: PlacedElement[];
  fixedItemPositions?: FixedItemPosition[];
  bgColor?: string;
  lightsOn?: boolean[];
  lightColor?: string;
}

export interface GameProgress {
  festivities: Record<string, FestivityProgress>;
  totalQuizzesCompleted: number;
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

export function getFixedItemPositions(festivityProgress: FestivityProgress): FixedItemPosition[] {
  const saved = festivityProgress.fixedItemPositions || [];
  return FIXED_ITEMS.map(item => {
    const existing = saved.find(s => s.id === item.id);
    if (existing) return existing;
    return { id: item.id, x: item.defaultX, y: item.defaultY, scale: item.defaultScale };
  });
}
