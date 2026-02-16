import { useState, useEffect, useCallback } from 'react';
import questionsBank from '../data/questions.bank.json';
import festivitiesConfig from '../data/festivities.config.json';

interface QuestionRaw {
  id: string;
  question: string;
  options: string[];
  correct: number;
  category: string;
  difficulty: number;
  festivity: string;
}

interface ShuffledQuestion extends QuestionRaw {
  correctIndex: number;
  originalCorrect: number;
}

interface UserAnswer {
  questionId: string;
  selected: number;
  correct: number;
  isCorrect: boolean;
}

interface UnlockedItem {
  type: 'decoration' | 'feature';
  id: string;
  name?: string;
  icon?: string;
  requiredScore?: number;
  maxCount?: number;
  description?: string;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const shuffleQuestion = (question: QuestionRaw): ShuffledQuestion => {
  const correctAnswer = question.options[question.correct];
  const shuffledOptions = shuffleArray(question.options);

  return {
    ...question,
    options: shuffledOptions,
    correctIndex: shuffledOptions.indexOf(correctAnswer),
    originalCorrect: question.correct
  };
};

export const useQuiz = (festivityId: string, level: number = 1) => {
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [unlockedItems, setUnlockedItems] = useState<UnlockedItem[]>([]);

  useEffect(() => {
    const config = festivitiesConfig.festivities.find(f => f.id === festivityId);
    if (!config) return;

    const levelConfig = config.quizConfig.levels.find(l => l.level === level);
    if (!levelConfig) return;

    let availableQuestions: QuestionRaw[] = [];

    if (levelConfig.difficulty === 'A1') {
      availableQuestions = [
        ...questionsBank.questions.A1.retail_basics,
        ...questionsBank.questions.A1.easter_specific.filter(q => q.festivity === festivityId || q.festivity === 'all'),
        ...questionsBank.questions.A1.valentines_specific.filter(q => q.festivity === festivityId || q.festivity === 'all'),
        ...questionsBank.questions.A1.pricing
      ];
    } else if (levelConfig.difficulty === 'A1-A2') {
      availableQuestions = [
        ...questionsBank.questions.A1.retail_basics.slice(2),
        ...questionsBank.questions.A2.visual_merchandising.slice(0, 2),
        ...questionsBank.questions.A2.customer_service.slice(0, 2)
      ];
    } else if (levelConfig.difficulty === 'A2') {
      availableQuestions = [
        ...questionsBank.questions.A2.visual_merchandising,
        ...questionsBank.questions.A2.customer_service,
        ...questionsBank.questions.A2.sales_promotions,
        ...questionsBank.questions.A2.retail_advanced
      ];
    }

    const selectedQuestions = shuffleArray(availableQuestions).slice(0, levelConfig.questions);
    const preparedQuestions = selectedQuestions.map(shuffleQuestion);

    setQuestions(preparedQuestions);
    setCurrentIndex(0);
    setScore(0);
    setIsComplete(false);
    setUserAnswers([]);
    setUnlockedItems([]);
  }, [festivityId, level]);

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

      const config = festivitiesConfig.festivities.find(f => f.id === festivityId);
      const newUnlocks: UnlockedItem[] = [];

      if (config) {
        config.decorations.unlockable.forEach(item => {
          if (newScore >= item.requiredScore && !newUnlocks.find(u => u.id === item.id)) {
            newUnlocks.push({ type: 'decoration', ...item });
          }
        });

        Object.entries(config.features).forEach(([key, feature]) => {
          if (newScore >= feature.requiredScore) {
            newUnlocks.push({ type: 'feature', id: key, ...feature });
          }
        });
      }

      setUnlockedItems(newUnlocks);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, questions, score, userAnswers, isComplete, festivityId]);

  const resetQuiz = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setIsComplete(false);
    setUserAnswers([]);
    setUnlockedItems([]);

    const remixed = questions.map(shuffleQuestion);
    setQuestions(remixed);
  }, [questions]);

  return {
    currentQuestion: questions[currentIndex] || null,
    currentIndex,
    totalQuestions: questions.length,
    score,
    isComplete,
    userAnswers,
    unlockedItems,

    submitAnswer,
    resetQuiz,

    level,
    passScore: festivitiesConfig.festivities.find(f => f.id === festivityId)?.quizConfig.levels.find(l => l.level === level)?.passScore || 2
  };
};

export default useQuiz;
