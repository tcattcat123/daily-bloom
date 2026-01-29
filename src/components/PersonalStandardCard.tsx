import { Plus, Trophy, Check } from "lucide-react";

interface PersonalStandardCardProps {
  habits: string[];
  weekData: { name: string; completedIndices: number[] }[];
  onToggle: (dayIdx: number, habitIdx: number) => void;
  onAddHabit: () => void;
  compact?: boolean;
}

const PersonalStandardCard = ({ habits, weekData, onToggle, onAddHabit }: PersonalStandardCardProps) => {
  const dayLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const todayIndex = (new Date().getDay() + 6) % 7;

  const getHabitProgress = (habitIndex: number) => {
    const completed = weekData.filter(day => 
      day.completedIndices.includes(habitIndex)
    ).length;
    return Math.round((completed / 7) * 100);
  };

  return (
    <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50 col-span-2 lg:col-span-1">
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
      
      {/* Matrix Table */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-[10px] font-medium text-muted-foreground pb-2 pr-2">
                Привычка
              </th>
              {dayLabels.map((day, idx) => (
                <th 
                  key={day} 
                  className={`text-center text-[10px] font-medium pb-2 px-1 ${
                    idx === todayIndex ? 'text-habit-green font-bold' : 'text-muted-foreground'
                  }`}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, habitIdx) => (
              <tr key={habitIdx}>
                <td className="text-[11px] font-medium text-foreground py-1.5 pr-3 whitespace-nowrap">
                  {habit}
                </td>
                {weekData.map((day, dayIdx) => {
                  const isDone = day.completedIndices.includes(habitIdx);
                  return (
                    <td key={dayIdx} className="text-center py-1.5 px-1">
                      <button
                        onClick={() => onToggle(dayIdx, habitIdx)}
                        className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                          isDone 
                            ? 'bg-habit-green' 
                            : 'border border-muted-foreground/30 hover:border-muted-foreground'
                        }`}
                      >
                        {isDone && <Check className="w-3 h-3 text-white" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Progress Bars */}
      <div className="flex flex-col gap-1.5 pt-3 border-t border-border/50">
        {habits.map((habit, habitIdx) => {
          const progress = getHabitProgress(habitIdx);
          const isPerfect = progress === 100;
          
          return (
            <div key={habitIdx} className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-habit-green rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className={`text-[10px] font-bold min-w-7 text-right ${
                isPerfect ? 'text-habit-green' : 'text-muted-foreground'
              }`}>
                {progress}%
              </span>
              {isPerfect && (
                <Trophy className="w-3 h-3 text-ritual-gold" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonalStandardCard;
