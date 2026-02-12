import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { QuizQuestion } from "@/lib/festivities";
import { CheckCircle, XCircle, Trophy, BookOpen } from "lucide-react";

interface QuizModalProps {
  open: boolean;
  onClose: () => void;
  questions: QuizQuestion[];
  festivityName: string;
  unlockThreshold: number;
  onComplete: (score: number) => void;
}

export function QuizModal({
  open,
  onClose,
  questions,
  festivityName,
  unlockThreshold,
  onComplete,
}: QuizModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = questions[currentIndex];
  const progress = ((currentIndex + (finished ? 1 : 0)) / questions.length) * 100;

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === question.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const finalScore = score + (selectedAnswer === question.correctIndex ? 0 : 0);
      setFinished(true);
      onComplete(score + (selectedAnswer === question.correctIndex ? 0 : 0));
    }
  };

  const handleClose = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setFinished(false);
    onClose();
  };

  const passed = score >= unlockThreshold;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg" data-testid="quiz-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {festivityName} - Vocabulary Quiz
          </DialogTitle>
        </DialogHeader>

        <Progress value={progress} className="h-2 mb-3" />

        {!finished ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <Badge variant="secondary">
                Question {currentIndex + 1}/{questions.length}
              </Badge>
              <Badge variant="outline">
                Score: {score}/{questions.length}
              </Badge>
            </div>

            <p className="text-base font-bold" data-testid="quiz-question">
              {question.question}
            </p>

            <div className="flex flex-col gap-2">
              {question.options.map((option, i) => {
                let variant: "outline" | "default" | "destructive" = "outline";
                let extraClass = "";

                if (selectedAnswer !== null) {
                  if (i === question.correctIndex) {
                    extraClass = "border-2 border-green-500 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100";
                  } else if (i === selectedAnswer && i !== question.correctIndex) {
                    extraClass = "border-2 border-red-400 bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-100";
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left px-4 py-3 rounded-md border transition-all text-sm font-medium ${
                      selectedAnswer === null
                        ? "hover-elevate active-elevate-2 border-border"
                        : ""
                    } ${extraClass || "border-border"} ${
                      selectedAnswer !== null ? "cursor-default" : "cursor-pointer"
                    }`}
                    data-testid={`quiz-option-${i}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {option}
                      {selectedAnswer !== null && i === question.correctIndex && (
                        <CheckCircle className="w-4 h-4 text-green-600 ml-auto flex-shrink-0" />
                      )}
                      {selectedAnswer !== null && i === selectedAnswer && i !== question.correctIndex && (
                        <XCircle className="w-4 h-4 text-red-500 ml-auto flex-shrink-0" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <Card className="p-3 bg-muted">
                <p className="text-sm text-muted-foreground">
                  {selectedAnswer === question.correctIndex ? "Correct! " : "Not quite. "}
                  {question.explanation}
                </p>
              </Card>
            )}

            {selectedAnswer !== null && (
              <Button onClick={handleNext} className="w-full" data-testid="button-next-question">
                {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4" data-testid="quiz-results">
            <Trophy className={`w-16 h-16 ${passed ? "text-yellow-500" : "text-muted-foreground"}`} />
            <h3 className="text-2xl font-bold">
              {passed ? "Great job!" : "Keep practising!"}
            </h3>
            <p className="text-lg">
              You scored <span className="font-bold text-primary">{score}</span> out of{" "}
              <span className="font-bold">{questions.length}</span>
            </p>
            {passed ? (
              <Card className="p-3 bg-accent text-accent-foreground text-center">
                <p className="text-sm font-medium">
                  You unlocked {questions.length - (questions.length - 3)} new decorative elements!
                  Check the Bonus Items panel.
                </p>
              </Card>
            ) : (
              <Card className="p-3 bg-muted text-center">
                <p className="text-sm text-muted-foreground">
                  You need at least {unlockThreshold} correct answers to unlock bonus items. Try again!
                </p>
              </Card>
            )}
            <Button onClick={handleClose} className="w-full" data-testid="button-close-quiz">
              {passed ? "Start Decorating!" : "Close & Try Again"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
