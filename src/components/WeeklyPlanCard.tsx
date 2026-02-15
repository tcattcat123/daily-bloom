import { TrendingUp, Flame, Target, Sun, Sparkles } from "lucide-react";
import CircularProgress from "./CircularProgress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DayData {
  name: string;
  dateStr: string;
  completedIndices: number[];
}

interface WeeklyPlanCardProps {
  weekData: DayData[];
  habits: string[];
  totalDone: number;
  totalPossible: number;
  planPercent: number;
  morningRitualsDone?: number;
  morningRitualsTotal?: number;
  allRitualsDone?: boolean;
}

const WeeklyPlanCard = ({
  weekData,
  habits,
  totalDone,
  totalPossible,
  planPercent,
  morningRitualsDone = 0,
  morningRitualsTotal = 4,
  allRitualsDone = false
}: WeeklyPlanCardProps) => {
  const todayIndex = (new Date().getDay() + 6) % 7;

  // Calculate streak (consecutive days with all habits done)
  let streak = 0;
  for (let i = todayIndex; i >= 0; i--) {
    if (weekData[i].completedIndices.length === habits.length) {
      streak++;
    } else {
      break;
    }
  }

  // Calculate daily percentages for mini bar chart
  const dailyProgress = weekData.map(day =>
    habits.length > 0 ? Math.round((day.completedIndices.length / habits.length) * 100) : 0
  );

  // Perfect days count
  const perfectDays = dailyProgress.filter(p => p === 100).length;

  // Morning ritual percentage
  const morningPercent = morningRitualsTotal > 0
    ? Math.round((morningRitualsDone / morningRitualsTotal) * 100)
    : 0;

  // Motivational messages based on different metrics
  const getMotivation = () => {
    if (planPercent >= 90) return { text: "Легенда! 🏆", color: "text-habit-green" };
    if (planPercent >= 80) return { text: "Невероятно! ✨", color: "text-habit-green" };
    if (planPercent >= 70) return { text: "Отличный темп! 🚀", color: "text-habit-green" };
    if (planPercent >= 60) return { text: "Хороший прогресс! 💪", color: "text-primary" };
    if (planPercent >= 50) return { text: "На верном пути! 🎯", color: "text-primary" };
    if (planPercent >= 30) return { text: "Продолжай! 🌱", color: "text-muted-foreground" };
    return { text: "Начни сегодня! ⭐", color: "text-muted-foreground" };
  };

  const motivation = getMotivation();

  // Generate waveform-style bars (multiple thin lines per day for aesthetic effect)
  const generateWaveformBars = () => {
    const bars: { height: number; isToday: boolean; isPerfect: boolean; dayIndex: number }[] = [];

    dailyProgress.forEach((percent, dayIdx) => {
      // Create 3-4 thin bars per day for waveform effect
      const numBars = 3;
      for (let i = 0; i < numBars; i++) {
        // Add slight variation for visual interest
        const variation = Math.random() * 15 - 7.5;
        const baseHeight = Math.max(percent * 0.22 + variation, 4);
        bars.push({
          height: Math.min(baseHeight, 24),
          isToday: dayIdx === todayIndex,
          isPerfect: percent === 100,
          dayIndex: dayIdx
        });
      }
    });

    return bars;
  };

  const waveformBars = generateWaveformBars();

  return (
    <div className="bg-card rounded-2xl p-3 shadow-card border border-border/50 flex flex-col h-full">
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
        План недели
      </div>

      <div className="flex items-center justify-between gap-3 mb-3">
        {/* Stats column */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            <div className="text-xl font-black text-foreground leading-none">
              {totalDone}/{totalPossible}
            </div>
            <div className="text-[9px] text-muted-foreground font-medium uppercase tracking-tight">
              выполнено за неделю
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <TooltipProvider>
              {/* Morning ritual indicator */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full cursor-help">
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span className="text-[10px] font-bold text-amber-500">{morningPercent}%</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Прогресс утреннего ритуала</p>
                </TooltipContent>
              </Tooltip>

              {/* Streak indicator - always visible */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full cursor-help ${
                    streak > 0
                      ? 'bg-streak-orange/10'
                      : 'bg-muted/30'
                  }`}>
                    <Flame className={`w-3 h-3 ${
                      streak > 0
                        ? 'text-streak-orange'
                        : 'text-muted-foreground/40'
                    }`} />
                    <span className={`text-[10px] font-bold ${
                      streak > 0
                        ? 'text-streak-orange'
                        : 'text-muted-foreground/40'
                    }`}>{streak}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {streak > 0
                      ? `Серия: ${streak} ${streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней'} подряд с полным выполнением`
                      : 'Серия дней подряд с полным выполнением всех привычек'}
                  </p>
                </TooltipContent>
              </Tooltip>

              {/* Perfect days - always visible */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full cursor-help ${
                    perfectDays > 0
                      ? 'bg-habit-green/10'
                      : 'bg-muted/30'
                  }`}>
                    <Target className={`w-3 h-3 ${
                      perfectDays > 0
                        ? 'text-habit-green'
                        : 'text-muted-foreground/40'
                    }`} />
                    <span className={`text-[10px] font-bold ${
                      perfectDays > 0
                        ? 'text-habit-green'
                        : 'text-muted-foreground/40'
                    }`}>{perfectDays}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {perfectDays > 0
                      ? `Идеальных ${perfectDays === 1 ? 'день' : 'дня/дней'} на этой неделе (100% привычек)`
                      : 'Количество дней со 100% выполнением привычек'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Right side - circular progress (Responsive size) */}
        <div className="flex-shrink-0">
          {/* Desktop size (size=140) */}
          <div className="hidden lg:block">
            <CircularProgress value={planPercent} size={140} strokeWidth={10} />
          </div>
          {/* Tablet/Mobile size (size=80) */}
          <div className="block lg:hidden">
            <CircularProgress value={planPercent} size={80} strokeWidth={6} />
          </div>
        </div>
      </div>

      {/* Manifesto text */}
      <div className={`py-2 transition-all duration-700 ${
        allRitualsDone ? 'animate-in fade-in zoom-in-95 duration-700' : ''
      }`}>
        <p className={`font-black leading-tight transition-all duration-700 text-[13px] sm:text-[15px] ${
          allRitualsDone
            ? 'text-habit-green drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]'
            : 'text-foreground/15'
        }`}>
          ТЫ МОЖЕШЬ ВСЁ
        </p>
      </div>

      <div className="mt-auto">
        {/* Waveform-style bar chart */}
        <div className="max-w-[140px] mb-2">
          <div className="flex items-end gap-[2px] h-6">
            {waveformBars.slice(0, 21).map((bar, idx) => ( // Keep it compact
              <div
                key={idx}
                className={`w-[3px] rounded-full transition-all duration-300 ${bar.isToday
                  ? 'bg-habit-green'
                  : bar.isPerfect
                    ? 'bg-habit-green/60'
                    : 'bg-muted-foreground/30'
                  }`}
                style={{
                  height: `${bar.height}px`,
                }}
              />
            ))}
          </div>

          {/* Day labels */}
          <div className="flex gap-0.5 mt-1">
            {["П", "В", "С", "Ч", "П", "С", "В"].map((day, idx) => (
              <div
                key={idx}
                className={`flex-1 text-center text-[7px] ${idx === todayIndex ? 'text-habit-green font-bold' : 'text-muted-foreground/40'
                  }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Motivational message with sparkle */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-border/30">
          {planPercent >= 50 ? (
            <TrendingUp className="w-2.5 h-2.5 text-habit-green" />
          ) : (
            <Sparkles className="w-2.5 h-2.5 text-amber-500" />
          )}
          <span className={`text-[9px] font-medium ${motivation.color}`}>
            {motivation.text}
          </span>
          {streak >= 3 && (
            <span className="text-[8px] text-muted-foreground ml-auto">
              🔥 {streak} дн. подряд
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyPlanCard;
