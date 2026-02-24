import { useEffect, useState } from "react";
import { useQuiz } from "../../hooks/useQuiz";
import { useProgress } from "../../hooks/useProgress";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import { ResultsScreen } from "./ResultsScreen";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  festivityId: string;
  level?: number;
  /** Called when a block is completed so the main progress (unlock state) can be persisted. */
  onQuizBlockComplete?: (result: { festivityId: string; level: number; block: number; score: number }) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  festivityId,
  level = 1,
  onQuizBlockComplete,
}) => {
  const [currentLevel, setCurrentLevel] = useState(level);
  const [block, setBlock] = useState(1);

  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    score,
    isComplete,
    submitAnswer,
    resetQuiz,
  } = useQuiz(festivityId, currentLevel, block);

  const { saveQuizResult, completedQuizzes } = useProgress();
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (isComplete && !showResults) {
      saveQuizResult({
        festivity: festivityId,
        level: currentLevel,
        block,
        score,
        total: totalQuestions,
      });
      onQuizBlockComplete?.({
        festivityId,
        level: currentLevel,
        block,
        score,
      });
      setShowResults(true);
    }
  }, [isComplete, showResults, festivityId, currentLevel, block, score, totalQuestions, saveQuizResult, onQuizBlockComplete]);

  useEffect(() => {
    if (isOpen) {
      setShowResults(false);
      setCurrentLevel(level);
      setBlock(1);
      resetQuiz();
    }
  }, [isOpen, resetQuiz, level]);

  if (!isOpen) return null;

  const handleClose = () => {
    setShowResults(false);
    setBlock(1);
    setCurrentLevel(level);
    onClose();
  };

  const handleContinue = () => {
    if (block === 1) {
      setShowResults(false);
      setBlock(2);
      resetQuiz();
    } else {
      handleClose();
    }
  };

  const currentBlockId = `${festivityId}_level${currentLevel}_block${block}`;
  const isBlockCompleted = completedQuizzes.includes(currentBlockId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">

        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-800" data-testid="text-quiz-title">
              {showResults ? "Block complete" : "Test Your Knowledge"}
            </h2>
            {!showResults && (
              <p className="text-sm text-gray-500 mt-1" data-testid="text-quiz-level-info">
                Level {currentLevel} · Block {block} of 2
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
            data-testid="button-close-quiz"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 pt-2 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((lvl) => {
            const completedBothBlocks =
              completedQuizzes.includes(`${festivityId}_level${lvl}_block1`) &&
              completedQuizzes.includes(`${festivityId}_level${lvl}_block2`);
            const isActive = lvl === currentLevel;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => {
                  setCurrentLevel(lvl);
                  setBlock(1);
                  setShowResults(false);
                  resetQuiz();
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${
                  isActive ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"
                }`}
                data-testid={`button-select-level-${lvl}`}
              >
                L{lvl}
                {completedBothBlocks && <span className="text-[10px]">✓</span>}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {!showResults && totalQuestions === 0 && (
            <p className="text-center text-gray-500 py-8" data-testid="quiz-no-questions">
              No hay preguntas para este nivel y bloque. Prueba otro nivel (L1–L6) o asegúrate de tener una temporada seleccionada (San Valentín, Pascua).
            </p>
          )}
          {!showResults && currentQuestion && (
            <>
              <ProgressBar
                current={currentIndex + 1}
                total={totalQuestions}
                score={score}
              />

              <div className="mt-6">
                <QuestionCard
                  question={currentQuestion}
                  onAnswer={submitAnswer}
                  questionNumber={currentIndex + 1}
                  totalQuestions={totalQuestions}
                />
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                <span>Current score:</span>
                <span className="font-bold text-green-600" data-testid="text-current-score">{score}</span>
                <span>/</span>
                <span>{currentIndex + (currentQuestion ? 1 : 0)}</span>
              </div>
            </>
          )}

          {showResults && (
            <ResultsScreen
              score={score}
              total={totalQuestions}
              onClose={handleClose}
              onRetry={() => {
                setShowResults(false);
                resetQuiz();
              }}
              onContinue={!isBlockCompleted ? handleContinue : undefined}
              isLastBlock={block === 2}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
