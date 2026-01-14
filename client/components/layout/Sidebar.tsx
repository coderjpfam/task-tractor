'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/components/signin/useTheme';
import {
  ChevronDown,
  Plus,
  LayoutDashboard,
  FileText,
  CheckSquare,
  Bug,
  Users,
} from 'lucide-react';

// Navigation items with icons and badges
const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, badge: null },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare, badge: '12' },
  { name: 'Projects', href: '/projects', icon: FileText, badge: null },
  { name: 'Bugs', href: '/bugs', icon: Bug, badge: '3' },
  { name: 'Profile', href: '/profile', icon: Users, badge: null },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
}: SidebarProps) {
  const { isDark } = useTheme();
  const pathname = usePathname();

  const themeColors = {
    sidebarBg: isDark ? 'bg-gray-900' : 'bg-white',
    text: isDark ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
    border: isDark ? 'border-gray-800' : 'border-gray-200',
    hover: isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50',
  };

  const sidebarWidth = sidebarCollapsed ? 'w-20' : 'w-64';

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] ${themeColors.sidebarBg} border-r ${themeColors.border} transition-all duration-300 z-30 ${sidebarOpen ? sidebarWidth : '-translate-x-full lg:translate-x-0'} ${sidebarWidth}`}
    >
      <nav className="p-4 space-y-2 h-full flex flex-col">
        <div className="flex-1 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center ${
                  sidebarCollapsed ? 'justify-center' : 'justify-between'
                } px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/30'
                    : `${themeColors.text} ${themeColors.hover}`
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5" />
                  {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
                </div>
                {!sidebarCollapsed && item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      isActive
                        ? 'bg-white/20'
                        : 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <div className={`pt-4 border-t ${themeColors.border}`}>
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all shadow-lg">
              <Plus className="h-5 w-5" />
              <span className="font-medium">New Task</span>
            </button>
          </div>
        )}

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`mt-auto p-2 rounded-lg ${themeColors.hover} ${themeColors.text} transition-colors`}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronDown className="h-5 w-5 rotate-[-90deg]" />
          ) : (
            <ChevronDown className="h-5 w-5 rotate-90" />
          )}
        </button>
      </nav>
    </aside>
  );
}
