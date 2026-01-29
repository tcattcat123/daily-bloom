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
    <div className={`rounded-2xl p-5 transition-all duration-300 ${
      isComplete 
        ? 'bg-habit-green shadow-card-green' 
        : 'bg-card shadow-card border border-border/50'
    }`}>
      <div className={`flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-4 ${
        isComplete ? 'text-white/80' : 'text-muted-foreground'
      }`}>
        <span>Утренний ритуал</span>
        <Sun className={`w-4 h-4 ${isComplete ? 'text-white' : 'text-ritual-gold'}`} />
      </div>
      
      <div className="flex flex-col gap-2.5">
        {rituals.map((ritual, idx) => (
          <div
            key={idx}
            onClick={() => onToggle(idx)}
            className={`flex items-center gap-3 cursor-pointer transition-colors ${
              ritual.done 
                ? isComplete ? 'text-white' : 'text-foreground'
                : isComplete ? 'text-white/70' : 'text-muted-foreground'
            }`}
          >
            <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
              ritual.done
                ? isComplete 
                  ? 'bg-white' 
                  : 'bg-ritual-gold scale-105'
                : isComplete
                  ? 'bg-white/20'
                  : 'bg-muted'
            }`}>
              {ritual.done && (
                <Check className={`w-3 h-3 ${isComplete ? 'text-habit-green' : 'text-white'}`} />
              )}
            </div>
            <span className={`text-sm font-medium ${
              ritual.done && !isComplete ? 'line-through opacity-80' : ''
            }`}>
              {ritual.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RitualCard;
