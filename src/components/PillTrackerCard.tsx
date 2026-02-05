import { Pill, Check, Plus } from "lucide-react";

interface PillItem {
  name: string;
  time: string;
  done: boolean;
}

interface PillTrackerCardProps {
  pills: PillItem[];
  onToggle: (index: number) => void;
  onAddPill: () => void;
}

const PillTrackerCard = ({ pills, onToggle, onAddPill }: PillTrackerCardProps) => {
  const allDone = pills.length > 0 && pills.every(p => p.done);
  const doneCount = pills.filter(p => p.done).length;

  return (
    <div className={`rounded-2xl p-3 transition-all duration-300 flex flex-col h-full ${allDone
        ? 'bg-blue-500 shadow-lg'
        : 'bg-card shadow-card border border-border/50'
      }`}>
      <div className={`flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-2 ${allDone ? 'text-white/80' : 'text-muted-foreground'
        }`}>
        <span>Таблетки</span>
        <div className="flex items-center gap-1">
          <span className={`text-[9px] ${allDone ? 'text-white/70' : 'text-muted-foreground/70'}`}>
            {doneCount}/{pills.length}
          </span>
          <Pill className={`w-3.5 h-3.5 ${allDone ? 'text-white' : 'text-blue-500'}`} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {pills.map((pill, idx) => (
          <div
            key={idx}
            onClick={() => onToggle(idx)}
            className={`flex items-center justify-between gap-1.5 cursor-pointer transition-colors ${pill.done
                ? allDone ? 'text-white' : 'text-foreground'
                : allDone ? 'text-white/70' : 'text-muted-foreground'
              }`}
          >
            <div className="flex items-center gap-1.5">
              <button
                className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-all ${pill.done
                    ? allDone
                      ? 'bg-white'
                      : 'bg-blue-500'
                    : allDone
                      ? 'bg-white/20'
                      : 'border border-muted-foreground/30 hover:border-muted-foreground'
                  }`}
              >
                {pill.done && (
                  <Check className={`w-2 h-2 ${allDone ? 'text-blue-500' : 'text-white'}`} />
                )}
              </button>
              <span className="text-[10px] font-medium">
                {pill.name}
              </span>
            </div>
            <span className={`text-[9px] ${allDone ? 'text-white/60' : 'text-muted-foreground/60'
              }`}>
              {pill.time}
            </span>
          </div>
        ))}
      </div>

      {pills.length === 0 && (
        <button
          onClick={onAddPill}
          className={`w-full flex items-center justify-center gap-1 py-2 rounded-lg transition-colors ${allDone
              ? 'bg-white/20 text-white hover:bg-white/30'
              : 'bg-muted text-muted-foreground hover:bg-muted-foreground/20'
            }`}
        >
          <Plus className="w-3 h-3" />
          <span className="text-[10px]">Добавить</span>
        </button>
      )}
    </div>
  );
};

export default PillTrackerCard;
