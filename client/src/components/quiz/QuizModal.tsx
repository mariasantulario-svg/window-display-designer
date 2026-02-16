import { useEffect, useState } from 'react';
import { useQuiz } from '../../hooks/useQuiz';
import { useProgress } from '../../hooks/useProgress';
import { QuestionCard } from './QuestionCard';
import { ProgressBar } from './ProgressBar';
import { ResultsScreen } from './ResultsScreen';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  festivityId: string;
  level?: number;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  festivityId,
  level = 1
}) => {
  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    score,
    isComplete,
    submitAnswer,
    resetQuiz,
    passScore,
    unlockedItems
  } = useQuiz(festivityId, level);

  const { saveQuizResult, unlockDecoration, unlockFeature, addPoints } = useProgress();
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (isComplete && !showResults) {
      unlockedItems.forEach(item => {
        if (item.type === 'decoration') {
          unlockDecoration(festivityId, item.id);
        } else if (item.type === 'feature') {
          unlockFeature(item.id as 'lightColorChange' | 'furnitureMove' | 'premiumBackgrounds');
        }
      });

      saveQuizResult({
        date: new Date().toISOString(),
        festivity: festivityId,
        level,
        score,
        total: totalQuestions,
        unlockedItems: unlockedItems.map(i => i.id)
      });

      addPoints(score);

      setShowResults(true);
    }
  }, [isComplete, unlockedItems, festivityId, level, score, totalQuestions]);

  useEffect(() => {
    if (isOpen) {
      setShowResults(false);
      resetQuiz();
    }
  }, [isOpen, resetQuiz]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">

        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-800" data-testid="text-quiz-title">
              {showResults ? 'Quiz Complete!' : 'Test Your Knowledge'}
            </h2>
            {!showResults && (
              <p className="text-sm text-gray-500 mt-1" data-testid="text-quiz-level-info">
                Level {level} - Score needed: {passScore}/{totalQuestions}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
            data-testid="button-close-quiz"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
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
              passScore={passScore}
              unlockedItems={unlockedItems}
              onClose={onClose}
              onRetry={() => {
                setShowResults(false);
                resetQuiz();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
