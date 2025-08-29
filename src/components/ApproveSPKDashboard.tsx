import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Printer, Clock, Search, FileSpreadsheet, FileDown, FileText, CheckCircle, ThumbsUp } from 'lucide-react'; // Added ThumbsUp
import SPKFormModal from './SPKFormModal';
import ConfirmationModal from './ConfirmationModal';
import { SPKData } from '../types';

const dummySPKData: SPKData[] = [
  {
    id: 'SPK-001',
    noSPK: 'SPK/HRD/001/2025',
    tanggalSPK: '2025-01-10',
    namaPegawai: 'Budi Santoso',
    jabatan: 'Teknisi Senior',
    departemen: 'Operasional',
    jenisPekerjaan: 'Instalasi jaringan di proyek A',
    lokasiKerja: 'Proyek Gedung Baru, Jakarta',
    periodeAwal: '2025-01-15',
    periodeAkhir: '2025-03-15',
    statusSPK: 'Aktif',
  },
  {
    id: 'SPK-002',
    noSPK: 'SPK/HRD/002/2025',
    tanggalSPK: '2025-01-12',
    namaPegawai: 'Siti Aminah',
    jabatan: 'Staf Administrasi',
    departemen: 'HRD',
    jenisPekerjaan: 'Pendataan arsip karyawan',
    lokasiKerja: 'Kantor Pusat',
    periodeAwal: '2025-01-15',
    periodeAkhir: '2025-02-15',
    statusSPK: 'Pending', // Changed to Pending
  },
  {
    id: 'SPK-003',
    noSPK: 'SPK/HRD/003/2025',
    tanggalSPK: '2025-01-15',
    namaPegawai: 'Joko Susilo',
    jabatan: 'Manajer Proyek',
    departemen: 'Proyek',
    jenisPekerjaan: 'Supervisi proyek pembangunan jembatan',
    lokasiKerja: 'Proyek Jembatan C, Bandung',
    periodeAwal: '2025-02-01',
    periodeAkhir: '2025-04-30',
    statusSPK: 'Aktif',
  },
  {
    id: 'SPK-004',
    noSPK: 'SPK/HRD/004/2025',
    tanggalSPK: '2025-01-18',
    namaPegawai: 'Dewi Lestari',
    jabatan: 'Akuntan',
    departemen: 'Finance',
    jenisPekerjaan: 'Audit laporan keuangan Q4 2024',
    lokasiKerja: 'Kantor Pusat',
    periodeAwal: '2025-01-20',
    periodeAkhir: '2025-02-20',
    statusSPK: 'Pending', // Changed to Pending
  },
  {
    id: 'SPK-005',
    noSPK: 'SPK/HRD/005/2025',
    tanggalSPK: '2025-01-20',
    namaPegawai: 'Rudi Hartono',
    jabatan: 'Supervisor Gudang',
    departemen: 'Gudang',
    jenisPekerjaan: 'Inventarisasi stok barang gudang utama',
    lokasiKerja: 'Gudang Utama, Surabaya',
    periodeAwal: '2025-01-25',
    periodeAkhir: '2025-02-25',
    statusSPK: 'Batal',
  },
  {
    id: 'SPK-006',
    noSPK: 'SPK/HRD/006/2025',
    tanggalSPK: '2025-02-01',
    namaPegawai: 'Budi Santoso',
    jabatan: 'Teknisi Senior',
    departemen: 'Operasional',
    jenisPekerjaan: 'Perbaikan sistem kelistrikan di pabrik B',
    lokasiKerja: 'Pabrik B, Cikarang',
    periodeAwal: '2025-02-05',
    periodeAkhir: '2025-03-05',
    statusSPK: 'Aktif',
  },
  {
    id: 'SPK-007',
    noSPK: 'SPK/HRD/007/2025',
    tanggalSPK: '2025-02-05',
    namaPegawai: 'Joko Susilo',
    jabatan: 'Manajer Proyek',
    departemen: 'Proyek',
    jenisPekerjaan: 'Rapat koordinasi proyek baru',
    lokasiKerja: 'Kantor Cabang Medan',
    periodeAwal: '2025-02-10',
    periodeAkhir: '2025-02-12',
    statusSPK: 'Selesai',
  },
  {
    id: 'SPK-008',
    noSPK: 'SPK/HRD/008/2025',
    tanggalSPK: '2025-02-10',
    namaPegawai: 'Siti Aminah',
    jabatan: 'Staf Administrasi',
    departemen: 'HRD',
    jenisPekerjaan: 'Persiapan dokumen rekrutmen',
    lokasiKerja: 'Kantor Pusat',
    periodeAwal: '2025-02-15',
    periodeAkhir: '2025-03-15',
    statusSPK: 'Pending', // Changed to Pending
  },
  {
    id: 'SPK-009',
    noSPK: 'SPK/HRD/009/2025',
    tanggalSPK: '2025-02-15',
    namaPegawai: 'Andi Wijaya',
    jabatan: 'Analis Data',
    departemen: 'IT',
    jenisPekerjaan: 'Pengembangan dashboard analitik',
    lokasiKerja: 'Kantor Pusat',
    periodeAwal: '2025-02-20',
    periodeAkhir: '2025-05-20',
    statusSPK: 'Pending', // New Pending SPK
  },
  {
    id: 'SPK-010',
    noSPK: 'SPK/HRD/010/2025',
    tanggalSPK: '2025-02-18',
    namaPegawai: 'Maya Sari',
    jabatan: 'Desainer Grafis',
    departemen: 'Marketing',
    jenisPekerjaan: 'Desain materi promosi produk baru',
    lokasiKerja: 'Kantor Pusat',
    periodeAwal: '2025-02-25',
    periodeAkhir: '2025-03-25',
    statusSPK: 'Approved', // New Approved SPK
  },
];

