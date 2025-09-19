import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye, Search } from 'lucide-react';

const ApprovalTimesheetBarangDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const timesheetData = [
    {
      id: 1,
      kodeTimesheet: 'TS-2024-001',
      tanggal: '2024-12-19',
      namaBarang: 'Excavator Komatsu',
      petugas: 'Ahmad Rizki',
      totalJam: 8,
      status: 'Pending'
    },
    {
      id: 2,
      kodeTimesheet: 'TS-2024-002',
      tanggal: '2024-12-19',
      namaBarang: 'Concrete Mixer',
      petugas: 'Budi Santoso',
      totalJam: 8,
      status: 'Approved'
    }
  ];

  const getStatusBadge = (status: string) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return `inline-flex px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">APPROVAL TIMESHEET BARANG</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari timesheet..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Barang</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Petugas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Jam</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {timesheetData.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.kodeTimesheet}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.tanggal}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.namaBarang}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.petugas}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.totalJam} jam</td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(item.status)}>{item.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-5 w-5" />
                      </button>
                      {item.status === 'Pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-900">
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <XCircle className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApprovalTimesheetBarangDashboard;
