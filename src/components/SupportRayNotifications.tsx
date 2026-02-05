import { useState, useEffect } from 'react';
import { Sparkles, X, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface NotificationItem {
  id: string;
  type: 'ray' | 'message';
  sender_nickname: string;
  message?: string;
  created_at: string;
  is_dm?: boolean;
}

const SupportRayNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    fetchUnreadRays();

    const rayChannel = supabase
      .channel('support_rays_premium')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'support_rays' },
        async (payload) => {
          const newRay = payload.new;
          if (newRay.receiver_id !== user.id) return;
          const { data } = await supabase.from('profiles').select('nickname').eq('id', newRay.sender_id).maybeSingle();
          setNotifications((prev) => [
            { id: newRay.id, type: 'ray', sender_nickname: data?.nickname || 'Кто-то', created_at: newRay.created_at },
            ...prev,
          ]);
        }
      ).subscribe();

    const msgChannel = supabase
      .channel('messages_premium')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'team_messages' },
        async (payload) => {
          const newMsg = payload.new;
          if (newMsg.sender_id === user.id) return;

          const isForMe = newMsg.recipient_id === user.id;
          const isTeamMsg = newMsg.recipient_id === null;

          if (isForMe || isTeamMsg) {
            if (isTeamMsg) {
              const { data: member } = await (supabase as any).from('team_members').select('team_id').eq('team_id', newMsg.team_id).eq('user_id', user.id).maybeSingle();
              const { data: lead } = await (supabase as any).from('teams').select('id').eq('id', newMsg.team_id).eq('leader_id', user.id).maybeSingle();
              if (!member && !lead) return;
            }

            const { data: profile } = await supabase.from('profiles').select('nickname').eq('id', newMsg.sender_id).single();
            setNotifications((prev) => [
              { id: newMsg.id, type: 'message', sender_nickname: profile?.nickname || 'Участник', message: newMsg.message, created_at: newMsg.created_at, is_dm: !!newMsg.recipient_id },
              ...prev,
            ]);
          }
        }
      ).subscribe();

    return () => {
      supabase.removeChannel(rayChannel);
      supabase.removeChannel(msgChannel);
    };
  }, [isAuthenticated, user?.id]);

  const fetchUnreadRays = async () => {
    if (!user?.id) return;
    const { data } = await supabase.from('support_rays').select('id, sender_id, created_at').eq('receiver_id', user.id).eq('is_read', false).limit(3);
    if (!data) return;
    const senderIds = [...new Set(data.map((r) => r.sender_id))];
    const { data: profiles } = await supabase.from('profiles').select('id, nickname').in('id', senderIds);
    const profileMap = new Map(profiles?.map((p) => [p.id, p.nickname]) || []);
    setNotifications(prev => [
      ...data.map(r => ({ id: r.id, type: 'ray' as const, sender_nickname: profileMap.get(r.sender_id) || 'Кто-то', created_at: r.created_at })),
      ...prev
    ]);
  };

  const removeNotification = async (id: string, type: 'ray' | 'message') => {
    if (type === 'ray') {
      await supabase.from('support_rays').update({ is_read: true }).eq('id', id);
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full sm:w-[400px]">
      {notifications.map((item) => (
        <div
          key={item.id}
          className="bg-card border border-habit-green/20 rounded-2xl p-5 shadow-2xl animate-in slide-in-from-right-8 fade-in-0 duration-500 relative overflow-hidden group"
        >
          {/* Decorative accent for messages */}
          {item.type === 'message' && (
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
          )}
          {item.type === 'ray' && (
            <div className="absolute top-0 left-0 w-1.5 h-full bg-habit-green" />
          )}

          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${item.type === 'ray' ? 'bg-habit-green/10' : 'bg-blue-50'
              }`}>
              {item.type === 'ray' ? (
                <Sparkles className="w-6 h-6 text-habit-green animate-pulse" />
              ) : (
                <MessageSquare className="w-6 h-6 text-blue-500" />
              )}
            </div>

            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-black text-foreground">
                  ✨ {item.sender_nickname} {item.type === 'ray' ? 'отправил вам луч поддержки!' : 'прислал сообщение!'}
                </h4>
                {item.type === 'message' && item.is_dm && (
                  <span className="text-[9px] font-black uppercase bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Личное</span>
                )}
              </div>

              <div className="space-y-1">
                {item.type === 'ray' ? (
                  <>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      Это значит, что в вас верят и поддерживают — не останавливайтесь на пути к своим целям!
                    </p>
                  </>
                ) : (
                  <p className="text-[15px] text-foreground font-medium italic leading-snug">
                    "{item.message}"
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => removeNotification(item.id, item.type)}
              className="absolute top-4 right-4 text-muted-foreground/40 hover:text-foreground transition-colors p-1"
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
