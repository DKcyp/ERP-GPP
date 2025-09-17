import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  ChevronUp,
  ChevronDown,
  FileText,
  Calendar,
  Building2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Interface untuk data dokumen internal
interface DokumenInternal {
  id: number;
  no: number;
  namaDokumen: string;
  nomorDokumen: string;
  jenisDokumen: string;
  noRevisi: string;
  tanggalBerlaku: string;
  lamaWaktuSimpan: string;
  status: 'Aktif' | 'Mendekati Expired' | 'Tidak Berlaku';
}

// Sample data dokumen internal
const sampleDokumenInternal: DokumenInternal[] = [
  {
    id: 1,
    no: 1,
    namaDokumen: "IM Closing Report di ACTS setiap tgl 5 tiap bulannya",
    nomorDokumen: "GBP-MR-FM-06",
    jenisDokumen: "Formulir",
    noRevisi: "02",
    tanggalBerlaku: "2015-03-04",
    lamaWaktuSimpan: "5 tahun",
    status: "Aktif"
  },
  {
    id: 2,
    no: 2,
    namaDokumen: "IM Mapping Pendapatan GBP,BHI,PPKM",
    nomorDokumen: "GBP-MR-FM-06",
    jenisDokumen: "Formulir",
    noRevisi: "02",
    tanggalBerlaku: "2015-03-04",
    lamaWaktuSimpan: "5 tahun",
    status: "Aktif"
  },
  {
    id: 3,
    no: 3,
    namaDokumen: "IM Nominal Asset Savagroup",
    nomorDokumen: "GBP-MR-FM-06",
    jenisDokumen: "Formulir",
    noRevisi: "02",
    tanggalBerlaku: "2015-03-04",
    lamaWaktuSimpan: "5 tahun",
    status: "Mendekati Expired"
  },
  {
    id: 4,
    no: 4,
    namaDokumen: "Form Pemohonan Barang (PB)",
    nomorDokumen: "GBP-FA-FM-01-01",
    jenisDokumen: "Formulir",
    noRevisi: "0",
    tanggalBerlaku: "2023-01-01",
    lamaWaktuSimpan: "3 tahun",
    status: "Aktif"
  },
  {
    id: 5,
    no: 5,
    namaDokumen: "Form Kontrak Hutang (PKH)",
    nomorDokumen: "GBP-FA-FM-01-02",
    jenisDokumen: "Formulir",
    noRevisi: "0",
    tanggalBerlaku: "2023-01-01",
    lamaWaktuSimpan: "Permanen",
    status: "Aktif"
  },
  {
    id: 6,
    no: 6,
    namaDokumen: "Form Laporan Pembayaran Hutang",
    nomorDokumen: "GBP-FA-FM-01-03",
    jenisDokumen: "Formulir",
    noRevisi: "0",
    tanggalBerlaku: "2023-01-01",
    lamaWaktuSimpan: "5 tahun",
    status: "Tidak Berlaku"
  },
  {
    id: 7,
    no: 7,
    namaDokumen: "Form Laporan Hutang Belum Lunas",
    nomorDokumen: "GBP-FA-FM-01-04",
    jenisDokumen: "Formulir",
    noRevisi: "0",
    tanggalBerlaku: "2023-01-01",
    lamaWaktuSimpan: "5 tahun",
    status: "Aktif"
  },
  {
    id: 8,
    no: 8,
    namaDokumen: "Form Laporan Pembelian Barang Gudang (LPB)",
    nomorDokumen: "GBP-FA-FM-01-05",
    jenisDokumen: "Formulir",
    noRevisi: "0",
    tanggalBerlaku: "2023-01-01",
    lamaWaktuSimpan: "3 tahun",
    status: "Mendekati Expired"
  }
];

