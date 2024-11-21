import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AppState, Project } from '../types';
import { initialState, INITIAL_PROJECT_NUMBER } from '../utils/constants';

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
    setState(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId),
      logs: prev.logs.filter(l => l.projectId !== projectId),
    }));
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

  const inputClasses = "w-full rounded border-[#2a2a2a] bg-[#242424] text-gray-300 focus:border-[#3a3a3a] focus:ring-[#3a3a3a] px-4 py-3";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Projects</h2>
        <button
          onClick={() => setShowNewProject(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#3a3a3a] text-white rounded hover:bg-[#4a4a4a] transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </button>
      </div>

      <div className="bg-[#1a1a1a] rounded-lg shadow-lg border border-[#2a2a2a]">
        <div className="divide-y divide-[#2a2a2a]">
          {state.projects.map(project => {
            const logCount = state.logs.filter(l => l.projectId === project.id).length;
            const lastLog = state.logs
              .filter(l => l.projectId === project.id)
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

            return (
              <div key={project.id} className="p-6 hover:bg-[#242424] transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      {project.projectNumber}_{project.productionCompany}_{project.name}
                    </h3>
                    <div className="mt-2 text-sm text-gray-400 space-y-1">
                      <p>Created on {format(new Date(project.createdAt), 'MMM d, yyyy')}</p>
                      <p>{logCount} work days logged</p>
                      {lastLog && (
                        <p>Last activity: {format(new Date(lastLog.date), 'MMM d, yyyy')}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showNewProject && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-lg p-8 max-w-md w-full border border-[#2a2a2a]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Add New Project</h3>
              <button onClick={() => setShowNewProject(false)} className="text-gray-400 hover:text-gray-300">
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
                className="w-full bg-[#3a3a3a] text-white py-3 px-4 rounded hover:bg-[#4a4a4a] transition-colors"
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