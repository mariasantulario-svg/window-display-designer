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

export const useQuiz = (festivityId: string, level: number = 1, block: number = 1) => {
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [sessionSeed, setSessionSeed] = useState(() =>
    Math.floor(Math.random() * 1_000_000),
  );

  useEffect(() => {
    const rng = createSeededRandom(
      sessionSeed + level * 1000 + block * 100000 + festivityId.length,
    );
    const raw = questionsData as QuestionRaw[] | { default: QuestionRaw[] };
    const allQuestions = Array.isArray(raw) ? raw : (raw?.default ?? []);
    const normalizedId = festivityId.replace(/-/g, "_");
    const filtered = allQuestions.filter(
      (q) => q.festivity.replace(/-/g, "_") === normalizedId && q.level === level && q.block === block,
    );
    const preparedQuestions = filtered
      .slice(0, 6)
      .map((q) => shuffleQuestion(q, rng));

    setQuestions(preparedQuestions);
    setCurrentIndex(0);
    setScore(0);
    setIsComplete(false);
    setUserAnswers([]);
  }, [festivityId, level, block]);

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
