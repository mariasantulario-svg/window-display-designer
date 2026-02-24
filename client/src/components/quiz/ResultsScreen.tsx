interface ResultsScreenProps {
  score: number;
  total: number;
  onClose: () => void;
  onRetry: () => void;
  onContinue?: () => void;
  isLastBlock?: boolean;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score,
  total,
  onClose,
  onRetry,
  onContinue,
  isLastBlock = false,
}) => {
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="text-center space-y-6">
      <div className="space-y-2">
        <div className={`
          inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold
          bg-blue-100 text-blue-600
        `} data-testid="text-final-score">
          {score}/{total}
        </div>
        <p className="text-2xl font-bold text-gray-800" data-testid="text-result-message">
          Block complete!
        </p>
        <p className="text-gray-600">
          You scored {percentage}% in this block.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
          data-testid="button-retry-quiz"
        >
          Retry block
        </button>
        {onContinue && (
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
            data-testid="button-continue-block"
          >
            {isLastBlock ? "Finish level" : "Continue to next block"}
          </button>
        )}
        {!onContinue && (
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
            data-testid="button-back-to-shop"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultsScreen;
