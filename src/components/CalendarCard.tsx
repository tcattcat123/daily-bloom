import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Trash2, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarEvent } from "@/hooks/useUserData";

interface CalendarCardProps {
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onRemoveEvent: (id: string) => void;
}

const colorOptions = [
  { value: 'green' as const, label: 'Зелёный', className: 'bg-habit-green' },
  { value: 'blue' as const, label: 'Синий', className: 'bg-blue-500' },
  { value: 'yellow' as const, label: 'Жёлтый', className: 'bg-ritual-gold' },
  { value: 'orange' as const, label: 'Оранжевый', className: 'bg-streak-orange' },
  { value: 'gray' as const, label: 'Серый', className: 'bg-muted-foreground' },
];

const getColorClass = (color: CalendarEvent['color']) => {
  switch (color) {
    case 'green': return 'bg-habit-green text-white';
    case 'blue': return 'bg-blue-500 text-white';
    case 'yellow': return 'bg-ritual-gold text-white';
    case 'orange': return 'bg-streak-orange text-white';
    case 'gray': return 'bg-muted-foreground text-white';
    default: return 'bg-muted text-foreground';
  }
};

const CalendarCard = ({ events, onAddEvent, onRemoveEvent }: CalendarCardProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventColor, setNewEventColor] = useState<CalendarEvent['color']>('green');

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Calculate days to show from previous month
  const startDayOfWeek = (monthStart.getDay() + 6) % 7; // Monday = 0
  const prevMonthDays: Date[] = [];
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(monthStart);
    d.setDate(d.getDate() - i - 1);
    prevMonthDays.push(d);
  }

  // Calculate days to show from next month
  const endDayOfWeek = (monthEnd.getDay() + 6) % 7;
  const nextMonthDays: Date[] = [];
  for (let i = 1; i < 7 - endDayOfWeek; i++) {
    const d = new Date(monthEnd);
    d.setDate(d.getDate() + i);
    nextMonthDays.push(d);
  }

  const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return (events || []).filter(e => e.date === dateStr);
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    if (!selectedDate || !newEventTitle.trim()) return;
    
    onAddEvent({
      date: format(selectedDate, 'yyyy-MM-dd'),
      title: newEventTitle.trim(),
      time: newEventTime || undefined,
      color: newEventColor,
    });
    
    setNewEventTitle("");
    setNewEventTime("");
    setNewEventColor('green');
    setIsAddModalOpen(false);
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const today = new Date();

  return (
    <div className="bg-card rounded-xl p-4 shadow-card border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground">📅 Календарь</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handlePrevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs font-medium min-w-24 text-center">
            {format(currentMonth, 'LLLL yyyy', { locale: ru })}
          </span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
          <div key={day} className="text-center text-[10px] font-medium text-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {allDays.map((date, idx) => {
          const dayEvents = getEventsForDate(date);
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isToday = isSameDay(date, today);
          const isSelected = selectedDate && isSameDay(date, selectedDate);

          return (
            <button
              key={idx}
              onClick={() => handleDayClick(date)}
              className={`
                relative aspect-square flex flex-col items-center justify-start p-1 rounded-lg transition-all text-xs
                ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground/50'}
                ${isToday ? 'bg-habit-green/20 ring-1 ring-habit-green' : ''}
                ${isSelected ? 'bg-primary/20 ring-1 ring-primary' : 'hover:bg-muted'}
              `}
            >
              <span className={`font-medium ${isToday ? 'text-habit-green' : ''}`}>
                {format(date, 'd')}
              </span>
              {/* Event indicators */}
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center max-w-full">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={`w-1.5 h-1.5 rounded-full ${getColorClass(event.color).split(' ')[0]}`}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-[8px] text-muted-foreground">+{dayEvents.length - 3}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day events panel */}
      {selectedDate && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-foreground">
              {format(selectedDate, 'd MMMM, EEEE', { locale: ru })}
            </h4>
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-[10px] gap-1"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="w-3 h-3" />
              Добавить
            </Button>
          </div>
          
          {selectedDateEvents.length === 0 ? (
            <p className="text-xs text-muted-foreground/60 italic py-2">
              Нет запланированных дел
            </p>
          ) : (
            <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto">
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs ${getColorClass(event.color)}`}
                >
                  <span className="flex-1 truncate font-medium">{event.title}</span>
                  {event.time && (
                    <span className="flex items-center gap-0.5 opacity-80">
                      <Clock className="w-3 h-3" />
                      {event.time}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveEvent(event.id);
                    }}
                    className="opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Event Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Новое дело на {selectedDate && format(selectedDate, 'd MMMM', { locale: ru })}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Название
              </label>
              <Input
                placeholder="Что нужно сделать..."
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddEvent()}
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Время (опционально)
              </label>
              <Input
                type="time"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Цвет
              </label>
              <div className="flex gap-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setNewEventColor(option.value)}
                    className={`w-8 h-8 rounded-full ${option.className} transition-all ${
                      newEventColor === option.value 
                        ? 'ring-2 ring-offset-2 ring-primary ring-offset-background' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Отмена
            </Button>
            <Button 
              onClick={handleAddEvent}
              disabled={!newEventTitle.trim()}
              className="bg-habit-green hover:bg-habit-green-hover text-white"
            >
              Добавить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarCard;
