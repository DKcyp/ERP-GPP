import React, { useState, useEffect } from 'react';
import LemburModal, { LemburFormData } from './LemburModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { 
  Search, 
  Plus, 
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUp
} from 'lucide-react';

interface LemburData {
  id: string;
  no: number;
  namaDriver: string;
  tanggalLembur: string;
  jamLembur: string;
  keterangan: string;
}

const LemburDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<LemburData | null>(null);
  const [sortField, setSortField] = useState<keyof LemburData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sample data matching the image
  const [lemburData, setLemburData] = useState<LemburData[]>([
    {
      id: '1',
      no: 1,
      namaDriver: 'Ahmad',
      tanggalLembur: '01-01-2025',
      jamLembur: '2 Jam',
      keterangan: '-'
    },
    {
      id: '2',
      no: 2,
      namaDriver: 'Budi Santoso',
      tanggalLembur: '03-01-2025',
      jamLembur: '3 Jam',
      keterangan: 'Mengantar barang ke luar kota'
    },
    {
      id: '3',
      no: 3,
      namaDriver: 'Slamet Riyadi',
      tanggalLembur: '05-01-2025',
      jamLembur: '4 Jam',
      keterangan: 'Keterlambatan loading'
    },
    {
      id: '4',
      no: 4,
      namaDriver: 'Agus Prasetyo',
      tanggalLembur: '07-01-2025',
      jamLembur: '1.5 Jam',
      keterangan: '-'
    },
    {
      id: '5',
      no: 5,
      namaDriver: 'Rudi Hartono',
      tanggalLembur: '09-01-2025',
      jamLembur: '2.5 Jam',
      keterangan: 'Perjalanan macet'
    },
    {
      id: '6',
      no: 6,
      namaDriver: 'Fauzan Malik',
      tanggalLembur: '10-01-2025',
      jamLembur: '3 Jam',
      keterangan: 'Menggantikan shift rekan'
    },
    {
      id: '7',
      no: 7,
      namaDriver: 'Joko Widodo',
      tanggalLembur: '12-01-2025',
      jamLembur: '2 Jam',
      keterangan: '-'
    },
    {
      id: '8',
      no: 8,
      namaDriver: 'Hariyanto',
      tanggalLembur: '14-01-2025',
      jamLembur: '5 Jam',
      keterangan: 'Perjalanan dinas mendadak'
    }
  ]);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleAddLembur = (formData: LemburFormData) => {
    const newLembur: LemburData = {
      id: (lemburData.length + 1).toString(),
      no: lemburData.length + 1,
      namaDriver: formData.namaDriver,
      tanggalLembur: new Date(formData.tanggal).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      jamLembur: formData.jamLembur,
      keterangan: formData.keterangan || '-'
    };

    setLemburData(prev => [newLembur, ...prev.map(l => ({ ...l, no: l.no + 1 }))]);
  };

  const handleSort = (field: keyof LemburData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteClick = (lembur: LemburData) => {
    setItemToDelete(lembur);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setLemburData(prev => prev.filter(l => l.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  // Filter data based on search criteria
  const filteredData = lemburData.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.namaDriver.toLowerCase().includes(searchLower) ||
      item.tanggalLembur.toLowerCase().includes(searchLower) ||
      item.jamLembur.toLowerCase().includes(searchLower) ||
      item.keterangan.toLowerCase().includes(searchLower)
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

  const handleSearch = () => {
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Lembur
            </h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 flex items-center space-x-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah</span>
            </button>
          </div>
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
                    onClick={() => handleSort('namaDriver')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama Driver</span>
                      {sortField === 'namaDriver' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('tanggalLembur')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Tanggal Lembur</span>
                      {sortField === 'tanggalLembur' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('jamLembur')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Jam Lembur</span>
                      {sortField === 'jamLembur' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('keterangan')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Keterangan</span>
                      {sortField === 'keterangan' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Aksi</th>
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
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.namaDriver}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.tanggalLembur}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.jamLembur}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.keterangan}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-1">
                        <button 
                          onClick={() => setIsModalOpen(true)}
                          className="p-1.5 bg-yellow-500 text-white rounded transition-all duration-200 hover:scale-110 hover:bg-yellow-600"
                          title="Edit"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="p-1.5 bg-red-600 text-white rounded transition-all duration-200 hover:scale-110 hover:bg-red-700"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
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

      {/* Lembur Modal */}
      <LemburModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddLembur}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.namaDriver}
      />
    </div>
  );
};

export default LemburDashboard;
