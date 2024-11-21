import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Calendar as CalendarIcon, FolderOpen } from 'lucide-react';
import { LoggerView } from './views/LoggerView';
import { ProjectsView } from './views/ProjectsView';

function Navigation() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#2a2a2a] lg:relative lg:border-t-0">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-center lg:justify-start gap-4 py-3 lg:py-6">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
              isActive('/') 
                ? 'bg-[#3a3a3a] text-white' 
                : 'text-gray-400 hover:bg-[#2a2a2a]'
            }`}
          >
            <CalendarIcon className="w-5 h-5" />
            <span className="hidden lg:inline">Logger</span>
          </Link>
          <Link
            to="/projects"
            className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
              isActive('/projects') 
                ? 'bg-[#3a3a3a] text-white' 
                : 'text-gray-400 hover:bg-[#2a2a2a]'
            }`}
          >
            <FolderOpen className="w-5 h-5" />
            <span className="hidden lg:inline">Projects</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#121212] flex flex-col">
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 lg:px-8 mb-16 lg:mb-0">
          <Routes>
            <Route path="/" element={<LoggerView />} />
            <Route path="/projects" element={<ProjectsView />} />
          </Routes>
        </main>
        <Navigation />
      </div>
    </BrowserRouter>
  );
}