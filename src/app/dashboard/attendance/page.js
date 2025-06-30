'use client';

import { useState, useEffect } from 'react';
import apiClient from '../../../lib/api';
import { formatDate } from '../../../lib/utils';
import {
  CalendarIcon,
  UsersIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState({
    employeesWithLeave: [],
    loading: true,
  });

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const response = await apiClient.getEmployeesWithLeaveSummary();
      setAttendanceData({
        employeesWithLeave: response.data || [],
        loading: false,
      });
    } catch (error) {
      console.error('Failed to fetch attendance data:', error);
      setAttendanceData({ employeesWithLeave: [], loading: false });
    }
  };

  const getTotalLeaveThisYear = (leaves) => {
    const currentYear = new Date().getFullYear();
    return leaves.filter(leave => {
      const leaveYear = new Date(leave.startDate).getFullYear();
      return leaveYear === currentYear;
    }).reduce((total, leave) => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return total + days;
    }, 0);
  };

  const getLeaveStatusBadge = (usedDays) => {
    if (usedDays === 0) {
      return 'bg-green-100 text-green-800';
    } else if (usedDays <= 6) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (usedDays <= 10) {
      return 'bg-orange-100 text-orange-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  };

  const getLeaveStatusText = (usedDays) => {
    if (usedDays === 0) return 'Belum Cuti';
    if (usedDays <= 6) return 'Normal';
    if (usedDays <= 10) return 'Tinggi';
    return 'Maksimal';
  };

  if (attendanceData.loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={`stat-${i + 1}`} className="bg-white rounded-xl p-6 border">
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

  const stats = [
    {
      name: 'Total Pegawai',
      value: attendanceData.employeesWithLeave.length,
      icon: UsersIcon,
      color: 'blue',
    },
    {
      name: 'Cuti Aktif Bulan Ini',
      value: attendanceData.employeesWithLeave.filter(emp => 
        emp.leaves?.some(leave => {
          const currentDate = new Date();
          const startDate = new Date(leave.startDate);
          const endDate = new Date(leave.endDate);
          return currentDate >= startDate && currentDate <= endDate;
        })
      ).length,
      icon: CalendarIcon,
      color: 'yellow',
    },
    {
      name: 'Sisa Kuota Rata-rata',
      value: Math.round(
        attendanceData.employeesWithLeave.reduce((sum, emp) => {
          const usedDays = getTotalLeaveThisYear(emp.leaves || []);
          return sum + (12 - usedDays);
        }, 0) / Math.max(attendanceData.employeesWithLeave.length, 1)
      ),
      icon: ClockIcon,
      color: 'green',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kehadiran & Cuti</h1>
        <p className="text-gray-600 mt-2">Ringkasan kehadiran dan penggunaan cuti pegawai</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-50`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Employee Leave Summary Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Ringkasan Cuti Pegawai</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pegawai
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cuti Tahun Ini
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sisa Kuota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cuti Terakhir
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceData.employeesWithLeave.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada data pegawai
                  </td>
                </tr>
              ) : (
                attendanceData.employeesWithLeave.map((employee) => {
                  const usedDays = getTotalLeaveThisYear(employee.leaves || []);
                  const remainingDays = 12 - usedDays;
                  const lastLeave = employee.leaves?.length > 0 
                    ? employee.leaves.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0]
                    : null;

                  return (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{usedDays} hari</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{remainingDays} hari</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLeaveStatusBadge(usedDays)}`}>
                          {getLeaveStatusText(usedDays)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {lastLeave ? formatDate(lastLeave.startDate) : '-'}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
