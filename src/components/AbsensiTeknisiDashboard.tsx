import React, { useState, useEffect } from 'react';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { AbsensiTeknisiData } from '../types';
import { 
  Search, 
  ChevronLeft,
  ChevronRight,
  ArrowUp
} from 'lucide-react';

const AbsensiTeknisiDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AbsensiTeknisiData | null>(null);
  const [sortField, setSortField] = useState<keyof AbsensiTeknisiData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sample data matching the first image
  const [absensiTeknisiData, setAbsensiTeknisiData] = useState<AbsensiTeknisiData[]>([
    {
      id: '1',
      no: 1,
      namaTeknisi: 'Ahmad',
      tanggalAbsensi: '01-01-2025',
      zonaKerja: 'Zona 1',
      statusAbsensi: 'DL',
      lampiran: 'Rp 1.500.000',
      statusApprove: 'Approved'
    },
    {
      id: '2',
      no: 2,
      namaTeknisi: 'Budi Santoso',
      tanggalAbsensi: '02-01-2025',
      zonaKerja: 'Zona 3',
      statusAbsensi: 'H',
      lampiran: 'Rp 2.000.000',
      statusApprove: 'Process'
    },
    {
      id: '3',
      no: 3,
      namaTeknisi: 'Slamet Riyadi',
      tanggalAbsensi: '03-01-2025',
      zonaKerja: 'Zona 2',
      statusAbsensi: 'CT',
      lampiran: 'Rp 1.750.000',
      statusApprove: 'Rejected'
    },
    {
      id: '4',
      no: 4,
      namaTeknisi: 'Agus Prasetyo',
      tanggalAbsensi: '04-01-2025',
      zonaKerja: 'Zona 1',
      statusAbsensi: 'CP',
      lampiran: 'Rp 1.250.000',
      statusApprove: 'Approved'
    },
    {
      id: '5',
      no: 5,
      namaTeknisi: 'Rudi Hartono',
      tanggalAbsensi: '05-01-2025',
      zonaKerja: 'Zona 3',
      statusAbsensi: 'TM',
      lampiran: 'Rp 1.800.000',
      statusApprove: 'Process'
    },
    {
      id: '6',
      no: 6,
      namaTeknisi: 'Fauzan Malik',
      tanggalAbsensi: '06-01-2025',
      zonaKerja: 'Zona 2',
      statusAbsensi: 'DL',
      lampiran: 'Rp 1.600.000',
      statusApprove: 'Rejected'
    },
    {
      id: '7',
      no: 7,
      namaTeknisi: 'Joko Widodo',
      tanggalAbsensi: '07-01-2025',
      zonaKerja: 'Zona 1',
      statusAbsensi: 'H',
      lampiran: 'Rp 2.100.000',
      statusApprove: 'Approved'
    },
    {
      id: '8',
      no: 8,
      namaTeknisi: 'Hariyanto',
      tanggalAbsensi: '08-01-2025',
      zonaKerja: 'Zona 3',
      statusAbsensi: 'CT',
      lampiran: 'Rp 1.450.000',
      statusApprove: 'Process'
    }
  ]);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleSort = (field: keyof AbsensiTeknisiData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteClick = (item: AbsensiTeknisiData) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setAbsensiTeknisiData(prev => prev.filter(a => a.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const getStatusAbsensiColor = (status: string) => {
    switch (status) {
      case 'DL': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'H': return 'bg-green-100 text-green-800 border-green-200';
      case 'CT': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CP': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'TM': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusApproveColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-600 text-white';
      case 'Process': return 'bg-yellow-500 text-white';
      case 'Rejected': return 'bg-red-600 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter data based on search criteria
  const filteredData = absensiTeknisiData.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.namaTeknisi.toLowerCase().includes(searchLower) ||
      item.tanggalAbsensi.toLowerCase().includes(searchLower) ||
      item.zonaKerja.toLowerCase().includes(searchLower) ||
      item.statusAbsensi.toLowerCase().includes(searchLower) ||
      item.lampiran.toLowerCase().includes(searchLower)
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
            Absensi Teknisi
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
                    onClick={() => handleSort('namaTeknisi')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama Teknisi</span>
                      {sortField === 'namaTeknisi' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('tanggalAbsensi')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Tanggal Absensi</span>
                      {sortField === 'tanggalAbsensi' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('zonaKerja')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Zona Kerja</span>
                      {sortField === 'zonaKerja' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('statusAbsensi')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status Absensi</span>
                      {sortField === 'statusAbsensi' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('lampiran')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Lampiran</span>
                      {sortField === 'lampiran' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('statusApprove')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status Approve</span>
                      {sortField === 'statusApprove' && (
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
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.namaTeknisi}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.tanggalAbsensi}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.zonaKerja}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusAbsensiColor(item.statusAbsensi)}`}>
                        {item.statusAbsensi}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.lampiran}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusApproveColor(item.statusApprove)}`}>
                        {item.statusApprove}
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
        itemName={itemToDelete?.namaTeknisi}
      />
    </div>
  );
};

export default AbsensiTeknisiDashboard;
