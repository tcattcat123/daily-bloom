import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HabitSettingsModalProps {
  open: boolean;
  onClose: () => void;
  habits: string[];
  onSave: (habits: string[]) => void;
}

const HabitSettingsModal = ({ open, onClose, habits, onSave }: HabitSettingsModalProps) => {
  const [localHabits, setLocalHabits] = useState<string[]>(habits);
  const [newHabit, setNewHabit] = useState("");

  const handleAdd = () => {
    if (newHabit.trim()) {
      setLocalHabits([...localHabits, newHabit.trim()]);
      setNewHabit("");
    }
  };

  const handleRemove = (index: number) => {
    setLocalHabits(localHabits.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(localHabits);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Настройка привычек
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-4">
          {localHabits.map((habit, idx) => (
            <div key={idx} className="flex items-center gap-2 group">
              <div className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm">
                {habit}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                onClick={() => handleRemove(idx)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          <div className="flex items-center gap-2 mt-2">
            <Input
              placeholder="Новая привычка..."
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1"
            />
            <Button onClick={handleAdd} size="icon" variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleSave} className="bg-habit-green hover:bg-habit-green-hover text-white">
            Сохранить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HabitSettingsModal;
