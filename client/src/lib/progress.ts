const STORAGE_KEY = "window-display-designer-progress";

export interface PlacedElement {
  elementId: string;
  x: number;
  y: number;
  scale: number;
  color?: string;
}

export interface FurniturePosition {
  furnitureId: string;
  x: number;
  y: number;
  scale: number;
}

export interface FestivityProgress {
  quizCompleted: boolean;
  quizScore: number;
  unlockedElements: string[];
  placedElements: PlacedElement[];
  bgColor?: string;
  furniturePositions?: FurniturePosition[];
  lightsOn?: boolean[];
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
      furniturePositions: getDefaultFurniturePositions(),
      lightsOn: [...DEFAULT_LIGHTS],
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

export interface FurnitureItem {
  id: string;
  name: string;
  imagePath: string;
  defaultX: number;
  defaultY: number;
  defaultScale: number;
}

export const FURNITURE_ITEMS: FurnitureItem[] = [
  { id: "bookshelf", name: "Bookshelf", imagePath: "/kawaii/furniture-bookshelf.png", defaultX: 15, defaultY: 70, defaultScale: 1.2 },
  { id: "display-table", name: "Display Table", imagePath: "/kawaii/furniture-display-table.png", defaultX: 50, defaultY: 80, defaultScale: 1.0 },
  { id: "tall-pedestal", name: "Tall Pedestal", imagePath: "/kawaii/furniture-tall-pedestal.png", defaultX: 80, defaultY: 65, defaultScale: 1.0 },
  { id: "wall-shelf", name: "Wall Shelf", imagePath: "/kawaii/furniture-wall-shelf.png", defaultX: 35, defaultY: 30, defaultScale: 0.9 },
  { id: "display-cabinet", name: "Display Cabinet", imagePath: "/kawaii/furniture-display-cabinet.png", defaultX: 65, defaultY: 72, defaultScale: 1.1 },
];

export function getDefaultFurniturePositions(): FurniturePosition[] {
  return FURNITURE_ITEMS.map(f => ({
    furnitureId: f.id,
    x: f.defaultX,
    y: f.defaultY,
    scale: f.defaultScale,
  }));
}

export const DEFAULT_LIGHTS: boolean[] = Array(10).fill(false);

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
