import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { 
  DEFAULT_RITUALS, 
  DEFAULT_WORK_HABITS, 
  DEFAULT_PERSONAL_HABITS, 
  DEFAULT_PILLS 
} from '@/types/database';

interface Ritual {
  text: string;
  done: boolean;
}

interface Pill {
  name: string;
  time: 'утро' | 'обед' | 'вечер';
  done: boolean;
}

interface DayData {
  name: string;
  dateStr: string;
  completedIndices: number[];
  enabledHabits?: number[]; // Which habits are enabled for this day
}

interface Statistics {
  totalRitualsDone: number;
  totalWorkHabitsDone: number;
  totalPersonalHabitsDone: number;
  totalPillsDone: number;
  perfectDays: number;
  currentStreak: number;
  longestStreak: number;
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  time?: string;
  color: 'green' | 'blue' | 'yellow' | 'orange' | 'gray';
}

interface UserDataState {
  rituals: Ritual[];
  habits: string[];
  personalHabits: string[];
  pills: Pill[];
  pillsEnabled: boolean;
  calendarEnabled: boolean;
  calendarEvents: CalendarEvent[];
  weekData: DayData[];
  personalWeekData: DayData[];
  layout: 'vertical' | 'horizontal';
  lastRitualsResetDate: string; // Track when rituals were last reset
  statistics: Statistics;
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

const getTodayDateStr = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

const getDefaultStatistics = (): Statistics => ({
  totalRitualsDone: 0,
  totalWorkHabitsDone: 0,
  totalPersonalHabitsDone: 0,
  totalPillsDone: 0,
  perfectDays: 0,
  currentStreak: 0,
  longestStreak: 0,
});

const getDefaultState = (): UserDataState => ({
  rituals: DEFAULT_RITUALS.map((text) => ({ text, done: false })),
  habits: [...DEFAULT_WORK_HABITS],
  personalHabits: [...DEFAULT_PERSONAL_HABITS],
  pills: DEFAULT_PILLS.map((p) => ({ ...p, done: false })),
  pillsEnabled: false,
  calendarEnabled: true,
  calendarEvents: [],
  weekData: generateWeek(),
  personalWeekData: generateWeek(),
  layout: 'vertical',
  lastRitualsResetDate: getTodayDateStr(),
  statistics: getDefaultStatistics(),
});

export function useUserData() {
  const { user } = useAuth();
  const [state, setState] = useState<UserDataState>(getDefaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  const storageKey = user ? `humanos_data_${user.id}` : null;

  // Load data on mount
  useEffect(() => {
    if (!storageKey) {
      setIsLoaded(true);
      return;
    }

    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Check if week is current, if not reset progress but keep habits
        const currentWeek = generateWeek();
        const storedWeekStart = parsed.weekData?.[0]?.dateStr;
        const currentWeekStart = currentWeek[0].dateStr;
        const todayStr = getTodayDateStr();
        
        let newState = { ...parsed };
        
        // Check if rituals need daily reset
        if (parsed.lastRitualsResetDate !== todayStr) {
          // Count completed rituals before reset for statistics
          const completedRituals = parsed.rituals?.filter((r: Ritual) => r.done).length || 0;
          const completedPills = parsed.pills?.filter((p: Pill) => p.done).length || 0;
          
          // Update statistics
          const prevStats = parsed.statistics || getDefaultStatistics();
          const allRitualsDone = parsed.rituals?.length > 0 && completedRituals === parsed.rituals.length;
          
          newState = {
            ...newState,
            rituals: (parsed.rituals || []).map((r: Ritual) => ({ ...r, done: false })),
            pills: (parsed.pills || []).map((p: Pill) => ({ ...p, done: false })),
            lastRitualsResetDate: todayStr,
            statistics: {
              ...prevStats,
              totalRitualsDone: prevStats.totalRitualsDone + completedRituals,
              totalPillsDone: prevStats.totalPillsDone + completedPills,
              perfectDays: allRitualsDone ? prevStats.perfectDays + 1 : prevStats.perfectDays,
              currentStreak: allRitualsDone ? prevStats.currentStreak + 1 : 0,
              longestStreak: allRitualsDone 
                ? Math.max(prevStats.longestStreak, prevStats.currentStreak + 1)
                : prevStats.longestStreak,
            },
          };
        }
        
        if (storedWeekStart !== currentWeekStart) {
          // New week - reset weekly progress but keep habits/rituals config
          // Count completed habits before reset
          const totalWorkDone = parsed.weekData?.reduce((sum: number, day: DayData) => sum + day.completedIndices.length, 0) || 0;
          const totalPersonalDone = parsed.personalWeekData?.reduce((sum: number, day: DayData) => sum + day.completedIndices.length, 0) || 0;
          
          const prevStats = newState.statistics || getDefaultStatistics();
          
          newState = {
            ...newState,
            weekData: currentWeek,
            personalWeekData: currentWeek,
            statistics: {
              ...prevStats,
              totalWorkHabitsDone: prevStats.totalWorkHabitsDone + totalWorkDone,
              totalPersonalHabitsDone: prevStats.totalPersonalHabitsDone + totalPersonalDone,
            },
          };
        }
        
        // Ensure statistics exists
        if (!newState.statistics) {
          newState.statistics = getDefaultStatistics();
        }
        
        setState(newState);
      } catch {
        setState(getDefaultState());
      }
    }
    setIsLoaded(true);
  }, [storageKey]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!storageKey || !isLoaded) return;
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey, isLoaded]);

  // Rituals
  const setRituals = useCallback((rituals: Ritual[]) => {
    setState((prev) => ({ ...prev, rituals }));
  }, []);

  const toggleRitual = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      rituals: prev.rituals.map((r, i) => 
        i === index ? { ...r, done: !r.done } : r
      ),
    }));
  }, []);

  // Habits
  const setHabits = useCallback((habits: string[]) => {
    setState((prev) => ({
      ...prev,
      habits,
      weekData: prev.weekData.map((day) => ({
        ...day,
        completedIndices: day.completedIndices.filter((i) => i < habits.length),
        enabledHabits: day.enabledHabits 
          ? day.enabledHabits.filter((i) => i < habits.length)
          : habits.map((_, i) => i),
      })),
    }));
  }, []);

  const setWeekData = useCallback((weekData: DayData[]) => {
    setState((prev) => ({ ...prev, weekData }));
  }, []);

  const toggleHabit = useCallback((dayIdx: number, habitIdx: number) => {
    setState((prev) => ({
      ...prev,
      weekData: prev.weekData.map((day, idx) => {
        if (idx !== dayIdx) return day;
        const arr = day.completedIndices;
        if (arr.includes(habitIdx)) {
          return { ...day, completedIndices: arr.filter((i) => i !== habitIdx) };
        }
        return { ...day, completedIndices: [...arr, habitIdx] };
      }),
    }));
  }, []);

  // Personal Habits
  const setPersonalHabits = useCallback((personalHabits: string[]) => {
    setState((prev) => ({
      ...prev,
      personalHabits,
      personalWeekData: prev.personalWeekData.map((day) => ({
        ...day,
        completedIndices: day.completedIndices.filter((i) => i < personalHabits.length),
      })),
    }));
  }, []);

  const togglePersonalHabit = useCallback((dayIdx: number, habitIdx: number) => {
    setState((prev) => ({
      ...prev,
      personalWeekData: prev.personalWeekData.map((day, idx) => {
        if (idx !== dayIdx) return day;
        const arr = day.completedIndices;
        if (arr.includes(habitIdx)) {
          return { ...day, completedIndices: arr.filter((i) => i !== habitIdx) };
        }
        return { ...day, completedIndices: [...arr, habitIdx] };
      }),
    }));
  }, []);

  // Pills
  const setPills = useCallback((pills: Pill[]) => {
    setState((prev) => ({ ...prev, pills }));
  }, []);

  const togglePill = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      pills: prev.pills.map((p, i) => 
        i === index ? { ...p, done: !p.done } : p
      ),
    }));
  }, []);

  const setPillsEnabled = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, pillsEnabled: enabled }));
  }, []);

  // Calendar
  const setCalendarEnabled = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, calendarEnabled: enabled }));
  }, []);

  const addCalendarEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setState((prev) => ({
      ...prev,
      calendarEvents: [...prev.calendarEvents, newEvent],
    }));
  }, []);

  const removeCalendarEvent = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      calendarEvents: prev.calendarEvents.filter((e) => e.id !== id),
    }));
  }, []);

  // Layout
  const setLayout = useCallback((layout: 'vertical' | 'horizontal') => {
    setState((prev) => ({ ...prev, layout }));
  }, []);

  // Reset week
  const resetWeek = useCallback(() => {
    setState((prev) => ({
      ...prev,
      rituals: prev.rituals.map((r) => ({ ...r, done: false })),
      pills: prev.pills.map((p) => ({ ...p, done: false })),
      weekData: generateWeek(),
      personalWeekData: generateWeek(),
    }));
  }, []);

  // Clear all data (remove demo data)
  const clearAllData = useCallback(() => {
    setState({
      rituals: [],
      habits: [],
      personalHabits: [],
      pills: [],
      pillsEnabled: false,
      calendarEnabled: true,
      calendarEvents: [],
      weekData: generateWeek(),
      personalWeekData: generateWeek(),
      layout: 'vertical',
      lastRitualsResetDate: getTodayDateStr(),
      statistics: getDefaultStatistics(),
    });
  }, []);

  return {
    ...state,
    isLoaded,
    setRituals,
    toggleRitual,
    setHabits,
    toggleHabit,
    setWeekData,
    setPersonalHabits,
    togglePersonalHabit,
    setPills,
    togglePill,
    setPillsEnabled,
    setCalendarEnabled,
    addCalendarEvent,
    removeCalendarEvent,
    setLayout,
    resetWeek,
    clearAllData,
  };
}
