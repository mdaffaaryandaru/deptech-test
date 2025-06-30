import Sidebar from '@/components/sidebar/sidebar';
import { CalendarIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const cutiRequests = [
  {
    id: 1,
    pegawai: 'Sarah Johnson',
    type: 'Liburan',
    startDate: '2024-07-15',
    endDate: '2024-07-19',
    days: 5,
    reason: 'Liburan keluarga ke Eropa',
    status: 'Menunggu',
    appliedDate: '2024-06-25',
  },
  {
    id: 2,
    pegawai: 'Mike Chen',
    type: 'Cuti Sakit',
    startDate: '2024-07-01',
    endDate: '2024-07-02',
    days: 2,
    reason: 'Janji dokter dan pemulihan',
    status: 'Disetujui',
    appliedDate: '2024-06-28',
  },
  {
    id: 3,
    pegawai: 'Emily Davis',
    type: 'Pribadi',
    startDate: '2024-07-10',
    endDate: '2024-07-10',
    days: 1,
    reason: 'Urusan pribadi',
    status: 'Ditolak',
    appliedDate: '2024-06-20',
  },
];

export default function ManajemenCuti() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Manajemen Cuti</h1>
              <p className="text-gray-600 mt-2">Tinjau dan kelola permintaan cuti pegawai.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Permintaan Menunggu</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-2">1</p>
                  </div>
                  <CalendarIcon className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Disetujui</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">1</p>
                  </div>
                  <CheckIcon className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ditolak</p>
                    <p className="text-2xl font-bold text-red-600 mt-2">1</p>
                  </div>
                  <XMarkIcon className="w-8 h-8 text-red-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Hari</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">8</p>
                  </div>
                  <CalendarIcon className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Leave Requests Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Permintaan Cuti Terbaru</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pegawai
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jenis
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hari
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alasan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cutiRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {request.pegawai}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.startDate} - {request.endDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.days}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {request.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            request.status === 'Menunggu' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : request.status === 'Disetujui'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {request.status === 'Menunggu' && (
                            <div className="flex space-x-2">
                              <button className="text-green-600 hover:text-green-900">
                                Setujui
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                Tolak
                              </button>
                            </div>
                          )}
                          {request.status !== 'Menunggu' && (
                            <button className="text-blue-600 hover:text-blue-900">
                              Lihat
                            </button>
                          )}
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
