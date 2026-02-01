import { useState, useEffect } from "react";
import { Plus, Trash2, LogOut, RotateCcw, LayoutGrid, LayoutList, Sun, Moon, TrendingUp, Calendar, Flame, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useTheme } from "next-themes";

interface Statistics {
  totalRitualsDone: number;
  totalWorkHabitsDone: number;
  totalPersonalHabitsDone: number;
  totalPillsDone: number;
  perfectDays: number;
  currentStreak: number;
  longestStreak: number;
}

interface PillItem {
  name: string;
  time: string;
  done: boolean;
}

interface RitualItem {
  text: string;
  done: boolean;
}

interface DayData {
  name: string;
  dateStr: string;
  completedIndices: number[];
  enabledHabits?: number[]; // Which habits are enabled for this day
}

interface HabitSettingsModalProps {
  open: boolean;
  onClose: () => void;
  habits: string[];
  personalHabits: string[];
  rituals: RitualItem[];
  pills: PillItem[];
  pillsEnabled: boolean;
  layout: "vertical" | "horizontal";
  weekData: DayData[];
  statistics?: Statistics;
  onSaveHabits: (habits: string[]) => void;
  onSavePersonalHabits: (habits: string[]) => void;
  onSaveRituals: (rituals: RitualItem[]) => void;
  onSavePills: (pills: PillItem[]) => void;
  onTogglePills: (enabled: boolean) => void;
  onSetLayout: (layout: "vertical" | "horizontal") => void;
  onSaveWeekData: (weekData: DayData[]) => void;
  onResetWeek: () => void;
  onLogout: () => void;
}

// Theme toggle component
const ThemeToggleSection = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div>
      <Label className="text-sm font-medium mb-2 block">Тема оформления</Label>
      <div className="flex gap-2">
        <Button
          variant={theme === "light" ? "default" : "outline"}
          size="sm"
          onClick={() => setTheme("light")}
          className="flex-1 gap-2"
        >
          <Sun className="w-4 h-4" />
          Светлая
        </Button>
        <Button
          variant={theme === "dark" ? "default" : "outline"}
          size="sm"
          onClick={() => setTheme("dark")}
          className="flex-1 gap-2"
        >
          <Moon className="w-4 h-4" />
          Тёмная
        </Button>
      </div>
    </div>
  );
};

// Statistics section component
const StatisticsSection = ({ statistics }: { statistics?: Statistics }) => {
  if (!statistics) return null;
  
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium mb-2 block">Ваша статистика</Label>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-habit-green/20 to-habit-green/5 rounded-xl p-3 border border-habit-green/20">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-streak-orange" />
            <span className="text-xs text-muted-foreground">Текущий стрик</span>
          </div>
          <div className="text-2xl font-bold text-habit-green">{statistics.currentStreak}</div>
          <div className="text-[10px] text-muted-foreground">дней подряд</div>
        </div>
        
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-3 border border-primary/20">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Рекорд</span>
          </div>
          <div className="text-2xl font-bold text-primary">{statistics.longestStreak}</div>
          <div className="text-[10px] text-muted-foreground">максимум дней</div>
        </div>
        
        <div className="bg-gradient-to-br from-ritual-gold/20 to-ritual-gold/5 rounded-xl p-3 border border-ritual-gold/20">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-ritual-gold" />
            <span className="text-xs text-muted-foreground">Идеальных дней</span>
          </div>
          <div className="text-2xl font-bold text-ritual-gold">{statistics.perfectDays}</div>
          <div className="text-[10px] text-muted-foreground">все ритуалы</div>
        </div>
        
        <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl p-3 border border-accent/20">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-accent-foreground" />
            <span className="text-xs text-muted-foreground">Всего ритуалов</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{statistics.totalRitualsDone}</div>
          <div className="text-[10px] text-muted-foreground">выполнено</div>
        </div>
      </div>
      
      <div className="space-y-2 pt-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Рабочие привычки</span>
          <span className="font-medium">{statistics.totalWorkHabitsDone}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Личное развитие</span>
          <span className="font-medium">{statistics.totalPersonalHabitsDone}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Таблетки принято</span>
          <span className="font-medium">{statistics.totalPillsDone}</span>
        </div>
      </div>
    </div>
  );
};

