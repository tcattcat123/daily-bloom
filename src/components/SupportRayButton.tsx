import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Profile {
  id: string;
  nickname: string | null;
}

interface SupportRayButtonProps {
  variant?: 'default' | 'welcome' | 'full';
}

const SupportRayButton = ({ variant = 'default' }: SupportRayButtonProps) => {
  const [isSending, setIsSending] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [users, setUsers] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const { user, isAuthenticated } = useAuth();

  // Fetch users when dialog opens
  useEffect(() => {
    if (isDialogOpen && isAuthenticated) {
      fetchUsers();
    }
  }, [isDialogOpen, isAuthenticated]);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nickname')
      .not('nickname', 'is', null)
      .neq('id', user?.id || '')
      .limit(100);

    if (!error && data) {
      setUsers(data);
    }
  };

  const handleSendRayToUser = async (receiverId: string, receiverNickname: string) => {
    if (!user?.id) return;
    
    setIsSending(true);
    
    const { error } = await supabase
      .from('support_rays')
      .insert({
        sender_id: user.id,
        receiver_id: receiverId,
      });

    if (error) {
      toast.error('Не удалось отправить луч');
      setIsSending(false);
      return;
    }

    // Show sparkle animation
    const newSparkles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
    }));
    setSparkles(newSparkles);

    setTimeout(() => {
      toast.success(`Луч отправлен ${receiverNickname}! ✨`);
      setIsSending(false);
      setSparkles([]);
      setIsDialogOpen(false);
    }, 500);
  };

  const handleWelcomeRay = () => {
    // On welcome page, just show animation without DB
    setIsSending(true);
    const newSparkles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
    }));
    setSparkles(newSparkles);
    
    setTimeout(() => {
      toast.success('Луч поддержки отправлен! ✨', {
        description: 'Случайный пользователь получит ваше тепло',
      });
      setIsSending(false);
      setSparkles([]);
    }, 800);
  };

  const filteredUsers = users.filter(u => 
    u.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (variant === 'welcome') {
    return (
      <div className="relative inline-flex">
        <button
          onClick={handleWelcomeRay}
          disabled={isSending}
          className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-sm"
        >
          <Sparkles className={`w-4 h-4 transition-all duration-300 ${isSending ? 'animate-pulse text-yellow-400' : 'group-hover:text-yellow-400'}`} />
          <span>Отправить луч поддержки</span>
        </button>
        
        {sparkles.map((sparkle) => (
          <span
            key={sparkle.id}
            className="absolute top-1/2 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-ping pointer-events-none"
            style={{
              transform: `translate(${sparkle.x}px, ${sparkle.y}px)`,
              animationDuration: '0.6s',
            }}
          />
        ))}
      </div>
    );
  }

  // Full variant for dashboard
  if (variant === 'full') {
    return (
      <>
        <div className="relative inline-flex">
          <Button
            onClick={() => setIsDialogOpen(true)}
            disabled={isSending}
            variant="outline"
            className="gap-2 h-10 px-5 text-sm border-habit-green/30 text-habit-green hover:bg-habit-green/10 hover:border-habit-green"
          >
            <Sparkles className={`w-4 h-4 ${isSending ? 'animate-pulse' : ''}`} />
            Отправить луч поддержки
          </Button>
          
          {sparkles.map((sparkle) => (
            <span
              key={sparkle.id}
              className="absolute top-1/2 left-1/2 w-1 h-1 bg-habit-green rounded-full animate-ping pointer-events-none"
              style={{
                transform: `translate(${sparkle.x}px, ${sparkle.y}px)`,
                animationDuration: '0.6s',
              }}
            />
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-habit-green" />
                Отправить луч поддержки
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по нику..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <ScrollArea className="h-64">
                <div className="space-y-1">
                  {filteredUsers.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Пользователи не найдены
                    </p>
                  ) : (
                    filteredUsers.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => handleSendRayToUser(profile.id, profile.nickname || 'Пользователь')}
                        disabled={isSending}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-left group"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-bold">
                          {profile.nickname?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span className="text-sm font-medium flex-1">{profile.nickname}</span>
                        <Sparkles className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-habit-green transition-all" />
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <div className="relative inline-flex">
        <Button
          onClick={() => setIsDialogOpen(true)}
          disabled={isSending}
          variant="outline"
          size="sm"
          className="gap-1.5 h-8 text-xs border-habit-green/30 text-habit-green hover:bg-habit-green/10 hover:border-habit-green"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isSending ? 'animate-pulse' : ''}`} />
          Луч поддержки
        </Button>
        
        {sparkles.map((sparkle) => (
          <span
            key={sparkle.id}
            className="absolute top-1/2 left-1/2 w-1 h-1 bg-habit-green rounded-full animate-ping pointer-events-none"
            style={{
              transform: `translate(${sparkle.x}px, ${sparkle.y}px)`,
              animationDuration: '0.6s',
            }}
          />
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-habit-green" />
              Отправить луч поддержки
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по нику..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <ScrollArea className="h-64">
              <div className="space-y-1">
                {filteredUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Пользователи не найдены
                  </p>
                ) : (
                  filteredUsers.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => handleSendRayToUser(profile.id, profile.nickname || 'Пользователь')}
                      disabled={isSending}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-left group"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-bold">
                        {profile.nickname?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <span className="text-sm font-medium flex-1">{profile.nickname}</span>
                      <Sparkles className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-habit-green transition-all" />
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SupportRayButton;
