import React, { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { Calendar } from '../components/Calendar';
import { NewLogForm } from '../components/NewLogForm';
import { TagStats } from '../components/TagStats';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AppState, DayLog, Tag } from '../types';
import { initialState } from '../utils/constants';

export function LoggerView() {
  const [state, setState] = useLocalStorage<AppState>('film-work-logger', initialState);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingLog, setEditingLog] = useState<DayLog | null>(null);

  const handleAddLog = (projectId: string, tags: string[], notes: string) => {
    const newLog: DayLog = {
      id: crypto.randomUUID(),
      date: format(selectedDate, 'yyyy-MM-dd'),
      projectId,
      tags,
      notes,
    };

    setState(prev => {
      const existingLogs = prev.logs.filter(log => 
        isSameDay(new Date(log.date), selectedDate)
      );

      // If editing, remove the edited log from the count
      const logsCount = editingLog 
        ? existingLogs.filter(log => log.id !== editingLog.id).length 
        : existingLogs.length;

      // Only allow adding if there are less than 2 logs for the day
      if (logsCount >= 2) {
        alert('Maximum of 2 logs per day allowed');
        return prev;
      }

      return {
        ...prev,
        logs: [
          ...prev.logs.filter(log => 
            !isSameDay(new Date(log.date), selectedDate) || 
            (editingLog && log.id === editingLog.id)
          ),
          newLog
        ],
      };
    });
    setEditingLog(null);
  };

  const handleDeleteLog = (logId: string) => {
    setState(prev => ({
      ...prev,
      logs: prev.logs.filter(log => log.id !== logId),
    }));
    setEditingLog(null);
  };

  const handleEditLog = (log: DayLog) => {
    setSelectedDate(new Date(log.date));
    setEditingLog(log);
  };

  const handleUpdateTags = (updatedTags: Tag[]) => {
    setState(prev => ({
      ...prev,
      tags: updatedTags,
    }));
  };

  const handleDeleteTag = (tagId: string) => {
    setState(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag.id !== tagId),
      logs: prev.logs.map(log => ({
        ...log,
        tags: log.tags.filter(t => t !== tagId),
      })),
    }));
  };

  const handleAddTag = (name: string, color: string) => {
    const newTag = {
      id: crypto.randomUUID(),
      name,
      color,
    };
    setState(prev => ({
      ...prev,
      tags: [...prev.tags, newTag],
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <NewLogForm
          projects={state.projects}
          tags={state.tags}
          onAddLog={handleAddLog}
          onAddProject={(projectNumber, productionCompany, name) => {
            const newProject = {
              id: crypto.randomUUID(),
              projectNumber,
              productionCompany,
              name,
              createdAt: new Date().toISOString(),
            };
            setState(prev => ({
              ...prev,
              projects: [newProject, ...prev.projects],
            }));
          }}
          onAddTag={handleAddTag}
          onUpdateTags={handleUpdateTags}
          onDeleteTag={handleDeleteTag}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          editingLog={editingLog}
          onDeleteLog={handleDeleteLog}
        />
        <Calendar
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          logs={state.logs}
          tags={state.tags}
          onEditLog={handleEditLog}
        />
      </div>
      <div>
        <TagStats logs={state.logs} tags={state.tags} />
      </div>
    </div>
  );
}