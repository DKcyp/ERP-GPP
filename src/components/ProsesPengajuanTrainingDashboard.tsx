import React, { useState, useEffect } from 'react';
import ProsesPengajuanTrainingModal from './ProsesPengajuanTrainingModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { ProsesPengajuanTrainingFormData } from '../types'; // Import the new FormData type
import {
  Search,
  Plus,
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
  CheckCircle // Import CheckCircle icon
} from 'lucide-react';

// Updated interface for the dashboard's training data
interface ProsesPengajuanTraining {
  id: string;
  no: number;
  noTraining: string;
  noSO: string;
  soTurunan: string;
  karyawan: string; // From new modal
  jenisTraining: 'New Training' | 'Re-Training';
  tanggalPelatihan: string; // Combined start - end
  budget: string; // From new modal
  keterangan: string; // From new modal
  // Removed: namaProyek, tanggalExpired, statusDokumen, statusPembayaran, statusApproval
}

interface ProsesPengajuanTrainingDashboardProps {
  role?: string; // Add role prop
}

const ProsesPengajuanTrainingDashboard: React.FC<ProsesPengajuanTrainingDashboardProps> = ({ role }) => {
  const [searchNoTraining, setSearchNoTraining] = useState('');
  const [searchSO, setSearchSO] = useState('');
  const [searchSOTurunan, setSearchSOTurunan] = useState('');
  const [searchKaryawan, setSearchKaryawan] = useState(''); // New search field
  const [selectedJenisTraining, setSelectedJenisTraining] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [jenisTrainingDropdownOpen, setJenisTrainingDropdownOpen] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ProsesPengajuanTraining | null>(null);
  const [sortField, setSortField] = useState<keyof ProsesPengajuanTraining | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sample data matching the new structure
  const [trainingData, setTrainingData] = useState<ProesPengajuanTraining[]>([
    {
      id: '1',
      no: 1,
      noTraining: 'TRNG001',
      noSO: 'SO001',
      soTurunan: 'SO001.12',
      karyawan: 'Budi Santoso',
      jenisTraining: 'New Training',
      tanggalPelatihan: '12-01-2025 - 16-01-2025',
      budget: 'Rp 10.000.000',
      keterangan: 'Pelatihan dasar untuk karyawan baru di Project A.',
    },
    {
      id: '2',
      no: 2,
      noTraining: 'TRNG002',
      noSO: 'SO002',
      soTurunan: 'SO002.2',
      karyawan: 'Ani Wijaya',
      jenisTraining: 'Re-Training',
      tanggalPelatihan: '15-03-2025 - 19-03-2025',
      budget: 'Rp 7.500.000',
      keterangan: 'Re-training keselamatan kerja untuk Project B.',
    },
    {
      id: '3',
      no: 3,
      noTraining: 'TRNG003',
      noSO: 'SO003',
      soTurunan: 'SO003.34',
      karyawan: 'Citra Dewi',
      jenisTraining: 'New Training',
      tanggalPelatihan: '10-05-2025 - 14-05-2025',
      budget: 'Rp 12.000.000',
      keterangan: 'Pelatihan manajemen proyek untuk Project C.',
    },
    {
      id: '4',
      no: 4,
      noTraining: 'TRNG004',
      noSO: 'SO004',
      soTurunan: 'SO004.25',
      karyawan: 'Dedi Kurniawan',
      jenisTraining: 'Re-Training',
      tanggalPelatihan: '20-06-2025 - 24-06-2025',
      budget: 'Rp 8.000.000',
      keterangan: 'Re-training teknis untuk Project D.',
    },
  ]);

  const jenisTrainingOptions = ['New Training', 'Re-Training'];

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  // Add this useEffect to log the role
  useEffect(() => {
    console.log('Current role in ProsesPengajuanTrainingDashboard:', role);
  }, [role]); // Re-run when role changes

  const handleAddTraining = (formData: ProsesPengajuanTrainingFormData) => {
    const newTraining: ProsesPengajuanTraining = {
      id: (trainingData.length + 1).toString(),
      no: trainingData.length + 1,
      noTraining: formData.noTraining,
      noSO: formData.noSO,
      soTurunan: formData.soTurunan,
      karyawan: formData.karyawan,
      jenisTraining: formData.jenisTraining,
      tanggalPelatihan: `${formData.tanggalPelatihanStart} - ${formData.tanggalPelatihanEnd}`,
      budget: formData.budget,
      keterangan: formData.keterangan,
    };

    setTrainingData(prev => [newTraining, ...prev.map(t => ({ ...t, no: t.no + 1 }))]);
  };

  const handleDeleteClick = (training: ProsesPengajuanTraining) => {
    setItemToDelete(training);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setTrainingData(prev => prev.filter(t => t.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const handleSort = (field: keyof ProsesPengajuanTraining) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter data based on search criteria
  const filteredData = trainingData.filter(item => {
    const matchesNoTraining = item.noTraining.toLowerCase().includes(searchNoTraining.toLowerCase());
    const matchesSO = item.noSO.toLowerCase().includes(searchSO.toLowerCase());
    const matchesSOTurunan = item.soTurunan.toLowerCase().includes(searchSOTurunan.toLowerCase());
    const matchesKaryawan = item.karyawan.toLowerCase().includes(searchKaryawan.toLowerCase());
    const matchesJenisTraining = selectedJenisTraining ? item.jenisTraining === selectedJenisTraining : true;

    // Date range filtering (simplified for example, actual implementation might need date parsing)
    const itemStartDate = item.tanggalPelatihan.split(' - ')[0];
    const itemEndDate = item.tanggalPelatihan.split(' - ')[1];
    const matchesDateRange = (!dateFrom || itemStartDate >= dateFrom) && (!dateTo || itemEndDate <= dateTo);

    return matchesNoTraining && matchesSO && matchesSOTurunan && matchesKaryawan &&
           matchesJenisTraining && matchesDateRange;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    // Fallback for other types or if comparison fails
    return 0;
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Proses Pengajuan Training
            </h1>
            {role !== 'management' && ( // Only show Add button if not management role
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-2 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah</span>
              </button>
            )}
          </div>

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

              {/* Search Karyawan */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Karyawan
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchKaryawan}
                    onChange={(e) => setSearchKaryawan(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="Budi Santoso"
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
                    onClick={() => handleSort('karyawan')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Karyawan</span>
                      {sortField === 'karyawan' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('jenisTraining')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Jenis Training</span>
                      {sortField === 'jenisTraining' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('tanggalPelatihan')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Tanggal Pelatihan</span>
                      {sortField === 'tanggalPelatihan' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('budget')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Budget</span>
                      {sortField === 'budget' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Keterangan</th>
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
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.noTraining}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.noSO}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.soTurunan}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.karyawan}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.jenisTraining}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.tanggalPelatihan}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.budget}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-xs">{item.keterangan}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-1">
                        {role === 'management' ? (
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-all duration-200 hover:scale-110"
                            title="Approve"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => setIsModalOpen(true)} // For editing, will need to pass item data
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-all duration-200 hover:scale-110"
                              title="Edit"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(item)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-all duration-200 hover:scale-110"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
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

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
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

      {/* Training Modal */}
      <ProsesPengajuanTrainingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTraining}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.noTraining}
      />
    </div>
  );
};

export default ProsesPengajuanTrainingDashboard;
