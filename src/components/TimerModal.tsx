import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface TimerModalProps {
  open: boolean;
  onClose: () => void;
  minutes: number;
  onComplete: () => void;
  onTimerFinish?: () => void; // Called when timer reaches 0
}

const TimerModal = ({ open, onClose, minutes, onComplete, onTimerFinish }: TimerModalProps) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60); // seconds
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (open) {
      setTimeLeft(minutes * 60);
      setIsFinished(false);
    }
  }, [open, minutes]);

  useEffect(() => {
    if (!open || timeLeft <= 0 || isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsFinished(true);
          onTimerFinish?.(); // Notify parent that timer finished
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, timeLeft, isFinished, onTimerFinish]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const progressPercent = ((minutes * 60 - timeLeft) / (minutes * 60)) * 100;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          {!isFinished ? (
            <>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Таймер запущен!
                </h2>
                <p className="text-muted-foreground">
                  Сделай одно из дел. У тебя {minutes} {minutes === 2 ? 'минуты' : 'минут'}.
                </p>
              </div>

              {/* Circular timer */}
              <div className="relative w-48 h-48">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted/20"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - progressPercent / 100)}`}
                    className="text-primary transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-bold text-foreground">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  <X className="w-4 h-4 mr-2" />
                  Отмена
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-primary">
                  Время вышло!
                </h2>
                <p className="text-lg text-muted-foreground">
                  Ты справился с задачей?
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  <X className="w-4 h-4 mr-2" />
                  Нет
                </Button>
                <Button onClick={handleComplete} className="bg-habit-green hover:bg-habit-green/90">
                  <Check className="w-4 h-4 mr-2" />
                  Да, готово!
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimerModal;
