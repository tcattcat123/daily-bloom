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
 
       <div className="max-w-2xl mx-auto space-y-3">
         {teams.length === 0 ? (
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
         ) : (
           teams.map((team) => (
             <Card key={team.id} className="overflow-hidden">
               <CardContent className="p-3 flex items-center gap-3">
                 <Avatar className="w-8 h-8 shrink-0">
                   <AvatarFallback className="bg-habit-green text-white text-xs font-bold">
                     {team.leader_nickname.charAt(0).toUpperCase()}
                   </AvatarFallback>
                 </Avatar>
                 
                 <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-1.5">
                     <Crown className="w-3 h-3 text-foreground shrink-0" />
                     <span className="text-sm font-medium text-foreground truncate">
                       {team.leader_nickname}
                     </span>
                     <span className="text-xs text-muted-foreground">
                       · {team.member_count} уч.
                     </span>
                   </div>
                   <p className="text-xs text-muted-foreground truncate">
                     {team.activity}
                   </p>
                  
                  {/* Member avatars */}
                  {team.members.length > 0 && (
                    <div className="flex items-center gap-0.5 mt-1">
                      {team.members.slice(0, 5).map((member, idx) => (
                        <Avatar 
                          key={member.id} 
                          className="w-5 h-5 border border-background"
                          style={{ marginLeft: idx > 0 ? '-4px' : '0' }}
                        >
                          <AvatarFallback className="bg-muted text-muted-foreground text-[8px] font-medium">
                            {member.nickname.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {team.members.length > 5 && (
                        <span className="text-[10px] text-muted-foreground ml-1">
                          +{team.members.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                 </div>
 
                 {user && team.leader_id !== user.id && (
                   team.is_member ? (
                     <Button
                       variant="outline"
                       size="sm"
                       className="shrink-0 text-xs h-7 px-2"
                       onClick={() => handleLeaveTeam(team.id)}
                     >
                       Выйти
                     </Button>
                   ) : (
                     <Button
                       size="sm"
                       className="shrink-0 text-xs h-7 px-2 bg-habit-green hover:bg-habit-green/90"
                       onClick={() => handleJoinTeam(team.id)}
                     >
                       Вступить
                     </Button>
                   )
                 )}
                 {team.leader_id === user?.id && (
                   <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full shrink-0">
                     Вы лидер
                   </span>
                 )}
               </CardContent>
             </Card>
           ))
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
     </div>
   );
 };
 
 export default Teams;