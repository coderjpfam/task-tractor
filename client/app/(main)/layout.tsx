'use client';

import { useState } from 'react';
import { useTheme } from '@/components/signin/useTheme';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppBar from '@/components/layout/AppBar';
import Sidebar from '@/components/layout/Sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const themeColors = {
    bg: isDark ? 'bg-gray-950' : 'bg-gray-50',
  };

  return (
    <ProtectedRoute>
      <div className={`min-h-screen ${themeColors.bg} transition-colors duration-300`}>
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Top App Bar */}
        <AppBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        {/* Main Content */}
        <main
          className={`pt-16 transition-all duration-300 ${
            sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
          }`}
        >
         
          {/* Page Content */}
          <div className={`min-h-[calc(100vh-4rem)] ${themeColors.bg} transition-colors duration-300`}>
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
