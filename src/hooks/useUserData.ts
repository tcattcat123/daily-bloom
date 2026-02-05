import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
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
  enabledHabits?: number[];
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
  date: string;
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
  theme: 'standard' | 'focus';
  lastRitualsResetDate: string;
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
  theme: 'standard',
  lastRitualsResetDate: getTodayDateStr(),
  statistics: getDefaultStatistics(),
});

// Process state for daily/weekly resets
const processStateResets = (parsed: UserDataState): UserDataState => {
  const currentWeek = generateWeek();
  const storedWeekStart = parsed.weekData?.[0]?.dateStr;
  const currentWeekStart = currentWeek[0].dateStr;
  const todayStr = getTodayDateStr();

  const safeCalendarEvents = Array.isArray(parsed.calendarEvents) ? parsed.calendarEvents : [];

  let newState: UserDataState = {
    ...getDefaultState(),
    ...parsed,
    calendarEvents: safeCalendarEvents,
  };

  // Daily reset for morning rituals and pills only
  if (parsed.lastRitualsResetDate !== todayStr) {
    const completedRituals = parsed.rituals?.filter((r: Ritual) => r.done).length || 0;
    const completedPills = parsed.pills?.filter((p: Pill) => p.done).length || 0;

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

  // Weekly reset
  if (storedWeekStart !== currentWeekStart) {
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

  if (!newState.statistics) {
    newState.statistics = getDefaultStatistics();
  }

  return newState;
};

export function useUserData() {
  const { user } = useAuth();
  const [state, setState] = useState<UserDataState>(getDefaultState);
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

  // Save to Supabase (debounced)
  const saveToSupabase = useCallback(async (data: UserDataState) => {
    if (!user || isSavingRef.current) return;

    isSavingRef.current = true;
    try {
      // Check if record exists
      const { data: existing } = await supabase
        .from('user_data')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      let error;
      if (existing) {
        // Update existing
        const result = await supabase
          .from('user_data')
          .update({ data: JSON.parse(JSON.stringify(data)) })
          .eq('user_id', user.id);
        error = result.error;
      } else {
        // Insert new - use raw SQL via RPC to bypass type issues
        const result = await supabase.rpc('insert_user_data' as never, {
          p_user_id: user.id,
          p_data: JSON.parse(JSON.stringify(data)),
        } as never);
        error = result.error;

        // Fallback to direct insert if RPC doesn't exist
        if (error) {
          const insertResult = await (supabase as any)
            .from('user_data')
            .insert([{
              user_id: user.id,
              data: JSON.parse(JSON.stringify(data)),
            }]);
          error = insertResult.error;
        }
      }

      if (error) {
        console.error('Error saving to Supabase:', error);
      }
    } catch (err) {
      console.error('Error saving to Supabase:', err);
    } finally {
      isSavingRef.current = false;
    }
  }, [user]);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setIsLoaded(true);
        return;
      }

      try {
        // Try to load from Supabase first
        const { data: supabaseData, error } = await supabase
          .from('user_data')
          .select('data')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading from Supabase:', error);
        }

        let loadedState: UserDataState | null = null;

        if (supabaseData?.data) {
          // Data exists in Supabase
          loadedState = processStateResets(supabaseData.data as unknown as UserDataState);
        } else {
          // Check localStorage for migration
          const localStorageKey = `humanos_data_${user.id}`;
          const stored = localStorage.getItem(localStorageKey);

          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              loadedState = processStateResets(parsed);
              // Migrate to Supabase
              await saveToSupabase(loadedState);
              // Clear localStorage after successful migration
              localStorage.removeItem(localStorageKey);
              console.log('Data migrated from localStorage to Supabase');
            } catch {
              loadedState = getDefaultState();
            }
          } else {
            loadedState = getDefaultState();
          }
        }

        setState(loadedState);
      } catch (err) {
        console.error('Error loading data:', err);
        setState(getDefaultState());
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, [user, saveToSupabase]);

  // Save to Supabase when state changes (debounced)
  useEffect(() => {
    if (!user || !isLoaded) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveToSupabase(state);
    }, 1000); // Debounce 1 second

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state, user, isLoaded, saveToSupabase]);

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
          : undefined,
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

  // Theme
  const setTheme = useCallback((theme: 'standard' | 'focus') => {
    setState((prev) => ({ ...prev, theme }));
  }, []);

  // Reset week
  const resetWeek = useCallback(() => {
    setState((prev) => {
      const newWeek = generateWeek();
      return {
        ...prev,
        rituals: prev.rituals.map((r) => ({ ...r, done: false })),
        pills: prev.pills.map((p) => ({ ...p, done: false })),
        weekData: newWeek.map((day, idx) => ({
          ...day,
          enabledHabits: prev.weekData[idx]?.enabledHabits,
        })),
        personalWeekData: newWeek,
      };
    });
  }, []);

  // Clear all data
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
      theme: 'standard',
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
    setTheme,
    resetWeek,
    clearAllData,
  };
}
