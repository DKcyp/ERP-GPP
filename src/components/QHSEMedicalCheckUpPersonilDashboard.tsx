import React, { useMemo, useState } from 'react';
import { Heart, Search, PlusCircle, Download, FileText, Pencil, Trash2, AlertTriangle, Calendar, Bell, Upload, Eye, CheckCircle, Clock, XCircle, User, Building, Shield } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface MCUPersonilItem {
  id: string;
  no: string;
  namaPersonil: string;
  posisiJabatan: string;
  providerMCU: string;
  tanggalMCU: string;
  tanggalExpiredMCU: string;
  masaBerlakuMCUReviewUser: string; // e.g., "Medco Corridor", "PHE ONWJ"
  paketMCU: string;
  keterangan: 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7';
  providerTambahan?: string;
  statusMCU: 'Valid' | 'Mendekati Expired' | 'Expired';
  approvalOps: 'Pending' | 'Approved' | 'Rejected';
  approvalHRD: 'Pending' | 'Approved' | 'Rejected';
  permintaanByOps: boolean;
  cekKontrakByHRD: boolean;
  statusProses: 'Permintaan Ops' | 'Pengajuan' | 'Proses' | 'Selesai';
  daysUntilExpiry?: number;
  isExpiringSoon?: boolean;
  isReviewUserExpiring?: boolean;
}

const QHSEMedicalCheckUpPersonilDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterProses, setFilterProses] = useState<string>('');
  const [filterKeterangan, setFilterKeterangan] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MCUPersonilItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<MCUPersonilItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Sample data with calculated expiry days
  const [mcuData, setMCUData] = useState<MCUPersonilItem[]>([
    {
      id: '1',
      no: 'MCU-001',
      namaPersonil: 'John Doe',
      posisiJabatan: 'Senior Technician',
      providerMCU: 'RS Siloam',
      tanggalMCU: '2024-01-15',
      tanggalExpiredMCU: '2025-01-15',
      masaBerlakuMCUReviewUser: 'Medco Corridor',
      paketMCU: 'Paket Lengkap',
      keterangan: 'P1',
      statusMCU: 'Valid',
      approvalOps: 'Approved',
      approvalHRD: 'Approved',
      permintaanByOps: true,
      cekKontrakByHRD: true,
      statusProses: 'Selesai',
      daysUntilExpiry: 120,
      isExpiringSoon: false,
      isReviewUserExpiring: false
    },
    {
      id: '2',
      no: 'MCU-002',
      namaPersonil: 'Jane Smith',
      posisiJabatan: 'Project Manager',
      providerMCU: 'RS Hermina',
      tanggalMCU: '2024-03-01',
      tanggalExpiredMCU: '2024-12-01',
      masaBerlakuMCUReviewUser: 'PHE ONWJ',
      paketMCU: 'Paket Executive',
      keterangan: 'P3',
      statusMCU: 'Mendekati Expired',
      approvalOps: 'Approved',
      approvalHRD: 'Pending',
      permintaanByOps: true,
      cekKontrakByHRD: false,
      statusProses: 'Proses',
      daysUntilExpiry: 45,
      isExpiringSoon: true,
      isReviewUserExpiring: false
    },
    {
      id: '3',
      no: 'MCU-003',
      namaPersonil: 'Ahmad Rahman',
      posisiJabatan: 'Safety Officer',
      providerMCU: 'RS Mayapada',
      tanggalMCU: '2023-11-15',
      tanggalExpiredMCU: '2024-10-15',
      masaBerlakuMCUReviewUser: 'Office',
      paketMCU: 'Paket Standard',
      keterangan: 'P5',
      statusMCU: 'Expired',
      approvalOps: 'Pending',
      approvalHRD: 'Pending',
      permintaanByOps: false,
      cekKontrakByHRD: false,
      statusProses: 'Permintaan Ops',
      daysUntilExpiry: -30,
      isExpiringSoon: false,
      isReviewUserExpiring: true
    }
  ]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalPersonil = mcuData.length;
    const validMCU = mcuData.filter(item => item.statusMCU === 'Valid').length;
    const mendekatiExpired = mcuData.filter(item => item.statusMCU === 'Mendekati Expired').length;
    const expired = mcuData.filter(item => item.statusMCU === 'Expired').length;
    const needsApproval = mcuData.filter(item => item.approvalOps === 'Pending' || item.approvalHRD === 'Pending').length;
    const expiringSoon60 = mcuData.filter(item => (item.daysUntilExpiry || 0) <= 60 && (item.daysUntilExpiry || 0) > 0).length;
    const expiringSoon30 = mcuData.filter(item => (item.daysUntilExpiry || 0) <= 30 && (item.daysUntilExpiry || 0) > 0).length;

    return {
      totalPersonil,
      validMCU,
      mendekatiExpired,
      expired,
      needsApproval,
      expiringSoon60,
      expiringSoon30
    };
  }, [mcuData]);

  // Filter data
  const filteredData = useMemo(() => {
    return mcuData.filter(item => {
      const matchesSearch = item.namaPersonil.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !filterStatus || item.statusMCU === filterStatus;
      const matchesProses = !filterProses || item.statusProses === filterProses;
      const matchesKeterangan = !filterKeterangan || item.keterangan === filterKeterangan;

      return matchesSearch && matchesStatus && matchesProses && matchesKeterangan;
    });
  }, [mcuData, searchTerm, filterStatus, filterProses, filterKeterangan]);

  const getStatusBadge = (status: string, type: 'mcu' | 'approval' | 'proses') => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    if (type === 'mcu') {
      switch (status) {
        case 'Valid': return `${baseClasses} bg-green-100 text-green-800`;
        case 'Mendekati Expired': return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case 'Expired': return `${baseClasses} bg-red-100 text-red-800`;
        default: return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    } else if (type === 'approval') {
      switch (status) {
        case 'Approved': return `${baseClasses} bg-green-100 text-green-800`;
        case 'Pending': return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case 'Rejected': return `${baseClasses} bg-red-100 text-red-800`;
        default: return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    } else {
      switch (status) {
        case 'Selesai': return `${baseClasses} bg-green-100 text-green-800`;
        case 'Proses': return `${baseClasses} bg-blue-100 text-blue-800`;
        case 'Pengajuan': return `${baseClasses} bg-purple-100 text-purple-800`;
        case 'Permintaan Ops': return `${baseClasses} bg-yellow-100 text-yellow-800`;
        default: return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    }
  };

  const getKeteranganBadge = (keterangan: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    const colors = {
      'P1': 'bg-blue-100 text-blue-800',
      'P2': 'bg-green-100 text-green-800',
      'P3': 'bg-yellow-100 text-yellow-800',
      'P4': 'bg-orange-100 text-orange-800',
      'P5': 'bg-red-100 text-red-800',
      'P6': 'bg-purple-100 text-purple-800',
      'P7': 'bg-pink-100 text-pink-800'
    };
    return `${baseClasses} ${colors[keterangan as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`;
  };

  const getExpiryBadge = (daysUntilExpiry: number) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    if (daysUntilExpiry <= 0) {
      return `${baseClasses} bg-red-100 text-red-800`;
    } else if (daysUntilExpiry <= 30) {
      return `${baseClasses} bg-orange-100 text-orange-800`;
    } else if (daysUntilExpiry <= 60) {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    } else {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
  };

  const formatExpiryText = (daysUntilExpiry: number) => {
    if (daysUntilExpiry <= 0) {
      return 'Expired';
    } else if (daysUntilExpiry <= 30) {
      return `${daysUntilExpiry} hari lagi`;
    } else if (daysUntilExpiry <= 60) {
      return `${daysUntilExpiry} hari lagi`;
    } else {
      return `${daysUntilExpiry} hari lagi`;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="h-8 w-8 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Medical Check Up Personil</h1>
        </div>
        <p className="text-gray-600">Monitoring dan manajemen Medical Check Up personil dengan approval workflow dan notifikasi otomatis</p>
      </div>

      {/* Statistics Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Personil</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPersonil}</p>
            </div>
            <User className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valid MCU</p>
              <p className="text-2xl font-bold text-gray-900">{stats.validMCU}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mendekati Expired</p>
              <p className="text-2xl font-bold text-gray-900">{stats.mendekatiExpired}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-gray-900">{stats.expired}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Need Approval</p>
              <p className="text-2xl font-bold text-gray-900">{stats.needsApproval}</p>
            </div>
            <Shield className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alert 60 Hari</p>
              <p className="text-2xl font-bold text-gray-900">{stats.expiringSoon60}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-pink-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alert 30 Hari</p>
              <p className="text-2xl font-bold text-gray-900">{stats.expiringSoon30}</p>
            </div>
            <Bell className="h-8 w-8 text-pink-500" />
          </div>
        </div>
      </div> */}

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Cari nama personil..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Eye className="h-4 w-4" />
                Filter
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                Tambah MCU
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status MCU</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Semua Status</option>
                  <option value="Valid">Valid</option>
                  <option value="Mendekati Expired">Mendekati Expired</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Proses</label>
                <select
                  value={filterProses}
                  onChange={(e) => setFilterProses(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Semua Proses</option>
                  <option value="Permintaan Ops">Permintaan Ops</option>
                  <option value="Pengajuan">Pengajuan</option>
                  <option value="Proses">Proses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                <select
                  value={filterKeterangan}
                  onChange={(e) => setFilterKeterangan(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Semua Keterangan</option>
                  <option value="P1">P1</option>
                  <option value="P2">P2</option>
                  <option value="P3">P3</option>
                  <option value="P4">P4</option>
                  <option value="P5">P5</option>
                  <option value="P6">P6</option>
                  <option value="P7">P7</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilterStatus('');
                    setFilterProses('');
                    setFilterKeterangan('');
                  }}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No/Personil</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi/Jabatan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider MCU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal MCU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expired MCU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paket/Ket</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status MCU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Proses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.no}</div>
                      <div className="text-sm text-gray-500">{item.namaPersonil}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{item.posisiJabatan}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.providerMCU}</div>
                      {item.providerTambahan && (
                        <div className="text-sm text-gray-500">{item.providerTambahan}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tanggalMCU}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.tanggalExpiredMCU}</div>
                      <div className="flex items-center gap-1">
                        <span className={getExpiryBadge(item.daysUntilExpiry || 0)}>
                          {formatExpiryText(item.daysUntilExpiry || 0)}
                        </span>
                        {item.isExpiringSoon && <Bell className="h-4 w-4 text-orange-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.masaBerlakuMCUReviewUser}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.paketMCU}</div>
                      <span className={getKeteranganBadge(item.keterangan)}>{item.keterangan}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(item.statusMCU, 'mcu')}>{item.statusMCU}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={getStatusBadge(item.approvalOps, 'approval')}>Ops: {item.approvalOps}</span>
                        <span className={getStatusBadge(item.approvalHRD, 'approval')}>HRD: {item.approvalHRD}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(item.statusProses, 'proses')}>{item.statusProses}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="View MCU Report"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteItem(item)}
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
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteItem && (
        <ConfirmDeleteModal
          isOpen={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={() => {
            setMCUData(prev => prev.filter(item => item.id !== deleteItem.id));
            setDeleteItem(null);
          }}
          title="Hapus Data MCU"
          message={`Apakah Anda yakin ingin menghapus data MCU untuk "${deleteItem.namaPersonil}"?`}
        />
      )}
    </div>
  );
};

export default QHSEMedicalCheckUpPersonilDashboard;
