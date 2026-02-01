import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isWeekend } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, X, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarEvent } from "@/hooks/useUserData";
import { useIsMobile } from "@/hooks/use-mobile";

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

const getDotColorClass = (color: CalendarEvent['color']) => {
  switch (color) {
    case 'green': return 'bg-habit-green';
    case 'blue': return 'bg-blue-500';
    case 'yellow': return 'bg-ritual-gold';
    case 'orange': return 'bg-streak-orange';
    case 'gray': return 'bg-muted-foreground';
    default: return 'bg-muted-foreground';
  }
};

const getEventBgClass = (color: CalendarEvent['color']) => {
  switch (color) {
    case 'green': return 'bg-habit-green/10 border-habit-green/20';
    case 'blue': return 'bg-blue-500/10 border-blue-500/20';
    case 'yellow': return 'bg-ritual-gold/10 border-ritual-gold/20';
    case 'orange': return 'bg-streak-orange/10 border-streak-orange/20';
    case 'gray': return 'bg-muted/50 border-muted-foreground/20';
    default: return 'bg-muted/50 border-border';
  }
};

const getEventTextClass = (color: CalendarEvent['color']) => {
  switch (color) {
    case 'green': return 'text-habit-green';
    case 'blue': return 'text-blue-600 dark:text-blue-400';
    case 'yellow': return 'text-ritual-gold';
    case 'orange': return 'text-streak-orange';
    case 'gray': return 'text-muted-foreground';
    default: return 'text-foreground';
  }
};

const CalendarCard = ({ events, onAddEvent, onRemoveEvent }: CalendarCardProps) => {
  const isMobile = useIsMobile();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventColor, setNewEventColor] = useState<CalendarEvent['color']>('green');
  
  const maxVisibleEvents = isMobile ? 2 : 12;

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

  const handleDayDoubleClick = (date: Date) => {
    setSelectedDate(date);
    setIsAddModalOpen(true);
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
    <div className="bg-card rounded-2xl p-5 shadow-lg border border-border/50 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-foreground tracking-tight">Календарь</h3>
        <div className="flex items-center gap-0.5 bg-muted/30 rounded-full px-1 py-0.5">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all" 
            onClick={handlePrevMonth}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs font-medium min-w-28 text-center text-foreground/70 capitalize">
            {format(currentMonth, 'LLLL yyyy', { locale: ru })}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all" 
            onClick={handleNextMonth}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, idx) => (
          <div 
            key={day} 
            className={`text-center text-[10px] font-medium py-1.5 ${
              idx >= 5 ? 'text-muted-foreground/60' : 'text-muted-foreground'
            }`}
          >
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
          const isWeekendDay = isWeekend(date);

          return (
            <button
              key={idx}
              onClick={() => handleDayClick(date)}
              onDoubleClick={() => handleDayDoubleClick(date)}
              className={`
                relative aspect-square flex flex-col items-center justify-start p-1.5 rounded-xl transition-all duration-200 text-xs group
                ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground/30'}
                ${isWeekendDay && isCurrentMonth ? 'text-muted-foreground/70' : ''}
                ${isToday ? 'bg-gradient-to-br from-habit-green/20 to-habit-green/5 shadow-sm' : ''}
                ${isSelected && !isToday ? 'bg-primary/5 shadow-sm' : ''}
                ${isSelected ? 'ring-1.5 ring-habit-green/50' : 'hover:bg-muted/30 hover:shadow-sm'}
              `}
            >
              <span className={`
                text-[11px] font-medium transition-colors
                ${isToday ? 'text-habit-green font-semibold' : ''}
                ${isSelected && !isToday ? 'text-primary' : ''}
              `}>
                {format(date, 'd')}
              </span>
              
              {/* Event dots/titles */}
              {dayEvents.length > 0 && (
                <div className="flex flex-col gap-0.5 mt-1 w-full overflow-hidden">
                  {dayEvents.slice(0, maxVisibleEvents).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-1 text-[8px] leading-tight opacity-80 group-hover:opacity-100 transition-opacity"
                      title={event.title}
                    >
                      <span className={`w-1 h-1 rounded-full shrink-0 ${getDotColorClass(event.color)}`} />
                      <span className="truncate text-foreground/70">{event.title}</span>
                    </div>
                  ))}
                  {dayEvents.length > maxVisibleEvents && (
                    <span className="text-[8px] text-muted-foreground/60 text-center font-medium">
                      +{dayEvents.length - maxVisibleEvents}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day events panel */}
      {selectedDate && (
        <div className="mt-5 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-medium text-foreground/80 capitalize">
              {format(selectedDate, 'd MMMM, EEEE', { locale: ru })}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-[10px] gap-1.5 text-habit-green hover:text-habit-green hover:bg-habit-green/10 rounded-full px-3"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="w-3 h-3" />
              Добавить
            </Button>
          </div>
          
          {selectedDateEvents.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground/40">
              <Sparkles className="w-4 h-4" />
              <p className="text-xs italic">Нет запланированных дел</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl border text-xs transition-all hover:shadow-sm ${getEventBgClass(event.color)}`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${getDotColorClass(event.color)}`} />
                  <span className={`flex-1 truncate font-medium ${getEventTextClass(event.color)}`}>
                    {event.title}
                  </span>
                  {event.time && (
                    <span className="flex items-center gap-1 text-muted-foreground text-[10px]">
                      <Clock className="w-3 h-3" />
                      {event.time}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveEvent(event.id);
                    }}
                    className="text-muted-foreground/50 hover:text-destructive transition-colors p-0.5 rounded-full hover:bg-destructive/10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Event Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Новое дело на {selectedDate && format(selectedDate, 'd MMMM', { locale: ru })}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-5 mt-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Название
              </label>
              <Input
                placeholder="Что нужно сделать..."
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddEvent()}
                className="rounded-xl border-border/50 focus:border-habit-green/50 transition-colors"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Время (опционально)
              </label>
              <Input
                type="time"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
                className="rounded-xl border-border/50 focus:border-habit-green/50 transition-colors"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Цвет
              </label>
              <div className="flex gap-3">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setNewEventColor(option.value)}
                    className={`w-9 h-9 rounded-full ${option.className} transition-all duration-200 ${
                      newEventColor === option.value 
                        ? 'ring-2 ring-offset-2 ring-offset-background scale-110 shadow-lg' 
                        : 'opacity-50 hover:opacity-80 hover:scale-105'
                    }`}
                    style={{
                      boxShadow: newEventColor === option.value ? `0 4px 12px ${option.value === 'green' ? 'rgba(34, 197, 94, 0.4)' : option.value === 'blue' ? 'rgba(59, 130, 246, 0.4)' : option.value === 'yellow' ? 'rgba(234, 179, 8, 0.4)' : option.value === 'orange' ? 'rgba(249, 115, 22, 0.4)' : 'rgba(107, 114, 128, 0.4)'}` : undefined
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setIsAddModalOpen(false)}
              className="rounded-xl"
            >
              Отмена
            </Button>
            <Button 
              onClick={handleAddEvent}
              disabled={!newEventTitle.trim()}
              className="bg-habit-green hover:bg-habit-green-hover text-white rounded-xl shadow-md hover:shadow-lg transition-all"
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
