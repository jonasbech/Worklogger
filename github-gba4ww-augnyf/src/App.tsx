import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Calendar as CalendarIcon, FolderOpen, BarChart2 } from 'lucide-react';
import { LoggerView } from './views/LoggerView';
import { ProjectsView } from './views/ProjectsView';
import { StatisticsView } from './views/StatisticsView';
import { ProfileView } from './views/ProfileView';
import { AuthModal } from './components/AuthModal';
import { UserMenu } from './components/UserMenu';
import { useAuth } from './hooks/useAuth';

function Navigation() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#1a1a1a] border-b border-[#2a2a2a] lg:relative lg:border-b-0">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between py-3 lg:py-6">
          <div className="flex items-center gap-4">
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
            <Link
              to="/statistics"
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                isActive('/statistics') 
                  ? 'bg-[#3a3a3a] text-white' 
                  : 'text-gray-400 hover:bg-[#2a2a2a]'
              }`}
            >
              <BarChart2 className="w-5 h-5" />
              <span className="hidden lg:inline">Statistics</span>
            </Link>
          </div>
          
          {user && <UserMenu user={user} onSignOut={signOut} />}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  const { user, loading, signUp, signIn, error } = useAuth();
  const [showAuth, setShowAuth] = useState(!user);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        {showAuth && (
          <AuthModal
            onClose={() => setShowAuth(false)}
            onSignUp={signUp}
            onSignIn={signIn}
          />
        )}
        {!showAuth && (
          <button
            onClick={() => setShowAuth(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Sign In / Create Account
          </button>
        )}
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#121212] flex flex-col">
        <Navigation />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 lg:px-8 mt-16 lg:mt-0">
          <Routes>
            <Route path="/" element={<LoggerView />} />
            <Route path="/projects" element={<ProjectsView />} />
            <Route path="/statistics" element={<StatisticsView />} />
            <Route path="/profile" element={<ProfileView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}