import React, { useState, useEffect } from 'react';
import TrainingExpired from './TrainingExpired';
import TrainingNotHeld from './TrainingNotHeld';
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
  ChevronDown
} from 'lucide-react';

interface TrainingData {
  id: string;
  no: number;
  noTraining: string;
  noSO: string;
  noPR: string; // new PR number
  soTurunan: string;
  namaProyek: string;
  jenisTraining: 'New Training' | 'Re-Training';
  tanggalPelatihan: string;
  tanggalExpired: string;
  pidStartDate?: string; // new
  pidEndDate?: string;   // new
  statusDokumen: 'Open' | 'Closed';
  statusPembayaran: 'Paid' | 'Unpaid';
}

const TrainingDashboard: React.FC = () => {
  const [searchNoTraining, setSearchNoTraining] = useState('');
  const [searchSO, setSearchSO] = useState('');
  const [searchSOTurunan, setSearchSOTurunan] = useState('');
  const [searchNamaProject, setSearchNamaProject] = useState('');
  const [selectedJenisTraining, setSelectedJenisTraining] = useState('');
  const [selectedStatusDokumen, setSelectedStatusDokumen] = useState('');
  const [selectedStatusPembayaran, setSelectedStatusPembayaran] = useState('');
  const [selectedStatusApproval, setSelectedStatusApproval] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [jenisTrainingDropdownOpen, setJenisTrainingDropdownOpen] = useState(false);
  const [statusDokumenDropdownOpen, setStatusDokumenDropdownOpen] = useState(false);
  const [statusPembayaranDropdownOpen, setStatusPembayaranDropdownOpen] = useState(false);
  const [statusApprovalDropdownOpen, setStatusApprovalDropdownOpen] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TrainingData | null>(null);
  const [sortField, setSortField] = useState<keyof TrainingData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sample data matching the image
  const [trainingData, setTrainingData] = useState<TrainingData[]>([
    {
      id: '1',
      no: 1,
      noTraining: 'TRNG001',
      noSO: 'SO001',
      noPR: 'PR-001',
      soTurunan: 'SO001.12',
      namaProyek: 'Project A',
      jenisTraining: 'New Training',
      tanggalPelatihan: '12-01-2025 - 16-01-2025',
      tanggalExpired: '01-08-2025',
      pidStartDate: '05-08-2025',
      pidEndDate: '10-08-2025',
      statusDokumen: 'Open',
      statusPembayaran: 'Paid'
    },
    {
      id: '2',
      no: 2,
      noTraining: 'TRNG002',
      noSO: 'SO002',
      noPR: 'PR-002',
      soTurunan: 'SO002.2',
      namaProyek: 'Project B',
      jenisTraining: 'Re-Training',
      tanggalPelatihan: '15-03-2025 - 19-03-2025',
      tanggalExpired: '15-09-2025',
      pidStartDate: '20-09-2025',
      pidEndDate: '25-09-2025',
      statusDokumen: 'Closed',
      statusPembayaran: 'Unpaid'
    },
    {
      id: '3',
      no: 3,
      noTraining: 'TRNG003',
      noSO: 'SO003',
      noPR: 'PR-003',
      soTurunan: 'SO003.34',
      namaProyek: 'Project C',
      jenisTraining: 'New Training',
      tanggalPelatihan: '10-05-2025 - 14-05-2025',
      tanggalExpired: '10-11-2025',
      pidStartDate: '15-11-2025',
      pidEndDate: '20-11-2025',
      statusDokumen: 'Open',
      statusPembayaran: 'Unpaid'
    },
    {
      id: '4',
      no: 4,
      noTraining: 'TRNG004',
      noSO: 'SO004',
      noPR: 'PR-004',
      soTurunan: 'SO004.25',
      namaProyek: 'Project D',
      jenisTraining: 'Re-Training',
      tanggalPelatihan: '20-06-2025 - 24-06-2025',
      tanggalExpired: '20-12-2025',
      pidStartDate: '22-12-2025',
      pidEndDate: '26-12-2025',
      statusDokumen: 'Closed',
      statusPembayaran: 'Paid'
    },
    {
      id: '5',
      no: 5,
      noTraining: 'TRNG005',
      noSO: 'SO005',
      noPR: 'PR-005',
      soTurunan: 'SO005.12',
      namaProyek: 'Project E',
      jenisTraining: 'New Training',
      tanggalPelatihan: '05-07-2025 - 09-07-2025',
      tanggalExpired: '05-01-2026',
      pidStartDate: '10-01-2026',
      pidEndDate: '15-01-2026',
      statusDokumen: 'Open',
      statusPembayaran: 'Paid'
    }
  ]);

  const jenisTrainingOptions = ['New Training', 'Re-Training'];
  const statusDokumenOptions = ['Open', 'Closed'];
  const statusPembayaranOptions = ['Paid', 'Unpaid'];
  const statusApprovalOptions = ['Approved', 'Rejected', 'Pending'];

  useEffect(() => {
    // Trigger animation on component mount
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleDeleteClick = (training: TrainingData) => {
    setItemToDelete(training);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setTrainingData(prev => prev.filter(t => t.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const handleSort = (field: keyof TrainingData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusDokumenColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-green-600 text-white';
      case 'Closed': return 'bg-red-600 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusPembayaranColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-blue-600 text-white';
      case 'Unpaid': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter data based on search criteria
  const filteredData = trainingData.filter(item => {
    const matchesNoTraining = item.noTraining.toLowerCase().includes(searchNoTraining.toLowerCase());
    const matchesSO = item.noSO.toLowerCase().includes(searchSO.toLowerCase());
    const matchesSOTurunan = item.soTurunan.toLowerCase().includes(searchSOTurunan.toLowerCase());
    const matchesNamaProject = item.namaProyek.toLowerCase().includes(searchNamaProject.toLowerCase());
    const matchesJenisTraining = selectedJenisTraining ? item.jenisTraining === selectedJenisTraining : true;
    const matchesStatusDokumen = selectedStatusDokumen ? item.statusDokumen === selectedStatusDokumen : true;
    const matchesStatusPembayaran = selectedStatusPembayaran ? item.statusPembayaran === selectedStatusPembayaran : true;
    
    return matchesNoTraining && matchesSO && matchesSOTurunan && matchesNamaProject && 
           matchesJenisTraining && matchesStatusDokumen && matchesStatusPembayaran;
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

  // Calculate pie chart data
  const approvedCount = trainingData.filter(item => item.statusDokumen === 'Open').length;
  const rejectedCount = trainingData.filter(item => item.statusDokumen === 'Closed').length;
  const total = trainingData.length;
  const approvedPercentage = total > 0 ? (approvedCount / total) * 100 : 0;
  const rejectedPercentage = total > 0 ? (rejectedCount / total) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Dashboard Training
          </h1>

          {/* Search and Filter Section */}
          <div className="space-y-4 mb-6">
            {/* First Row - Search Inputs */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Search No Training */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari No Training
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchNoTraining}
                    onChange={(e) => setSearchNoTraining(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="TRNG001"
                  />
                  <button 
                    onClick={handleSearch}
                    className="px-3 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Search SO */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari SO
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchSO}
                    onChange={(e) => setSearchSO(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="SO001"
                  />
                  <button 
                    onClick={handleSearch}
                    className="px-3 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
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
                    placeholder="SO001.12"
                  />
                  <button 
                    onClick={handleSearch}
                    className="px-3 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Search Nama Project */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Nama Project
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchNamaProject}
                    onChange={(e) => setSearchNamaProject(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="Proyek Medco"
                  />
                  <button 
                    onClick={handleSearch}
                    className="px-3 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Second Row - Dropdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Jenis Training Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Pilih Jenis Training
                </label>
                <div className="relative">
                  <button
                    onClick={() => setJenisTrainingDropdownOpen(!jenisTrainingDropdownOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white text-sm"
                  >
                    <span className={selectedJenisTraining ? 'text-gray-900' : 'text-gray-500'}>
                      {selectedJenisTraining || '--Pilih Jenis Training--'}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${jenisTrainingDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {jenisTrainingDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 overflow-hidden">
                      <button
                        onClick={() => {
                          setSelectedJenisTraining('');
                          setJenisTrainingDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-gray-500 text-sm"
                      >
                        --Pilih Jenis Training--
                      </button>
                      {jenisTrainingOptions.map((jenis) => (
                        <button
                          key={jenis}
                          onClick={() => {
                            setSelectedJenisTraining(jenis);
                            setJenisTrainingDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm"
                        >
                          {jenis}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Dokumen Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Pilih Status Dokumen
                </label>
                <div className="relative">
                  <button
                    onClick={() => setStatusDokumenDropdownOpen(!statusDokumenDropdownOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white text-sm"
                  >
                    <span className={selectedStatusDokumen ? 'text-gray-900' : 'text-gray-500'}>
                      {selectedStatusDokumen || '--Pilih Status Dokumen--'}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${statusDokumenDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {statusDokumenDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 overflow-hidden">
                      <button
                        onClick={() => {
                          setSelectedStatusDokumen('');
                          setStatusDokumenDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-gray-500 text-sm"
                      >
                        --Pilih Status Dokumen--
                      </button>
                      {statusDokumenOptions.map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setSelectedStatusDokumen(status);
                            setStatusDokumenDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Pembayaran Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Pilih Status Pembayaran
                </label>
                <div className="relative">
                  <button
                    onClick={() => setStatusPembayaranDropdownOpen(!statusPembayaranDropdownOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white text-sm"
                  >
                    <span className={selectedStatusPembayaran ? 'text-gray-900' : 'text-gray-500'}>
                      {selectedStatusPembayaran || '--Pilih Status Pembayaran--'}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${statusPembayaranDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {statusPembayaranDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 overflow-hidden">
                      <button
                        onClick={() => {
                          setSelectedStatusPembayaran('');
                          setStatusPembayaranDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-gray-500 text-sm"
                      >
                        --Pilih Status Pembayaran--
                      </button>
                      {statusPembayaranOptions.map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setSelectedStatusPembayaran(status);
                            setStatusPembayaranDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Approval Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Pilih Status Approval
                </label>
                <div className="relative">
                  <button
                    onClick={() => setStatusApprovalDropdownOpen(!statusApprovalDropdownOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white text-sm"
                  >
                    <span className={selectedStatusApproval ? 'text-gray-900' : 'text-gray-500'}>
                      {selectedStatusApproval || '--Pilih Status Approval--'}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${statusApprovalDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {statusApprovalDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 overflow-hidden">
                      <button
                        onClick={() => {
                          setSelectedStatusApproval('');
                          setStatusApprovalDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-gray-500 text-sm"
                      >
                        --Pilih Status Approval--
                      </button>
                      {statusApprovalOptions.map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setSelectedStatusApproval(status);
                            setStatusApprovalDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Third Row - Date Range and Search Button */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Periode */}
              <div className="space-y-2 lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Periode
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="03/03/2025"
                  />
                  <span className="text-sm text-gray-500">s.d</span>
                  <input
                    type="date"
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
                  <Search className="h-4 w-4" />
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

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Data Table */}
          <div className="lg:col-span-3 space-y-6">
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
                        onClick={() => handleSort('noTraining')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>No Training</span>
                          {sortField === 'noTraining' && (
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
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">No PR</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">SO Turunan</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nama Proyek</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Jenis Training</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tanggal Pelatihan</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tanggal Expired</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">PID Start Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">PID End Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status Dokumen</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status Pembayaran</th>
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
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.noTraining}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.noSO}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.noPR}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.soTurunan}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.namaProyek}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.jenisTraining}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.tanggalPelatihan}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.tanggalExpired}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.pidStartDate || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.pidEndDate || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusDokumenColor(item.statusDokumen)}`}>
                            {item.statusDokumen}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusPembayaranColor(item.statusPembayaran)}`}>
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
                    
                    <div className="flex items-center space-x-1">
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
                    </div>
                    
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

          {/* Right Column - Pie Chart */}
          <div className="lg:col-span-1">
            <div className="mt-[1.7rem] bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                Presentase Pengajuan Training
              </h3>
              
              {/* Pie Chart */}
              <div className="relative w-64 h-64 mx-auto mb-4">
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                  />
                  
                  {/* Approved segment (green) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="40"
                    strokeDasharray={`${(approvedPercentage / 100) * 502.65} 502.65`}
                    strokeDashoffset="0"
                    className="transition-all duration-1000 ease-out"
                  />
                  
                  {/* Rejected segment (red) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="40"
                    strokeDasharray={`${(rejectedPercentage / 100) * 502.65} 502.65`}
                    strokeDashoffset={`-${(approvedPercentage / 100) * 502.65}`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {approvedPercentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Approved</div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Approved</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{approvedPercentage.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Rejected</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{rejectedPercentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Additional Training Views */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
  {/* Training Expired Section */}
  <TrainingExpired />
  
  {/* Training Not Held Section */}
  <TrainingNotHeld />
</div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>2023 © Mazer</p>
          <p className="mt-1">
            Crafted with <span className="text-red-500">♥</span> by <span className="text-blue-600">Saugi</span>
          </p>
        </div>
      </div>

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

export default TrainingDashboard;
