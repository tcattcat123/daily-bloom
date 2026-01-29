import { useState, useEffect, useCallback } from 'react';
import type { User } from '@/types/database';

const STORAGE_KEY = 'humanos_user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const register = useCallback((nickname: string): User => {
    const newUser: User = {
      id: crypto.randomUUID(),
      nickname: nickname.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const updateNickname = useCallback((nickname: string) => {
    if (!user) return;
    const updated = { ...user, nickname, updated_at: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setUser(updated);
  }, [user]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    register,
    logout,
    updateNickname,
  };
}
