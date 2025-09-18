import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Eye,
  Calendar,
  Shield,
  HardHat,
  Glasses,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';

interface APDRecord {
  id: string;
  nama: string;
  safetyShoes: {
    tanggal: string;
    ukuran: string;
    jumlah: number;
    status: 'Valid' | 'Mendekati Expired' | 'Expired';
    komentar?: string;
  };
  wearpackMerah: {
    tanggal: string;
    ukuran: string;
    jumlah: number;
    status: 'Valid' | 'Mendekati Expired' | 'Expired';
    komentar?: string;
  };
  wearpackBiru: {
    tanggal: string;
    ukuran: string;
    jumlah: number;
    status: 'Valid' | 'Mendekati Expired' | 'Expired';
    komentar?: string;
  };
  safetyGlassClear: {
    tanggal: string;
    jumlah: number;
    status: 'Valid' | 'Mendekati Expired' | 'Expired';
    komentar?: string;
  };
  safetyGlassDark: {
    tanggal: string;
    jumlah: number;
    status: 'Valid' | 'Mendekati Expired' | 'Expired';
    komentar?: string;
  };
  halfmaskRespirator: {
    tanggal: string;
    jumlah: number;
    status: 'Valid' | 'Mendekati Expired' | 'Expired';
    komentar?: string;
  };
  fullMaskRespirator: {
    tanggal: string;
    jumlah: number;
    status: 'Valid' | 'Mendekati Expired' | 'Expired';
    komentar?: string;
  };
  safetyGoggle: {
    tanggal: string;
    jumlah: number;
    status: 'Valid' | 'Mendekati Expired' | 'Expired';
    komentar?: string;
  };
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

const initialAPDData: APDRecord[] = [
  {
    id: '1',
    nama: 'Abu Bakar Teguh',
    safetyShoes: {
      tanggal: '26-Aug-20',
      ukuran: '8',
      jumlah: 1,
      status: 'Expired',
      komentar: 'Sudah bolong bagian bawah 07-2023'
    },
    wearpackMerah: {
      tanggal: '10-Dec-21',
      ukuran: 'L',
      jumlah: 1,
      status: 'Valid'
    },
    wearpackBiru: {
      tanggal: '26-Aug-20',
      ukuran: 'L',
      jumlah: 1,
      status: 'Expired'
    },
    safetyGlassClear: {
      tanggal: '12-Jan-22',
      jumlah: 1,
      status: 'Valid'
    },
    safetyGlassDark: {
      tanggal: '30-Jun-21',
      jumlah: 1,
      status: 'Mendekati Expired'
    },
    halfmaskRespirator: {
      tanggal: '28/06/2023',
      jumlah: 1,
      status: 'Valid'
    },
    fullMaskRespirator: {
      tanggal: '18/07/2022',
      jumlah: 1,
      status: 'Mendekati Expired'
    },
    safetyGoggle: {
      tanggal: '15-Mar-23',
      jumlah: 1,
      status: 'Valid'
    }
  },
  // Add more sample data...
];

const QHSEMonitoringAPDDashboard: React.FC = () => {
  const [apdData, setApdData] = useState<APDRecord[]>(initialAPDData);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedRecord, setSelectedRecord] = useState<APDRecord | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<APDRecord>>({});

