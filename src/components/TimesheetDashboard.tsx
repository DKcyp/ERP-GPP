import React, { useState, useEffect } from 'react';
import TimesheetPegawaiDashboard from './TimesheetPegawaiDashboard';
import TimesheetBarangDashboard from './TimesheetBarangDashboard';
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
  tanggal: string;
  noSO: string;
  noSOTurunan: string;
  namaProyek: string;
  namaPegawai: string;
  kualifikasi: string[];
  mob: string;
  demob: string;
  durasi: string;
  zona: string;
  nilaiTimesheet: string;
  statusApproval: 'Approve by HRD' | 'Approve by Manager OPS' | 'Pending' | 'Rejected';
}

interface TimesheetBarang {
  id: string;
  no: number;
  noSO: string;
  noSOTurunan: string;
  namaProyek: string;
  nilaiTimesheet: string;
  mob: string;
  demob: string;
  tanggalPenyerahan: string;
  kondisiBarang: 'Baik' | 'Rusak';
  status: 'Approve by Gudang' | 'Approve by QHSE' | 'Pending' | 'Rejected';
}

const TimesheetDashboard: React.FC = () => {
  const [searchNoSO, setSearchNoSO] = useState('');
  const [searchSOTurunan, setSearchSOTurunan] = useState('');
  const [searchNamaProject, setSearchNamaProject] = useState('');
  const [selectedStatusApproval, setSelectedStatusApproval] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TimesheetPegawai | TimesheetBarang | null>(null);
  const [sortField, setSortField] = useState<keyof TimesheetPegawai | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sample data for Timesheet Pegawai matching the image
  const [timesheetPegawaiData, setTimesheetPegawaiData] = useState<TimesheetPegawai[]>([
    {
      id: '1',
      no: 1,
      tanggal: '03-02-2025',
      noSO: 'SO001',
      noSOTurunan: 'SO001.2',
      namaProyek: 'Proyek A',
      namaPegawai: 'John Doe',
      kualifikasi: ['Welder', 'Rope Access'],
      mob: '01-01-2025',
      demob: '20-01-2025',
      durasi: '19 Hari',
      zona: 'Zona 4',
      nilaiTimesheet: 'Rp 500,000',
      statusApproval: 'Approve by HRD'
    },
    {
      id: '2',
      no: 2,
      tanggal: '10-02-2025',
      noSO: 'SO002',
      noSOTurunan: 'SO002.1',
      namaProyek: 'Proyek B',
      namaPegawai: 'Jane Smith',
      kualifikasi: ['Electrician', 'Rope Access'],
      mob: '05-02-2025',
      demob: '25-02-2025',
      durasi: '20 Hari',
      zona: 'Zona 10',
      nilaiTimesheet: 'Rp 450,000',
      statusApproval: 'Approve by Manager OPS'
    },
    {
      id: '3',
      no: 3,
      tanggal: '15-02-2025',
      noSO: 'SO003',
      noSOTurunan: 'SO003.3',
      namaProyek: 'Proyek C',
      namaPegawai: 'Michael Johnson',
      kualifikasi: ['Rigger', 'Welding Supervisor'],
      mob: '01-02-2025',
      demob: '01-03-2025',
      durasi: '29 Hari',
      zona: 'Zona 2',
      nilaiTimesheet: 'Rp 600,000',
      statusApproval: 'Approve by HRD'
    },
    {
      id: '4',
      no: 4,
      tanggal: '20-02-2025',
      noSO: 'SO004',
      noSOTurunan: 'SO004.4',
      namaProyek: 'Proyek D',
      namaPegawai: 'Amy Williams',
      kualifikasi: ['Welder', 'Electrician'],
      mob: '12-02-2025',
      demob: '12-03-2025',
      durasi: '30 Hari',
      zona: 'Zona 3',
      nilaiTimesheet: 'Rp 700,000',
      statusApproval: 'Approve by Manager OPS'
    }
  ]);

  // Sample data for Timesheet Barang matching the image
  const [timesheetBarangData, setTimesheetBarangData] = useState<TimesheetBarang[]>([
    {
      id: '1',
      no: 1,
      noSO: 'SO001',
      noSOTurunan: 'SO001.1',
      namaProyek: 'Proyek A',
      nilaiTimesheet: 'Rp 500,000,000',
      mob: '02-01-2025',
      demob: '20-01-2025',
      tanggalPenyerahan: '22-01-2025',
      kondisiBarang: 'Baik',
      status: 'Approve by Gudang'
    },
    {
      id: '2',
      no: 2,
      noSO: 'SO002',
      noSOTurunan: 'SO002.1',
      namaProyek: 'Proyek B',
      nilaiTimesheet: 'Rp 750,000,000',
      mob: '05-01-2025',
      demob: '22-01-2025',
      tanggalPenyerahan: '25-01-2025',
      kondisiBarang: 'Baik',
      status: 'Approve by Gudang'
    },
    {
      id: '3',
      no: 3,
      noSO: 'SO003',
      noSOTurunan: 'SO003.1',
      namaProyek: 'Proyek C',
      nilaiTimesheet: 'Rp 600,000,000',
      mob: '07-01-2025',
      demob: '24-01-2025',
      tanggalPenyerahan: '26-01-2025',
      kondisiBarang: 'Baik',
      status: 'Approve by QHSE'
    },
    {
      id: '4',
      no: 4,
      noSO: 'SO004',
      noSOTurunan: 'SO004.1',
      namaProyek: 'Proyek D',
      nilaiTimesheet: 'Rp 900,000,000',
      mob: '10-01-2025',
      demob: '26-01-2025',
      tanggalPenyerahan: '28-01-2025',
      kondisiBarang: 'Rusak',
      status: 'Approve by QHSE'
    },
    {
      id: '5',
      no: 5,
      noSO: 'SO005',
      noSOTurunan: 'SO005.1',
      namaProyek: 'Proyek E',
      nilaiTimesheet: 'Rp 1,200,000,000',
      mob: '12-01-2025',
      demob: '28-01-2025',
      tanggalPenyerahan: '30-01-2025',
      kondisiBarang: 'Baik',
      status: 'Approve by Gudang'
    },
    {
      id: '6',
      no: 6,
      noSO: 'SO006',
      noSOTurunan: 'SO006.1',
      namaProyek: 'Proyek F',
      nilaiTimesheet: 'Rp 800,000,000',
      mob: '15-01-2025',
      demob: '30-01-2025',
      tanggalPenyerahan: '02-02-2025',
      kondisiBarang: 'Rusak',
      status: 'Approve by Gudang'
    },
    {
      id: '7',
      no: 7,
      noSO: 'SO007',
      noSOTurunan: 'SO007.1',
      namaProyek: 'Proyek G',
      nilaiTimesheet: 'Rp 950,000,000',
      mob: '17-01-2025',
      demob: '02-02-2025',
      tanggalPenyerahan: '04-02-2025',
      kondisiBarang: 'Rusak',
      status: 'Approve by QHSE'
    },
    {
      id: '8',
      no: 8,
      noSO: 'SO008',
      noSOTurunan: 'SO008.1',
      namaProyek: 'Proyek H',
      nilaiTimesheet: 'Rp 1,000,000,000',
      mob: '20-01-2025',
      demob: '04-02-2025',
      tanggalPenyerahan: '06-02-2025',
      kondisiBarang: 'Baik',
      status: 'Approve by QHSE'
    },
    {
      id: '9',
      no: 9,
      noSO: 'SO009',
      noSOTurunan: 'SO009.1',
      namaProyek: 'Proyek I',
      nilaiTimesheet: 'Rp 700,000,000',
      mob: '22-01-2025',
      demob: '06-02-2025',
      tanggalPenyerahan: '08-02-2025',
      kondisiBarang: 'Baik',
      status: 'Approve by Gudang'
    },
    {
      id: '10',
      no: 10,
      noSO: 'SO010',
      noSOTurunan: 'SO010.1',
      namaProyek: 'Proyek J',
      nilaiTimesheet: 'Rp 1,100,000,000',
      mob: '25-01-2025',
      demob: '08-02-2025',
      tanggalPenyerahan: '10-02-2025',
      kondisiBarang: 'Baik',
      status: 'Approve by Gudang'
    }
  ]);

  const statusApprovalOptionsPegawai = ['Approve by HRD', 'Approve by Manager OPS', 'Pending', 'Rejected'];
  const statusApprovalOptionsBarang = ['Approve by Gudang', 'Approve by QHSE', 'Pending', 'Rejected'];

  useEffect(() => {
    // Trigger animation on component mount
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleDeleteClick = (timesheet: TimesheetPegawai | TimesheetBarang) => {
    setItemToDelete(timesheet);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      // Check if it's a pegawai or barang timesheet and update accordingly
      if ('namaPegawai' in itemToDelete) {
        setTimesheetPegawaiData(prev => prev.filter(t => t.id !== itemToDelete.id));
      } else {
        setTimesheetBarangData(prev => prev.filter(t => t.id !== itemToDelete.id));
      }
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

  const getStatusColorPegawai = (status: string) => {
    switch (status) {
      case 'Approve by HRD': return 'bg-green-600 text-white';
      case 'Approve by Manager OPS': return 'bg-cyan-500 text-white';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColorBarang = (status: string) => {
    switch (status) {
      case 'Approve by Gudang': return 'bg-green-600 text-white';
      case 'Approve by QHSE': return 'bg-green-600 text-white';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getKondisiBarangColor = (kondisi: string) => {
    switch (kondisi) {
      case 'Baik': return 'bg-green-600 text-white';
      case 'Rusak': return 'bg-red-600 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter data based on search criteria for Pegawai
  const filteredPegawaiData = timesheetPegawaiData.filter(item => {
    const matchesNoSO = item.noSO.toLowerCase().includes(searchNoSO.toLowerCase());
    const matchesSOTurunan = item.noSOTurunan.toLowerCase().includes(searchSOTurunan.toLowerCase());
    const matchesNamaProject = item.namaProyek.toLowerCase().includes(searchNamaProject.toLowerCase());
    const matchesStatus = selectedStatusApproval ? item.statusApproval === selectedStatusApproval : true;
    
    return matchesNoSO && matchesSOTurunan && matchesNamaProject && matchesStatus;
  });

  // Filter data based on search criteria for Barang
  const filteredBarangData = timesheetBarangData.filter(item => {
    const matchesNoSO = item.noSO.toLowerCase().includes(searchNoSO.toLowerCase());
    const matchesSOTurunan = item.noSOTurunan.toLowerCase().includes(searchSOTurunan.toLowerCase());
    const matchesNamaProject = item.namaProyek.toLowerCase().includes(searchNamaProject.toLowerCase());
    const matchesStatus = selectedStatusApproval ? item.status === selectedStatusApproval : true;
    
    return matchesNoSO && matchesSOTurunan && matchesNamaProject && matchesStatus;
  });

  // Sort data for Pegawai
  const sortedPegawaiData = [...filteredPegawaiData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Sort data for Barang
  const sortedBarangData = [...filteredBarangData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField as keyof TimesheetBarang];
    const bValue = b[sortField as keyof TimesheetBarang];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination logic for Pegawai
  const totalPagesPegawai = Math.ceil(sortedPegawaiData.length / itemsPerPage);
  const startIndexPegawai = (currentPage - 1) * itemsPerPage;
  const endIndexPegawai = startIndexPegawai + itemsPerPage;
  const currentPegawaiData = sortedPegawaiData.slice(startIndexPegawai, endIndexPegawai);

  // Pagination logic for Barang
  const totalPagesBarang = Math.ceil(sortedBarangData.length / itemsPerPage);
  const startIndexBarang = (currentPage - 1) * itemsPerPage;
  const endIndexBarang = startIndexBarang + itemsPerPage;
  const currentBarangData = sortedBarangData.slice(startIndexBarang, endIndexBarang);

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
            Dashboard Timesheet
          </h1>

          {/* Timesheet Pegawai Section */}
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Timesheet Pegawai</h2>

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
                    Cari No SO Turunan
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
                      placeholder="PHE ONWJ"
                    />
                    <button 
                      onClick={handleSearch}
                      className="px-3 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Status Approval Dropdown */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Cari Status Approval
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white text-sm"
                    >
                      <span className={selectedStatusApproval ? 'text-gray-900' : 'text-gray-500'}>
                        {selectedStatusApproval || '--Pilih Status Approval--'}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${statusDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {statusDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 overflow-hidden">
                        <button
                          onClick={() => {
                            setSelectedStatusApproval('');
                            setStatusDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-gray-500 text-sm"
                        >
                          --Pilih Status Approval--
                        </button>
                        {statusApprovalOptionsPegawai.map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setSelectedStatusApproval(status);
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
              </div>

              {/* Second Row - Date Range and Search Button */}
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
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-12">
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

        {/* Timesheet Pegawai Table */}
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
                    onClick={() => handleSort('tanggal')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Tanggal</span>
                      {sortField === 'tanggal' && (
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">No SO Turunan</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nama Proyek</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nama Pegawai</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Kualifikasi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">MOB</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">DEMOB</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Durasi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Zona</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nilai Timesheet</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentPegawaiData.map((item, index) => (
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
                    <td className="px-4 py-3 text-sm text-gray-900">{item.tanggal}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.noSO}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.noSOTurunan}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.namaProyek}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.namaPegawai}</td>
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
                    <td className="px-4 py-3 text-sm text-gray-600">{item.mob}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.demob}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.durasi}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.zona}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.nilaiTimesheet}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColorPegawai(item.statusApproval)}`}>
                        {item.statusApproval}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination for Pegawai */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndexPegawai + 1} to {Math.min(endIndexPegawai, filteredPegawaiData.length)} of {filteredPegawaiData.length} entries
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
                  {Array.from({ length: Math.min(totalPagesPegawai, 5) }, (_, i) => {
                    let page;
                    if (totalPagesPegawai <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPagesPegawai - 2) {
                      page = totalPagesPegawai - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    
                    return (
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
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPagesPegawai}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Timesheet Barang Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Timesheet Barang</h2>

          {/* Timesheet Barang Table */}
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
                      onClick={() => handleSort('noSO')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>No SO</span>
                        {sortField === 'noSO' && (
                          <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">No SO Turunan</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nama Proyek</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nilai Timesheet</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">MOB</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">DEMOB</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tanggal Penyerahan</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Kondisi Barang</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentBarangData.map((item, index) => (
                    <tr 
                      key={item.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                      } ${animateRows ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`}
                      style={{ 
                        animationDelay: animateRows ? `${(index + 10) * 100}ms` : '0ms',
                        animationFillMode: 'forwards'
                      }}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">{item.no}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.noSO}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.noSOTurunan}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.namaProyek}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.nilaiTimesheet}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.mob}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.demob}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.tanggalPenyerahan}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getKondisiBarangColor(item.kondisiBarang)}`}>
                          {item.kondisiBarang}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColorBarang(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination for Barang */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {startIndexBarang + 1} to {Math.min(endIndexBarang, filteredBarangData.length)} of {filteredBarangData.length} entries
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
                    {Array.from({ length: Math.min(totalPagesBarang, 5) }, (_, i) => {
                      let page;
                      if (totalPagesBarang <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPagesBarang - 2) {
                        page = totalPagesBarang - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      
                      return (
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
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPagesBarang}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
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
        itemName={itemToDelete ? ('namaPegawai' in itemToDelete ? itemToDelete.namaPegawai : itemToDelete.namaProyek) : undefined}
      />
    </div>
  );
};

export default TimesheetDashboard;
