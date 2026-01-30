import { useState, useEffect, useCallback } from 'react';
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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile fetch with setTimeout to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
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
    // Find user's email by nickname
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('nickname', nickname)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    if (!profileData || !profileData.email) {
      throw new Error('Пользователь не найден');
    }

    // Sign in with the found email
    const { data, error } = await supabase.auth.signInWithPassword({
      email: profileData.email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
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

  return {
    user: profile ? { 
      id: user?.id || '', 
      nickname: profile.nickname || '', 
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
  };
}
