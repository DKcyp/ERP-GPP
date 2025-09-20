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
  paketMCU: string; // Paket yang diambil
  hasilMCU: 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7'; // Hasil dari MCU
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
  const [filterHasilMCU, setFilterHasilMCU] = useState<string>('');
  const [filterProvider, setFilterProvider] = useState<string>('');
  const [filterTahun, setFilterTahun] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MCUPersonilItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<MCUPersonilItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState<Partial<MCUPersonilItem>>({});

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
      hasilMCU: 'P1',
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
      hasilMCU: 'P3',
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
      hasilMCU: 'P5',
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
      const matchesSearch = item.namaPersonil.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.no.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === '' || item.statusMCU === filterStatus;
      const matchesProses = filterProses === '' || item.statusProses === filterProses;
      const matchesHasilMCU = filterHasilMCU === '' || item.hasilMCU === filterHasilMCU;
      const matchesProvider = filterProvider === '' || item.providerMCU.toLowerCase().includes(filterProvider.toLowerCase());
      const matchesTahun = filterTahun === '' || new Date(item.tanggalMCU).getFullYear().toString() === filterTahun;
      
      return matchesSearch && matchesStatus && matchesProses && matchesHasilMCU && matchesProvider && matchesTahun;
    });
  }, [mcuData, searchTerm, filterStatus, filterProses, filterHasilMCU, filterProvider, filterTahun]);

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

  const getMCUCategoryDescription = (category: string) => {
    const descriptions = {
      'P1': 'Fit To Work - Tidak ditemukan kelainan medis',
      'P2': 'Fit With Medical Noted - Ditemukan kelainan medis yang tidak serius',
      'P3': 'Fit With Medical Noted - Ditemukan kelainan medis, risiko kesehatan rendah',
      'P4': 'Fit With Medical Noted - Ditemukan kelainan bermakna yang dapat menjadi serius',
      'P5': 'Fit With Medical Noted - Ditemukan kelainan medis serius',
      'P6': 'Temporary Unfit - Dengan keterbatasan fisik untuk melakukan pekerjaan secara normal, hanya untuk pekerjaan ringan',
      'P7': 'Unfit - Sedang sakit atau dalam kondisi yang tidak mungkin untuk melakukan pekerjaan (status ijin sakit)'
    };
    return descriptions[category as keyof typeof descriptions] || category;
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

  // Form handlers
  const handleOpenAddModal = () => {
    setFormData({
      namaPersonil: '',
      posisiJabatan: '',
      providerMCU: '',
      tanggalMCU: '',
      tanggalExpiredMCU: '',
      masaBerlakuMCUReviewUser: '',
      paketMCU: '',
      hasilMCU: 'P1',
      statusMCU: 'Valid',
      approvalOps: 'Pending',
      approvalHRD: 'Pending',
      permintaanByOps: false,
      cekKontrakByHRD: false,
      statusProses: 'Permintaan Ops'
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (item: MCUPersonilItem) => {
    setFormData(item);
    setEditingItem(item);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleInputChange = (field: keyof MCUPersonilItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (editingItem) {
      // Edit existing item
      setMCUData(prev => prev.map(item => 
        item.id === editingItem.id ? { ...item, ...formData } as MCUPersonilItem : item
      ));
    } else {
      // Add new item
      const newItem: MCUPersonilItem = {
        id: Date.now().toString(),
        no: `MCU-${String(mcuData.length + 1).padStart(3, '0')}`,
        ...formData
      } as MCUPersonilItem;
      setMCUData(prev => [...prev, newItem]);
    }
    handleCloseModal();
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
                onClick={handleOpenAddModal}
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider MCU</label>
                <input
                  type="text"
                  placeholder="Cari provider..."
                  value={filterProvider}
                  onChange={(e) => setFilterProvider(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                <select
                  value={filterTahun}
                  onChange={(e) => setFilterTahun(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Semua Tahun</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
              </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Hasil MCU</label>
                <select
                  value={filterHasilMCU}
                  onChange={(e) => setFilterHasilMCU(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Semua Hasil MCU</option>
                  <option value="P1">P1 - Fit To Work</option>
                  <option value="P2">P2 - Fit With Medical Noted</option>
                  <option value="P3">P3 - Fit With Medical Noted</option>
                  <option value="P4">P4 - Fit With Medical Noted</option>
                  <option value="P5">P5 - Fit With Medical Noted</option>
                  <option value="P6">P6 - Temporary Unfit</option>
                  <option value="P7">P7 - Unfit</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilterProvider('');
                    setFilterTahun('');
                    setFilterStatus('');
                    setFilterProses('');
                    setFilterHasilMCU('');
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Urut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Personil</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi/Jabatan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider MCU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal MCU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expired MCU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paket MCU<br/><span className="text-xs normal-case text-gray-400">(Paket yang diambil)</span></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hasil MCU<br/><span className="text-xs normal-case text-gray-400">(P1-P7 Kategori)</span></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status MCU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Proses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{index+1}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{item.namaPersonil}</span>
                      </div>
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="group relative">
                        <span className={getKeteranganBadge(item.hasilMCU)}>{item.hasilMCU}</span>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                          {getMCUCategoryDescription(item.hasilMCU)}
                        </div>
                      </div>
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
                          onClick={() => handleOpenEditModal(item)}
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

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingItem ? 'Edit Data MCU' : 'Tambah Data MCU'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Personil</label>
                    <input
                      type="text"
                      value={formData.namaPersonil || ''}
                      onChange={(e) => handleInputChange('namaPersonil', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Masukkan nama personil"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Posisi/Jabatan</label>
                    <input
                      type="text"
                      value={formData.posisiJabatan || ''}
                      onChange={(e) => handleInputChange('posisiJabatan', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Masukkan posisi/jabatan"
                    />
                  </div>
                </div>

                {/* MCU Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provider MCU</label>
                    <select
                      value={formData.providerMCU || ''}
                      onChange={(e) => handleInputChange('providerMCU', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Pilih Provider MCU</option>
                      <option value="RS Siloam">RS Siloam</option>
                      <option value="RS Hermina">RS Hermina</option>
                      <option value="RS Mayapada">RS Mayapada</option>
                      <option value="RS Pondok Indah">RS Pondok Indah</option>
                      <option value="RS Premier Bintaro">RS Premier Bintaro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Paket MCU</label>
                    <select
                      value={formData.paketMCU || ''}
                      onChange={(e) => handleInputChange('paketMCU', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Pilih Paket MCU</option>
                      <option value="Paket Basic">Paket Basic</option>
                      <option value="Paket Standard">Paket Standard</option>
                      <option value="Paket Lengkap">Paket Lengkap</option>
                      <option value="Paket Executive">Paket Executive</option>
                      <option value="Paket Premium">Paket Premium</option>
                    </select>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal MCU</label>
                    <input
                      type="date"
                      value={formData.tanggalMCU || ''}
                      onChange={(e) => handleInputChange('tanggalMCU', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Expired MCU</label>
                    <input
                      type="date"
                      value={formData.tanggalExpiredMCU || ''}
                      onChange={(e) => handleInputChange('tanggalExpiredMCU', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Review User & Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Review User</label>
                    <select
                      value={formData.masaBerlakuMCUReviewUser || ''}
                      onChange={(e) => handleInputChange('masaBerlakuMCUReviewUser', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Pilih Review User</option>
                      <option value="Medco Corridor">Medco Corridor</option>
                      <option value="PHE ONWJ">PHE ONWJ</option>
                      <option value="Office">Office</option>
                      <option value="Medco SSB">Medco SSB</option>
                      <option value="ENI Muara Bakau">ENI Muara Bakau</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hasil MCU (Kategori P1-P7)</label>
                    <select
                      value={formData.hasilMCU || 'P1'}
                      onChange={(e) => handleInputChange('hasilMCU', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="P1">P1 - Fit To Work (Tidak ditemukan kelainan medis)</option>
                      <option value="P2">P2 - Fit With Medical Noted (Ditemukan kelainan medis yang tidak serius)</option>
                      <option value="P3">P3 - Fit With Medical Noted (Ditemukan kelainan medis, risiko kesehatan rendah)</option>
                      <option value="P4">P4 - Fit With Medical Noted (Ditemukan kelainan bermakna yang dapat menjadi serius)</option>
                      <option value="P5">P5 - Fit With Medical Noted (Ditemukan kelainan medis serius)</option>
                      <option value="P6">P6 - Temporary Unfit (Dengan keterbatasan fisik untuk melakukan pekerjaan secara normal, hanya untuk pekerjaan ringan)</option>
                      <option value="P7">P7 - Unfit (Sedang sakit atau dalam kondisi yang tidak mungkin untuk melakukan pekerjaan/status ijin sakit)</option>
                    </select>
                  </div>
                </div>

                {/* Status Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status MCU</label>
                    <select
                      value={formData.statusMCU || 'Valid'}
                      onChange={(e) => handleInputChange('statusMCU', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="Valid">Valid</option>
                      <option value="Mendekati Expired">Mendekati Expired</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Approval Ops</label>
                    <select
                      value={formData.approvalOps || 'Pending'}
                      onChange={(e) => handleInputChange('approvalOps', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Approval HRD</label>
                    <select
                      value={formData.approvalHRD || 'Pending'}
                      onChange={(e) => handleInputChange('approvalHRD', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Process Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status Proses</label>
                  <select
                    value={formData.statusProses || 'Permintaan Ops'}
                    onChange={(e) => handleInputChange('statusProses', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="Permintaan Ops">Permintaan Ops</option>
                    <option value="Pengajuan">Pengajuan</option>
                    <option value="Proses">Proses</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="permintaanByOps"
                      checked={formData.permintaanByOps || false}
                      onChange={(e) => handleInputChange('permintaanByOps', e.target.checked)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="permintaanByOps" className="ml-2 block text-sm text-gray-900">
                      Permintaan by Ops
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cekKontrakByHRD"
                      checked={formData.cekKontrakByHRD || false}
                      onChange={(e) => handleInputChange('cekKontrakByHRD', e.target.checked)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="cekKontrakByHRD" className="ml-2 block text-sm text-gray-900">
                      Cek Kontrak by HRD
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {editingItem ? 'Update' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QHSEMedicalCheckUpPersonilDashboard;
