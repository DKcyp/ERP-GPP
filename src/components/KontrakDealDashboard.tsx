import React, { useState, useEffect } from 'react';
import KontrakDealModal, { KontrakDealFormData } from './KontrakDealModal';
import KickOffModal, { KickOffFormData } from './KickOffModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { 
  Search, 
  Plus, 
  FileSpreadsheet, 
  FileText, 
  File,
  Edit,
  Trash2,
  ChevronDown,
  Calendar,
  Clock,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface KontrakDeal {
  id: string;
  no: number;
  namaClient: string;
  namaKontrak: string;
  jenisKontrak: string;
  tanggalKontrak: string;
  durasiKontrak: string; // This is a combined string, will need to parse for editing
  nilaiKontrak: string;
  lokasiPekerjaan: string;
  scopeOfWork: string;
  pic: string;
  statusPenawaran: 'Deal' | 'Pending' | 'Cancel';
  // For editing, we need the raw start/end dates
  durasiKontrakStartRaw?: string;
  durasiKontrakEndRaw?: string;
}

const KontrakDealDashboard: React.FC = () => {
  const [searchNoKontrak, setSearchNoKontrak] = useState('');
  const [searchPIC, setSearchPIC] = useState('');
  const [selectedJenisKontrak, setSelectedJenisKontrak] = useState('');
  const [searchLokasiPekerjaan, setSearchLokasiPekerjaan] = useState('');
  const [selectedStatusKontrak, setSelectedStatusKontrak] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [jenisKontrakDropdownOpen, setJenisKontrakDropdownOpen] = useState(false);
  const [statusKontrakDropdownOpen, setStatusKontrakDropdownOpen] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isKickOffModalOpen, setIsKickOffModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<KontrakDeal | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // New state for editing
  const [editingKontrakDeal, setEditingKontrakDeal] = useState<KontrakDealFormData | null>(null);

  // Sample data
  const [kontrakDeals, setKontrakDeals] = useState<KontrakDeal[]>([
    {
      id: 'KD-001',
      no: 1,
      namaClient: 'PT Teknologi Maju',
      namaKontrak: 'Implementasi ERP System',
      jenisKontrak: 'Software Development',
      tanggalKontrak: '15-01-2025',
      durasiKontrak: '12 Bulan', // This is a display string
      durasiKontrakStartRaw: '2025-01-15', // Raw date for editing
      durasiKontrakEndRaw: '2026-01-15', // Raw date for editing
      nilaiKontrak: 'Rp 2.500.000.000',
      lokasiPekerjaan: 'Jakarta Selatan',
      scopeOfWork: 'Full ERP Implementation',
      pic: 'Budi Santoso',
      statusPenawaran: 'Deal'
    },
    {
      id: 'KD-002',
      no: 2,
      namaClient: 'CV Digital Solutions',
      namaKontrak: 'Website Development',
      jenisKontrak: 'Web Development',
      tanggalKontrak: '14-01-2025',
      durasiKontrak: '6 Bulan',
      durasiKontrakStartRaw: '2025-01-14',
      durasiKontrakEndRaw: '2025-07-14',
      nilaiKontrak: 'Rp 750.000.000',
      lokasiPekerjaan: 'Bandung',
      scopeOfWork: 'Corporate Website & CMS',
      pic: 'Sari Dewi',
      statusPenawaran: 'Pending'
    },
    {
      id: 'KD-003',
      no: 3,
      namaClient: 'PT Industri Kreatif',
      namaKontrak: 'IT Infrastructure Setup',
      jenisKontrak: 'Infrastructure',
      tanggalKontrak: '13-01-2025',
      durasiKontrak: '8 Bulan',
      durasiKontrakStartRaw: '2025-01-13',
      durasiKontrakEndRaw: '2025-09-13',
      nilaiKontrak: 'Rp 1.200.000.000',
      lokasiPekerjaan: 'Surabaya',
      scopeOfWork: 'Network & Server Setup',
      pic: 'Ahmad Rizki',
      statusPenawaran: 'Deal'
    },
    {
      id: 'KD-004',
      no: 4,
      namaClient: 'UD Berkah Jaya',
      namaKontrak: 'POS System Integration',
      jenisKontrak: 'System Integration',
      tanggalKontrak: '12-01-2025',
      durasiKontrak: '4 Bulan',
      durasiKontrakStartRaw: '2025-01-12',
      durasiKontrakEndRaw: '2025-05-12',
      nilaiKontrak: 'Rp 450.000.000',
      lokasiPekerjaan: 'Yogyakarta',
      scopeOfWork: 'POS & Inventory System',
      pic: 'Maya Putri',
      statusPenawaran: 'Cancel'
    },
    {
      id: 'KD-005',
      no: 5,
      namaClient: 'PT Global Mandiri',
      namaKontrak: 'Mobile App Development',
      jenisKontrak: 'Mobile Development',
      tanggalKontrak: '11-01-2025',
      durasiKontrak: '10 Bulan',
      durasiKontrakStartRaw: '2025-01-11',
      durasiKontrakEndRaw: '2025-11-11',
      nilaiKontrak: 'Rp 1.800.000.000',
      lokasiPekerjaan: 'Medan',
      scopeOfWork: 'iOS & Android App',
      pic: 'Andi Wijaya',
      statusPenawaran: 'Pending'
    }
  ]);

  useEffect(() => {
    // Trigger animation on component mount
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleSaveKontrakDeal = (formData: KontrakDealFormData) => {
    if (formData.id) { // If formData has an ID, it's an edit operation
      setKontrakDeals(prev => prev.map(kontrak => 
        kontrak.id === formData.id // Use formData.id to find the item
          ? {
              ...kontrak, // Keep existing fields not in modal (like pic, statusPenawaran)
              namaClient: formData.namaClient,
              namaKontrak: formData.namaKontrak,
              jenisKontrak: formData.jenisKontrak,
              tanggalKontrak: new Date(formData.tanggalKontrak).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }),
              durasiKontrak: `${formData.durasiKontrakStart} s.d ${formData.durasiKontrakEnd}`,
              durasiKontrakStartRaw: formData.durasiKontrakStart,
              durasiKontrakEndRaw: formData.durasiKontrakEnd,
              nilaiKontrak: formData.nilaiKontrak,
              lokasiPekerjaan: formData.lokasiPekerjaan,
              scopeOfWork: formData.scopeOfWork || 'Kontrak diperbarui',
            }
          : kontrak
      ));
    } else {
      // This is an add operation
      const newKontrakDeal: KontrakDeal = {
        id: `KD-${(kontrakDeals.length + 1).toString().padStart(3, '0')}`,
        no: kontrakDeals.length + 1,
        namaClient: formData.namaClient,
        namaKontrak: formData.namaKontrak,
        jenisKontrak: formData.jenisKontrak,
        tanggalKontrak: new Date(formData.tanggalKontrak).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        durasiKontrak: `${formData.durasiKontrakStart} s.d ${formData.durasiKontrakEnd}`,
        durasiKontrakStartRaw: formData.durasiKontrakStart,
        durasiKontrakEndRaw: formData.durasiKontrakEnd,
        nilaiKontrak: formData.nilaiKontrak,
        lokasiPekerjaan: formData.lokasiPekerjaan,
        scopeOfWork: formData.scopeOfWork || 'Kontrak baru',
        pic: 'Default PIC',
        statusPenawaran: 'Pending'
      };
      setKontrakDeals(prev => [newKontrakDeal, ...prev]);
    }
    setEditingKontrakDeal(null); // Clear editing state
  };

  const handleKickOffSave = (formData: KickOffFormData) => {
    console.log('Kick Off data saved:', formData);
    // Handle kick off data save logic here
  };

  const handleDeleteClick = (kontrak: KontrakDeal) => {
    setItemToDelete(kontrak);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setKontrakDeals(prev => prev.filter(k => k.id !== itemToDelete.id));
      setItemToDelete(null);
    }
    setDeleteModalOpen(false); // Close delete modal after confirmation
  };

  const handleAddClick = () => {
    setEditingKontrakDeal(null); // Ensure form is for new entry
    setIsModalOpen(true);
  };

  const handleEditClick = (kontrak: KontrakDeal) => {
    // User requested arbitrary data for pre-filling, but we need the ID to update the correct row
    const arbitraryData: KontrakDealFormData = {
      id: kontrak.id, // Crucially, pass the ID of the item being edited
      noKontrak: 'ARB-001',
      namaClient: 'PT Arbitrary Solutions',
      namaKontrak: 'Arbitrary Project X',
      jenisKontrak: 'Tender',
      tanggalKontrak: '2025-03-01',
      durasiKontrakStart: '2025-03-01',
      durasiKontrakEnd: '2025-09-01',
      nilaiKontrak: 'Rp 1.500.000.000',
      lokasiPekerjaan: 'Arbitrary City',
      scopeOfWork: 'Arbitrary scope of work for editing.',
      uploadKontrak: null
    };
    setEditingKontrakDeal(arbitraryData);
    setIsModalOpen(true);
  };

  const jenisKontrakOptions = ['Software Development', 'Web Development', 'Mobile Development', 'Infrastructure', 'System Integration', 'Consulting'];
  const statusKontrakOptions = ['Deal', 'Pending', 'Cancel'];

  // Filter data based on search criteria
  const filteredKontrakDeals = kontrakDeals.filter(kontrak => {
    const matchesNoKontrak = kontrak.id.toLowerCase().includes(searchNoKontrak.toLowerCase());
    const matchesPIC = kontrak.pic.toLowerCase().includes(searchPIC.toLowerCase());
    const matchesJenisKontrak = selectedJenisKontrak ? kontrak.jenisKontrak === selectedJenisKontrak : true;
    const matchesLokasiPekerjaan = kontrak.lokasiPekerjaan.toLowerCase().includes(searchLokasiPekerjaan.toLowerCase());
    const matchesStatusKontrak = selectedStatusKontrak ? kontrak.statusPenawaran === selectedStatusKontrak : true;

    // Date filtering logic
    const kontrakDate = new Date(kontrak.tanggalKontrak.split('-').reverse().join('-')); // Convert DD-MM-YYYY to YYYY-MM-DD
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    const matchesDate = (!fromDate || kontrakDate >= fromDate) && (!toDate || kontrakDate <= toDate);

    return matchesNoKontrak && matchesPIC && matchesJenisKontrak && matchesLokasiPekerjaan && matchesStatusKontrak && matchesDate;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredKontrakDeals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredKontrakDeals.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

  const getStatusPenawaranColor = (status: string) => {
    switch (status) {
      case 'Deal': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancel': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 text-sm">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-wide mb-1">
                DAFTAR KONTRAK DEAL
              </h1>
              <nav className="text-xs text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Marketing</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Kontrak Deal</span>
              </nav>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        {/* Filter & Action Panel */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-10 -mt-10"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {/* Cari No Penawaran */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Cari No Kontrak
              </label>
              <input
                type="text"
                value={searchNoKontrak}
                onChange={(e) => setSearchNoKontrak(e.target.value)}
                className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                placeholder="Cari No Kontrak..."
              />
            </div>

            {/* Cari PIC */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Cari PIC
              </label>
              <input
                type="text"
                value={searchPIC}
                onChange={(e) => setSearchPIC(e.target.value)}
                className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                placeholder="Cari PIC..."
              />
            </div>

            {/* Cari Jenis Pekerjaan Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Cari Jenis Pekerjaan
              </label>
              <div className="relative">
                <button
                  onClick={() => setJenisKontrakDropdownOpen(!jenisKontrakDropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white text-xs"
                >
                  <span className={selectedJenisKontrak ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedJenisKontrak || 'Cari Jenis Pekerjaan...'}
                  </span>
                  <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${jenisKontrakDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {jenisKontrakDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        setSelectedJenisKontrak('');
                        setJenisKontrakDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-gray-500 text-xs"
                    >
                      Semua Jenis Pekerjaan
                    </button>
                    {jenisKontrakOptions.map((jenis) => (
                      <button
                        key={jenis}
                        onClick={() => {
                          setSelectedJenisKontrak(jenis);
                          setJenisKontrakDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2 text-xs"
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                        <span>{jenis}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cari Lokasi Kerja */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Cari Lokasi Kerja
              </label>
              <input
                type="text"
                value={searchLokasiPekerjaan}
                onChange={(e) => setSearchLokasiPekerjaan(e.target.value)}
                className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                placeholder="Cari Lokasi Kerja..."
              />
            </div>

            {/* Pilih Status Penawaran Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Pilih Status Penawaran
              </label>
              <div className="relative">
                <button
                  onClick={() => setStatusKontrakDropdownOpen(!statusKontrakDropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white text-xs"
                >
                  <span className={selectedStatusKontrak ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedStatusKontrak || 'Pilih status penawaran...'}
                  </span>
                  <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${statusKontrakDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {statusKontrakDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        setSelectedStatusKontrak('');
                        setStatusKontrakDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-gray-500 text-xs"
                    >
                      Semua Status
                    </button>
                    {statusKontrakOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatusKontrak(status);
                          setStatusKontrakDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2 text-xs"
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

            {/* Periode Dari */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Periode Dari
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Periode Sampai */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Periode Sampai
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Cari Data Button */}
            <div className="flex items-end">
              <button 
                onClick={handleSearch}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 transition-all duration-200 flex items-center justify-center space-x-2 text-xs"
              >
                <Search className="h-3 w-3" />
                <span>Cari</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
            <button 
              onClick={handleAddClick} // Use new handler
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md font-medium transition-all duration-200 hover:shadow-md hover:shadow-blue-600/20 flex items-center space-x-2 text-xs"
            >
              <Plus className="h-3 w-3" />
              <span>Tambah Kontrak Deal</span>
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md font-medium transition-all duration-200 hover:shadow-md hover:shadow-green-600/20 flex items-center space-x-2 text-xs">
              <FileSpreadsheet className="h-3 w-3" />
              <span>Export Excel</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md font-medium transition-all duration-200 hover:shadow-md hover:shadow-red-600/20 flex items-center space-x-2 text-xs">
              <FileText className="h-3 w-3" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Kontrak Deal Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">No</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">No Kontrak</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Nama Client</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">PIC</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Nama Kontrak</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Jenis Kontrak</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Tanggal Kontrak</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Durasi Kontrak</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Nilai Kontrak</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Lokasi Pekerjaan</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Status Penawaran</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((kontrak, index) => (
                  <tr 
                    key={kontrak.id}
                    className={`hover:bg-gray-50 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    } ${animateRows ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`}
                    style={{ 
                      animationDelay: animateRows ? `${index * 100}ms` : '0ms',
                      animationFillMode: 'forwards'
                    }}
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full flex-shrink-0">
                          <Info className="h-2 w-2 text-green-600" />
                        </div>
                        <span className="font-medium text-gray-900 text-xs">{kontrak.no}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-900 text-xs">{kontrak.id}</td>
                    <td className="px-3 py-2 font-medium text-gray-900 text-xs">{kontrak.namaClient}</td>
                    <td className="px-3 py-2 text-gray-600 text-xs">{kontrak.pic}</td>
                    <td className="px-3 py-2 text-gray-600 text-xs">{kontrak.namaKontrak}</td>
                    <td className="px-3 py-2 text-gray-600 text-xs">{kontrak.jenisKontrak}</td>
                    <td className="px-3 py-2 text-gray-600 text-xs">{kontrak.tanggalKontrak}</td>
                    <td className="px-3 py-2 text-gray-600 text-xs">{kontrak.durasiKontrak}</td>
                    <td className="px-3 py-2 text-gray-600 font-medium text-xs">{kontrak.nilaiKontrak}</td>
                    <td className="px-3 py-2 text-gray-600 text-xs">{kontrak.lokasiPekerjaan}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getStatusPenawaranColor(kontrak.statusPenawaran)}`}>
                        {kontrak.statusPenawaran}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button 
                          onClick={() => handleEditClick(kontrak)} // Use new handler
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200">
                          <Edit className="h-3 w-3" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(kontrak)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                        <button 
                          onClick={() => setIsKickOffModalOpen(true)}
                          className="p-1.5 text-green-600 hover:bg-yellow-50 rounded-md transition-all duration-200"
                        >
                          <File className="h-3 w-3" />
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
                Showing {startIndex + 1} to {Math.min(endIndex, filteredKontrakDeals.length)} of {filteredKontrakDeals.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3 w-3" />
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
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kontrak Deal Modal */}
      <KontrakDealModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingKontrakDeal(null); }} // Reset editing state on close
        onSave={handleSaveKontrakDeal} // Use updated save handler
        initialData={editingKontrakDeal} // Pass initial data for editing
        title={editingKontrakDeal ? 'Edit Kontrak Deal' : 'Entry Kontrak Deal'} // Dynamic title
      />

      {/* Kick Off Modal */}
      <KickOffModal
        isOpen={isKickOffModalOpen}
        onClose={() => setIsKickOffModalOpen(false)}
        onSave={handleKickOffSave}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.namaKontrak}
      />
    </div>
    </>
  );
};

export default KontrakDealDashboard;
