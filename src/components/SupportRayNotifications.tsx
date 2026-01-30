import { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SupportRay {
  id: string;
  sender_id: string;
  is_read: boolean;
  created_at: string;
  sender_nickname?: string;
}

const SupportRayNotifications = () => {
  const [rays, setRays] = useState<SupportRay[]>([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    fetchUnreadRays();

    // Subscribe to new rays
    const channel = supabase
      .channel('support_rays_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_rays',
          filter: `receiver_id=eq.${user.id}`,
        },
        async (payload) => {
          const newRay = payload.new as SupportRay;
          // Fetch sender nickname
          const { data } = await supabase
            .from('profiles')
            .select('nickname')
            .eq('id', newRay.sender_id)
            .maybeSingle();
          
          setRays((prev) => [
            { ...newRay, sender_nickname: data?.nickname || 'Кто-то' },
            ...prev,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, user?.id]);

  const fetchUnreadRays = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('support_rays')
      .select('id, sender_id, is_read, created_at')
      .eq('receiver_id', user.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error || !data) return;

    // Fetch sender nicknames
    const senderIds = [...new Set(data.map((r) => r.sender_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, nickname')
      .in('id', senderIds);

    const profileMap = new Map(profiles?.map((p) => [p.id, p.nickname]) || []);

    setRays(
      data.map((ray) => ({
        ...ray,
        sender_nickname: profileMap.get(ray.sender_id) || 'Кто-то',
      }))
    );
  };

  const markAsRead = async (rayId: string) => {
    await supabase
      .from('support_rays')
      .update({ is_read: true })
      .eq('id', rayId);

    setRays((prev) => prev.filter((r) => r.id !== rayId));
  };

  if (rays.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {rays.map((ray) => (
        <div
          key={ray.id}
          className="bg-card border border-habit-green/30 rounded-xl p-4 shadow-lg animate-in slide-in-from-right-5 duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-habit-green/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-habit-green" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                ✨ {ray.sender_nickname} отправил вам луч поддержки!
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Это значит в вас верят — не останавливайтесь!
              </p>
            </div>
            <button
              onClick={() => markAsRead(ray.id)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupportRayNotifications;
