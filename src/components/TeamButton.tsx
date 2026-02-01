import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeamButtonProps {
  mobile?: boolean;
}

const TeamButton = ({ mobile = false }: TeamButtonProps) => {
  const navigate = useNavigate();

  if (mobile) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/teams")}
        className="sm:hidden h-6 w-6 p-0"
      >
        <Users className="w-3 h-3" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate("/teams")}
      className="hidden sm:flex h-8 gap-1.5 text-xs"
    >
      <Users className="w-3.5 h-3.5" />
      Команды
    </Button>
  );
};

export default TeamButton;
