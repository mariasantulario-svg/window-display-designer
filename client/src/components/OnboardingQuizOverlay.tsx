import { useState, useEffect, useMemo } from "react";
import onboardingQuestions from "@/data/onboarding.questions.json";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { ProgressBar } from "@/components/quiz/ProgressBar";

interface OnboardingQuestionRaw {
  id: string;
  question: string;
  options: string[];
  correct: number;
  translation?: string;
}

interface ShuffledQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  translation?: string;
}

const createSeededRandom = (seed: number) => {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
};

const shuffleArray = <T,>(array: T[], randomFn: () => number): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

function shuffleQuestion(q: OnboardingQuestionRaw, randomFn: () => number): ShuffledQuestion {
  const correctAnswer = q.options[q.correct];
  const shuffledOptions = shuffleArray(q.options, randomFn);
  return {
    id: q.id,
    question: q.question,
    options: shuffledOptions,
    correctIndex: shuffledOptions.indexOf(correctAnswer),
    translation: q.translation,
  };
}

interface OnboardingQuizOverlayProps {
  onComplete: () => void;
}

export function OnboardingQuizOverlay({ onComplete }: OnboardingQuizOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const questions = useMemo(() => {
    const rng = createSeededRandom(12345);
    return (onboardingQuestions as OnboardingQuestionRaw[])
      .slice(0, 6)
      .map((q) => shuffleQuestion(q, rng));
  }, []);

  const currentQuestion = questions[currentIndex] ?? null;

  const submitAnswer = (selectedIndex: number) => {
    if (isComplete || !currentQuestion) return;
    const correct = selectedIndex === currentQuestion.correctIndex;
    setScore((s) => (correct ? s + 1 : s));
    if (currentIndex + 1 >= questions.length) {
      setIsComplete(true);
      setShowResults(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleEnterEscaparate = () => {
    onComplete();
  };

  if (questions.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800" data-testid="onboarding-quiz-title">
            Vocabulary quiz: shop and commerce
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Answer the 6 questions to unlock the window display.
          </p>
        </div>

        <div className="p-6">
          {!showResults && currentQuestion && (
            <>
              <ProgressBar
                current={currentIndex + 1}
                total={questions.length}
                score={score}
              />
              <div className="mt-6">
                <QuestionCard
                  question={currentQuestion}
                  onAnswer={submitAnswer}
                  questionNumber={currentIndex + 1}
                  totalQuestions={questions.length}
                />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                <span>Score:</span>
                <span className="font-bold text-green-600">{score}</span>
                <span>/</span>
                <span>{currentIndex + 1}</span>
              </div>
            </>
          )}

          {showResults && (
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold bg-blue-100 text-blue-600">
                  {score}/{questions.length}
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  Done!
                </p>
                <p className="text-gray-600">
                  You've completed the quiz. The window display is now unlocked.
                </p>
              </div>
              <button
                onClick={handleEnterEscaparate}
                className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
                data-testid="button-enter-escaparate"
              >
                Enter the window display
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
