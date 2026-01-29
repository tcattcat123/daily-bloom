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
    <div className={`rounded-2xl p-4 transition-all duration-300 ${
      isComplete 
        ? 'bg-habit-green shadow-card-green' 
        : 'bg-card shadow-card border border-border/50'
    }`}>
      <div className={`flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-3 ${
        isComplete ? 'text-white/80' : 'text-muted-foreground'
      }`}>
        <span>Утренний ритуал</span>
        <Sun className={`w-4 h-4 ${isComplete ? 'text-white' : 'text-ritual-gold'}`} />
      </div>
      
      <div className="flex flex-col gap-1.5">
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
                    : 'bg-muted hover:bg-muted-foreground/20'
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
    </div>
  );
};

export default RitualCard;
