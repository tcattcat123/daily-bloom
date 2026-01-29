import { Trophy } from "lucide-react";

interface ProgressCardProps {
  habits: string[];
  weekData: { completedIndices: number[] }[];
}

const ProgressCard = ({ habits, weekData }: ProgressCardProps) => {
  const getHabitProgress = (habitIndex: number) => {
    const completed = weekData.filter(day => 
      day.completedIndices.includes(habitIndex)
    ).length;
    return Math.round((completed / 7) * 100);
  };

  return (
    <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
        Прогресс
      </div>
      <div className="flex flex-col gap-3">
        {habits.map((habit, idx) => {
          const progress = getHabitProgress(idx);
          const isComplete = progress === 100;
          
          return (
            <div key={idx} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                isComplete ? 'text-habit-green' : 'text-muted-foreground'
              }`}>
                {isComplete ? '✓' : ''}
              </div>
              <span className="text-sm font-medium text-foreground flex-1 min-w-0 truncate">
                {habit}
              </span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-24">
                <div 
                  className="h-full bg-habit-green rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className={`text-sm font-bold min-w-12 text-right ${
                isComplete ? 'text-habit-green' : 'text-muted-foreground'
              }`}>
                {progress}%
              </span>
              {isComplete && (
                <Trophy className="w-5 h-5 text-ritual-gold flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressCard;
