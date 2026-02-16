import { useState } from 'react';

interface ShuffledQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
}

interface QuestionCardProps {
  question: ShuffledQuestion;
  onAnswer: (selectedIndex: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  questionNumber,
  totalQuestions
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelect = (index: number) => {
    if (showFeedback) return;

    setSelectedIndex(index);
    const correct = index === question.correctIndex;
    setIsCorrect(correct);
    setShowFeedback(true);

    setTimeout(() => {
      onAnswer(index);
      setSelectedIndex(null);
      setShowFeedback(false);
    }, 1200);
  };

  const getButtonStyle = (index: number) => {
    const baseStyle = "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 font-medium ";

    if (!showFeedback) {
      return baseStyle + "border-gray-200 hover:border-blue-400 hover:bg-blue-50 bg-white text-gray-700";
    }

    if (index === question.correctIndex) {
      return baseStyle + "border-green-500 bg-green-100 text-green-800";
    }

    if (index === selectedIndex && !isCorrect) {
      return baseStyle + "border-red-500 bg-red-100 text-red-800";
    }

    return baseStyle + "border-gray-200 bg-gray-50 text-gray-400";
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-100">
        <p className="text-lg font-semibold text-gray-800 leading-relaxed" data-testid="text-question">
          {question.question}
        </p>
        <span className="inline-block mt-2 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded" data-testid="text-question-category">
          {question.category}
        </span>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={`${question.id}-${index}`}
            onClick={() => handleSelect(index)}
            disabled={showFeedback}
            className={getButtonStyle(index)}
            data-testid={`button-option-${index}`}
          >
            <div className="flex items-center gap-3">
              <span className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${showFeedback && index === question.correctIndex ? 'bg-green-500 text-white' : ''}
                ${showFeedback && index === selectedIndex && !isCorrect ? 'bg-red-500 text-white' : ''}
                ${!showFeedback ? 'bg-gray-100 text-gray-600' : ''}
                ${showFeedback && index !== question.correctIndex && index !== selectedIndex ? 'bg-gray-200 text-gray-400' : ''}
              `}>
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
            </div>
          </button>
        ))}
      </div>

      {showFeedback && (
        <div className={`
          text-center p-4 rounded-xl font-semibold
          ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
        `} data-testid="text-answer-feedback">
          {isCorrect ? 'Correct!' : 'Incorrect'}
          {!isCorrect && (
            <p className="text-sm font-normal mt-1 text-gray-600">
              The correct answer was: {question.options[question.correctIndex]}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
