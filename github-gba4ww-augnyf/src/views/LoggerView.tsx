import React, { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { Calendar } from '../components/Calendar';
import { NewLogForm } from '../components/NewLogForm';
import { TagStats } from '../components/TagStats';
import { useFirestore } from '../hooks/useFirestore';
import { DayLog, DayType, Tag } from '../types';

export function LoggerView() {
  const { state, loading, error, indexesBuilding, addLog, updateLog, deleteLog, addTag, deleteTag, addProject, updateTags } = useFirestore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingLog, setEditingLog] = useState<DayLog | null>(null);

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  if (indexesBuilding) {
    return (
      <div className="text-center text-gray-400">
        <p>Setting up the database...</p>
        <p className="text-sm mt-2">This may take a few minutes. Please wait.</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  // Rest of the component remains the same...
  const handleAddLog = async (projectId: string, tags: string[], notes: string, dayType: DayType) => {
    const existingLogs = state.logs.filter(log => 
      isSameDay(new Date(log.date), selectedDate)
    );

    const logsCount = editingLog 
      ? existingLogs.filter(log => log.id !== editingLog.id).length 
      : existingLogs.length;

    if (logsCount >= 2) {
      alert('Maximum of 2 logs per day allowed');
      return;
    }

    if (editingLog) {
      await updateLog(editingLog.id, {
        projectId,
        tags,
        notes,
        dayType,
      });
    } else {
      await addLog({
        date: format(selectedDate, 'yyyy-MM-dd'),
        projectId,
        tags,
        notes,
        dayType,
      });
    }
    setEditingLog(null);
  };

  const handleDeleteLog = async (logId: string) => {
    await deleteLog(logId);
    setEditingLog(null);
  };

  const handleEditLog = (log: DayLog) => {
    setSelectedDate(new Date(log.date));
    setEditingLog(log);
  };

  const handleAddTag = async (name: string, color: string) => {
    await addTag({
      name,
      color,
    });
  };

  const handleUpdateTags = async (updatedTags: Tag[]) => {
    await updateTags(updatedTags);
  };

  const handleAddProject = async (projectNumber: string, productionCompany: string, name: string) => {
    await addProject({
      projectNumber,
      productionCompany,
      name,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <NewLogForm
          projects={state.projects}
          tags={state.tags}
          onAddLog={handleAddLog}
          onAddProject={handleAddProject}
          onAddTag={handleAddTag}
          onUpdateTags={handleUpdateTags}
          onDeleteTag={deleteTag}
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