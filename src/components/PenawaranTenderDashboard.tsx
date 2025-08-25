import React, { useState, useEffect } from 'react';
import PenawaranTwoStepModal, { PenawaranTwoStepFormData } from './PenawaranTwoStepModal';
import PenawaranDetailModal from './PenawaranDetailModal';
import UpdateStatusModal, { UpdateStatusFormData } from './UpdateStatusModal';
import HistoryPenawaranModal from './HistoryPenawaranModal';
import { PenawaranDetailData } from '../types';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { 
  Search, 
  Plus, 
  FileSpreadsheet, 
  FileText, 
  File,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  ChevronDown,
  Calendar,
  Clock,
  Info,
  ChevronLeft,
  ChevronRight,
  Settings,
  Lock,
  Printer
} from 'lucide-react';

interface PenawaranTender {
  id: string;
  no: number;
  namaClient: string;
  pic: string;
  namaSales: string;
  terakhirUpdate: string;
  statusPenawaran: 'Deal' | 'Pending' | 'Cancel';
  statusDokumen: 'Open' | 'Close';
}

const PenawaranTenderDashboard: React.FC = () => {
  const [searchNamaClient, setSearchNamaClient] = useState('');
  const [searchPIC, setSearchPIC] = useState('');
  const [searchSales, setSearchSales] = useState('');
  const [selectedStatusPenawaran, setSelectedStatusPenawaran] = useState('');
  const [selectedStatusDokumen, setSelectedStatusDokumen] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusPenawaranDropdownOpen, setStatusPenawaranDropdownOpen] = useState(false);
  const [statusDokumenDropdownOpen, setStatusDokumenDropdownOpen] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedPenawaranForDetail, setSelectedPenawaranForDetail] = useState<PenawaranDetailData | null>(null);
  const [selectedItemForStatusUpdate, setSelectedItemForStatusUpdate] = useState<{
    id: string;
    namaClient: string;
    statusPenawaran: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PenawaranTender | null>(null);

  // Sample data
  const [penawaranTender, setPenawaranTender] = useState<PenawaranTender[]>([
    {
      id: '1',
      no: 1,
      namaClient: 'PT Konstruksi Besar',
      pic: 'Michael Johnson',
      namaSales: 'Rina Sari',
      terakhirUpdate: '15-01-2025',
      statusPenawaran: 'Deal',
      statusDokumen: 'Close'
    },
    {
      id: '2',
      no: 2,
      namaClient: 'CV Infrastruktur Jaya',
      pic: 'Sarah Wilson',
      namaSales: 'Dedi Kurniawan',
      terakhirUpdate: '14-01-2025',
      statusPenawaran: 'Pending',
      statusDokumen: 'Open'
    },
    {
      id: '3',
      no: 3,
      namaClient: 'PT Pembangunan Utama',
      pic: 'David Brown',
      namaSales: 'Lina Maharani',
      terakhirUpdate: '13-01-2025',
      statusPenawaran: 'Cancel',
      statusDokumen: 'Close'
    },
    {
      id: '4',
      no: 4,
      namaClient: 'UD Tender Sukses',
      pic: 'Emma Davis',
      namaSales: 'Ahmad Rizki',
      terakhirUpdate: '12-01-2025',
      statusPenawaran: 'Deal',
      statusDokumen: 'Open'
    },
    {
      id: '5',
      no: 5,
      namaClient: 'PT Proyek Nasional',
      pic: 'James Miller',
      namaSales: 'Sari Dewi',
      terakhirUpdate: '11-01-2025',
      statusPenawaran: 'Pending',
      statusDokumen: 'Close'
    }
  ]);

  useEffect(() => {
    // Trigger animation on component mount
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleAddPenawaran = (formData: PenawaranTwoStepFormData) => {
    const newPenawaran: PenawaranTender = {
      id: (penawaranTender.length + 1).toString(),
      no: penawaranTender.length + 1,
      namaClient: formData.namaCustomer,
      pic: formData.nama,
      namaSales: formData.namaSales,
      terakhirUpdate: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      statusPenawaran: 'Pending' as 'Deal' | 'Pending' | 'Cancel',
      statusDokumen: 'Open' as 'Open' | 'Close'
    };

    setPenawaranTender(prev => [newPenawaran, ...prev.map(p => ({ ...p, no: p.no + 1 }))]);
  };

  const handleViewDetail = (item: PenawaranTender) => {
    const detailData: PenawaranDetailData = {
      kategoriPajak: 'Pajak Barang Mewah',
      noRefReq: 'REG2025112',
      kodeCustomer: 'CUST01',
      namaCustomer: item.namaClient,
      pajak: 'PPN (10%)',
      noPenawaran: 'PEN66567',
      tanggalPenawaran: '01/12/2024',
      tanggalPenawaranEnd: '15/01/2025',
      tanggalKirim: '03/01/2025',
      tanggalKirimEnd: '15/01/2025',
      statusDok: 'Status 1',
      namaDivisi: 'Welding',
      jenisPenawaran: 'Pilih Jenis Penawaran',
      kodeBarang: 'BA-001',
      statusSO: 'Pilih Status SO',
      statusPenawaran: item.statusPenawaran,
      jenisPekerjaan: 'Pilih Jenis Pekerjaan',
      statusKOM: 'Open'
    };
    
    setSelectedPenawaranForDetail(detailData);
    setIsDetailModalOpen(true);
  };

  const handleUpdateStatus = (item: PenawaranTender) => {
    setSelectedItemForStatusUpdate({
      id: item.id,
      namaClient: item.namaClient,
      statusPenawaran: item.statusPenawaran
    });
    setIsUpdateStatusModalOpen(true);
  };

  const handleSaveStatusUpdate = (formData: UpdateStatusFormData) => {
    if (selectedItemForStatusUpdate) {
      setPenawaranTender(prev => 
        prev.map(item => 
          item.id === selectedItemForStatusUpdate.id 
            ? { ...item, statusPenawaran: formData.status as 'Deal' | 'Pending' | 'Cancel' }
            : item
        )
      );
    }
    setSelectedItemForStatusUpdate(null);
  };

  const handleDeleteClick = (item: PenawaranTender) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setPenawaranTender(prev => prev.filter(p => p.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const getStatusPenawaranColor = (status: string) => {
    switch (status) {
      case 'Deal': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancel': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusDokumenColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800 border-green-200';
      case 'Close': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const statusPenawaranOptions = ['Deal', 'Pending', 'Cancel'];
  const statusDokumenOptions = ['Open', 'Close'];

  // Filter data based on search criteria
  const filteredData = penawaranTender.filter(item => {
    const matchesNamaClient = item.namaClient.toLowerCase().includes(searchNamaClient.toLowerCase());
    const matchesPIC = item.pic.toLowerCase().includes(searchPIC.toLowerCase());
    const matchesSales = item.namaSales.toLowerCase().includes(searchSales.toLowerCase());
    const matchesStatusPenawaran = selectedStatusPenawaran ? item.statusPenawaran === selectedStatusPenawaran : true;
    const matchesStatusDokumen = selectedStatusDokumen ? item.statusDokumen === selectedStatusDokumen : true;
    
    return matchesNamaClient && matchesPIC && matchesSales && matchesStatusPenawaran && matchesStatusDokumen;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                DAFTAR PENAWARAN TENDER
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Marketing</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Penawaran</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Penawaran Tender</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Filter & Action Panel */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-16 -mt-16"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Search Nama Client */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cari Nama Client
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchNamaClient}
                    onChange={(e) => setSearchNamaClient(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Masukkan nama client..."
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 flex items-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Search PIC */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cari PIC
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchPIC}
                    onChange={(e) => setSearchPIC(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Masukkan nama PIC..."
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 flex items-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Search Sales */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cari Sales
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchSales}
                    onChange={(e) => setSearchSales(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Masukkan nama sales..."
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 flex items-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Status Penawaran Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Pilih Status Penawaran
              </label>
              <div className="relative">
                <button
                  onClick={() => setStatusPenawaranDropdownOpen(!statusPenawaranDropdownOpen)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white"
                >
                  <span className={selectedStatusPenawaran ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedStatusPenawaran || 'Pilih status penawaran...'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${statusPenawaranDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {statusPenawaranDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        setSelectedStatusPenawaran('');
                        setStatusPenawaranDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-500"
                    >
                      Semua Status
                    </button>
                    {statusPenawaranOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatusPenawaran(status);
                          setStatusPenawaranDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <span className={`w-3 h-3 rounded-full ${
                          status === 'Deal' ? 'bg-green-500' : 
                          status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></span>
                        <span>{status}</span>
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white"
                >
                  <span className={selectedStatusDokumen ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedStatusDokumen || 'Pilih status dokumen...'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${statusDokumenDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {statusDokumenDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        setSelectedStatusDokumen('');
                        setStatusDokumenDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-500"
                    >
                      Semua Status
                    </button>
                    {statusDokumenOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatusDokumen(status);
                          setStatusDokumenDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <span className={`w-3 h-3 rounded-full ${
                          status === 'Open' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        <span>{status}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Periode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button 
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 flex items-center space-x-2 text-sm"
            >
              <Search className="h-4 w-4" />
              <span>Cari Data</span>
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah</span>
            </button>
          </div>
        </div>

        {/* Quick Export Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
            <div className="flex space-x-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-1.5">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Excel</span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 flex items-center space-x-1.5">
                <File className="h-4 w-4" />
                <span>CSV</span>
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-600/25 flex items-center space-x-1.5">
                <FileText className="h-4 w-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama Client</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">PIC</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama Sales</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Terakhir Update</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status Penawaran</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status Dokumen</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr 
                    key={item.id}
                    className={`hover:bg-gray-50 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    } ${animateRows ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`}
                    style={{ 
                      animationDelay: animateRows ? `${index * 100}ms` : '0ms',
                      animationFillMode: 'forwards'
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0">
                          <Info className="h-2 w-2 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{item.no}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{item.namaClient}</td>
                    <td className="px-6 py-4 text-gray-600">{item.pic}</td>
                    <td className="px-6 py-4 text-gray-600">{item.namaSales}</td>
                    <td className="px-6 py-4 text-gray-600">{item.terakhirUpdate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusPenawaranColor(item.statusPenawaran)}`}>
                        {item.statusPenawaran}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusDokumenColor(item.statusDokumen)}`}>
                        {item.statusDokumen}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-1">
                        <button 
                          onClick={() => handleViewDetail(item)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200 hover:scale-110"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(item)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 hover:scale-110"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(item)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 hover:scale-110">
                          <Printer className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setIsHistoryModalOpen(true)}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200 hover:scale-110"
                        >
                          <Clock className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                        : 'text-gray-700 hover:bg-white hover:text-blue-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Penawaran Modal */}
      <PenawaranTwoStepModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddPenawaran}
        type="tender"
      />

      {/* Penawaran Detail Modal */}
      <PenawaranDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        penawaranData={selectedPenawaranForDetail}
      />

      {/* Update Status Modal */}
      <UpdateStatusModal
        isOpen={isUpdateStatusModalOpen}
        onClose={() => setIsUpdateStatusModalOpen(false)}
        onSave={handleSaveStatusUpdate}
        currentItem={selectedItemForStatusUpdate}
      />

      {/* History Penawaran Modal */}
      <HistoryPenawaranModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.namaClient}
      />
    </div>
  );
};

export default PenawaranTenderDashboard;
