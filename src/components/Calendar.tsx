import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
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

export function Calendar({ 
  currentDate, 
  selectedDate,
  onDateChange, 
  onDateSelect,
  logs, 
  tags,
  onEditLog 
}: CalendarProps) {
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start, end });

  const getLogsForDay = (date: Date) => {
    return logs
      .filter(l => isSameDay(new Date(l.date), date))
      .slice(0, 2); // Limit to 2 logs per day
  };

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
          const dayLogs = getLogsForDay(day);
          const isSelected = isSameDay(day, selectedDate);
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => {
                onDateSelect(day);
                if (dayLogs.length > 0) {
                  onEditLog(dayLogs[0]); // Edit the first log by default
                }
              }}
              className={`
                group aspect-square p-2 rounded transition-all
                ${isSelected ? 'ring-2 ring-[#3a3a3a] ring-offset-2 ring-offset-[#1a1a1a]' : ''}
                ${isToday(day) ? 'bg-[#2a2a2a]' : 'hover:bg-[#2a2a2a]'}
                ${dayLogs.length > 0 ? 'shadow-sm' : ''}
              `}
            >
              <div className={`
                text-sm mb-1 font-medium
                ${isToday(day) ? 'text-white' : 'text-gray-400'}
              `}>
                {format(day, 'd')}
              </div>
              {dayLogs.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center">
                  {dayLogs.map((log, index) => (
                    <div key={log.id} className="flex gap-1">
                      {log.tags.slice(0, 1).map(tagId => {
                        const tag = tags.find(t => t.id === tagId);
                        return tag ? (
                          <div
                            key={tag.id}
                            className="w-2 h-2 rounded-full opacity-80"
                            style={{ backgroundColor: tag.color }}
                          />
                        ) : null;
                      })}
                    </div>
                  ))}
                </div>
              )}
              {dayLogs.length > 0 && (
                <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit2 className="w-3 h-3 mx-auto text-gray-500" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}