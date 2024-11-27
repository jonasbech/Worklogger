import React from 'react';
import { Receipt, FileCheck, HeartHandshake } from 'lucide-react';

interface ProjectTypeStatsProps {
  stats: {
    paid: {
      total: number;
      invoiceSent: number;
      invoicePending: number;
    };
    proBono: number;
  };
}

export function ProjectTypeStats({ stats }: ProjectTypeStatsProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg shadow-lg p-6 border border-[#2a2a2a]">
      <h2 className="text-2xl font-bold text-white text-center mb-8">Project Type Distribution</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="p-6 rounded-lg flex flex-col items-center justify-center transition-transform hover:scale-105"
          style={{ backgroundColor: `rgba(59, 130, 246, 0.1)` }}
        >
          <span className="text-4xl font-bold mb-3 text-blue-500">{stats.paid.total}</span>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Receipt className="w-4 h-4" />
            <span>Paid Projects</span>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="text-center">
              <span className="text-2xl font-bold text-green-500">{stats.paid.invoiceSent}</span>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                <FileCheck className="w-3 h-3" />
                <span>Invoiced</span>
              </div>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-yellow-500">{stats.paid.invoicePending}</span>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                <Receipt className="w-3 h-3" />
                <span>Pending</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="p-6 rounded-lg flex flex-col items-center justify-center transition-transform hover:scale-105"
          style={{ backgroundColor: `rgba(168, 85, 247, 0.1)` }}
        >
          <span className="text-4xl font-bold mb-3 text-purple-500">{stats.proBono}</span>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <HeartHandshake className="w-4 h-4" />
            <span>Pro Bono Projects</span>
          </div>
        </div>

        <div
          className="p-6 rounded-lg flex flex-col items-center justify-center transition-transform hover:scale-105"
          style={{ backgroundColor: `rgba(34, 197, 94, 0.1)` }}
        >
          <span className="text-4xl font-bold mb-3 text-green-500">
            {((stats.paid.total / (stats.paid.total + stats.proBono)) * 100).toFixed(1)}%
          </span>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Receipt className="w-4 h-4" />
            <span>Paid Ratio</span>
          </div>
        </div>
      </div>
    </div>
  );
}