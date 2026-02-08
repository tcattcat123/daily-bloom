import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Brain, TrendingUp, TrendingDown, Minus, Trophy, Target } from "lucide-react";
import type { NeuronWeekRecord } from "@/hooks/useUserData";

interface NeuronHistoryModalProps {
  open: boolean;
  onClose: () => void;
  history: NeuronWeekRecord[];
  currentNeurons: number;
  currentTotalHabits: number;
}

const NeuronHistoryModal = ({ open, onClose, history, currentNeurons, currentTotalHabits }: NeuronHistoryModalProps) => {
  // Find most improved habit across all history
  const getMostImproved = () => {
    if (history.length < 2) return null;

    const habitMap = new Map<string, number[]>();
    history.forEach((week, weekIdx) => {
      week.habitResults.forEach(hr => {
        if (!habitMap.has(hr.name)) habitMap.set(hr.name, []);
        const arr = habitMap.get(hr.name)!;
        // Fill gaps with 0
        while (arr.length < weekIdx) arr.push(0);
        arr.push(hr.completedDays);
      });
    });

    let bestName = '';
    let bestGrowth = 0;

    habitMap.forEach((values, name) => {
      if (values.length < 2) return;
      const recent = values[values.length - 1];
      const prev = values[values.length - 2];
      const growth = recent - prev;
      if (growth > bestGrowth) {
        bestGrowth = growth;
        bestName = name;
      }
    });

    return bestGrowth > 0 ? { name: bestName, growth: bestGrowth } : null;
  };

  const mostImproved = getMostImproved();
  const totalNeuronsAllTime = history.reduce((sum, w) => sum + w.neurons, 0);

  const getTrend = (idx: number) => {
    if (idx === 0) return 'neutral';
    const prev = history[idx - 1].neurons;
    const curr = history[idx].neurons;
    if (curr > prev) return 'up';
    if (curr < prev) return 'down';
    return 'neutral';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-habit-green" />
            История нейронов
          </DialogTitle>
        </DialogHeader>

        {/* Current week summary */}
        <div className="bg-gradient-to-br from-habit-green/20 to-habit-green/5 rounded-xl p-4 border border-habit-green/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Текущая неделя</span>
            <span className="text-xs font-bold text-habit-green">{currentNeurons}/{currentTotalHabits}</span>
          </div>
          <div className="text-2xl font-bold text-habit-green">
            {currentNeurons} {currentNeurons === 1 ? 'нейрон' : currentNeurons >= 2 && currentNeurons <= 4 ? 'нейрона' : 'нейронов'}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">
            Привычка засчитана, если выполнена 4+ дней из 7
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-foreground">{totalNeuronsAllTime}</div>
            <div className="text-[10px] text-muted-foreground">Всего за все время</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-foreground">{history.length}</div>
            <div className="text-[10px] text-muted-foreground">{history.length === 1 ? 'неделя' : history.length >= 2 && history.length <= 4 ? 'недели' : 'недель'}</div>
          </div>
        </div>

        {/* Most improved */}
        {mostImproved && (
          <div className="flex items-center gap-2 bg-ritual-gold/10 rounded-lg px-3 py-2 border border-ritual-gold/20 mt-2">
            <Trophy className="w-4 h-4 text-ritual-gold flex-shrink-0" />
            <div>
              <div className="text-xs font-medium text-foreground">Лучший прогресс</div>
              <div className="text-[10px] text-muted-foreground">
                {mostImproved.name}: +{mostImproved.growth} дн. за последнюю неделю
              </div>
            </div>
          </div>
        )}

        {/* Weekly history */}
        {history.length > 0 ? (
          <div className="mt-3 space-y-2">
            <div className="text-xs font-medium text-muted-foreground">История по неделям:</div>
            {[...history].reverse().map((week, revIdx) => {
              const idx = history.length - 1 - revIdx;
              const trend = getTrend(idx);

              return (
                <div key={idx} className="rounded-lg border border-border/40 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">
                        {week.weekStart} — {week.weekEnd}
                      </span>
                      {trend === 'up' && <TrendingUp className="w-3 h-3 text-habit-green" />}
                      {trend === 'down' && <TrendingDown className="w-3 h-3 text-destructive" />}
                      {trend === 'neutral' && <Minus className="w-3 h-3 text-muted-foreground" />}
                    </div>
                    <span className="text-xs font-bold text-habit-green">
                      {week.neurons}/{week.totalHabits}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {week.habitResults.map((hr, hrIdx) => (
                      <div key={hrIdx} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {hr.isNeuron ? (
                            <Target className="w-3 h-3 text-habit-green" />
                          ) : (
                            <Target className="w-3 h-3 text-muted-foreground/30" />
                          )}
                          <span className={`text-[11px] ${hr.isNeuron ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                            {hr.name}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold ${hr.isNeuron ? 'text-habit-green' : 'text-muted-foreground'}`}>
                          {hr.completedDays}/7
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-muted-foreground">
            История появится после первой завершённой недели
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NeuronHistoryModal;