const ApproveSPKDashboard: React.FC = () => {
  const [spkList, setSpkList] = useState<SPKData[]>(dummySPKData);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [editingSPK, setEditingSPK] = useState<SPKData | null>(null);
  const [spkToDeleteId, setSpkToDeleteId] = useState<string | null>(null);
  const [showEntries, setShowEntries] = useState(10);
  
  // State for advanced filters
  const [filters, setFilters] = useState({
    noSPK: '',
    namaPegawai: '',
    jenisPekerjaan: '',
    lokasiKerja: '',
    statusSPK: '', // All, Aktif, Selesai, Batal, Pending, Approved
    periodeAwal: '',
    periodeAkhir: '',
  });
  const [isApprovalMode, setIsApprovalMode] = useState(false); // New state for approval mode

  const getStatusClasses = (status: SPKData['statusSPK']) => {
    switch (status) {
      case 'Aktif':
        return 'bg-green-500 text-white';
      case 'Selesai':
        return 'bg-blue-500 text-white';
      case 'Batal':
        return 'bg-red-500 text-white';
      case 'Pending': // New status style
        return 'bg-yellow-500 text-white';
      case 'Approved': // New status style
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const handleAddSPK = () => {
    setEditingSPK(null);
    setIsApprovalMode(false); // Not in approval mode when adding
    setIsFormModalOpen(true);
  };

  const handleEditSPK = (spk: SPKData) => {
    setEditingSPK(spk);
    setIsApprovalMode(false); // Not in approval mode when editing
    setIsFormModalOpen(true);
  };

  const handleApproveSPK = (spk: SPKData) => {
    setEditingSPK(spk);
    setIsApprovalMode(true); // Set approval mode
    setIsFormModalOpen(true);
  };

  const handleDeleteSPK = (id: string) => {
    setSpkToDeleteId(id);
    setIsConfirmationModalOpen(true);
  };

  const confirmDeleteSPK = () => {
    if (spkToDeleteId) {
      setSpkList(spkList.filter((spk) => spk.id !== spkToDeleteId));
      setIsConfirmationModalOpen(false);
      setSpkToDeleteId(null);
      alert('SPK berhasil dihapus!');
    }
  };

  const handleSaveSPK = (spk: SPKData) => {
    if (editingSPK) {
      setSpkList(spkList.map((s) => (s.id === spk.id ? spk : s)));
      alert('SPK berhasil diperbarui!');
    } else {
      setSpkList([...spkList, spk]);
      alert('SPK baru berhasil ditambahkan!');
    }
  };

  const handlePrintSPK = (spk: SPKData) => {
    alert(`Mencetak SPK: ${spk.noSPK} (Simulasi PDF Export)`);
    // In a real application, you would generate a PDF here.
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    // This function is mainly for a dedicated search button,
    // but for now, the filteredSPKList will react to filter changes directly.
    // If a separate search button is desired, this function would trigger the filtering.
    console.log("Applying filters:", filters);
  };

  const filteredSPKList = spkList.filter(spk => {
    const matchesNoSPK = filters.noSPK ? spk.noSPK.toLowerCase().includes(filters.noSPK.toLowerCase()) : true;
    const matchesNamaPegawai = filters.namaPegawai ? spk.namaPegawai.toLowerCase().includes(filters.namaPegawai.toLowerCase()) : true;
    const matchesJenisPekerjaan = filters.jenisPekerjaan ? spk.jenisPekerjaan.toLowerCase().includes(filters.jenisPekerjaan.toLowerCase()) : true;
    const matchesLokasiKerja = filters.lokasiKerja ? spk.lokasiKerja.toLowerCase().includes(filters.lokasiKerja.toLowerCase()) : true;
    const matchesStatusSPK = filters.statusSPK ? spk.statusSPK === filters.statusSPK : true;
    
    const matchesPeriodeAwal = filters.periodeAwal ? new Date(spk.periodeAwal) >= new Date(filters.periodeAwal) : true;
    const matchesPeriodeAkhir = filters.periodeAkhir ? new Date(spk.periodeAkhir) <= new Date(filters.periodeAkhir) : true;

    return matchesNoSPK && matchesNamaPegawai && matchesJenisPekerjaan && matchesLokasiKerja && matchesStatusSPK && matchesPeriodeAwal && matchesPeriodeAkhir;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                APPROVE SPK
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">HRD</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">SPK</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Approve SPK</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          {/* Top Controls - Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label htmlFor="filterNoSPK" className="block text-sm font-medium text-gray-700 mb-1">
                Cari No SPK
              </label>
              <input
                type="text"
                id="filterNoSPK"
                name="noSPK"
                value={filters.noSPK}
                onChange={handleFilterChange}
                placeholder="Cari No SPK..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
              />
            </div>
            <div>
              <label htmlFor="filterNamaPegawai" className="block text-sm font-medium text-gray-700 mb-1">
                Cari Nama Pegawai
              </label>
              <input
                type="text"
                id="filterNamaPegawai"
                name="namaPegawai"
                value={filters.namaPegawai}
                onChange={handleFilterChange}
                placeholder="Cari Nama Pegawai..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
              />
            </div>
            <div>
              <label htmlFor="filterJenisPekerjaan" className="block text-sm font-medium text-gray-700 mb-1">
                Cari Jenis Pekerjaan
              </label>
              <input
                type="text"
                id="filterJenisPekerjaan"
                name="jenisPekerjaan"
                value={filters.jenisPekerjaan}
                onChange={handleFilterChange}
                placeholder="Cari Jenis Pekerjaan..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
              />
            </div>
            <div>
              <label htmlFor="filterLokasiKerja" className="block text-sm font-medium text-gray-700 mb-1">
                Cari Lokasi Kerja
              </label>
              <input
                type="text"
                id="filterLokasiKerja"
                name="lokasiKerja"
                value={filters.lokasiKerja}
                onChange={handleFilterChange}
                placeholder="Cari Lokasi Kerja..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
              />
            </div>
            <div>
              <label htmlFor="filterStatusSPK" className="block text-sm font-medium text-gray-700 mb-1">
                Pilih Status SPK
              </label>
              <select
                id="filterStatusSPK"
                name="statusSPK"
                value={filters.statusSPK}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
              >
                <option value="">Semua Status</option>
                <option value="Pending">Pending</option>
                <option value="Aktif">Aktif</option>
                <option value="Approved">Approved</option>
                <option value="Selesai">Selesai</option>
                <option value="Batal">Bulan</option>
              </select>
            </div>
            <div>
              <label htmlFor="filterPeriodeAwal" className="block text-sm font-medium text-gray-700 mb-1">
                Periode Awal
              </label>
              <input
                type="date"
                id="filterPeriodeAwal"
                name="periodeAwal"
                value={filters.periodeAwal}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
              />
            </div>
            <div>
              <label htmlFor="filterPeriodeAkhir" className="block text-sm font-medium text-gray-700 mb-1">
                Periode Akhir
              </label>
              <input
                type="date"
                id="filterPeriodeAkhir"
                name="periodeAkhir"
                value={filters.periodeAkhir}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={applyFilters}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors text-sm flex items-center justify-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Cari</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-end mb-6">
            <button
              onClick={handleAddSPK}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah SPK</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors text-sm">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors text-sm">
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Show</span>
                <select
                  className="border border-gray-300 rounded-md px-2 py-1"
                  value={showEntries}
                  onChange={(e) => setShowEntries(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>entries</span>
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No SPK</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal SPK</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pegawai</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jabatan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Pekerjaan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status SPK</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSPKList.slice(0, showEntries).map((spk) => (
                  <tr key={spk.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{spk.noSPK}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{spk.tanggalSPK}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{spk.namaPegawai}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{spk.jabatan}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{spk.jenisPekerjaan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{spk.lokasiKerja}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{`${spk.periodeAwal} - ${spk.periodeAkhir}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(spk.statusSPK)}`}>
                        {spk.statusSPK}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditSPK(spk)}
                          className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSPK(spk.id)}
                          className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handlePrintSPK(spk)}
                          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                          title="Cetak PDF"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                        {/* NEW: Approve button */}
                        <button
                          onClick={() => handleApproveSPK(spk)}
                          className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                          title="Approve SPK"
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 flex justify-between items-center text-sm text-gray-600">
              <span>Showing 1 to {Math.min(filteredSPKList.length, showEntries)} of {filteredSPKList.length} entries</span>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 border border-primary bg-primary text-white rounded-md">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SPK Form Modal */}
      <SPKFormModal
        isOpen={isFormModalOpen}
        onClose={() => { setIsFormModalOpen(false); setIsApprovalMode(false); }} // Reset approval mode on close
        onSave={handleSaveSPK}
        editingSPK={editingSPK}
        isApprovalMode={isApprovalMode} // Pass approval mode
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={confirmDeleteSPK}
        title="Konfirmasi Hapus SPK"
        message={`Apakah Anda yakin ingin menghapus SPK dengan ID: ${spkToDeleteId}?`}
        confirmText="Hapus"
        cancelText="Batal"
      />
    </div>
  );
};

export default ApproveSPKDashboard;
