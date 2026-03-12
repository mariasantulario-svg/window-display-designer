import { useState, useEffect, useCallback } from "react";
import questionsData from "../data/questions.json";

interface QuestionRaw {
  id: string;
  festivity: string;
  level: number;
  block: number;
  question: string;
  options: string[];
  correct: number;
  translation?: string;
  category?: string;
  difficulty?: "easy" | "medium" | "hard";
  learningOutcome?: string;
}

interface ShuffledQuestion {
  id: string;
  festivity: string;
  level: number;
  block: number;
  question: string;
  options: string[];
  correctIndex: number;
  originalCorrect: number;
  translation?: string;
}

interface UserAnswer {
  questionId: string;
  selected: number;
  correct: number;
  isCorrect: boolean;
}

const createSeededRandom = (seed: number) => {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
};

const shuffleArray = <T,>(array: T[], randomFn: () => number = Math.random): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// ---- Adapt consolidated curricular JSON to QuestionRaw ----

interface ConsolidatedQuestionsFile {
  questions?: ConsolidatedQuestion[];
}

interface ConsolidatedQuestion {
  id?: string;
  question?: string;
  options?: string[];
  answer?: string;
  correct_answer?: string;
  correct?: string;
  translation?: unknown;
  festivity?: string;
  category?: string;
  difficulty?: string;
  learning_outcome?: string;
  game_tags?: string[];
}

const buildCurricularQuestionPool = (): QuestionRaw[] => {
  try {
    const raw: unknown = questionsData as unknown;
    const container = raw as ConsolidatedQuestionsFile | ConsolidatedQuestion[] | null;

    const sourceArray: ConsolidatedQuestion[] = Array.isArray(container)
      ? container
      : Array.isArray(container?.questions)
        ? (container!.questions as ConsolidatedQuestion[])
        : [];

    return sourceArray
      .map<QuestionRaw | null>((q, index) => {
        if (!q || !Array.isArray(q.options) || q.options.length === 0) {
          return null;
        }

        let festivity =
          typeof q.festivity === "string"
            ? q.festivity.trim()
            : "";

        const category =
          typeof q.category === "string" && q.category.length > 0
            ? q.category
            : undefined;

        const difficultyRaw =
          typeof q.difficulty === "string" && q.difficulty.length > 0
            ? q.difficulty.toLowerCase()
            : "medium";
        const difficulty: "easy" | "medium" | "hard" =
          difficultyRaw === "easy" || difficultyRaw === "hard"
            ? difficultyRaw
            : "medium";

        const directOutcome =
          typeof q.learning_outcome === "string" && q.learning_outcome.length > 0
            ? q.learning_outcome
            : undefined;

        const canonicalOutcomes = new Set([
          "Customer Interaction",
          "Sales Operations & Payments",
          "Product Placement & Stock",
          "Window Dressing & Composition",
        ]);

        let derivedOutcome: string | undefined =
          directOutcome && canonicalOutcomes.has(directOutcome)
            ? directOutcome
            : undefined;

        if (!derivedOutcome) {
          switch (category) {
            case "customer_interaction":
              derivedOutcome = "Customer Interaction";
              break;
            case "shop_operations":
              derivedOutcome = "Sales Operations & Payments";
              break;
            case "products_and_stock":
              derivedOutcome = "Product Placement & Stock";
              break;
            case "visual_merchandising":
              derivedOutcome = "Window Dressing & Composition";
              break;
            case "core_language":
            default:
              derivedOutcome = "Core Professional English";
              break;
          }
        }

        // Ajuste automático de festividad según el enunciado
        const questionText = (q.question || "").toLowerCase();
        if (questionText.includes("christmas")) {
          festivity = "christmas";
        } else if (questionText.includes("easter")) {
          festivity = "easter";
        } else if (questionText.includes("valentine")) {
          festivity = "valentines";
        }

        // Si aún no hay festivity, intentamos derivarla desde game_tags
        if (!festivity && Array.isArray(q.game_tags)) {
          const tags = q.game_tags.map((t) => String(t).toLowerCase());
          const setIfTag = (tag: string, value: string) => {
            if (!festivity && tags.includes(tag)) {
              festivity = value;
            }
          };
          setIfTag("halloween", "halloween");
          setIfTag("christmas", "christmas");
          setIfTag("easter", "easter");
          setIfTag("valentines", "valentines");
          setIfTag("spring", "spring");
          setIfTag("spring_sale", "spring-sale");
          setIfTag("spring-sale", "spring-sale");
          setIfTag("mothers_day", "mothers-day");
          setIfTag("mothers-day", "mothers-day");
          setIfTag("summer_sale", "summer-sale");
          setIfTag("summer-sale", "summer-sale");
          setIfTag("back_to_school", "back-to-school");
          setIfTag("back-to-school", "back-to-school");
          setIfTag("black_friday", "black-friday");
          setIfTag("black-friday", "black-friday");
        }

        const correctText = q.answer ?? q.correct_answer ?? q.correct;
        if (!correctText) return null;

        const correctIndex = q.options.indexOf(correctText);
        if (correctIndex === -1) return null;

        return {
          id: q.id ?? `Q-${index}`,
          festivity,
          // Con el banco curricular nuevo usamos el mismo conjunto
          // para todos los niveles y bloques; la dificultad se controla
          // por el propio contenido, no por level/block.
          level: 1,
          block: 1,
          question: q.question ?? "",
          options: q.options,
          translation: typeof q.translation === "string" ? q.translation : undefined,
          correct: correctIndex,
          category,
          difficulty,
          learningOutcome: derivedOutcome,
        };
      })
      .filter((q): q is QuestionRaw => q !== null);
  } catch {
    return [];
  }
};

