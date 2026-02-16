interface UnlockedItem {
  type: 'decoration' | 'feature';
  id: string;
  name?: string;
  description?: string;
}

interface ResultsScreenProps {
  score: number;
  total: number;
  passScore: number;
  unlockedItems: UnlockedItem[];
  onClose: () => void;
  onRetry: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score,
  total,
  passScore,
  unlockedItems,
  onClose,
  onRetry
}) => {
  const passed = score >= passScore;
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="text-center space-y-6">
      <div className="space-y-2">
        <div className={`
          inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold
          ${passed ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}
        `} data-testid="text-final-score">
          {score}/{total}
        </div>
        <p className="text-2xl font-bold text-gray-800" data-testid="text-result-message">
          {passed ? 'Great job!' : 'Good try!'}
        </p>
        <p className="text-gray-600">
          You scored {percentage}% - Needed {passScore}/{total} to pass
        </p>
      </div>

      {unlockedItems.length > 0 ? (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
          <h3 className="text-lg font-bold text-purple-800 mb-4" data-testid="text-unlocked-heading">
            You've unlocked:
          </h3>
          <div className="space-y-3">
            {unlockedItems.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm"
                data-testid={`card-unlocked-${item.id}`}
              >
                <div className="text-left">
                  <p className="font-semibold text-gray-800">{item.name || item.id}</p>
                  <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-6">
          <p className="text-gray-600">
            Keep practicing to unlock decorations and features!
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Next unlock at {passScore + 3} points
          </p>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
          data-testid="button-retry-quiz"
        >
          Try Again
        </button>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
          data-testid="button-back-to-shop"
        >
          Back to Shop
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
