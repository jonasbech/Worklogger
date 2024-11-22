import { AppState } from '../types';

export const colorPalette = [
  '#dc2626', // Red
  '#ea580c', // Orange
  '#d97706', // Amber
  '#059669', // Emerald
  '#0891b2', // Cyan
  '#2563eb', // Blue
  '#7c3aed', // Violet
  '#c026d3', // Fuchsia
  '#4b5563', // Gray
  '#334155', // Slate
];

export const initialTags = [
  { id: 'dp', name: 'DP', color: '#dc2626' },
  { id: 'colorist', name: 'Colorist', color: '#7c3aed' },
  { id: 'vfx', name: 'VFX', color: '#059669' },
  { id: 'misc', name: 'Misc', color: '#4b5563' },
];

export const INITIAL_PROJECT_NUMBER = '2025001';

export const initialState: AppState = {
  projects: [],
  tags: initialTags,
  logs: [],
};