import React, { useState, useEffect } from 'react';
import EntryPenilaianModal, { EntryPenilaianFormData } from './EntryPenilaianModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { 
  Search, 
  Plus, 
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUp
} from 'lucide-react';

interface PenilaianData {
  id: string;
  no: number;
  namaPegawai: string;
  jabatan: string;
  kpi: string;
  kbi: string;
  agility: string;
  nineBox: string;
  statusEvaluasi: 'Selesai' | 'Dalam Proses' | 'Belum Selesai';
}

const DaftarPenilaianDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PenilaianData | null>(null);
  const [sortField, setSortField] = useState<keyof PenilaianData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sample data matching the image
  const [penilaianData, setPenilaianData] = useState<PenilaianData[]>([
    {
      id: '1',
      no: 1,
      namaPegawai: 'Rosiyati',
      jabatan: 'Staff AP',
      kpi: '73%',
      kbi: '79',
      agility: '76',
      nineBox: 'Marginal Contribution',
      statusEvaluasi: 'Selesai'
    },
    {
      id: '2',
      no: 2,
      namaPegawai: 'Budi Santoso',
      jabatan: 'Supervisor',
      kpi: '85%',
      kbi: '88',
      agility: '82',
      nineBox: 'High Potential',
      statusEvaluasi: 'Dalam Proses'
    },
    {
      id: '3',
      no: 3,
      namaPegawai: 'Indah Permata',
      jabatan: 'Manager',
      kpi: '92%',
      kbi: '90',
      agility: '89',
      nineBox: 'Star Performer',
      statusEvaluasi: 'Selesai'
    },
    {
      id: '4',
      no: 4,
      namaPegawai: 'Joko Widodo',
      jabatan: 'Senior Engineer',
      kpi: '78%',
      kbi: '80',
      agility: '77',
      nineBox: 'Core Player',
      statusEvaluasi: 'Belum Selesai'
    }
  ]);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleAddPenilaian = (formData: EntryPenilaianFormData) => {
    const newPenilaian: PenilaianData = {
      id: (penilaianData.length + 1).toString(),
      no: penilaianData.length + 1,
      namaPegawai: formData.namaPegawai,
      jabatan: formData.jabatanPegawai,
      kpi: '85%', // Default value
      kbi: '80', // Default value
      agility: '78', // Default value
      nineBox: 'High Potential', // Default value
      statusEvaluasi: 'Dalam Proses'
    };

    setPenilaianData(prev => [newPenilaian, ...prev.map(p => ({ ...p, no: p.no + 1 }))]);
  };

  const handleSort = (field: keyof PenilaianData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteClick = (penilaian: PenilaianData) => {
    setItemToDelete(penilaian);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setPenilaianData(prev => prev.filter(p => p.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const getStatusEvaluasiColor = (status: string) => {
    switch (status) {
      case 'Selesai': return 'bg-green-600 text-white';
      case 'Dalam Proses': return 'bg-yellow-500 text-white';
      case 'Belum Selesai': return 'bg-red-600 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter data based on search criteria
  const filteredData = penilaianData.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.namaPegawai.toLowerCase().includes(searchLower) ||
      item.jabatan.toLowerCase().includes(searchLower) ||
      item.nineBox.toLowerCase().includes(searchLower)
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
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Daftar Penilaian
          </h1>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Daftar Kontrak Kerja
            </h2>
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
                    onClick={() => handleSort('jabatan')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Jabatan</span>
                      {sortField === 'jabatan' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('kpi')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>KPI</span>
                      {sortField === 'kpi' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('kbi')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>KBI</span>
                      {sortField === 'kbi' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('agility')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Agility</span>
                      {sortField === 'agility' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('nineBox')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nine Box</span>
                      {sortField === 'nineBox' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('statusEvaluasi')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status Evaluasi</span>
                      {sortField === 'statusEvaluasi' && (
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
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.namaPegawai}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.jabatan}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.kpi}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.kbi}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.agility}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.nineBox}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium ${getStatusEvaluasiColor(item.statusEvaluasi)}`}>
                        {item.statusEvaluasi}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <button 
                          className="p-2 bg-blue-600 text-white rounded transition-all duration-200 hover:scale-110 hover:bg-blue-700"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
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

      {/* Entry Penilaian Modal */}
      <EntryPenilaianModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddPenilaian}
      />

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

export default DaftarPenilaianDashboard;
