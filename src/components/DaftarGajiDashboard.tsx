import React, { useState, useEffect } from 'react';
import GajiModal, { GajiFormData } from './GajiModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { GajiData } from '../types';
import { 
  Search, 
  Plus, 
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUp
} from 'lucide-react';

const DaftarGajiDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GajiData | null>(null);
  const [sortField, setSortField] = useState<keyof GajiData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sample data matching the image
  const [gajiData, setGajiData] = useState<GajiData[]>([
    {
      id: '1',
      no: 1,
      namaPegawai: 'Ahmad Fauzi',
      gajiPokok: 'Rp 5.000.000',
      tunjangan: 'Rp 1.000.000',
      pph21: 'Rp 250.000',
      potonganMess: 'Rp 100.000',
      gajiBersih: 'Rp 5.650.000'
    },
    {
      id: '2',
      no: 2,
      namaPegawai: 'Siti Nurhaliza',
      gajiPokok: 'Rp 4.500.000',
      tunjangan: 'Rp 800.000',
      pph21: 'Rp 200.000',
      potonganMess: 'Rp 150.000',
      gajiBersih: 'Rp 4.950.000'
    },
    {
      id: '3',
      no: 3,
      namaPegawai: 'Budi Santoso',
      gajiPokok: 'Rp 6.200.000',
      tunjangan: 'Rp 1.200.000',
      pph21: 'Rp 300.000',
      potonganMess: 'Rp 120.000',
      gajiBersih: 'Rp 6.980.000'
    }
  ]);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleAddGaji = (formData: GajiFormData) => {
    const newGaji: GajiData = {
      id: (gajiData.length + 1).toString(),
      no: gajiData.length + 1,
      namaPegawai: formData.namaPegawai,
      gajiPokok: formData.gajiPokok,
      tunjangan: formData.tunjangan,
      pph21: formData.pph21,
      potonganMess: formData.potonganMess,
      gajiBersih: formData.gajiBersih
    };

    setGajiData(prev => [newGaji, ...prev.map(g => ({ ...g, no: g.no + 1 }))]);
  };

  const handleSort = (field: keyof GajiData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteClick = (gaji: GajiData) => {
    setItemToDelete(gaji);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setGajiData(prev => prev.filter(g => g.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  // Filter data based on search criteria
  const filteredData = gajiData.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.namaPegawai.toLowerCase().includes(searchLower) ||
      item.gajiPokok.toLowerCase().includes(searchLower) ||
      item.tunjangan.toLowerCase().includes(searchLower) ||
      item.gajiBersih.toLowerCase().includes(searchLower)
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
              Daftar Gaji
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
                    onClick={() => handleSort('gajiPokok')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Gaji Pokok</span>
                      {sortField === 'gajiPokok' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('tunjangan')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Tunjangan</span>
                      {sortField === 'tunjangan' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('pph21')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>PPH 21</span>
                      {sortField === 'pph21' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('potonganMess')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Potongan Mess</span>
                      {sortField === 'potonganMess' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('gajiBersih')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Gaji Bersih</span>
                      {sortField === 'gajiBersih' && (
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
                    <td className="px-4 py-3 text-sm text-gray-900">{item.gajiPokok}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.tunjangan}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.pph21}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.potonganMess}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.gajiBersih}</td>
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

      {/* Gaji Modal */}
      <GajiModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddGaji}
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

export default DaftarGajiDashboard;
