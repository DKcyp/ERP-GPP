import React, { useMemo, useState } from 'react';
import { Shield, Search, PlusCircle, Download, Pencil, Trash2, AlertTriangle, User, Upload, Eye, CheckCircle, Clock, XCircle, ExternalLink, Package, FileText, Calendar } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface APDPersonilItem {
  id: string;
  no: string;
  namaPersonil: string;
  // Coverall tracking
  coverallJumlah: number;
  coverallJatahTahunan: number;
  coverallSisaJatah: number;
  coverallSize?: string;
  coverallDocumentBA?: string;
  coverallStatus: 'Pengajuan' | 'Proses' | 'Selesai';
  coverallTglTerima?: string;
  // Safety Shoes tracking
  safetyShoeJumlah: number;
  safetyShoeJatahTahunan: number;
  safetyShoeSisaJatah: number;
  safetyShoeSize?: string;
  safetyShoeDocumentBA?: string;
  safetyShoeStatus: 'Pengajuan' | 'Proses' | 'Selesai';
  safetyShoeTglTerima?: string;
  // General info
  tahunJatah: number;
  tanggalPermintaan: string;
  catatan?: string;
  dibebankanKeSOProject?: string;
  hrdSyncStatus: 'Synced' | 'Pending' | 'Failed';
}

const QHSEAlatPelindungDiriDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterJenisAPD, setFilterJenisAPD] = useState<string>('');
  const [filterTahun, setFilterTahun] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<APDPersonilItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<APDPersonilItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Sample data with separate Coverall and Safety Shoes tracking
  const [apdData, setApdData] = useState<APDPersonilItem[]>([
    {
      id: '1',
      no: 'APD001',
      namaPersonil: 'John Doe',
      coverallJumlah: 1,
      coverallJatahTahunan: 2,
      coverallSisaJatah: 1,
      coverallSize: 'L',
      coverallStatus: 'Selesai',
      coverallTglTerima: '2024-03-20',
      safetyShoeJumlah: 1,
      safetyShoeJatahTahunan: 1,
      safetyShoeSisaJatah: 0,
      safetyShoeSize: '42',
      safetyShoeStatus: 'Selesai',
      safetyShoeTglTerima: '2024-03-20',
      tahunJatah: 2024,
      tanggalPermintaan: '2024-03-15',
      catatan: 'Permintaan rutin tahunan',
      hrdSyncStatus: 'Synced'
    },
    {
      id: '2',
      no: 'APD002',
      namaPersonil: 'Jane Smith',
      coverallJumlah: 2,
      coverallJatahTahunan: 2,
      coverallSisaJatah: 0,
      coverallSize: 'M',
      coverallStatus: 'Proses',
      safetyShoeJumlah: 1,
      safetyShoeJatahTahunan: 1,
      safetyShoeSisaJatah: 0,
      safetyShoeSize: '38',
      safetyShoeDocumentBA: 'ba_kerusakan_safety_shoes_jane.pdf',
      safetyShoeStatus: 'Proses',
      tahunJatah: 2024,
      tanggalPermintaan: '2024-08-20',
      catatan: 'Penggantian sepatu rusak',
      hrdSyncStatus: 'Synced'
    },
    {
      id: '3',
      no: 'APD003',
      namaPersonil: 'Ahmad Rahman',
      coverallJumlah: 3,
      coverallJatahTahunan: 2,
      coverallSisaJatah: -1,
      coverallSize: 'XL',
      coverallDocumentBA: 'ba_kerusakan_coverall_ahmad.pdf',
      coverallStatus: 'Pengajuan',
      safetyShoeJumlah: 1,
      safetyShoeJatahTahunan: 1,
      safetyShoeSisaJatah: 0,
      safetyShoeSize: '44',
      safetyShoeStatus: 'Selesai',
      safetyShoeTglTerima: '2024-09-05',
      tahunJatah: 2024,
      tanggalPermintaan: '2024-09-10',
      catatan: 'Permintaan tambahan - jatah habis',
      dibebankanKeSOProject: 'SO-2024-001',
      hrdSyncStatus: 'Pending'
    }
  ]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalPersonil = apdData.length;
    const coverallExcess = apdData.filter(item => item.coverallSisaJatah < 0).length;
    const safetyShoeExcess = apdData.filter(item => item.safetyShoeSisaJatah < 0).length;
    const needsProcessing = apdData.filter(item => 
      item.coverallStatus === 'Pengajuan' || item.coverallStatus === 'Proses' ||
      item.safetyShoeStatus === 'Pengajuan' || item.safetyShoeStatus === 'Proses'
    ).length;
    const hrdSyncPending = apdData.filter(item => item.hrdSyncStatus === 'Pending' || item.hrdSyncStatus === 'Failed').length;
    const completed = apdData.filter(item => 
      item.coverallStatus === 'Selesai' && item.safetyShoeStatus === 'Selesai'
    ).length;
    const hasBAKerusakan = apdData.filter(item => 
      item.coverallDocumentBA || item.safetyShoeDocumentBA
    ).length;

    return {
      totalPersonil,
      coverallExcess,
      safetyShoeExcess,
      needsProcessing,
      hrdSyncPending,
      completed,
      hasBAKerusakan
    };
  }, [apdData]);

  // Filter data
  const filteredData = useMemo(() => {
    return apdData.filter(item => {
      const matchesSearch = item.namaPersonil.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.no.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !filterStatus || 
        item.coverallStatus === filterStatus || item.safetyShoeStatus === filterStatus;
      const matchesTahun = !filterTahun || item.tahunJatah.toString() === filterTahun;

      return matchesSearch && matchesStatus && matchesTahun;
    });
  }, [apdData, searchTerm, filterStatus, filterTahun]);

  const getStatusBadge = (status: string, type: 'proses' | 'sync' | 'quota') => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    if (type === 'quota') {
      if (status === 'excess') return `${baseClasses} bg-red-100 text-red-800`;
      if (status === 'exhausted') return `${baseClasses} bg-orange-100 text-orange-800`;
      return `${baseClasses} bg-green-100 text-green-800`;
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

  const getQuotaStatus = (sisaJatah: number) => {
    if (sisaJatah < 0) return 'excess';
    if (sisaJatah === 0) return 'exhausted';
    return 'available';
  };

  const formatQuotaText = (sisaJatah: number) => {
    if (sisaJatah < 0) return `Kelebihan ${Math.abs(sisaJatah)}`;
    if (sisaJatah === 0) return 'Jatah Habis';
    return `Sisa ${sisaJatah}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Alat Pelindung Diri (APD)</h1>
        </div>
        <p className="text-gray-600">Manajemen APD personil dengan tracking terpisah Coverall dan Safety Shoes</p>
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
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Coverall Excess</p>
              <p className="text-2xl font-bold text-gray-900">{stats.coverallExcess}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Safety Shoe Excess</p>
              <p className="text-2xl font-bold text-gray-900">{stats.safetyShoeExcess}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Needs Processing</p>
              <p className="text-2xl font-bold text-gray-900">{stats.needsProcessing}</p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">BA Kerusakan</p>
              <p className="text-2xl font-bold text-gray-900">{stats.hasBAKerusakan}</p>
            </div>
            <FileText className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">HRD Sync Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.hrdSyncPending}</p>
            </div>
            <ExternalLink className="h-8 w-8 text-yellow-500" />
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

      {/* APD Quota Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Jatah Tahunan APD</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span><strong>Coverall:</strong> 2 unit per personil per tahun</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span><strong>Safety Shoes:</strong> 1 pasang per personil per tahun</span>
          </div>
        </div>
        <p className="text-xs text-blue-700 mt-2">
          * Permintaan melebihi jatah akan dibebankan ke SO Project
        </p>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Cari nama personil atau nomor..."
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
                Tambah APD
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                <select
                  value={filterTahun}
                  onChange={(e) => setFilterTahun(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Semua Tahun</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilterStatus('');
                    setFilterTahun('');
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No & Personil</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">🧥 Coverall</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">👟 Safety Shoes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Terima</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
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
                          <div className="text-sm font-medium text-gray-900">{item.no}</div>
                          <div className="text-sm text-gray-500">{item.namaPersonil}</div>
                          <div className="text-xs text-gray-400">Tahun: {item.tahunJatah}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{item.coverallJumlah} unit</span>
                          <span className={getStatusBadge(getQuotaStatus(item.coverallSisaJatah), 'quota')}>
                            {formatQuotaText(item.coverallSisaJatah)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">Size: {item.coverallSize || '-'}</div>
                        <div className="flex items-center gap-1">
                          <span className={getStatusBadge(item.coverallStatus, 'proses')}>{item.coverallStatus}</span>
                          {item.coverallDocumentBA && <FileText className="h-3 w-3 text-green-500" />}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{item.safetyShoeJumlah} pasang</span>
                          <span className={getStatusBadge(getQuotaStatus(item.safetyShoeSisaJatah), 'quota')}>
                            {formatQuotaText(item.safetyShoeSisaJatah)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">Size: {item.safetyShoeSize || '-'}</div>
                        <div className="flex items-center gap-1">
                          <span className={getStatusBadge(item.safetyShoeStatus, 'proses')}>{item.safetyShoeStatus}</span>
                          {item.safetyShoeDocumentBA && <FileText className="h-3 w-3 text-green-500" />}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">Coverall:</span>
                        </div>
                        <div className="text-xs text-gray-900">{item.coverallTglTerima || '-'}</div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">Safety Shoes:</span>
                        </div>
                        <div className="text-xs text-gray-900">{item.safetyShoeTglTerima || '-'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-gray-600 max-w-32 truncate" title={item.catatan}>
                        {item.catatan || '-'}
                      </div>
                      {item.dibebankanKeSOProject && (
                        <div className="text-xs text-orange-600 mt-1">
                          SO: {item.dibebankanKeSOProject}
                        </div>
                      )}
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
                          title="View Documents"
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
            setApdData(prev => prev.filter(item => item.id !== deleteItem.id));
            setDeleteItem(null);
          }}
          title="Hapus Data APD"
          message={`Apakah Anda yakin ingin menghapus data APD untuk "${deleteItem.namaPersonil}"?`}
        />
      )}
    </div>
  );
};

export default QHSEAlatPelindungDiriDashboard;
