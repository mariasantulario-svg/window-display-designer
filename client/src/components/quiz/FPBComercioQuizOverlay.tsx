import { useState } from "react";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import { useFPBComercioQuiz } from "../../hooks/useFPBComercioQuiz";

interface FPBComercioQuizOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  questionCount?: number;
}

export const FPBComercioQuizOverlay: React.FC<FPBComercioQuizOverlayProps> = ({
  isOpen,
  onClose,
  questionCount = 10,
}) => {
  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    score,
    isComplete,
    submitAnswer,
    resetQuiz,
  } = useFPBComercioQuiz(questionCount);

  const [showResults, setShowResults] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setShowResults(false);
    resetQuiz();
    onClose();
  };

  const handleAnswer = (selectedIndex: number) => {
    submitAnswer(selectedIndex);
    if (currentIndex + 1 >= totalQuestions) {
      setShowResults(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              FPB Comercio · English Quiz
            </h2>
            {!showResults && (
              <p className="text-sm text-gray-500 mt-1">
                Answer the questions about payment, customer service and shop vocabulary.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close FPB quiz"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {!showResults && totalQuestions === 0 && (
            <p className="text-center text-gray-500 py-8">
              No hay preguntas disponibles en el cuestionario de FPB Comercio.
            </p>
          )}

          {!showResults && currentQuestion && totalQuestions > 0 && (
            <>
              <ProgressBar
                current={currentIndex + 1}
                total={totalQuestions}
                score={score}
              />

              <div className="mt-6">
                <QuestionCard
                  question={currentQuestion}
                  onAnswer={handleAnswer}
                  questionNumber={currentIndex + 1}
                  totalQuestions={totalQuestions}
                />
              </div>
            </>
          )}

          {showResults && (
            <div className="text-center space-y-6 py-8">
              <div className="space-y-3">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold bg-blue-100 text-blue-600">
                  {score}/{totalQuestions}
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  Quiz complete
                </p>
                <p className="text-gray-600">
                  You have finished the FPB Comercio English quiz.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FPBComercioQuizOverlay;

