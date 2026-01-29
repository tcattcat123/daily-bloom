import { Plus, Check } from "lucide-react";

interface PersonalStandardCardProps {
  habits: string[];
  weekData: { name: string; completedIndices: number[] }[];
  onToggle: (dayIdx: number, habitIdx: number) => void;
  onAddHabit: () => void;
  compact?: boolean;
}

const PersonalStandardCard = ({ habits, weekData, onToggle, onAddHabit, compact = false }: PersonalStandardCardProps) => {
  const dayLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const todayIndex = (new Date().getDay() + 6) % 7;

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
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-[10px] font-medium text-muted-foreground pb-2 pr-2">
                
              </th>
              {dayLabels.map((day, idx) => (
                <th 
                  key={day} 
                  className={`text-center text-[10px] font-medium pb-2 px-0.5 ${
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
                <td className="text-[11px] font-medium text-foreground py-1 pr-2 whitespace-nowrap max-w-20 truncate">
                  {habit}
                </td>
                {weekData.map((day, dayIdx) => {
                  const isDone = day.completedIndices.includes(habitIdx);
                  return (
                    <td key={dayIdx} className="text-center py-1 px-0.5">
                      <button
                        onClick={() => onToggle(dayIdx, habitIdx)}
                        className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                          isDone 
                            ? 'bg-habit-green' 
                            : 'bg-muted hover:bg-muted-foreground/20'
                        }`}
                      >
                        {isDone && <Check className="w-2.5 h-2.5 text-white" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PersonalStandardCard;
