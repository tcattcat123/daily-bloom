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

  const totalDone = weekData.reduce((sum, day) => sum + day.completedIndices.length, 0);
  const totalPossible = weekData.length * habits.length;
  const overallProgress = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;
  
  const perfectHabits = habits.filter((_, idx) => getHabitProgress(idx) === 100).length;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Прогресс
        </div>
        {perfectHabits > 0 && (
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3 text-ritual-gold" />
            <span className="text-[10px] font-bold text-ritual-gold">{perfectHabits}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold text-foreground">{overallProgress}%</div>
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-habit-green rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>
      
      <div className="text-[10px] text-muted-foreground mt-1">
        {totalDone}/{totalPossible} выполнено
      </div>
    </div>
  );
};

export default ProgressCard;
