import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Eye,
  Calendar,
  FileText,
  Building2,
  MapPin,
  Hash,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  ArrowUpDown,
  Upload,
  X,
  File
} from 'lucide-react';

interface DocumentRecord {
  id: string;
  no: number;
  namaDokumen: string;
  nomorDokumen: string;
  departemen: string;
  lokasi: string;
  revisiKe: string;
  tanggalDibuat: string;
  tanggalBerlaku: string;
  sampaiMasaBerlaku: string;
  hasilReview: string;
  uploadDokumen: string;
  status: 'Valid' | 'Mendekati Expired' | 'Expired';
  keterangan?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Valid':
      return 'bg-green-100 text-green-800';
    case 'Mendekati Expired':
      return 'bg-yellow-100 text-yellow-800';
    case 'Expired':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const initialDocumentData: DocumentRecord[] = [
  {
    id: '1',
    no: 1,
    namaDokumen: 'PPH PSL 23',
    nomorDokumen: 'KEP-50/PJ/1994',
    departemen: 'FA',
    lokasi: 'FA',
    revisiKe: '-',
    tanggalDibuat: '1994-10-15',
    tanggalBerlaku: '1994-12-27',
    sampaiMasaBerlaku: '2025-12-27',
    hasilReview: 'Dokumen masih berlaku dan sesuai regulasi terbaru',
    uploadDokumen: 'PPH_PSL_23.pdf',
    status: 'Valid'
  },
  {
    id: '2',
    no: 2,
    namaDokumen: 'PPH PASAL 4 AYAT 2',
    nomorDokumen: 'Peraturan Pemerintah No. 29 Thn 1996 jo PP No.65 thn 2001',
    departemen: 'FA',
    lokasi: 'FA',
    revisiKe: '-',
    tanggalDibuat: '2001-12-01',
    tanggalBerlaku: '2002-03-22',
    sampaiMasaBerlaku: '2025-03-22',
    hasilReview: 'Perlu update sesuai peraturan terbaru',
    uploadDokumen: 'PPH_PASAL_4_AYAT_2.pdf',
    status: 'Valid'
  },
  {
    id: '3',
    no: 3,
    namaDokumen: 'PPH PASAL 26',
    nomorDokumen: 'UU No.36 Tahun2008',
    departemen: 'FA',
    lokasi: 'FA',
    revisiKe: '-',
    tanggalDibuat: '2008-07-01',
    tanggalBerlaku: '2008-09-23',
    sampaiMasaBerlaku: '2025-09-23',
    hasilReview: 'Dokumen valid dan dapat digunakan',
    uploadDokumen: 'PPH_PASAL_26.pdf',
    status: 'Valid'
  },
  {
    id: '4',
    no: 4,
    namaDokumen: 'PPh Psl 21',
    nomorDokumen: 'Tahun 2022',
    departemen: 'FA',
    lokasi: 'FA',
    revisiKe: '-',
    tanggalDibuat: '2022-08-01',
    tanggalBerlaku: '2022-09-20',
    sampaiMasaBerlaku: '2025-09-20',
    hasilReview: 'Dokumen terbaru dan sesuai standar',
    uploadDokumen: 'PPh_Psl_21_2022.pdf',
    status: 'Valid'
  },
  {
    id: '5',
    no: 5,
    namaDokumen: 'Keselamatan kerja',
    nomorDokumen: 'UU 1 Tahun 1970',
    departemen: 'HRD',
    lokasi: 'HRD',
    revisiKe: '-',
    tanggalDibuat: '1969-11-01',
    tanggalBerlaku: '1970-01-12',
    sampaiMasaBerlaku: '2024-01-12',
    hasilReview: 'Dokumen sudah expired, perlu pembaruan',
    uploadDokumen: 'UU_Keselamatan_Kerja_1970.pdf',
    status: 'Expired'
  },
  {
    id: '6',
    no: 6,
    namaDokumen: 'Badan penyelenggaraan jaminan sosial',
    nomorDokumen: 'UU 24 tahun 2011',
    departemen: 'HRD',
    lokasi: 'HRD',
    revisiKe: '-',
    tanggalDibuat: '2011-09-01',
    tanggalBerlaku: '2011-11-25',
    sampaiMasaBerlaku: '2025-11-25',
    hasilReview: 'Dokumen masih berlaku untuk jaminan sosial',
    uploadDokumen: 'UU_BPJS_2011.pdf',
    status: 'Valid'
  },
  {
    id: '7',
    no: 7,
    namaDokumen: 'Kesehatan',
    nomorDokumen: 'UU 36 tahun 2009',
    departemen: 'HRD',
    lokasi: 'HRD',
    revisiKe: '-',
    tanggalDibuat: '2009-08-01',
    tanggalBerlaku: '2009-10-13',
    sampaiMasaBerlaku: '2025-10-13',
    hasilReview: 'Regulasi kesehatan masih berlaku',
    uploadDokumen: 'UU_Kesehatan_2009.pdf',
    status: 'Valid'
  },
  {
    id: '8',
    no: 8,
    namaDokumen: 'Ketenagakerjaan',
    nomorDokumen: 'UU 13 tahun 2003',
    departemen: 'HRD',
    lokasi: 'HRD',
    revisiKe: '-',
    tanggalDibuat: '2003-01-15',
    tanggalBerlaku: '2003-03-25',
    sampaiMasaBerlaku: '2025-03-25',
    hasilReview: 'UU Ketenagakerjaan masih berlaku',
    uploadDokumen: 'UU_Ketenagakerjaan_2003.pdf',
    status: 'Valid'
  },
  {
    id: '9',
    no: 9,
    namaDokumen: 'Jaminan sosial tenaga kerja',
    nomorDokumen: 'UU 03 tahun 1992',
    departemen: 'HRD',
    lokasi: 'HRD',
    revisiKe: '-',
    tanggalDibuat: '1991-12-01',
    tanggalBerlaku: '1992-02-17',
    sampaiMasaBerlaku: '2025-02-17',
    hasilReview: 'Dokumen mendekati expired, perlu review',
    uploadDokumen: 'UU_Jamsostek_1992.pdf',
    status: 'Mendekati Expired'
  },
  {
    id: '10',
    no: 10,
    namaDokumen: 'Lalu lintas dan angkutan jalan',
    nomorDokumen: 'UU 22 tahun 2009',
    departemen: 'QHSE',
    lokasi: 'QHSE',
    revisiKe: '-',
    tanggalDibuat: '2009-04-01',
    tanggalBerlaku: '2009-06-22',
    sampaiMasaBerlaku: '2025-06-22',
    hasilReview: 'Dokumen lalu lintas masih berlaku',
    uploadDokumen: 'UU_Lalin_2009.pdf',
    status: 'Valid'
  }
];

const QHSEDaftarIndukDokumenEksternalDashboard: React.FC = () => {
  const [documentData, setDocumentData] = useState<DocumentRecord[]>(initialDocumentData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartemen, setFilterDepartemen] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState<keyof DocumentRecord>('no');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedRecord, setSelectedRecord] = useState<DocumentRecord | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<DocumentRecord>>({});
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Get unique departments for filter
  const departments = useMemo(() => {
    const unique = Array.from(new Set(documentData.map(item => item.departemen)));
    return unique.sort();
  }, [documentData]);

