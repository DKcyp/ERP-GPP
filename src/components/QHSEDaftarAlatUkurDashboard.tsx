import React, { useMemo, useState } from 'react';
import { Settings, Search, PlusCircle, Download, FileText, Pencil, Trash2, AlertTriangle, Calendar, Bell, Upload, Eye, CheckCircle, Clock, XCircle, MapPin, Filter } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface AlatUkurItem {
  id: string;
  namaAlat: string;
  spec: string;
  merkAlat: string;
  tipeAlat: string;
  snAlat: string;
  noSeriAlat: string;
  tahunPembelian: number;
  posisiAlat: 'Office' | 'Project' | 'Medco Corridor' | 'Medco SSB' | 'PHE ONWJ' | 'Kalibrasi' | 'Lainnya';
  statusAlat: 'QC Passed' | 'Quarantine' | 'QC Failed';
  tanggalKalibrasi: string;
  tanggalExpiredKalibrasi: string;
  vendorKalibrasi: string;
  documentSertifikat?: string;
  statusProses: 'Pengajuan' | 'Proses' | 'Selesai';
  daysUntilExpiry?: number;
  isExpiringSoon?: boolean;
}

const QHSEDaftarAlatUkurDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPosisi, setFilterPosisi] = useState<string>('');
  const [filterProses, setFilterProses] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AlatUkurItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<AlatUkurItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Sample data with calculated expiry days
  const [alatUkurData, setAlatUkurData] = useState<AlatUkurItem[]>([
    {
      id: '1',
      namaAlat: 'Digital Multimeter',
      spec: 'AC/DC Voltage 1000V',
      merkAlat: 'Fluke',
      tipeAlat: '87V',
      snAlat: 'FLK-001',
      noSeriAlat: '2024001',
      tahunPembelian: 2023,
      posisiAlat: 'Office',
      statusAlat: 'QC Passed',
      tanggalKalibrasi: '2024-06-01',
      tanggalExpiredKalibrasi: '2025-06-01',
      vendorKalibrasi: 'PT Kalibrasi Indonesia',
      documentSertifikat: 'cert_fluke_2024.pdf',
      statusProses: 'Selesai',
      daysUntilExpiry: 258,
      isExpiringSoon: false
    },
    {
      id: '2',
      namaAlat: 'Pressure Gauge',
      spec: '0-100 PSI',
      merkAlat: 'Wika',
      tipeAlat: 'Model 232.53',
      snAlat: 'WIK-002',
      noSeriAlat: '2024002',
      tahunPembelian: 2022,
      posisiAlat: 'Project',
      statusAlat: 'QC Passed',
      tanggalKalibrasi: '2024-08-15',
      tanggalExpiredKalibrasi: '2024-11-15',
      vendorKalibrasi: 'PT Instrumentasi Teknik',
      statusProses: 'Selesai',
      daysUntilExpiry: 30,
      isExpiringSoon: true
    },
    {
      id: '3',
      namaAlat: 'Temperature Sensor',
      spec: '-50°C to +200°C',
      merkAlat: 'Omega',
      tipeAlat: 'RTD PT100',
      snAlat: 'OMG-003',
      noSeriAlat: '2024003',
      tahunPembelian: 2024,
      posisiAlat: 'Medco Corridor',
      statusAlat: 'Quarantine',
      tanggalKalibrasi: '2024-03-01',
      tanggalExpiredKalibrasi: '2024-12-01',
      vendorKalibrasi: 'PT Omega Indonesia',
      statusProses: 'Proses',
      daysUntilExpiry: 15,
      isExpiringSoon: true
    }
  ]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalAlat = alatUkurData.length;
    const qcPassed = alatUkurData.filter(item => item.statusAlat === 'QC Passed').length;
    const quarantine = alatUkurData.filter(item => item.statusAlat === 'Quarantine').length;
    const qcFailed = alatUkurData.filter(item => item.statusAlat === 'QC Failed').length;
    const expiringSoon = alatUkurData.filter(item => item.isExpiringSoon).length;
    const needsCalibration = alatUkurData.filter(item => (item.daysUntilExpiry || 0) <= 60).length;

    return {
      totalAlat,
      qcPassed,
      quarantine,
      qcFailed,
      expiringSoon,
      needsCalibration
    };
  }, [alatUkurData]);

  // Filter data
  const filteredData = useMemo(() => {
    return alatUkurData.filter(item => {
      const matchesSearch = 
        item.namaAlat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.spec.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.merkAlat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tipeAlat.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !filterStatus || item.statusAlat === filterStatus;
      const matchesPosisi = !filterPosisi || item.posisiAlat === filterPosisi;
      const matchesProses = !filterProses || item.statusProses === filterProses;

      return matchesSearch && matchesStatus && matchesPosisi && matchesProses;
    });
  }, [alatUkurData, searchTerm, filterStatus, filterPosisi, filterProses]);

  const getStatusBadge = (status: string, type: 'alat' | 'proses') => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    if (type === 'alat') {
      switch (status) {
        case 'QC Passed': return `${baseClasses} bg-green-100 text-green-800`;
        case 'Quarantine': return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case 'QC Failed': return `${baseClasses} bg-red-100 text-red-800`;
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
          <Settings className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Daftar Alat Ukur</h1>
        </div>
        <p className="text-gray-600">Monitoring dan manajemen alat ukur perusahaan, status QC, dan kalibrasi</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Alat</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAlat}</p>
            </div>
            <Settings className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">QC Passed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.qcPassed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quarantine</p>
              <p className="text-2xl font-bold text-gray-900">{stats.quarantine}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">QC Failed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.qcFailed}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">{stats.expiringSoon}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Need Calibration</p>
              <p className="text-2xl font-bold text-gray-900">{stats.needsCalibration}</p>
            </div>
            <Bell className="h-8 w-8 text-purple-500" />
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
                placeholder="Cari nama alat, spec, merk, tipe..."
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
                <Filter className="h-4 w-4" />
                Filter
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                Tambah Alat
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Alat</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Semua Status</option>
                  <option value="QC Passed">QC Passed</option>
                  <option value="Quarantine">Quarantine</option>
                  <option value="QC Failed">QC Failed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Posisi Alat</label>
                <select
                  value={filterPosisi}
                  onChange={(e) => setFilterPosisi(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Semua Posisi</option>
                  <option value="Office">Office</option>
                  <option value="Project">Project</option>
                  <option value="Medco Corridor">Medco Corridor</option>
                  <option value="Medco SSB">Medco SSB</option>
                  <option value="PHE ONWJ">PHE ONWJ</option>
                  <option value="Kalibrasi">Kalibrasi</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Proses</label>
                <select
                  value={filterProses}
                  onChange={(e) => setFilterProses(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Semua Proses</option>
                  <option value="Pengajuan">Pengajuan</option>
                  <option value="Proses">Proses</option>
                  <option value="Selesai">Selesai</option>
                </select>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Alat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spec</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merk/Tipe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SN/No Seri</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status QC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kalibrasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Proses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.namaAlat}</div>
                      <div className="text-sm text-gray-500">Tahun: {item.tahunPembelian}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.spec}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.merkAlat}</div>
                      <div className="text-sm text-gray-500">{item.tipeAlat}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.snAlat}</div>
                      <div className="text-sm text-gray-500">{item.noSeriAlat}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{item.posisiAlat}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(item.statusAlat, 'alat')}>{item.statusAlat}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.tanggalExpiredKalibrasi}</div>
                      <div className="flex items-center gap-1">
                        <span className={getExpiryBadge(item.daysUntilExpiry || 0)}>
                          {formatExpiryText(item.daysUntilExpiry || 0)}
                        </span>
                        {item.isExpiringSoon && <Bell className="h-4 w-4 text-orange-500" />}
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
            setAlatUkurData(prev => prev.filter(item => item.id !== deleteItem.id));
            setDeleteItem(null);
          }}
          title="Hapus Alat Ukur"
          message={`Apakah Anda yakin ingin menghapus alat ukur "${deleteItem.namaAlat}"?`}
        />
      )}
    </div>
  );
};

export default QHSEDaftarAlatUkurDashboard;