  // Filter data
  const filteredData = apdData.filter((item) => {
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const openAddModal = () => {
    setModalMode('add');
    setFormData({});
    setShowModal(true);
  };

  const openEditModal = (record: APDRecord) => {
    setModalMode('edit');
    setSelectedRecord(record);
    setFormData(record);
    setShowModal(true);
  };

  const openViewModal = (record: APDRecord) => {
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
  };

  const handleSave = () => {
    if (modalMode === 'add') {
      const newRecord: APDRecord = {
        id: String(Date.now()),
        ...formData as APDRecord
      };
      setApdData(prev => [...prev, newRecord]);
    } else if (modalMode === 'edit' && selectedRecord) {
      setApdData(prev => prev.map(item => 
        item.id === selectedRecord.id ? { ...item, ...formData } : item
      ));
    }
    closeModal();
  };

  const confirmDelete = () => {
    if (deleteId) {
      setApdData(prev => prev.filter(item => item.id !== deleteId));
    }
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <HardHat className="h-8 w-8 text-blue-600" />
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide">
                  PEMBAGIAN APD RECORD
                </h1>
              </div>
              <nav className="text-sm text-gray-600">
                <span>Dashboard</span> <span className="mx-2">›</span>
                <span>QHSE</span> <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Monitoring APD</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan Nama atau Jenis APD..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={openAddModal}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Record
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* APD Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-left" rowSpan={2}>
                    NAMA
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center" colSpan={3}>
                    SAFETY SHOES
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center" colSpan={3}>
                    WEARPACK/COVERALL<br/>(MERAH)
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center" colSpan={3}>
                    WEARPACK/COVERALL<br/>(BIRU)
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 text-center" rowSpan={2}>
                    AKSI
                  </th>
                </tr>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 text-center">Tanggal</th>
                  <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 text-center">Ukuran</th>
                  <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 text-center">Jumlah</th>
                  <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 text-center">Tanggal</th>
                  <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 text-center">Ukuran</th>
                  <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 text-center">Jumlah</th>
                  <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 text-center">Tanggal</th>
                  <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 text-center">Ukuran</th>
                  <th className="border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 text-center">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900 font-medium">
                      {record.nama}
                    </td>
                    {/* Safety Shoes */}
                    <td className={`border border-gray-300 px-2 py-2 text-sm text-center ${getStatusColor(record.safetyShoes.status)}`}>
                      {record.safetyShoes.tanggal}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-sm text-center">
                      {record.safetyShoes.ukuran}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-sm text-center">
                      {record.safetyShoes.jumlah}
                    </td>
                    {/* Wearpack Merah */}
                    <td className={`border border-gray-300 px-2 py-2 text-sm text-center ${getStatusColor(record.wearpackMerah.status)}`}>
                      {record.wearpackMerah.tanggal}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-sm text-center">
                      {record.wearpackMerah.ukuran}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-sm text-center">
                      {record.wearpackMerah.jumlah}
                    </td>
                    {/* Wearpack Biru */}
                    <td className={`border border-gray-300 px-2 py-2 text-sm text-center ${getStatusColor(record.wearpackBiru.status)}`}>
                      {record.wearpackBiru.tanggal}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-sm text-center">
                      {record.wearpackBiru.ukuran}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-sm text-center">
                      {record.wearpackBiru.jumlah}
                    </td>
                    {/* Actions */}
                    <td className="border border-gray-300 px-2 py-2 text-sm text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => openViewModal(record)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => openEditModal(record)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(record.id);
                            setShowDeleteConfirm(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
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
                      {Math.min(startIndex + itemsPerPage, filteredData.length)}
                    </span>{" "}
                    of <span className="font-medium">{filteredData.length}</span> results
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
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
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
                  Apakah Anda yakin ingin menghapus record APD ini? Tindakan ini tidak dapat dibatalkan.
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

      {/* APD Record Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {modalMode === 'add' ? 'Tambah Record APD' : 
                 modalMode === 'edit' ? 'Edit Record APD' : 'Detail Record APD'}
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

            <form className="space-y-6 max-h-96 overflow-y-auto">
              {/* Employee Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Karyawan *
                </label>
                <input
                  type="text"
                  value={formData.nama || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                  disabled={modalMode === 'view'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="Masukkan nama karyawan"
                />
              </div>

              {/* Safety Shoes */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-3">Safety Shoes</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                    <input
                      type="date"
                      value={formData.safetyShoes?.tanggal || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        safetyShoes: { ...prev.safetyShoes, tanggal: e.target.value }
                      }))}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ukuran</label>
                    <select
                      value={formData.safetyShoes?.ukuran || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        safetyShoes: { ...prev.safetyShoes, ukuran: e.target.value }
                      }))}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">Pilih Ukuran</option>
                      {['6', '7', '8', '9', '10', '11', '12'].map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.safetyShoes?.jumlah || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        safetyShoes: { ...prev.safetyShoes, jumlah: parseInt(e.target.value) || 0 }
                      }))}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.safetyShoes?.status || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        safetyShoes: { ...prev.safetyShoes, status: e.target.value as 'Valid' | 'Mendekati Expired' | 'Expired' }
                      }))}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">Pilih Status</option>
                      <option value="Valid">Valid</option>
                      <option value="Mendekati Expired">Mendekati Expired</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Komentar</label>
                  <textarea
                    value={formData.safetyShoes?.komentar || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      safetyShoes: { ...prev.safetyShoes, komentar: e.target.value }
                    }))}
                    disabled={modalMode === 'view'}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Catatan tambahan..."
                  />
                </div>
              </div>

              {/* Wearpack Merah */}
              <div className="border rounded-lg p-4 bg-red-50">
                <h4 className="font-medium text-gray-900 mb-3">Wearpack/Coverall (Merah)</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                    <input
                      type="date"
                      value={formData.wearpackMerah?.tanggal || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        wearpackMerah: { ...prev.wearpackMerah, tanggal: e.target.value }
                      }))}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ukuran</label>
                    <select
                      value={formData.wearpackMerah?.ukuran || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        wearpackMerah: { ...prev.wearpackMerah, ukuran: e.target.value }
                      }))}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">Pilih Ukuran</option>
                      {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.wearpackMerah?.jumlah || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        wearpackMerah: { ...prev.wearpackMerah, jumlah: parseInt(e.target.value) || 0 }
                      }))}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.wearpackMerah?.status || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        wearpackMerah: { ...prev.wearpackMerah, status: e.target.value as 'Valid' | 'Mendekati Expired' | 'Expired' }
                      }))}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">Pilih Status</option>
                      <option value="Valid">Valid</option>
                      <option value="Mendekati Expired">Mendekati Expired</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Wearpack Biru */}
              <div className="border rounded-lg p-4 bg-blue-50">
                <h4 className="font-medium text-gray-900 mb-3">Wearpack/Coverall (Biru)</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                    <input
                      type="date"
                      value={formData.wearpackBiru?.tanggal || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        wearpackBiru: { ...prev.wearpackBiru, tanggal: e.target.value }
                      }))}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ukuran</label>
                    <select
                      value={formData.wearpackBiru?.ukuran || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        wearpackBiru: { ...prev.wearpackBiru, ukuran: e.target.value }
                      }))}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">Pilih Ukuran</option>
                      {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.wearpackBiru?.jumlah || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        wearpackBiru: { ...prev.wearpackBiru, jumlah: parseInt(e.target.value) || 0 }
                      }))}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.wearpackBiru?.status || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        wearpackBiru: { ...prev.wearpackBiru, status: e.target.value as 'Valid' | 'Mendekati Expired' | 'Expired' }
                      }))}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">Pilih Status</option>
                      <option value="Valid">Valid</option>
                      <option value="Mendekati Expired">Mendekati Expired</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>

            {/* Modal Actions */}
            {modalMode !== 'view' && (
              <div className="flex items-center justify-end pt-6 space-x-3 border-t">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {modalMode === 'add' ? 'Tambah' : 'Simpan'}
                </button>
              </div>
            )}
            {modalMode === 'view' && (
              <div className="flex items-center justify-end pt-6 border-t">
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

export default QHSEMonitoringAPDDashboard;
