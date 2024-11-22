import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../hooks/useAuth';

interface UserMenuProps {
  user: UserProfile;
  onSignOut: () => Promise<void>;
}

export function UserMenu({ user, onSignOut }: UserMenuProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] hover:text-white transition-colors"
      >
        <User className="w-5 h-5" />
        <span>{user.displayName || 'User'}</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-[#2a2a2a] shadow-lg border border-[#3a3a3a] overflow-hidden">
          <Link
            to="/profile"
            onClick={() => setShowDropdown(false)}
            className="w-full flex items-center gap-2 px-4 py-3 text-gray-300 hover:bg-[#3a3a3a] hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Profile Settings</span>
          </Link>
          <button
            onClick={async () => {
              await onSignOut();
              setShowDropdown(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-3 text-gray-300 hover:bg-[#3a3a3a] hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}