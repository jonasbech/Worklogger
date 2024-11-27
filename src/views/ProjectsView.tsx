import React, { useState } from 'react';
import { Plus, X, ChevronUp, ChevronDown, Building2, Receipt, HeartHandshake } from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';
import { INITIAL_PROJECT_NUMBER } from '../utils/constants';
import { InvoiceStatus } from '../components/InvoiceStatus';

export function ProjectsView() {
  const { state, loading, error, addProject, deleteProject, deleteLog } = useFirestore();
  const [showNewProject, setShowNewProject] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [projectNumber, setProjectNumber] = useState(() => {
    const maxNumber = Math.max(
      parseInt(INITIAL_PROJECT_NUMBER, 10) - 1,
      ...state.projects.map(p => parseInt(p.projectNumber, 10))
    );
    return (maxNumber + 1).toString();
  });
  const [productionCompany, setProductionCompany] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState<'paid' | 'pro-bono'>('paid');

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProject({
        projectNumber,
        productionCompany,
        name: projectName,
        createdAt: new Date().toISOString(),
        isPaid: projectType === 'paid',
        invoiceSent: false,
      });

      setProjectNumber(prev => (parseInt(prev, 10) + 1).toString());
      setShowNewProject(false);
      setProductionCompany('');
      setProjectName('');
      setProjectType('paid');
    } catch (err) {
      alert('Failed to add project: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? All associated logs will also be deleted.')) {
      try {
        setIsDeleting(true);
        const projectLogs = state.logs.filter(log => log.projectId === projectId);
        await Promise.all(projectLogs.map(log => deleteLog(log.id)));
        await deleteProject(projectId);
      } catch (err) {
        alert('Failed to delete project: ' + (err instanceof Error ? err.message : 'Unknown error'));
      } finally {
        setIsDeleting(false);
      }
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
          disabled={isDeleting}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    {project.isPaid ? (
                      <InvoiceStatus projectId={project.id} invoiceSent={project.invoiceSent || false} />
                    ) : (
                      <span className="text-sm font-medium bg-purple-500 bg-opacity-20 text-purple-400 px-2 py-1 rounded flex items-center gap-1">
                        <HeartHandshake className="w-3 h-3" />
                        Pro Bono
                      </span>
                    )}
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
                      disabled={isDeleting}
                      className="text-gray-500 hover:text-red-500 transition-colors ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Type
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value as 'paid' | 'pro-bono')}
                  className={`${inputClasses} py-2.5`}
                >
                  <option value="paid">Paid Project</option>
                  <option value="pro-bono">Pro Bono</option>
                </select>
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