const QHSEDaftarIndukDokumenInternalDashboard: React.FC = () => {
  const [dokumenData, setDokumenData] = useState<DokumenInternal[]>(sampleDokumenInternal);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState<keyof DokumenInternal>('no');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedDokumen, setSelectedDokumen] = useState<DokumenInternal | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<DokumenInternal>>({
    namaDokumen: '',
    nomorDokumen: '',
    jenisDokumen: '',
    noRevisi: '',
    tanggalBerlaku: '',
    lamaWaktuSimpan: '',
    status: 'Aktif'
  });

  // Format tanggal ke format Indonesia
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aktif':
        return 'bg-green-100 border-green-200';
      case 'Mendekati Expired':
        return 'bg-yellow-100 border-yellow-200';
      case 'Tidak Berlaku':
        return 'bg-red-100 border-red-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Aktif':
        return 'bg-green-500 text-white';
      case 'Mendekati Expired':
        return 'bg-yellow-500 text-white';
      case 'Tidak Berlaku':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Get unique values for filters
  const uniqueJenis = useMemo(() => [...new Set(dokumenData.map(item => item.jenisDokumen))], [dokumenData]);
  const uniqueStatus = useMemo(() => [...new Set(dokumenData.map(item => item.status))], [dokumenData]);

  // Filter dan sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = dokumenData.filter(item => {
      const matchesSearch = 
        item.namaDokumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nomorDokumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jenisDokumen.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesJenis = filterJenis === '' || item.jenisDokumen === filterJenis;
      const matchesStatus = filterStatus === '' || item.status === filterStatus;
      
      return matchesSearch && matchesJenis && matchesStatus;
    });

    // Sort data
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    return filtered;
  }, [dokumenData, searchTerm, filterJenis, filterStatus, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);

  // Handle sort
  const handleSort = (field: keyof DokumenInternal) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Statistics
  const stats = {
    total: dokumenData.length,
    aktif: dokumenData.filter(d => d.status === 'Aktif').length,
    mendekatiBerlaku: dokumenData.filter(d => d.status === 'Mendekati Expired').length,
    tidakBerlaku: dokumenData.filter(d => d.status === 'Tidak Berlaku').length
  };

  // CRUD Functions
  const openAddModal = () => {
    setSelectedDokumen(null);
    setFormData({
      namaDokumen: '',
      nomorDokumen: '',
      jenisDokumen: '',
      noRevisi: '',
      tanggalBerlaku: '',
      lamaWaktuSimpan: '',
      status: 'Aktif'
    });
    setModalMode('add');
    setShowModal(true);
  };

  const openEditModal = (dokumen: DokumenInternal) => {
    setSelectedDokumen(dokumen);
    setFormData({
      namaDokumen: dokumen.namaDokumen,
      nomorDokumen: dokumen.nomorDokumen,
      jenisDokumen: dokumen.jenisDokumen,
      noRevisi: dokumen.noRevisi,
      tanggalBerlaku: dokumen.tanggalBerlaku,
      lamaWaktuSimpan: dokumen.lamaWaktuSimpan,
      status: dokumen.status
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const openViewModal = (dokumen: DokumenInternal) => {
    setSelectedDokumen(dokumen);
    setFormData({
      namaDokumen: dokumen.namaDokumen,
      nomorDokumen: dokumen.nomorDokumen,
      jenisDokumen: dokumen.jenisDokumen,
      noRevisi: dokumen.noRevisi,
      tanggalBerlaku: dokumen.tanggalBerlaku,
      lamaWaktuSimpan: dokumen.lamaWaktuSimpan,
      status: dokumen.status
    });
    setModalMode('view');
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setDokumenData(prev => prev.filter(item => item.id !== id));
    setShowDeleteConfirm(false);
    setSelectedDokumen(null);
  };

  const handleSave = () => {
    if (modalMode === 'add') {
      const newId = dokumenData.length > 0 ? Math.max(...dokumenData.map(d => d.id)) + 1 : 1;
      const newNo = dokumenData.length > 0 ? Math.max(...dokumenData.map(d => d.no)) + 1 : 1;
      const newDokumen: DokumenInternal = {
        id: newId,
        no: newNo,
        namaDokumen: formData.namaDokumen || '',
        nomorDokumen: formData.nomorDokumen || '',
        jenisDokumen: formData.jenisDokumen || '',
        noRevisi: formData.noRevisi || '',
        tanggalBerlaku: formData.tanggalBerlaku || '',
        lamaWaktuSimpan: formData.lamaWaktuSimpan || '',
        status: formData.status || 'Aktif'
      };
      setDokumenData(prev => [...prev, newDokumen]);
    } else if (modalMode === 'edit' && selectedDokumen) {
      setDokumenData(prev => prev.map(item => 
        item.id === selectedDokumen.id 
          ? { ...item, ...formData }
          : item
      ));
    }
    setShowModal(false);
    setFormData({
      namaDokumen: '',
      nomorDokumen: '',
      jenisDokumen: '',
      noRevisi: '',
      tanggalBerlaku: '',
      lamaWaktuSimpan: '',
      status: 'Aktif'
    });
  };

  const handleInputChange = (field: keyof DokumenInternal, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-50 to-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-8 w-8 text-green-600" />
                    <h1 className="text-4xl font-bold text-gray-900 tracking-wide">
                      DAFTAR INDUK DOKUMEN INTERNAL
                    </h1>
                  </div>
                  <nav className="text-sm text-gray-600">
                    <span>Dashboard</span> <span className="mx-2">›</span>
                    <span>QHSE</span> <span className="mx-2">›</span>
                    <span className="text-green-600 font-medium">Dokumen Internal</span>
                  </nav>
                </div>
                
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 py-8">

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Cari dokumen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            {/* Filter Jenis */}
            <select
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Semua Jenis</option>
              {uniqueJenis.map(jenis => (
                <option key={jenis} value={jenis}>{jenis}</option>
              ))}
            </select>

            {/* Filter Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Semua Status</option>
              {uniqueStatus.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            {/* Export Buttons */}
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="h-4 w-4" />
              Excel
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <Download className="h-4 w-4" />
              PDF
            </button>
            
            {/* Add Button */}
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Tambah Dokumen
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-white text-dark">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('no')}
                >
                  <div className="flex items-center gap-1">
                    No.
                    {sortField === 'no' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('namaDokumen')}
                >
                  <div className="flex items-center gap-1">
                    Nama Dokumen
                    {sortField === 'namaDokumen' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('nomorDokumen')}
                >
                  <div className="flex items-center gap-1">
                    Nomor Dokumen
                    {sortField === 'nomorDokumen' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('jenisDokumen')}
                >
                  <div className="flex items-center gap-1">
                    Jenis Dokumen
                    {sortField === 'jenisDokumen' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('noRevisi')}
                >
                  <div className="flex items-center gap-1">
                    No. Revisi
                    {sortField === 'noRevisi' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('tanggalBerlaku')}
                >
                  <div className="flex items-center gap-1">
                    Tanggal Berlaku
                    {sortField === 'tanggalBerlaku' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('lamaWaktuSimpan')}
                >
                  <div className="flex items-center gap-1">
                    Lama Waktu Simpan
                    {sortField === 'lamaWaktuSimpan' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((dokumen) => (
                <tr key={dokumen.id} className={`${getStatusColor(dokumen.status)} hover:bg-opacity-75 transition-colors`}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {dokumen.no}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="truncate" title={dokumen.namaDokumen}>
                      {dokumen.namaDokumen}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dokumen.nomorDokumen}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dokumen.jenisDokumen}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dokumen.noRevisi}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(dokumen.tanggalBerlaku)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dokumen.lamaWaktuSimpan}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(dokumen.status)}`}>
                      {dokumen.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openViewModal(dokumen)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Lihat"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(dokumen)}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDokumen(dokumen);
                          setShowDeleteConfirm(true);
                        }}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-700">
                Menampilkan <span className="font-medium">{startIndex + 1}</span> sampai{' '}
                <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredAndSortedData.length)}</span> dari{' '}
                <span className="font-medium">{filteredAndSortedData.length}</span> hasil
              </p>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={5}>5 per halaman</option>
                <option value={10}>10 per halaman</option>
                <option value={25}>25 per halaman</option>
                <option value={50}>50 per halaman</option>
              </select>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-red-50 border-red-500 text-red-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {modalMode === 'add' ? 'Tambah Dokumen Internal' : 
                   modalMode === 'edit' ? 'Edit Dokumen Internal' : 'Detail Dokumen Internal'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  ✕
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Dokumen *
                    </label>
                    <input
                      type="text"
                      value={formData.namaDokumen || ''}
                      onChange={(e) => handleInputChange('namaDokumen', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor Dokumen *
                    </label>
                    <input
                      type="text"
                      value={formData.nomorDokumen || ''}
                      onChange={(e) => handleInputChange('nomorDokumen', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jenis Dokumen *
                    </label>
                    <select
                      value={formData.jenisDokumen || ''}
                      onChange={(e) => handleInputChange('jenisDokumen', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                      required
                    >
                      <option value="">Pilih Jenis Dokumen</option>
                      <option value="Formulir">Formulir</option>
                      <option value="Prosedur">Prosedur</option>
                      <option value="Instruksi Kerja">Instruksi Kerja</option>
                      <option value="SOP">SOP</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      No. Revisi *
                    </label>
                    <input
                      type="text"
                      value={formData.noRevisi || ''}
                      onChange={(e) => handleInputChange('noRevisi', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Berlaku *
                    </label>
                    <input
                      type="date"
                      value={formData.tanggalBerlaku || ''}
                      onChange={(e) => handleInputChange('tanggalBerlaku', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lama Waktu Simpan *
                    </label>
                    <select
                      value={formData.lamaWaktuSimpan || ''}
                      onChange={(e) => handleInputChange('lamaWaktuSimpan', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                      required
                    >
                      <option value="">Pilih Lama Waktu Simpan</option>
                      <option value="1 tahun">1 tahun</option>
                      <option value="2 tahun">2 tahun</option>
                      <option value="3 tahun">3 tahun</option>
                      <option value="5 tahun">5 tahun</option>
                      <option value="10 tahun">10 tahun</option>
                      <option value="Permanen">Permanen</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      value={formData.status || ''}
                      onChange={(e) => handleInputChange('status', e.target.value as 'Aktif' | 'Mendekati Expired' | 'Tidak Berlaku')}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                      required
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Mendekati Expired">Mendekati Expired</option>
                      <option value="Tidak Berlaku">Tidak Berlaku</option>
                    </select>
                  </div>
                </div>

                {modalMode !== 'view' && (
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {modalMode === 'add' ? 'Tambah' : 'Simpan'}
                    </button>
                  </div>
                )}

                {modalMode === 'view' && (
                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Tutup
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedDokumen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-2">Hapus Dokumen</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Apakah Anda yakin ingin menghapus dokumen "{selectedDokumen.namaDokumen}"? 
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex gap-3 justify-center mt-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(selectedDokumen.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    // </div>
    
  );
};


export default QHSEDaftarIndukDokumenInternalDashboard;
