import React from 'react';
import { Clock, Search, Calendar, FileText, FileBarChart, FileSpreadsheet } from 'lucide-react';

const RestockExpiredBarangDashboard: React.FC = () => {
  const restockItems = [
    { no: 1, kodeBarang: 'GB001', namaBarang: 'Bolt M10 x 50', kategori: 'Sparepart', satuan: 'PCS', jumlahExp: 25, jumlahRestock: 120, tglRestock: '01-02-2024', tglExpBaru: '01-02-2025', supplier: 'PT Gamma Buana Persada' },
    { no: 2, kodeBarang: 'GB002', namaBarang: 'Bearing 6203', kategori: 'Sparepart', satuan: 'PCS', jumlahExp: 18, jumlahRestock: 80, tglRestock: '05-02-2024', tglExpBaru: '05-02-2025', supplier: 'PT Gamma Buana Persada' },
    { no: 3, kodeBarang: 'GB003', namaBarang: 'Grease Shell Gadus', kategori: 'Pelumas', satuan: 'Kg', jumlahExp: 12, jumlahRestock: 60, tglRestock: '10-02-2024', tglExpBaru: '10-02-2025', supplier: 'PT Gamma Buana Persada' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                RESTOCK BARANG EXPIRED
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Gudang</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Barang</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Restock Expired Barang</span>
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="relative">
              <label htmlFor="kodeBarang" className="block text-sm font-medium text-gray-700 mb-1">Cari Kode Barang</label>
              <input
                type="text"
                id="kodeBarang"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="BRG0001"
              />
              <Search className="absolute left-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
            </div>
            <div className="relative">
              <label htmlFor="namaBarang" className="block text-sm font-medium text-gray-700 mb-1">Cari Nama Barang</label>
              <input
                type="text"
                id="namaBarang"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Nama Barang"
              />
              <Search className="absolute left-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
            </div>
            <div className="relative">
              <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-1">Cari Kategori</label>
              <select
                id="kategori"
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option>--Pilih Kategori--</option>
                <option>Alat</option>
                <option>Bahan</option>
                <option>Sparepart</option>
                <option>Pelumas</option>
              </select>
              <Search className="absolute right-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
            </div>
            <div className="relative">
              <label htmlFor="satuan" className="block text-sm font-medium text-gray-700 mb-1">Cari Satuan</label>
              <input
                type="text"
                id="satuan"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="PCS"
              />
              <Search className="absolute left-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
            </div>
            <div className="relative">
              <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">Cari Supplier</label>
              <input
                type="text"
                id="supplier"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="PT. Maju Jaya"
              />
              <Search className="absolute left-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Cari Status</label>
              <select
                id="status"
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option>--Pilih Status--</option>
                <option>Expired Dalam 7 Hari</option>
                <option>Sudah Expired</option>
              </select>
            </div>
            <div className="flex items-end space-x-2">
              <div className="relative w-1/2">
                <label htmlFor="periodeStart" className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
                <input
                  type="date"
                  id="periodeStart"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  defaultValue="2025-03-03"
                />
                <Calendar className="absolute left-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
              </div>
              <span className="text-gray-500 mb-1">s.d</span>
              <div className="relative w-1/2">
                <input
                  type="date"
                  id="periodeEnd"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  defaultValue="2025-03-03"
                />
                <Calendar className="absolute left-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="flex justify-end mb-6">
            <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-md">
              Search
            </button>
          </div>

          {/* Export Buttons */}
          <div className="flex justify-end space-x-3 mb-6">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200 text-sm">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm">
              <FileText className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 text-sm">
              <FileBarChart className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Show</span>
                <select className="border border-gray-300 rounded-md px-2 py-1">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <span>entries</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search:"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Barang</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satuan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Exp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Restock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Restock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Exp Baru</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {restockItems.map((item) => (
                  <tr key={item.no} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kodeBarang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.namaBarang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kategori}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.satuan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.jumlahExp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.jumlahRestock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tglRestock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tglExpBaru}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.supplier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              Showing 1 to {restockItems.length} of {restockItems.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                Previous
              </button>
              <button className="px-4 py-2 border border-blue-500 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestockExpiredBarangDashboard;
