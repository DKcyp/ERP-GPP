import React, { useState } from 'react';
import { Clock, Search, Calendar, FileText, FileSpreadsheet, FileDown, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';

const ApprovalVoucherDashboard: React.FC = () => {
  const [searchNoVoucher, setSearchNoVoucher] = useState('VCH001'); // Changed from searchKodeVoucher
  const [searchNoSO, setSearchNoSO] = useState('SO0101'); // Changed from searchNamaVoucher
  const [sumberVoucher, setSumberVoucher] = useState('Timesheet'); // Changed from statusVoucher
  const [startDate, setStartDate] = useState('01/03/2025'); // Updated default date
  const [endDate, setEndDate] = useState('03/03/2025'); // Updated default date
  const [showEntries, setShowEntries] = useState(10);

  const data = [
    {
      no: 1,
      noVoucher: 'VCH001', // Changed from kodeVoucher
      noSO: 'SO0101', // Changed from namaVoucher
      tanggalPengajuan: '01-01-2025',
      jumlahNominalVoucher: 15_000_000, // Changed from jumlah
      status: 'Approved',
      keterangan: 'Disetujui',
    },
    {
      no: 2,
      noVoucher: 'VCH002',
      noSO: 'SO0102',
      tanggalPengajuan: '05-02-2025',
      jumlahNominalVoucher: 20_000_000,
      status: 'Pending',
      keterangan: 'Menunggu Persetujuan',
    },
    {
      no: 3,
      noVoucher: 'VCH003',
      noSO: 'SO0103',
      tanggalPengajuan: '10-03-2025',
      jumlahNominalVoucher: 12_500_000,
      status: 'Pending',
      keterangan: 'Menunggu Persetujuan',
    },
    {
      no: 4,
      noVoucher: 'VCH004',
      noSO: 'SO0104',
      tanggalPengajuan: '18-04-2025',
      jumlahNominalVoucher: 18_000_000,
      status: 'Rejected',
      keterangan: 'Dokumen Tidak Lengkap',
    },
    {
      no: 5,
      noVoucher: 'VCH005',
      noSO: 'SO0105',
      tanggalPengajuan: '25-05-2025',
      jumlahNominalVoucher: 25_000_000,
      status: 'Approved',
      keterangan: 'Disetujui',
    },
  ];

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500 text-white';
      case 'Pending':
        return 'bg-yellow-500 text-white';
      case 'Rejected':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                APPROVAL VOUCHER
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Approval</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Approval Voucher</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Cari No Voucher */}
            <div>
              <label htmlFor="noVoucher" className="block text-sm font-medium text-gray-700 mb-2">
                Cari No Voucher
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="noVoucher"
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={searchNoVoucher}
                  onChange={(e) => setSearchNoVoucher(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 bg-blue-500 rounded-r-lg cursor-pointer hover:bg-blue-600 transition-colors">
                  <Search className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            {/* Cari No SO */}
            <div>
              <label htmlFor="noSO" className="block text-sm font-medium text-gray-700 mb-2">
                Cari No SO
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="noSO"
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={searchNoSO}
                  onChange={(e) => setSearchNoSO(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 bg-blue-500 rounded-r-lg cursor-pointer hover:bg-blue-600 transition-colors">
                  <Search className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            {/* Pilih Sumber Voucher */}
            <div>
              <label htmlFor="sumberVoucher" className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Sumber Voucher
              </label>
              <select
                id="sumberVoucher"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={sumberVoucher}
                onChange={(e) => setSumberVoucher(e.target.value)}
              >
                <option>All</option>
                <option>Timesheet</option>
                <option>Purchasing</option>
                <option>Marketing</option>
                <option>Operational</option>
              </select>
            </div>
          </div>

          {/* Periode and Search Button */}
          <div className="flex flex-col md:flex-row items-end md:items-center gap-4 mb-6">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Periode
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="startDate"
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 text-sm">s.d</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="endDate"
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors text-sm w-full md:w-auto">
              Search
            </button>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap gap-3 justify-end mb-6">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors text-sm">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors text-sm">
              <FileDown className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors text-sm">
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Show</span>
                <select
                  className="border border-gray-300 rounded-md px-2 py-1"
                  value={showEntries}
                  onChange={(e) => setShowEntries(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>entries</span>
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    No <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    No Voucher <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    No SO <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Tanggal Pengajuan <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Jumlah Nominal Voucher <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Status Approval <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Keterangan <span className="ml-1">↑↓</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row) => (
                  <tr key={row.no} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.noVoucher}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.noSO}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.tanggalPengajuan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(row.jumlahNominalVoucher)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.keterangan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        {row.status === 'Pending' && (
                          <>
                            <button className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors">
                              <ThumbsUp className="h-4 w-4" />
                            </button>
                            <button className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors">
                              <ThumbsDown className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 flex justify-between items-center text-sm text-gray-600">
              <span>Showing 1 to {data.length} of {data.length} entries</span>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 border border-blue-500 bg-blue-500 text-white rounded-md">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalVoucherDashboard;
