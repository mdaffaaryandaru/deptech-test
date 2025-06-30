import Sidebar from '@/components/sidebar/sidebar';
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const attendanceData = [
  {
    id: 1,
    pegawai: 'Sarah Johnson',
    date: '2024-06-30',
    clockIn: '09:00 AM',
    clockOut: '06:00 PM',
    totalHours: '9j 0m',
    status: 'Hadir',
    location: 'Kantor',
  },
  {
    id: 2,
    pegawai: 'Mike Chen',
    date: '2024-06-30',
    clockIn: '08:45 AM',
    clockOut: '05:30 PM',
    totalHours: '8j 45m',
    status: 'Hadir',
    location: 'Remote',
  },
  {
    id: 3,
    pegawai: 'Emily Davis',
    date: '2024-06-30',
    clockIn: '-',
    clockOut: '-',
    totalHours: '-',
    status: 'Tidak Hadir',
    location: '-',
  },
  {
    id: 4,
    pegawai: 'David Wilson',
    date: '2024-06-30',
    clockIn: '09:15 AM',
    clockOut: 'Masih bekerja',
    totalHours: '8j 45m',
    status: 'Hadir',
    location: 'Kantor',
  },
];

export default function Attendance() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Manajemen Kehadiran</h1>
              <p className="text-gray-600 mt-2">Pantau dan kelola kehadiran pegawai serta jam kerja.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Hadir Hari Ini</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">3</p>
                  </div>
                  <CheckCircleIcon className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tidak Hadir Hari Ini</p>
                    <p className="text-2xl font-bold text-red-600 mt-2">1</p>
                  </div>
                  <XCircleIcon className="w-8 h-8 text-red-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rata-rata Jam Kerja</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">8.8j</p>
                  </div>
                  <ClockIcon className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Kehadiran Hari Ini</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pegawai
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jam Masuk
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jam Keluar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Jam
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lokasi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {attendanceData.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {record.pegawai}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.clockIn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.clockOut}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.totalHours}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            record.status === 'Hadir' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.location}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
