import { useState } from "react";
import { Plus, Trophy, Check, Flame, Target, Zap, Mountain, Star, Brain, ChevronLeft, ChevronRight } from "lucide-react";
import NeuronHistoryModal from "./NeuronHistoryModal";
import TimerModal from "./TimerModal";
import type { NeuronWeekRecord } from "@/hooks/useUserData";

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
  neuronHistory?: NeuronWeekRecord[];
  compact?: boolean;
  demoActive?: boolean;
}

// Get dot status for a day: 'full' (all done), 'partial' (≥2 done), 'empty' (< 2 done)
const getDotStatus = (completedCount: number, totalHabits: number): 'full' | 'partial' | 'empty' => {
  if (totalHabits === 0) return 'empty';
  if (completedCount >= totalHabits) return 'full';
  if (completedCount >= 2) return 'partial';
  return 'empty';
};

const PersonalStandardCard = ({ habits, weekData, onToggle, onAddHabit, neuronHistory = [], demoActive = false }: PersonalStandardCardProps) => {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, 1 = last week, etc.
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(2);
  const [timerHabitIndex, setTimerHabitIndex] = useState<{ day: number; habit: number } | null>(null);
  const [timerWaiting, setTimerWaiting] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const dayLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const todayIndex = (new Date().getDay() + 6) % 7;

  // Get data for the currently viewed week
  const isViewingHistory = weekOffset > 0;
  const historyIndex = neuronHistory.length - weekOffset;
  const viewedWeek = isViewingHistory && historyIndex >= 0 ? neuronHistory[historyIndex] : null;

  // Use historical data if viewing history, otherwise use current week data
  const displayHabits = viewedWeek ? viewedWeek.habitResults.map(hr => hr.name) : habits;
  const displayWeekData = viewedWeek?.weekData || weekData;

  const canGoBack = weekOffset < neuronHistory.length;
  const canGoForward = weekOffset > 0;

  // Calculate neurons for displayed week
  const displayNeurons = viewedWeek
    ? viewedWeek.neurons
    : habits.reduce((count, _, habitIdx) => {
        const completedDays = weekData.filter(day => day.completedIndices.includes(habitIdx)).length;
        return count + (completedDays >= 4 ? 1 : 0);
      }, 0);

  // Calculate total completed habits for displayed week
  const totalCompleted = displayWeekData.reduce((sum, day) => sum + day.completedIndices.length, 0);

  // Show quote after every 2nd completion (only for current week)
  const quoteIndex = !isViewingHistory && totalCompleted >= 2 ? Math.floor((totalCompleted - 1) / 2) % MOTIVATIONAL_QUOTES.length : -1;
  const currentQuote = quoteIndex >= 0 ? MOTIVATIONAL_QUOTES[quoteIndex] : null;

  const getHabitProgress = (habitIndex: number) => {
    const completed = displayWeekData.filter(day =>
      day.completedIndices.includes(habitIndex)
    ).length;
    return Math.round((completed / 7) * 100);
  };

  return (
    <div className="bg-card rounded-2xl p-3 shadow-card border border-border/50 col-span-2 lg:col-span-1 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Выработка привычек
          </div>
          {isViewingHistory && viewedWeek && (
            <div className="text-[9px] text-habit-green font-medium">
              {viewedWeek.weekStart} — {viewedWeek.weekEnd}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Navigation arrows */}
          <button
            onClick={() => setWeekOffset(prev => prev + 1)}
            disabled={!canGoBack}
            className={`w-4 h-4 flex items-center justify-center transition-colors ${
              canGoBack
                ? 'text-muted-foreground hover:text-foreground'
                : 'text-muted-foreground/20 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <button
            onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))}
            disabled={!canGoForward}
            className={`w-4 h-4 flex items-center justify-center transition-colors ${
              canGoForward
                ? 'text-muted-foreground hover:text-foreground'
                : 'text-muted-foreground/20 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-3 h-3" />
          </button>
          <button
            onClick={onAddHabit}
            className="w-4 h-4 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors ml-1"
          >
            <Plus className="w-2.5 h-2.5 text-muted-foreground" />
          </button>
        </div>
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
                  className={`text-center text-[9px] font-medium pb-1 px-0.5 ${idx === todayIndex ? 'text-habit-green font-bold' : 'text-muted-foreground'
                    }`}
                >
                  {day}
                </th>
              ))}
              <th className="pl-2"></th>
            </tr>
          </thead>
          <tbody>
            {displayHabits.map((habit, habitIdx) => {
              const progress = getHabitProgress(habitIdx);
              const isPerfect = progress === 100;

              return (
                <tr key={habitIdx}>
                  <td className="text-[10px] font-medium text-foreground py-1 pr-1 whitespace-nowrap">
                    {habit}
                  </td>
                  {displayWeekData.map((day, dayIdx) => {
                    const isDone = day.completedIndices.includes(habitIdx);
                    return (
                      <td key={dayIdx} className="text-center py-1 px-0.5">
                        {isViewingHistory ? (
                          // Read-only for historical weeks
                          <div
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center ${
                              isDone
                                ? 'bg-habit-green'
                                : 'border border-muted-foreground/20'
                            }`}
                          >
                            {isDone && <Check className="w-2 h-2 text-white" />}
                          </div>
                        ) : (
                          // Interactive for current week
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
                        )}
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
                      <span className={`text-[8px] font-bold min-w-5 ${isPerfect ? 'text-habit-green' : 'text-muted-foreground'
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

      <div className="mt-auto">
        {/* Motivational quote - shows after every 2nd completion */}
        {currentQuote && (
          <div className="mt-2 pt-2 border-t border-border/30 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-start gap-2">
              <currentQuote.icon className="w-4 h-4 text-ritual-gold flex-shrink-0 mt-0.5" />
              <p className="text-[11px] font-medium text-muted-foreground leading-relaxed italic">
                "{currentQuote.text}"
              </p>
            </div>
          </div>
        )}

        {/* Daily streak dots - chain of progress */}
        <div className="mt-3 pt-2 border-t border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {displayWeekData.map((day, idx) => {
                const completedCount = day.completedIndices.length;
                const totalHabits = displayHabits.length;
                const status = getDotStatus(completedCount, totalHabits);
                const isToday = idx === todayIndex && !isViewingHistory;

                return (
                  <div
                    key={idx}
                    className={`relative transition-all duration-300 ${isToday ? 'scale-125' : ''
                      }`}
                    title={`${day.name}: ${completedCount}/${totalHabits}`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${status === 'full'
                          ? 'bg-habit-green shadow-[0_0_6px_rgba(34,197,94,0.6)]'
                          : status === 'partial'
                            ? 'bg-habit-green/40'
                            : 'bg-muted-foreground/20'
                        }`}
                    />
                    {isToday && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-foreground/50" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Timer buttons - between dots and neuron */}
            {!isViewingHistory && (
              <div className="flex gap-2 ml-3">
                <div className="relative">
                  {/* Animated green glow - when completed or demo active */}
                  {(timerCompleted || demoActive) && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Outer glow */}
                      <div className="absolute inset-0 rounded-full bg-habit-green/20 blur-md animate-pulse" />
                      {/* Middle pulsing ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-habit-green/30 animate-[ping_2s_ease-in-out_infinite]" />
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setTimerMinutes(2);
                      setTimerHabitIndex(null);
                      setTimerOpen(true);
                      setTimerCompleted(false);
                    }}
                    className={`relative w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center transition-all shadow-sm ${
                      timerCompleted || demoActive
                        ? 'bg-habit-green text-white shadow-[0_0_12px_rgba(34,197,94,0.8)]'
                        : 'bg-destructive text-destructive-foreground hover:shadow-md hover:scale-110 active:scale-95'
                    }`}
                    title="Таймер 2 минуты"
                  >
                    2
                  </button>
                </div>
                <div className="relative">
                  {/* Animated green glow - when completed or demo active */}
                  {(timerCompleted || demoActive) && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Outer glow */}
                      <div className="absolute inset-0 rounded-full bg-habit-green/20 blur-md animate-pulse" />
                      {/* Middle pulsing ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-habit-green/30 animate-[ping_2s_ease-in-out_infinite]" />
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setTimerMinutes(5);
                      setTimerHabitIndex(null);
                      setTimerOpen(true);
                      setTimerCompleted(false);
                    }}
                    className={`relative w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center transition-all shadow-sm ${
                      timerCompleted || demoActive
                        ? 'bg-habit-green text-white shadow-[0_0_12px_rgba(34,197,94,0.8)]'
                        : 'bg-destructive text-destructive-foreground hover:shadow-md hover:scale-110 active:scale-95'
                    }`}
                    title="Таймер 5 минут"
                  >
                    5
                  </button>
                </div>
              </div>
            )}

            {/* Neuron counter - clickable */}
            <button
              onClick={() => setHistoryOpen(true)}
              className="flex items-center gap-1 hover:opacity-80 transition-opacity ml-auto"
            >
              <Brain className="w-3 h-3 text-habit-green" />
              <span className="text-[10px] font-bold text-habit-green">
                {displayNeurons}
              </span>
            </button>
          </div>
        </div>
      </div>

      <NeuronHistoryModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={neuronHistory}
        currentNeurons={habits.reduce((count, _, habitIdx) => {
          const completedDays = weekData.filter(day => day.completedIndices.includes(habitIdx)).length;
          return count + (completedDays >= 4 ? 1 : 0);
        }, 0)}
        currentTotalHabits={habits.length}
      />

      {/* Timer Modal */}
      <TimerModal
        open={timerOpen}
        onClose={() => {
          setTimerOpen(false);
          setTimerWaiting(false);
        }}
        minutes={timerMinutes}
        onComplete={() => {
          if (timerHabitIndex) {
            onToggle(timerHabitIndex.day, timerHabitIndex.habit);
          }
          setTimerOpen(false);
          setTimerHabitIndex(null);
          setTimerWaiting(false);
          setTimerCompleted(true);
          setTimeout(() => {
            setTimerCompleted(false);
          }, 3000);
        }}
        onTimerFinish={() => {
          setTimerWaiting(true);
        }}
      />
    </div>
  );
};

export default PersonalStandardCard;