const CURRICULAR_QUESTION_POOL: QuestionRaw[] = buildCurricularQuestionPool();

type SessionPlan = Record<string, QuestionRaw[]>;

const getDifficultyForLevel = (level: number): "easy" | "medium" | "hard" => {
  if (level <= 2) return "easy";
  if (level <= 4) return "medium";
  return "hard";
};

const buildSessionPlan = (
  festivityId: string,
  seed: number,
): SessionPlan => {
  const normalizedId = festivityId.replace(/-/g, "_");
  const rng = createSeededRandom(seed);

  // 1) Filtrado por festividad (no mezclar campañas).
  // Solo permitimos:
  // - Preguntas de la festividad actual.
  // - Preguntas marcadas explícitamente como "general".
  // - Preguntas sin campo festivity (festivity === "").
  const allowedPool = CURRICULAR_QUESTION_POOL.filter((q) => {
    const rawFest = (q.festivity || "").trim();
    if (!rawFest) return true; // sin etiqueta = general para todas

    const festNorm = rawFest.replace(/-/g, "_");
    if (festNorm === normalizedId) return true; // festividad actual

    // Solo admitimos "general" como etiqueta compartida.
    if (festNorm === "general") return true;

    // Cualquier otra festividad (christmas, halloween, etc.) queda fuera.
    return false;
  });

  const shuffled = shuffleArray(allowedPool, rng);

  // 2) Organizamos por dificultad
  const buckets: Record<"easy" | "medium" | "hard", QuestionRaw[]> = {
    easy: [],
    medium: [],
    hard: [],
  };

  for (const q of shuffled) {
    const diff = q.difficulty ?? "medium";
    buckets[diff].push(q);
  }

  const usedIds = new Set<string>();
  const plan: SessionPlan = {};

  // Helper para construir cada bloque, intentando no repetir mientras
  // queden preguntas libres; cuando se acaben, permite reutilizar.
  const makeBlockKey = (level: number, block: number) =>
    `${level}-${block}`;

  const pickBlockQuestions = (
    diff: "easy" | "medium" | "hard",
  ): QuestionRaw[] => {
    const bucket = buckets[diff];
    const result: QuestionRaw[] = [];

    // 1) Primero intentamos usar solo preguntas NO usadas globalmente
    const unused = bucket.filter((q) => !usedIds.has(q.id));
    const shuffledUnused = shuffleArray(unused, rng);
    for (const q of shuffledUnused) {
      if (result.length >= 6) break;
      result.push(q);
    }

    // 2) Si no hay suficientes, permitimos reutilizar preguntas del bucket
    if (result.length < 6) {
      const stillNeeded = 6 - result.length;
      const candidates = bucket.filter(
        (q) => !result.some((r) => r.id === q.id),
      );
      const shuffledCandidates = shuffleArray(candidates, rng);
      for (const q of shuffledCandidates) {
        if (result.length >= 6) break;
        result.push(q);
      }
    }

    // Marcamos las del bloque como usadas (para los siguientes bloques)
    for (const q of result) {
      usedIds.add(q.id);
    }

    return result;
  };

  // 3) Construimos 12 bloques (6 niveles × 2 bloques),
  // agrupando por dificultad según el nivel.
  for (let lvl = 1; lvl <= 6; lvl++) {
    const targetDiff = getDifficultyForLevel(lvl);

    // Bloque 1: primeras 6 preguntas de esa dificultad
    const block1 = pickBlockQuestions(targetDiff);
    plan[makeBlockKey(lvl, 1)] = block1;

    // Bloque 2: "espejo" del bloque 1 en dificultad, pero intentando
    // evitar repetir mientras queden preguntas libres; si no, reutiliza.
    const block2 = pickBlockQuestions(targetDiff);
    plan[makeBlockKey(lvl, 2)] = block2;
  }

  return plan;
};

