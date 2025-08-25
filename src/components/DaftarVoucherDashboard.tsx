import React, { useState } from 'react';
import { Clock, Search, Calendar, FileText, FileSpreadsheet, FileDown, ChevronUp, ChevronDown } from 'lucide-react';

interface VoucherItem {
  no: number;
  noVoucher: string;
  tanggalPengajuan: string;
  jumlahDiajukan: string;
  status: 'Langsung Bayar' | 'Voucher Baru';
}

const voucherData: VoucherItem[] = [
  { no: 1, noVoucher: 'VCH001', tanggalPengajuan: '01-01-2025', jumlahDiajukan: '100.000', status: 'Langsung Bayar' },
  { no: 2, noVoucher: 'VCH002', tanggalPengajuan: '02-01-2025', jumlahDiajukan: '150.000', status: 'Langsung Bayar' },
  { no: 3, noVoucher: 'VCH003', tanggalPengajuan: '03-01-2025', jumlahDiajukan: '500.000', status: 'Voucher Baru' },
  { no: 4, noVoucher: 'VCH004', tanggalPengajuan: '04-01-2025', jumlahDiajukan: '350.000', status: 'Voucher Baru' },
  { no: 5, noVoucher: 'VCH005', tanggalPengajuan: '05-01-2025', jumlahDiajukan: '200.000', status: 'Voucher Baru' },
];

const DaftarVoucherDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const totalPages = Math.ceil(voucherData.length / entriesPerPage);
  const currentEntries = voucherData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const getStatusClasses = (status: VoucherItem['status']) => {
    switch (status) {
      case 'Langsung Bayar':
        return 'bg-red-100 text-red-800';
      case 'Voucher Baru':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                DAFTAR VOUCHER
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Voucher</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Daftar Voucher</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label htmlFor="kodeBarang" className="block text-sm font-medium text-gray-700 mb-1">Cari Kode Barang</label>
              <div className="relative">
                <input
                  type="text"
                  id="kodeBarang"
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="BRG001"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer hover:text-blue-600 transition-colors" />
              </div>
            </div>
            <div>
              <label htmlFor="namaBarang" className="block text-sm font-medium text-gray-700 mb-1">Cari Nama Barang</label>
              <div className="relative">
                <input
                  type="text"
                  id="namaBarang"
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Excavator"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer hover:text-blue-600 transition-colors" />
              </div>
            </div>
            <div>
              <label htmlFor="sumberBarang" className="block text-sm font-medium text-gray-700 mb-1">Pilih Sumber Barang</label>
              <select
                id="sumberBarang"
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white"
              >
                <option>Timesheet</option>
                <option>Invoice</option>
                <option>PO</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end mb-6">
            <div className="md:col-span-2">
              <label htmlFor="periodeStart" className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
              <div className="flex items-center space-x-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="periodeStart"
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="03/03/2025"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer hover:text-blue-600 transition-colors" />
                </div>
                <span className="text-gray-500 text-sm">s.d</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="periodeEnd"
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="03/03/2025"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer hover:text-blue-600 transition-colors" />
                </div>
              </div>
            </div>
            <div className="md:col-span-1">
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600 transition-colors duration-300 shadow-md hover:shadow-lg text-sm font-medium">
                Search
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mb-6">
            <button className="flex items-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-xl hover:bg-green-600 transition-colors duration-300 shadow-md hover:shadow-lg text-sm font-medium">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600 transition-colors duration-300 shadow-md hover:shadow-lg text-sm font-medium">
              <FileText className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button className="flex items-center space-x-2 bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 transition-colors duration-300 shadow-md hover:shadow-lg text-sm font-medium">
              <FileDown className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>

          <div className="mb-4 flex items-center space-x-2 text-sm text-gray-700">
            <span>Show</span>
            <select
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      No
                      <ChevronUp className="ml-1 h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      No Voucher
                      <ChevronUp className="ml-1 h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Tanggal Pengajuan
                      <ChevronUp className="ml-1 h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Jumlah yang diajukan
                      <ChevronUp className="ml-1 h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Status
                      <ChevronUp className="ml-1 h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentEntries.map((item) => (
                  <tr key={item.no} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.noVoucher}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.tanggalPengajuan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.jumlahDiajukan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav
            className="flex items-center justify-between pt-4"
            aria-label="Pagination"
          >
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * entriesPerPage) + 1} to {Math.min(currentPage * entriesPerPage, voucherData.length)} of {voucherData.length} entries
            </div>
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-l-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                    currentPage === page ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default DaftarVoucherDashboard;
