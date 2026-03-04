import { useState, useEffect, useCallback } from "react";
import userSchema from "../data/user.schema.json";
import festivitiesConfig from "../data/festivities.config.json";

interface WindowState {
  backgroundColor: string;
  items: Array<{
    id: string;
    x: number;
    y: number;
    scale: number;
    color?: string;
  }>;
  furnitureLayout: string;
  lightsOn: boolean;
  lightColor: string;
}

interface QuizResult {
  festivity: string;
  level: number;
  block: number;
  score: number;
  total: number;
}

interface UserData {
  userName: string;
  totalPoints: number;
  coins: number;
  currentFestivity: string;
  completedQuizzes: string[];
  unlockedDecorations: Record<string, string[]>;
  unlockedFeatures: {
    lightColorChange: boolean;
    furnitureMove: boolean;
    premiumBackgrounds: boolean;
  };
  windowStates: Record<string, WindowState>;
  screenshots: string[];
  onboardingCompleted: boolean;
  lastVisit: string | null;
}

const STORAGE_KEY = 'windowDisplayDesigner_v1';

const mergeWithDefault = (existing: Partial<UserData>, defaultData: UserData): UserData => {
  return {
    ...defaultData,
    ...existing,
    unlockedDecorations: {
      ...defaultData.unlockedDecorations,
      ...existing.unlockedDecorations,
    },
    unlockedFeatures: {
      ...defaultData.unlockedFeatures,
      ...existing.unlockedFeatures,
    },
    windowStates: {
      ...defaultData.windowStates,
      ...existing.windowStates,
    },
  };
};

