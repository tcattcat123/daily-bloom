import { TrendingUp, Flame, Target } from "lucide-react";
import CircularProgress from "./CircularProgress";

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
}

const WeeklyPlanCard = ({ weekData, habits, totalDone, totalPossible, planPercent }: WeeklyPlanCardProps) => {
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

  // Best day this week
  const bestDayPercent = Math.max(...dailyProgress);
  const bestDayIndex = dailyProgress.indexOf(bestDayPercent);

  // Perfect days count
  const perfectDays = dailyProgress.filter(p => p === 100).length;

  return (
    <div className="bg-card rounded-2xl p-3 shadow-card border border-border/50">
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
        План недели
      </div>
      
      <div className="flex items-start gap-3">
        {/* Main circular progress */}
        <CircularProgress value={planPercent} size={52} strokeWidth={4} />
        
        <div className="flex-1 min-w-0">
          {/* Stats row */}
          <div className="flex items-center gap-3 mb-2">
            <div>
              <div className="text-[11px] font-bold text-foreground">
                {totalDone}/{totalPossible}
              </div>
              <div className="text-[8px] text-muted-foreground">
                выполнено
              </div>
            </div>
            
            {/* Streak indicator */}
            {streak > 0 && (
              <div className="flex items-center gap-1 bg-streak-orange/10 px-1.5 py-0.5 rounded">
                <Flame className="w-2.5 h-2.5 text-streak-orange" />
                <span className="text-[9px] font-bold text-streak-orange">{streak}</span>
              </div>
            )}
            
            {/* Perfect days */}
            {perfectDays > 0 && (
              <div className="flex items-center gap-1 bg-habit-green/10 px-1.5 py-0.5 rounded">
                <Target className="w-2.5 h-2.5 text-habit-green" />
                <span className="text-[9px] font-bold text-habit-green">{perfectDays}</span>
              </div>
            )}
          </div>
          
          {/* Mini bar chart - daily progress */}
          <div className="flex items-end gap-0.5 h-6">
            {dailyProgress.map((percent, idx) => (
              <div 
                key={idx} 
                className="flex-1 flex flex-col items-center"
              >
                <div 
                  className={`w-full rounded-sm transition-all duration-300 ${
                    idx === todayIndex 
                      ? 'bg-habit-green' 
                      : percent === 100 
                        ? 'bg-habit-green/70' 
                        : 'bg-muted-foreground/20'
                  }`}
                  style={{ 
                    height: `${Math.max(percent * 0.2, 2)}px`,
                  }}
                />
              </div>
            ))}
          </div>
          
          {/* Day labels */}
          <div className="flex gap-0.5 mt-0.5">
            {["П", "В", "С", "Ч", "П", "С", "В"].map((day, idx) => (
              <div 
                key={idx} 
                className={`flex-1 text-center text-[7px] ${
                  idx === todayIndex ? 'text-habit-green font-bold' : 'text-muted-foreground/50'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Trend indicator */}
      {planPercent > 50 && (
        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border/30">
          <TrendingUp className="w-2.5 h-2.5 text-habit-green" />
          <span className="text-[8px] text-muted-foreground">
            {planPercent >= 80 ? 'Отличный прогресс!' : planPercent >= 60 ? 'Хороший темп' : 'Продолжай!'}
          </span>
        </div>
      )}
    </div>
  );
};

export default WeeklyPlanCard;
