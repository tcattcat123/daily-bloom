import { Plus, Trophy } from "lucide-react";

interface PersonalStandardCardProps {
  habits: string[];
  weekData: { name: string; completedIndices: number[] }[];
  onToggle: (dayIdx: number, habitIdx: number) => void;
  onAddHabit: () => void;
  compact?: boolean;
}

const PersonalStandardCard = ({ habits, weekData, onAddHabit }: PersonalStandardCardProps) => {
  const getHabitProgress = (habitIndex: number) => {
    const completed = weekData.filter(day => 
      day.completedIndices.includes(habitIndex)
    ).length;
    return Math.round((completed / 7) * 100);
  };

  return (
    <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Личное развитие
        </div>
        <button 
          onClick={onAddHabit}
          className="w-5 h-5 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
        >
          <Plus className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>
      
      <div className="flex flex-col gap-2">
        {habits.map((habit, habitIdx) => {
          const progress = getHabitProgress(habitIdx);
          const isPerfect = progress === 100;
          
          return (
            <div key={habitIdx} className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-habit-green rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className={`text-[11px] font-bold min-w-8 text-right ${
                isPerfect ? 'text-habit-green' : 'text-muted-foreground'
              }`}>
                {progress}%
              </span>
              {isPerfect && (
                <Trophy className="w-3.5 h-3.5 text-ritual-gold" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonalStandardCard;