  // Filter and search data
  const filteredData = useMemo(() => {
    return documentData.filter(doc => {
      const matchesSearch = searchTerm === '' || 
        doc.namaDokumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.nomorDokumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.departemen.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartemen = filterDepartemen === '' || doc.departemen === filterDepartemen;
      const matchesStatus = filterStatus === '' || doc.status === filterStatus;
      
      return matchesSearch && matchesDepartemen && matchesStatus;
    });
  }, [documentData, searchTerm, filterDepartemen, filterStatus]);

  // Sort data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: keyof DocumentRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ no: documentData.length + 1 });
    setShowModal(true);
  };

  const openEditModal = (record: DocumentRecord) => {
    setModalMode('edit');
    setSelectedRecord(record);
    setFormData(record);
    setShowModal(true);
  };

  const openViewModal = (record: DocumentRecord) => {
    setModalMode('view');
    setSelectedRecord(record);
    setFormData(record);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMode('add');
    setSelectedRecord(null);
    setFormData({});
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  // File upload handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (PDF, DOC, DOCX)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        setFormData(prev => ({ ...prev, uploadDokumen: file.name }));
      } else {
        alert('Hanya file PDF, DOC, atau DOCX yang diizinkan!');
      }
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate file upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    
    // In real implementation, this would be an API call
    // await uploadFileToServer(selectedFile);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFormData(prev => ({ ...prev, uploadDokumen: '' }));
    setUploadProgress(0);
  };

  const handleSave = () => {
    if (modalMode === 'add') {
      const newRecord: DocumentRecord = {
        id: String(Date.now()),
        ...formData as DocumentRecord
      };
      setDocumentData(prev => [...prev, newRecord]);
    } else if (modalMode === 'edit' && selectedRecord) {
      setDocumentData(prev => prev.map(item => 
        item.id === selectedRecord.id ? { ...item, ...formData } : item
      ));
    }
    closeModal();
  };

  const confirmDelete = () => {
    if (deleteId) {
      setDocumentData(prev => prev.filter(item => item.id !== deleteId));
    }
    setShowDeleteConfirm(false);
    setDeleteId(null);
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
                  DAFTAR INDUK DOKUMEN EKSTERNAL
                </h1>
              </div>
              <nav className="text-sm text-gray-600">
                <span>Dashboard</span> <span className="mx-2">›</span>
                <span>QHSE</span> <span className="mx-2">›</span>
                <span className="text-green-600 font-medium">Dokumen Eksternal</span>
              </nav>
            </div>
            
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Cari dokumen, nomor, atau departemen..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Filters */}
                <div className="flex gap-3">
                  <select
                    value={filterDepartemen}
                    onChange={(e) => setFilterDepartemen(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Semua Departemen</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Semua Status</option>
                    <option value="Valid">Valid</option>
                    <option value="Mendekati Expired">Mendekati Expired</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={openAddModal}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Document
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Excel
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Document Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-green-100">
                  <th 
                    className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 text-center cursor-pointer hover:bg-green-200"
                    onClick={() => handleSort('no')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      No
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th 
                    className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 text-center cursor-pointer hover:bg-green-200"
                    onClick={() => handleSort('namaDokumen')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Nama Dokumen
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th 
                    className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 text-center cursor-pointer hover:bg-green-200"
                    onClick={() => handleSort('nomorDokumen')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Nomor Dokumen / Peraturan
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th 
                    className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 text-center cursor-pointer hover:bg-green-200"
                    onClick={() => handleSort('departemen')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Departemen
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th 
                    className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 text-center cursor-pointer hover:bg-green-200"
                    onClick={() => handleSort('lokasi')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Lokasi
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th 
                    className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 text-center cursor-pointer hover:bg-green-200"
                    onClick={() => handleSort('revisiKe')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Revisi ke / Terbitan
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th 
                    className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 text-center cursor-pointer hover:bg-green-200"
                    onClick={() => handleSort('tanggal')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Tanggal
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((record) => (
                  <tr key={record.id} className={`hover:bg-gray-50 ${getStatusColor(record.status)}`}>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-center">
                      {record.no}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {record.namaDoumen}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {record.nomorDokumen}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {record.departemen}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {record.lokasi}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-center">
                      {record.revisiKe}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-center">
                      {formatDate(record.tanggal)}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openViewModal(record)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(record)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(record.id);
                            setShowDeleteConfirm(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
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
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(startIndex + itemsPerPage, sortedData.length)}
                    </span>{" "}
                    of <span className="font-medium">{sortedData.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? "z-10 bg-green-50 border-green-500 text-green-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-2">Konfirmasi Hapus</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Apakah Anda yakin ingin menghapus dokumen ini? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex items-center justify-center pt-4 space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border max-w-3xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {modalMode === 'add' ? 'Tambah Dokumen Eksternal' : 
                 modalMode === 'edit' ? 'Edit Dokumen Eksternal' : 'Detail Dokumen Eksternal'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* No Urut */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No Urut *
                  </label>
                  <input
                    type="number"
                    value={formData.no || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, no: parseInt(e.target.value) || 0 }))}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                    placeholder="Nomor urut dokumen"
                  />
                </div>

                {/* Nama Dokumen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Dokumen *
                  </label>
                  <input
                    type="text"
                    value={formData.namaDokumen || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, namaDokumen: e.target.value }))}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                    placeholder="Masukkan nama dokumen"
                  />
                </div>

                {/* Nomor Dokumen */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Dokumen / Peraturan *
                  </label>
                  <input
                    type="text"
                    value={formData.nomorDokumen || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, nomorDokumen: e.target.value }))}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                    placeholder="Masukkan nomor dokumen atau peraturan"
                  />
                </div>

                {/* Departemen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departemen *
                  </label>
                  <select
                    value={formData.departemen || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, departemen: e.target.value }))}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  >
                    <option value="">Pilih Departemen</option>
                    <option value="FA">FA (Finance & Accounting)</option>
                    <option value="HRD">HRD (Human Resources)</option>
                    <option value="QHSE">QHSE (Quality, Health, Safety & Environment)</option>
                    <option value="IT">IT (Information Technology)</option>
                    <option value="GA">GA (General Affairs)</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operational">Operational</option>
                  </select>
                </div>

                {/* Lokasi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lokasi *
                  </label>
                  <select
                    value={formData.lokasi || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, lokasi: e.target.value }))}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  >
                    <option value="">Pilih Lokasi</option>
                    <option value="FA">FA</option>
                    <option value="HRD">HRD</option>
                    <option value="QHSE">QHSE</option>
                    <option value="IT">IT</option>
                    <option value="GA">GA</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operational">Operational</option>
                    <option value="Arsip Pusat">Arsip Pusat</option>
                  </select>
                </div>

                {/* Revisi Ke */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Revisi ke / Terbitan
                  </label>
                  <input
                    type="text"
                    value={formData.revisiKe || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, revisiKe: e.target.value }))}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                    placeholder="Contoh: Rev. 01, Edisi 2, atau -"
                  />
                </div>

                {/* Tanggal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Berlaku *
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, tanggal: e.target.value }))}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'Valid' | 'Mendekati Expired' | 'Expired' }))}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  >
                    <option value="">Pilih Status</option>
                    <option value="Valid">Valid</option>
                    <option value="Mendekati Expired">Mendekati Expired</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>

                {/* Tanggal Dibuat */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Dibuat *
                  </label>
                  <input
                    type="date"
                    value={formData.tanggalDibuat || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, tanggalDibuat: e.target.value }))}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  />
                </div>

                {/* Sampai Masa Berlaku */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sampai Masa Berlaku *
                  </label>
                  <input
                    type="date"
                    value={formData.sampaiMasaBerlaku || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, sampaiMasaBerlaku: e.target.value }))}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  />
                </div>

                {/* Hasil Review */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hasil Review
                  </label>
                  <textarea
                    value={formData.hasilReview || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, hasilReview: e.target.value }))}
                    disabled={modalMode === 'view'}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                    placeholder="Masukkan hasil review dokumen..."
                  />
                </div>

                {/* Upload Dokumen */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Dokumen
                  </label>
                  {modalMode !== 'view' && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Pilih File
                        </label>
                        {selectedFile && (
                          <div className="flex items-center space-x-2">
                            <File className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-700">{selectedFile.name}</span>
                            <button
                              type="button"
                              onClick={removeFile}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      {selectedFile && !isUploading && uploadProgress < 100 && (
                        <button
                          type="button"
                          onClick={handleFileUpload}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          Upload File
                        </button>
                      )}
                      {isUploading && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  )}
                  {modalMode === 'view' && formData.uploadDokumen && (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                      <File className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700">{formData.uploadDokumen}</span>
                    </div>
                  )}
                </div>

                {/* Keterangan */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keterangan
                  </label>
                  <textarea
                    value={formData.keterangan || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, keterangan: e.target.value }))}
                    disabled={modalMode === 'view'}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                    placeholder="Catatan tambahan tentang dokumen..."
                  />
                </div>
              </div>
            </form>

            {/* Modal Actions */}
            {modalMode !== 'view' && (
              <div className="flex items-center justify-end pt-6 space-x-3 border-t mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {modalMode === 'add' ? 'Tambah' : 'Simpan'}
                </button>
              </div>
            )}
            {modalMode === 'view' && (
              <div className="flex items-center justify-end pt-6 border-t mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QHSEDaftarIndukDokumenEksternalDashboard;
