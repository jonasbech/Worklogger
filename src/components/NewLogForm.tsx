import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { GripVertical, X, Plus } from 'lucide-react';
import { DayLog, Project, Tag } from '../types';
import { colorPalette } from '../utils/constants';

interface NewLogFormProps {
  projects: Project[];
  tags: Tag[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onAddLog: (projectId: string, tags: string[], notes: string) => void;
  onAddProject: (projectNumber: string, productionCompany: string, name: string) => void;
  onAddTag: (name: string, color: string) => void;
  onUpdateTags: (tags: Tag[]) => void;
  onDeleteTag: (tagId: string) => void;
  editingLog: DayLog | null;
  onDeleteLog: (logId: string) => void;
}

export function NewLogForm({
  projects,
  tags,
  selectedDate,
  onAddLog,
  editingLog,
  onDeleteLog,
  onUpdateTags,
  onDeleteTag,
  onAddTag,
}: NewLogFormProps) {
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [draggedTagId, setDraggedTagId] = useState<string | null>(null);
  const [showNewTag, setShowNewTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(colorPalette[0]);

  useEffect(() => {
    if (editingLog) {
      setSelectedProject(editingLog.projectId);
      setSelectedTags(editingLog.tags);
      setNotes(editingLog.notes || '');
    } else {
      setSelectedProject('');
      setSelectedTags([]);
      setNotes('');
    }
  }, [editingLog]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLog(selectedProject, selectedTags, notes);
    setSelectedProject('');
    setSelectedTags([]);
    setNotes('');
  };

  const handleDelete = () => {
    if (editingLog) {
      onDeleteLog(editingLog.id);
      setSelectedProject('');
      setSelectedTags([]);
      setNotes('');
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTag(newTagName, newTagColor);
    setNewTagName('');
    setNewTagColor(colorPalette[0]);
    setShowNewTag(false);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleDragStart = (tagId: string) => {
    setDraggedTagId(tagId);
  };

  const handleDragOver = (e: React.DragEvent, targetTagId: string) => {
    e.preventDefault();
    if (!draggedTagId || draggedTagId === targetTagId) return;

    const updatedTags = [...tags];
    const draggedIndex = tags.findIndex(t => t.id === draggedTagId);
    const targetIndex = tags.findIndex(t => t.id === targetTagId);

    const [draggedTag] = updatedTags.splice(draggedIndex, 1);
    updatedTags.splice(targetIndex, 0, draggedTag);

    onUpdateTags(updatedTags);
  };

  const inputClasses = "w-full rounded border-[#2a2a2a] bg-[#242424] text-gray-300 focus:border-[#3a3a3a] focus:ring-[#3a3a3a] px-3 py-2";

  return (
    <div className="bg-[#1a1a1a] rounded-lg shadow-lg p-6 border border-[#2a2a2a]">
      <h2 className="text-xl font-semibold text-white mb-6">
        {editingLog ? 'Edit' : 'Log'} Work for {format(selectedDate, 'MMMM d, yyyy')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project
          </label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className={`${inputClasses} py-2.5 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"%3E%3Cpath stroke="%236B7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m6 8 4 4 4-4"/%3E%3C/svg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat pr-12`}
            required
          >
            <option value="">Select a project</option>
            {projects.slice(0, 5).map(project => (
              <option key={project.id} value={project.id} className="py-2">
                {project.projectNumber}_{project.productionCompany}_{project.name}
              </option>
            ))}
            {projects.length > 5 && (
              <optgroup label="Older Projects">
                {projects.slice(5).map(project => (
                  <option key={project.id} value={project.id} className="py-2">
                    {project.projectNumber}_{project.productionCompany}_{project.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">Tags</label>
            <button
              type="button"
              onClick={() => setShowNewTag(true)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <div
                key={tag.id}
                draggable
                onDragStart={() => handleDragStart(tag.id)}
                onDragOver={(e) => handleDragOver(e, tag.id)}
                className="group flex items-center gap-1"
              >
                <div
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                    selectedTags.includes(tag.id)
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: selectedTags.includes(tag.id)
                      ? tag.color
                      : `${tag.color}33`
                  }}
                >
                  <GripVertical className="w-3 h-3 opacity-50 cursor-grab" />
                  {tag.name}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTag(tag.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={`${inputClasses} min-h-[100px]`}
          />
        </div>

        <div className="flex justify-between gap-4">
          {editingLog ? (
            <>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-red-500 hover:text-red-400 transition-colors"
              >
                Delete Log
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#3a3a3a] text-white rounded hover:bg-[#4a4a4a] transition-colors"
              >
                Update Log
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="w-full px-6 py-2 bg-[#3a3a3a] text-white rounded hover:bg-[#4a4a4a] transition-colors"
            >
              Add Log
            </button>
          )}
        </div>
      </form>

      {showNewTag && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-lg p-6 max-w-sm w-full border border-[#2a2a2a]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Add New Tag</h3>
              <button
                onClick={() => setShowNewTag(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddTag} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tag Name
                </label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {colorPalette.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewTagColor(color)}
                      className={`w-full aspect-square rounded-full ${
                        newTagColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1a1a1a]' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-[#3a3a3a] text-white rounded hover:bg-[#4a4a4a] transition-colors"
              >
                Add Tag
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}