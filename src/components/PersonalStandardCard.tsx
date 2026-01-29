import { Plus, Check } from "lucide-react";

interface PersonalStandardCardProps {
  habits: string[];
  weekData: { name: string; completedIndices: number[] }[];
  onToggle: (dayIdx: number, habitIdx: number) => void;
  onAddHabit: () => void;
}

const PersonalStandardCard = ({ habits, weekData, onToggle, onAddHabit }: PersonalStandardCardProps) => {
  const dayLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const todayIndex = (new Date().getDay() + 6) % 7;

  return (
    <div className="bg-habit-green rounded-2xl p-5 shadow-card-green">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-bold text-white/80 uppercase tracking-wider">
          Личный стандарт
        </div>
        <button 
          onClick={onAddHabit}
          className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        >
          <Plus className="w-4 h-4 text-white" />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-white/70 pb-3 pr-4">
                Привычка
              </th>
              {dayLabels.map((day, idx) => (
                <th 
                  key={day} 
                  className={`text-center text-xs font-medium pb-3 px-1.5 ${
                    idx === todayIndex ? 'text-white' : 'text-white/70'
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
                <td className="text-sm font-semibold text-white py-2 pr-4 whitespace-nowrap">
                  {habit}
                </td>
                {weekData.map((day, dayIdx) => {
                  const isDone = day.completedIndices.includes(habitIdx);
                  return (
                    <td key={dayIdx} className="text-center py-2 px-1.5">
                      <button
                        onClick={() => onToggle(dayIdx, habitIdx)}
                        className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                          isDone 
                            ? 'bg-white' 
                            : 'bg-white/20 hover:bg-white/30'
                        }`}
                      >
                        {isDone && <Check className="w-4 h-4 text-habit-green" />}
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
