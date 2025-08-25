import React, { useState, useEffect } from 'react';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { 
  Search, 
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

interface InsentifData {
  id: string;
  no: number;
  namaPegawai: string;
  periode: string;
  jumlahInsentif: string;
  statusPembayaran: 'Dikembalikan' | 'Belum Dikembalikan' | 'Dalam Proses';
}

const HRDMarketingDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InsentifData | null>(null);
  const [sortField, setSortField] = useState<keyof InsentifData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sample data matching the image
  const [insentifData, setInsentifData] = useState<InsentifData[]>([
    {
      id: '1',
      no: 1,
      namaPegawai: 'Ahmad',
      periode: 'Januari 2025',
      jumlahInsentif: 'Rp 1.500.000',
      statusPembayaran: 'Dikembalikan'
    },
    {
      id: '2',
      no: 2,
      namaPegawai: 'Fauzi',
      periode: 'Januari 2025',
      jumlahInsentif: 'Rp 1.500.000',
      statusPembayaran: 'Belum Dikembalikan'
    },
    {
      id: '3',
      no: 3,
      namaPegawai: 'Siti Nurhaliza',
      periode: 'Februari 2025',
      jumlahInsentif: 'Rp 1.750.000',
      statusPembayaran: 'Dikembalikan'
    },
    {
      id: '4',
      no: 4,
      namaPegawai: 'Budi Santoso',
      periode: 'Februari 2025',
      jumlahInsentif: 'Rp 1.400.000',
      statusPembayaran: 'Belum Dikembalikan'
    },
    {
      id: '5',
      no: 5,
      namaPegawai: 'Desi Ananda',
      periode: 'Maret 2025',
      jumlahInsentif: 'Rp 1.600.000',
      statusPembayaran: 'Dalam Proses'
    },
    {
      id: '6',
      no: 6,
      namaPegawai: 'Rina Kurnia',
      periode: 'Maret 2025',
      jumlahInsentif: 'Rp 1.800.000',
      statusPembayaran: 'Dikembalikan'
    },
    {
      id: '7',
      no: 7,
      namaPegawai: 'Agus Prasetyo',
      periode: 'April 2025',
      jumlahInsentif: 'Rp 1.650.000',
      statusPembayaran: 'Belum Dikembalikan'
    },
    {
      id: '8',
      no: 8,
      namaPegawai: 'Lina Marlina',
      periode: 'April 2025',
      jumlahInsentif: 'Rp 1.700.000',
      statusPembayaran: 'Dalam Proses'
    }
  ]);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleSort = (field: keyof InsentifData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteClick = (item: InsentifData) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setInsentifData(prev => prev.filter(i => i.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Dikembalikan': return 'bg-green-600 text-white';
      case 'Belum Dikembalikan': return 'bg-red-600 text-white';
      case 'Dalam Proses': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter data based on search criteria
  const filteredData = insentifData.filter(item => {
    const matchesSearch = item.namaPegawai.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.periode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.jumlahInsentif.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            List Insentif
          </h1>

          {/* Controls Section */}
          <div className="flex items-center justify-between mb-6">
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
                placeholder="Search..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
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
                    onClick={() => handleSort('namaPegawai')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama Pegawai</span>
                      {sortField === 'namaPegawai' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('periode')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Periode</span>
                      {sortField === 'periode' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('jumlahInsentif')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Jumlah Insentif</span>
                      {sortField === 'jumlahInsentif' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('statusPembayaran')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status Pembayaran</span>
                      {sortField === 'statusPembayaran' && (
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
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.namaPegawai}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.periode}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.jumlahInsentif}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.statusPembayaran)}`}>
                        {item.statusPembayaran}
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
        itemName={itemToDelete?.namaPegawai}
      />
    </div>
  );
};

export default HRDMarketingDashboard;
