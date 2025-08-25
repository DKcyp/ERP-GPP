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
  ThumbsUp,
  Calendar,
  Clock,
  Info,
  ChevronLeft,
  ChevronRight,
  ArrowUp
} from 'lucide-react';

interface PBGData {
  id: string;
  no: number;
  noPBG: string;
  noSO: string;
  soTurunan: string;
  noPR: string;
  namaPengaju: string;
  approveByPM: 'Approved' | 'Pending' | 'Rejected';
}

const PBGDashboard: React.FC = () => {
  const [searchNoPBG, setSearchNoPBG] = useState('');
  const [searchNoSO, setSearchNoSO] = useState('');
  const [searchSOTurunan, setSearchSOTurunan] = useState('');
  const [dateFrom, setDateFrom] = useState('03/03/2025');
  const [dateTo, setDateTo] = useState('03/03/2025');
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PBGData | null>(null);
  const [sortField, setSortField] = useState<keyof PBGData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sample data matching the image
  const [pbgData, setPbgData] = useState<PBGData[]>([
    {
      id: '1',
      no: 1,
      noPBG: 'PBG001',
      noSO: 'SO001',
      soTurunan: 'SO001.1',
      noPR: 'PR001',
      namaPengaju: 'John Doe',
      approveByPM: 'Approved'
    },
    {
      id: '2',
      no: 2,
      noPBG: 'PBG002',
      noSO: 'SO002',
      soTurunan: 'SO002.2',
      noPR: 'PR002',
      namaPengaju: 'John Doe',
      approveByPM: 'Approved'
    },
    {
      id: '3',
      no: 3,
      noPBG: 'PBG003',
      noSO: 'SO003',
      soTurunan: 'SO003.3',
      noPR: '-',
      namaPengaju: 'John Doe',
      approveByPM: 'Approved'
    },
    {
      id: '4',
      no: 4,
      noPBG: 'PBG004',
      noSO: 'SO004',
      soTurunan: 'SO004.4',
      noPR: 'PR004',
      namaPengaju: 'John Doe',
      approveByPM: 'Approved'
    },
    {
      id: '5',
      no: 5,
      noPBG: 'PBG005',
      noSO: 'SO005',
      soTurunan: 'SO005.5',
      noPR: '-',
      namaPengaju: 'John Doe',
      approveByPM: 'Approved'
    }
  ]);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleSort = (field: keyof PBGData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getApprovalColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-600 text-white';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter data based on search criteria
  const filteredData = pbgData.filter(item => {
    const matchesNoPBG = item.noPBG.toLowerCase().includes(searchNoPBG.toLowerCase());
    const matchesNoSO = item.noSO.toLowerCase().includes(searchNoSO.toLowerCase());
    const matchesSOTurunan = item.soTurunan.toLowerCase().includes(searchSOTurunan.toLowerCase());
    
    return matchesNoPBG && matchesNoSO && matchesSOTurunan;
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

  const handleDeleteClick = (pbg: PBGData) => {
    setItemToDelete(pbg);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setPbgData(prev => prev.filter(p => p.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Pengajuan Barang Gudang
          </h1>

          {/* Search and Filter Section */}
          <div className="space-y-4 mb-6">
            {/* Search Inputs Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Search No PBG */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari No PBG
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchNoPBG}
                    onChange={(e) => setSearchNoPBG(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="PBG001"
                  />
                  <button 
                    onClick={handleSearch}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Search No SO */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari No SO
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchNoSO}
                    onChange={(e) => setSearchNoSO(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="SO023"
                  />
                  <button 
                    onClick={handleSearch}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Search SO Turunan */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari SO Turunan
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchSOTurunan}
                    onChange={(e) => setSearchSOTurunan(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="SO001.1"
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
                    onClick={() => handleSort('noPBG')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No PBG</span>
                      {sortField === 'noPBG' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('noSO')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No SO</span>
                      {sortField === 'noSO' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('soTurunan')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>SO Turunan</span>
                      {sortField === 'soTurunan' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('noPR')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No PR</span>
                      {sortField === 'noPR' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('namaPengaju')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama Pengaju</span>
                      {sortField === 'namaPengaju' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('approveByPM')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Approve By PM</span>
                      {sortField === 'approveByPM' && (
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
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.noPBG}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.noSO}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.soTurunan}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.noPR}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.namaPengaju}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getApprovalColor(item.approveByPM)}`}>
                        {item.approveByPM}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <button 
                          className="p-2 text-cyan-500 hover:bg-cyan-50 rounded transition-all duration-200 hover:scale-110"
                          title="Approve"
                        >
                          <ThumbsUp className="h-4 w-4" />
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

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.noPBG}
      />
    </div>
  );
};

export default PBGDashboard;
