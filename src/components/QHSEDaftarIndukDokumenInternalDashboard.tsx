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
    setModalMode('add');
    setShowModal(true);
  };

  const openEditModal = (dokumen: DokumenInternal) => {
    setSelectedDokumen(dokumen);
    setModalMode('edit');
    setShowModal(true);
  };

  const openViewModal = (dokumen: DokumenInternal) => {
    setSelectedDokumen(dokumen);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setDokumenData(prev => prev.filter(item => item.id !== id));
    setShowDeleteConfirm(false);
  };

  const handleSave = (dokumenData: Partial<DokumenInternal>) => {
    if (modalMode === 'add') {
      const newId = Math.max(...dokumenData.map(d => d.id)) + 1;
      const newNo = Math.max(...dokumenData.map(d => d.no)) + 1;
      const newDokumen: DokumenInternal = {
        id: newId,
        no: newNo,
        namaDokumen: dokumenData.namaDokumen || '',
        nomorDokumen: dokumenData.nomorDokumen || '',
        jenisDokumen: dokumenData.jenisDokumen || '',
        noRevisi: dokumenData.noRevisi || '',
        tanggalBerlaku: dokumenData.tanggalBerlaku || '',
        lamaWaktuSimpan: dokumenData.lamaWaktuSimpan || '',
        status: dokumenData.status || 'Aktif'
      };
      setDokumenData(prev => [...prev, newDokumen]);
    } else if (modalMode === 'edit' && selectedDokumen) {
      setDokumenData(prev => prev.map(item => 
        item.id === selectedDokumen.id 
          ? { ...item, ...dokumenData }
          : item
      ));
    }
    setShowModal(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
     {/* Header */}
     <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="bg-gradient-to-r from-white-600 to-white-700 text-dark p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">DAFTAR INDUK DOKUMEN INTERNAL</h1>
              {/* <p className="text-gray-100">PT. Gamma Buana Persada | Dept. QHSE</p> */}
            </div>
          </div>
        </div>
      </div>

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
  );
};

export default QHSEDaftarIndukDokumenInternalDashboard;
