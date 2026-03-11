import { useState, useEffect, useCallback } from "react";
import fpbData from "../data/FPB_Comercio_English_S1-S8_Final.json";

interface FPBQuestionSource {
  id: string;
  question: string;
  options: string[];
  correct_answer?: string;
  correct?: string;
  translation?: string;
}

interface FPBUnitSessionQuestion {
  id: string;
  type: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
  translation?: string;
}

interface FPBSession {
  session_id: string;
  title: string;
  grammar_focus: string;
  vocabulary: string[];
  questions: FPBUnitSessionQuestion[];
}

interface FPBUnit {
  unit_id: number;
  unit_title: string;
  sessions: FPBSession[];
}

interface FPBFinalExamQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correct: string;
  translation?: string;
}

interface FPBData {
  units: FPBUnit[];
  final_exam: {
    exam_id: string;
    title: string;
    duration: string;
    total_questions: number;
    scoring: string;
    questions: FPBFinalExamQuestion[];
  };
}

interface ShuffledQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
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

const flattenFPBQuestions = (data: FPBData): FPBQuestionSource[] => {
  const sessionQuestions: FPBQuestionSource[] =
    data.units.flatMap((unit) =>
      unit.sessions.flatMap((session) =>
        session.questions.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correct_answer: q.correct_answer,
          translation: q.translation,
        })),
      ),
    );

  const examQuestions: FPBQuestionSource[] =
    data.final_exam.questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correct: q.correct,
      translation: q.translation,
    }));

  return [...sessionQuestions, ...examQuestions];
};

const toShuffledQuestion = (source: FPBQuestionSource, randomFn: () => number): ShuffledQuestion | null => {
  const { options } = source;
  if (!Array.isArray(options) || options.length === 0) return null;

  const correctText = source.correct_answer ?? source.correct;
  if (typeof correctText !== "string") return null;

  const correctIndex = options.indexOf(correctText);
  if (correctIndex === -1) return null;

  const shuffledOptions = shuffleArray(options, randomFn);
  const shuffledCorrectIndex = shuffledOptions.indexOf(correctText);
  if (shuffledCorrectIndex === -1) return null;

  return {
    id: source.id,
    question: source.question,
    options: shuffledOptions,
    correctIndex: shuffledCorrectIndex,
    translation: source.translation,
  };
};

const FLATTENED_SOURCES: FPBQuestionSource[] = flattenFPBQuestions(fpbData as FPBData);

export const useFPBComercioQuiz = (questionCount: number = 6) => {
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [sessionSeed, setSessionSeed] = useState(() =>
    Math.floor(Math.random() * 1_000_000),
  );

  useEffect(() => {
    const rng = createSeededRandom(sessionSeed);
    const shuffledSources = shuffleArray(FLATTENED_SOURCES, rng);
    const prepared = shuffledSources
      .map((src) => toShuffledQuestion(src, rng))
      .filter((q): q is ShuffledQuestion => q !== null)
      .slice(0, questionCount);

    setQuestions(prepared);
    setCurrentIndex(0);
    setScore(0);
    setIsComplete(false);
    setUserAnswers([]);
  }, [sessionSeed, questionCount]);

  const submitAnswer = useCallback((selectedIndex: number) => {
    if (isComplete || !questions[currentIndex]) return;

    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedIndex === currentQuestion.correctIndex;

    setScore((prev) => (isCorrect ? prev + 1 : prev));
    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selected: selectedIndex,
        correct: currentQuestion.correctIndex,
        isCorrect,
      },
    ]);

    if (currentIndex + 1 >= questions.length) {
      setIsComplete(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, questions, isComplete]);

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
  };
};

export default useFPBComercioQuiz;

