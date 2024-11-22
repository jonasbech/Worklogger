import React from 'react';
import { format, parseISO } from 'date-fns';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useStatistics } from '../hooks/useStatistics';
import { AppState } from '../types';
import { initialState } from '../utils/constants';
import { TagStats } from '../components/TagStats';
import { CompanyStats } from '../components/CompanyStats';

export function StatisticsView() {
  const [state] = useLocalStorage<AppState>('film-work-logger', initialState);
  const stats = useStatistics(state);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white mb-8">Statistics</h1>
      
      {/* Tag Statistics Overview */}
      <TagStats logs={state.logs} tags={state.tags} />

      {/* Production Company Distribution */}
      <CompanyStats companies={stats.companyDistribution} />
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1a1a1a] p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">Total Logs</h3>
          <p className="text-2xl font-bold text-white">{stats.totalLogs}</p>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">Active Projects</h3>
          <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">Most Active Project</h3>
          <p className="text-2xl font-bold text-white">
            {stats.mostActiveProject?.name || 'No projects yet'}
          </p>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="bg-[#1a1a1a] p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-white mb-4">Weekly Activity</h2>
        <div className="space-y-3">
          {stats.weeklyActivity.map((day) => (
            <div key={day.date} className="flex items-center">
              <span className="text-gray-400 w-32">{format(parseISO(day.date), 'EEE, MMM d')}</span>
              <div className="flex-1 h-4 bg-[#2a2a2a] rounded">
                <div 
                  className="h-full bg-blue-500 rounded" 
                  style={{ width: `${(day.logs / 2) * 100}%` }}
                />
              </div>
              <span className="text-gray-400 ml-3">{day.logs} logs</span>
            </div>
          ))}
        </div>
      </div>

      {/* Project Distribution */}
      <div className="bg-[#1a1a1a] p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-white mb-4">Project Distribution</h2>
        <div className="space-y-3">
          {stats.projectDistribution.map(({ project, logs }) => (
            <div key={project.id} className="flex items-center">
              <span className="text-gray-400 w-48 truncate" title={project.name}>
                {project.name}
              </span>
              <div className="flex-1 h-4 bg-[#2a2a2a] rounded">
                <div 
                  className="h-full bg-green-500 rounded" 
                  style={{ width: `${(logs / stats.totalLogs) * 100}%` }}
                />
              </div>
              <span className="text-gray-400 ml-3">{logs} logs</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
