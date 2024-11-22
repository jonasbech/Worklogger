import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CompanyStatsProps {
  companies: Array<{
    name: string;
    days: number;
  }>;
}

export function CompanyStats({ companies }: CompanyStatsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const DEFAULT_VISIBLE_COMPANIES = 4;

  // Generate a unique color for each company based on its name
  const getCompanyColor = (name: string) => {
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
    const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[colorIndex];
  };

  const visibleCompanies = isExpanded ? companies : companies.slice(0, DEFAULT_VISIBLE_COMPANIES);
  const hasMoreCompanies = companies.length > DEFAULT_VISIBLE_COMPANIES;

  return (
    <div className="bg-[#1a1a1a] rounded-lg shadow-lg p-6 border border-[#2a2a2a]">
      <h2 className="text-2xl font-bold text-white text-center mb-8">Production Company Distribution</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleCompanies.map(({ name, days }) => {
          const color = getCompanyColor(name);
          return (
            <div
              key={name}
              className="p-6 rounded-lg flex flex-col items-center justify-center transition-transform hover:scale-105"
              style={{ backgroundColor: `${color}15` }}
            >
              <span className="text-4xl font-bold mb-3" style={{ color }}>
                {days.toFixed(1)}
              </span>
              <span className="text-sm text-gray-400 text-center">{name}</span>
            </div>
          );
        })}
      </div>
      
      {hasMoreCompanies && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a] hover:text-white transition-colors"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
