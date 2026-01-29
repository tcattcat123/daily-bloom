// Database schema types - ready for Supabase/Vercel migration

export interface User {
  id: string;
  nickname: string;
  created_at: string;
  updated_at: string;
}

export interface Ritual {
  id: string;
  user_id: string;
  text: string;
  order_index: number;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  category: 'work' | 'personal';
  order_index: number;
}

export interface Pill {
  id: string;
  user_id: string;
  name: string;
  time: 'утро' | 'обед' | 'вечер';
  order_index: number;
}

export interface DailyProgress {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  rituals_completed: string[]; // ritual ids
  habits_completed: string[]; // habit ids
  pills_completed: string[]; // pill ids
}

export interface UserSettings {
  id: string;
  user_id: string;
  pills_enabled: boolean;
  layout: 'vertical' | 'horizontal';
}

// Default data for new users
export const DEFAULT_RITUALS = ["Стакан воды", "Медитация", "Зарядка", "Контрастный душ"];
export const DEFAULT_WORK_HABITS = ["Подъем 07:00", "Спорт", "Deep Work", "Чтение", "План"];
export const DEFAULT_PERSONAL_HABITS = ["Подъем 07:00", "Спорт", "Deep Work", "Чтение", "План"];
export const DEFAULT_PILLS = [
  { name: "Витамин D", time: "утро" as const },
  { name: "Омега-3", time: "обед" as const },
  { name: "Магний", time: "вечер" as const },
];
