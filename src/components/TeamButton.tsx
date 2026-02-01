import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const TeamButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate("/teams")}
      className="h-8 gap-1.5 text-xs"
    >
      <Users className="w-3.5 h-3.5" />
      Команды
    </Button>
  );
};

export default TeamButton;
