'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar/sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Bars3Icon } from '@heroicons/react/24/outline';

export default function DashboardLayout({ children }) {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden);
  };

  return (
    <ProtectedRoute>
      <div className="h-screen bg-gray-50 flex relative">
        {/* Sidebar */}
        {!isSidebarHidden && (
          <div className="hidden lg:block w-64 h-full bg-white shadow-xl z-30 sidebar-transition">
            <Sidebar />
          </div>
        )}

        {/* Mobile Sidebar Overlay */}
        {!isSidebarHidden && (
          <div className="lg:hidden fixed left-0 top-0 w-64 h-full bg-white shadow-xl z-40 sidebar-transition">
            <Sidebar />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden sidebar-transition">
          {/* Top Header with Toggle Button */}
          <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:justify-start header-shadow">
            <button
              onClick={toggleSidebar}
              className="toggle-button p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              title={isSidebarHidden ? 'Tampilkan Sidebar' : 'Sembunyikan Sidebar'}
            >
              <Bars3Icon className={`w-6 h-6 transition-transform duration-200 ${isSidebarHidden ? 'rotate-180' : ''}`} />
            </button>
            
            <div className="lg:hidden">
              <span className="text-lg font-semibold text-gray-900">HRIS Dashboard</span>
            </div>
            
            {/* Desktop breadcrumb or title area */}
            <div className="hidden lg:block ml-4 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span className="font-medium">Dashboard</span>
                  {isSidebarHidden && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Mode Lebar
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-400">
                  HRIS Management System
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            {children}
          </main>
        </div>

        {/* Overlay for mobile when sidebar is open */}
        {!isSidebarHidden && (
          <button
            type="button"
            className="lg:hidden fixed inset-0 bg-gray-600 bg-opacity-50 z-30 focus:outline-none"
            onClick={toggleSidebar}
            onKeyDown={(e) => {
              if (e.key === 'Escape') toggleSidebar();
            }}
            aria-label="Tutup sidebar"
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
