import { Sun, Check, Sparkles, Zap, Star, Heart, Trophy, X } from "lucide-react";
import { useState } from "react";
import type { SunDayRecord } from "@/hooks/useUserData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Ritual {
  text: string;
  done: boolean;
}

interface RitualCardProps {
  rituals: Ritual[];
  onToggle: (index: number) => void;
  isComplete: boolean;
  dailyPlanPercent?: number;
  streak?: number;
  sunHistory?: SunDayRecord[];
}

// Motivational messages for each completed ritual
const MOTIVATIONAL_MESSAGES = [
  { text: "Первый шаг сделан, не сбавляй", icon: Zap },
  { text: "Ты на волне, так держать", icon: Star },
  { text: "Разгоняешься, продолжай", icon: Heart },
  { text: "Уже больше половины, сильно", icon: Sparkles },
  { text: "Дисциплина крепнет с каждым днём", icon: Trophy },
  { text: "Почти у цели, не останавливайся", icon: Zap },
  { text: "Ещё немного и утро твоё", icon: Star },
  { text: "Ты сильнее, чем вчера", icon: Heart },
  { text: "Каждый ритуал — это победа", icon: Sparkles },
  { text: "Железная воля, впечатляет", icon: Trophy },
  { text: "Финишная прямая, дожимай", icon: Zap },
  { text: "Рутина делает чемпионов", icon: Star },
  { text: "Последний рывок, ты справишься", icon: Heart },
];

