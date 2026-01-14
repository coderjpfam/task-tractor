'use client';

import { useState, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  Settings,
  LogOut,
  CheckSquare,
} from 'lucide-react';
import { useTheme } from '@/components/signin/useTheme';
import { useAppSelector } from '@/store/hooks';

interface AppBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function AppBar({
  sidebarOpen,
  setSidebarOpen,
  searchQuery,
  setSearchQuery,
}: AppBarProps) {
  const { isDark, theme, setTheme } = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setShowNotifications(false);
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeColors = {
    cardBg: isDark ? 'bg-gray-900' : 'bg-white',
    text: isDark ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
    border: isDark ? 'border-gray-800' : 'border-gray-200',
    hover: isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50',
    inputBg: isDark ? 'bg-gray-800' : 'bg-gray-100',
  };

  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const getUserInitials = () => {
    if (!user?.fullName) return 'U';
    return user.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav
      className={`${themeColors.cardBg} border-b ${themeColors.border} fixed w-full z-40 top-0 transition-colors duration-300`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg ${themeColors.hover} transition-colors lg:hidden`}
              aria-label="Toggle sidebar"
            >
              <Menu className={`h-5 w-5 ${themeColors.text}`} />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-lg font-bold ${themeColors.text}`}>Task Tractor</h1>
                <p className={`text-xs ${themeColors.textSecondary}`}>Project Manager</p>
              </div>
            </div>
          </div>

          {/* Center - Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${themeColors.textSecondary}`}
              />
              <input
                type="text"
                placeholder="Search tasks, projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 ${themeColors.inputBg} border ${themeColors.border} rounded-lg ${themeColors.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all`}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${themeColors.hover} transition-colors`}
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative" data-dropdown>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfile(false);
                }}
                className={`p-2 rounded-lg ${themeColors.hover} transition-colors relative`}
                aria-label="Notifications"
              >
                <Bell className={`h-5 w-5 ${themeColors.text}`} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {showNotifications && (
                <div
                  className={`absolute right-0 mt-2 w-80 ${themeColors.cardBg} rounded-xl shadow-2xl border ${themeColors.border} overflow-hidden z-50`}
                >
                  <div className={`p-4 border-b ${themeColors.border}`}>
                    <h3 className={`font-semibold ${themeColors.text}`}>Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className={`p-4 border-b ${themeColors.border} ${themeColors.hover} cursor-pointer transition-colors`}
                      >
                        <p className={`text-sm ${themeColors.text}`}>New task assigned to you</p>
                        <p className={`text-xs ${themeColors.textSecondary} mt-1`}>5 minutes ago</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" data-dropdown>
              <button
                onClick={() => {
                  setShowProfile(!showProfile);
                  setShowNotifications(false);
                }}
                className={`flex items-center space-x-3 p-2 rounded-lg ${themeColors.hover} transition-colors`}
                aria-label="User menu"
              >
                {user?.profilePath ? (
                  <img
                    src={user.profilePath}
                    alt={user.fullName}
                    className="h-9 w-9 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-semibold text-sm">
                    {getUserInitials()}
                  </div>
                )}
                <ChevronDown className={`h-4 w-4 ${themeColors.text} hidden sm:block`} />
              </button>

              {showProfile && (
                <div
                  className={`absolute right-0 mt-2 w-56 ${themeColors.cardBg} rounded-xl shadow-2xl border ${themeColors.border} overflow-hidden z-50`}
                >
                  <div className={`p-4 border-b ${themeColors.border}`}>
                    <p className={`font-semibold ${themeColors.text}`}>{user?.fullName || 'User'}</p>
                    <p className={`text-sm ${themeColors.textSecondary}`}>{user?.email || 'user@example.com'}</p>
                  </div>
                  <div className="p-2">
                    <button
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg ${themeColors.hover} ${themeColors.text}`}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg ${themeColors.hover} text-red-500`}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
