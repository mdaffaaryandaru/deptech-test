'use client';

import { useState, useEffect } from 'react';
import apiClient from '../../lib/api';
import {
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  CalendarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const stats = [
  {
    name: 'Total Pegawai',
    value: '245',
    change: '+12%',
    changeType: 'increase',
    icon: UsersIcon,
  },
  {
    name: 'Hadir Hari Ini',
    value: '198',
    change: '80.8%',
    changeType: 'increase',
    icon: ClockIcon,
  },
  {
    name: 'Gaji Bulanan',
    value: 'Rp 18M',
    change: '+5.4%',
    changeType: 'increase',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Skor Kinerja',
    value: '8.7/10',
    change: '+0.3',
    changeType: 'increase',
    icon: ChartBarIcon,
  },
];

const recentActivities = [
  {
    id: 1,
    user: 'Sarah Johnson',
    action: 'mengajukan permintaan cuti',
    time: '2 jam yang lalu',
    type: 'leave',
  },
  {
    id: 2,
    user: 'Mike Chen',
    action: 'clock in',
    time: '3 jam yang lalu',
    type: 'attendance',
  },
  {
    id: 3,
    user: 'Emily Davis',
    action: 'menyelesaikan evaluasi kinerja',
    time: '5 jam yang lalu',
    type: 'performance',
  },
  {
    id: 4,
    user: 'David Wilson',
    action: 'memperbarui informasi profil',
    time: '1 hari yang lalu',
    type: 'profile',
  },
];

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    employees: { total: 0, data: [] },
    leaves: { total: 0, stats: {} },
    loading: true,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [employeesRes, leavesRes, leaveStatsRes] = await Promise.all([
        apiClient.getEmployees({ limit: 10 }),
        apiClient.getLeaves({ limit: 10 }),
        apiClient.getLeaveStats(),
      ]);

      setDashboardData({
        employees: employeesRes,
        leaves: leavesRes,
        leaveStats: leaveStatsRes,
        loading: false,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  const getActivityTypeClass = (type) => {
    switch (type) {
      case 'leave': return 'bg-yellow-400';
      case 'attendance': return 'bg-green-400';
      case 'performance': return 'bg-blue-400';
      default: return 'bg-gray-400';
    }
  };

  const stats = [
    {
      name: 'Total Pegawai',
      value: dashboardData.employees?.total || 0,
      change: '+12%',
      changeType: 'increase',
      icon: UsersIcon,
    },
    {
      name: 'Cuti Aktif',
      value: dashboardData.leaveStats?.activeLeaves || 0,
      change: 'Bulan ini',
      changeType: 'neutral',
      icon: CalendarIcon,
    },
    {
      name: 'Total Cuti',
      value: dashboardData.leaves?.total || 0,
      change: 'Semua waktu',
      changeType: 'neutral',
      icon: ClockIcon,
    },
    {
      name: 'Sisa Kuota Cuti',
      value: `${dashboardData.leaveStats?.remainingDays || 0} hari`,
      change: 'Rata-rata',
      changeType: 'neutral',
      icon: ChartBarIcon,
    },
  ];

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
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Selamat datang kembali! Inilah yang terjadi di perusahaan Anda.</p>
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
              <span className={`text-sm font-medium text-green-600`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">dari bulan lalu</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Aktivitas Terbaru</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${getActivityTypeClass(activity.type)}`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <ClockIcon className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium text-gray-900">Clock In/Out</p>
              <p className="text-xs text-gray-500">Track attendance</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <UsersIcon className="w-6 h-6 text-green-600 mb-2" />
              <p className="font-medium text-gray-900">Add Employee</p>
              <p className="text-xs text-gray-500">Register new hire</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <CurrencyDollarIcon className="w-6 h-6 text-purple-600 mb-2" />
              <p className="font-medium text-gray-900">Process Payroll</p>
              <p className="text-xs text-gray-500">Monthly payroll</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <ChartBarIcon className="w-6 h-6 text-orange-600 mb-2" />
              <p className="font-medium text-gray-900">View Reports</p>
              <p className="text-xs text-gray-500">Analytics & insights</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
