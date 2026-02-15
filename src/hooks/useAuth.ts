import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  nickname: string | null;
  created_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile from Supabase
  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!error && data) {
      setProfile(data);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Aggressive safety timeout for mobile
    const timeoutId = setTimeout(() => {
      if (mounted) {
        setIsLoading(prev => {
          if (prev) {
            console.log('Mobile bypass: forcing auth load');
            return false;
          }
          return prev;
        });
      }
    }, 2000);

    const initAuth = async () => {
      try {
        // 1. Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          if (initialSession?.user) {
            fetchProfile(initialSession.user.id);
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Auth init error:', err);
        if (mounted) setIsLoading(false);
      }
    };

    initAuth();

    // 2. Set up listener for future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          fetchProfile(currentSession.user.id);
        } else {
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [fetchProfile]);

  const register = useCallback(async (email: string, password: string, nickname: string) => {
    const redirectUrl = `${window.location.origin}/`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          nickname: nickname.trim()
        }
      }
    });

    if (error) {
      throw error;
    }

    return data;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  }, []);

  const loginWithNickname = useCallback(async (nickname: string, password: string) => {
    // Find all emails by nickname (case-insensitive). Nicknames may be duplicated,
    // so we try to sign in with each email until password matches.
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('email, created_at')
      .ilike('nickname', nickname)
      .order('created_at', { ascending: false })
      .limit(10);

    if (profileError) {
      throw profileError;
    }

    const emails = (profiles ?? [])
      .map((p) => p.email)
      .filter((e): e is string => !!e);

    if (!emails.length) {
      throw new Error('Пользователь не найден');
    }

    let lastInvalidCredentialsError: unknown = null;

    for (const email of emails) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        return data;
      }

      // If nickname has multiple accounts, wrong password for the first email is common.
      // Keep trying only for invalid-credentials errors.
      if (error.message?.includes('Invalid login credentials')) {
        lastInvalidCredentialsError = error;
        continue;
      }

      throw error;
    }

    if (lastInvalidCredentialsError) {
      throw lastInvalidCredentialsError;
    }

    throw new Error('Invalid login credentials');
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();

    // Очистка всех ключей связанных с пользовательскими данными
    const keysToRemove = Object.keys(localStorage).filter(key =>
      key.startsWith('humanos_data_') ||
      key.startsWith('admin_auth')
    );
    keysToRemove.forEach(key => localStorage.removeItem(key));

    setUser(null);
    setSession(null);
    setProfile(null);
  }, []);

  const updateNickname = useCallback(async (nickname: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ nickname })
      .eq('id', user.id);

    if (!error) {
      setProfile(prev => prev ? { ...prev, nickname } : null);
    }
  }, [user]);

  const authObject = useMemo(() => ({
    user: profile ? {
      id: user?.id || '',
      nickname: profile.nickname || '',
      email: user?.email,
      created_at: profile.created_at,
      updated_at: profile.created_at
    } : null,
    session,
    isLoading,
    isAuthenticated: !!session,
    register,
    login,
    loginWithNickname,
    logout,
    updateNickname,
  }), [profile, user, session, isLoading, register, login, loginWithNickname, logout, updateNickname]);

  return authObject;
}
