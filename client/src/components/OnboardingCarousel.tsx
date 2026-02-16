import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, ListChecks, Sparkles, Paintbrush, PartyPopper } from "lucide-react";

const ONBOARDING_KEY = "onboarding_completed";

const slides = [
  {
    icon: BookOpen,
    title: "Welcome to Shop Window Designer!",
    description: "Design beautiful bookshop window displays for different festivities throughout the year. Each festivity has unique decorations, quizzes, and colour palettes.",
  },
  {
    icon: ListChecks,
    title: "Choose a Festivity",
    description: "Use the dropdown at the top to pick from 9 different celebrations — from Valentine's Day to Christmas. Each one has its own theme and decorations.",
  },
  {
    icon: Sparkles,
    title: "Take Quizzes",
    description: "Answer vocabulary quizzes to unlock bonus decorations, spotlight lights, background colours, and furniture rearranging. Score higher to unlock more!",
  },
  {
    icon: Paintbrush,
    title: "Decorate!",
    description: "Click 'Decorations' at the bottom to open the panel. Click items to place them. Drag to move, use +/- to resize. You can also customise your bookshop's name on the sign above the window!",
  },
  {
    icon: PartyPopper,
    title: "Have fun!",
    description: "Create beautiful, unique displays for each festivity. Experiment with lights, colours, and decorations to make your bookshop window shine!",
  },
];

export function OnboardingCarousel() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (!completed) {
      setOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setOpen(false);
  };

  const isLast = current === slides.length - 1;
  const slide = slides[current];
  const Icon = slide.icon;

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleComplete(); }}>
      <DialogContent
        className="max-w-md p-0 overflow-hidden"
        data-testid="onboarding-carousel"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Onboarding</DialogTitle>
        <div className="flex flex-col items-center text-center p-8 gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-8 h-8 text-primary" />
          </div>

          <h2
            className="text-xl font-black"
            style={{ fontFamily: "'Architects Daughter', cursive" }}
            data-testid="onboarding-title"
            aria-hidden="true"
          >
            {slide.title}
          </h2>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm" data-testid="onboarding-description">
            {slide.description}
          </p>
        </div>

        <div className="flex items-center justify-between px-6 pb-6 gap-2">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={current === 0}
            data-testid="onboarding-prev"
          >
            Previous
          </Button>

          <div className="flex gap-1.5" data-testid="onboarding-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? "bg-primary w-4" : "bg-muted-foreground/30"
                }`}
                data-testid={`onboarding-dot-${i}`}
              />
            ))}
          </div>

          {isLast ? (
            <Button onClick={handleComplete} data-testid="onboarding-start">
              Start
            </Button>
          ) : (
            <Button onClick={handleNext} data-testid="onboarding-next">
              Next
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
