import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PillItem {
  name: string;
  time: string;
  done: boolean;
}

interface RitualItem {
  text: string;
  done: boolean;
}

interface HabitSettingsModalProps {
  open: boolean;
  onClose: () => void;
  habits: string[];
  personalHabits: string[];
  rituals: RitualItem[];
  pills: PillItem[];
  pillsEnabled: boolean;
  onSaveHabits: (habits: string[]) => void;
  onSavePersonalHabits: (habits: string[]) => void;
  onSaveRituals: (rituals: RitualItem[]) => void;
  onSavePills: (pills: PillItem[]) => void;
  onTogglePills: (enabled: boolean) => void;
}

const HabitSettingsModal = ({ 
  open, 
  onClose, 
  habits, 
  personalHabits,
  rituals,
  pills,
  pillsEnabled,
  onSaveHabits, 
  onSavePersonalHabits,
  onSaveRituals,
  onSavePills,
  onTogglePills
}: HabitSettingsModalProps) => {
  const [localHabits, setLocalHabits] = useState<string[]>(habits);
  const [localPersonalHabits, setLocalPersonalHabits] = useState<string[]>(personalHabits);
  const [localRituals, setLocalRituals] = useState<RitualItem[]>(rituals);
  const [localPills, setLocalPills] = useState<PillItem[]>(pills);
  const [localPillsEnabled, setLocalPillsEnabled] = useState(pillsEnabled);
  const [newHabit, setNewHabit] = useState("");
  const [newPersonalHabit, setNewPersonalHabit] = useState("");
  const [newRitual, setNewRitual] = useState("");
  const [newPillName, setNewPillName] = useState("");
  const [newPillTime, setNewPillTime] = useState("утро");

  useEffect(() => {
    if (open) {
      setLocalHabits(habits);
      setLocalPersonalHabits(personalHabits);
      setLocalRituals(rituals);
      setLocalPills(pills);
      setLocalPillsEnabled(pillsEnabled);
    }
  }, [open, habits, personalHabits, rituals, pills, pillsEnabled]);

  const handleAddHabit = () => {
    if (newHabit.trim()) {
      setLocalHabits([...localHabits, newHabit.trim()]);
      setNewHabit("");
    }
  };

  const handleAddPersonalHabit = () => {
    if (newPersonalHabit.trim()) {
      setLocalPersonalHabits([...localPersonalHabits, newPersonalHabit.trim()]);
      setNewPersonalHabit("");
    }
  };

  const handleAddRitual = () => {
    if (newRitual.trim()) {
      setLocalRituals([...localRituals, { text: newRitual.trim(), done: false }]);
      setNewRitual("");
    }
  };

  const handleAddPill = () => {
    if (newPillName.trim()) {
      setLocalPills([...localPills, { name: newPillName.trim(), time: newPillTime, done: false }]);
      setNewPillName("");
    }
  };

  const handleSave = () => {
    onSaveHabits(localHabits);
    onSavePersonalHabits(localPersonalHabits);
    onSaveRituals(localRituals);
    onSavePills(localPills);
    onTogglePills(localPillsEnabled);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Настройки</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="rituals" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rituals" className="text-xs">Утро</TabsTrigger>
            <TabsTrigger value="work" className="text-xs">Рабочие</TabsTrigger>
            <TabsTrigger value="personal" className="text-xs">Личные</TabsTrigger>
            <TabsTrigger value="pills" className="text-xs">Таблетки</TabsTrigger>
          </TabsList>
          
          {/* Rituals Tab */}
          <TabsContent value="rituals" className="mt-4">
            <p className="text-xs text-muted-foreground mb-3">
              Утренние ритуалы для продуктивного начала дня
            </p>
            <div className="flex flex-col gap-2">
              {localRituals.map((ritual, idx) => (
                <div key={idx} className="flex items-center gap-2 group">
                  <div className="flex-1 px-3 py-2 bg-ritual-gold/10 rounded-lg text-sm text-foreground">
                    {ritual.text}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive h-8 w-8"
                    onClick={() => setLocalRituals(localRituals.filter((_, i) => i !== idx))}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center gap-2 mt-2">
                <Input
                  placeholder="Новый утренний ритуал..."
                  value={newRitual}
                  onChange={(e) => setNewRitual(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddRitual()}
                  className="flex-1"
                />
                <Button onClick={handleAddRitual} size="icon" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Work Habits Tab */}
          <TabsContent value="work" className="mt-4">
            <p className="text-xs text-muted-foreground mb-3">
              Привычки для рабочего графика (дни недели)
            </p>
            <div className="flex flex-col gap-2">
              {localHabits.map((habit, idx) => (
                <div key={idx} className="flex items-center gap-2 group">
                  <div className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm">
                    {habit}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive h-8 w-8"
                    onClick={() => setLocalHabits(localHabits.filter((_, i) => i !== idx))}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center gap-2 mt-2">
                <Input
                  placeholder="Новая рабочая привычка..."
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddHabit()}
                  className="flex-1"
                />
                <Button onClick={handleAddHabit} size="icon" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Personal Habits Tab */}
          <TabsContent value="personal" className="mt-4">
            <p className="text-xs text-muted-foreground mb-3">
              Привычки для личного развития (верхний график)
            </p>
            <div className="flex flex-col gap-2">
              {localPersonalHabits.map((habit, idx) => (
                <div key={idx} className="flex items-center gap-2 group">
                  <div className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm">
                    {habit}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive h-8 w-8"
                    onClick={() => setLocalPersonalHabits(localPersonalHabits.filter((_, i) => i !== idx))}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center gap-2 mt-2">
                <Input
                  placeholder="Новая личная привычка..."
                  value={newPersonalHabit}
                  onChange={(e) => setNewPersonalHabit(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddPersonalHabit()}
                  className="flex-1"
                />
                <Button onClick={handleAddPersonalHabit} size="icon" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Pills Tab */}
          <TabsContent value="pills" className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor="pills-toggle" className="text-sm font-medium">
                Включить трекер таблеток
              </Label>
              <Switch
                id="pills-toggle"
                checked={localPillsEnabled}
                onCheckedChange={setLocalPillsEnabled}
              />
            </div>
            
            {localPillsEnabled && (
              <div className="flex flex-col gap-2">
                {localPills.map((pill, idx) => (
                  <div key={idx} className="flex items-center gap-2 group">
                    <div className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm flex justify-between">
                      <span>{pill.name}</span>
                      <span className="text-muted-foreground text-xs">{pill.time}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive h-8 w-8"
                      onClick={() => setLocalPills(localPills.filter((_, i) => i !== idx))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    placeholder="Название..."
                    value={newPillName}
                    onChange={(e) => setNewPillName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddPill()}
                    className="flex-1"
                  />
                  <select
                    value={newPillTime}
                    onChange={(e) => setNewPillTime(e.target.value)}
                    className="px-2 py-2 text-sm border rounded-md bg-background"
                  >
                    <option value="утро">утро</option>
                    <option value="обед">обед</option>
                    <option value="вечер">вечер</option>
                  </select>
                  <Button onClick={handleAddPill} size="icon" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
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
