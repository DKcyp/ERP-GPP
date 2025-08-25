import React, { useState } from 'react';
import { Clock, Plus, Search, FileSpreadsheet, FileText, Eye, ArrowUpDown } from 'lucide-react';
import TambahBarangModal from './TambahBarangModal'; // Import the new modal component

const MasterBarangDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample data for the table
  const [barangData, setBarangData] = useState([
    {
      no: 1,
      kodeBarang: 'BRG001',
      namaBarang: 'Helm Safety',
      kategori: 'Alat',
      satuan: 'Buah',
      hargaBeli: 'Rp 50.000',
      hargaJual: 'Rp 75.000',
      masaExpired: '28-03-2025',
      statusBarang: 'Aktif',
      statusIzin: 'Disetujui',
    },
    {
      no: 2,
      kodeBarang: 'BRG002',
      namaBarang: 'Sepatu Safety',
      kategori: 'Alat',
      satuan: 'Pasang',
      hargaBeli: 'Rp 250.000',
      hargaJual: 'Rp 350.000',
      masaExpired: '05-05-2025',
      statusBarang: 'Aktif',
      statusIzin: 'Menunggu Persetujuan',
    },
    {
      no: 3,
      kodeBarang: 'BRG003',
      namaBarang: 'Sealant',
      kategori: 'Material',
      satuan: 'Pcs',
      hargaBeli: 'Rp 100.000',
      hargaJual: 'Rp 150.000',
      masaExpired: '04-04-2025',
      statusBarang: 'Non Aktif',
      statusIzin: '-',
    },
    {
      no: 4,
      kodeBarang: 'BRG004',
      namaBarang: 'Sarung Tangan',
      kategori: 'Alat',
      satuan: 'Pasang',
      hargaBeli: 'Rp 15.000',
      hargaJual: 'Rp 25.000',
      masaExpired: '10-04-2025',
      statusBarang: 'Aktif',
      statusIzin: 'Sudah Memiliki Izin',
    },
  ]);

  const [filters, setFilters] = useState({
    namaBarang: '',
    kodeBarang: '',
    kategori: '',
    statusBarang: '',
    statusIzin: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredData = barangData.filter(item => {
    return (
      item.namaBarang.toLowerCase().includes(filters.namaBarang.toLowerCase()) &&
      item.kodeBarang.toLowerCase().includes(filters.kodeBarang.toLowerCase()) &&
      (filters.kategori === '' || item.kategori.toLowerCase() === filters.kategori.toLowerCase()) &&
      (filters.statusBarang === '' || item.statusBarang.toLowerCase() === filters.statusBarang.toLowerCase()) &&
      (filters.statusIzin === '' || item.statusIzin.toLowerCase() === filters.statusIzin.toLowerCase())
    );
  });

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aktif':
        return 'bg-green-100 text-green-800';
      case 'non aktif':
        return 'bg-red-100 text-red-800';
      case 'disetujui':
        return 'bg-blue-100 text-blue-800';
      case 'menunggu persetujuan':
        return 'bg-yellow-100 text-yellow-800';
      case 'sudah memiliki izin':
        return 'bg-purple-100 text-purple-800';
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
                MASTER BARANG
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Gudang</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Barang</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Master Barang</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="relative">
              <label htmlFor="namaBarang" className="sr-only">Cari Nama Barang</label>
              <input
                type="text"
                id="namaBarang"
                name="namaBarang"
                value={filters.namaBarang}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10"
                placeholder="Cari Nama Barang"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <div className="relative">
              <label htmlFor="kodeBarang" className="sr-only">Cari Kode Barang</label>
              <input
                type="text"
                id="kodeBarang"
                name="kodeBarang"
                value={filters.kodeBarang}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10"
                placeholder="Cari Kode Barang"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <div>
              <label htmlFor="statusBarang" className="sr-only">Status Barang</label>
              <select
                id="statusBarang"
                name="statusBarang"
                value={filters.statusBarang}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                <option value="">--Pilih Status Barang--</option>
                <option value="aktif">Aktif</option>
                <option value="non aktif">Non Aktif</option>
              </select>
            </div>
            <div>
              <label htmlFor="kategori" className="sr-only">Kategori Barang</label>
              <select
                id="kategori"
                name="kategori"
                value={filters.kategori}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                <option value="">--Pilih Kategori--</option>
                <option value="alat">Alat</option>
                <option value="material">Material</option>
                <option value="elektronik">Elektronik</option>
              </select>
            </div>
            <div>
              <label htmlFor="statusIzin" className="sr-only">Status Izin</label>
              <select
                id="statusIzin"
                name="statusIzin"
                value={filters.statusIzin}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                <option value="">--Pilih Status Izin--</option>
                <option value="disetujui">Disetujui</option>
                <option value="menunggu persetujuan">Menunggu Persetujuan</option>
                <option value="sudah memiliki izin">Sudah Memiliki Izin</option>
                <option value="-">-</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-5 w-5 mr-2" /> Barang
            </button>
            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 transition-colors duration-200">
                <FileSpreadsheet className="h-5 w-5 mr-2" /> Export Excel
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-200">
                <FileText className="h-5 w-5 mr-2" /> Export CSV
              </button>
              <button className="flex items-center px-4 py-2 bg-red-600 text-white font-semibold rounded-xl shadow-md hover:bg-red-700 transition-colors duration-200">
                <FileText className="h-5 w-5 mr-2" /> Export PDF
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto bg-gray-50 rounded-xl border border-gray-100 shadow-sm mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Kode Barang <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Nama Barang <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Kategori <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Satuan <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Harga Beli <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Harga Jual <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Masa Expired <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Status Barang <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Status Izin <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentEntries.map((item, index) => (
                  <tr key={item.no} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kodeBarang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.namaBarang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kategori}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.satuan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.hargaBeli}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.hargaJual}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.masaExpired}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(item.statusBarang)}`}>
                        {item.statusBarang}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(item.statusIzin)}`}>
                        {item.statusIzin}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 transition-colors">
                        <Eye className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
              <span>entries</span>
            </div>
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredData.length)} of {filteredData.length} entries
            </div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                    currentPage === i + 1 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Tambah Barang Modal */}
      <TambahBarangModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default MasterBarangDashboard;
