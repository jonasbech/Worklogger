export interface Project {
  id: string;
  projectNumber: string;
  productionCompany: string;
  name: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export type DayType = 'full' | 'half';

export interface DayLog {
  id: string;
  date: string;
  projectId: string;
  tags: string[];
  notes?: string;
  dayType: DayType;
}

export interface AppState {
  projects: Project[];
  tags: Tag[];
  logs: DayLog[];
}