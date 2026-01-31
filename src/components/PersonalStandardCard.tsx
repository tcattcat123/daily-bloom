import { Plus, Trophy, Check, Flame, Target, Zap, Mountain, Star } from "lucide-react";

// Motivational quotes for personal development
const MOTIVATIONAL_QUOTES = [
  { text: "Сложно — не значит невозможно.", icon: Mountain },
  { text: "Тот, кто каждый день делает хотя бы шаг, однажды окажется там, где другие даже не начинали.", icon: Target },
  { text: "Слабый может стать сильным. Ленивый — никогда.", icon: Flame },
  { text: "Взлетает лишь тот, кто не жалеет сил на разбег.", icon: Zap },
  { text: "Побеждает не самый талантливый, а тот, кто продолжает, когда все уже сдались.", icon: Trophy },
  { text: "Боль проходит. Сожаление о том, что ты не попробовал — остаётся навсегда.", icon: Star },
  { text: "Ты либо находишь причину, либо находишь путь. Третьего не дано.", icon: Target },
  { text: "Самое тёмное время суток — перед самым рассветом. Продержись ещё чуть-чуть.", icon: Mountain },
  { text: "Не жди идеального момента. Он наступит тогда, когда ты начнёшь действовать.", icon: Zap },
  { text: "Тот, кто боится проиграть — уже проиграл. Тот, кто боится не начать — проиграет дважды.", icon: Flame },
  { text: "Твоя следующая победа скрывается за тем самым страхом, который ты сейчас избегаешь.", icon: Trophy },
  { text: "Уровень твоей жизни = уровень твоей дисциплины, когда никто не смотрит.", icon: Star },
  { text: "Мечты не имеют срока годности. Бери и делай, пока жив.", icon: Flame },
  { text: "Ты не устал — ты просто ещё не разозлился по-настоящему.", icon: Zap },
];

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

  // Calculate total completed habits
  const totalCompleted = weekData.reduce((sum, day) => sum + day.completedIndices.length, 0);
  
  // Show quote after every 2nd completion (quoteIndex is 0-based, so we check >= 2)
  const quoteIndex = totalCompleted >= 2 ? Math.floor((totalCompleted - 1) / 2) % MOTIVATIONAL_QUOTES.length : -1;
  const currentQuote = quoteIndex >= 0 ? MOTIVATIONAL_QUOTES[quoteIndex] : null;

  const getHabitProgress = (habitIndex: number) => {
    const completed = weekData.filter(day => 
      day.completedIndices.includes(habitIndex)
    ).length;
    return Math.round((completed / 7) * 100);
  };

  return (
    <div className="bg-card rounded-2xl p-3 shadow-card border border-border/50 col-span-2 lg:col-span-1">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Личное развитие
        </div>
        <button 
          onClick={onAddHabit}
          className="w-4 h-4 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
        >
          <Plus className="w-2.5 h-2.5 text-muted-foreground" />
        </button>
      </div>
      
      {/* Matrix Table with Progress */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-[9px] font-medium text-muted-foreground pb-1 pr-1">
                
              </th>
              {dayLabels.map((day, idx) => (
                <th 
                  key={day} 
                  className={`text-center text-[9px] font-medium pb-1 px-0.5 ${
                    idx === todayIndex ? 'text-habit-green font-bold' : 'text-muted-foreground'
                  }`}
                >
                  {day}
                </th>
              ))}
              <th className="pl-2"></th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, habitIdx) => {
              const progress = getHabitProgress(habitIdx);
              const isPerfect = progress === 100;
              
              return (
                <tr key={habitIdx}>
                  <td className="text-[10px] font-medium text-foreground py-1 pr-1 whitespace-nowrap">
                    {habit}
                  </td>
                  {weekData.map((day, dayIdx) => {
                    const isDone = day.completedIndices.includes(habitIdx);
                    return (
                      <td key={dayIdx} className="text-center py-1 px-0.5">
                        <button
                          onClick={() => onToggle(dayIdx, habitIdx)}
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-all ${
                            isDone 
                              ? 'bg-habit-green' 
                              : 'border border-muted-foreground/30 hover:border-muted-foreground'
                          }`}
                        >
                          {isDone && <Check className="w-2 h-2 text-white" />}
                        </button>
                      </td>
                    );
                  })}
                  {/* Progress bar column */}
                  <td className="pl-2">
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-habit-green rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className={`text-[8px] font-bold min-w-5 ${
                        isPerfect ? 'text-habit-green' : 'text-muted-foreground'
                      }`}>
                        {progress}%
                      </span>
                      {isPerfect && (
                        <Trophy className="w-2 h-2 text-ritual-gold" />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Motivational quote - shows after every 2nd completion */}
      {currentQuote && (
        <div className="mt-2 pt-2 border-t border-border/30 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-start gap-2">
            <currentQuote.icon className="w-3.5 h-3.5 text-ritual-gold flex-shrink-0 mt-0.5" />
            <p className="text-[9px] font-medium text-muted-foreground leading-relaxed italic">
              "{currentQuote.text}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalStandardCard;
