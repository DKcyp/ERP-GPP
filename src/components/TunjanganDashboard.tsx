import React, { useState, useEffect } from 'react';
import TunjanganPegawaiModal, { TunjanganPegawaiFormData } from './TunjanganPegawaiModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { 
  Search, 
  Plus,
  FileSpreadsheet, 
  FileText, 
  File,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Info,
  ChevronLeft,
  ChevronRight,
  ArrowUp
} from 'lucide-react';

interface TunjanganData {
  id: string;
  no: number;
  namaProyek: string;
  zona: string;
  jumlahKaryawan: number;
  totalTunjangan: string;
  status: 'Open' | 'Pending' | 'Closed';
}

const TunjanganDashboard: React.FC = () => {
  const [searchNamaProyek, setSearchNamaProyek] = useState('');
  const [searchZonaKerja, setSearchZonaKerja] = useState('');
  const [dateFrom, setDateFrom] = useState('03/03/2025');
  const [dateTo, setDateTo] = useState('03/03/2025');
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TunjanganData | null>(null);
  const [sortField, setSortField] = useState<keyof TunjanganData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample data matching the image
  const [tunjanganData, setTunjanganData] = useState<TunjanganData[]>([
    {
      id: '1',
      no: 1,
      namaProyek: 'Proyek Jaringan Fiber Optik',
      zona: 'Zona 1',
      jumlahKaryawan: 15,
      totalTunjangan: 'Rp 45.000.000',
      status: 'Open'
    },
    {
      id: '2',
      no: 2,
      namaProyek: 'Proyek Internet Sekolah',
      zona: 'Zona 2',
      jumlahKaryawan: 10,
      totalTunjangan: 'Rp 30.000.000',
      status: 'Pending'
    },
    {
      id: '3',
      no: 3,
      namaProyek: 'Proyek Smart City',
      zona: 'Zona 3',
      jumlahKaryawan: 20,
      totalTunjangan: 'Rp 60.000.000',
      status: 'Closed'
    },
    {
      id: '4',
      no: 4,
      namaProyek: 'Proyek Perluasan Jaringan',
      zona: 'Zona 4',
      jumlahKaryawan: 12,
      totalTunjangan: 'Rp 36.000.000',
      status: 'Open'
    },
    {
      id: '5',
      no: 5,
      namaProyek: 'Proyek Data Center',
      zona: 'Zona 5',
      jumlahKaryawan: 18,
      totalTunjangan: 'Rp 54.000.000',
      status: 'Closed'
    }
  ]);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleSort = (field: keyof TunjanganData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteClick = (item: TunjanganData) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setTunjanganData(prev => prev.filter(t => t.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-green-600 text-white';
      case 'Pending': return 'bg-yellow-500 text-white';
      case 'Closed': return 'bg-red-600 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter data based on search criteria
  const filteredData = tunjanganData.filter(item => {
    const matchesNamaProyek = item.namaProyek.toLowerCase().includes(searchNamaProyek.toLowerCase());
    const matchesZonaKerja = item.zona.toLowerCase().includes(searchZonaKerja.toLowerCase());
    
    return matchesNamaProyek && matchesZonaKerja;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleAddTunjanganPegawai = (formData: TunjanganPegawaiFormData) => {
    console.log('Tunjangan Pegawai data saved:', formData);
    // Here you would typically add the new data to your state or send it to an API
    // For now, we'll just log it to demonstrate the integration
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Tunjangan
            </h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah</span>
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="space-y-4 mb-6">
            {/* Search Inputs Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Search Nama Proyek */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Nama Proyek
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchNamaProyek}
                    onChange={(e) => setSearchNamaProyek(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="Proyek A"
                  />
                  <button 
                    onClick={handleSearch}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Search Zona Kerja */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Zona Kerja
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchZonaKerja}
                    onChange={(e) => setSearchZonaKerja(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="Zona Timur"
                  />
                  <button 
                    onClick={handleSearch}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Date Range and Search Button Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Periode */}
              <div className="space-y-2 lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Periode
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="03/03/2025"
                  />
                  <span className="text-sm text-gray-500">s.d</span>
                  <input
                    type="text"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="03/03/2025"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 opacity-0">
                  Search
                </label>
                <button 
                  onClick={handleSearch}
                  className="w-full px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md font-medium transition-colors text-sm flex items-center justify-center gap-2"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex justify-end space-x-2 mb-6">
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
              <File className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Show entries control */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-700">entries</span>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('no')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No</span>
                      {sortField === 'no' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('namaProyek')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama Proyek</span>
                      {sortField === 'namaProyek' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('zona')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Zona</span>
                      {sortField === 'zona' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('jumlahKaryawan')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Jumlah Karyawan</span>
                      {sortField === 'jumlahKaryawan' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('totalTunjangan')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Total Tunjangan</span>
                      {sortField === 'totalTunjangan' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {sortField === 'status' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr 
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    } ${animateRows ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`}
                    style={{ 
                      animationDelay: animateRows ? `${index * 100}ms` : '0ms',
                      animationFillMode: 'forwards'
                    }}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">{item.no}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.namaProyek}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.zona}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">{item.jumlahKaryawan}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.totalTunjangan}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <button
                  onClick={() => handlePageChange(1)}
                  className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                    currentPage === 1
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  1
                </button>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tunjangan Pegawai Modal */}
      <TunjanganPegawaiModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTunjanganPegawai}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.namaProyek}
      />
    </div>
  );
};

export default TunjanganDashboard;