export const useProgress = () => {
  const [data, setData] = useState<UserData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const defaultData = userSchema.defaultUserData as unknown as UserData;

        if (stored) {
          const parsed = JSON.parse(stored);
          const merged = mergeWithDefault(parsed, defaultData);
          setData(merged);
        } else {
          setData(defaultData);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
        setData(userSchema.defaultUserData as unknown as UserData);
      }
      setIsLoaded(true);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (data && isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const addPoints = useCallback((points: number) => {
    setData(prev => prev ? {
      ...prev,
      totalPoints: prev.totalPoints + points
    } : null);
  }, []);

  const addCoins = useCallback((coins: number) => {
    setData(prev => prev ? {
      ...prev,
      coins: (prev.coins || 0) + coins,
    } : null);
  }, []);

  const spendCoins = useCallback((coins: number) => {
    setData(prev => {
      if (!prev) return null;
      const current = prev.coins || 0;
      if (current < coins) return prev;
      return { ...prev, coins: current - coins };
    });
  }, []);

  const unlockDecoration = useCallback((festivity: string, decorationId: string) => {
    setData(prev => {
      if (!prev) return null;

      const current = prev.unlockedDecorations[festivity] || [];
      if (current.includes(decorationId)) return prev;

      return {
        ...prev,
        unlockedDecorations: {
          ...prev.unlockedDecorations,
          [festivity]: [...current, decorationId]
        }
      };
    });
  }, []);

  const unlockFeature = useCallback((featureId: keyof UserData['unlockedFeatures']) => {
    setData(prev => prev ? {
      ...prev,
      unlockedFeatures: {
        ...prev.unlockedFeatures,
        [featureId]: true
      }
    } : null);
  }, []);

  const saveQuizResult = useCallback((result: QuizResult) => {
    setData((prev) => {
      if (!prev) return null;

      const blockId = `${result.festivity}_level${result.level}_block${result.block}`;
      const existingCompleted = prev.completedQuizzes || [];
      const completedQuizzes = existingCompleted.includes(blockId)
        ? existingCompleted
        : [...existingCompleted, blockId];

      const totalPoints = prev.totalPoints + result.score;

      console.log("[useProgress] saveQuizResult", {
        blockId,
        level: result.level,
        block: result.block,
        score: result.score,
        totalPoints,
        completedQuizzes,
      });

      // Start from previous unlocked state
      const unlockedDecorations = { ...prev.unlockedDecorations };
      const unlockedFeatures = { ...prev.unlockedFeatures };

      const festConfig = festivitiesConfig.festivities.find(
        (f) => f.id === result.festivity,
      );

      if (festConfig) {
        const currentUnlocked = unlockedDecorations[result.festivity] || [];
        const nextUnlocked = [...currentUnlocked];

        festConfig.decorations.unlockable.forEach((dec) => {
          if (totalPoints >= dec.requiredScore && !nextUnlocked.includes(dec.id)) {
            nextUnlocked.push(dec.id);
          }
        });

        unlockedDecorations[result.festivity] = nextUnlocked;
      }

      const hasBothBlocks = (level: number) => {
        const id1 = `${result.festivity}_level${level}_block1`;
        const id2 = `${result.festivity}_level${level}_block2`;
        return completedQuizzes.includes(id1) && completedQuizzes.includes(id2);
      };

      if (hasBothBlocks(3)) {
        unlockedFeatures.lightColorChange = true;
      }
      // Unlock furniture rearranging after completing grammar level 2 (both blocks).
      if (hasBothBlocks(2)) {
        unlockedFeatures.furnitureMove = true;
      }
      if (hasBothBlocks(6)) {
        unlockedFeatures.premiumBackgrounds = true;
      }

      return {
        ...prev,
        totalPoints,
        completedQuizzes,
        unlockedDecorations,
        unlockedFeatures,
      };
    });
  }, []);

  const setCurrentFestivity = useCallback((festivity: string) => {
    setData(prev => prev ? {
      ...prev,
      currentFestivity: festivity
    } : null);
  }, []);

  const saveWindowState = useCallback((festivity: string, state: Partial<WindowState>) => {
    setData(prev => {
      if (!prev) return null;

      const defaultState = (userSchema.defaultUserData.windowStates as Record<string, WindowState>).easter;
      const current = prev.windowStates[festivity] || defaultState;

      return {
        ...prev,
        windowStates: {
          ...prev.windowStates,
          [festivity]: {
            ...current,
            ...state
          }
        }
      };
    });
  }, []);

  const setUserName = useCallback((name: string) => {
    setData(prev => prev ? {
      ...prev,
      userName: name
    } : null);
  }, []);

  const completeOnboarding = useCallback(() => {
    setData(prev => prev ? {
      ...prev,
      onboardingCompleted: true,
      lastVisit: new Date().toISOString()
    } : null);
  }, []);

  const saveScreenshot = useCallback((screenshotData: string) => {
    setData(prev => prev ? {
      ...prev,
      screenshots: [...prev.screenshots, screenshotData]
    } : null);
  }, []);

  const isDecorationUnlocked = useCallback((festivity: string, decorationId: string): boolean => {
    if (!data) return false;
    const baseDecorations = ['easter_egg', 'bunny', 'basket', 'heart', 'rose', 'love_letter', 'sale_sign', 'sunflower', 'butterfly', 'carnation', 'gift_box', 'thank_you_card', 'sun', 'sunglasses', 'beach_ball', 'apple', 'pencil', 'notebook', 'pumpkin', 'ghost', 'spider_web', 'price_tag', 'shopping_bag', 'percentage', 'christmas_tree', 'snowflake', 'gift_red'];

    if (baseDecorations.includes(decorationId)) return true;
    return data.unlockedDecorations[festivity]?.includes(decorationId) || false;
  }, [data]);

  const isFeatureUnlocked = useCallback((featureId: keyof UserData['unlockedFeatures']): boolean => {
    return data?.unlockedFeatures[featureId] || false;
  }, [data]);

  const getNextUnlock = useCallback((festivity: string): { type: string; id: string; pointsNeeded: number } | null => {
    if (!data) return null;

    const config = festivitiesConfig.festivities.find(f => f.id === festivity);
    if (!config) return null;

    for (const dec of config.decorations.unlockable) {
      if (!isDecorationUnlocked(festivity, dec.id)) {
        const pointsNeeded = dec.requiredScore - data.totalPoints;
        if (pointsNeeded > 0) {
          return { type: 'decoration', id: dec.id, pointsNeeded };
        }
      }
    }

    for (const [key, feature] of Object.entries(config.features)) {
      if (!isFeatureUnlocked(key as keyof UserData['unlockedFeatures'])) {
        const pointsNeeded = feature.requiredScore - data.totalPoints;
        if (pointsNeeded > 0) {
          return { type: 'feature', id: key, pointsNeeded };
        }
      }
    }

    return null;
  }, [data, isDecorationUnlocked, isFeatureUnlocked]);

  return {
    data,
    isLoaded,

    userName: data?.userName || '',
    totalPoints: data?.totalPoints || 0,
    currentFestivity: data?.currentFestivity || 'easter',
    onboardingCompleted: data?.onboardingCompleted || false,

    addPoints,
    addCoins,
    spendCoins,
    unlockDecoration,
    unlockFeature,
    saveQuizResult,
    setCurrentFestivity,
    saveWindowState,
    setUserName,
    completeOnboarding,
    saveScreenshot,

    isDecorationUnlocked,
    isFeatureUnlocked,
    getNextUnlock,

    windowStates: data?.windowStates || {},
    completedQuizzes: data?.completedQuizzes || [],
    coins: data?.coins || 0,
  };
};

export default useProgress;
