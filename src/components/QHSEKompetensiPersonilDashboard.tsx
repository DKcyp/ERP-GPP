import React, { useMemo, useState } from 'react';
import { GraduationCap, Search, PlusCircle, Download, FileText, Pencil, Trash2, AlertTriangle, Calendar, Bell, Upload, Eye, CheckCircle, Clock, XCircle, User, Building, ExternalLink } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface KompetensiPersonilItem {
  id: string;
  namaPersonil: string;
  namaTraining: string;
  vendorTraining: string;
  tanggalSertifikatTerbit: string;
  tanggalExpiredSertifikat: string;
  keteranganValiditas: 'Valid' | 'Mendekati Expired' | 'Expired';
  status: 'Pengajuan' | 'Proses' | 'Selesai';
  approvalOps: 'Pending' | 'Approved' | 'Rejected';
  approvalHRD: 'Pending' | 'Approved' | 'Rejected';
  permintaanDari: 'Ops' | 'Adm HRD';
  documentSertifikat?: string;
  daysUntilExpiry?: number;
  isExpiringSoon?: boolean;
  hrdSyncStatus: 'Synced' | 'Pending' | 'Failed';
}

const QHSEKompetensiPersonilDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterValiditas, setFilterValiditas] = useState<string>('');
  const [filterPermintaan, setFilterPermintaan] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<KompetensiPersonilItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<KompetensiPersonilItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Sample data with calculated expiry days
  const [kompetensiData, setKompetensiData] = useState<KompetensiPersonilItem[]>([
    {
      id: '1',
      namaPersonil: 'John Doe',
      namaTraining: 'Basic Safety Training',
      vendorTraining: 'PT Safety Indonesia',
      tanggalSertifikatTerbit: '2024-01-15',
      tanggalExpiredSertifikat: '2025-01-15',
      keteranganValiditas: 'Valid',
      status: 'Selesai',
      approvalOps: 'Approved',
      approvalHRD: 'Approved',
      permintaanDari: 'Ops',
      documentSertifikat: 'cert_basic_safety_john.pdf',
      daysUntilExpiry: 120,
      isExpiringSoon: false,
      hrdSyncStatus: 'Synced'
    },
    {
      id: '2',
      namaPersonil: 'Jane Smith',
      namaTraining: 'Advanced Fire Fighting',
      vendorTraining: 'Fire Safety Academy',
      tanggalSertifikatTerbit: '2023-06-01',
      tanggalExpiredSertifikat: '2024-12-01',
      keteranganValiditas: 'Mendekati Expired',
      status: 'Proses',
      approvalOps: 'Approved',
      approvalHRD: 'Pending',
      permintaanDari: 'Adm HRD',
      documentSertifikat: 'cert_fire_fighting_jane.pdf',
      daysUntilExpiry: 45,
      isExpiringSoon: true,
      hrdSyncStatus: 'Pending'
    },
    {
      id: '3',
      namaPersonil: 'Ahmad Rahman',
      namaTraining: 'Confined Space Entry',
      vendorTraining: 'Industrial Safety Center',
      tanggalSertifikatTerbit: '2022-08-15',
      tanggalExpiredSertifikat: '2024-08-15',
      keteranganValiditas: 'Expired',
      status: 'Pengajuan',
      approvalOps: 'Pending',
      approvalHRD: 'Pending',
      permintaanDari: 'Ops',
      daysUntilExpiry: -90,
      isExpiringSoon: false,
      hrdSyncStatus: 'Failed'
    },
    {
      id: '4',
      namaPersonil: 'Maria Garcia',
      namaTraining: 'First Aid Certification',
      vendorTraining: 'Red Cross Indonesia',
      tanggalSertifikatTerbit: '2024-03-01',
      tanggalExpiredSertifikat: '2026-03-01',
      keteranganValiditas: 'Valid',
      status: 'Selesai',
      approvalOps: 'Approved',
      approvalHRD: 'Approved',
      permintaanDari: 'Adm HRD',
      documentSertifikat: 'cert_first_aid_maria.pdf',
      daysUntilExpiry: 520,
      isExpiringSoon: false,
      hrdSyncStatus: 'Synced'
    }
  ]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalPersonil = kompetensiData.length;
    const validCertificates = kompetensiData.filter(item => item.keteranganValiditas === 'Valid').length;
    const mendekatiExpired = kompetensiData.filter(item => item.keteranganValiditas === 'Mendekati Expired').length;
    const expired = kompetensiData.filter(item => item.keteranganValiditas === 'Expired').length;
    const needsApproval = kompetensiData.filter(item => item.approvalOps === 'Pending' || item.approvalHRD === 'Pending').length;
    const hrdSyncPending = kompetensiData.filter(item => item.hrdSyncStatus === 'Pending' || item.hrdSyncStatus === 'Failed').length;
    const completed = kompetensiData.filter(item => item.status === 'Selesai').length;

    return {
      totalPersonil,
      validCertificates,
      mendekatiExpired,
      expired,
      needsApproval,
      hrdSyncPending,
      completed
    };
  }, [kompetensiData]);

  // Filter data
  const filteredData = useMemo(() => {
    return kompetensiData.filter(item => {
      const matchesSearch = item.namaPersonil.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !filterStatus || item.status === filterStatus;
      const matchesValiditas = !filterValiditas || item.keteranganValiditas === filterValiditas;
      const matchesPermintaan = !filterPermintaan || item.permintaanDari === filterPermintaan;

      return matchesSearch && matchesStatus && matchesValiditas && matchesPermintaan;
    });
  }, [kompetensiData, searchTerm, filterStatus, filterValiditas, filterPermintaan]);

  const getStatusBadge = (status: string, type: 'validitas' | 'approval' | 'proses' | 'sync') => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    if (type === 'validitas') {
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
    } else if (type === 'sync') {
      switch (status) {
        case 'Synced': return `${baseClasses} bg-green-100 text-green-800`;
        case 'Pending': return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case 'Failed': return `${baseClasses} bg-red-100 text-red-800`;
        default: return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    } else {
      switch (status) {
        case 'Selesai': return `${baseClasses} bg-green-100 text-green-800`;
        case 'Proses': return `${baseClasses} bg-blue-100 text-blue-800`;
        case 'Pengajuan': return `${baseClasses} bg-yellow-100 text-yellow-800`;
        default: return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    }
  };

  const getExpiryBadge = (daysUntilExpiry: number) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    if (daysUntilExpiry <= 0) {
      return `${baseClasses} bg-red-100 text-red-800`;
    } else if (daysUntilExpiry <= 30) {
      return `${baseClasses} bg-orange-100 text-orange-800`;
    } else if (daysUntilExpiry <= 90) {
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
    } else if (daysUntilExpiry <= 90) {
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
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Kompetensi Personil</h1>
        </div>
        <p className="text-gray-600">Monitoring dan manajemen kompetensi personil dengan integrasi HRD dan approval workflow</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-6">
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
              <p className="text-sm font-medium text-gray-600">Valid Certificates</p>
              <p className="text-2xl font-bold text-gray-900">{stats.validCertificates}</p>
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
            <AlertTriangle className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">HRD Sync Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.hrdSyncPending}</p>
            </div>
            <ExternalLink className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-teal-500" />
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Cari nama personil..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                title="Sync dengan HRD"
              >
                <ExternalLink className="h-4 w-4" />
                Sync HRD
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                Tambah Kompetensi
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Proses</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Semua Status</option>
                  <option value="Pengajuan">Pengajuan</option>
                  <option value="Proses">Proses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Validitas Sertifikat</label>
                <select
                  value={filterValiditas}
                  onChange={(e) => setFilterValiditas(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Semua Validitas</option>
                  <option value="Valid">Valid</option>
                  <option value="Mendekati Expired">Mendekati Expired</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permintaan Dari</label>
                <select
                  value={filterPermintaan}
                  onChange={(e) => setFilterPermintaan(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Semua Permintaan</option>
                  <option value="Ops">Ops</option>
                  <option value="Adm HRD">Adm HRD</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilterStatus('');
                    setFilterValiditas('');
                    setFilterPermintaan('');
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Personil</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Training</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Training</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Terbit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expired</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validitas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HRD Sync</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.namaPersonil}</div>
                          <div className="text-sm text-gray-500">Permintaan: {item.permintaanDari}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.namaTraining}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{item.vendorTraining}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tanggalSertifikatTerbit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.tanggalExpiredSertifikat}</div>
                      <div className="flex items-center gap-1">
                        <span className={getExpiryBadge(item.daysUntilExpiry || 0)}>
                          {formatExpiryText(item.daysUntilExpiry || 0)}
                        </span>
                        {item.isExpiringSoon && <Bell className="h-4 w-4 text-orange-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(item.keteranganValiditas, 'validitas')}>{item.keteranganValiditas}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={getStatusBadge(item.approvalOps, 'approval')}>Ops: {item.approvalOps}</span>
                        <span className={getStatusBadge(item.approvalHRD, 'approval')}>HRD: {item.approvalHRD}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(item.status, 'proses')}>{item.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(item.hrdSyncStatus, 'sync')}>{item.hrdSyncStatus}</span>
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
                          title="View Certificate"
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
            setKompetensiData(prev => prev.filter(item => item.id !== deleteItem.id));
            setDeleteItem(null);
          }}
          title="Hapus Data Kompetensi"
          message={`Apakah Anda yakin ingin menghapus data kompetensi "${deleteItem.namaTraining}" untuk "${deleteItem.namaPersonil}"?`}
        />
      )}
    </div>
  );
};

export default QHSEKompetensiPersonilDashboard;
