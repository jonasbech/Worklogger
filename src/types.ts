export interface Project {
  id: string;
  userId: string;
  projectNumber: string;
  productionCompany: string;
  name: string;
  createdAt: string;
  isPaid: boolean;
  invoiceSent?: boolean;
}

export interface Tag {
  id: string;
  userId: string;
  name: string;
  color: string;
}

export type DayType = 'full' | 'half';

export interface DayLog {
  id: string;
  userId: string;
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