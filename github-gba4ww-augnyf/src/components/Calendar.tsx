import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  startOfWeek,
  endOfWeek,
  isToday,
  parseISO,
  addDays
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayLog, Tag } from '../types';

interface CalendarProps {
  currentDate: Date;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onDateSelect: (date: Date) => void;
  logs: DayLog[];
  tags: Tag[];
  onEditLog: (log: DayLog) => void;
}

interface DayCellProps {
  date: Date;
  logs: DayLog[];
  tags: Tag[];
  isSelected: boolean;
  isCurrentMonth: boolean;
  onClick: () => void;
}

function DayCell({ date, logs, tags, isSelected, isCurrentMonth, onClick }: DayCellProps) {
  const dayLogs = logs.filter((log) => isSameDay(parseISO(log.date), date));
  const hasLogs = dayLogs.length > 0;
  const isCurrentDay = isToday(date);

  return (
    <button
      onClick={onClick}
      className={`w-full aspect-square p-2 rounded-lg relative transition-colors ${
        !isCurrentMonth 
          ? 'opacity-30'
          : isSelected
          ? 'bg-[#3a3a3a] text-white'
          : hasLogs
          ? 'bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white'
          : 'hover:bg-[#1a1a1a] text-gray-400'
      } ${isCurrentDay ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className={`absolute top-2 left-2 text-sm ${isCurrentDay ? 'font-bold' : ''}`}>
        {format(date, 'd')}
      </div>
      <div className="absolute bottom-1 right-1 flex flex-col gap-1">
        {dayLogs.map((log) => {
          const logTags = tags.filter((tag) => log.tags.includes(tag.id));
          return (
            <div
              key={log.id}
              className="flex items-center gap-1 justify-end"
            >
              {logTags.map((tag) => (
                <div
                  key={tag.id}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
              ))}
            </div>
          );
        })}
      </div>
    </button>
  );
}

export function Calendar({ 
  currentDate, 
  selectedDate,
  onDateChange, 
  onDateSelect,
  logs, 
  tags,
  onEditLog 
}: CalendarProps) {
  // Get the start and end of the month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Get the start and end of the calendar (including days from previous/next months)
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  // Get all days that should be displayed
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handleMonthChange = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    onDateChange(newDate);
  };

  return (
    <div className="bg-[#1a1a1a] rounded-lg shadow-lg p-6 border border-[#2a2a2a]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleMonthChange(-1)}
            className="p-2 hover:bg-[#2a2a2a] rounded transition-colors text-gray-400"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleMonthChange(1)}
            className="p-2 hover:bg-[#2a2a2a] rounded transition-colors text-gray-400"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        {days.map(day => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          return (
            <DayCell
              key={day.toISOString()}
              date={day}
              logs={logs}
              tags={tags}
              isSelected={isSelected}
              isCurrentMonth={isCurrentMonth}
              onClick={() => {
                onDateSelect(day);
                const dayLogs = logs.filter((log) => isSameDay(parseISO(log.date), day));
                if (dayLogs.length > 0) {
                  onEditLog(dayLogs[0]); // Edit the first log by default
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
}