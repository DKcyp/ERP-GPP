import React, { useState, useEffect } from 'react';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { 
  Search, 
  ChevronLeft,
  ChevronRight,
  ArrowUp
} from 'lucide-react';

interface HistoryPeminjamanData {
  id: string;
  no: number;
  nik: string;
  nama: string;
  tanggalPeminjaman: string;
  jumlahPeminjaman: string;
  status: 'Dikembalikan' | 'Belum Dikembalikan';
}

const HistoryPeminjamanDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<HistoryPeminjamanData | null>(null);
  const [sortField, setSortField] = useState<keyof HistoryPeminjamanData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sample data matching the first image
  const [historyPeminjamanData, setHistoryPeminjamanData] = useState<HistoryPeminjamanData[]>([
    {
      id: '1',
      no: 1,
      nik: '3201012345678901',
      nama: 'Fatih Ali',
      tanggalPeminjaman: '2024-09-01',
      jumlahPeminjaman: 'Rp 3,000,000',
      status: 'Dikembalikan'
    },
    {
      id: '2',
      no: 2,
      nik: '3201012345678902',
      nama: 'Elang Rochim',
      tanggalPeminjaman: '2024-09-03',
      jumlahPeminjaman: 'Rp 3,000,000',
      status: 'Dikembalikan'
    },
    {
      id: '3',
      no: 3,
      nik: '3201012345678903',
      nama: 'Rizky Putra',
      tanggalPeminjaman: '2024-08-28',
      jumlahPeminjaman: 'Rp 3,000,000',
      status: 'Belum Dikembalikan'
    },
    {
      id: '4',
      no: 4,
      nik: '3201012345678904',
      nama: 'Siti Aisyah',
      tanggalPeminjaman: '2024-09-05',
      jumlahPeminjaman: 'Rp 3,000,000',
      status: 'Dikembalikan'
    },
    {
      id: '5',
      no: 5,
      nik: '3201012345678905',
      nama: 'Andi Pratama',
      tanggalPeminjaman: '2024-09-07',
      jumlahPeminjaman: 'Rp 3,000,000',
      status: 'Belum Dikembalikan'
    }
  ]);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleSort = (field: keyof HistoryPeminjamanData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteClick = (item: HistoryPeminjamanData) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setHistoryPeminjamanData(prev => prev.filter(h => h.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Dikembalikan': return 'bg-green-600 text-white';
      case 'Belum Dikembalikan': return 'bg-red-600 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter data based on search criteria
  const filteredData = historyPeminjamanData.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.nik.toLowerCase().includes(searchLower) ||
      item.nama.toLowerCase().includes(searchLower) ||
      item.tanggalPeminjaman.toLowerCase().includes(searchLower) ||
      item.jumlahPeminjaman.toLowerCase().includes(searchLower) ||
      item.status.toLowerCase().includes(searchLower)
    );
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            History Peminjaman
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Controls Section */}
        <div className="flex items-center justify-between">
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

          {/* Search */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Search:</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
              placeholder="Search..."
            />
          </div>
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
                    onClick={() => handleSort('nik')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>NIK</span>
                      {sortField === 'nik' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('nama')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama</span>
                      {sortField === 'nama' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('tanggalPeminjaman')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Tanggal Peminjaman</span>
                      {sortField === 'tanggalPeminjaman' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('jumlahPeminjaman')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Jumlah Peminjaman</span>
                      {sortField === 'jumlahPeminjaman' && (
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
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.nik}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.nama}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.tanggalPeminjaman}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.jumlahPeminjaman}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
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
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
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

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.nama}
      />
    </div>
  );
};

export default HistoryPeminjamanDashboard;
