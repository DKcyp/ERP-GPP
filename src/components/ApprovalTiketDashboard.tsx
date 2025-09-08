import React, { useState } from 'react';
import { Search, Calendar, FileText, FileSpreadsheet, FileDown, Eye, ThumbsUp, ThumbsDown, X } from 'lucide-react';

const ApprovalTiketDashboard: React.FC = () => {
  const [searchKodeBarang, setSearchKodeBarang] = useState('BRG001');
  const [searchNamaBarang, setSearchNamaBarang] = useState('Excavator');
  const [sumberBarang, setSumberBarang] = useState('Timesheet');
  const [startDate, setStartDate] = useState('03/03/2025');
  const [endDate, setEndDate] = useState('03/03/2025');
  const [showEntries, setShowEntries] = useState(10);

  const data = [
    {
      no: 1,
      noVoucher: 'VCH001',
      noSO: 'SOO101',
      tanggalPengajuan: '01-01-2025',
      jumlahNominal: 15_000_000,
      status: 'Approved',
      keterangan: 'Disetujui',
    },
    {
      no: 2,
      noVoucher: 'VCH002',
      noSO: 'SOO102',
      tanggalPengajuan: '05-02-2025',
      jumlahNominal: 20_000_000,
      status: 'Pending',
      keterangan: 'Menunggu Persetujuan',
    },
    {
      no: 3,
      noVoucher: 'VCH003',
      noSO: 'SOO103',
      tanggalPengajuan: '10-03-2025',
      jumlahNominal: 12_500_000,
      status: 'Pending',
      keterangan: 'Menunggu Persetujuan',
    },
    {
      no: 4,
      noVoucher: 'VCH004',
      noSO: 'SOO104',
      tanggalPengajuan: '18-04-2025',
      jumlahNominal: 18_000_000,
      status: 'Rejected',
      keterangan: 'Dokumen Tidak Lengkap',
    },
    {
      no: 5,
      noVoucher: 'VCH005',
      noSO: 'SOO105',
      tanggalPengajuan: '25-05-2025',
      jumlahNominal: 25_000_000,
      status: 'Approved',
      keterangan: 'Disetujui',
    },
  ];

  const [rows, setRows] = useState(data);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<typeof data[number] | null>(null);

  const handleView = (row: typeof data[number]) => {
    setSelectedRow(row);
    setIsDetailOpen(true);
  };

  const handleApprove = (no: number) => {
    setRows((prev) =>
      prev.map((r) =>
        r.no === no ? { ...r, status: 'Approved', keterangan: 'Disetujui' } : r
      )
    );
  };

  const handleReject = (no: number) => {
    setRows((prev) =>
      prev.map((r) =>
        r.no === no ? { ...r, status: 'Rejected', keterangan: 'Ditolak' } : r
      )
    );
  };

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
          <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
            Approval Tiket
          </h1>
          <nav className="text-sm text-gray-600">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
            <span className="mx-2">›</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Approval</span>
            <span className="mx-2">›</span>
            <span className="text-blue-600 font-medium">Approval Tiket</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Cari Kode Barang */}
            <div>
              <label htmlFor="kodeBarang" className="block text-sm font-medium text-gray-700 mb-2">
                Cari Kode Barang
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="kodeBarang"
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={searchKodeBarang}
                  onChange={(e) => setSearchKodeBarang(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 bg-blue-500 rounded-r-lg cursor-pointer hover:bg-blue-600 transition-colors">
                  <Search className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            {/* Cari Nama Barang */}
            <div>
              <label htmlFor="namaBarang" className="block text-sm font-medium text-gray-700 mb-2">
                Cari Nama Barang
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="namaBarang"
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={searchNamaBarang}
                  onChange={(e) => setSearchNamaBarang(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 bg-blue-500 rounded-r-lg cursor-pointer hover:bg-blue-600 transition-colors">
                  <Search className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            {/* Pilih Sumber Barang */}
            <div>
              <label htmlFor="sumberBarang" className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Sumber Barang
              </label>
              <select
                id="sumberBarang"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={sumberBarang}
                onChange={(e) => setSumberBarang(e.target.value)}
              >
                <option>Timesheet</option>
                <option>Invoice</option>
                <option>PO Training</option>
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
                    type="text" // Changed to text for custom date format display
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
                    type="text" // Changed to text for custom date format display
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
                {rows.map((row) => (
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
                      {formatCurrency(row.jumlahNominal)}
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
                        <button
                          onClick={() => handleView(row)}
                          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                          title="Lihat"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {row.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(row.no)}
                              className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                              title="Approve"
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleReject(row.no)}
                              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                              title="Reject"
                            >
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
              <span>Showing 1 to 5 of 5 entries</span>
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
          {/* Detail Modal */}
          {isDetailOpen && selectedRow && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white w-full max-w-xl rounded-xl shadow-xl border border-gray-200">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold">Detail Tiket</h3>
                  <button
                    onClick={() => setIsDetailOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-md"
                    aria-label="Close detail"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">No</div>
                    <div className="font-medium text-gray-900">{selectedRow.no}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">No Voucher</div>
                    <div className="font-medium text-gray-900">{selectedRow.noVoucher}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">No SO</div>
                    <div className="font-medium text-gray-900">{selectedRow.noSO}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Tanggal Pengajuan</div>
                    <div className="font-medium text-gray-900">{selectedRow.tanggalPengajuan}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Jumlah Nominal</div>
                    <div className="font-medium text-gray-900">{`Rp ${selectedRow.jumlahNominal.toLocaleString('id-ID')}`}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Status</div>
                    <div className="font-medium text-gray-900">{selectedRow.status}</div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="text-gray-500">Keterangan</div>
                    <div className="font-medium text-gray-900">{selectedRow.keterangan}</div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50">
                  <button
                    onClick={() => setIsDetailOpen(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalTiketDashboard;
