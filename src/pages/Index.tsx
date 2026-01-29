import { useState, useEffect, useRef } from "react";
import { LayoutGrid, LayoutList, RotateCcw, Settings, Check, LogOut } from "lucide-react";
import confetti from "canvas-confetti";

import RitualCard from "@/components/RitualCard";
import CircularProgress from "@/components/CircularProgress";
import PersonalStandardCard from "@/components/PersonalStandardCard";
import PillTrackerCard from "@/components/PillTrackerCard";
import WeeklyPlanCard from "@/components/WeeklyPlanCard";
import HabitSettingsModal from "@/components/HabitSettingsModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const DEFAULT_RITUALS = ["Стакан воды", "Медитация", "Зарядка", "Контрастный душ"];
const DEFAULT_HABITS = ["Подъем 07:00", "Спорт", "Deep Work", "Чтение", "План"];
const DEFAULT_PERSONAL_HABITS = ["Подъем 07:00", "Спорт", "Deep Work", "Чтение", "План"];
const DEFAULT_PILLS = [
  { name: "Витамин D", time: "утро", done: false },
  { name: "Омега-3", time: "обед", done: false },
  { name: "Магний", time: "вечер", done: false },
];

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
  const { user, logout } = useAuth();
  const [rituals, setRituals] = useState<Ritual[]>(
    DEFAULT_RITUALS.map((text) => ({ text, done: false }))
  );
  const [habits, setHabits] = useState<string[]>(DEFAULT_HABITS);
  const [personalHabits, setPersonalHabits] = useState<string[]>(DEFAULT_PERSONAL_HABITS);
  const [pills, setPills] = useState(DEFAULT_PILLS);
  const [pillsEnabled, setPillsEnabled] = useState(false);
  const [weekData, setWeekData] = useState<DayData[]>(generateWeek);
  const [personalWeekData, setPersonalWeekData] = useState<DayData[]>(generateWeek);
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

  const togglePill = (index: number) => {
    setPills((prev) =>
      prev.map((p, i) => (i === index ? { ...p, done: !p.done } : p))
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
      setPersonalWeekData(generateWeek());
      setRituals((prev) => prev.map((r) => ({ ...r, done: false })));
      setPills((prev) => prev.map((p) => ({ ...p, done: false })));
    }
  };

  const handleSaveRituals = (newRituals: Ritual[]) => {
    setRituals(newRituals);
  };

  const handleSaveHabits = (newHabits: string[]) => {
    setHabits(newHabits);
    setWeekData((prev) =>
      prev.map((day) => ({
        ...day,
        completedIndices: day.completedIndices.filter((i) => i < newHabits.length),
      }))
    );
  };

  const handleSavePersonalHabits = (newHabits: string[]) => {
    setPersonalHabits(newHabits);
    setPersonalWeekData((prev) =>
      prev.map((day) => ({
        ...day,
        completedIndices: day.completedIndices.filter((i) => i < newHabits.length),
      }))
    );
  };

  const handleSavePills = (newPills: typeof DEFAULT_PILLS) => {
    setPills(newPills);
  };

  const togglePersonalHabit = (dayIdx: number, habitIdx: number) => {
    setPersonalWeekData((prev) =>
      prev.map((day, idx) => {
        if (idx !== dayIdx) return day;
        const arr = day.completedIndices;
        if (arr.includes(habitIdx)) {
          return { ...day, completedIndices: arr.filter((i) => i !== habitIdx) };
        } else {
          return { ...day, completedIndices: [...arr, habitIdx] };
        }
      })
    );
  };

  const currentDate = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-bold">
              {user?.nickname?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-sm font-medium text-foreground">{user?.nickname || 'User'}</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-foreground rounded" />
            <h1 className="text-lg font-bold text-foreground">HumanOS</h1>
            <span className="text-xs text-muted-foreground ml-1">{currentDate}</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <div className="hidden sm:flex items-center gap-1.5 bg-habit-green/10 text-habit-green px-3 py-1.5 rounded-full">
            <span className="text-xs font-medium">💰 На ваш счёт зачислено</span>
            <span className="text-sm font-bold">12 часов</span>
            <span className="text-xs font-medium">— потратьте их с умом</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant={layout === "vertical" ? "default" : "outline"}
            size="sm"
            onClick={() => setLayout("vertical")}
            className="gap-1.5 h-8 text-xs"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Колонки
          </Button>
          <Button
            variant={layout === "horizontal" ? "default" : "outline"}
            size="sm"
            onClick={() => setLayout("horizontal")}
            className="gap-1.5 h-8 text-xs"
          >
            <LayoutList className="w-3.5 h-3.5" />
            Строки
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSettingsOpen(true)}
            className="h-8 w-8 p-0"
          >
            <Settings className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            title="Выйти"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetWeek}
            className="h-8 w-8 p-0 text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </header>

      {/* Stats Deck - Top Row: dynamic grid */}
      <div className={`grid grid-cols-2 gap-2 mb-5 ${pillsEnabled ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        {/* Ritual Card */}
        <RitualCard
          rituals={rituals}
          onToggle={toggleRitual}
          isComplete={allRitualsDone}
        />

        {/* Weekly Plan Card with mini charts */}
        <WeeklyPlanCard
          weekData={weekData}
          habits={habits}
          totalDone={totalDone}
          totalPossible={totalPossible}
          planPercent={planPercent}
          morningRitualsDone={rituals.filter(r => r.done).length}
          morningRitualsTotal={rituals.length}
        />

        {/* Pill Tracker Card - conditionally rendered */}
        {pillsEnabled && (
          <PillTrackerCard
            pills={pills}
            onToggle={togglePill}
            onAddPill={() => setSettingsOpen(true)}
          />
        )}

        {/* Personal Development Card with progress bars */}
        <PersonalStandardCard
          habits={personalHabits}
          weekData={personalWeekData}
          onToggle={togglePersonalHabit}
          onAddHabit={() => setSettingsOpen(true)}
        />
      </div>

      {/* Week View */}
      {layout === "vertical" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 overflow-x-auto pb-4">
          {weekData.map((day, dayIdx) => {
            const dayProgress = habits.length > 0 
              ? Math.round((day.completedIndices.length / habits.length) * 100) 
              : 0;
            
            return (
              <div key={dayIdx} className="flex flex-col gap-1.5 min-w-28">
                <div className="flex flex-col items-center mb-2">
                  <CircularProgress value={dayProgress} size={80} strokeWidth={6} />
                  <div className="text-center mt-1">
                    <div
                      className={`text-xs font-bold ${
                        dayIdx === todayIndex ? "text-habit-green" : "text-foreground"
                      }`}
                    >
                      {day.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{day.dateStr}</div>
                  </div>
                </div>
                {habits.map((habit, hIdx) => {
                  const isDone = day.completedIndices.includes(hIdx);
                  return (
                    <button
                      key={hIdx}
                      onClick={() => toggleHabit(dayIdx, hIdx)}
                      className={`flex items-center gap-1.5 px-2 py-2 rounded-lg border transition-all ${
                        isDone
                          ? "bg-habit-green border-habit-green text-white"
                          : "bg-card border-border hover:border-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                          isDone
                            ? "bg-white border-white"
                            : "border-muted-foreground"
                        }`}
                      >
                        {isDone && <Check className="w-2.5 h-2.5 text-habit-green" />}
                      </div>
                      <span
                        className={`text-[10px] font-medium truncate ${
                          isDone ? "text-white" : "text-muted-foreground"
                        }`}
                      >
                        {habit}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {weekData.map((day, dayIdx) => {
            const count = day.completedIndices.length;
            const isFull = count === habits.length;
            return (
              <div
                key={dayIdx}
                className="bg-card rounded-xl p-3 shadow-card flex flex-wrap items-center justify-between gap-3"
              >
                <div className="min-w-24">
                  <div
                    className={`text-xs font-bold ${
                      dayIdx === todayIndex ? "text-habit-green" : "text-foreground"
                    }`}
                  >
                    {day.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{day.dateStr}</div>
                </div>
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {habits.map((habit, hIdx) => {
                    const isDone = day.completedIndices.includes(hIdx);
                    return (
                      <button
                        key={hIdx}
                        onClick={() => toggleHabit(dayIdx, hIdx)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${
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
                  className={`text-xs font-bold min-w-8 text-right ${
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
        personalHabits={personalHabits}
        rituals={rituals}
        pills={pills}
        pillsEnabled={pillsEnabled}
        onSaveHabits={handleSaveHabits}
        onSavePersonalHabits={handleSavePersonalHabits}
        onSaveRituals={handleSaveRituals}
        onSavePills={handleSavePills}
        onTogglePills={setPillsEnabled}
      />
    </div>
  );
};

export default Index;
