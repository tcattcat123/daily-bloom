import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  userNickname: string;
  userEmail?: string;
}

interface InviteCode {
  id: string;
  code: string;
  used: boolean;
  used_by: string | null;
  used_at: string | null;
  created_at: string;
}

const ProfileModal = ({ open, onClose, userId, userNickname, userEmail }: ProfileModalProps) => {
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open && userId) {
      loadInviteCodes();
    }
  }, [open, userId]);

  const loadInviteCodes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('invite_codes')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading invite codes:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить инвайт-коды",
          variant: "destructive",
        });
      } else {
        setInviteCodes(data || []);
      }
    } catch (err) {
      console.error('Error loading invite codes:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast({
        title: "Скопировано!",
        description: `Код ${code} скопирован в буфер обмена`,
      });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast({
        title: "Ошибка",
        description: "Не удалось скопировать код",
        variant: "destructive",
      });
    }
  };

  const usedCount = inviteCodes.filter(c => c.used).length;
  const availableCount = inviteCodes.filter(c => !c.used).length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Профиль</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Профиль</TabsTrigger>
            <TabsTrigger value="invites">
              Инвайты ({availableCount}/{inviteCodes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Никнейм</div>
              <div className="font-medium">{userNickname}</div>
            </div>
            {userEmail && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{userEmail}</div>
              </div>
            )}
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">ID пользователя</div>
              <div className="font-mono text-xs text-muted-foreground">{userId}</div>
            </div>
          </TabsContent>

          <TabsContent value="invites" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Ваши инвайт-коды для приглашения друзей
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Загрузка...
                  </div>
                ) : inviteCodes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Нет инвайт-кодов
                  </div>
                ) : (
                  inviteCodes.map((invite) => (
                    <div
                      key={invite.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        invite.used
                          ? 'bg-muted/50 border-muted'
                          : 'bg-card border-border hover:border-primary transition-colors'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <code className="font-mono font-bold text-sm">
                            {invite.code}
                          </code>
                          {invite.used && (
                            <span className="text-xs text-muted-foreground">
                              (использован)
                            </span>
                          )}
                        </div>
                        {invite.used && invite.used_by && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Использовал: {invite.used_by}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(invite.code)}
                        disabled={invite.used}
                        className="ml-2"
                      >
                        {copiedCode === invite.code ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-sm">
                  <span className="text-muted-foreground">Использовано:</span>
                  <span className="ml-2 font-medium">{usedCount}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Доступно:</span>
                  <span className="ml-2 font-medium text-green-600">{availableCount}</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
