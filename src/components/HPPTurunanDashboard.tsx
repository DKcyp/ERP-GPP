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
  ArrowUp,
  ChevronDown,
  FilePlus // Tambahkan ini
} from 'lucide-react';
import EntryHPPIndukModal from './EntryHPPIndukModal'; // Tambahkan ini

interface HPPTurunan {
  id: string;
  no: number;
  noSO: string;
  noSOTurunan: string;
  namaProyek: string;
  estimasiHPP: string;
  mob: string;
  demob: string;
  status: 'Open' | 'Close' | 'Pending';
}

const HPPTurunanDashboard: React.FC = () => {
  const [searchNoSO, setSearchNoSO] = useState('');
  const [searchNamaProject, setSearchNamaProject] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<HPPTurunan | null>(null);
  const [sortField, setSortField] = useState<keyof HPPTurunan | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showEntryHPPIndukModal, setShowEntryHPPIndukModal] = useState(false); // State baru
  const [selectedHPPForEntry, setSelectedHPPForEntry] = useState<HPPTurunan | null>(null); // State baru

  // Sample data
  const [hppTurunanData, setHppTurunanData] = useState<HPPTurunan[]>([
    {
      id: '1',
      no: 1,
      noSO: 'SO001',
      noSOTurunan: 'SO001.1',
      namaProyek: 'Proyek PHE ONWJ',
      estimasiHPP: 'Rp 150.000.000',
      mob: '01-01-2025',
      demob: '31-01-2025',
      status: 'Open'
    },
    {
      id: '2',
      no: 2,
      noSO: 'SO002',
      noSOTurunan: 'SO002.1',
      namaProyek: 'Proyek MEDCO',
      estimasiHPP: 'Rp 200.000.000',
      mob: '15-01-2025',
      demob: '15-02-2025',
      status: 'Close'
    },
    {
      id: '3',
      no: 3,
      noSO: 'SO003',
      noSOTurunan: 'SO003.1',
      namaProyek: 'Proyek Infrastruktur A',
      estimasiHPP: 'Rp 300.000.000',
      mob: '01-02-2025',
      demob: '28-02-2025',
      status: 'Pending'
    },
    {
      id: '4',
      no: 4,
      noSO: 'SO004',
      noSOTurunan: 'SO004.1',
      namaProyek: 'Proyek Konstruksi B',
      estimasiHPP: 'Rp 250.000.000',
      mob: '10-02-2025',
      demob: '10-03-2025',
      status: 'Open'
    },
    {
      id: '5',
      no: 5,
      noSO: 'SO005',
      noSOTurunan: 'SO005.1',
      namaProyek: 'Proyek Maintenance C',
      estimasiHPP: 'Rp 180.000.000',
      mob: '20-02-2025',
      demob: '20-03-2025',
      status: 'Close'
    }
  ]);

  const statusOptions = ['Open', 'Close', 'Pending'];

  useEffect(() => {
    // Trigger animation on component mount
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleDeleteClick = (hpp: HPPTurunan) => {
    setItemToDelete(hpp);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setHppTurunanData(prev => prev.filter(h => h.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const handleSort = (field: keyof HPPTurunan) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleOpenEntryHPPIndukModal = (hpp: HPPTurunan) => {
    setSelectedHPPForEntry(hpp);
    setShowEntryHPPIndukModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-success/20 text-success border-success/50';
      case 'Close': return 'bg-error/20 text-error border-error/50';
      case 'Pending': return 'bg-warning/20 text-warning border-warning/50';
      default: return 'bg-textSecondary/20 text-textSecondary border-textSecondary/50';
    }
  };

  // Filter data based on search criteria
  const filteredData = hppTurunanData.filter(item => {
    const matchesNoSO = item.noSO.toLowerCase().includes(searchNoSO.toLowerCase());
    const matchesNamaProject = item.namaProyek.toLowerCase().includes(searchNamaProject.toLowerCase());
    const matchesStatus = selectedStatus ? item.status === selectedStatus : true;

    return matchesNoSO && matchesNamaProject && matchesStatus;
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
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-text mb-6">
            HPP Turunan
          </h1>

          {/* Search and Filter Section */}
          <div className="space-y-4 mb-6">
            {/* First Row - Search Inputs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Search No SO */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-textSecondary">
                  Cari No SO
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchNoSO}
                    onChange={(e) => setSearchNoSO(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent text-sm bg-surface text-text"
                    placeholder="SO001"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/80 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Search Nama Project */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-textSecondary">
                  Cari Nama Project
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchNamaProject}
                    onChange={(e) => setSearchNamaProject(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent text-sm bg-surface text-text"
                    placeholder="Proyek Medco"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/80 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Status Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-textSecondary">
                  Pilih Status
                </label>
                <div className="relative">
                  <button
                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200 flex items-center justify-between bg-surface text-sm"
                  >
                    <span className={selectedStatus ? 'text-text' : 'text-textSecondary'}>
                      {selectedStatus || '--Pilih Status--'}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-textSecondary transition-transform duration-200 ${statusDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {statusDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-md shadow-lg z-50 overflow-hidden">
                      <button
                        onClick={() => {
                          setSelectedStatus('');
                          setStatusDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-border transition-colors text-textSecondary text-sm"
                      >
                        --Pilih Status--
                      </button>
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setSelectedStatus(status);
                            setStatusDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-border transition-colors flex items-center space-x-2 text-sm"
                        >
                          <span className={`w-3 h-3 rounded-full ${
                            status === 'Open' ? 'bg-success' :
                            status === 'Close' ? 'bg-error' : 'bg-warning'
                          }`}></span>
                          <span>{status}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Second Row - Date Range and Search Button */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Periode */}
              <div className="space-y-2 lg:col-span-2">
                <label className="block text-sm font-medium text-textSecondary">
                  Periode
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent text-sm bg-surface text-text"
                  />
                  <span className="text-sm text-textSecondary">s.d</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent text-sm bg-surface text-text"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-textSecondary opacity-0">
                  Search
                </label>
                <button
                  onClick={handleSearch}
                  className="w-full px-6 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-md font-medium transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Export Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-textSecondary">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-1 border border-border rounded text-sm focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-textSecondary">entries</span>
          </div>
          <div className="flex space-x-2">
            <button className="bg-success hover:bg-success/80 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="bg-secondary hover:bg-secondary/80 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
              <File className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button className="bg-error hover:bg-error/80 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-surface rounded-lg shadow border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-border border-b border-border">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-textSecondary cursor-pointer hover:bg-border/50 transition-colors"
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
                    className="px-4 py-3 text-left text-sm font-medium text-textSecondary cursor-pointer hover:bg-border/50 transition-colors"
                    onClick={() => handleSort('noSOTurunan')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No SO Turunan</span>
                      {sortField === 'noSOTurunan' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-textSecondary cursor-pointer hover:bg-border/50 transition-colors"
                    onClick={() => handleSort('namaProyek')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama Proyek</span>
                      {sortField === 'namaProyek' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-textSecondary">Estimasi HPP</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-textSecondary">MOB</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-textSecondary">DEMOB</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-textSecondary">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-textSecondary">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-border transition-colors ${
                      index % 2 === 0 ? 'bg-surface' : 'bg-background'
                    } ${animateRows ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`}
                    style={{
                      animationDelay: animateRows ? `${index * 100}ms` : '0ms',
                      animationFillMode: 'forwards'
                    }}
                  >
                    <td className="px-4 py-3 text-sm text-text font-medium">{item.noSO}</td>
                    <td className="px-4 py-3 text-sm text-text">{item.noSOTurunan}</td>
                    <td className="px-4 py-3 text-sm text-text">{item.namaProyek}</td>
                    <td className="px-4 py-3 text-sm text-text font-medium">{item.estimasiHPP}</td>
                    <td className="px-4 py-3 text-sm text-textSecondary">{item.mob}</td>
                    <td className="px-4 py-3 text-sm text-textSecondary">{item.demob}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-1">
                        {/* Tombol baru untuk Entry HPP Induk */}
                        <button
                          onClick={() => handleOpenEntryHPPIndukModal(item)}
                          className="p-1.5 text-primary hover:bg-primary/20 rounded transition-all duration-200 hover:scale-110"
                          title="Entry HPP Induk"
                        >
                          <FilePlus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          className="p-1.5 text-secondary hover:bg-secondary/20 rounded transition-all duration-200 hover:scale-110"
                          title="Edit"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="p-1.5 text-error hover:bg-error/20 rounded transition-all duration-200 hover:scale-110"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          className="p-1.5 text-secondary hover:bg-secondary/20 rounded transition-all duration-200 hover:scale-110"
                          title="View"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-border px-4 py-3 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-sm text-textSecondary">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-textSecondary hover:text-text hover:bg-surface rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                          currentPage === page
                            ? 'bg-secondary text-white'
                            : 'text-textSecondary hover:bg-border/50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm text-textSecondary hover:text-text hover:bg-surface rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        itemName={itemToDelete?.namaProyek}
      />

      {/* Entry HPP Induk Modal */}
      <EntryHPPIndukModal
        isOpen={showEntryHPPIndukModal}
        onClose={() => setShowEntryHPPIndukModal(false)}
        // hppData={selectedHPPForEntry} // Anda bisa meneruskan data jika diperlukan oleh modal
      />
    </div>
  );
};

export default HPPTurunanDashboard;
