const STORAGE_KEY = "window-display-designer-progress";

export interface PlacedElement {
  elementId: string;
  x: number;
  y: number;
  scale: number;
  color?: string;
}

export interface FestivityProgress {
  quizCompleted: boolean;
  quizScore: number;
  unlockedElements: string[];
  placedElements: PlacedElement[];
  bgColor?: string;
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
