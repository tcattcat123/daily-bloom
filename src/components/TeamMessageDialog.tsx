import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTeamMessages } from "@/hooks/useTeamMessages";
import { MessageSquare, Send } from "lucide-react";

interface Member {
    id: string;
    nickname: string;
}

interface TeamMessageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    teamId: string;
    members: Member[];
    currentUserId?: string;
}

const TeamMessageDialog = ({ open, onOpenChange, teamId, members, currentUserId }: TeamMessageDialogProps) => {
    const [message, setMessage] = useState("");
    const [recipientId, setRecipientId] = useState<string>("all");
    const { sendMessage, messages, loading } = useTeamMessages(teamId);
    const [sending, setSending] = useState(false);

    // Filter out current user from recipients
    const recipients = members.filter(m => m.id !== currentUserId);

    const handleSend = async () => {
        if (!message.trim()) return;

        setSending(true);
        const targetId = recipientId === "all" ? null : recipientId;
        await sendMessage(targetId, message);
        setSending(false);
        setMessage("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg h-[80vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-habit-green" />
                        Чат команды
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                            Загрузка сообщений...
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                            Нет сообщений. Напишите первым!
                        </div>
                    ) : (
                        messages.slice().reverse().map((msg) => {
                            const isMe = msg.sender_id === currentUserId;
                            const isDM = msg.recipient_id !== null;
                            const recipientName = members.find(m => m.id === msg.recipient_id)?.nickname;

                            return (
                                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold text-muted-foreground">
                                            {isMe ? 'Вы' : msg.sender?.nickname || 'Аноним'}
                                        </span>
                                        {isDM && (
                                            <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">
                                                ЛС {isMe ? `для ${recipientName || '...'}` : ''}
                                            </span>
                                        )}
                                        <span className="text-[10px] text-muted-foreground/60">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${isMe
                                            ? 'bg-habit-green text-white rounded-tr-none'
                                            : 'bg-white border border-border text-foreground rounded-tl-none'
                                        }`}>
                                        {msg.message}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="p-4 border-t bg-white space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Кому:</span>
                        <Select value={recipientId} onValueChange={setRecipientId}>
                            <SelectTrigger className="h-8 text-xs border-none shadow-none focus:ring-0 bg-slate-100 w-auto min-w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Всей команде</SelectItem>
                                {recipients.map((member) => (
                                    <SelectItem key={member.id} value={member.id}>
                                        {member.nickname}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            placeholder="Написать сообщение..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            className="flex-1 h-10 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-habit-green"
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!message.trim() || sending}
                            className="bg-habit-green hover:bg-habit-green/90 h-10 w-10 p-0 shrink-0"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TeamMessageDialog;
