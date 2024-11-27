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

interface ProjectTypeStats {
  paid: {
    total: number;
    invoiceSent: number;
    invoicePending: number;
  };
  proBono: number;
}

interface Statistics {
  totalLogs: number;
  totalProjects: number;
  mostActiveProject: Project | null;
  weeklyActivity: DayActivity[];
  projectDistribution: ProjectActivity[];
  companyDistribution: CompanyActivity[];
  recentTags: { name: string; count: number }[];
  projectTypeStats: ProjectTypeStats;
}

export function useStatistics(state: AppState): Statistics {
  return useMemo(() => {
    const { logs, projects, tags } = state;

    // Calculate total logs
    const totalLogs = logs.length;

    // Calculate active projects
    const activeProjects = projects.filter(project => 
      logs.some(log => log.projectId === project.id)
    );
    const totalProjects = activeProjects.length;

    // Calculate project activity with half days
    const projectActivity = projects.map(project => {
      const projectLogs = logs.filter(log => log.projectId === project.id);
      const totalDays = projectLogs.reduce((acc, log) => 
        acc + (log.dayType === 'full' ? 1 : 0.5), 0
      );
      return {
        project,
        logs: totalDays
      };
    }).sort((a, b) => b.logs - a.logs);

    // Get most active project
    const mostActiveProject = projectActivity.length > 0 ? projectActivity[0].project : null;

    // Calculate company distribution with half days
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

    // Calculate weekly activity with half days
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Start week on Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const weeklyActivity = weekDays.map(day => {
      const dayLogs = logs.filter(log => isSameDay(parseISO(log.date), day));
      const totalDays = dayLogs.reduce((acc, log) => 
        acc + (log.dayType === 'full' ? 1 : 0.5), 0
      );
      return {
        date: format(day, 'yyyy-MM-dd'),
        logs: totalDays
      };
    });

    // Calculate recent tags with half days
    const recentTags = Array.from(
      logs.reduce((acc, log) => {
        const dayValue = log.dayType === 'full' ? 1 : 0.5;
        log.tags.forEach(tagId => {
          const tag = tags.find(t => t.id === tagId);
          if (tag) {
            acc.set(tag.name, (acc.get(tag.name) || 0) + dayValue);
          }
        });
        return acc;
      }, new Map<string, number>())
    )
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Calculate project type statistics
    const projectTypeStats = projects.reduce((acc, project) => ({
      paid: {
        total: acc.paid.total + (project.isPaid ? 1 : 0),
        invoiceSent: acc.paid.invoiceSent + (project.isPaid && project.invoiceSent ? 1 : 0),
        invoicePending: acc.paid.invoicePending + (project.isPaid && !project.invoiceSent ? 1 : 0),
      },
      proBono: acc.proBono + (!project.isPaid ? 1 : 0),
    }), {
      paid: { total: 0, invoiceSent: 0, invoicePending: 0 },
      proBono: 0,
    });

    return {
      totalLogs,
      totalProjects,
      mostActiveProject,
      weeklyActivity,
      projectDistribution: projectActivity,
      companyDistribution,
      recentTags,
      projectTypeStats,
    };
  }, [state]);
}