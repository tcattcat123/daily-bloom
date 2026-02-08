import { useEffect, useRef, useState } from "react";
import { Settings, Check, Play } from "lucide-react";
import confetti from "canvas-confetti";

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
  } = useUserData();

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
            <div className="w-4 h-4 sm:w-4 sm:h-4 w-3 h-3 bg-foreground rounded" />
            <h1 className="text-[10px] sm:text-lg font-bold text-foreground">HumanOS</h1>
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
          rituals={rituals}
          onToggle={toggleRitual}
          isComplete={allRitualsDone}
          dailyPlanPercent={planPercent}
        />

        {/* Weekly Plan Card with mini charts */}
        < WeeklyPlanCard
          weekData={weekData}
          habits={habits}
          totalDone={totalDone}
          totalPossible={totalPossible}
          planPercent={planPercent}
          morningRitualsDone={rituals.filter(r => r.done).length}
          morningRitualsTotal={rituals.length}
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
          weekData={personalWeekData}
          onToggle={togglePersonalHabit}
          onAddHabit={() => setSettingsOpen(true)}
        />
      </div >

      {/* Week View */}
      {
        layout === "vertical" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 overflow-x-auto pb-4">
            {weekData.map((day, dayIdx) => {
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
                  <div className="flex flex-col items-center mb-2">
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
                        onClick={() => handleToggleHabit(dayIdx, hIdx)}
                        className={`flex items-center gap-1.5 rounded-lg border transition-all ${isFocusMode ? 'px-3 py-2.5' : 'px-2 py-2'
                          } ${isDone
                            ? isFocusMode && isFull
                              ? "bg-white text-habit-green border-white font-bold" // Done & All Done (Focus)
                              : "bg-habit-green border-habit-green text-white"     // Done (Standard/Partial)
                            : isFocusMode && isFull
                              ? "bg-white/20 border-white/20 text-white hover:bg-white/30" // Not Done & All Done (Impossible state usually, but for style consistency if partial)
                              : "bg-card border-border hover:border-muted-foreground"      // Not Done (Standard)
                          }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${isDone
                            ? "bg-white border-white"
                            : "border-muted-foreground"
                            }`}
                        >
                          {isDone && <Check className="w-2.5 h-2.5 text-habit-green" />}
                        </div>
                        <span
                          className={`font-medium truncate ${isFocusMode ? 'text-xs' : 'text-[10px]'
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
            {weekData.map((day, dayIdx) => {
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
                          onClick={() => handleToggleHabit(dayIdx, hIdx)}
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
      />

      {/* Debug Indicator - REMOVE LATER */}
      {/* <div className="fixed bottom-0 right-0 bg-red-500 text-white p-2 z-50 text-xs">
        Debug Theme: {theme}
      </div> */}
    </div >
  );
};

export default Index;
