import React from 'react';
import { DayLog, Tag } from '../types';

interface TagStatsProps {
  logs: DayLog[];
  tags: Tag[];
}

export function TagStats({ logs, tags }: TagStatsProps) {
  const stats = tags.map(tag => ({
    ...tag,
    count: logs.filter(log => log.tags.includes(tag.id)).length,
  }));

  return (
    <div className="bg-[#1a1a1a] rounded-lg shadow-lg p-6 border border-[#2a2a2a]">
      <h2 className="text-2xl font-bold text-white text-center mb-8">Statistics</h2>
      <div className="grid grid-cols-2 gap-6">
        {stats.map(({ id, name, color, count }) => (
          <div
            key={id}
            className="p-6 rounded-lg flex flex-col items-center justify-center transition-transform hover:scale-105"
            style={{ backgroundColor: `${color}15` }}
          >
            <span className="text-5xl font-bold mb-3" style={{ color }}>{count}</span>
            <span className="text-sm text-gray-400">{name} Days</span>
          </div>
        ))}
      </div>
    </div>
  );
}