const shuffleQuestion = (question: QuestionRaw, randomFn: () => number): ShuffledQuestion => {
  const correctAnswer = question.options[question.correct];
  const shuffledOptions = shuffleArray(question.options, randomFn);

  return {
    id: question.id,
    festivity: question.festivity,
    level: question.level,
    block: question.block,
    question: question.question,
    options: shuffledOptions,
    correctIndex: shuffledOptions.indexOf(correctAnswer),
    originalCorrect: question.correct,
    translation: question.translation,
  };
};

export const useQuiz = (
  festivityId: string,
  level: number = 1,
  block: number = 1,
  learningArea: string = "All Areas",
) => {
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [sessionSeed, setSessionSeed] = useState(() =>
    Math.floor(Math.random() * 1_000_000),
  );
  const [sessionPlan, setSessionPlan] = useState<SessionPlan>({});

  // Construimos el plan completo (6 niveles × 2 bloques × 6 preguntas).
  useEffect(() => {
    const plan = buildSessionPlan(festivityId, sessionSeed);
    setSessionPlan(plan);
  }, [festivityId, sessionSeed]);

  // Cada vez que cambiamos de nivel o bloque:
  // - Si el área es "All Areas": usamos el plan preasignado (12 bloques).
  // - Si hay un área concreta, construimos el pool siguiendo prioridades:
  //   1) Festividad + Área + Dificultad objetivo.
  //   2) Misma Área + misma Dificultad, aunque sean generales.
  //   3) Misma Área + dificultades inferiores, para rellenar hasta 6.
  useEffect(() => {
    const rng = createSeededRandom(
      sessionSeed + level * 1000 + block * 100000 + festivityId.length,
    );

    const normalizedId = festivityId.replace(/-/g, "_");
    const targetDiff = getDifficultyForLevel(level);

    let baseSample: QuestionRaw[] = [];

    if (!learningArea || learningArea === "All Areas") {
      // Caso original: usamos el plan de 12 bloques ya construido.
      const key = `${level}-${block}`;
      baseSample = sessionPlan[key] ?? [];

      if (!baseSample.length) {
        // Fallback defensivo si no hubiera plan para este bloque.
        let allowedPool = CURRICULAR_QUESTION_POOL.filter((q) => {
          const rawFest = (q.festivity || "").trim();
          if (!rawFest) return true;
          const festNorm = rawFest.replace(/-/g, "_");
          if (festNorm === normalizedId) return true;
          if (festNorm === "general") return true;
          return false;
        });

        const shuffledFallback = shuffleArray(allowedPool, rng);
        baseSample = shuffledFallback.slice(0, 6);
      }
    } else {
      // Área concreta seleccionada: construimos el pool con prioridades.
      const normalizedId = festivityId.replace(/-/g, "_");
      // allowedPool: mismas reglas de festividad que siempre
      let allowedPool = CURRICULAR_QUESTION_POOL.filter((q) => {
        const rawFest = (q.festivity || "").trim();
        if (!rawFest) return true;
        const festNorm = rawFest.replace(/-/g, "_");
        if (festNorm === normalizedId) return true;
        if (festNorm === "general") return true;
        return false;
      });

      // Solo preguntas del área elegida
      const areaPool = allowedPool.filter(
        (q) => q.learningOutcome === learningArea,
      );

      const takeFrom = (pool: QuestionRaw[], needed: number): void => {
        if (needed <= 0) return;
        const remaining = pool.filter(
          (q) => !baseSample.some((b) => b.id === q.id),
        );
        const shuffled = shuffleArray(remaining, rng);
        for (const q of shuffled) {
          if (baseSample.length >= 6) break;
          baseSample.push(q);
        }
      };

      // Prioridad 1 y 2: misma dificultad dentro del área (festividad actual + general
      // ya vienen controladas por allowedPool).
      const sameDiff = areaPool.filter(
        (q) => q.difficulty === targetDiff,
      );
      takeFrom(sameDiff, 6 - baseSample.length);

      // Prioridad 3: dificultades inferiores dentro del área (para rellenar).
      if (baseSample.length < 6) {
        const lowerDiffs: ("easy" | "medium")[] =
          targetDiff === "hard"
            ? ["medium", "easy"]
            : targetDiff === "medium"
              ? ["easy"]
              : [];

        for (const d of lowerDiffs) {
          if (baseSample.length >= 6) break;
          const lowerPool = areaPool.filter((q) => q.difficulty === d);
          takeFrom(lowerPool, 6 - baseSample.length);
        }
      }

      // Si aun así no llegamos a 6 (muy raro), completamos con cualquier
      // pregunta válida de la festividad + general, aunque sea de otra área,
      // para no dejar el bloque incompleto.
      if (baseSample.length < 6) {
        takeFrom(allowedPool, 6 - baseSample.length);
      }
    }

    const preparedQuestions = baseSample.map((q) =>
      shuffleQuestion(q, rng),
    );

    setQuestions(preparedQuestions);
    setCurrentIndex(0);
    setScore(0);
    setIsComplete(false);
    setUserAnswers([]);
  }, [festivityId, level, block, sessionSeed, sessionPlan, learningArea]);

  const submitAnswer = useCallback((selectedIndex: number) => {
    if (isComplete) return;

    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedIndex === currentQuestion.correctIndex;

    const newScore = isCorrect ? score + 1 : score;
    const newAnswers: UserAnswer[] = [...userAnswers, {
      questionId: currentQuestion.id,
      selected: selectedIndex,
      correct: currentQuestion.correctIndex,
      isCorrect
    }];

    setScore(newScore);
    setUserAnswers(newAnswers);

    if (currentIndex + 1 >= questions.length) {
      setIsComplete(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, questions, score, userAnswers, isComplete]);

  const resetQuiz = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setIsComplete(false);
    setUserAnswers([]);
    setSessionSeed(Math.floor(Math.random() * 1_000_000));
  }, []);

  return {
    currentQuestion: questions[currentIndex] || null,
    currentIndex,
    totalQuestions: questions.length,
    score,
    isComplete,
    userAnswers,

    submitAnswer,
    resetQuiz,

    level,
    block,
  };
};

export default useQuiz;
