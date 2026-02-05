import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface TeamMessage {
    id: string;
    team_id: string;
    sender_id: string;
    recipient_id: string | null;
    message: string;
    created_at: string;
    sender?: {
        nickname: string;
    };
}

export function useTeamMessages(teamId?: string) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<TeamMessage[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchMessages = useCallback(async () => {
        if (!teamId) return;

        setLoading(true);
        try {
            const { data, error } = await (supabase as any)
                .from('team_messages')
                .select(`
          *,
          sender:sender_id(nickname)
        `)
                .eq('team_id', teamId)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            // Map sender profile to structured object if needed, supabase join does it but let's be safe
            const mappedMessages = data.map((msg: any) => ({
                ...msg,
                sender: msg.sender // Supabase returns object or array depending on relation, usually object for foreign key
            }));

            setMessages(mappedMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    }, [teamId]);

    const sendMessage = async (recipientId: string | null, message: string) => {
        if (!user || !teamId) return;

        try {
            const { error } = await (supabase as any)
                .from('team_messages')
                .insert({
                    team_id: teamId,
                    sender_id: user.id,
                    recipient_id: recipientId,
                    message: message.trim()
                });

            if (error) throw error;

            toast.success('Сообщение отправлено');
            // No need to manually update state if realtime is on, but strictly speaking optimistic update is better.
            // We will rely on fetch or realtime.
        } catch (error) {
            toast.error('Ошибка отправки сообщения');
            console.error(error);
        }
    };

    // Subscribe to real-time changes
    useEffect(() => {
        if (!user) return;

        // We subscribe to all messages for this user (where they are sender, recipient, or public team message)
        // Actually, channel policies filter rows, usually we subscribe to "public:team_messages" and filter client side
        // OR we subscribe with a filter.
        // For simplicity, we subscribe to INSERT events on team_messages table.

        const channel = supabase
            .channel('team_messages_subscription')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'team_messages',
                },
                async (payload) => {
                    const newMsg = payload.new as TeamMessage;

                    // Check if this message is relevant to the user
                    // 1. If we are viewing a specific team (teamId is set):
                    if (teamId && newMsg.team_id === teamId) {
                        // Fetch the sender nickname
                        const { data: senderData } = await supabase
                            .from('profiles')
                            .select('nickname')
                            .eq('id', newMsg.sender_id)
                            .single();

                        const fullMsg = { ...newMsg, sender: senderData };
                        setMessages((prev) => [fullMsg as TeamMessage, ...prev]);
                    }

                    // Notifications are handled by TeamMessagePopup.tsx component
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, teamId]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    return {
        messages,
        loading,
        sendMessage,
        refreshMessages: fetchMessages
    };
}
