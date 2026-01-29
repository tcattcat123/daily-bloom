import { useState, useEffect, useRef } from "react";
import { LayoutGrid, LayoutList, RotateCcw, Settings, Check } from "lucide-react";
import confetti from "canvas-confetti";

import RitualCard from "@/components/RitualCard";
import CircularProgress from "@/components/CircularProgress";
import ProgressCard from "@/components/ProgressCard";
import PersonalStandardCard from "@/components/PersonalStandardCard";
import HabitSettingsModal from "@/components/HabitSettingsModal";
import { Button } from "@/components/ui/button";

const DEFAULT_RITUALS = ["Стакан воды", "Медитация", "Зарядка", "Контрастный душ"];
const DEFAULT_HABITS = ["Подъем 07:00", "Спорт", "Deep Work", "Чтение", "План"];

interface DayData {
  name: string;
  dateStr: string;
  completedIndices: number[];
}

interface Ritual {
  text: string;
  done: boolean;
}

const generateWeek = (): DayData[] => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today);
  monday.setDate(diff);

  const names = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
  const months = ["янв.", "февр.", "марта", "апр.", "мая", "июня", "июля", "авг.", "сент.", "окт.", "нояб.", "дек."];

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      name: names[i],
      dateStr: `${d.getDate()} ${months[d.getMonth()]}`,
      completedIndices: [],
    };
  });
};

