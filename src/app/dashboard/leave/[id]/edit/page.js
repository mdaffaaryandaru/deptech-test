'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import apiClient from '../../../../../lib/api';
import { calculateLeaveDays, isDateInSameMonth } from '../../../../../lib/utils';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function EditLeavePage() {
  const router = useRouter();
  const params = useParams();
  const leaveId = params.id;
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    employeeId: '',
    reason: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchData();
  }, [leaveId]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const [leaveRes, employeesRes] = await Promise.all([
        apiClient.getLeave(leaveId),
        apiClient.getEmployees({ limit: 1000 })
      ]);

      // Format dates for input fields
      const startDate = new Date(leaveRes.startDate).toISOString().split('T')[0];
      const endDate = new Date(leaveRes.endDate).toISOString().split('T')[0];

      setFormData({
        employeeId: leaveRes.employeeId.toString(),
        reason: leaveRes.reason,
        startDate,
        endDate,
      });
      setEmployees(employeesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setErrors({ submit: 'Gagal memuat data cuti' });
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employeeId) {
      newErrors.employeeId = 'Pegawai wajib dipilih';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Alasan cuti wajib diisi';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Tanggal mulai wajib diisi';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Tanggal selesai wajib diisi';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end < start) {
        newErrors.endDate = 'Tanggal selesai tidak boleh sebelum tanggal mulai';
      }

      // Check if dates are in the same month
      if (!isDateInSameMonth(formData.startDate, formData.endDate)) {
        newErrors.endDate = 'Cuti harus dalam bulan yang sama';
      }

      // Check if duration is only 1 day
      const duration = calculateLeaveDays(formData.startDate, formData.endDate);
      if (duration > 1) {
        newErrors.endDate = 'Maksimal cuti 1 hari dalam satu bulan';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await apiClient.updateLeave(leaveId, {
        ...formData,
        employeeId: parseInt(formData.employeeId, 10)
      });
      router.push('/dashboard/leave');
    } catch (error) {
      console.error('Failed to update leave:', error);
      setErrors({ submit: error.message || 'Gagal memperbarui cuti' });
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = () => {
    if (formData.startDate && formData.endDate) {
      return calculateLeaveDays(formData.startDate, formData.endDate);
    }
    return 0;
  };

  if (loadingData) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="bg-white rounded-xl p-6 border">
            <div className="space-y-6">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link
          href="/dashboard/leave"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Kembali ke Daftar Cuti
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Cuti</h1>
        <p className="text-gray-600 mt-2">Perbarui informasi cuti pegawai</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Employee */}
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
                Pegawai <span className="text-red-500">*</span>
              </label>
              <select
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.employeeId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih pegawai</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </option>
                ))}
              </select>
              {errors.employeeId && (
                <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>
              )}
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Alasan Cuti <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reason"
                name="reason"
                rows={3}
                value={formData.reason}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.reason ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Masukkan alasan cuti"
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Mulai Cuti <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Selesai Cuti <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.endDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>

            {/* Duration Display */}
            {formData.startDate && formData.endDate && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-center">
                  <div className="text-sm text-blue-700">
                    <strong>Durasi Cuti:</strong> {calculateDuration()} hari
                  </div>
                </div>
                <div className="mt-2 text-xs text-blue-600">
                  <p>• Maksimal cuti 1 hari dalam satu bulan</p>
                  <p>• Maksimal total 12 hari cuti dalam 1 tahun</p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <Link
              href="/dashboard/leave"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Menyimpan...' : 'Perbarui Cuti'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
