import { Sun, Check } from "lucide-react";

interface Ritual {
  text: string;
  done: boolean;
}

interface RitualCardProps {
  rituals: Ritual[];
  onToggle: (index: number) => void;
  isComplete: boolean;
}

const RitualCard = ({ rituals, onToggle, isComplete }: RitualCardProps) => {
  return (
    <div className={`rounded-2xl p-3 transition-all duration-500 relative overflow-hidden ${
      isComplete 
        ? 'bg-habit-green shadow-card-green' 
        : 'bg-card shadow-card border border-border/50'
    }`}>
      {/* Animated sun background when complete */}
      {isComplete && (
        <div className="absolute -top-6 -right-6 pointer-events-none">
          <div className="relative">
            {/* Pulsing glow */}
            <div className="absolute inset-0 animate-pulse">
              <Sun className="w-20 h-20 text-white/20" strokeWidth={1} />
            </div>
            {/* Rotating rays */}
            <div className="animate-[spin_20s_linear_infinite]">
              <Sun className="w-20 h-20 text-white/30" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      )}
      
      <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 relative z-10 ${
        isComplete ? 'text-white/80' : 'text-muted-foreground'
      }`}>
        Утренний ритуал
      </div>
      
      <div className="flex flex-col gap-1.5 relative z-10">
        {rituals.map((ritual, idx) => (
          <div
            key={idx}
            onClick={() => onToggle(idx)}
            className={`flex items-center gap-2 cursor-pointer transition-colors ${
              ritual.done 
                ? isComplete ? 'text-white' : 'text-foreground'
                : isComplete ? 'text-white/70' : 'text-muted-foreground'
            }`}
          >
            <button
              className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                ritual.done 
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
            <span className="text-[11px] font-medium">
              {ritual.text}
            </span>
          </div>
        ))}
      </div>
      
      {/* Completion celebration text */}
      {isComplete && (
        <div className="mt-2 pt-2 border-t border-white/20 relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-white/90">✨ Утро прошло идеально!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RitualCard;
