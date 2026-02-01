import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Crown, Plus, Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

interface TeamMember {
  id: string;
  nickname: string;
  isLeader?: boolean;
}

interface Team {
  id: string;
  name: string;
  members: TeamMember[];
}

const Teams = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Пока хардкодим данные — потом будет из Supabase
  const [userTeam] = useState<Team | null>({
    id: "1",
    name: "Моя команда",
    members: [
      { id: "1", nickname: "root", isLeader: true },
    ],
  });

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
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50"
                >
                  {/* Avatar */}
                  <Avatar className="w-12 h-12 shrink-0">
                    <AvatarFallback className="bg-habit-green text-white text-base font-bold">
                      {member.nickname.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Nickname with crown */}
                  <div className="flex flex-col min-w-0 flex-1">
                    {member.isLeader && (
                      <Crown className="w-4 h-4 text-foreground mb-0.5" />
                    )}
                    <span className="text-sm font-medium text-foreground truncate">
                      {member.nickname}
                    </span>
                  </div>

                  {/* Leader badge */}
                  {member.isLeader && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
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
                  <Button className="gap-2 bg-habit-green hover:bg-habit-green/90">
                    <Plus className="w-4 h-4" />
                    Создать команду
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <UserPlus className="w-4 h-4" />
                    Вступить в команду
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
