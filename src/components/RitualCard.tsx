import { Sun, Check, Sparkles, Zap, Star, Heart, Trophy } from "lucide-react";
import type { SunDayRecord } from "@/hooks/useUserData";

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
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          {/* Past days (earned suns) */}
          {sunHistory.slice(-6).map((record, idx) => (
            <Sun
              key={`past-${idx}`}
              className={`w-3 h-3 sm:w-5 sm:h-5 transition-all ${
                record.status === 'burning'
                  ? 'text-ritual-gold drop-shadow-[0_0_2px_rgba(255,214,10,0.6)]'
                  : record.status === 'warm'
                    ? isComplete ? 'text-white/40' : 'text-ritual-gold/35'
                    : isComplete ? 'text-white/15' : 'text-muted-foreground/15'
              }`}
              strokeWidth={2}
            />
          ))}
          {/* Today's live sun */}
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
          {/* Future days (gray placeholders) */}
          {Array.from({ length: Math.max(0, 6 - sunHistory.slice(-6).length) }, (_, i) => (
            <Sun
              key={`future-${i}`}
              className={`w-3 h-3 sm:w-5 sm:h-5 ${isComplete ? 'text-white/15' : 'text-muted-foreground/15'}`}
              strokeWidth={2}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RitualCard;
