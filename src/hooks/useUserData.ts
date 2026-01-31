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

interface UserDataState {
  rituals: Ritual[];
  habits: string[];
  personalHabits: string[];
  pills: Pill[];
  pillsEnabled: boolean;
  weekData: DayData[];
  personalWeekData: DayData[];
  layout: 'vertical' | 'horizontal';
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

const getDefaultState = (): UserDataState => ({
  rituals: DEFAULT_RITUALS.map((text) => ({ text, done: false })),
  habits: [...DEFAULT_WORK_HABITS],
  personalHabits: [...DEFAULT_PERSONAL_HABITS],
  pills: DEFAULT_PILLS.map((p) => ({ ...p, done: false })),
  pillsEnabled: false,
  weekData: generateWeek(),
  personalWeekData: generateWeek(),
  layout: 'vertical',
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
        
        if (storedWeekStart !== currentWeekStart) {
          // New week - reset daily progress but keep habits/rituals config
          setState({
            ...parsed,
            rituals: parsed.rituals.map((r: Ritual) => ({ ...r, done: false })),
            pills: parsed.pills.map((p: Pill) => ({ ...p, done: false })),
            weekData: currentWeek,
            personalWeekData: currentWeek,
          });
        } else {
          setState(parsed);
        }
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
      weekData: generateWeek(),
      personalWeekData: generateWeek(),
      layout: 'vertical',
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
    setLayout,
    resetWeek,
    clearAllData,
  };
}
