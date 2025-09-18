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
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [formData, setFormData] = useState<Partial<AlatUkurItem>>({});

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

  // CRUD Functions
  const openAddModal = () => {
    setFormData({
      namaAlat: '',
      spec: '',
      merkAlat: '',
      tipeAlat: '',
      snAlat: '',
      noSeriAlat: '',
      tahunPembelian: new Date().getFullYear(),
      posisiAlat: 'Office',
      statusAlat: 'QC Passed',
      tanggalKalibrasi: '',
      tanggalExpiredKalibrasi: '',
      vendorKalibrasi: '',
      statusProses: 'Pengajuan'
    });
    setModalMode('add');
    setShowAddModal(true);
  };

  const openEditModal = (item: AlatUkurItem) => {
    setFormData(item);
    setEditingItem(item);
    setModalMode('edit');
    setShowAddModal(true);
  };

  const openViewModal = (item: AlatUkurItem) => {
    setFormData(item);
    setEditingItem(item);
    setModalMode('view');
    setShowAddModal(true);
  };

  const handleInputChange = (field: keyof AlatUkurItem, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (modalMode === 'add') {
      const newId = (Math.max(...alatUkurData.map(item => parseInt(item.id))) + 1).toString();
      const newItem: AlatUkurItem = {
        ...formData as AlatUkurItem,
        id: newId
      };
      
      // Calculate expiry days
      if (newItem.tanggalExpiredKalibrasi) {
        const today = new Date();
        const expiryDate = new Date(newItem.tanggalExpiredKalibrasi);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        newItem.daysUntilExpiry = diffDays;
        newItem.isExpiringSoon = diffDays <= 60;
      }
      
      setAlatUkurData(prev => [...prev, newItem]);
    } else if (modalMode === 'edit' && editingItem) {
      const updatedItem = { ...formData as AlatUkurItem, id: editingItem.id };
      
      // Calculate expiry days
      if (updatedItem.tanggalExpiredKalibrasi) {
        const today = new Date();
        const expiryDate = new Date(updatedItem.tanggalExpiredKalibrasi);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        updatedItem.daysUntilExpiry = diffDays;
        updatedItem.isExpiringSoon = diffDays <= 60;
      }
      
      setAlatUkurData(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
    }
    
    setShowAddModal(false);
    setEditingItem(null);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingItem(null);
    setFormData({});
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100 mb-6">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Settings className="h-8 w-8 text-blue-600" />
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide">
                  MONITORING DAFTAR ALAT UKUR
                </h1>
              </div>
              <nav className="text-sm text-gray-600">
                <span>Dashboard</span> <span className="mx-2">›</span>
                <span>QHSE</span> <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Monitoring Daftar Alat Ukur</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Cari nama alat, spec, merk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>

            <div className="flex gap-2">
              {/* Export Buttons */}
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="h-4 w-4" />
                Excel
              </button>
              
              {/* Add Button */}
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                Add Equipment
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status QC</label>
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
        </div>

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
                          onClick={() => openViewModal(item)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          className="text-orange-600 hover:text-orange-900"
                          title="Upload Certificate"
                        >
                          <Upload className="h-4 w-4" />
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

      {/* Modal Form */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {modalMode === 'add' ? 'Add New Equipment' : modalMode === 'edit' ? 'Edit Equipment' : 'View Equipment'}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Alat</label>
                    <input
                      type="text"
                      value={formData.namaAlat || ''}
                      onChange={(e) => handleInputChange('namaAlat', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="Digital Multimeter"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specification</label>
                    <input
                      type="text"
                      value={formData.spec || ''}
                      onChange={(e) => handleInputChange('spec', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="AC/DC Voltage 1000V"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Merk Alat</label>
                    <input
                      type="text"
                      value={formData.merkAlat || ''}
                      onChange={(e) => handleInputChange('merkAlat', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="Fluke"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Alat</label>
                    <input
                      type="text"
                      value={formData.tipeAlat || ''}
                      onChange={(e) => handleInputChange('tipeAlat', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="87V"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SN Alat</label>
                    <input
                      type="text"
                      value={formData.snAlat || ''}
                      onChange={(e) => handleInputChange('snAlat', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="FLK-001"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No Seri Alat</label>
                    <input
                      type="text"
                      value={formData.noSeriAlat || ''}
                      onChange={(e) => handleInputChange('noSeriAlat', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="2024001"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Pembelian</label>
                    <input
                      type="number"
                      value={formData.tahunPembelian || ''}
                      onChange={(e) => handleInputChange('tahunPembelian', parseInt(e.target.value))}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="2024"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Posisi Alat</label>
                    <select
                      value={formData.posisiAlat || 'Office'}
                      onChange={(e) => handleInputChange('posisiAlat', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="Office">Office</option>
                      <option value="Project">Project</option>
                      <option value="Medco Corridor">Medco Corridor</option>
                      <option value="Medco SSB">Medco SSB</option>
                      <option value="PHE ONWJ">PHE ONWJ</option>
                      <option value="Kalibrasi">Kalibrasi</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Status & Calibration */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Status & Calibration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status QC</label>
                    <select
                      value={formData.statusAlat || 'QC Passed'}
                      onChange={(e) => handleInputChange('statusAlat', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="QC Passed">QC Passed</option>
                      <option value="Quarantine">Quarantine</option>
                      <option value="QC Failed">QC Failed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status Proses</label>
                    <select
                      value={formData.statusProses || 'Pengajuan'}
                      onChange={(e) => handleInputChange('statusProses', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="Pengajuan">Pengajuan</option>
                      <option value="Proses">Proses</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kalibrasi</label>
                    <input
                      type="date"
                      value={formData.tanggalKalibrasi || ''}
                      onChange={(e) => handleInputChange('tanggalKalibrasi', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Expired Kalibrasi</label>
                    <input
                      type="date"
                      value={formData.tanggalExpiredKalibrasi || ''}
                      onChange={(e) => handleInputChange('tanggalExpiredKalibrasi', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Kalibrasi</label>
                    <input
                      type="text"
                      value={formData.vendorKalibrasi || ''}
                      onChange={(e) => handleInputChange('vendorKalibrasi', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="PT Kalibrasi Indonesia"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {modalMode === 'view' ? 'Close' : 'Cancel'}
              </button>
              {modalMode !== 'view' && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {modalMode === 'add' ? 'Add Equipment' : 'Update Equipment'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QHSEDaftarAlatUkurDashboard;
