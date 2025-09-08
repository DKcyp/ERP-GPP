import React, { useState, useEffect } from 'react';
import termsPdf from '../../Folder/term&condition.pdf';
import PenawaranTwoStepModal, { PenawaranTwoStepFormData } from './PenawaranTwoStepModal';
import PenawaranDetailModal from './PenawaranDetailModal';
import UpdateStatusModal from './UpdateStatusModal';
import HistoryPenawaranModal from './HistoryPenawaranModal';
import { PenawaranDetailData, UpdateStatusFormData, LamaranData } from '../types';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { 
  Search, 
  Plus, 
  FileSpreadsheet, 
  FileText, 
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  Calendar,
  Clock,
  Info,
  ChevronLeft,
  ChevronRight,
  Settings,
  Printer
  
} from 'lucide-react';

interface PenawaranOnCall {
  id: string;
  no: number;
  namaClient: string;
  pic: string;
  namaSales: string;
  terakhirUpdate: string;
  statusPenawaran: 'Deal' | 'Pending' | 'Cancel';
  statusDokumen: 'Open' | 'Close';
  lokasiKerja: string; // Added for new filter
}

const PenawaranOnCallDashboard: React.FC = () => {
  const [searchNamaClient, setSearchNamaClient] = useState('');
  const [searchPIC, setSearchPIC] = useState('');
  const [searchSales, setSearchSales] = useState('');
  const [searchLokasiKerja, setSearchLokasiKerja] = useState(''); // New state for 'Cari Lokasi Kerja'
  const [selectedStatusPenawaran, setSelectedStatusPenawaran] = useState('');
  const [selectedStatusDokumen] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusPenawaranDropdownOpen, setStatusPenawaranDropdownOpen] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedPenawaranForDetail, setSelectedPenawaranForDetail] = useState<PenawaranDetailData | null>(null);
  const [selectedItemForStatusUpdate, setSelectedItemForStatusUpdate] = useState<LamaranData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PenawaranOnCall | null>(null);

  // Sample data
  const [penawaranOnCall, setPenawaranOnCall] = useState<PenawaranOnCall[]>([
    {
      id: '1',
      no: 1,
      namaClient: 'PT Teknologi Maju',
      pic: 'John Doe',
      namaSales: 'Ahmad Rizki',
      terakhirUpdate: '15-01-2025',
      statusPenawaran: 'Deal',
      statusDokumen: 'Open',
      lokasiKerja: 'Jakarta'
    },
    {
      id: '2',
      no: 2,
      namaClient: 'CV Digital Solutions',
      pic: 'Jane Smith',
      namaSales: 'Sari Dewi',
      terakhirUpdate: '14-01-2025',
      statusPenawaran: 'Pending',
      statusDokumen: 'Close',
      lokasiKerja: 'Surabaya'
    },
    {
      id: '3',
      no: 3,
      namaClient: 'PT Industri Kreatif',
      pic: 'Bob Wilson',
      namaSales: 'Budi Santoso',
      terakhirUpdate: '13-01-2025',
      statusPenawaran: 'Cancel',
      statusDokumen: 'Open',
      lokasiKerja: 'Bandung'
    },
    {
      id: '4',
      no: 4,
      namaClient: 'UD Berkah Jaya',
      pic: 'Alice Brown',
      namaSales: 'Maya Putri',
      terakhirUpdate: '12-01-2025',
      statusPenawaran: 'Deal',
      statusDokumen: 'Close',
      lokasiKerja: 'Medan'
    },
    {
      id: '5',
      no: 5,
      namaClient: 'PT Global Mandiri',
      pic: 'Charlie Davis',
      namaSales: 'Andi Wijaya',
      terakhirUpdate: '11-01-2025',
      statusPenawaran: 'Pending',
      statusDokumen: 'Open',
      lokasiKerja: 'Yogyakarta'
    }
  ]);

  useEffect(() => {
    // Trigger animation on component mount
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleAddPenawaran = (formData: PenawaranTwoStepFormData) => {
    const newPenawaran: PenawaranOnCall = {
      id: (penawaranOnCall.length + 1).toString(),
      no: penawaranOnCall.length + 1,
      namaClient: formData.namaCustomer,
      pic: formData.nama,
      namaSales: formData.namaSales,
      terakhirUpdate: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      statusPenawaran: 'Pending' as 'Deal' | 'Pending' | 'Cancel',
      statusDokumen: 'Open' as 'Open' | 'Close',
      lokasiKerja: 'Lokasi Default' // Default value for new entry
    };

    setPenawaranOnCall(prev => [newPenawaran, ...prev.map(p => ({ ...p, no: p.no + 1 }))]);
  };

  const handleViewDetail = (item: PenawaranOnCall) => {
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

  // Map Penawaran status <-> Modal status
  const mapPenawaranToModalStatus = (status: 'Deal' | 'Pending' | 'Cancel'): UpdateStatusFormData['status'] => {
    switch (status) {
      case 'Deal': return 'Accepted';
      case 'Pending': return 'Pending';
      case 'Cancel': return 'Rejected';
    }
  };

  const mapModalToPenawaranStatus = (status: UpdateStatusFormData['status']): 'Deal' | 'Pending' | 'Cancel' => {
    switch (status) {
      case 'Accepted': return 'Deal';
      case 'Pending': return 'Pending';
      case 'Rejected': return 'Cancel';
      // Fallbacks for other statuses used by the generic modal
      case 'Interview': return 'Pending';
      case 'Hired': return 'Deal';
      default: return 'Pending';
    }
  };

  const handleUpdateStatus = (item: PenawaranOnCall) => {
    setSelectedItemForStatusUpdate({
      id: item.id,
      status: mapPenawaranToModalStatus(item.statusPenawaran),
      keterangan: ''
    });
    setIsUpdateStatusModalOpen(true);
  };

  const handleSaveStatusUpdate = (id: string, data: UpdateStatusFormData) => {
    setPenawaranOnCall(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, statusPenawaran: mapModalToPenawaranStatus(data.status) }
          : item
      )
    );
    setSelectedItemForStatusUpdate(null);
  };

  const handleDeleteClick = (item: PenawaranOnCall) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleExportPDF = () => {
    // Use Vite asset URL to ensure it works in dev and production
    const link = document.createElement('a');
    link.href = termsPdf;
    link.setAttribute('download', 'term&condition.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setPenawaranOnCall(prev => prev.filter(p => p.id !== itemToDelete.id));
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

  // Filter data based on search criteria
  const filteredData = penawaranOnCall.filter(item => {
    const matchesNamaClient = item.namaClient.toLowerCase().includes(searchNamaClient.toLowerCase());
    const matchesPIC = item.pic.toLowerCase().includes(searchPIC.toLowerCase());
    const matchesSales = item.namaSales.toLowerCase().includes(searchSales.toLowerCase());
    const matchesLokasiKerja = item.lokasiKerja.toLowerCase().includes(searchLokasiKerja.toLowerCase()); // New filter
    const matchesStatusPenawaran = selectedStatusPenawaran ? item.statusPenawaran === selectedStatusPenawaran : true;
    const matchesStatusDokumen = selectedStatusDokumen ? item.statusDokumen === selectedStatusDokumen : true;
    
    // Date filtering (assuming terakhirUpdate is 'DD-MM-YYYY')
    const itemUpdateDate = item.terakhirUpdate.split('-').reverse().join('-'); // Convert to YYYY-MM-DD for comparison
    const matchesDateFrom = dateFrom ? itemUpdateDate >= dateFrom : true;
    const matchesDateTo = dateTo ? itemUpdateDate <= dateTo : true;

    return matchesNamaClient && matchesPIC && matchesSales && matchesLokasiKerja && matchesStatusPenawaran && matchesStatusDokumen && matchesDateFrom && matchesDateTo;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 text-sm">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-wide mb-1">
                DAFTAR PENAWARAN ON CALL
              </h1>
              <nav className="text-xs text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Marketing</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Penawaran</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Penawaran On Call</span>
              </nav>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* Filter & Action Panel */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-4 relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-10 -mt-10"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {/* Cari Nama Client (equivalent to Cari No SPK) */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Cari Nama Client
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchNamaClient}
                  onChange={(e) => setSearchNamaClient(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Masukkan nama client..."
                />
              </div>
            </div>

            {/* Cari PIC (equivalent to Cari Nama Pegawai) */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Cari PIC
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchPIC}
                  onChange={(e) => setSearchPIC(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Masukkan nama PIC..."
                />
              </div>
            </div>

            {/* Cari Sales (equivalent to Cari Jenis Pekerjaan) */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Cari Sales
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchSales}
                  onChange={(e) => setSearchSales(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Masukkan nama sales..."
                />
              </div>
            </div>

            {/* Cari Lokasi Kerja (New Input) */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Cari Lokasi Kerja
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchLokasiKerja}
                  onChange={(e) => setSearchLokasiKerja(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Masukkan lokasi kerja..."
                />
              </div>
            </div>

            {/* Status Penawaran Dropdown (equivalent to Pilih Status SPK) */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Pilih Status Penawaran
              </label>
              <div className="relative">
                <button
                  onClick={() => setStatusPenawaranDropdownOpen(!statusPenawaranDropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white text-sm"
                >
                  <span className={selectedStatusPenawaran ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedStatusPenawaran || 'Pilih status penawaran...'}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${statusPenawaranDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {statusPenawaranDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden text-sm">
                    <button
                      onClick={() => {
                        setSelectedStatusPenawaran('');
                        setStatusPenawaranDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-gray-500"
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
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${
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

            {/* Periode Awal (Date From) */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Periode Awal
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Periode Akhir (Date To) */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Periode Akhir
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Cari Button */}
            <div className="space-y-2 flex items-end">
              <button 
                onClick={handleSearch}
                className="w-full h-[38px] bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 flex items-center justify-center space-x-2 text-sm"
              >
                <Search className="h-4 w-4" />
                <span>Cari</span>
              </button>
            </div>

            {/* Status Dokumen Dropdown - Moved to a new row or adjusted if needed, for now, keeping it here */}
            {/* This dropdown was originally in the first row of filters.
                To match the image, we only have 3 dropdowns/date pickers in the second row.
                Let's decide if this dropdown is still needed or if it should be placed elsewhere.
                For now, I'll keep it in the grid, but it might push the layout if not handled carefully.
                The image only shows "Pilih Status SPK", "Periode Awal", "Periode Akhir", and "Cari".
                I will remove "Status Dokumen" from the main filter grid to match the image's 3+1 layout.
                If it's a critical filter, we might need to adjust the image's layout or add it back in a different spot.
                For now, I'll assume it's less critical for the primary filter layout.
            */}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 flex items-center space-x-2 text-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Penawaran</span>
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md font-medium transition-all duration-200 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-2 text-sm">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Export Excel</span>
            </button>
            <button onClick={handleExportPDF} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md font-medium transition-all duration-200 hover:shadow-lg hover:shadow-red-600/25 flex items-center space-x-2 text-sm">
              <FileText className="h-3.5 w-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Quick Export Bar - Removed as its functionality is now integrated into the main action buttons */}
        {/* The Status Dokumen dropdown was removed from the main filter grid to match the image.
            If it needs to be present, it could be added as a separate filter row or integrated differently.
            For now, I'll assume it's not part of the primary filter layout based on the image.
        */}

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">No</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Nama Client</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">PIC</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Nama Sales</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Terakhir Update</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Status Penawaran</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Status Dokumen</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-900">Aksi</th>
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
                    <td className="px-3 py-2">
                      <div className="flex items-center space-x-3">
                        <div className="h-1.5 w-1.5 bg-blue-500 rounded-full flex-shrink-0">
                          <Info className="h-1.5 w-1.5 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{item.no}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-900">{item.namaClient}</td>
                    <td className="px-3 py-2 text-gray-600">{item.pic}</td>
                    <td className="px-3 py-2 text-gray-600">{item.namaSales}</td>
                    <td className="px-3 py-2 text-gray-600">{item.terakhirUpdate}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getStatusPenawaranColor(item.statusPenawaran)}`}>
                        {item.statusPenawaran}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getStatusDokumenColor(item.statusDokumen)}`}>
                        {item.statusDokumen}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center space-x-1">
                        <button 
                          onClick={() => handleViewDetail(item)}
                          className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-md transition-all duration-200"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(item)}
                          className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-md transition-all duration-200"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(item)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-md transition-all duration-200">
                          <Printer className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setIsHistoryModalOpen(true)}
                          className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-md transition-all duration-200"
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
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-xs">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
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
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
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
        type="on-call"
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
        initialData={selectedItemForStatusUpdate}
        isEditable={true}
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

export default PenawaranOnCallDashboard;
