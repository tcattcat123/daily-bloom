import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Crown, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import TeamMessageDialog from "@/components/TeamMessageDialog";
import { MessageSquare } from "lucide-react";
import { useTeamMessages } from "@/hooks/useTeamMessages";

interface Team {
  id: string;
  activity: string;
  leader_id: string;
  leader_nickname: string;
  member_count: number;
  is_member: boolean;
  members: { id: string; nickname: string }[];
}

const Teams = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activity, setActivity] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Enable real-time message notifications
  useTeamMessages();

  const openMessageDialog = (team: Team) => {
    setSelectedTeam(team);
    setMessageDialogOpen(true);
  };

  const fetchTeams = async () => {
    try {
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select(`id, activity, leader_id`)
        .order('created_at', { ascending: false });

      if (teamsError) throw teamsError;

      // Fetch leader profiles
      const leaderIds = [...new Set((teamsData || []).map(t => t.leader_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, nickname')
        .in('id', leaderIds);

      // Fetch member counts
      const { data: membersData } = await supabase
        .from('team_members')
        .select('team_id, user_id');

      // Get all member user IDs
      const memberUserIds = [...new Set((membersData || []).map(m => m.user_id))];
      const allUserIds = [...new Set([...leaderIds, ...memberUserIds])];

      const { data: allProfilesData } = await supabase
        .from('profiles')
        .select('id, nickname')
        .in('id', allUserIds);

      const profilesMap = new Map((allProfilesData || []).map(p => [p.id, p.nickname || 'Аноним']));

      const teamsWithInfo: Team[] = (teamsData || []).map((team) => {
        const teamMembers = (membersData || []).filter(m => m.team_id === team.id);
        const isMember = user ? teamMembers.some(m => m.user_id === user.id) : false;

        return {
          id: team.id,
          activity: team.activity,
          leader_id: team.leader_id,
          leader_nickname: profilesMap.get(team.leader_id) ?? 'Аноним',
          member_count: teamMembers.length,
          is_member: isMember || team.leader_id === user?.id,
          members: teamMembers.map(m => ({
            id: m.user_id,
            nickname: profilesMap.get(m.user_id) ?? 'Аноним',
          })),
        };
      });

      setTeams(teamsWithInfo);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [user]);

  const handleCreateTeam = async () => {
    if (!activity.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('teams')
        .insert({
          activity: activity.trim(),
          leader_id: user.id,
        });

      if (error) throw error;

      toast.success('Команда создана!');
      setActivity("");
      setCreateModalOpen(false);
      fetchTeams();
    } catch (error: any) {
      toast.error('Ошибка создания команды');
      console.error(error);
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    if (!user) {
      toast.error('Войдите, чтобы вступить в команду');
      return;
    }

    try {
      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: user.id,
        });

      if (error) {
        if (error.code === '23505') {
          toast.info('Вы уже в этой команде');
        } else {
          throw error;
        }
      } else {
        toast.success('Вы вступили в команду!');
        fetchTeams();
      }
    } catch (error: any) {
      toast.error('Ошибка вступления');
      console.error(error);
    }
  };

  const handleLeaveTeam = async (teamId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Вы покинули команду');
      fetchTeams();
    } catch (error: any) {
      toast.error('Ошибка');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </Button>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-foreground" />
            <h1 className="text-xl font-bold text-foreground">Команды</h1>
          </div>
        </div>

        {user && (
          <Button
            size="sm"
            className="gap-1.5 bg-habit-green hover:bg-habit-green/90"
            onClick={() => setCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Создать
          </Button>
        )}
      </header>

      <div className="max-w-7xl mx-auto">
        {teams.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <Card className="border-dashed">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Пока нет команд</h3>
                  <p className="text-sm text-muted-foreground">
                    Создайте первую команду и найдите единомышленников
                  </p>
                </div>
                {user && (
                  <Button
                    className="gap-2 bg-habit-green hover:bg-habit-green/90"
                    onClick={() => setCreateModalOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Создать команду
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {teams.map((team) => (
              <Card key={team.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300 border-border/40 group relative">
                <CardContent className="p-4 flex flex-col h-full gap-4">
                  {/* Header: Leader Info */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="w-9 h-9 border-2 border-habit-green/20">
                        <AvatarFallback className="bg-habit-green text-white text-xs font-black italic">
                          {team.leader_nickname.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-black text-foreground truncate max-w-[100px]">
                            {team.leader_nickname}
                          </span>
                          <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                          Лидер команды
                        </span>
                      </div>
                    </div>

                    {team.leader_id === user?.id ? (
                      <span className="text-[9px] font-black uppercase tracking-widest text-habit-green bg-habit-green/10 px-2 py-0.5 rounded-full border border-habit-green/20">
                        Ваша
                      </span>
                    ) : team.is_member ? (
                      <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                        Участник
                      </span>
                    ) : null}
                  </div>

                  {/* Body: Activity */}
                  <div className="flex-1">
                    <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100/50 group-hover:bg-slate-50 transition-colors">
                      <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">
                        {team.activity}
                      </p>
                    </div>
                  </div>

                  {/* Footer: Stats and Members */}
                  <div className="space-y-3 mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2 overflow-hidden">
                        {team.members.slice(0, 4).map((member) => (
                          <Avatar
                            key={member.id}
                            className="w-6 h-6 border-2 border-background ring-1 ring-slate-100"
                          >
                            <AvatarFallback className="bg-slate-200 text-slate-600 text-[8px] font-bold">
                              {member.nickname.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {team.member_count > 4 && (
                          <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-background flex items-center justify-center text-[8px] font-black text-slate-500 ring-1 ring-slate-100">
                            +{team.member_count - 4}
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {team.member_count} {team.member_count === 1 ? 'участник' : 'участника'}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      {user && team.leader_id !== user.id && (
                        team.is_member ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 h-8 text-[11px] font-bold text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleLeaveTeam(team.id)}
                          >
                            Выйти
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="flex-1 h-8 text-[11px] font-bold bg-habit-green hover:bg-habit-green/90"
                            onClick={() => handleJoinTeam(team.id)}
                          >
                            Вступить
                          </Button>
                        )
                      )}

                      {team.leader_id === user?.id && (
                        <div className="flex-1 text-[11px] font-black text-center text-muted-foreground italic py-1.5 bg-muted/30 rounded-lg">
                          Управление командой
                        </div>
                      )}

                      {team.is_member && user && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 shrink-0 border-slate-200 hover:bg-slate-50 hover:text-habit-green transition-all"
                          onClick={() => openMessageDialog(team)}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Создать команду</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Напишите вашу деятельность, чтобы единомышленники присоединились к вам
            </p>
            <Input
              placeholder="Например: Фитнес, саморазвитие, бизнес..."
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              autoFocus
            />

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => {
                setCreateModalOpen(false);
                setActivity("");
              }}>
                Отмена
              </Button>
              <Button
                className="bg-habit-green hover:bg-habit-green/90"
                disabled={!activity.trim()}
                onClick={handleCreateTeam}
              >
                Создать
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedTeam && (
        <TeamMessageDialog
          open={messageDialogOpen}
          onOpenChange={setMessageDialogOpen}
          teamId={selectedTeam.id}
          members={[
            { id: selectedTeam.leader_id, nickname: selectedTeam.leader_nickname },
            ...selectedTeam.members
          ].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)} // Unique members
          currentUserId={user?.id}
        />
      )}
    </div>
  );
};

export default Teams;