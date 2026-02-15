import { useEffect, useRef, useState, useCallback } from "react";
import { Settings, Check, Play, Brain } from "lucide-react";
import confetti from "canvas-confetti";
import type { SunDayRecord } from "@/hooks/useUserData";

import RitualCard from "@/components/RitualCard";
import CircularProgress from "@/components/CircularProgress";
import PersonalStandardCard from "@/components/PersonalStandardCard";
import PillTrackerCard from "@/components/PillTrackerCard";
import WeeklyPlanCard from "@/components/WeeklyPlanCard";
import HabitSettingsModal from "@/components/HabitSettingsModal";
import SupportRayButton from "@/components/SupportRayButton";
import CalendarCard from "@/components/CalendarCard";
import TeamButton from "@/components/TeamButton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { ModeToggle } from "@/components/ModeToggle";

const APP_VERSION = '2.0.0';

const Index = () => {
  const { user, logout, isLoading: authLoading } = useAuth();
  const {
    rituals,
    habits,
    personalHabits,
    pills,
    pillsEnabled,
    calendarEnabled,
    calendarEvents,
    weekData,
    personalWeekData,
    layout,
    theme,
    statistics,
    isLoaded,
    setRituals,
    toggleRitual,
    setHabits,
    toggleHabit,
    setPersonalHabits,
    togglePersonalHabit,
    setPills,
    togglePill,
    setPillsEnabled,
    setCalendarEnabled,
    addCalendarEvent,
    removeCalendarEvent,
    setLayout,
    setTheme,
    setWeekData,
    resetWeek,
    clearAllData,
    neuronHistory,
    sunHistory,
    demoEndText,
    setDemoEndText,
  } = useUserData();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const prevRitualCompleteRef = useRef(false);

  // === DEMO MODE ===
  const [demoActive, setDemoActive] = useState(false);
  const [demoRituals, setDemoRituals] = useState<{text: string; done: boolean}[]>([]);
  const [demoWeekData, setDemoWeekData] = useState<typeof weekData>([]);
  const [demoPersonalWeekData, setDemoPersonalWeekData] = useState<typeof personalWeekData>([]);
  const [demoSunHistory, setDemoSunHistory] = useState<SunDayRecord[]>([]);
  const [demoShowTg, setDemoShowTg] = useState(false);
  const [demoBrainDay, setDemoBrainDay] = useState<number | null>(null);
  const demoTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Fake data (commented out — using real user data instead)
  // const DEMO_RITUALS = ["Медитация 10 мин", "Холодный душ", "Зарядка", "Чтение 15 мин", "Планирование дня", "Стакан воды", "Дневник благодарности"];
  // const DEMO_HABITS = ["Обучение маркетинг", "Чтение", "Английский", "Спорт", "Медитация", "Нетворкинг", "Проект"];

  const clearDemoTimeouts = useCallback(() => {
    demoTimeouts.current.forEach(t => clearTimeout(t));
    demoTimeouts.current = [];
  }, []);

  const startDemo = useCallback(() => {
    if (demoActive) return;
    clearDemoTimeouts();
    setDemoActive(true);

    // Use real user data, just reset completion state
    const initRituals = rituals.map(r => ({ ...r, done: false }));
    setDemoRituals(initRituals);
    setDemoSunHistory([]);

    // Reset weekData — keep structure, clear completions
    const initWeek = weekData.map(day => ({
      ...day,
      completedIndices: [] as number[],
    }));
    setDemoWeekData(initWeek);

    // Reset personalWeekData — keep structure, clear completions
    const initPersonalWeek = personalWeekData.map(day => ({
      ...day,
      completedIndices: [] as number[],
    }));
    setDemoPersonalWeekData(initPersonalWeek);

    const SPEED = 150; // ms between each action (2x speed)
    let step = 0;

    // Phase 1: Check off rituals one by one
    const ritualCount = rituals.length;
    for (let r = 0; r < ritualCount; r++) {
      const t = setTimeout(() => {
        setDemoRituals(prev => prev.map((rit, i) => i === r ? { ...rit, done: true } : rit));
        if (r === ritualCount - 1) {
          confetti({ particleCount: 100, spread: 80, origin: { x: 0.2, y: 0.3 }, colors: ["#ffffff", "#FFD60A", "#34C759"] });
        }
      }, SPEED * step);
      demoTimeouts.current.push(t);
      step++;
    }

    // Phase 2 + 3: Fill work habits AND personal habits in parallel
    step += 3;
    const habitsStartStep = step;

    // Work habits
    let workStep = habitsStartStep;
    for (let d = 0; d < 7; d++) {
      const dayEnabled = weekData[d]?.enabledHabits ?? habits.map((_, i) => i);
      for (let ei = 0; ei < dayEnabled.length; ei++) {
        const hIdx = dayEnabled[ei];
        const t = setTimeout(() => {
          setDemoWeekData(prev => prev.map((day, di) =>
            di === d ? { ...day, completedIndices: [...day.completedIndices, hIdx] } : day
          ));
          if (ei === dayEnabled.length - 1) {
            confetti({ particleCount: 40, spread: 50, origin: { x: 0.5, y: 0.5 }, colors: ["#34C759"] });
            // Show brain icon for this day
            setDemoBrainDay(d);
            setTimeout(() => setDemoBrainDay(null), 600);
          }
        }, SPEED * workStep);
        demoTimeouts.current.push(t);
        workStep++;
      }
    }

    // Personal habits (starts at same time as work habits)
    let personalStep = habitsStartStep;
    for (let d = 0; d < 7; d++) {
      for (let h = 0; h < personalHabits.length; h++) {
        const t = setTimeout(() => {
          setDemoPersonalWeekData(prev => prev.map((day, di) =>
            di === d ? { ...day, completedIndices: [...day.completedIndices, h] } : day
          ));
          if (h === personalHabits.length - 1) {
            confetti({ particleCount: 30, spread: 40, origin: { x: 0.8, y: 0.3 }, colors: ["#34C759", "#FFD60A"] });
          }
        }, SPEED * personalStep);
        demoTimeouts.current.push(t);
        personalStep++;
      }
    }

    // Continue from whichever finished last
    step = Math.max(workStep, personalStep);

    // Phase 4: Fill sun history one by one
    step += 2;
    const sunStatuses: ('burning' | 'warm' | 'gray')[] = ['burning', 'burning', 'warm', 'burning', 'burning', 'burning', 'burning'];
    const sunCompletedCounts = [7, 7, 5, 7, 7, 7, 7]; // Number of rituals completed each day
    for (let s = 0; s < 7; s++) {
      const t = setTimeout(() => {
        const completedCount = sunCompletedCounts[s];
        const completed = rituals.slice(0, completedCount).map(r => r.text);
        setDemoSunHistory(prev => [...prev, {
          date: `2026-02-${3 + s}`,
          status: sunStatuses[s],
          completedRituals: completed,
          totalRituals: rituals.length,
        }]);
      }, SPEED * step);
      demoTimeouts.current.push(t);
      step++;
    }

    // Phase 5: Finale + end text
    const endT = setTimeout(() => {
      confetti({ particleCount: 200, spread: 120, origin: { x: 0.5, y: 0.4 }, colors: ["#FFD60A", "#34C759", "#ffffff", "#FF6B35"] });
      if (demoEndText) setDemoShowTg(true);
    }, SPEED * step);
    demoTimeouts.current.push(endT);

    // Auto-stop demo after 5 more seconds
    const stopT = setTimeout(() => {
      setDemoActive(false);
      setDemoShowTg(false);
      clearDemoTimeouts();
    }, SPEED * step + 5000);
    demoTimeouts.current.push(stopT);
  }, [demoActive, clearDemoTimeouts, rituals, weekData, personalWeekData, habits, personalHabits, demoEndText]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearDemoTimeouts();
  }, [clearDemoTimeouts]);

  // Effective data: demo overrides real data
  const effRituals = demoActive ? demoRituals : rituals;
  const effWeekData = demoActive ? demoWeekData : weekData;
  const effPersonalWeekData = demoActive ? demoPersonalWeekData : personalWeekData;
  const effSunHistory = demoActive ? demoSunHistory : sunHistory;

  const allRitualsDone = effRituals.every((r) => r.done);
  const todayIndex = (new Date().getDay() + 6) % 7;

  // Stats calculations - count only enabled habits per day
  const totalPossible = effWeekData.reduce((sum, day) => {
    const enabled = day.enabledHabits ?? habits.map((_, i) => i);
    return sum + enabled.length;
  }, 0);
  const totalDone = effWeekData.reduce((sum, day) => {
    const enabled = day.enabledHabits ?? habits.map((_, i) => i);
    return sum + day.completedIndices.filter(i => enabled.includes(i)).length;
  }, 0);
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

  // Confetti on habit toggle (vertical layout)
  const handleToggleHabit = (dayIdx: number, habitIdx: number) => {
    const day = weekData[dayIdx];
    const wasNotDone = !day.completedIndices.includes(habitIdx);

    toggleHabit(dayIdx, habitIdx);

    if (wasNotDone && layout === "vertical") {
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { x: 0.5, y: 0.5 },
        colors: ["#34C759"],
      });
    }
  };

  const handleResetWeek = () => {
    if (confirm("Начать новую неделю?")) {
      resetWeek();
    }
  };

  const handleStartFresh = () => {
    if (confirm("Удалить все демо-данные и создать свой график?")) {
      clearAllData();
      setSettingsOpen(true);
    }
  };

  const currentDate = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });

  // Show loading state while data loads
  if (!isLoaded || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
            <div className="w-4 h-4 sm:w-4 sm:h-4 w-3 h-3 bg-foreground rounded cursor-pointer" onClick={startDemo} />
            <h1 className="text-[10px] sm:text-lg font-bold text-foreground cursor-pointer" onClick={startDemo}>Focus</h1>
            <span className="text-[8px] sm:text-[10px] text-muted-foreground/60 font-mono">v{APP_VERSION}</span>
            <span className="text-xs text-muted-foreground ml-1">{currentDate}</span>
            {/* Mobile Team Button */}
            <TeamButton mobile />
            {/* Mobile Start Button - small, inline with date */}
            <Button
              variant="default"
              size="sm"
              onClick={handleStartFresh}
              className="sm:hidden gap-1 h-6 px-2 text-[10px] bg-habit-green hover:bg-habit-green/90 text-white"
            >
              <Play className="w-3 h-3" />
              Начать
            </Button>
            {/* Mobile Theme Toggle */}
            <div className="sm:hidden">
              <ModeToggle />
            </div>
            {/* Mobile Settings Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSettingsOpen(true)}
              className="sm:hidden h-6 w-6 p-0"
            >
              <Settings className="w-3 h-3" />
            </Button>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <div className="hidden sm:block">
            <SupportRayButton />
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5">
          {/* Team Button */}
          <TeamButton />
          {/* Desktop Start Button */}
          <Button
            variant="default"
            size="sm"
            onClick={handleStartFresh}
            className="hidden sm:flex gap-1.5 h-8 text-xs bg-habit-green hover:bg-habit-green/90 text-white"
          >
            <Play className="w-3.5 h-3.5" />
            Начать
          </Button>
          {/* Desktop Theme Toggle */}
          <ModeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSettingsOpen(true)}
            className="h-8 w-8 p-0"
          >
            <Settings className="w-3.5 h-3.5" />
          </Button>
        </div>
      </header >



      {/* Stats Deck - Top Row: dynamic grid */}
      < div className={`grid grid-cols-2 gap-2 mb-5 ${pillsEnabled ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        {/* Ritual Card */}
        < RitualCard
          rituals={effRituals}
          onToggle={demoActive ? () => {} : toggleRitual}
          isComplete={allRitualsDone}
          dailyPlanPercent={planPercent}
          streak={demoActive ? 7 : statistics.currentStreak}
          sunHistory={effSunHistory}
        />

        {/* Weekly Plan Card with mini charts */}
        < WeeklyPlanCard
          weekData={effWeekData}
          habits={habits}
          totalDone={totalDone}
          totalPossible={totalPossible}
          planPercent={planPercent}
          morningRitualsDone={effRituals.filter(r => r.done).length}
          morningRitualsTotal={effRituals.length}
          allRitualsDone={allRitualsDone}
        />

        {/* Pill Tracker Card - conditionally rendered */}
        {
          pillsEnabled && (
            <PillTrackerCard
              pills={pills}
              onToggle={togglePill}
              onAddPill={() => setSettingsOpen(true)}
            />
          )
        }

        {/* Personal Development Card with progress bars */}
        <PersonalStandardCard
          habits={personalHabits}
          weekData={effPersonalWeekData}
          onToggle={demoActive ? () => {} : togglePersonalHabit}
          onAddHabit={() => setSettingsOpen(true)}
          neuronHistory={neuronHistory}
        />
      </div >

      {/* Week View */}
      {
        layout === "vertical" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 overflow-x-auto pb-4">
            {effWeekData.map((day, dayIdx) => {
              // Get enabled habits for this day (default to all if not set)
              const enabledHabits = day.enabledHabits ?? habits.map((_, i) => i);
              const enabledCount = enabledHabits.length;
              const completedCount = day.completedIndices.filter(i => enabledHabits.includes(i)).length;
              const dayProgress = enabledCount > 0
                ? Math.round((completedCount / enabledCount) * 100)
                : 0;

              const isFull = completedCount === enabledCount && enabledCount > 0;
              const isFocusMode = theme === 'focus';

              return (
                <div
                  key={dayIdx}
                  className={`flex flex-col gap-1.5 min-w-28 transition-all duration-300 ${isFocusMode
                    ? `p-3 rounded-xl ${isFull ? 'bg-habit-green' : 'bg-transparent'}`
                    : ''
                    }`}
                >
                  <div className="flex flex-col items-center mb-2 relative">
                    {/* {demoBrainDay === dayIdx && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center animate-in zoom-in-50 fade-in duration-300">
                        <Brain className="w-10 h-10 text-habit-green drop-shadow-[0_0_12px_rgba(34,197,94,0.7)]" />
                      </div>
                    )} */}
                    <CircularProgress
                      value={dayProgress}
                      size={80}
                      strokeWidth={6}
                      variant={isFull && isFocusMode ? 'white' : 'default'}
                    />
                    <div className="text-center mt-1">
                      <div
                        className={`font-bold ${isFocusMode
                          ? isFull ? 'text-white' : 'text-foreground'
                          : dayIdx === todayIndex ? "text-habit-green" : "text-foreground"
                          } ${isFocusMode ? 'text-sm' : 'text-xs'}`}
                      >
                        {day.name}
                      </div>
                      <div className={`${isFocusMode ? 'text-xs' : 'text-[10px]'} ${isFocusMode && isFull ? 'text-white/80' : 'text-muted-foreground'
                        }`}>
                        {day.dateStr}
                      </div>
                    </div>
                  </div>
                  {enabledHabits.map((hIdx) => {
                    const habit = habits[hIdx];
                    if (!habit) return null;

                    const isDone = day.completedIndices.includes(hIdx);
                    return (
                      <button
                        key={hIdx}
                        onClick={() => !demoActive && handleToggleHabit(dayIdx, hIdx)}
                        className={`flex items-center gap-1.5 rounded-lg border transition-all overflow-hidden w-full ${isFocusMode ? 'px-3 py-2.5' : 'px-2 py-2'
                          } ${isDone
                            ? isFocusMode && isFull
                              ? "bg-white text-habit-green border-white font-bold"
                              : "bg-habit-green border-habit-green text-white"
                            : isFocusMode && isFull
                              ? "bg-white/20 border-white/20 text-white hover:bg-white/30"
                              : "bg-card border-border hover:border-muted-foreground"
                          }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded flex-shrink-0 flex items-center justify-center border ${isDone
                            ? "bg-white border-white"
                            : "border-muted-foreground"
                            }`}
                        >
                          {isDone && <Check className="w-2.5 h-2.5 text-habit-green" />}
                        </div>
                        <span
                          className={`font-medium truncate min-w-0 ${isFocusMode ? 'text-xs' : 'text-[10px]'
                            } ${isDone
                              ? isFocusMode && isFull ? "text-habit-green" : "text-white"
                              : isFocusMode && isFull ? "text-white" : "text-muted-foreground"
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
            {effWeekData.map((day, dayIdx) => {
              // Get enabled habits for this day
              const enabledHabits = day.enabledHabits ?? habits.map((_, i) => i);
              const enabledCount = enabledHabits.length;
              const completedCount = day.completedIndices.filter(i => enabledHabits.includes(i)).length;
              const isFull = completedCount === enabledCount && enabledCount > 0;
              const isFocusMode = theme === 'focus';

              return (
                <div
                  key={dayIdx}
                  className={`rounded-xl shadow-card flex flex-wrap items-center justify-between gap-3 transition-colors duration-300 ${isFocusMode
                    ? `p-5 ${isFull ? 'bg-habit-green text-white' : 'bg-card'}`
                    : 'bg-card p-3'
                    }`}
                >
                  <div className="min-w-24">
                    <div
                      className={`${isFocusMode ? 'text-sm' : 'text-xs'} font-bold ${dayIdx === todayIndex && !isFull ? "text-habit-green" : isFull && isFocusMode ? "text-white" : "text-foreground"
                        }`}
                    >
                      {day.name}
                    </div>
                    <div className={`${isFocusMode ? 'text-xs' : 'text-[10px]'} ${isFull && isFocusMode ? 'text-white/80' : 'text-muted-foreground'}`}>{day.dateStr}</div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {enabledHabits.map((hIdx) => {
                      const habit = habits[hIdx];
                      if (!habit) return null;

                      const isDone = day.completedIndices.includes(hIdx);
                      return (
                        <button
                          key={hIdx}
                          onClick={() => !demoActive && handleToggleHabit(dayIdx, hIdx)}
                          className={`rounded-md font-medium transition-all ${isFocusMode
                            ? `px-4 py-2 text-xs ${isDone
                              ? "bg-white text-habit-green font-bold shadow-sm"
                              : isFull
                                ? "bg-white/20 text-white hover:bg-white/30"
                                : "bg-chip-bg text-muted-foreground hover:bg-muted"
                            }`
                            : `px-2.5 py-1 text-[10px] ${isDone
                              ? "bg-habit-green text-white"
                              : "bg-chip-bg text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`
                            }`}
                        >
                          {habit}
                        </button>
                      );
                    })}
                  </div>
                  <div
                    className={`${isFocusMode ? 'text-sm min-w-10' : 'text-xs min-w-8'} font-bold text-right ${isFull
                      ? isFocusMode ? "text-white" : "text-habit-green"
                      : "text-muted-foreground"
                      }`}
                  >
                    {completedCount}/{enabledCount}
                  </div>
                </div>
              );
            })}
          </div>
        )
      }

      {/* Calendar Section */}
      {
        calendarEnabled && (
          <div className="mt-5">
            <CalendarCard
              events={calendarEvents}
              onAddEvent={addCalendarEvent}
              onRemoveEvent={removeCalendarEvent}
            />
          </div>
        )
      }

      {/* Settings Modal */}
      <HabitSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        habits={habits}
        personalHabits={personalHabits}
        rituals={rituals}
        pills={pills}
        pillsEnabled={pillsEnabled}
        calendarEnabled={calendarEnabled}
        layout={layout}
        theme={theme}
        weekData={weekData}
        statistics={statistics}
        onSaveHabits={setHabits}
        onSavePersonalHabits={setPersonalHabits}
        onSaveRituals={setRituals}
        onSavePills={setPills}
        onTogglePills={setPillsEnabled}
        onToggleCalendar={setCalendarEnabled}
        onSetLayout={setLayout}
        onSetTheme={setTheme}
        onSaveWeekData={setWeekData}
        onResetWeek={resetWeek}
        onLogout={logout}
        demoEndText={demoEndText}
        onSetDemoEndText={setDemoEndText}
      />

      {/* Demo TG overlay */}
      {demoShowTg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="animate-in zoom-in-0 fade-in slide-in-from-bottom-4 duration-1000 flex flex-col items-center">
            <p className="text-habit-green text-4xl sm:text-6xl font-black text-center tracking-tight drop-shadow-[0_0_30px_rgba(34,197,94,0.6)] animate-pulse">
              {demoEndText}
            </p>
          </div>
        </div>
      )}

      {/* Debug Indicator - REMOVE LATER */}
      {/* <div className="fixed bottom-0 right-0 bg-red-500 text-white p-2 z-50 text-xs">
        Debug Theme: {theme}
      </div> */}
    </div >
  );
};

export default Index;
