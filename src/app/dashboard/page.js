'use client';

import { useState, useEffect } from 'react';
import apiClient from '../../lib/api';
import {
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    leaveStats: { 
      totalEmployees: 0, 
      totalLeaves: 0, 
      totalLeaveDays: 0,
      averageLeaveDaysPerEmployee: 0
    },
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (retryCount = 0) => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));
      
      const [employeesRes, leaveStatsRes] = await Promise.all([
        apiClient.getEmployees({ page: 1, limit: 1 }), // Get total count from meta
        apiClient.getLeaveStats(),
      ]);

      setDashboardData({
        totalEmployees: employeesRes.meta?.total || 0,
        leaveStats: leaveStatsRes,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      
      // Retry logic
      if (retryCount < 2) {
        console.log(`Retrying... (${retryCount + 1}/2)`);
        setTimeout(() => fetchDashboardData(retryCount + 1), 1000);
        return;
      }
      
      setDashboardData(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Gagal memuat data dashboard'
      }));
    }
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const stats = [
    {
      name: 'Total Pegawai',
      value: formatNumber(dashboardData.totalEmployees || 0),
      change: 'Terdaftar',
      changeType: 'neutral',
      icon: UsersIcon,
    },
    {
      name: 'Cuti Tahun Ini',
      value: formatNumber(dashboardData.leaveStats?.totalLeaves || 0),
      change: 'Permohonan',
      changeType: 'neutral',
      icon: CalendarIcon,
    },
    {
      name: 'Total Hari Cuti',
      value: `${formatNumber(dashboardData.leaveStats?.totalLeaveDays || 0)} hari`,
      change: 'Tahun ini',
      changeType: 'neutral',
      icon: ClockIcon,
    },
    {
      name: 'Rata-rata Cuti',
      value: `${dashboardData.leaveStats?.averageLeaveDaysPerEmployee?.toFixed(1) || 0} hari`,
      change: 'Per pegawai',
      changeType: 'neutral',
      icon: ChartBarIcon,
    },
  ];

  const quickActions = [
    {
      title: 'Data Pegawai',
      description: 'Kelola data pegawai',
      icon: UsersIcon,
      color: 'green',
      href: '/dashboard/employees'
    },
    {
      title: 'Manajemen Cuti',
      description: 'Kelola permohonan cuti',
      icon: CalendarIcon,
      color: 'blue',
      href: '/dashboard/leave'
    },
    {
      title: 'Kehadiran',
      description: 'Monitor kehadiran pegawai',
      icon: ClockIcon,
      color: 'purple',
      href: '/dashboard/attendance'
    },
    {
      title: 'Dashboard',
      description: 'Lihat ringkasan data',
      icon: ChartBarIcon,
      color: 'orange',
      href: '/dashboard'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      green: 'text-green-600 hover:bg-green-50',
      blue: 'text-blue-600 hover:bg-blue-50',
      purple: 'text-purple-600 hover:bg-purple-50',
      orange: 'text-orange-600 hover:bg-orange-50'
    };
    return colorMap[color] || 'text-gray-600 hover:bg-gray-50';
  };

  if (dashboardData.loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={`loading-card-${i + 1}`} className="bg-white rounded-xl p-6 border">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Gagal memuat data</h3>
          <p className="text-red-600 mb-4">{dashboardData.error}</p>
          <button 
            onClick={() => fetchDashboardData()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Selamat datang kembali! Inilah yang terjadi di perusahaan Anda.</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => fetchDashboardData()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              disabled={dashboardData.loading}
            >
              <svg className={`w-4 h-4 ${dashboardData.loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{dashboardData.loading ? 'Memuat...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-blue-50`}>
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium text-gray-600`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.title}
              onClick={() => window.location.href = action.href}
              className={`p-6 border border-gray-200 rounded-lg transition-all duration-200 text-left group ${getColorClasses(action.color)}`}
            >
              <action.icon className={`w-8 h-8 mb-4 transition-colors ${action.color === 'green' ? 'text-green-600' : action.color === 'blue' ? 'text-blue-600' : action.color === 'purple' ? 'text-purple-600' : 'text-orange-600'}`} />
              <p className="font-semibold text-gray-900 mb-2">{action.title}</p>
              <p className="text-sm text-gray-500">{action.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}