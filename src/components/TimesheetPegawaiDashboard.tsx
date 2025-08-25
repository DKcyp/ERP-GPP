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
  ArrowUp,
  ChevronDown
} from 'lucide-react';

interface TimesheetPegawai {
  id: string;
  no: number;
  kualifikasi: string[];
  tanggalTimesheet: string;
  mob: string;
  demob: string;
  durasiHari: number;
  overtimeJam: number;
  noSO: string;
  noSOTurunan: string;
  lokasi: string;
  zona: string;
  jenisPekerjaan: 'On Call' | 'Tender';
  rate: string;
  pegawai: 'Freelance' | 'Pegawai Tetap';
  status: 'Approved' | 'Pending' | 'Rejected';
}

const TimesheetPegawaiDashboard: React.FC = () => {
  const [searchNoSO, setSearchNoSO] = useState('');
  const [searchKualifikasi, setSearchKualifikasi] = useState('');
  const [searchSOTurunan, setSearchSOTurunan] = useState('');
  const [searchNamaProject, setSearchNamaProject] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TimesheetPegawai | null>(null);
  const [sortField, setSortField] = useState<keyof TimesheetPegawai | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sample data matching the image
  const [timesheetPegawaiData, setTimesheetPegawaiData] = useState<TimesheetPegawai[]>([
    {
      id: '1',
      no: 1,
      kualifikasi: ['Welder', 'Rope Access'],
      tanggalTimesheet: '2024-11-09',
      mob: '2024-11-10',
      demob: '2024-11-15',
      durasiHari: 5,
      overtimeJam: 10,
      noSO: 'SO-001',
      noSOTurunan: 'SO-001.1',
      lokasi: 'Bali',
      zona: 'Zona A',
      jenisPekerjaan: 'On Call',
      rate: '500,000',
      pegawai: 'Freelance',
      status: 'Approved'
    },
    {
      id: '2',
      no: 2,
      kualifikasi: ['Engineer', 'Project Manager'],
      tanggalTimesheet: '2024-11-11',
      mob: '2024-11-12',
      demob: '2024-11-18',
      durasiHari: 6,
      overtimeJam: 8,
      noSO: 'SO-002',
      noSOTurunan: 'SO-001.2',
      lokasi: 'Jakarta',
      zona: 'Zona B',
      jenisPekerjaan: 'Tender',
      rate: '750,000',
      pegawai: 'Pegawai Tetap',
      status: 'Pending'
    },
    {
      id: '3',
      no: 3,
      kualifikasi: ['Safety Officer'],
      tanggalTimesheet: '2024-11-14',
      mob: '2024-11-15',
      demob: '2024-11-20',
      durasiHari: 5,
      overtimeJam: 12,
      noSO: 'SO-003',
      noSOTurunan: 'SO-001.1',
      lokasi: 'Surabaya',
      zona: 'Zona C',
      jenisPekerjaan: 'On Call',
      rate: '600,000',
      pegawai: 'Freelance',
      status: 'Rejected'
    },
    {
      id: '4',
      no: 4,
      kualifikasi: ['Electrical Technician'],
      tanggalTimesheet: '2024-11-17',
      mob: '2024-11-18',
      demob: '2024-11-23',
      durasiHari: 5,
      overtimeJam: 9,
      noSO: 'SO-004',
      noSOTurunan: 'SO-001.2',
      lokasi: 'Bandung',
      zona: 'Zona A',
      jenisPekerjaan: 'Tender',
      rate: '550,000',
      pegawai: 'Pegawai Tetap',
      status: 'Approved'
    },
    {
      id: '5',
      no: 5,
      kualifikasi: ['Mechanical Engineer'],
      tanggalTimesheet: '2024-11-19',
      mob: '2024-11-20',
      demob: '2024-11-25',
      durasiHari: 5,
      overtimeJam: 11,
      noSO: 'SO-005',
      noSOTurunan: 'SO-001.1',
      lokasi: 'Yogyakarta',
      zona: 'Zona B',
      jenisPekerjaan: 'On Call',
      rate: '650,000',
      pegawai: 'Freelance',
      status: 'Pending'
    }
  ]);

  const statusOptions = ['Approved', 'Pending', 'Rejected'];

  useEffect(() => {
    // Trigger animation on component mount
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleDeleteClick = (timesheet: TimesheetPegawai) => {
    setItemToDelete(timesheet);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setTimesheetPegawaiData(prev => prev.filter(t => t.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const handleSort = (field: keyof TimesheetPegawai) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-600 text-white';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getJenisPekerjaanColor = (jenis: string) => {
    switch (jenis) {
      case 'On Call': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'Tender': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPegawaiColor = (pegawai: string) => {
    switch (pegawai) {
      case 'Freelance': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pegawai Tetap': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter data based on search criteria
  const filteredData = timesheetPegawaiData.filter(item => {
    const matchesNoSO = item.noSO.toLowerCase().includes(searchNoSO.toLowerCase());
    const matchesKualifikasi = item.kualifikasi.some(k => k.toLowerCase().includes(searchKualifikasi.toLowerCase()));
    const matchesSOTurunan = item.noSOTurunan.toLowerCase().includes(searchSOTurunan.toLowerCase());
    const matchesStatus = selectedStatus ? item.status === selectedStatus : true;
    
    return matchesNoSO && matchesKualifikasi && matchesSOTurunan && matchesStatus;
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Approval Timesheet Pegawai
          </h1>

          {/* Search and Filter Section */}
          <div className="space-y-4 mb-6">
            {/* First Row - Search Inputs */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
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

              {/* Search Kualifikasi */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Kualifikasi
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchKualifikasi}
                    onChange={(e) => setSearchKualifikasi(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="Welder"
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

            {/* Second Row - Status and Date Range */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Status Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Status
                </label>
                <div className="relative">
                  <button
                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white text-sm"
                  >
                    <span className={selectedStatus ? 'text-gray-900' : 'text-gray-500'}>
                      {selectedStatus || '--Pilih Status--'}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${statusDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {statusDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 overflow-hidden">
                      <button
                        onClick={() => {
                          setSelectedStatus('');
                          setStatusDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-gray-500 text-sm"
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
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm"
                        >
                          {status}
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Kualifikasi
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Tanggal Timesheet
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    MOB
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    DEMOB
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Durasi (hari)
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Overtime (jam)
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    No SO
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    No SO Turunan
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Lokasi
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Zona
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Jenis Pekerjaan
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Rate
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Pegawai
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Action
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
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="space-y-1">
                        {item.kualifikasi.map((kual, idx) => (
                          <div key={idx} className="flex items-center space-x-1">
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span>{kual}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.tanggalTimesheet}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.mob}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.demob}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">{item.durasiHari}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">{item.overtimeJam}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.noSO}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.noSOTurunan}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.lokasi}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.zona}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getJenisPekerjaanColor(item.jenisPekerjaan)}`}>
                        {item.jenisPekerjaan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.rate}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getPegawaiColor(item.pegawai)}`}>
                        {item.pegawai}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
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

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.kualifikasi.join(', ')}
      />
    </div>
  );
};

export default TimesheetPegawaiDashboard;
