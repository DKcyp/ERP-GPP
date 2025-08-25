import React, { useState, useEffect } from 'react';
import PegawaiModal, { PegawaiFormData } from './PegawaiModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { PegawaiData } from '../types';
import { 
  Search, 
  Plus, 
  FileSpreadsheet, 
  FileText, 
  File,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUp
} from 'lucide-react';

const DaftarPegawaiDashboard: React.FC = () => {
  const [searchNamaNIK, setSearchNamaNIK] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PegawaiData | null>(null);
  const [sortField, setSortField] = useState<keyof PegawaiData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sample data matching the image
  const [pegawaiData, setPegawaiData] = useState<PegawaiData[]>([
    {
      id: '1',
      no: 1,
      namaNIK: '3201011234567890',
      nama: 'Ahmad Fauzi',
      wilayah: 'Jakarta',
      jenisGaji: 'Bulanan',
      jenisKontrak: 'Tetap',
      gajiPokok: 'Rp 7.500.000'
    },
    {
      id: '2',
      no: 2,
      namaNIK: '3201029876543210',
      nama: 'Budi Santoso',
      wilayah: 'Bandung',
      jenisGaji: 'Harian',
      jenisKontrak: 'Freelancer',
      gajiPokok: 'Rp 300.000'
    },
    {
      id: '3',
      no: 3,
      namaNIK: '3201031231231231',
      nama: 'Rina Setiawati',
      wilayah: 'Surabaya',
      jenisGaji: 'Bulanan',
      jenisKontrak: 'Tetap',
      gajiPokok: 'Rp 6.800.000'
    },
    {
      id: '4',
      no: 4,
      namaNIK: '3201047897897890',
      nama: 'Wahyudi Hidayat',
      wilayah: 'Yogyakarta',
      jenisGaji: 'Proyek',
      jenisKontrak: 'Freelancer',
      gajiPokok: 'Rp 10.000.000'
    },
    {
      id: '5',
      no: 5,
      namaNIK: '3201054564564567',
      nama: 'Siti Aminah',
      wilayah: 'Semarang',
      jenisGaji: 'Bulanan',
      jenisKontrak: 'Tetap',
      gajiPokok: 'Rp 7.000.000'
    }
  ]);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleAddPegawai = (formData: PegawaiFormData) => {
    const newPegawai: PegawaiData = {
      id: (pegawaiData.length + 1).toString(),
      no: pegawaiData.length + 1,
      namaNIK: formData.noKTP,
      nama: formData.namaPegawai,
      wilayah: formData.wilayahKerja,
      jenisGaji: formData.jenisGaji,
      jenisKontrak: formData.jenisKontrak,
      gajiPokok: formData.gajiPokok
    };

    setPegawaiData(prev => [newPegawai, ...prev.map(p => ({ ...p, no: p.no + 1 }))]);
  };

  const handleSort = (field: keyof PegawaiData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteClick = (pegawai: PegawaiData) => {
    setItemToDelete(pegawai);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setPegawaiData(prev => prev.filter(p => p.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const getJenisKontrakColor = (jenis: string) => {
    switch (jenis) {
      case 'Tetap': return 'bg-green-600 text-white';
      case 'Freelancer': return 'bg-blue-600 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter data based on search criteria
  const filteredData = pegawaiData.filter(item => {
    const matchesNamaNIK = item.namaNIK.toLowerCase().includes(searchNamaNIK.toLowerCase());
    const matchesSearch = searchQuery === '' || 
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.wilayah.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jenisGaji.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesNamaNIK && matchesSearch;
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
              Pegawai
            </h1>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Daftar Pegawai
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
                    onClick={() => handleSort('namaNIK')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama NIK</span>
                      {sortField === 'namaNIK' && (
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
                    onClick={() => handleSort('wilayah')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Wilayah</span>
                      {sortField === 'wilayah' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('jenisGaji')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Jenis Gaji</span>
                      {sortField === 'jenisGaji' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('jenisKontrak')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Jenis Kontrak</span>
                      {sortField === 'jenisKontrak' && (
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
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.namaNIK}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.nama}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.wilayah}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.jenisGaji}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getJenisKontrakColor(item.jenisKontrak)}`}>
                        {item.jenisKontrak}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.gajiPokok}</td>
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

      {/* Pegawai Modal */}
      <PegawaiModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddPegawai}
      />

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

export default DaftarPegawaiDashboard;
