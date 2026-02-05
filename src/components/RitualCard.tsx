import { Sun, Check, Sparkles, Zap, Star, Heart, Trophy } from "lucide-react";

interface Ritual {
  text: string;
  done: boolean;
}

interface RitualCardProps {
  rituals: Ritual[];
  onToggle: (index: number) => void;
  isComplete: boolean;
  dailyPlanPercent?: number;
}

// Motivational messages for each completed ritual
const MOTIVATIONAL_MESSAGES = [
  { text: "Отличное начало! Ты молодец, продолжай! 🔥", icon: Zap },
  { text: "Ты на волне! Так держать! ⚡", icon: Star },
  { text: "Сила в тебе! Ещё чуть-чуть! 💪", icon: Heart },
  { text: "Невероятно! Не останавливайся! ✨", icon: Sparkles },
  { text: "Легенда! Ты почти у цели! 🏆", icon: Trophy },
  { text: "Ты — машина! Финишируй! 🚀", icon: Zap },
];

const RitualCard = ({ rituals, onToggle, isComplete, dailyPlanPercent = 0 }: RitualCardProps) => {
  const completedCount = rituals.filter(r => r.done).length;
  const progressPercent = rituals.length > 0 ? Math.round((completedCount / rituals.length) * 100) : 0;

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

      {/* Header with title only */}
      <div className="flex items-center justify-between mb-2 relative z-10">
        <div className={`text-[10px] font-bold uppercase tracking-wider ${isComplete ? 'text-white/80' : 'text-muted-foreground'
          }`}>
          Утренний ритуал
        </div>
      </div>

      <div className="flex flex-col gap-1.5 relative z-10">
        {rituals.map((ritual, idx) => (
          <div
            key={idx}
            onClick={() => onToggle(idx)}
            className={`flex items-center gap-2 cursor-pointer transition-all duration-300 ${ritual.done
                ? isComplete ? 'text-white' : 'text-foreground'
                : isComplete ? 'text-white/70' : 'text-muted-foreground'
              } ${ritual.done ? 'transform scale-[1.02]' : ''}`}
          >
            <button
              className={`w-4 h-4 rounded flex items-center justify-center transition-all ${ritual.done
                  ? isComplete
                    ? 'bg-white'
                    : 'bg-habit-green'
                  : isComplete
                    ? 'bg-white/20'
                    : 'border border-muted-foreground/30 hover:border-muted-foreground'
                }`}
            >
              {ritual.done && (
                <Check className={`w-2.5 h-2.5 ${isComplete ? 'text-habit-green' : 'text-white'}`} />
              )}
            </button>
            <span className={`text-[11px] font-medium ${ritual.done ? 'line-through opacity-70' : ''}`}>
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
              <span className="text-[11px] font-bold text-streak-orange">
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
            <span className="text-[10px] font-bold text-white">✨ Утро прошло идеально!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RitualCard;