const HabitSettingsModal = ({ 
  open, 
  onClose, 
  habits, 
  personalHabits,
  rituals,
  pills,
  pillsEnabled,
  layout,
  weekData,
  statistics,
  onSaveHabits, 
  onSavePersonalHabits,
  onSaveRituals,
  onSavePills,
  onTogglePills,
  onSetLayout,
  onSaveWeekData,
  onResetWeek,
  onLogout
}: HabitSettingsModalProps) => {
  const [localHabits, setLocalHabits] = useState<string[]>(habits);
  const [localPersonalHabits, setLocalPersonalHabits] = useState<string[]>(personalHabits);
  const [localRituals, setLocalRituals] = useState<RitualItem[]>(rituals);
  const [localPills, setLocalPills] = useState<PillItem[]>(pills);
  const [localPillsEnabled, setLocalPillsEnabled] = useState(pillsEnabled);
  const [localLayout, setLocalLayout] = useState(layout);
  const [localWeekData, setLocalWeekData] = useState<DayData[]>(weekData);
  const [newHabit, setNewHabit] = useState("");
  const [newPersonalHabit, setNewPersonalHabit] = useState("");
  const [newRitual, setNewRitual] = useState("");
  const [newPillName, setNewPillName] = useState("");
  const [newPillTime, setNewPillTime] = useState("утро");
  const [selectedDay, setSelectedDay] = useState(0);

  const dayShortNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  useEffect(() => {
    if (open) {
      setLocalHabits(habits);
      setLocalPersonalHabits(personalHabits);
      setLocalRituals(rituals);
      setLocalPills(pills);
      setLocalPillsEnabled(pillsEnabled);
      setLocalLayout(layout);
      // Initialize enabledHabits if not present
      setLocalWeekData(weekData.map((day, idx) => ({
        ...day,
        enabledHabits: day.enabledHabits ?? habits.map((_, i) => i)
      })));
    }
  }, [open, habits, personalHabits, rituals, pills, pillsEnabled, layout, weekData]);

  const handleAddHabit = () => {
    if (newHabit.trim()) {
      const newHabitsList = [...localHabits, newHabit.trim()];
      setLocalHabits(newHabitsList);
      // Add new habit to all days by default
      setLocalWeekData(prev => prev.map(day => ({
        ...day,
        enabledHabits: [...(day.enabledHabits || []), newHabitsList.length - 1]
      })));
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

  const handleRemoveHabit = (idx: number) => {
    const newHabitsList = localHabits.filter((_, i) => i !== idx);
    setLocalHabits(newHabitsList);
    // Update enabledHabits to remove references to deleted habit and reindex
    setLocalWeekData(prev => prev.map(day => ({
      ...day,
      enabledHabits: (day.enabledHabits || [])
        .filter(i => i !== idx)
        .map(i => i > idx ? i - 1 : i),
      completedIndices: day.completedIndices
        .filter(i => i !== idx)
        .map(i => i > idx ? i - 1 : i)
    })));
  };

  const toggleHabitForDay = (dayIdx: number, habitIdx: number) => {
    setLocalWeekData(prev => prev.map((day, idx) => {
      if (idx !== dayIdx) return day;
      const enabled = day.enabledHabits || [];
      if (enabled.includes(habitIdx)) {
        return { ...day, enabledHabits: enabled.filter(i => i !== habitIdx) };
      }
      return { ...day, enabledHabits: [...enabled, habitIdx].sort((a, b) => a - b) };
    }));
  };

  const handleSave = () => {
    onSaveHabits(localHabits);
    onSavePersonalHabits(localPersonalHabits);
    onSaveRituals(localRituals);
    onSavePills(localPills);
    onTogglePills(localPillsEnabled);
    onSetLayout(localLayout);
    onSaveWeekData(localWeekData);
    onClose();
  };

  const handleResetWeek = () => {
    if (confirm("Начать новую неделю? Прогресс текущей недели будет сброшен.")) {
      onResetWeek();
      onClose();
    }
  };

  const handleLogout = () => {
    if (confirm("Вы уверены, что хотите выйти?")) {
      onLogout();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Настройки</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="rituals" className="mt-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="rituals" className="text-xs">Утро</TabsTrigger>
            <TabsTrigger value="work" className="text-xs">Рабочие</TabsTrigger>
            <TabsTrigger value="personal" className="text-xs">Личные</TabsTrigger>
            <TabsTrigger value="pills" className="text-xs">Таблетки</TabsTrigger>
            <TabsTrigger value="other" className="text-xs">Прочее</TabsTrigger>
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
              Настройте привычки для каждого дня недели
            </p>
            
            {/* Day selector */}
            <div className="flex gap-1 mb-4">
              {dayShortNames.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDay(idx)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                    selectedDay === idx
                      ? 'bg-habit-green text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Habits list with checkboxes for selected day */}
            <div className="flex flex-col gap-2 mb-4">
              <Label className="text-xs text-muted-foreground">
                Задачи на {localWeekData[selectedDay]?.name || dayShortNames[selectedDay]}:
              </Label>
              {localHabits.length === 0 ? (
                <p className="text-xs text-muted-foreground/60 italic py-2">
                  Добавьте привычки ниже
                </p>
              ) : (
                localHabits.map((habit, idx) => {
                  const isEnabled = localWeekData[selectedDay]?.enabledHabits?.includes(idx) ?? true;
                  return (
                    <div key={idx} className="flex items-center gap-2 group">
                      <Checkbox
                        checked={isEnabled}
                        onCheckedChange={() => toggleHabitForDay(selectedDay, idx)}
                        className="data-[state=checked]:bg-habit-green data-[state=checked]:border-habit-green"
                      />
                      <div className={`flex-1 px-3 py-2 rounded-lg text-sm transition-opacity ${
                        isEnabled ? 'bg-muted' : 'bg-muted/50 text-muted-foreground/60'
                      }`}>
                        {habit}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive h-8 w-8"
                        onClick={() => handleRemoveHabit(idx)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })
              )}
            </div>

            <Separator className="my-3" />
            
            {/* Add new habit */}
            <Label className="text-xs text-muted-foreground mb-2 block">Добавить новую привычку:</Label>
            <div className="flex items-center gap-2">
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

          {/* Other Settings Tab */}
          <TabsContent value="other" className="mt-4">
            <StatisticsSection statistics={statistics} />
            
            <Separator className="my-4" />
            
            <ThemeToggleSection />
            
            <Separator className="my-4" />
            
            <div className="flex flex-col gap-4">
              {/* Layout Toggle */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Вид отображения</Label>
                <div className="flex gap-2">
                  <Button
                    variant={localLayout === "vertical" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLocalLayout("vertical")}
                    className="flex-1 gap-2"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    Колонки
                  </Button>
                  <Button
                    variant={localLayout === "horizontal" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLocalLayout("horizontal")}
                    className="flex-1 gap-2"
                  >
                    <LayoutList className="w-4 h-4" />
                    Строки
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Reset Week */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Сброс недели</Label>
                <Button
                  variant="outline"
                  onClick={handleResetWeek}
                  className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <RotateCcw className="w-4 h-4" />
                  Начать новую неделю
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  Сбросит прогресс всех привычек за текущую неделю
                </p>
              </div>

              <Separator />

              {/* Logout */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Аккаунт</Label>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти из аккаунта
                </Button>
              </div>
            </div>
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
