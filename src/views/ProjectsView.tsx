import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus, X, ChevronUp, ChevronDown, Building2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AppState, Project } from '../types';
import { initialState, INITIAL_PROJECT_NUMBER } from '../utils/constants';

// Function to generate a consistent color for a tag
const getTagColor = (tag: string) => {
  const colors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEEAD', // Yellow
    '#D4A5A5', // Pink
    '#9FA8DA', // Purple
    '#80DEEA', // Cyan
    '#FFE082', // Orange
    '#BCAAA4', // Brown
  ];
  
  // Use the sum of character codes to determine the color index
  const colorIndex = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[colorIndex];
};

export function ProjectsView() {
  const [state, setState] = useLocalStorage<AppState>('film-work-logger', initialState);
  const [showNewProject, setShowNewProject] = useState(false);
  const [projectNumber, setProjectNumber] = useState(() => {
    const maxNumber = Math.max(
      parseInt(INITIAL_PROJECT_NUMBER, 10) - 1,
      ...state.projects.map(p => parseInt(p.projectNumber, 10))
    );
    return (maxNumber + 1).toString();
  });
  const [productionCompany, setProductionCompany] = useState('');
  const [projectName, setProjectName] = useState('');

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: crypto.randomUUID(),
      projectNumber,
      productionCompany,
      name: projectName,
      createdAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      projects: [newProject, ...prev.projects],
    }));

    setProjectNumber(prev => (parseInt(prev, 10) + 1).toString());
    setShowNewProject(false);
    setProductionCompany('');
    setProjectName('');
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? All associated logs will also be deleted.')) {
      setState(prev => ({
        ...prev,
        projects: prev.projects.filter(p => p.id !== projectId),
        logs: prev.logs.filter(l => l.projectId !== projectId),
      }));
    }
  };

  const incrementProjectNumber = () => {
    setProjectNumber(prev => (parseInt(prev, 10) + 1).toString());
  };

  const decrementProjectNumber = () => {
    setProjectNumber(prev => {
      const nextNum = Math.max(parseInt(INITIAL_PROJECT_NUMBER, 10), parseInt(prev, 10) - 1);
      return nextNum.toString();
    });
  };

  const inputClasses = "w-full rounded-lg border border-[#2a2a2a] bg-[#242424] text-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4 py-3 transition-colors";

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-1">Manage your film projects</p>
        </div>
        <button
          onClick={() => setShowNewProject(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.projects.map(project => {
          const projectLogs = state.logs.filter(l => l.projectId === project.id);
          const totalDays = projectLogs
            .reduce((acc, log) => acc + (log.dayType === 'full' ? 1 : 0.5), 0);

          // Get unique tags from project logs
          const uniqueTags = [...new Set(projectLogs.flatMap(log => log.tags))];

          return (
            <div 
              key={project.id} 
              className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all group"
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 text-sm font-medium bg-blue-500 bg-opacity-20 text-blue-400 px-2 py-1 rounded">
                      #{project.projectNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {uniqueTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 justify-end">
                        {uniqueTags.slice(0, 3).map(tagId => {
                          const tag = state.tags.find(t => t.id === tagId);
                          return tag ? (
                            <div
                              key={tagId}
                              className="text-xs px-2 py-1 rounded"
                              style={{ 
                                backgroundColor: `${tag.color}20`,
                                color: tag.color
                              }}
                            >
                              {tag.name}
                            </div>
                          ) : null;
                        })}
                        {uniqueTags.length > 3 && (
                          <div className="text-xs px-2 py-1 rounded bg-[#2a2a2a] text-gray-400">
                            +{uniqueTags.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-gray-500 hover:text-red-500 transition-colors ml-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-white font-bold text-xl truncate">{project.name}</h2>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Building2 className="w-4 h-4 shrink-0" />
                      <p className="text-sm truncate">{project.productionCompany}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{totalDays.toFixed(1)}</p>
                    <p className="text-sm text-gray-400">Days Total</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showNewProject && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a1a] rounded-lg p-8 max-w-md w-full border border-[#2a2a2a]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Add New Project</h3>
                <p className="text-sm text-gray-400 mt-1">Create a new film project to track</p>
              </div>
              <button 
                onClick={() => setShowNewProject(false)} 
                className="text-gray-400 hover:text-gray-300 p-1 hover:bg-[#2a2a2a] rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddProject} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Number
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={projectNumber}
                    onChange={(e) => setProjectNumber(e.target.value)}
                    className={inputClasses}
                    required
                  />
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={incrementProjectNumber}
                      className="px-2 py-1 border border-[#2a2a2a] rounded-t bg-[#242424] hover:bg-[#2a2a2a] text-gray-300"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={decrementProjectNumber}
                      className="px-2 py-1 border border-[#2a2a2a] rounded-b bg-[#242424] hover:bg-[#2a2a2a] text-gray-300"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Production Company
                </label>
                <input
                  type="text"
                  value={productionCompany}
                  onChange={(e) => setProductionCompany(e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Project
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}