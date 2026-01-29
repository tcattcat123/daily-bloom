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
    <div className={`rounded-2xl p-3 transition-all duration-300 ${
      isComplete 
        ? 'bg-habit-green shadow-card-green' 
        : 'bg-card shadow-card border border-border/50'
    }`}>
      <div className={`flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-2 ${
        isComplete ? 'text-white/80' : 'text-muted-foreground'
      }`}>
        <span>Утренний ритуал</span>
        <Sun className={`w-3.5 h-3.5 ${isComplete ? 'text-white' : 'text-ritual-gold'}`} />
      </div>
      
      <div className="flex flex-col gap-1">
        {rituals.map((ritual, idx) => (
          <div
            key={idx}
            onClick={() => onToggle(idx)}
            className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
              ritual.done 
                ? isComplete ? 'text-white' : 'text-foreground'
                : isComplete ? 'text-white/70' : 'text-muted-foreground'
            }`}
          >
            <button
              className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-all ${
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
                <Check className={`w-2 h-2 ${isComplete ? 'text-habit-green' : 'text-white'}`} />
              )}
            </button>
            <span className="text-[10px] font-medium">
              {ritual.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RitualCard;
