import { useMemo } from 'react';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, parseISO, isSameDay } from 'date-fns';
import { AppState, Project } from '../types';

interface DayActivity {
  date: string;
  logs: number;
}

interface ProjectActivity {
  project: Project;
  logs: number;
}

interface CompanyActivity {
  name: string;
  days: number;
}

interface Statistics {
  totalLogs: number;
  totalProjects: number;
  mostActiveProject: Project | null;
  weeklyActivity: DayActivity[];
  projectDistribution: ProjectActivity[];
  companyDistribution: CompanyActivity[];
  recentTags: { name: string; count: number }[];
}

export function useStatistics(state: AppState): Statistics {
  return useMemo(() => {
    const { logs, projects, tags } = state;

    // Calculate total logs
    const totalLogs = logs.length;

    // Calculate active projects (projects with at least one log)
    const activeProjects = projects.filter(project => 
      logs.some(log => log.projectId === project.id)
    );
    const totalProjects = activeProjects.length;

    // Calculate project activity
    const projectActivity = projects.map(project => ({
      project,
      logs: logs.filter(log => log.projectId === project.id).length
    })).sort((a, b) => b.logs - a.logs);

    // Get most active project
    const mostActiveProject = projectActivity.length > 0 ? projectActivity[0].project : null;

    // Calculate company distribution
    const companyMap = new Map<string, number>();
    logs.forEach(log => {
      const project = projects.find(p => p.id === log.projectId);
      if (project) {
        const company = project.productionCompany;
        const currentDays = companyMap.get(company) || 0;
        companyMap.set(company, currentDays + (log.dayType === 'full' ? 1 : 0.5));
      }
    });

    const companyDistribution = Array.from(companyMap.entries())
      .map(([name, days]) => ({ name, days }))
      .sort((a, b) => b.days - a.days);

    // Calculate weekly activity
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Start week on Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const weeklyActivity = weekDays.map(day => ({
      date: format(day, 'yyyy-MM-dd'),
      logs: logs.filter(log => isSameDay(parseISO(log.date), day)).length
    }));

    // Calculate recent tags
    const recentTags = Array.from(
      logs.reduce((acc, log) => {
        log.tags.forEach(tagId => {
          const tag = tags.find(t => t.id === tagId);
          if (tag) {
            acc.set(tag.name, (acc.get(tag.name) || 0) + (log.dayType === 'full' ? 1 : 0.5));
          }
        });
        return acc;
      }, new Map<string, number>())
    )
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalLogs,
      totalProjects,
      mostActiveProject,
      weeklyActivity,
      projectDistribution: projectActivity,
      companyDistribution,
      recentTags,
    };
  }, [state]);
}
