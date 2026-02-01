import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Crown, Plus, Users, UserPlus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

interface TeamMember {
  id: string;
  nickname: string;
  isLeader?: boolean;
  occupation?: string;
  tiktokLink?: string;
}

interface Team {
  id: string;
  name: string;
  members: TeamMember[];
}

const Teams = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  
  // Form fields for creating team
  const [occupation, setOccupation] = useState("");
  const [motivation, setMotivation] = useState("");
  const [leaderValue, setLeaderValue] = useState("");
  const [tiktokLink, setTiktokLink] = useState("");
  
  // Хардкодим команду с root — потом будет из Supabase
  const [userTeam, setUserTeam] = useState<Team | null>({
    id: "1",
    name: "Моя команда",
    members: [
      { 
        id: "1", 
        nickname: "root", 
        isLeader: true,
        occupation: "Продуктивность и саморазвитие",
        tiktokLink: "https://tiktok.com/@root"
      },
    ],
  });

  const handleMemberClick = (nickname: string) => {
    setSelectedUser(nickname);
    setJoinModalOpen(true);
  };

  const handleCreateTeam = () => {
    if (!occupation.trim() || !motivation.trim() || !leaderValue.trim()) return;
    
    const newTeam: Team = {
      id: Date.now().toString(),
      name: "Моя команда",
      members: [
        {
          id: user?.id || "1",
          nickname: user?.nickname || "User",
          isLeader: true,
          occupation: occupation.trim(),
          tiktokLink: tiktokLink.trim() || undefined,
        }
      ]
    };
    
    setUserTeam(newTeam);
    setCreateModalOpen(false);
    setOccupation("");
    setMotivation("");
    setLeaderValue("");
    setTiktokLink("");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <header className="flex items-center gap-3 mb-6">
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
      </header>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Current Team */}
        {userTeam ? (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                {userTeam.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {userTeam.members.map((member) => (
                <div
                  key={member.id}
                  onClick={() => handleMemberClick(member.nickname)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  {/* Avatar */}
                  <Avatar className="w-12 h-12 shrink-0">
                    <AvatarFallback className="bg-habit-green text-white text-base font-bold">
                      {member.nickname.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Member info with occupation and TikTok */}
                  <div className="flex flex-col min-w-0 flex-1">
                    {member.isLeader && (
                      <Crown className="w-4 h-4 text-foreground mb-0.5" />
                    )}
                    <span className="text-sm font-medium text-foreground truncate">
                      {member.nickname}
                    </span>
                    {member.occupation && (
                      <span className="text-xs text-muted-foreground truncate">
                        {member.occupation}
                      </span>
                    )}
                    {member.tiktokLink && (
                      <a 
                        href={member.tiktokLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <ExternalLink className="w-3 h-3" />
                        TikTok
                      </a>
                    )}
                  </div>

                  {/* Leader badge */}
                  {member.isLeader && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full shrink-0">
                      Лидер
                    </span>
                  )}
                </div>
              ))}

              {/* Invite button */}
              <Button
                variant="outline"
                className="w-full gap-2 mt-3"
                onClick={() => {/* TODO: invite modal */}}
              >
                <UserPlus className="w-4 h-4" />
                Пригласить участника
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* No team - show options */
          <div className="space-y-4">
            <Card className="border-dashed">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    У вас пока нет команды
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Создайте свою команду или присоединитесь к существующей
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    className="gap-2 bg-habit-green hover:bg-habit-green/90"
                    onClick={() => setCreateModalOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Создать команду
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Join Team Modal */}
      <Dialog open={joinModalOpen} onOpenChange={setJoinModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Вступить в команду</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                Введите код доступа к команде пользователя <span className="font-semibold text-foreground">{selectedUser}</span>
              </p>
              <Input
                placeholder="Код доступа"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => {
                setJoinModalOpen(false);
                setSelectedUser(null);
                setAccessCode("");
              }}>
                Отмена
              </Button>
              <Button 
                className="bg-habit-green hover:bg-habit-green/90"
                disabled={!accessCode.trim()}
              >
                Вступить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Team Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Создать команду</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="occupation">Чем вы занимаетесь?</Label>
              <Textarea
                id="occupation"
                placeholder="Например: Продуктивность и саморазвитие, фитнес, бизнес..."
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="motivation">На что вы хотите мотивировать аудиторию?</Label>
              <Textarea
                id="motivation"
                placeholder="Например: Ежедневные привычки, здоровый образ жизни, достижение целей..."
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="leaderValue">Чем вы будете полезны как лидер?</Label>
              <Textarea
                id="leaderValue"
                placeholder="Например: Буду делиться опытом, мотивировать команду, давать обратную связь..."
                value={leaderValue}
                onChange={(e) => setLeaderValue(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tiktok">Ссылка на ваш ТикТок (необязательно)</Label>
              <Input
                id="tiktok"
                placeholder="https://tiktok.com/@username"
                value={tiktokLink}
                onChange={(e) => setTiktokLink(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => {
                setCreateModalOpen(false);
                setOccupation("");
                setMotivation("");
                setLeaderValue("");
                setTiktokLink("");
              }}>
                Отмена
              </Button>
              <Button 
                className="bg-habit-green hover:bg-habit-green/90"
                disabled={!occupation.trim() || !motivation.trim() || !leaderValue.trim()}
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