const RitualCard = ({ rituals, onToggle, isComplete, dailyPlanPercent = 0, streak = 0, sunHistory = [] }: RitualCardProps) => {
  const [selectedDay, setSelectedDay] = useState<SunDayRecord | null>(null);

  const completedCount = rituals.filter(r => r.done).length;
  const missedCount = rituals.length - completedCount;
  const progressPercent = rituals.length > 0 ? Math.round((completedCount / rituals.length) * 100) : 0;

  // Sun status: 'burning' (all done), 'warm' (≤2 missed), 'gray' (>2 missed or nothing done)
  const sunStatus: 'burning' | 'warm' | 'gray' =
    completedCount === rituals.length && rituals.length > 0
      ? 'burning'
      : missedCount <= 2 && completedCount > 0
        ? 'warm'
        : 'gray';

  // Get current motivational message based on completed count
  const currentMotivation = completedCount > 0 && completedCount <= MOTIVATIONAL_MESSAGES.length
    ? MOTIVATIONAL_MESSAGES[completedCount - 1]
    : null;

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  // Create today's record for viewing
  const showTodayDetails = () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const completedRitualNames = rituals.filter(r => r.done).map(r => r.text);

    const todayRecord: SunDayRecord = {
      date: todayStr,
      status: sunStatus,
      completedRituals: completedRitualNames,
      totalRituals: rituals.length,
    };

    setSelectedDay(todayRecord);
  };

  return (
    <div className={`rounded-2xl p-3 transition-all duration-500 relative overflow-hidden flex flex-col h-full ${isComplete
        ? 'bg-habit-green shadow-card-green'
        : 'bg-card shadow-card border border-border/50'
      }`}>
      {/* Animated sun background when complete - improved */}
      {isComplete && (
        <div className="absolute -top-4 -right-4 pointer-events-none">
          <div className="relative w-24 h-24">
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-full bg-white/10 blur-xl animate-pulse" />
            {/* Middle pulsing ring */}
            <div className="absolute inset-2 rounded-full border-4 border-white/20 animate-[ping_2s_ease-in-out_infinite]" />
            {/* Inner rotating sun */}
            <div className="absolute inset-0 flex items-center justify-center animate-[spin_30s_linear_infinite]">
              <Sun className="w-16 h-16 text-white/40" strokeWidth={1.5} />
            </div>
            {/* Center bright core */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white/30 blur-sm animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-2 relative z-10">
        <div className={`text-[10px] font-bold uppercase tracking-wider ${isComplete ? 'text-white/80' : 'text-muted-foreground'
          }`}>
          Утренний ритуал
        </div>
      </div>

      <div className="flex flex-col gap-0.5 sm:gap-1 relative z-10">
        {rituals.map((ritual, idx) => (
          <div
            key={idx}
            onClick={() => onToggle(idx)}
            className={`flex items-center gap-1.5 sm:gap-2 w-full px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-md cursor-pointer transition-all duration-300 ${ritual.done
                ? isComplete
                  ? 'bg-white/20 text-white'
                  : 'bg-habit-green/10 text-foreground'
                : isComplete
                  ? 'bg-white/10 text-white/80 hover:bg-white/15'
                  : 'bg-muted/40 text-muted-foreground hover:bg-muted/70'
              }`}
          >
            <button
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded flex items-center justify-center flex-shrink-0 transition-all duration-300 ${ritual.done
                  ? isComplete
                    ? 'bg-white shadow-sm'
                    : 'bg-habit-green shadow-sm'
                  : isComplete
                    ? 'border-2 border-white/40 hover:border-white/60'
                    : 'border-2 border-muted-foreground/30 hover:border-muted-foreground/50'
                }`}
            >
              {ritual.done && (
                <Check className={`w-2 h-2 sm:w-2.5 sm:h-2.5 ${isComplete ? 'text-habit-green' : 'text-white'} stroke-[3]`} />
              )}
            </button>
            <span className={`text-[10px] sm:text-[12px] font-medium flex-1 ${ritual.done ? 'line-through opacity-60' : ''}`}>
              {ritual.text}
            </span>
          </div>
        ))}
      </div>

      {/* Motivational message - shows after each completion */}
      {currentMotivation && !isComplete && (
        <div className="mt-auto pt-2 border-t border-border/30 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2">
            {/* Circular progress */}
            <div className="relative w-8 h-8 flex-shrink-0">
              <svg className="transform -rotate-90" width={32} height={32}>
                <circle
                  className="text-muted"
                  strokeWidth={3}
                  stroke="currentColor"
                  fill="transparent"
                  r={12}
                  cx={16}
                  cy={16}
                />
                <circle
                  className="text-habit-green transition-all duration-500"
                  strokeWidth={3}
                  strokeDasharray={12 * 2 * Math.PI}
                  strokeDashoffset={12 * 2 * Math.PI - (progressPercent / 100) * 12 * 2 * Math.PI}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={12}
                  cx={16}
                  cy={16}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[8px] font-bold text-foreground">{completedCount}/{rituals.length}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-1">
              <currentMotivation.icon className="w-3.5 h-3.5 text-streak-orange flex-shrink-0" />
              <span className="text-[9px] font-bold text-streak-orange">
                {currentMotivation.text}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Completion celebration text */}
      {isComplete && (
        <div className="mt-auto pt-2 border-t border-white/20 relative z-10">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3 h-3 text-white" />
            <span className="text-[9px] font-bold text-white">Утро прошло идеально</span>
          </div>
        </div>
      )}

      {/* Weekly sun row - bottom */}
      <div className={`mt-auto pt-2 relative z-10 ${!isComplete && !currentMotivation ? 'border-t border-border/30' : 'border-t border-white/10'}`}>
        <TooltipProvider>
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            {/* Past days (earned suns) - clickable */}
            {sunHistory.slice(-6).map((record, idx) => {
              const statusText = record.status === 'burning'
                ? '🔥 Идеальное утро'
                : record.status === 'warm'
                  ? '✨ Хорошее утро'
                  : '😔 Пропущено';
              const dateText = formatDate(record.date);
              const completedText = `${record.completedRituals?.length || 0}/${record.totalRituals || 0} ритуалов`;

              return (
                <Tooltip key={`past-${idx}`}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setSelectedDay(record)}
                      className="hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Sun
                        className={`w-3 h-3 sm:w-5 sm:h-5 transition-all ${
                          record.status === 'burning'
                            ? 'text-ritual-gold drop-shadow-[0_0_2px_rgba(255,214,10,0.6)]'
                            : record.status === 'warm'
                              ? isComplete ? 'text-white/40' : 'text-ritual-gold/35'
                              : isComplete ? 'text-white/15' : 'text-muted-foreground/15'
                        }`}
                        strokeWidth={2}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <p className="font-bold">{dateText}</p>
                      <p>{statusText}</p>
                      <p className="text-muted-foreground">{completedText}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
            {/* Today's live sun - clickable */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={showTodayDetails}
                  className="hover:scale-110 transition-transform cursor-pointer"
                >
                  <div className={`relative flex items-center justify-center ${sunStatus === 'burning' ? 'animate-pulse' : ''}`}>
                    {sunStatus === 'burning' && (
                      <div className="absolute rounded-full bg-ritual-gold/30 blur-[3px] w-4 h-4 sm:w-6 sm:h-6" />
                    )}
                    <Sun className={`w-3 h-3 sm:w-5 sm:h-5 relative z-10 transition-all duration-500 ${
                      sunStatus === 'burning'
                        ? isComplete
                          ? 'text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]'
                          : 'text-ritual-gold drop-shadow-[0_0_4px_rgba(255,214,10,0.8)]'
                        : sunStatus === 'warm'
                          ? isComplete ? 'text-white/50' : 'text-ritual-gold/50'
                          : isComplete ? 'text-white/15' : 'text-muted-foreground/15'
                    }`} strokeWidth={2} />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <p className="font-bold">Сегодня</p>
                  <p>
                    {sunStatus === 'burning'
                      ? '🔥 Идеальное утро'
                      : sunStatus === 'warm'
                        ? '✨ Хорошее утро'
                        : '😔 Пропущено'}
                  </p>
                  <p className="text-muted-foreground">{completedCount}/{rituals.length} ритуалов</p>
                  <p className="text-muted-foreground mt-1">Кликни для подробностей</p>
                </div>
              </TooltipContent>
            </Tooltip>
            {/* Future days (gray placeholders) */}
            {Array.from({ length: Math.max(0, 6 - sunHistory.slice(-6).length) }, (_, i) => (
              <Tooltip key={`future-${i}`}>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <Sun
                      className={`w-3 h-3 sm:w-5 sm:h-5 ${isComplete ? 'text-white/15' : 'text-muted-foreground/15'}`}
                      strokeWidth={2}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Будущий день</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>

      {/* Modal for day details */}
      {selectedDay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedDay(null)}
        >
          <div
            className="bg-card border border-border rounded-2xl p-5 max-w-sm w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sun className={`w-6 h-6 ${
                  selectedDay.status === 'burning'
                    ? 'text-ritual-gold'
                    : selectedDay.status === 'warm'
                      ? 'text-ritual-gold/50'
                      : 'text-muted-foreground/30'
                }`} strokeWidth={2} />
                <div>
                  <h3 className="font-bold text-foreground">
                    {formatDate(selectedDay.date)}
                    {new Date(selectedDay.date).toDateString() === new Date().toDateString() && (
                      <span className="text-habit-green ml-1">(Сегодня)</span>
                    )}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    {selectedDay.status === 'burning'
                      ? '🔥 Идеальное утро'
                      : selectedDay.status === 'warm'
                        ? '✨ Хорошее утро'
                        : '😔 Пропущено'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Прогресс</span>
                <span className="font-bold text-foreground">
                  {selectedDay.completedRituals?.length || 0}/{selectedDay.totalRituals || 0}
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    selectedDay.status === 'burning'
                      ? 'bg-ritual-gold'
                      : selectedDay.status === 'warm'
                        ? 'bg-ritual-gold/60'
                        : 'bg-muted-foreground/30'
                  }`}
                  style={{
                    width: `${selectedDay.totalRituals > 0
                      ? ((selectedDay.completedRituals?.length || 0) / selectedDay.totalRituals) * 100
                      : 0}%`
                  }}
                />
              </div>
            </div>

            {/* Completed rituals list */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                Выполненные ритуалы
              </p>
              {selectedDay.completedRituals && selectedDay.completedRituals.length > 0 ? (
                <div className="space-y-1.5">
                  {selectedDay.completedRituals.map((ritual, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-habit-green/10 rounded-lg px-3 py-2">
                      <div className="w-4 h-4 rounded bg-habit-green flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                      </div>
                      <span className="text-xs text-foreground">{ritual}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">Ничего не выполнено</p>
              )}
            </div>

            {/* Info for today */}
            {new Date(selectedDay.date).toDateString() === new Date().toDateString() && (
              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-habit-green mt-1.5 flex-shrink-0" />
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Твой результат сохранится автоматически завтра утром. Все выполненные ритуалы будут в истории.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RitualCard;
