import { Users, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TeamMember {
  id: string;
  nickname: string;
  isLeader?: boolean;
}

const TeamButton = () => {
  // Пока хардкодим root как лидера команды
  const teamMembers: TeamMember[] = [
    { id: "1", nickname: "root", isLeader: true },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
        >
          <Users className="w-3.5 h-3.5" />
          Команда
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Участники команды
          </h4>
          
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-2 rounded-xl bg-muted/30 border border-border/50"
            >
              {/* Avatar */}
              <Avatar className="w-10 h-10 shrink-0">
                <AvatarFallback className="bg-habit-green text-white text-sm font-bold">
                  {member.nickname.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {/* Nickname with crown */}
              <div className="flex flex-col min-w-0">
                {member.isLeader && (
                  <Crown className="w-4 h-4 text-foreground mb-0.5" />
                )}
                <span className="text-sm font-medium text-foreground truncate">
                  {member.nickname}
                </span>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TeamButton;