const Index = () => {
  const [rituals, setRituals] = useState<Ritual[]>(
    DEFAULT_RITUALS.map((text) => ({ text, done: false }))
  );
  const [habits, setHabits] = useState<string[]>(DEFAULT_HABITS);
  const [weekData, setWeekData] = useState<DayData[]>(generateWeek);
  const [layout, setLayout] = useState<"vertical" | "horizontal">("vertical");
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const prevRitualCompleteRef = useRef(false);

  const allRitualsDone = rituals.every((r) => r.done);
  const todayIndex = (new Date().getDay() + 6) % 7;

  // Stats calculations
  const totalPossible = weekData.length * habits.length;
  const totalDone = weekData.reduce((sum, day) => sum + day.completedIndices.length, 0);
  const planPercent = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

  // Confetti on ritual completion
  useEffect(() => {
    if (allRitualsDone && !prevRitualCompleteRef.current) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { x: 0.2, y: 0.3 },
        colors: ["#ffffff", "#FFD60A", "#34C759"],
      });
    }
    prevRitualCompleteRef.current = allRitualsDone;
  }, [allRitualsDone]);

  const toggleRitual = (index: number) => {
    setRituals((prev) =>
      prev.map((r, i) => (i === index ? { ...r, done: !r.done } : r))
    );
  };

  const toggleHabit = (dayIdx: number, habitIdx: number) => {
    setWeekData((prev) =>
      prev.map((day, idx) => {
        if (idx !== dayIdx) return day;
        const arr = day.completedIndices;
        if (arr.includes(habitIdx)) {
          return { ...day, completedIndices: arr.filter((i) => i !== habitIdx) };
        } else {
          // Confetti on habit complete (vertical mode only)
          if (layout === "vertical") {
            confetti({
              particleCount: 30,
              spread: 40,
              origin: { x: 0.5, y: 0.5 },
              colors: ["#34C759"],
            });
          }
          return { ...day, completedIndices: [...arr, habitIdx] };
        }
      })
    );
  };

  const resetWeek = () => {
    if (confirm("Начать новую неделю?")) {
      setWeekData(generateWeek());
      setRituals((prev) => prev.map((r) => ({ ...r, done: false })));
    }
  };

  const handleSaveHabits = (newHabits: string[]) => {
    setHabits(newHabits);
    // Reset completed indices that are out of bounds
    setWeekData((prev) =>
      prev.map((day) => ({
        ...day,
        completedIndices: day.completedIndices.filter((i) => i < newHabits.length),
      }))
    );
  };

  const currentDate = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-foreground rounded" />
          <h1 className="text-xl font-bold text-foreground">HumanOS</h1>
          <span className="text-sm text-muted-foreground ml-2">{currentDate}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={layout === "vertical" ? "default" : "outline"}
            size="sm"
            onClick={() => setLayout("vertical")}
            className="gap-2"
          >
            <LayoutGrid className="w-4 h-4" />
            Колонки
          </Button>
          <Button
            variant={layout === "horizontal" ? "default" : "outline"}
            size="sm"
            onClick={() => setLayout("horizontal")}
            className="gap-2"
          >
            <LayoutList className="w-4 h-4" />
            Строки
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSettingsOpen(true)}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetWeek}
            className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <RotateCcw className="w-4 h-4" />
            Сброс
          </Button>
        </div>
      </header>

      {/* Stats Deck - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Ritual Card */}
        <RitualCard
          rituals={rituals}
          onToggle={toggleRitual}
          isComplete={allRitualsDone}
        />

        {/* Plan Card */}
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
            План недели
          </div>
          <div className="mt-auto">
            <div className="text-3xl font-semibold text-foreground tracking-tight">
              {planPercent}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Выполнено: {totalDone} / {totalPossible}
            </div>
            <div className="w-full h-1 bg-muted rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-foreground rounded-full transition-all duration-500"
                style={{ width: `${planPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Effectiveness Card with Circular Progress */}
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
            Эффективность
          </div>
          <div className="flex items-end justify-between mt-auto">
            <div>
              <div className="text-xs text-muted-foreground">Quality Score</div>
            </div>
            <CircularProgress value={planPercent} size={80} strokeWidth={6} />
          </div>
        </div>

        {/* Activity Card */}
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
            Активность
          </div>
          <div className="mt-auto">
            <div className="text-3xl font-semibold text-foreground tracking-tight">
              {planPercent > 0 ? Math.min(planPercent + 10, 100) : 0}%
            </div>
            <div className="flex gap-0.5 h-5 items-end mt-2">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-muted rounded-sm"
                  style={{ height: `${Math.random() * 100}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: Progress + Personal Standard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ProgressCard habits={habits} weekData={weekData} />
        <PersonalStandardCard
          habits={habits}
          weekData={weekData}
          onToggle={toggleHabit}
          onAddHabit={() => setSettingsOpen(true)}
        />
      </div>

      {/* Week View */}
      {layout === "vertical" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 overflow-x-auto pb-4">
          {weekData.map((day, dayIdx) => (
            <div key={dayIdx} className="flex flex-col gap-2 min-w-32">
              <div className="text-center mb-2">
                <div
                  className={`text-sm font-bold ${
                    dayIdx === todayIndex ? "text-habit-green" : "text-foreground"
                  }`}
                >
                  {day.name}
                </div>
                <div className="text-xs text-muted-foreground">{day.dateStr}</div>
              </div>
              {habits.map((habit, hIdx) => {
                const isDone = day.completedIndices.includes(hIdx);
                return (
                  <button
                    key={hIdx}
                    onClick={() => toggleHabit(dayIdx, hIdx)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${
                      isDone
                        ? "bg-habit-green border-habit-green text-white"
                        : "bg-card border-border hover:border-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isDone
                          ? "bg-white border-white"
                          : "border-muted-foreground"
                      }`}
                    >
                      {isDone && <Check className="w-3 h-3 text-habit-green" />}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isDone ? "text-white" : "text-muted-foreground"
                      }`}
                    >
                      {habit}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {weekData.map((day, dayIdx) => {
            const count = day.completedIndices.length;
            const isFull = count === habits.length;
            return (
              <div
                key={dayIdx}
                className="bg-card rounded-xl p-4 shadow-card flex flex-wrap items-center justify-between gap-4"
              >
                <div className="min-w-32">
                  <div
                    className={`text-sm font-bold ${
                      dayIdx === todayIndex ? "text-habit-green" : "text-foreground"
                    }`}
                  >
                    {day.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{day.dateStr}</div>
                </div>
                <div className="flex flex-wrap gap-2 flex-1">
                  {habits.map((habit, hIdx) => {
                    const isDone = day.completedIndices.includes(hIdx);
                    return (
                      <button
                        key={hIdx}
                        onClick={() => toggleHabit(dayIdx, hIdx)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          isDone
                            ? "bg-habit-green text-white"
                            : "bg-chip-bg text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {habit}
                      </button>
                    );
                  })}
                </div>
                <div
                  className={`text-sm font-bold min-w-10 text-right ${
                    isFull ? "text-habit-green" : "text-muted-foreground"
                  }`}
                >
                  {count}/{habits.length}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Settings Modal */}
      <HabitSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        habits={habits}
        onSave={handleSaveHabits}
      />
    </div>
  );
};

export default Index;
